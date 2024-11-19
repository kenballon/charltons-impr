<?php

function get_cached_post_data($post_type = 'post', $cache_duration = HOUR_IN_SECONDS)
{
    // Define a unique transient key based on the post type
    $transient_key = sprintf('cached_%s_data', $post_type);

    // Attempt to retrieve data from the transient
    $cached_data = get_transient($transient_key);

    if (false === $cached_data) {
        // Query the posts if no cached data exists
        $query = new WP_Query([
            'post_type' => $post_type,
            'posts_per_page' => 10,  // Adjust as needed
            'post_status' => 'publish',
            'has_password' => false,
            'meta_query' => [
                [
                    'key' => '_thumbnail_id',
                    'compare' => 'EXISTS'
                ]
            ]
        ]);

        $cached_data = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();

                // Check if the post has a featured image
                if (has_post_thumbnail()) {
                    $cached_data[] = [
                        'featured_image' => get_the_post_thumbnail_url(get_the_ID(), 'medium_large'),
                        'post_date' => get_the_date(),
                        'categories' => get_the_category_list(', '),
                        'tags' => get_the_tag_list('', ', '),
                        'title' => get_the_title(),
                        'excerpt' => get_the_excerpt(),
                        'url' => get_permalink(),
                    ];
                }
            }
            wp_reset_postdata();
        }

        // Store the data in the transient
        set_transient($transient_key, $cached_data, $cache_duration);
    }

    return $cached_data;
}
