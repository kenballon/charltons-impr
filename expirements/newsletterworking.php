<?php

function get_newsletters_posts_sc($atts)
{
    // Set default attributes
    $atts = shortcode_atts(
        [
            "category" => "hong-kong-law",
            "posts_per_page" => -1,
            "search" => "",
        ],
        $atts,
        "newsletters_posts"
    );

    // Query arguments
    $args = [
        "category_name" => $atts["category"],
        "post_status" => "publish",
        "has_password" => false,
        "posts_per_page" => $atts["posts_per_page"],
        "meta_query" => [
            [
                "key" => "_wp_trash_meta_status",
                "compare" => "NOT EXISTS",
            ],
        ],
    ];

    if (!empty($atts["category"])) {
        $args["category_name"] = $atts["category"];
    }

    if (!empty($atts["search"])) {
        $args["s"] = sanitize_text_field($atts["search"]);
    }

    // The Query
    $query = new WP_Query($args);

    ob_start();

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

            if (!$image_src) {
                continue; // Skip posts without a thumbnail image
            }
            ?>

<article class="newsletter_post_item flex-col" data-nl_date="<?= esc_html(
    $post_date
) ?> "
    data-category="<?= esc_attr($atts["category"]) ?>">
    <div class="post-thumbnail">
        <img src="<?php echo esc_url(
            $image_src[0]
        ); ?>" alt="<?php echo esc_attr($image_alt); ?>" width="286"
            height="286" loading="lazy" fetchpriority="high">
        <h2 class="post-title" title="<?php echo esc_html($post_title); ?>">
            <a class="" href="<?php echo esc_url($post_url); ?>">
                <?php echo esc_html($post_title); ?>
            </a>
        </h2>
        <?php if (!empty($post_excerpt)): ?>
        <div class="post-excerpt"><?php echo esc_html($post_excerpt); ?></div>
        <?php else: ?>
        <div class="post-excerpt"></div>
        <?php endif; ?>
        <a class="cta-gridview" href="<?php echo esc_url(
            $post_url
        ); ?>">Read Newsletter</a>
    </div>
    <div class="newsletter_post_text_contents mt-auto">
        <a class="read-newsletter-button" href="<?php echo esc_url(
            $post_url
        ); ?>">Read Newsletter</a>
    </div>
</article>

<?php
        }
    } else {
        echo "<p>No newsletters found. Please select another category.</p>";
    }

    // Restore original Post Data
    wp_reset_postdata();

    return ob_get_clean();
}
