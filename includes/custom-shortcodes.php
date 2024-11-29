<?php
function get_custom_excerpt($content, $word_count)
{
    $trimmed_content = wp_trim_words($content, $word_count);
    return $trimmed_content;
}

/**
 * Shortcode to display related pages based on a search term.
 *
 * @param array $atts Shortcode attributes.
 * @return string HTML output of related pages.
 *
 * Sample usage:
 * [related_pages search_term="example" number_of_pages_list="4" excerpt_length="10" orderby="date"]
 */
function related_pages_shortcode($atts)
{
    // Extract shortcode attributes
    $atts = shortcode_atts([
        'search_term' => '',
        'number_of_pages_list' => 4,
        'excerpt_length' => 10,
        'orderby' => ['date', 'rand']
    ], $atts, 'related_pages');

    // Sanitize inputs
    $search_term = sanitize_text_field($atts['search_term']);
    $number_of_pages_list = absint($atts['number_of_pages_list']);
    $current_post_id = get_the_ID();
    $excerpt_length = absint($atts['excerpt_length']);
    $orderby = $atts['orderby'];

    // Setup query arguments
    $args = [
        's' => $search_term,
        'post_type' => ['post', 'page'],
        'post_status' => 'publish',
        'posts_per_page' => $number_of_pages_list,
        'orderby' => $orderby,
        'order' => 'DESC',
        'has_password' => false,
        'post__not_in' => [$current_post_id],  // Exclude current post
        'meta_query' => [
            [
                'key' => '_thumbnail_id',
                'compare' => 'EXISTS'
            ]
        ]
    ];

    // Run the query
    $related_query = new WP_Query($args);

    // Start output buffering
    ob_start();

    if ($related_query->have_posts()) {
        echo '<aside class="related-pages">';
        while ($related_query->have_posts()) {
            $related_query->the_post();

            $image_id = get_post_thumbnail_id();
            $image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);

            if (empty($image_alt)) {
                $image_alt = get_the_title();
            }

            $image_src = wp_get_attachment_image_src($image_id, 'medium_large');
            ?>
<a href="<?php the_permalink(); ?>" target="_blank" rel="noopener noreferrer">
    <article class="related-page">
        <div class="related-page-image">
            <img src="<?php echo esc_url($image_src[0]); ?>" alt="<?php echo esc_attr($image_alt); ?>"
                width="<?php echo esc_attr($image_src[1]); ?>" height="<?php echo esc_attr($image_src[2]); ?>"
                loading="lazy" fetchpriority="high">
        </div>
        <h1 class="related-page-title"><?php the_title(); ?></h1>
        <!-- <div class="related-page-excerpt">
            <?php echo get_custom_excerpt(get_the_excerpt(), $excerpt_length); ?>
        </div> -->
    </article>
</a>
<?php
        }
        echo '</aside>';
    }

    wp_reset_postdata();

    return ob_get_clean();
}

/**
 * Shortcode to get the latest post details from a specific category.
 *
 * @param array $atts Shortcode attributes.
 * @return string HTML output of the latest post details.
 *
 * Sample usage:
 * [get_recent_post_item category="hong-kong-law" posts_per_page="1" include_thumbnail="yes"]
 */
function get_latest_post_details($atts)
{
    // Define and sanitize shortcode attributes
    $atts = shortcode_atts(array(
        'category' => 'hong-kong-law',  // Default category
        'posts_per_page' => 1,  // Default number of posts
        'include_thumbnail' => 'yes'  // Default to include thumbnail
    ), $atts, 'get_recent_post_item');

    $category = sanitize_text_field($atts['category']);
    $posts_per_page = intval($atts['posts_per_page']);
    $include_thumbnail = strtolower($atts['include_thumbnail']) === 'yes' ? true : false;

    // Check if the category name contains special characters
    if (!ctype_alnum(str_replace(['-', '_'], '', $category))) {
        // Get the term ID by name (this assumes the category exists)
        $term = get_term_by('name', $category, 'category');
        if ($term) {
            $category_slug = $term->slug;
        } else {
            return '<p>Category not found.</p>';
        }
    } else {
        // Assume it's a slug
        $category_slug = $category;
    }

    // Prepare query arguments for WP_Query
    $query_args = array(
        'posts_per_page' => $posts_per_page,  // Number of posts to retrieve
        'post_status' => 'publish',  // Only published posts
        'has_password' => false,  // Exclude password-protected posts
        'category_name' => $category_slug  // Filter posts by category
    );

    // Execute the query to get the latest posts
    $latest_posts = new WP_Query($query_args);

    // Initialize output
    $output = '';

    // Check if there are posts
    if ($latest_posts->have_posts()) {
        // Loop through the posts
        while ($latest_posts->have_posts()) {
            $latest_posts->the_post();

            // Get the post details
            $post_title = get_the_title();
            $post_excerpt = get_the_excerpt();
            $post_url = get_permalink();
            $post_thumbnail = '';

            // Check if thumbnail should be included
            if ($include_thumbnail) {
                $post_thumbnail = get_the_post_thumbnail(get_the_ID(), 'full');
            }

            // Create the output for each post
            $output .= '<div class="latest-post">';
            $output .= '<h2 class="text-white">' . esc_html($post_title) . '</h2>';

            // Output the thumbnail if included
            if ($include_thumbnail && $post_thumbnail) {
                $output .= '<div class="post-thumbnail">' . $post_thumbnail . '</div>';
            }

            $output .= '<div class="post-excerpt text-white mb-3">' . $post_excerpt . '</div>';
            $output .= '<div class="cta_wrapper"><a href="' . esc_url($post_url) . '" class="cta_btn_link white-cta" aria-label="Read full article on ' . esc_attr($post_title) . '">Read More ›</a></div>';
            $output .= '</div>';
        }

        // Reset Post Data
        wp_reset_postdata();
    } else {
        // If no posts were found, return a message
        $output = '<p>No posts found.</p>';
    }

    return $output;
}

/**
 * Shortcode to get post details by URL.
 *
 * @param array $atts Shortcode attributes.
 * @return string HTML output of the post details.
 *
 * Sample usage:
 * [get_post_url url="https://example.com/sample-post" include_thumbnail="yes"]
 */
function get_post_details_by_url($atts)
{
    // Define and sanitize shortcode attributes
    $atts = shortcode_atts(array(
        'url' => '',  // Default URL is empty
        'include_thumbnail' => 'yes'  // Default to include thumbnail
    ), $atts, 'get_post_details_by_url');

    $url = esc_url_raw($atts['url']);
    $include_thumbnail = strtolower($atts['include_thumbnail']) === 'yes' ? true : false;

    if (empty($url)) {
        return '<p>No URL provided.</p>';
    }

    // Get the post ID by URL
    $post_id = url_to_postid($url);
    if (!$post_id) {
        return '<p>Invalid URL or post not found.</p>';
    }

    // Get the post details
    $post = get_post($post_id);
    if (!$post || $post->post_status !== 'publish' || post_password_required($post)) {
        return '<p>Post not found or is not accessible.</p>';
    }

    // Check if the post has a featured image
    if ($include_thumbnail && !has_post_thumbnail($post_id)) {
        return '';  // Return empty string to exclude post without featured image
    }

    // Initialize output
    $output = '';

    // Get the post title, excerpt, and permalink
    $post_title = get_the_title($post);
    $post_excerpt = get_the_excerpt($post);
    $post_url = get_permalink($post);
    $post_thumbnail = '';

    // Get the post thumbnail if included
    if ($include_thumbnail) {
        $thumbnail_id = get_post_thumbnail_id($post_id);
        $thumbnail_src = wp_get_attachment_image_src($thumbnail_id, 'full');
        if ($thumbnail_src) {
            $post_thumbnail = '<img src="' . esc_url($thumbnail_src[0]) . '" alt="' . esc_attr($post_title) . '" loading="lazy" decoding="async">';
        }
    }

    // Create the output for the post
    $output .= '<a href="' . esc_url($post_url) . '" target="_blank" class="post_wrapper relative" data-url="' . esc_url($post_url) . '">';
    // Output the thumbnail if included
    if ($include_thumbnail && $post_thumbnail) {
        $output .= '<div class="post-thumbnail">' . $post_thumbnail . '</div>';
    }
    $output .= '<h2 class="navmenu_card_title text-white">' . esc_html($post_title) . '</h2>';
    $output .= '<div class="navmenu_card_cta uppercase">Find out more</div>';
    $output .= '</a>';

    return $output;
}

/**
 * Shortcode to display a custom search form.
 *
 * @return string HTML output of the custom search form.
 *
 * Sample usage:
 * [custom_search_form]
 */
function custom_search_form_shortcode()
{
    ob_start();
    ?>
<div class="search_wrapper relative d-none">
    <form role="search" method="get" action="<?php echo esc_url(home_url('/')); ?>" class="custom-search-form">
        <input type="search" name="s" id="search-input" placeholder="Search..."
            value="<?php echo get_search_query(); ?>" autocomplete="off">
        <input type="hidden" name="section" value="site">
        <input type="submit" value="Search" class="submit">
        <input type="button" value="Close" id="close_search" class="close-search-btn">
    </form>
    <div class="search_matches_wrapper" style="display:none;">
        <ul class="search-results-list"></ul>
    </div>
</div>
<?php
    return ob_get_clean();
}

function ajax_search()
{
    $search_query = sanitize_text_field($_POST['search']);
    $category = isset($_POST['category']) ? sanitize_text_field($_POST['category']) : '';

    $args = [
        's' => $search_query,
        'post_type' => 'post',  // Include both posts and pages
        'posts_per_page' => 4,
        'post_status' => 'publish',  // Only include published posts
        'post_password' => '',  // Exclude password-protected posts
    ];

    if (!empty($category)) {
        $args['category_name'] = $category;  // Add category filter if provided
    }

    $search_query = new WP_Query($args);

    if ($search_query->have_posts()):
        while ($search_query->have_posts()):
            $search_query->the_post();
            if (!post_password_required()):  // Exclude password-protected posts
                ?>
<li>
    <a href="<?php the_permalink(); ?>">
        <div class="thumbnail">
            <?php if (has_post_thumbnail()):
                the_post_thumbnail('thumbnail');
            else: ?>
            <img src="<?php echo get_template_directory_uri(); ?>/path/to/default-image.jpg" alt="Default Thumbnail">
            <?php endif; ?>
        </div>
        <div class="title">
            <?php the_title(); ?>
        </div>
    </a>
</li>
<?php
            endif;
        endwhile;
    else:
        echo '<li class="text-white">No results found</li>';
    endif;
    wp_reset_postdata();
    die();
}

function ajax_latest_posts()
{
    $args = [
        'post_type' => 'post',  // Include both posts and pages
        'posts_per_page' => 3,
        'orderby' => 'date',
        'order' => 'DESC'
    ];
    $latest_posts = new WP_Query($args);

    if ($latest_posts->have_posts()):
        while ($latest_posts->have_posts()):
            $latest_posts->the_post();
            ?>
<li>
    <a href="<?php the_permalink(); ?>">
        <div class="thumbnail">
            <?php if (has_post_thumbnail()):
                the_post_thumbnail('thumbnail');
            else: ?>
            <img src="<?php echo get_template_directory_uri(); ?>/path/to/default-image.jpg" alt="Default Thumbnail">
            <?php endif; ?>
        </div>
        <div class="title">
            <?php the_title(); ?>
        </div>
    </a>
</li>
<?php
        endwhile;
    else:
        echo '<li>No latest posts found</li>';
    endif;
    wp_reset_postdata();
    die();
}

function get_recent_news_posts($atts)
{
    // Extract shortcode attributes
    $atts = shortcode_atts(
        [
            'post_type' => 'post',
            'category' => 'news',
            'num_posts' => 5,
        ],
        $atts,
        'get_recent_news_posts'
    );

    // Set up WP_Query arguments
    $args = [
        'post_type' => $atts['post_type'],
        'category_name' => $atts['category'],
        'posts_per_page' => $atts['num_posts']
    ];

    // Create a new WP_Query instance
    $query = new WP_Query($args);

    // Generate the HTML string
    $output = '';
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();
            $post_title = get_the_title();
            $post_url = get_permalink();
            $post_date = date_i18n('d M Y', strtotime(get_the_date()));
            $post_excerpt = wp_strip_all_tags(get_the_excerpt());
            $post_feat_img = get_the_post_thumbnail_url($post_id, 'full');

            $output .= '<article class="featured_new_post grid gap-2">';
            $output .= '<div class="featured_new_post_img">';
            $output .= '<img src="' . esc_url($post_feat_img) . '" alt="image of a news ' . esc_attr($post_title) . '" width="500" height="500" />';
            $output .= '</div>';
            $output .= '<div class="featured_new_post_content flex item-center flex-col justify-center">';
            $output .= '<div class="date_container fw-regular">' . esc_html($post_date) . '</div>';
            $output .= '<a href="' . esc_url($post_url) . '" aria-label="' . esc_attr($post_title) . '">';
            $output .= '<h2>' . esc_html($post_title) . '</h2>';
            $output .= '</a>';
            $output .= '<p class="fw-regular">' . esc_html($post_excerpt) . '</p>';
            $output .= '</div>';
            $output .= '</article>';
        }
        wp_reset_postdata();
    }

    // Return the HTML string
    return $output;
}

function getRecentPostWithOffset($atts)
{
    $atts = shortcode_atts(
        [
            'post_type' => 'post',
            'offset' => 0,
            'num_posts' => 10,
            'category' => 'news',
        ],
        $atts,
        'getRecentPostWithOffset'
    );

    $query_args = [
        'post_type' => $atts['post_type'],
        'category_name' => $atts['category'],
        'posts_per_page' => $atts['num_posts'],
        'offset' => $atts['offset'],
    ];

    $query = new WP_Query($query_args);

    $output = '';
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $output .= '<article class="feat_news_card_item">';
            $output .= '<a href="' . get_permalink() . '" aria-label="' . get_the_title() . '" class="newsevents_anchorlink flex items-center">';
            $output .= '<div class="card_item_content">';
            $output .= '<div class="date_container fw-regular">' . date_i18n('M Y', strtotime(get_the_date())) . '</div>';
            $output .= '<h2 class="newsevents__post-title">' . get_the_title() . '</h2>';
            $output .= '</div>';
            $output .= '</a>';
            $output .= '</article>';
        }
        wp_reset_postdata();
    }

    return $output;
}

function getNewsEventsPosts_sc($atts)
{
    // Extract shortcode attributes
    $atts = shortcode_atts(
        [
            'post_type' => 'post',
            'category' => 'news',
            'num_posts' => -1,  // Fetch all posts
            'posts_per_page' => 12,  // Display 12 posts per page
            'featImgSize' => 'medium_large',
            'dateFormat' => 'M Y'
        ],
        $atts,
        'getNewsEventsPosts_sc'
    );

    // Set up WP_Query arguments
    $args = [
        'post_type' => $atts['post_type'],
        'category_name' => $atts['category'],
        'posts_per_page' => $atts['num_posts']
    ];

    // Create a new WP_Query instance
    $query = new WP_Query($args);

    // Generate the HTML string
    $articleCard = '';
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();
            $post_title = get_the_title();
            $post_url = get_permalink();
            $post_date = get_the_date($atts['dateFormat']);
            $post_tags = get_the_tags();
            $post_feat_img = get_the_post_thumbnail_url($post_id, $atts['featImgSize']);

            // Extract tag names and convert to lowercase
            $tag_names = [];
            if ($post_tags) {
                foreach ($post_tags as $tag) {
                    $tag_names[] = strtolower($tag->name);
                }
            }
            $tag_names_str = implode(', ', $tag_names);

            $articleCard .= '<article class="news_article_wrapper d-none" aria-hidden="true">';
            $articleCard .= '<input type="hidden" class="newsevents_hidden_input" id="' . $post_id . '" value="' . esc_attr($tag_names_str) . '">';
            $articleCard .= '<div class="news_card_image">';
            $articleCard .= '<a href="' . esc_url($post_url) . '" aria-label="' . esc_attr($post_title) . ' " title="Go to ' . esc_attr($post_title) . '" rel="noopener noreferrer" target="_blank">';
            $articleCard .= '<img src="' . esc_url($post_feat_img) . '" alt="' . esc_attr($post_title) . '" width="320" height="320" loading="lazy" class="border-1">';
            $articleCard .= '</a>';
            $articleCard .= '</div>';
            $articleCard .= '<div class="news_card_content">';
            $articleCard .= '<div class="newsevents__post_date">' . esc_html($post_date) . '</div>';
            $articleCard .= '<a href="' . esc_url($post_url) . '" aria-label="' . esc_attr($post_title) . ' " title="Go to ' . esc_attr($post_title) . '" rel="noopener noreferrer" target="_blank">';
            $articleCard .= '<h2 class="newsevents__post_title fw-medium">' . esc_html($post_title) . '</h2>';
            $articleCard .= '</a>';
            $articleCard .= '</div>';
            $articleCard .= '</article>';
        }
        wp_reset_postdata();
    }

    // Return the HTML string
    return $articleCard;
}

function insights_presentations_sc($atts)
{
    // Extract shortcode attributes
    $atts = shortcode_atts([
        'offset' => 0,
        'category' => '',
        'tags' => ''
    ], $atts, 'insights_presentations_sc');

    // Prepare query arguments
    $query_args = [
        'post_type' => 'project',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'has_password' => false,
        'offset' => $atts['offset'],
    ];

    // Add tax_query for category filter if provided
    if (!empty($atts['category'])) {
        $query_args['tax_query'][] = [
            'taxonomy' => 'project_category',
            'field' => 'slug',
            'terms' => explode(',', $atts['category']),
        ];
    }

    // Add tax_query for tags filter if provided
    if (!empty($atts['tags'])) {
        $query_args['tax_query'][] = [
            'taxonomy' => 'post_tag',
            'field' => 'slug',
            'terms' => explode(',', $atts['tags']),
        ];
    }

    // Query the posts
    $query = new WP_Query($query_args);

    // Format the posts into HTML
    $output = '<div class="insights_allposts_wrapper">';
    $current_year = null;
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();
            $getDate = get_the_date('Y-m-d');
            $year = get_the_date('Y');
            $month_n_date = get_the_date('M Y');
            $terms = wp_get_post_terms($post_id, 'project_category');

            $tags = wp_get_post_tags($post_id);
            $category_name = '';
            $category_slug = '';
            $category_id = '';

            if (!empty($terms) && !is_wp_error($terms)) {
                $category_name = $terms[0]->name;
                $category_slug = $terms[0]->slug;
                $category_id = $terms[0]->term_id;
            }

            $tag_names = [];
            foreach ($tags as $tag) {
                $tag_names[] = strtolower($tag->name);
            }

            // If the year has changed, close the current div and start a new one
            if ($year !== $current_year) {
                if ($current_year !== null) {
                    $output .= '</div></div>';  // Close the previous year's div and articles_wrapper
                }
                $output .= '<div class="insights_yearly_wrapper flex">';  // Start a new div for the new year
                $output .= '<div  class="year_wrapper"><small class="insights_year_lbl_sm">YEAR</small><h2 class="insights_year_lbl">' . esc_attr($year) . '</h2></div>';  // Year wrapper
                $output .= '<div id="year_' . esc_attr($year) . '" class="articles_wrapper flex justify-center flex-col">';  // Start articles wrapper
                $current_year = $year;
            }

            $output .= '<article class="insights_post_title_wrapper" data-year="year_' . esc_attr($year) . '"  data-category="' . esc_html($category_slug) . '" data-tags="' . esc_attr(implode(', ', $tag_names)) . '">';
            $output .= '<time datetime="' . esc_attr($getDate) . '" class="insights_sm_date">' . esc_attr($month_n_date) . '</time>';
            $output .= '<h1 class="insights_post_title"><a href="' . esc_url(get_permalink()) . '">' . esc_html(get_the_title()) . '</a></h1>';
            $output .= '</article>';
        }
        if ($current_year !== null) {
            $output .= '</div></div>';  // Close the last year's div and articles_wrapper
        }
        wp_reset_postdata();
    } else {
        $output .= '<p>No projects found.</p>';
    }
    $output .= '</div>';

    return $output;
}

function cache_all_posts($atts = [], $cache_duration = HOUR_IN_SECONDS)
{
    // Extract shortcode attributes with default values
    $atts = shortcode_atts([
        'post_type' => 'post',
        'posts_per_page' => -1,
        'category' => '',  // Add category attribute
    ], $atts, 'cache_all_posts');

    // Generate the transient key based on the query parameters
    $transient_key = 'cached_post_data_' . md5(serialize($atts));

    // Attempt to fetch the cached data
    if (false === ($cached_data = get_transient($transient_key))) {
        // Prepare query arguments
        $query_args = [
            'post_type' => $atts['post_type'],
            'posts_per_page' => $atts['posts_per_page'],
            'post_status' => 'publish',
            'has_password' => false,
            'orderby' => 'date',
        ];

        // Add category to query arguments if provided
        if (!empty($atts['category'])) {
            $query_args['category_name'] = $atts['category'];
        }

        // Execute the query
        $query = new WP_Query($query_args);

        $cached_data = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();

                // Ensure the post has a featured image
                if (has_post_thumbnail()) {
                    // Fetch and format categories and tags
                    $categories = get_the_category();
                    $tags = get_the_tags();

                    $category_slugs = $categories ? array_map(function ($cat) {
                        return $cat->slug;
                    }, $categories) : [];

                    $tag_slugs = $tags ? array_map(function ($tag) {
                        return $tag->slug;
                    }, $tags) : [];

                    $cached_data[] = [
                        'id' => get_the_ID(),
                        'title' => get_the_title(),
                        'post_date' => get_the_date('d-m-Y'),
                        'categories' => implode(', ', $category_slugs),
                        'tags' => implode(', ', $tag_slugs),
                        'excerpt' => wp_strip_all_tags(get_the_excerpt()),
                        'url' => get_permalink(),
                        'featured_image' => get_the_post_thumbnail_url(get_the_ID(), 'medium_large'),
                    ];
                }
            }
            wp_reset_postdata();

            // Cache the retrieved data
            set_transient($transient_key, $cached_data, $cache_duration);
        }
    }

    return $cached_data;
}

function get_newsletters_posts_sc($atts)
{
    $data = cache_all_posts($atts);
    $html_output = '';
    $counter = 0;

    foreach ($data as $post) {
        $post_date_original = esc_html($post['post_date']);
        $post_date = DateTime::createFromFormat('d-m-Y', $post['post_date'])->format('d M Y');
        $post_url = esc_url($post['url']);
        $image_src = esc_url($post['featured_image']);
        $image_alt = esc_attr($post['title']);
        $post_title = esc_html($post['title']);
        $post_excerpt = esc_html($post['excerpt']);
        $category = esc_attr($atts['category']);
        $class = $counter >= 12 ? 'd-none' : '';

        $html_output .= <<<HTML
            <article class="newsletter_post_item flex-col {$class}" data-nl_date="{$post_date_original}" data-category="{$category}">
                <a href="{$post_url}" tabindex="0">
                    <div class="post-thumbnail">
                        <img src="{$image_src}" alt="{$image_alt}" width="286" height="286">
                        <time class="post-date" datetime="{$post_date}">{$post_date}</time>
                        <h2 class="post-title" title="{$post_title}">{$post_title}</h2>
                        <div class="post-excerpt">{$post_excerpt}</div>
                    </div>
                </a>
            </article>
            HTML;

        $counter++;
    }

    return $html_output;
}

function storeAllPost($atts)
{
    $data = cache_all_posts($atts);
    $json_data = json_encode($data);

    $script = <<<EOT
        <script>
        (async () => {
            const data = $json_data;

            if (!window.indexedDB) {
                console.log("Your browser doesn't support a stable version of IndexedDB.");
                return;
            }

            const dbName = "PostsDatabase";

            try {
                await deleteDatabase(dbName);
                // console.log("Existing database deleted successfully.");
            } catch (error) {
                console.log("Error deleting database: ", error);
            }

            try {
                const db = await openDatabase(dbName, 1);
                await storePosts(db, data);
                // console.log("All posts have been added to the IndexedDB.");
            } catch (error) {
                console.log("Database error: ", error);
            }

            async function deleteDatabase(name) {
                return new Promise((resolve, reject) => {
                    const deleteRequest = indexedDB.deleteDatabase(name);

                    deleteRequest.onsuccess = () => resolve();
                    deleteRequest.onerror = (event) => reject(event.target.errorCode);
                    deleteRequest.onblocked = () => console.log("Database deletion blocked.");
                });
            }

            async function openDatabase(name, version) {
                return new Promise((resolve, reject) => {
                    const request = indexedDB.open(name, version);

                    request.onupgradeneeded = (event) => {
                        const db = event.target.result;
                        db.createObjectStore("posts", { keyPath: "id" });
                    };

                    request.onsuccess = (event) => resolve(event.target.result);
                    request.onerror = (event) => reject(event.target.errorCode);
                });
            }

            async function storePosts(db, posts) {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction(["posts"], "readwrite");
                    const objectStore = transaction.objectStore("posts");

                    posts.forEach((post) => {
                        objectStore.put(post);
                    });

                    transaction.oncomplete = () => resolve();
                    transaction.onerror = () => reject(transaction.error);
                });
            }
        })();
        </script>
        EOT;

    return $script;
}

add_action('init', 'register_custom_shortcodes');
add_action('wp_ajax_ajax_search', 'ajax_search');
add_action('wp_ajax_nopriv_ajax_search', 'ajax_search');
add_action('wp_ajax_ajax_latest_posts', 'ajax_latest_posts');
add_action('wp_ajax_nopriv_ajax_latest_posts', 'ajax_latest_posts');

add_action('wp_ajax_get_newsletters_posts', 'get_newsletters_posts');
add_action('wp_ajax_nopriv_get_newsletters_posts', 'get_newsletters_posts');

// Register custom shortcodes.
function register_custom_shortcodes()
{
    add_shortcode('related_pages', 'related_pages_shortcode');
    add_shortcode('get_recent_post_item', 'get_latest_post_details');
    add_shortcode('get_post_url', 'get_post_details_by_url');
    add_shortcode('custom_search_form', 'custom_search_form_shortcode');
    add_shortcode('get_recent_news_posts', 'get_recent_news_posts');
    add_shortcode('get_post_with_offset', 'getRecentPostWithOffset');
    add_shortcode('content_posts', 'getNewsEventsPosts_sc');
    add_shortcode('insights_presentations', 'insights_presentations_sc');
    add_shortcode('store_all_posts', 'storeAllPost');
    add_shortcode('newsletters_posts', 'get_newsletters_posts_sc');
}