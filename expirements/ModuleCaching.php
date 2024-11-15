<?php
class PostCacheManager
{
    private $cache_key = 'all_posts_cache';
    private $cache_expiration = 3600;  // 1 hour in seconds

    /**
     * Get all posts with their essential data
     */
    public function get_all_posts($args = [])
    {
        // Try to get cached data first
        $cached_posts = get_transient($this->cache_key);

        if (false === $cached_posts) {
            // Set default query arguments
            $default_args = [
                'post_type' => ['post', 'project'],
                'posts_per_page' => -1,
                'post_status' => 'publish',
                'has_password' => false,
                'orderby' => 'date',
                'order' => 'DESC'
            ];

            // Merge default args with custom args
            $query_args = wp_parse_args($args, $default_args);

            // Query posts
            $query = new WP_Query($query_args);
            $posts = [];

            if ($query->have_posts()) {
                while ($query->have_posts()) {
                    $query->the_post();
                    $post_id = get_the_ID();

                    // Get featured image
                    $image_id = get_post_thumbnail_id();
                    $image_data = wp_get_attachment_image_src($image_id, 'medium_large');
                    $image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true) ?: get_the_title();

                    // Get categories and tags
                    $categories = [];
                    $post_categories = get_the_category();
                    foreach ($post_categories as $category) {
                        $categories[] = [
                            'name' => $category->name,
                            'slug' => $category->slug,
                            'id' => $category->term_id
                        ];
                    }

                    $tags = [];
                    $post_tags = get_the_tags();
                    if ($post_tags) {
                        foreach ($post_tags as $tag) {
                            $tags[] = [
                                'name' => $tag->name,
                                'slug' => $tag->slug,
                                'id' => $tag->term_id
                            ];
                        }
                    }

                    // Build post data array
                    $posts[] = [
                        'id' => $post_id,
                        'title' => get_the_title(),
                        'excerpt' => wp_trim_words(get_the_excerpt(), 40),
                        'url' => get_permalink(),
                        'date' => [
                            'raw' => get_the_date('Y-m-d'),
                            'formatted' => get_the_date('d M Y'),
                            'year' => get_the_date('Y'),
                            'month' => get_the_date('M')
                        ],
                        'image' => [
                            'url' => $image_data ? $image_data[0] : '',
                            'width' => $image_data ? $image_data[1] : '',
                            'height' => $image_data ? $image_data[2] : '',
                            'alt' => $image_alt
                        ],
                        'categories' => $categories,
                        'tags' => $tags,
                        'post_type' => get_post_type()
                    ];
                }
                wp_reset_postdata();
            }

            // Cache the posts
            set_transient($this->cache_key, $posts, $this->cache_expiration);
            $cached_posts = $posts;
        }

        return $cached_posts;
    }

    /**
     * Filter posts by search term and/or category
     */
    public function filter_posts($posts, $search = '', $category = '', $limit = 4)
    {
        $filtered_posts = [];
        $count = 0;

        foreach ($posts as $post) {
            $matches_search = empty($search) ||
                stripos($post['title'], $search) !== false ||
                stripos($post['excerpt'], $search) !== false;

            $matches_category = empty($category) ||
                array_search($category, array_column($post['categories'], 'slug')) !== false;

            if ($matches_search && $matches_category) {
                $filtered_posts[] = $post;
                $count++;

                if ($limit > 0 && $count >= $limit) {
                    break;
                }
            }
        }

        return $filtered_posts;
    }

    /**
     * Clear the posts cache
     */
    public function clear_cache()
    {
        delete_transient($this->cache_key);
    }
}

// Initialize the cache manager
function init_post_cache_manager()
{
    global $post_cache_manager;
    $post_cache_manager = new PostCacheManager();

    // Clear cache when posts are modified
    add_action('save_post', [$post_cache_manager, 'clear_cache']);
    add_action('delete_post', [$post_cache_manager, 'clear_cache']);
    add_action('wp_update_nav_menu', [$post_cache_manager, 'clear_cache']);
    add_action('create_term', [$post_cache_manager, 'clear_cache']);
    add_action('edit_term', [$post_cache_manager, 'clear_cache']);
    add_action('delete_term', [$post_cache_manager, 'clear_cache']);
}

add_action('init', 'init_post_cache_manager');

// Example shortcode using the cache manager
function cached_posts_shortcode($atts)
{
    global $post_cache_manager;

    $atts = shortcode_atts([
        'category' => '',
        'limit' => 4,
        'template' => 'grid'  // grid or list
    ], $atts);

    // Get cached posts
    $all_posts = $post_cache_manager->get_all_posts();
    $filtered_posts = $post_cache_manager->filter_posts(
        $all_posts,
        '',
        $atts['category'],
        $atts['limit']
    );

    // Add JavaScript for client-side caching
    wp_enqueue_script('posts-cache', get_template_directory_uri() . '/js/posts-cache.js', [], '1.0', true);
    wp_localize_script('posts-cache', 'postsData', [
        'posts' => $filtered_posts,
        'nonce' => wp_create_nonce('posts_cache_nonce')
    ]);

    // Generate HTML output
    ob_start();
    if (!empty($filtered_posts)):
?>
<div class="posts-grid <?php echo esc_attr($atts['template']); ?>">
    <?php foreach ($filtered_posts as $post): ?>
    <article class="post-item">
        <?php if (!empty($post['image']['url'])): ?>
        <div class="post-thumbnail">
            <img src="<?php echo esc_url($post['image']['url']); ?>"
                alt="<?php echo esc_attr($post['image']['alt']); ?>"
                width="<?php echo esc_attr($post['image']['width']); ?>"
                height="<?php echo esc_attr($post['image']['height']); ?>" loading="lazy">
        </div>
        <?php endif; ?>

        <div class="post-content">
            <time datetime="<?php echo esc_attr($post['date']['raw']); ?>">
                <?php echo esc_html($post['date']['formatted']); ?>
            </time>

            <h2 class="post-title">
                <a href="<?php echo esc_url($post['url']); ?>">
                    <?php echo esc_html($post['title']); ?>
                </a>
            </h2>

            <div class="post-excerpt">
                <?php echo esc_html($post['excerpt']); ?>
            </div>

            <?php if (!empty($post['categories'])): ?>
            <div class="post-categories">
                <?php foreach ($post['categories'] as $category): ?>
                <span class="category-<?php echo esc_attr($category['slug']); ?>">
                    <?php echo esc_html($category['name']); ?>
                </span>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
        </div>
    </article>
    <?php endforeach; ?>
</div>
<?php
    endif;

    return ob_get_clean();
}

add_shortcode('cached_posts', 'cached_posts_shortcode');
