<?php
function get_custom_excerpt($content, $word_count)
{
    $trimmed_content = wp_trim_words($content, $word_count);
    return $trimmed_content;
}

/**
 * Shortcode to display related posts.
 *
 * Attributes:
 * - number_of_pages_list (int): Number of related posts to display. Default is 4.
 * - excerpt_length (int): Length of the excerpt to display. Default is 10.
 * - orderby (string): Field to order posts by. Default is 'date'.
 * - category (string|int): Category slug or ID to filter posts by. Default is empty.
 * - post_type (string): Post type to query. Default is 'post'.
 *
 * Example usage:
 * [related_pages number_of_pages_list="5" excerpt_length="20" orderby="title" category="news" post_type="custom_post"]
 *
 * @param array $atts Shortcode attributes.
 * @return string HTML output of related posts.
 */
function related_post_sc($atts)
{
    // Extract shortcode attributes
    $atts = shortcode_atts([
        'number_of_pages_list' => 4,
        'excerpt_length' => 10,
        'orderby' => 'date',
        'category' => '',  // New attribute for category
        'post_type' => 'post'  // New attribute for post type with default value 'post'
    ], $atts, 'related_post_sc');

    // Sanitize inputs
    $number_of_pages_list = absint($atts['number_of_pages_list']);
    $current_post_id = get_the_ID();
    $excerpt_length = absint($atts['excerpt_length']);
    $orderby = sanitize_text_field($atts['orderby']);
    $category = sanitize_text_field($atts['category']);  // Sanitize category input
    $post_type = sanitize_text_field($atts['post_type']);  // Sanitize post type input

    // Setup query arguments
    $args = [
        'post_type' => $post_type,  // Use the post type from the shortcode attribute
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

    // Add category filter if provided
    if (!empty($category)) {
        $categories = array_map('trim', explode(',', $category));  // Split and trim categories
        $args['tax_query'] = [
            [
                'taxonomy' => 'category',
                'field' => is_numeric($categories[0]) ? 'term_id' : 'slug',
                'terms' => $categories,
            ]
        ];
    }

    // Run the query
    $related_query = new WP_Query($args);

    // Start output buffering
    ob_start();

    if ($related_query->have_posts()) {
        echo '<aside class="related-post">';
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
    <article class="related-post-item">
        <div class="related-post-image">
            <img src="<?php echo esc_url($image_src[0]); ?>" alt="<?php echo esc_attr($image_alt); ?>"
                width="<?php echo esc_attr($image_src[1]); ?>" height="<?php echo esc_attr($image_src[2]); ?>"
                loading="lazy" fetchpriority="high">
        </div>
        <h1 class="related-page-title"><?php the_title(); ?></h1>
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
 * Shortcode to display related pages.
 *
 * @param array $atts {
 *     Shortcode attributes.
 *
 *     @type string $category            The category to filter pages by. Default 'our-work'.
 *     @type int    $number_of_pages_list The number of pages to display. Default 5.
 *     @type string $orderby             The order by which to sort pages. Default 'date'.
 *     @type string $layout_style        The layout style to apply to the articles. Default ''.
 *     @type string $exclude_children    The child categories to exclude. Default ''.
 *     @type string $include_children    Whether to include child categories. Default 'false'.
 * }
 * @return string HTML content to display related pages.
 *
 * @example
 * [related_page_item category="the-firm" number_of_pages_list="3" orderby="rand" layout_style="square" exclude_children="people-culture" include_children="false"]
 * @example
 * [related_page_item category="industries" number_of_pages_list="3" orderby="rand" include_children="true"]
 */
function related_pages_sc($atts)
{
    global $post;

    $atts = shortcode_atts([
        'category' => 'our-work',
        'number_of_pages_list' => 5,
        'orderby' => 'date',
        'layout_style' => '',
        'exclude_children' => '',  // Add exclude_children attribute
        'include_children' => 'false'  // Add include_children attribute
    ], $atts, 'related_pages_sc');

    // Early exit if no pages are requested
    if ($atts['number_of_pages_list'] === 0) {
        return '';
    }

    // Split the category attribute by commas and trim whitespace
    $categories = array_map('trim', explode(',', $atts['category']));

    // Get term IDs of the specified categories
    $category_term_ids = [];
    foreach ($categories as $category) {
        $term = get_term_by(is_numeric($category) ? 'id' : 'slug', $category, 'category');
        if ($term) {
            $category_term_ids[] = $term->term_id;
        }
    }

    if (empty($category_term_ids)) {
        return '<p>No related pages found.</p>';
    }

    // Split the exclude_children attribute by commas and trim whitespace
    $exclude_children = array_map('trim', explode(',', $atts['exclude_children']));

    // Get term IDs of the child categories to exclude
    $exclude_term_ids = [];
    foreach ($exclude_children as $exclude_child) {
        $term = get_term_by(is_numeric($exclude_child) ? 'id' : 'slug', $exclude_child, 'category');
        if ($term) {
            $exclude_term_ids[] = $term->term_id;
        }
    }

    $args = [
        'post_type' => 'page',
        'tax_query' => [
            'relation' => 'AND',
            [
                'taxonomy' => 'category',
                'field' => 'term_id',
                'terms' => $category_term_ids,
                'include_children' => filter_var($atts['include_children'], FILTER_VALIDATE_BOOLEAN),  // Dynamic include_children
            ],
            [
                'taxonomy' => 'category',
                'field' => 'term_id',
                'terms' => $exclude_term_ids,
                'operator' => 'NOT IN',  // Exclude specified child categories
            ]
        ],
        'posts_per_page' => $atts['number_of_pages_list'],
        'orderby' => $atts['orderby'],
        'post__not_in' => [$post->ID]  // Exclude the current page
    ];

    $the_query = new WP_Query($args);

    ob_start();

    if ($the_query->have_posts()):
        echo '<aside class="related_pages flex flex-col gap-2">';
        while ($the_query->have_posts()):
            $the_query->the_post();
            $image_id = get_post_thumbnail_id();
            $image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);

            if (empty($image_alt)) {
                $image_alt = get_the_title();
            }

            $image_src = wp_get_attachment_image_src($image_id, 'medium_large');
?>

<article class="related_page_item <?php echo esc_attr($atts['layout_style']); ?>">
    <a href="<?php the_permalink(); ?>" class="flex flex-col gap-1" aria-label="<?php the_title(); ?>">
        <?php if ($image_src): ?>
        <div class="rp_img_div_wrapper overflow-clip flex items-center">
            <img src="<?php echo esc_url($image_src[0]); ?>" alt="<?php echo esc_attr($image_alt); ?>" width="50"
                height="50" loading="lazy" class="related_page_img">
        </div>
        <?php endif; ?>
        <h1 class="rp_entry_title"><?php the_title(); ?></h1>
    </a>
</article>

<?php
        endwhile;
        echo '</aside>';
    endif;

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
            $output .= '<div class="cta_wrapper"><a href="' . esc_url($post_url) . '" class="cta_btn_link white-cta"
            aria-label="Read full article on ' . esc_attr($post_title) . '">Read More ›</a></div>';
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
            $post_thumbnail = '<img src="' . esc_url($thumbnail_src[0]) . '" alt="' . esc_attr($post_title) . '" loading="lazy"
    decoding="async">';
        }
    }

    // Create the output for the post
    $output .= '<a href="' . esc_url($post_url) . '" target="_blank" class="post_wrapper relative"
    data-url="' . esc_url($post_url) . '">';
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
            $output .= '<div class="featured_new_post_content flex flex-col justify-center">';
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

function homepage_recent_webinar_sc($atts)
{
    // Extract the attributes and set default value for 'tag'
    $atts = shortcode_atts(
        [
            'offset' => 0,
            'post_count' => 10,
            'category' => '',
            'tags' => '',
            'layout' => 'list',
        ],
        $atts,
        'recent_webinars'
    );

    // Define the query arguments
    $query_args = array(
        'post_type' => 'project',
        'posts_per_page' => $atts['post_count'],
        'post_status' => 'publish',
        'has_password' => false,
        'offset' => $atts['offset'],
        'post__not_in' => array(get_the_ID()),  // Exclude the current post
    );

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

    // Execute the query
    $query = new WP_Query($query_args);

    // Start output buffering
    ob_start();

    // Check if there are any posts to display
    if ($query->have_posts()) {
        // Display the posts based on the layout
        if ($atts['layout'] === 'list') {
            echo '<ul class="pub-list">';
            while ($query->have_posts()) {
                $query->the_post();
                echo '<li class="pub-list__pub"><a href="' . get_permalink() . '" aria-label="' . esc_attr(get_the_title()) . '" target="_blank">' . esc_html(get_the_title()) . '</a></li>';
            }
            echo '</ul>';
        } elseif ($atts['layout'] === 'article') {
            echo '<div class="article">';
            while ($query->have_posts()) {
                $query->the_post();
                echo '<article>';
                echo '<h2><a href="' . get_permalink() . '" aria-label="' . esc_attr(get_the_title()) . '" target="_blank">' . esc_html(get_the_title()) . '</a></h2>';
                echo '<p>' . esc_html(get_the_excerpt()) . '</p>';
                echo '<a href="' . get_permalink() . '" aria-label="Read more about ' . esc_attr(get_the_title()) . '" target="_blank" class="read-more cta_btn_link white-cta">Read more</a>';
                echo '</article>';
            }
            echo '</div>';
        } elseif ($atts['layout'] === 'featured') {
            while ($query->have_posts()) {
                $query->the_post();
                echo '<article class="ppw_related_page_item">';
                echo '<a href="' . get_permalink() . '" class="flex flex-col gap-1" aria-label="' . esc_attr(get_the_title()) . '">';
                // echo '<div class="rp_img_div_wrapper overflow-clip flex items-center">';
                // echo get_the_post_thumbnail(get_the_ID(), 'thumbnail', ['class' => 'related_page_img', 'loading' => 'lazy', 'fetchpriority' => 'high']);
                // echo '</div>';
                echo '<h1 class="ppw_entry_title">' . esc_html(get_the_title()) . '</h1>';
                echo '</a>';
                echo '</article>';
            }
        }
    } else {
        echo 'No projects found.';
    }

    // Reset post data
    wp_reset_postdata();

    // Return the buffered content
    return ob_get_clean();
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

                    $category_names = $categories ? array_map(function ($cat) {
                        return $cat->name;
                    }, $categories) : [];

                    $tag_slugs = $tags ? array_map(function ($tag) {
                        return $tag->slug;
                    }, $tags) : [];

                    $cached_data[] = [
                        'id' => get_the_ID(),
                        'title' => get_the_title(),
                        'post_date' => get_the_date('d-m-Y'),
                        'categories' => implode(', ', $category_slugs),
                        'category_names' => implode(', ', $category_names),
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

function get_newsletters_posts_sc($atts)
{
    $data = cache_all_posts($atts);
    $html_output = '';
    $counter = 0;
    $show_time = isset($atts['show_time']) && $atts['show_time'] === 'false' ? 'd-none' : '';
    $offset = isset($atts['offset']) ? intval($atts['offset']) : 0;

    foreach ($data as $index => $post) {
        if ($index < $offset) {
            continue;
        }

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
                <a href="{$post_url}" tabindex="0" target="_blank" rel="noopener noreferrer" aria-label="Read more about {$post_title}">
                    <div class="post-thumbnail">
                        <img src="{$image_src}" alt="{$image_alt}" width="286" height="286">
                        <time class="post-date {$show_time}" datetime="{$post_date}">{$post_date}</time>
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

function getNewsletterPostTitle($atts)
{
    // Define default attributes
    $atts = shortcode_atts(
        array(
            'category' => 'hong-kong-law',  // Default category
        ),
        $atts, 'getNewsletterPostTitle'
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
                            <svg width="24" height="30" viewBox="0 0 24 30" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M19.2848 19.5722C18.9186 19.6801 18.381 19.6922 17.8046 19.6088C17.1859 19.5192 16.5549 19.3304 15.9347 19.0522C17.0407 18.8916 17.8987 18.9411 18.6326 19.2007C18.8064 19.2622 19.092 19.4266 19.2848 19.5722ZM13.1141 18.5594C13.0691 18.5716 13.0247 18.5832 12.9806 18.5954C12.683 18.6763 12.3935 18.7552 12.1145 18.8254L11.7382 18.9206C10.9814 19.1118 10.2075 19.3071 9.44322 19.5397C9.73367 18.8405 10.0035 18.1335 10.2678 17.4423C10.4634 16.9306 10.6632 16.408 10.8698 15.892C10.9746 16.0648 11.084 16.2377 11.1978 16.411C11.7163 17.1994 12.3682 17.9284 13.1141 18.5594ZM11.1889 10.6745C11.2379 11.5373 11.0514 12.3673 10.7779 13.1635C10.4409 12.1789 10.2839 11.0917 10.7052 10.2139C10.8132 9.98887 10.9017 9.86857 10.9591 9.8058C11.0478 9.94245 11.1644 10.2482 11.1889 10.6745ZM7.23761 21.6041C7.04829 21.9422 6.85504 22.2587 6.65698 22.5575C6.17899 23.2766 5.39727 24.0466 4.99569 24.0466C4.95617 24.0466 4.90835 24.0402 4.83847 23.9666C4.79349 23.9195 4.78629 23.8857 4.78847 23.8396C4.80201 23.5753 5.15291 23.1044 5.66124 22.6679C6.12262 22.2718 6.64412 21.9197 7.23761 21.6041ZM20.5635 19.6096C20.5021 18.7289 19.0171 18.1639 19.0024 18.1587C18.4284 17.9555 17.8047 17.8568 17.0959 17.8568C16.3372 17.8568 15.5192 17.9664 14.4687 18.2114C13.5339 17.5499 12.7264 16.7218 12.1231 15.805C11.8567 15.3999 11.6172 14.9956 11.4084 14.6006C11.9181 13.3841 12.377 12.076 12.2936 10.6109C12.2264 9.4362 11.6958 8.64713 10.9741 8.64713C10.4791 8.64713 10.0529 9.01313 9.70632 9.73598C9.08808 11.024 9.25059 12.6722 10.1891 14.6388C9.8511 15.4313 9.53706 16.253 9.23308 17.0483C8.85488 18.0374 8.46518 19.0577 8.02597 20.0284C6.79425 20.5149 5.78235 21.1049 4.93905 21.8293C4.38661 22.303 3.7206 23.0271 3.68259 23.783C3.66403 24.139 3.78631 24.4655 4.0348 24.7271C4.2988 25.0049 4.63047 25.1511 4.99516 25.1516C6.19963 25.1516 7.35888 23.4995 7.5788 23.1682C8.02139 22.5022 8.43565 21.7593 8.84158 20.9024C9.86395 20.5336 10.9535 20.2583 12.0095 19.9922L12.3877 19.8962C12.672 19.8241 12.9675 19.7443 13.2706 19.6615C13.5913 19.5749 13.9213 19.4852 14.2566 19.3999C15.341 20.0883 16.5071 20.5373 17.6443 20.7021C18.6022 20.8412 19.4529 20.7605 20.0288 20.4608C20.547 20.1914 20.5755 19.7757 20.5635 19.6096ZM22.8962 27.1821C22.8962 28.7949 21.4723 28.8944 21.185 28.8976H2.81351C1.20376 28.8976 1.10683 27.4664 1.10375 27.1821L1.10354 2.81731C1.10354 1.20292 2.53009 1.10505 2.81329 1.10181H15.2236L15.2302 1.10835V5.94297C15.2302 6.91322 15.8178 8.75017 18.043 8.75017H22.8547L22.896 8.79135L22.8962 27.1821ZM21.7555 7.6482H18.0439C16.4346 7.6482 16.3372 6.22477 16.335 5.94313V2.2148L21.7555 7.6482ZM24 27.1821V8.33677L16.335 0.653266V0.617518H16.2984L15.6828 0H2.81354C1.84034 0 0 0.589002 0 2.81783V27.1826C0 28.157 0.588233 30 2.81354 30H21.1867C22.1597 29.9998 24 29.4107 24 27.1821Z"
                                    fill="#5f6368" />
                            </svg>


                            <div>PDF Version</div>
                        </button>
                    </li>
                    <li>
                        <button aria-label="Share on facebook" class="flex gap-1 items-center" id="dl_word">

                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.7117 0.385467C13.6212 0.382234 13.5307 0.387083 13.4402 0.403247L1.36746 2.53363C0.575431 2.67426 0 3.35961 0 4.16295V20.2879C0 21.0929 0.575431 21.7782 1.36746 21.9173L13.4402 24.0476C13.5113 24.0606 13.5841 24.0654 13.6552 24.0654C13.9461 24.0654 14.2274 23.9652 14.452 23.7761C14.7349 23.5401 14.8966 23.1926 14.8966 22.824V20.9151H22.7586C23.4423 20.9151 24 20.3575 24 19.6737V4.77717C24 4.09344 23.4423 3.53579 22.7586 3.53579H14.8966V1.62523C14.8966 1.25831 14.7349 0.91079 14.452 0.674799C14.2419 0.496997 13.9817 0.396782 13.7117 0.385467ZM13.6988 1.21467C13.8039 1.22437 13.8798 1.27448 13.9203 1.30842C13.9768 1.35529 14.069 1.45874 14.069 1.62523V22.824C14.069 22.9921 13.9768 23.0956 13.9203 23.1425C13.8653 23.1893 13.7505 23.2621 13.5841 23.233L1.51131 21.1026C1.1153 21.0331 0.827586 20.6904 0.827586 20.2879V4.16295C0.827586 3.76047 1.1153 3.41779 1.51131 3.34829L13.5824 1.2179C13.6245 1.21144 13.6633 1.20982 13.6988 1.21467ZM14.8966 4.36338H22.7586C22.9865 4.36338 23.1724 4.54926 23.1724 4.77717V19.6737C23.1724 19.9016 22.9865 20.0875 22.7586 20.0875H14.8966V17.6048H20.2759C20.5038 17.6048 20.6897 17.4205 20.6897 17.191C20.6897 16.9614 20.5038 16.7772 20.2759 16.7772H14.8966V15.122H17.1207C17.3486 15.122 17.5345 14.9377 17.5345 14.7082C17.5345 14.4787 17.3486 14.2944 17.1207 14.2944H14.8966V12.6392H20.2759C20.5038 12.6392 20.6897 12.455 20.6897 12.2254C20.6897 11.9959 20.5038 11.8117 20.2759 11.8117H14.8966V10.1565H20.2759C20.5038 10.1565 20.6897 9.97221 20.6897 9.74269C20.6897 9.51316 20.5038 9.32889 20.2759 9.32889H14.8966V7.67372H20.2759C20.5038 7.67372 20.6897 7.48945 20.6897 7.25993C20.6897 7.0304 20.5038 6.84614 20.2759 6.84614H14.8966V4.36338ZM3.375 7.67857C3.32166 7.67049 3.26509 7.67211 3.21013 7.68665C2.98869 7.74161 2.85291 7.96629 2.90948 8.18773L4.97845 16.4636C5.02371 16.6462 5.18534 16.7739 5.37285 16.7772C5.56035 16.7707 5.72683 16.6543 5.77856 16.4733L7.44828 10.4604L9.118 16.4733C9.1681 16.6543 9.33136 16.7772 9.51724 16.7772H9.52371C9.71121 16.7739 9.87285 16.6462 9.9181 16.4636L11.9871 8.18773C12.0436 7.96629 11.9079 7.74161 11.6864 7.68665C11.4666 7.63008 11.2403 7.76424 11.1853 7.9873L9.49623 14.7405L7.84752 8.80519C7.79741 8.62577 7.63416 8.50131 7.44828 8.50131C7.26239 8.50131 7.09914 8.62577 7.04903 8.80519L5.40032 14.7405L3.71121 7.9873C3.6708 7.82081 3.53341 7.70282 3.375 7.67857ZM18.6207 14.2944C18.3928 14.2944 18.2069 14.4787 18.2069 14.7082C18.2069 14.9377 18.3928 15.122 18.6207 15.122H20.2759C20.5038 15.122 20.6897 14.9377 20.6897 14.7082C20.6897 14.4787 20.5038 14.2944 20.2759 14.2944H18.6207Z"
                                    fill="#5f6368" />
                            </svg>

                            <div>Word Version</div>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        <!-- share to social media -->
        <div class="share-wrapper relative flex items-center">
            <button type="button" class="share_btn" id="nl_sharebtn" data-dialog="close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                        d="M15.218 4.931a.4.4 0 0 1-.118.132l.012.006a.45.45 0 0 1-.292.074.5.5 0 0 1-.3-.13l-2.02-2.02v7.07c0 .28-.23.5-.5.5s-.5-.22-.5-.5v-7.04l-2 2a.45.45 0 0 1-.57.04h-.02a.4.4 0 0 1-.16-.3.4.4 0 0 1 .1-.32l2.8-2.8a.5.5 0 0 1 .7 0l2.8 2.79a.42.42 0 0 1 .068.498m-.106.138.008.004v-.01zM16 7.063h1.5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-11c-1.1 0-2-.9-2-2v-10a2 2 0 0 1 2-2H8a.5.5 0 0 1 .35.15.5.5 0 0 1 .15.35.5.5 0 0 1-.15.35.5.5 0 0 1-.35.15H6.4c-.5 0-.9.4-.9.9v10.2a.9.9 0 0 0 .9.9h11.2c.5 0 .9-.4.9-.9v-10.2c0-.5-.4-.9-.9-.9H16a.5.5 0 0 1 0-1"
                        clip-rule="evenodd"></path>
                </svg>
                <div class="share-this">
                    Share
                </div>
            </button>
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

function share_download_sc($atts)
{
    $atts = shortcode_atts(
        array(
            'id' => get_the_ID(),  // Default to the current post ID
        ),
        $atts, 'share_download'
    );

    // Get the post ID
    $post_id = intval($atts['id']);

    // Check if the post type is 'project'
    if (get_post_type($post_id) !== 'project') {
        return 'This shortcode only works for Project posts.';
    }

    if ($post_id) {
        // Get the ACF field value
        $slide_url = esc_url(get_field('slide_url', $post_id));

        // Start output buffering
        ob_start();
?>
<div class="share_download_div_wrapper flex gap-1 relative">
    <div class="share-wrapper relative flex items-center">
        <button type="button" class="share_btn flex items-center" id="nl_sharebtn" data-dialog="close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                    d="M15.218 4.931a.4.4 0 0 1-.118.132l.012.006a.45.45 0 0 1-.292.074.5.5 0 0 1-.3-.13l-2.02-2.02v7.07c0 .28-.23.5-.5.5s-.5-.22-.5-.5v-7.04l-2 2a.45.45 0 0 1-.57.04h-.02a.4.4 0 0 1-.16-.3.4.4 0 0 1 .1-.32l2.8-2.8a.5.5 0 0 1 .7 0l2.8 2.79a.42.42 0 0 1 .068.498m-.106.138.008.004v-.01zM16 7.063h1.5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-11c-1.1 0-2-.9-2-2v-10a2 2 0 0 1 2-2H8a.5.5 0 0 1 .35.15.5.5 0 0 1 .15.35.5.5 0 0 1-.15.35.5.5 0 0 1-.35.15H6.4c-.5 0-.9.4-.9.9v10.2a.9.9 0 0 0 .9.9h11.2c.5 0 .9-.4.9-.9v-10.2c0-.5-.4-.9-.9-.9H16a.5.5 0 0 1 0-1"
                    clip-rule="evenodd"></path>
            </svg>
            <div class="share-this">
                Share
            </div>
        </button>
    </div>
    <div>
        <a href="<?= $slide_url ?>" class="view_slides flex items-center" target="_blank" title="Download Slides">
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="#5f6368">
                    <path
                        d="M395.38-336.92 618.46-480 395.38-623.08v286.16ZM224.62-160q-27.62 0-46.12-18.5Q160-197 160-224.62v-510.76q0-27.62 18.5-46.12Q197-800 224.62-800h510.76q27.62 0 46.12 18.5Q800-763 800-735.38v510.76q0 27.62-18.5 46.12Q763-160 735.38-160H224.62Zm0-40h510.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93v-510.76q0-9.24-7.69-16.93-7.69-7.69-16.93-7.69H224.62q-9.24 0-16.93 7.69-7.69 7.69-7.69 16.93v510.76q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69ZM200-760v560-560Z" />
                </svg>
            </div>
            <div>Download Slides</div>
        </a>
    </div>
</div>

<?php
        // Get the buffered content
        $output = ob_get_clean();
        return $output;
    }
    return '';
}

function get_all_categories_with_children()
{
    $categories = get_categories(array(
        'orderby' => 'name',
        'order' => 'ASC',
        'hide_empty' => 0,
        'parent' => 0  // Only get top-level (parent) categories
    ));

    $category_list = '<ul>';

    if ($categories) {
        foreach ($categories as $parent_category) {
            $category_list .= '<li class="temp_category_name_first_level"><h3>' . $parent_category->name . '</h3>';

            $child_categories = get_categories(array(
                'orderby' => 'name',
                'order' => 'ASC',
                'hide_empty' => 0,
                'parent' => $parent_category->term_id  // Get children of this parent
            ));

            if ($child_categories) {
                $category_list .= '<ul>';
                foreach ($child_categories as $child_category) {
                    $category_list .= '<li class="fw-bold">' . $child_category->name;

                    $grandchild_categories = get_categories(array(
                        'orderby' => 'name',
                        'order' => 'ASC',
                        'hide_empty' => 0,
                        'parent' => $child_category->term_id  // Get children of this child (grandchildren)
                    ));

                    if ($grandchild_categories) {
                        $category_list .= '<ul>';
                        foreach ($grandchild_categories as $grandchild_category) {
                            $category_list .= '<li class="fw-regular temp_grandchild">' . $grandchild_category->name . '</li>';
                        }
                        $category_list .= '</ul>';
                    }

                    $category_list .= '</li>';
                }
                $category_list .= '</ul>';
            }

            $category_list .= '</li>';
        }
    }

    $category_list .= '</ul>';

    return $category_list;
}

function getPostTitleAndCategory($atts)
{
    // Define default attributes
    $atts = shortcode_atts(
        array(
            'category' => 'awards',  // Default category
        ),
        $atts, 'getPostTitleAndCategory'
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

        // Start output buffer
        ob_start();
?>

<div class="award_post_title flex space-between">
    <div class="post_title">
        <!-- <h1><?= esc_html($post_title) ?></h1> -->
        <h1>Charltons The Legal500 Asia Pacific: Greater China – 2025 Award</h1>
    </div>
    <div class="category_and_date flex flex-col">
        <span class="categ_label fw-bold capitalize"><?= $category_name ?></span>
        <time datetime="<?php echo esc_attr($post_datetime); ?>"><?= esc_html($post_date); ?></time>
        <div class="divider"></div>
        <span id="read_time_est" class="text-gray-500 fw-regular"></span>
    </div>
</div>
<?php
        return ob_get_clean();
    }
    return '';
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
    add_shortcode('related_pages', 'related_post_sc');
    add_shortcode('related_page_item', 'related_pages_sc');
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
    add_shortcode('getPostTitleAndCategory', 'getPostTitleAndCategory');
    add_shortcode('newsletter_scf_custom_fields', 'newsletter_scf_custom_fields');
    add_shortcode('recent_webinars', 'homepage_recent_webinar_sc');
    add_shortcode('share_download', 'share_download_sc');

    add_shortcode('display_categories', 'get_all_categories_with_children');
}