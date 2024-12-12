<?php get_header(); ?>

<main id="site-content" class="main_categ_tag_wrapper flex flex-col items-center gap-4">

    <?php if (have_posts()): ?>
    <header class="archive_header_hero">
        <div>
            <h1 class="archive-title"><?php single_tag_title(); ?></h1>
        </div>
    </header>

    <div class="categ_tag_list_archived grid gap-2">
        <div class="flex flex-col item-center">
            <?php while (have_posts()):
                the_post(); ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class('article_archive_post_item flex gap-2'); ?>>
                <?php if (has_post_thumbnail()): ?>
                <div class="post-thumbnail">
                    <a href="<?php the_permalink(); ?>">
                        <?php
                        $thumbnail_id = get_post_thumbnail_id();
                        $alt_text = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
                        $image_metadata = wp_get_attachment_metadata($thumbnail_id);
                        $width = isset($image_metadata['width']) ? $image_metadata['width'] : '';
                        $height = isset($image_metadata['height']) ? $image_metadata['height'] : '';
                        echo wp_get_attachment_image($thumbnail_id, 'thumbnail', false, array(
                            'decoding' => 'async',
                            'width' => $width,
                            'height' => $height,
                            'alt' => $alt_text
                        ));
                        ?>
                    </a>
                </div>
                <?php endif; ?>
                <div class="flex flex-col">
                    <header class="entry-header">
                        <h2 class="entry-title text-sm"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h2>
                    </header>
                    <div class="entry-summary fw-regular text-xs">
                        <?= wp_trim_words(get_the_excerpt(), 15, '...'); ?>
                    </div>
                </div>
            </article>
            <?php endwhile; ?>
        </div>

        <div class="post-tags">
            <h2 class="text-xs uppercase mb-2">Other topics that might interest you:</h2>
            <?php
            $all_tags = get_tags();
            if ($all_tags) {
                foreach ($all_tags as $tag) {
                    echo '<a href="' . get_tag_link($tag->term_id) . '" class="tag-link">' . $tag->name . '</a> ';
                }
            }
            ?>

        </div>

    </div>

    <?php the_posts_pagination(); ?>

    <?php else: ?>
    <header class="archive_header_hero">
        <div>
            <h1 class="archive-title"><?php single_tag_title(); ?></h1>
        </div>
    </header>
    <div class="flex items-center" style="height: 50vh;">
        <h2>No content available at this time. Please check back later for updates.
        </h2>
    </div>
    <?php endif; ?>

</main>

<?php get_sidebar(); ?>
<?php get_footer(); ?>