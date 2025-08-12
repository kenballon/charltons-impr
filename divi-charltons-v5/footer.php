<?php
if (et_theme_builder_overrides_layout(ET_THEME_BUILDER_HEADER_LAYOUT_POST_TYPE) || et_theme_builder_overrides_layout(ET_THEME_BUILDER_FOOTER_LAYOUT_POST_TYPE)) {
    // Skip rendering anything as this partial is being buffered anyway.
    // In addition, avoids get_sidebar() issues since that uses
    // locate_template() with require_once.
    return;
}

/**
 * Fires after the main content, before the footer is output.
 *
 * @since 3.10
 */
do_action('et_after_main_content');

if ('on' === et_get_option('divi_back_to_top', 'false')):
    ?>

<span class="et_pb_scroll_top et-pb-icon"></span>

<?php endif;

if (!is_page_template('page-template-blank.php')): ?>
</div>
<footer id="main-footer">
    <?php get_sidebar('footer'); ?>


    <?php
    if (has_nav_menu('footer-menu')):
        ?>

    <div id="et-footer-nav">
        <div class="container flex align-items-center">
            <div class="ftr_left_col flex align-items-center">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'footer-menu',
                    'depth' => '1',
                    'menu_class' => 'bottom-nav',
                    'container' => '',
                    'fallback_cb' => '',
                ));
                ?>
                <span class="ftr_copyright">©Copyright Charltons <?= date('Y') ?>. All rights reserved.</span>
            </div>
            <div class="ftr_right_col ml-auto">
                <div class="social-networks__list flex align-items-center">
                    <div class="social-networks__item">
                        <a class="social-networks__link" href="https://www.facebook.com/charltons/" target="_blank"
                            rel="noopener" aria-label="link goes to facebook">
                            <img style="max-width: 24px" src="/media/icons/social-media/facebook.svg" alt="facebook" />
                        </a>
                    </div>
                    <div class="social-networks__item">
                        <a class="social-networks__link"
                            href="https://www.linkedin.com/company/charltons-law/mycompany/" target="_blank"
                            rel="noopener" aria-label="link goes to LinkedIn">
                            <img style="max-width: 24px; height: 24px; padding-top: 6px"
                                src="https://dev2.charltonslaw.com/static/images/icons/social-media/in.svg"
                                alt="linkedin" />
                        </a>
                    </div>
                    <div class="social-networks__item">
                        <a class="social-networks__link" href="https://www.instagram.com/charltonslaw/" target="_blank"
                            rel="noopener" aria-label="link goes to Instagram">
                            <img style="max-width: 24px" src="/media/icons/social-media/instagram.svg"
                                alt="instagram" />
                        </a>
                    </div>
                    <div class="social-networks__item">
                        <a class="social-networks__link" href="https://www.youtube.com/@charltons-law" target="_blank"
                            rel="noopener" aria-label="link goes to YouTube">
                            <img style="max-width: 24px" src="/media/icons/social-media/youtube.svg" alt="youtube" />
                        </a>
                    </div>
                    <div class="social-networks__item">
                        <a class="social-networks__link" href="https://creators.spotify.com/pod/show/charltons"
                            target="_blank" rel="noopener noreferrer nofollow"
                            aria-label="link goes to Spotify for Creators"
                            title="Spotify for Creators - Charltons Law Podcasts"><img style="max-width: 24px"
                                src="/media/icons/social-media/spotify.svg"
                                alt="Spotify for Creators - Charltons Law Podcasts" /></a>
                    </div>
                    <div class="social-networks__item">
                        <a class="social-networks__link" href="https://rumble.com/c/c-1647355" target="_blank"
                            rel="noopener" aria-label="link goes to Rumble">
                            <img style="max-width: 24px" src="/media/icons/social-media/rumble.svg" alt="rumble" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>
    <!-- <?php echo do_shortcode('[get_all_post_type_data]'); ?> -->

</footer>

<?php endif; // ! is_page_template( 'page-template-blank.php' ) ?>

</div>

<?php wp_footer(); ?>
<script>
(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-58524536-2', 'auto');
ga('set', 'anonymizeIp', true);
ga('send', 'pageview');
</script>

<!-- Yandex.Metrika counter -->

<script type="text/javascript">
(function(m, e, t, r, i, k, a) {
    m[i] = m[i] || function() {
        (m[i].a = m[i].a || []).push(arguments)
    };
    m[i].l = 1 * new Date();
    k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k,
        a)
})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

ym(57540187, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true
});
</script>
</body>

</html>