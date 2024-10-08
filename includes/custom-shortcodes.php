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
        'post__not_in' => [$current_post_id]  // Exclude current post
    ];

    // Run the query
    $related_query = new WP_Query($args);

    // Start output buffering
    ob_start();

    if ($related_query->have_posts()) {
        echo '<aside class="related-pages">';
        $count = 0;
        while ($related_query->have_posts() && $count < $number_of_pages_list) {
            $related_query->the_post();

            if (!has_post_thumbnail()) {
                continue;
            }

            $count++;

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

// SEARCH FUNCTION

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
    $args = [
        's' => $search_query,
        'post_type' => 'post',  // Include both posts and pages
        'posts_per_page' => 3
    ];
    $search_query = new WP_Query($args);

    if ($search_query->have_posts()):
        while ($search_query->have_posts()):
            $search_query->the_post();
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
        echo '<li>No results found</li>';
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
    $atts = shortcode_atts(
        [
            'category' => 'news',
            'num_posts' => 5,
        ],
        $atts,
        'get_recent_news_posts'
    );

    $newsEventsPosts = new ContentPosts($atts['category']);
    $posts = $newsEventsPosts->getPosts($atts['num_posts']);

    $output = '';
    foreach ($posts as $post) {
        $output .= '<article class="featured_new_post grid gap-2">';
        $output .= '<div class="featured_new_post_img">';
        $output .= '<img src="' . $post['featured_image'] . '" alt="image of a news' . $post['title'] . '" width="500" height="500" />';
        $output .= '</div>';
        $output .= '<div class="featured_new_post_content flex item-center flex-col justify-center">';
        $output .= '<div class="date_container fw-regular">' . $post['date'] . '</div>';
        $output .= '<a href="' . $post['url'] . '" aria-label="' . $post['title'] . '">';
        $output .= '<h2>' . $post['title'] . '</h2>';
        $output .= '</a>';
        $output .= '<p class="fw-regular">' . $post['excerpt'] . '</p>';
        $output .= '</div>';
        $output .= '</article>';
    }

    return $output;
}

function getRecentPostWithOffset($atts)
{
    $atts = shortcode_atts(
        [
            'offset' => 0,
            'num_posts' => 10,
            'category' => 'news',
        ],
        $atts,
        'getRecentPostWithOffset'
    );

    $newsEventsPosts = new ContentPosts($atts['category']);
    $posts = $newsEventsPosts->getPosts($atts['num_posts'], $atts['offset']);

    $output = '';
    foreach ($posts as $post) {
        $output .= '<article class="feat_news_card_item">';
        $output .= '<a href="' . $post['url'] . '" aria-label="' . $post['title'] . '" class="newsevents_anchorlink flex items-center">';
        $output .= '<div class="card_item_content">';
        $output .= '<div class="date_container fw-regular">' . $post['date'] . '</div>';
        $output .= '<h2 class="newsevents__post-title">' . $post['title'] . '</h2>';
        $output .= '</div>';
        $output .= '</a>';
        $output .= '</article>';
    }

    return $output;
}

function getNewsEventsPosts($atts)
{
    // Extract shortcode attributes
    $atts = shortcode_atts(
        [
            'category' => 'news',
            'num_posts' => -1,  // Fetch all posts
            'posts_per_page' => 12,  // Display 12 posts per page
            'featImgSize' => 'medium_large',
            'dateFormat' => 'd M Y',
        ],
        $atts,
        'news_posts'
    );

    // Create an instance of ContentPosts
    $newsEventsPosts = new ContentPosts($atts['category'], null, $atts['featImgSize'], $atts['dateFormat']);

    // Fetch posts
    $posts = $newsEventsPosts->getPosts($atts['num_posts']);

    // Generate the HTML string
    $articleCard = '';
    foreach ($posts as $post) {
        $tags = implode(', ', $post['tags']);
        $articleCard .= '<article class="news_article_wrapper d-none" aria-hidden="true">';
        $articleCard .= '<input type="hidden" class="newsevents_hidden_input" id="' . $post['id'] . '" value="' . $tags . '">';
        $articleCard .= '<div class="news_card_image">';
        $articleCard .= '<a href="' . $post['url'] . '" aria-label="' . $post['title'] . ' " title="Go to ' . $post['title'] . '" rel="noopener noreferrer" target="_blank">';
        $articleCard .= '<img src="' . $post['featured_image'] . '" alt="' . $post['title'] . '" width="320" height="320" loading="lazy" class="border-1">';
        $articleCard .= '</a>';
        $articleCard .= '</div>';
        $articleCard .= '<div class="news_card_content">';
        $articleCard .= '<div class="newsevents__post_date">' . $post['date'] . '</div>';
        $articleCard .= '<a href="' . $post['url'] . '" aria-label="' . $post['title'] . ' " title="Go to ' . $post['title'] . '" rel="noopener noreferrer" target="_blank">';
        $articleCard .= '<h2 class="newsevents__post_title text-medium fw-regular">' . $post['title'] . '</h2>';
        $articleCard .= '</a>';
        $articleCard .= '</div>';
        $articleCard .= '</article>';
    }

    // Return the HTML string
    return $articleCard;
}

// Register custom shortcodes.

function register_custom_shortcodes()
{
    add_shortcode('related_pages', 'related_pages_shortcode');
    add_shortcode('get_recent_post_item', 'get_latest_post_details');
    add_shortcode('get_post_url', 'get_post_details_by_url');
    add_shortcode('custom_search_form', 'custom_search_form_shortcode');
    add_shortcode('get_recent_news_posts', 'get_recent_news_posts');
    add_shortcode('get_post_with_offset', 'getRecentPostWithOffset');
    add_shortcode('content_posts', 'getNewsEventsPosts');
}

add_action('init', 'register_custom_shortcodes');
add_action('wp_ajax_ajax_search', 'ajax_search');
add_action('wp_ajax_nopriv_ajax_search', 'ajax_search');
add_action('wp_ajax_ajax_latest_posts', 'ajax_latest_posts');
add_action('wp_ajax_nopriv_ajax_latest_posts', 'ajax_latest_posts');
