<div class="search-result">
    <?php

    $paged = (get_query_var('paged')) ? absint(get_query_var('paged')) : 1;

    $s = get_search_query();
    $args = array(
        's' => $s,
        'posts_per_page' => 16,
        'paged' => $paged
    );

    // The Query
    $query = new WP_Query($args);
    if ($query->have_posts()) {
        _e('<h2>Search results for: <span>' . get_query_var('s') . '</span></h2>');
        _e('<ul>');
        while ($query->have_posts()) {
            $query->the_post();

            $featured_img_url = get_the_post_thumbnail_url($query->post->ID, 'full');
            if (!$featured_img_url) {
                $img_content = get_the_content();
                preg_match_all('#\[et_pb_image src="(.*?)"#', $img_content, $match);

                if (!empty($match[0])) {
                    $img_url = str_replace('"1', '', $match[0][0]);
                    $img_url = str_replace('[et_pb_image src="', '', $img_url);
                    $img_url = str_replace('"', '', $img_url);
                    $featured_img_url = $img_url;
                }

                if (!$featured_img_url) {
                    $featured_img_url = '/legal/images/search_charlton_logo.jpg';
                }
            }
            ?>
    <li class="result-item">
        <a href="<?php the_permalink(); ?>" target="_blank"><img src="<?php echo $featured_img_url ?>" /></a>
        <a href="<?php the_permalink(); ?>" target="_blank"><?php the_title() ?></a>
    </li>
    <?php
        }
        _e('</ul>');
    } else {
        ?>
    <h2 style='font-weight:bold;color:#000'>Nothing Found</h2>
    <div class="alert alert-info">
        <p>Sorry, but nothing matched your search criteria. Please try again with some different keywords.</p>
    </div>
    <?php
    }

    $big = 999999999;  // need an unlikely integer
    
    $pagination = '<div class="result-post-paging my-5">Pages: ' . paginate_links(array(
        'base' => str_replace($big, '%#%', esc_url(get_pagenum_link($big))),
        'format' => '?paged=%#%',
        'current' => max(1, get_query_var('paged')),
        'total' => $query->max_num_pages
    )) . '</div>';

    echo $pagination;

    ?>
</div>