<?php

function get_newsletters_posts_sc()
{
    // Set default attributes
    $atts = [
        "posts_per_page" => isset($_GET["posts_per_page"])
            ? intval($_GET["posts_per_page"])
            : -1,
        "search" => isset($_GET["search"])
            ? sanitize_text_field($_GET["search"])
            : "",
        "post_type" => isset($_GET["post_type"])
            ? sanitize_text_field($_GET["post_type"])
            : "post",
    ];

    // Query arguments
    $args = [
        "post_status" => "publish",
        "has_password" => false,
        "posts_per_page" => $atts["posts_per_page"],
        "post_type" => $atts["post_type"],
        "meta_query" => [
            [
                "key" => "_wp_trash_meta_status",
                "compare" => "NOT EXISTS",
            ],
        ],
    ];

    if (!empty($atts["search"])) {
        $args["s"] = sanitize_text_field($atts["search"]);
    }

    // The Query
    $query = new WP_Query($args);

    $posts_data = [];

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_title = get_the_title();
            $post_url = get_permalink();
            $post_date = get_the_date("d M Y");
            $post_excerpt = wp_trim_words(
                strip_shortcodes(wp_strip_all_tags(get_the_excerpt())),
                40,
                "..."
            );

            $image_id = get_post_thumbnail_id();
            $image_alt = get_post_meta(
                $image_id,
                "_wp_attachment_image_alt",
                true
            );

            if (empty($image_alt)) {
                $image_alt = get_the_title();
            }

            $image_src = wp_get_attachment_image_src($image_id, "medium_large");

            $posts_data[] = [
                "title" => $post_title,
                "url" => $post_url,
                "date" => $post_date,
                "excerpt" => $post_excerpt,
                "image_src" => $image_src[0],
                "image_alt" => $image_alt,
                "category" => get_the_category_list(", "),
            ];
        }
    }

    // Restore original Post Data
    wp_reset_postdata();

    echo json_encode($posts_data);
    wp_die(); // this is required to terminate immediately and return a proper response
}

add_action("wp_ajax_get_newsletters_posts", "get_newsletters_posts_sc");
add_action("wp_ajax_nopriv_get_newsletters_posts", "get_newsletters_posts_sc");
