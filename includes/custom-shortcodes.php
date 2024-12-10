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
        'post_type' => 'post',
        'posts_per_page' => 4,
        'post_status' => 'publish',
        'has_password' => false,
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
        'order' => 'DESC',
        'post_status' => 'publish',
        'has_password' => false,
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
            $output .= '<div class="featured_new_post_content flex items-center flex-col justify-center">';
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

function cache_all_posts($atts = [], $cache_duration = 30 * MINUTE_IN_SECONDS)
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

function getNewsletterPostTitle($atts)
{
    // Define default attributes
    $atts = shortcode_atts(
        array(
            'category' => 'hong-kong-law',  // Default category
        ),
        $atts
    );

    // Sanitize the category
    $category = sanitize_text_field($atts['category']);

    // Get the current post ID
    $current_post_id = get_the_ID();

    // Check if the current post belongs to the specified category
    if (has_category($category, $current_post_id)) {
        // Get the post details
        $post_title = get_the_title($current_post_id);
        $post_date = get_the_date('d M Y', $current_post_id);
        $post_datetime = get_the_date('Y-m-d', $current_post_id);  // ISO format
        $categories = get_the_category($current_post_id);
        $category_name = !empty($categories) ? esc_html($categories[0]->name) : 'Uncategorized';
        $category_link = !empty($categories) ? get_category_link($categories[0]->term_id) : '#';
        $post_tags = get_the_tags($current_post_id);
        $tags_list = '';
        $featured_image_id = get_post_thumbnail_id($current_post_id);
        $featured_image_url = wp_get_attachment_image_url($featured_image_id, 'full');
        $featured_image_mime_type = get_post_mime_type($featured_image_id);
        $featured_image_width = 768;  // Example width
        $featured_image_height = 512;  // Example height
        $pdf_url = filter_var(get_field('pdf_url', $current_post_id), FILTER_SANITIZE_URL);
        $word_url = filter_var(get_field('word_url', $current_post_id), FILTER_SANITIZE_URL);

        if (filter_var($pdf_url, FILTER_VALIDATE_URL) === false) {
            $pdf_url = '';  // or handle the invalid URL case as needed
        }

        if (filter_var($word_url, FILTER_VALIDATE_URL) === false) {
            $word_url = '';  // or handle the invalid URL case as needed
        }

        // Build tags list
        if ($post_tags) {
            foreach ($post_tags as $tag) {
                $tag_link = get_tag_link($tag->term_id);
                $tags_list .= '<a href="' . esc_url($tag_link) . '" class="post-tag">' . esc_html($tag->name) . '</a> ';
            }
        }

        // Start output buffer
        ob_start();
        ?>
<div class="featured_image">
    <picture>
        <source srcset="<?php echo esc_attr($featured_image_url); ?>" sizes="(max-width: 768px) 100vw, 768px"
            media="all and (max-width: 1790px)" type="<?php echo esc_attr($featured_image_mime_type); ?>"
            width="<?php echo esc_attr($featured_image_width); ?>"
            height="<?php echo esc_attr($featured_image_height); ?>">
        <img src="<?php echo esc_url($featured_image_url); ?>" alt="<?php echo esc_attr($post_title); ?>">
    </picture>
</div>
<div class="nl_sp_hero_txt_wrapper">
    <h1 class="entry-title"><?php echo esc_html($post_title); ?></h1>
    <div class="category_name_wrapper">
        <a href="<?php echo esc_url($category_link); ?>"
            class="category_name uppercase fw-bold"><?php echo esc_html($category_name); ?></a>
        <div class="date flex gap-1">
            <time datetime="<?php echo esc_attr($post_datetime); ?>"
                class="cayman_post_date text-gray-500 fw-regular"><?php echo esc_html($post_date); ?></time>
            <span id="read_time_est" class="text-gray-500 fw-regular"></span>
        </div>
    </div>
</div>
<div class="newsletter_btn_share_wrapper flex space-between items-center my-2">
    <div class="tags_wrapper flex gap-1 items-center">
        <?php echo $tags_list; ?>
    </div>
    <div class="printable_wrapper flex gap-1">
        <input type="hidden" name="pdf_url" value="<?php echo esc_url($pdf_url); ?>" id="pdf_url_hidden_input">
        <input type="hidden" name="word_url" value="<?php echo esc_url($word_url); ?>" id="word_url_hidden_input">
        <!-- download document -->
        <div class="nl_download-wrapper relative flex items-center">
            <button type="button" class="print_btn" aria-label="Download as PDF" id="open_dl_options"
                data-dialog="close">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="#e8eaed">
                    <path
                        d="M480-336.92 338.46-478.46l28.31-28.77L460-414v-346h40v346l93.23-93.23 28.31 28.77L480-336.92ZM264.62-200q-27.62 0-46.12-18.5Q200-237 200-264.62v-96.92h40v96.92q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69h430.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93v-96.92h40v96.92q0 27.62-18.5 46.12Q723-200 695.38-200H264.62Z" />
                </svg>
                <div class="pdf-dl">
                    Download
                </div>
            </button>
            <div id="nlDowloadOptions" aria-hidden="true">
                <ul>
                    <li>
                        <button aria-label="Share on twitter" class="flex gap-1 items-center" id="dl_pdf">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                fill="#5f6368">
                                <path
                                    d="M346.15-464.62h30.77v-80h49.23q13.16 0 21.97-8.8 8.8-8.81 8.8-21.96v-49.24q0-13.15-8.8-21.96-8.81-8.8-21.97-8.8h-80v190.76Zm30.77-110.76v-49.24h49.23v49.24h-49.23Zm121.54 110.76h76.92q13.16 0 21.97-8.8 8.8-8.81 8.8-21.96v-129.24q0-13.15-8.8-21.96-8.81-8.8-21.97-8.8h-76.92v190.76Zm30.77-30.76v-129.24h46.15v129.24h-46.15Zm126.15 30.76h30.77v-80h55.39v-30.76h-55.39v-49.24h55.39v-30.76h-86.16v190.76ZM324.62-280q-27.62 0-46.12-18.5Q260-317 260-344.62v-430.76q0-27.62 18.5-46.12Q297-840 324.62-840h430.76q27.62 0 46.12 18.5Q820-803 820-775.38v430.76q0 27.62-18.5 46.12Q783-280 755.38-280H324.62Zm0-40h430.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93v-430.76q0-9.24-7.69-16.93-7.69-7.69-16.93-7.69H324.62q-9.24 0-16.93 7.69-7.69 7.69-7.69 16.93v430.76q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69Zm-120 160q-27.62 0-46.12-18.5Q140-197 140-224.61v-470.77h40v470.77q0 9.23 7.69 16.92 7.69 7.69 16.93 7.69h470.76v40H204.62ZM300-800v480-480Z" />
                            </svg>
                            <div>PDF Version</div>
                        </button>
                    </li>
                    <li>
                        <button aria-label="Share on facebook" class="flex gap-1 items-center" id="dl_word">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                fill="#5f6368">
                                <path
                                    d="M264.62-120q-27.62 0-46.12-18.5Q200-157 200-184.62v-590.76q0-27.62 18.5-46.12Q237-840 264.62-840H580l180 180v475.38q0 27.62-18.5 46.12Q723-120 695.38-120H264.62ZM560-640v-160H264.62q-9.24 0-16.93 7.69-7.69 7.69-7.69 16.93v590.76q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69h430.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93V-640H560ZM240-800v160-160 640-640Z" />
                            </svg>
                            <div>Word Version</div>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        <!-- share to social media -->
        <div class="share-wrapper relative flex items-center">
            <button type="button" class="print_btn" id="nl_sharebtn" data-dialog="close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                        d="M15.218 4.931a.4.4 0 0 1-.118.132l.012.006a.45.45 0 0 1-.292.074.5.5 0 0 1-.3-.13l-2.02-2.02v7.07c0 .28-.23.5-.5.5s-.5-.22-.5-.5v-7.04l-2 2a.45.45 0 0 1-.57.04h-.02a.4.4 0 0 1-.16-.3.4.4 0 0 1 .1-.32l2.8-2.8a.5.5 0 0 1 .7 0l2.8 2.79a.42.42 0 0 1 .068.498m-.106.138.008.004v-.01zM16 7.063h1.5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-11c-1.1 0-2-.9-2-2v-10a2 2 0 0 1 2-2H8a.5.5 0 0 1 .35.15.5.5 0 0 1 .15.35.5.5 0 0 1-.15.35.5.5 0 0 1-.35.15H6.4c-.5 0-.9.4-.9.9v10.2a.9.9 0 0 0 .9.9h11.2c.5 0 .9-.4.9-.9v-10.2c0-.5-.4-.9-.9-.9H16a.5.5 0 0 1 0-1"
                        clip-rule="evenodd"></path>
                </svg>
                <div class="share-this">
                    Share
                </div>
            </button>
            <div id="nlShareOptions" aria-hidden="true">
                <ul>
                    <li>
                        <button>
                            <div class="flex gap-1 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                    viewBox="0 0 24 24">
                                    <path fill="currentColor" fill-rule="evenodd"
                                        d="m12.505 9.678.59-.59a5 5 0 0 1 1.027 7.862l-2.829 2.83a5 5 0 0 1-7.07-7.072l2.382-2.383q.002.646.117 1.298l-1.793 1.792a4 4 0 0 0 5.657 5.657l2.828-2.828a4 4 0 0 0-1.046-6.411q.063-.081.137-.155m-1.01 4.646-.589.59a5 5 0 0 1-1.027-7.862l2.828-2.83a5 5 0 0 1 7.071 7.072l-2.382 2.383a7.7 7.7 0 0 0-.117-1.297l1.792-1.793a4 4 0 1 0-5.657-5.657l-2.828 2.828a4 4 0 0 0 1.047 6.411 2 2 0 0 1-.138.155"
                                        clip-rule="evenodd"></path>
                                </svg>
                                <div>Copy link</div>
                            </div>
                        </button>
                    </li>
                    <li>
                        <button aria-label="Share on linkedin" class="flex gap-1 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                viewBox="0 0 24 24" class="cg aoi">
                                <path fill="currentColor"
                                    d="M21 4.324v15.352A1.324 1.324 0 0 1 19.676 21H4.324A1.324 1.324 0 0 1 3 19.676V4.324A1.324 1.324 0 0 1 4.324 3h15.352A1.324 1.324 0 0 1 21 4.324M8.295 9.886H5.648v8.478h2.636V9.886zm.221-2.914a1.52 1.52 0 0 0-1.51-1.533H6.96a1.533 1.533 0 0 0 0 3.066 1.52 1.52 0 0 0 1.556-1.487zm9.825 6.236c0-2.555-1.626-3.542-3.229-3.542a3.02 3.02 0 0 0-2.67 1.37h-.082V9.875H9.875v8.477h2.648v-4.494a1.754 1.754 0 0 1 1.579-1.893h.104c.837 0 1.464.523 1.464 1.858v4.54h2.647l.024-5.144z">
                                </path>
                            </svg>
                            <div class="ca hq">Share on LinkedIn</div>
                        </button>
                    </li>
                    <li>
                        <button aria-label="Share on twitter" class="flex gap-1 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                viewBox="0 0 24 24" class="cg aoi">
                                <path fill="#242424"
                                    d="M13.346 10.932 18.88 4.5h-1.311l-4.805 5.585L8.926 4.5H4.5l5.803 8.446L4.5 19.69h1.311l5.074-5.898 4.053 5.898h4.426zM11.55 13.02l-.588-.84-4.678-6.693h2.014l3.776 5.4.588.842 4.907 7.02h-2.014z">
                                </path>
                            </svg>
                            <div>Share on X</div>
                        </button>
                    </li>
                    <li>
                        <button aria-label="Share on facebook" class="flex gap-1 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                viewBox="0 0 24 24" class="cg aoi">
                                <path fill="currentColor"
                                    d="M22 12.061C22 6.505 17.523 2 12 2S2 6.505 2 12.061c0 5.022 3.657 9.184 8.438 9.939v-7.03h-2.54V12.06h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.908h-2.33V22c4.78-.755 8.437-4.917 8.437-9.939">
                                </path>
                            </svg>
                            <div>Share on Facebook</div>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
<?php
        return ob_get_clean();
    }

    // If the post does not belong to the specified category, return an empty string
    return '';
}

function newsletter_scf_custom_fields($atts)
{
    // Define default attributes
    $atts = shortcode_atts(
        [
            'field' => '',  // Field to retrieve
            'quote_number' => '',  // Quote set number (1, 2, or 3)
            'placement' => 'bq-right',  // Default quote figure class
            'layout' => 'float',  // Default layout
        ],
        $atts
    );

    // Sanitize inputs
    $field = sanitize_text_field($atts['field']);
    $quote_number = sanitize_text_field($atts['quote_number']);
    $placement = sanitize_html_class($atts['placement']);
    $layout = sanitize_text_field($atts['layout']);

    // Validate field input
    if (empty($field)) {
        return 'Error: No field specified';
    }

    // Get the current post ID
    $current_post_id = get_the_ID();

    // If no post ID is found, return empty
    if (!$current_post_id) {
        return '';
    }

    // Handle quotes with multiple sets
    if ($field === 'quotes') {
        // Determine the dynamic field names based on quote_number
        $quotes_field = $quote_number ? 'quotes_' . $quote_number : 'quotes';
        $quote_author_field = $quote_number ? 'quote_author_' . $quote_number : 'quote_author';

        // Retrieve quotes and authors directly for the current post
        $quotes = get_field($quotes_field, $current_post_id);
        $quote_authors = get_field($quote_author_field, $current_post_id);

        // Ensure quotes are in an array
        $quotes = is_array($quotes) ? $quotes : array($quotes);
        $quote_authors = is_array($quote_authors) ? $quote_authors : array($quote_authors);

        // Generate output for specific quote set
        $output = '';
        foreach ($quotes as $index => $quote) {
            $author = isset($quote_authors[$index]) ? $quote_authors[$index] : '';

            $output .= '<figure class="' . esc_attr($placement) . '"><div class="callout-text">';
            $output .= '<blockquote>' . wp_kses_post($quote);

            if (!empty($author)) {
                $output .= '<div class="flex"><small class="ml-auto">– ' . esc_html($author) . '</small></div>';
            }

            $output .= '</blockquote></div>';
            $output .= '</figure>';
        }

        return $output;
    }

    // Retrieve the field value for the current post
    $value = get_field($field, $current_post_id);

    // If no value found, return empty
    if (empty($value)) {
        return '';
    }

    // Process based on field type
    switch ($field) {
        case 'key_takeaways':
            // Wrap rich text content in a div with keypoints_wrapper class
            return '<div class="keypoints_wrapper">' . wp_kses_post($value) . '</div>';

        case 'references':
            // Determine the class based on layout
            $references_class = $layout === 'blocked'
                ? 'newsletter_references_blocked'
                : 'newsletter_references';

            return '<div class="' . esc_attr($references_class) . '">' . wp_kses_post($value) . '</div>';

        default:
            // For any other fields
            return is_array($value)
                ? implode(', ', array_map('esc_html', $value))
                : esc_html($value);
    }
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
    add_shortcode('getNewsletterPostTitle', 'getNewsletterPostTitle');
    add_shortcode('newsletter_scf_custom_fields', 'newsletter_scf_custom_fields');
}
