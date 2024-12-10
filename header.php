<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>" />
    <?php
    elegant_description();
    elegant_keywords();
    elegant_canonical();

    /**
     * Fires in the head, before {@see wp_head()} is called. This action can be used to
     * insert elements into the beginning of the head before any styles or scripts.
     *
     * @since 1.0
     */
    do_action('et_head_meta');

    $template_directory_uri = get_template_directory_uri();
    ?>

    <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />

    <script type="text/javascript">
    document.documentElement.className = 'js';
    </script>

    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

    <?php
    $product_tour_enabled = et_builder_is_product_tour_enabled();
    $page_container_style = $product_tour_enabled ? ' style="padding-top: 0px;"' : '';
    ?>
    <div id="page-container" <?php echo et_core_intentionally_unescaped($page_container_style, 'fixed_string'); ?>>
        <?php
        if ($product_tour_enabled || is_page_template('page-template-blank.php')) {
            return;
        }

        $et_secondary_nav_items = et_divi_get_top_nav_items();

        $et_phone_number = $et_secondary_nav_items->phone_number;

        $et_email = $et_secondary_nav_items->email;

        $et_contact_info_defined = $et_secondary_nav_items->contact_info_defined;

        $show_header_social_icons = $et_secondary_nav_items->show_header_social_icons;

        $et_secondary_nav = $et_secondary_nav_items->secondary_nav;

        $et_top_info_defined = $et_secondary_nav_items->top_info_defined;

        $et_slide_header = 'slide' === et_get_option('header_style', 'left') || 'fullscreen' === et_get_option('header_style', 'left') ? true : false;
        ?>

        <?php if ($et_top_info_defined && !$et_slide_header || is_customize_preview()): ?>
        <?php ob_start(); ?>
        <div id="top-header" <?php echo $et_top_info_defined ? '' : 'style="display: none;"'; ?>>
            <div class="container clearfix">

                <?php if ($et_contact_info_defined): ?>

                <div id="et-info">
                    <?php if ('' !== ($et_phone_number = et_get_option('phone_number'))): ?>
                    <span
                        id="et-info-phone"><?php echo et_core_esc_previously(et_sanitize_html_input_text($et_phone_number)); ?></span>
                    <?php endif; ?>

                    <?php if ('' !== ($et_email = et_get_option('header_email'))): ?>
                    <a href="<?php echo esc_attr('mailto:' . $et_email); ?>"><span
                            id="et-info-email"><?php echo esc_html($et_email); ?></span></a>
                    <?php endif; ?>

                    <?php
                    if (true === $show_header_social_icons) {
                        get_template_part('includes/social_icons', 'header');
                    }
                    ?>
                </div> <!-- #et-info -->

                <?php endif; // true === $et_contact_info_defined ?>

                <div id="et-secondary-menu">
                    <?php
                    if (!$et_contact_info_defined && true === $show_header_social_icons) {
                        get_template_part('includes/social_icons', 'header');
                    } else if ($et_contact_info_defined && true === $show_header_social_icons) {
                        ob_start();

                        get_template_part('includes/social_icons', 'header');

                        $duplicate_social_icons = ob_get_contents();

                        ob_end_clean();

                        printf(
                            "<div class=\"et_duplicate_social_icons\">
\t\t\t\t\t\t\t\t%1\$s
\t\t\t\t\t\t\t</div>",
                            et_core_esc_previously($duplicate_social_icons)
                        );
                    }

                    if ('' !== $et_secondary_nav) {
                        echo et_core_esc_wp($et_secondary_nav);
                    }

                    et_show_cart_total();
                    ?>
                </div> <!-- #et-secondary-menu -->

            </div> <!-- .container -->
        </div> <!-- #top-header -->
        <?php
        $top_header = ob_get_clean();

        /**
         * Filters the HTML output for the top header.
         *
         * @since 3.10
         *
         * @param string $top_header
         */
        echo et_core_intentionally_unescaped(apply_filters('et_html_top_header', $top_header), 'html');
        ?>
        <?php endif; // true ==== $et_top_info_defined ?>

        <?php if ($et_slide_header || is_customize_preview()): ?>
        <?php ob_start(); ?>
        <div class="et_slide_in_menu_container">
            <?php if ('fullscreen' === et_get_option('header_style', 'left') || is_customize_preview()) { ?>
            <span class="mobile_menu_bar et_toggle_fullscreen_menu"></span>
            <?php } ?>

            <?php
            if ($et_contact_info_defined || true === $show_header_social_icons || false !== et_get_option('show_search_icon', true) || class_exists('woocommerce') || is_customize_preview()) {
                ?>
            <div class="et_slide_menu_top">

                <?php if ('fullscreen' === et_get_option('header_style', 'left')) { ?>
                <div class="et_pb_top_menu_inner">
                    <?php } ?>
                    <?php
            }

            if (true === $show_header_social_icons) {
                get_template_part('includes/social_icons', 'header');
            }

            et_show_cart_total();
            ?>
                    <?php if (false !== et_get_option('show_search_icon', true) || is_customize_preview()): ?>
                    <?php if ('fullscreen' !== et_get_option('header_style', 'left')) { ?>
                    <div class="clear"></div>
                    <?php } ?>
                    <form role="search" method="get" class="et-search-form"
                        action="<?php echo esc_url(home_url('/')); ?>">
                        <?php
                        printf("<input type=\"search\" class=\"et-search-field\" placeholder=\"%1\$s\" value=\"%2\$s\" name=\"s\" title=\"%3\$s\" />
\t\t\t\t\t\t\t<input type=\"hidden\" name=\"section\" value=\"site\" />
\t\t\t\t\t\t",
                            esc_attr__('Search &hellip;', 'Divi'),
                            get_search_query(),
                            esc_attr__('Search for:', 'Divi'));

                        /**
                         * Fires inside the search form element, just before its closing tag.
                         *
                         * @since ??
                         */
                        do_action('et_search_form_fields');
                        ?>
                        <button type="submit" id="searchsubmit_header"></button>
                    </form>
                    <?php endif; // true === et_get_option( 'show_search_icon', false ) ?>

                    <?php if ($et_contact_info_defined): ?>

                    <div id="et-info">
                        <?php if ('' !== ($et_phone_number = et_get_option('phone_number'))): ?>
                        <span
                            id="et-info-phone"><?php echo et_core_esc_previously(et_sanitize_html_input_text($et_phone_number)); ?></span>
                        <?php endif; ?>

                        <?php if ('' !== ($et_email = et_get_option('header_email'))): ?>
                        <a href="<?php echo esc_attr('mailto:' . $et_email); ?>"><span
                                id="et-info-email"><?php echo esc_html($et_email); ?></span></a>
                        <?php endif; ?>
                    </div> <!-- #et-info -->

                    <?php endif; // true === $et_contact_info_defined ?>
                    <?php if ($et_contact_info_defined || true === $show_header_social_icons || false !== et_get_option('show_search_icon', true) || class_exists('woocommerce') || is_customize_preview()) { ?>
                    <?php if ('fullscreen' === et_get_option('header_style', 'left')) { ?>
                </div> <!-- .et_pb_top_menu_inner -->
                <?php } ?>

            </div> <!-- .et_slide_menu_top -->
            <?php } ?>

            <div class="et_pb_fullscreen_nav_container">
                <?php
                $slide_nav = '';
                $slide_menu_class = 'et_mobile_menu';

                $slide_nav = wp_nav_menu(array(
                    'theme_location' => 'primary-menu',
                    'container' => '',
                    'fallback_cb' => '',
                    'echo' => false,
                    'items_wrap' => '%3$s'
                ));
                $slide_nav .= wp_nav_menu(array(
                    'theme_location' => 'secondary-menu',
                    'container' => '',
                    'fallback_cb' => '',
                    'echo' => false,
                    'items_wrap' => '%3$s'
                ));
                ?>

                <ul id="mobile_menu_slide" class="<?php echo esc_attr($slide_menu_class); ?>">

                    <?php
                    if ('' === $slide_nav):
                        ?>
                    <?php if ('on' === et_get_option('divi_home_link')) { ?>
                    <li <?php if (is_home()) echo ('class="current_page_item"'); ?>><a
                            href="<?php echo esc_url(home_url('/')); ?>"><?php esc_html_e('Home', 'Divi'); ?></a>
                    </li>
                    <?php }; ?>

                    <?php show_page_menu($slide_menu_class, false, false); ?>
                    <?php show_categories_menu($slide_menu_class, false); ?>
                    <?php
                    else:
                        echo et_core_esc_wp($slide_nav);
                    endif;
                    ?>

                </ul>
            </div>
        </div>
        <?php
        $slide_header = ob_get_clean();

        /**
         * Filters the HTML output for the slide header.
         *
         * @since 3.10
         *
         * @param string $top_header
         */
        echo et_core_intentionally_unescaped(apply_filters('et_html_slide_header', $slide_header), 'html');
        ?>
        <?php endif; // true ==== $et_slide_header ?>

        <?php ob_start(); ?>

        <header id="main-header" class="flex align-items-center gap-4">
            <!-- charltons customizations : 2024 -->
            <?php
            if (function_exists('get_custom_nav_menu')) {
                $menu_array = get_custom_nav_menu('primary-menu');
            }
            ?>
            <div class="logo_wrapper flex align-items-center">
                <?php
                $logo = ($user_logo = et_get_option('divi_logo')) && !empty($user_logo)
                    ? $user_logo
                    : $template_directory_uri . '/images/logo.png';

                ob_start();
                ?>

                <a href="<?php echo esc_url(home_url('/')); ?>" class="d-block relative">
                    <img src="<?php echo esc_attr($logo); ?>" alt="<?php echo esc_attr(get_bloginfo('name')); ?>"
                        id="logo"
                        data-height-percentage="<?php echo esc_attr(et_get_option('logo_height', '54')); ?>" />
                </a>

                <?php
                $logo_container = ob_get_clean();

                /**
                 * Filters the HTML output for the logo container.
                 *
                 * @since 3.10
                 *
                 * @param string $logo_container
                 */
                echo et_core_intentionally_unescaped(apply_filters('et_html_logo_container', $logo_container), 'html');
                ?>
            </div>

            <div class="header_nav_div_wrapper">

                <div class="nav_search_wrapper align-items-center space-between">
                    <!-- 2024 NEW MENU NAVIGATION BY: KENNETH BALLON -->
                    <?php if ($menu_array): ?>
                    <nav class="header_navigation" tabindex="0">
                        <ul class="parent_ul gap-1">
                            <?php foreach ($menu_array as $parent_id => $parent_item): ?>
                            <li class="nav_parent_list_item px-1" data-parentlistid="submenu_id_<?= $parent_id ?>">
                                <a href="<?= esc_url($parent_item['item']->url) ?>"
                                    class="parent_link flex align-items-center">
                                    <span class="d-block"><?= esc_html($parent_item['item']->title) ?></span>
                                    <?php if (!empty($parent_item['subchildren'])): ?>
                                    <span class="down_arrow_wrapper flex align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                            width="24px">
                                            <path d="M480-380 276-584l20-20 184 184 184-184 20 20-204 204Z" />
                                        </svg>
                                    </span>
                                    <?php endif; ?>
                                </a>

                                <?php if (!empty($parent_item['subchildren'])): ?>
                                <div class="submenu_wrapper flex" id="submenu_id_<?= $parent_id ?>">
                                    <div class="submenu_ul_group_wrapper children">
                                        <ul class="child_ul">
                                            <?php foreach ($parent_item['subchildren'] as $child_id => $child_item): ?>
                                            <?php if (!empty($child_item['grandchildren'])): ?>
                                            <li class="nav_child_list_item pr-4">
                                                <div class="link_wrapper flex align-items-center space-between">
                                                    <a href="<?= esc_url($child_item['children-item']->url) ?>"
                                                        class="child_link"
                                                        aria-label=" <?= esc_html($child_item['children-item']->title) ?>">
                                                        <?= esc_html($child_item['children-item']->title) ?>
                                                    </a>
                                                    <div class="btn_wrapper">
                                                        <button type="button" id="id_<?= $child_id ?>"
                                                            title="open additional links">
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px"
                                                                viewBox="0 -960 960 960" width="20px">
                                                                <path
                                                                    d="M460-460H240v-40h220v-220h40v220h220v40H500v220h-40v-220Z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>

                                            <?php else: ?>
                                            <li class="nav_child_list_item">
                                                <div class="link_wrapper">
                                                    <a href="<?= esc_url($child_item['children-item']->url) ?>"
                                                        class="child_link"
                                                        aria-label=" <?= esc_html($child_item['children-item']->title) ?>">
                                                        <?= esc_html($child_item['children-item']->title) ?>
                                                    </a>
                                                </div>
                                            </li>
                                            <?php endif; ?>
                                            <?php endforeach; ?>
                                        </ul>
                                    </div>
                                    <div class="submenu_ul_group_wrapper grand_children">
                                        <?php foreach ($parent_item['subchildren'] as $child_id => $child_item): ?>
                                        <?php if (!empty($child_item['grandchildren'])): ?>
                                        <ul class="grandchild_ul" id="id_<?= $child_id ?>">
                                            <?php foreach ($child_item['grandchildren'] as $grandchild_id => $grandchild_item): ?>
                                            <li class="grandchild_list_item">
                                                <a href="<?= esc_url($grandchild_item['grandchildren-item']->url) ?>"
                                                    aria-label="<?= esc_html($grandchild_item['grandchildren-item']->title) ?>">
                                                    <?= esc_html($grandchild_item['grandchildren-item']->title) ?>
                                                </a>
                                            </li>
                                            <?php endforeach; ?>
                                        </ul>
                                        <?php endif; ?>
                                        <?php endforeach; ?>
                                    </div>
                                    <div class="card-post relative gap-2">
                                        <?php foreach ($parent_item['subchildren'] as $child_id => $child_item): ?>
                                        <?php if (!empty($child_item['grandchildren'])): ?>
                                        <?php foreach ($child_item['grandchildren'] as $grandchild_id => $grandchild_item): ?>
                                        <?php echo do_shortcode('[get_post_url url="' . $grandchild_item['grandchildren-item']->url . '"  include_thumbnail="yes"]'); ?>
                                        <?php endforeach; ?>
                                        <?php endif; ?>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                                <?php endif; ?>
                            </li>
                            <?php endforeach; ?>
                        </ul>
                        <!-- show on small devices -->
                        <div class="mobile_nav_show default">
                            <ul class="parent_ul_sm">

                                <?php foreach ($menu_array as $parent_id => $parent_item): ?>

                                <li class="nav_parent_list_item_sm">

                                    <?php if (!empty($parent_item['subchildren'])): ?>
                                    <div class="mobile_parent_link_wrapper flex space-between">
                                        <a href="<?= esc_url($parent_item['item']->url) ?>" class="d-block text-white ">
                                            <?= esc_html($parent_item['item']->title) ?>
                                        </a>
                                        <div class="sm_plus_icon d-block text-white flex align-items-center content-center"
                                            style="width:34px; height:34px;" data-smiconplus="id_<?= $parent_id ?>">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="16px"
                                                viewBox="0 -960 960 960" width="16px" fill="white">
                                                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                                            </svg>
                                        </div>
                                    </div>


                                    <?php else: ?>
                                    <a href="<?= esc_url($parent_item['item']->url) ?>" class="d-block text-white ">
                                        <?= esc_html($parent_item['item']->title) ?>
                                    </a>
                                    <?php endif; ?>

                                    <?php if (!empty($parent_item['subchildren'])): ?>
                                    <ul class="child_ul_sm" id="id_<?= $parent_id ?>">
                                        <?php foreach ($parent_item['subchildren'] as $child_id => $child_item): ?>
                                        <li class="nav_child_list_item_sm" data-childlistid="id_<?= $child_id ?>">
                                            <?php if (!empty($child_item['grandchildren'])): ?>
                                            <div class="mobile_child_link_wrapper flex space-between">
                                                <a href="<?= esc_url($child_item['children-item']->url) ?>"
                                                    aria-label=" <?= esc_html($child_item['children-item']->title) ?>">
                                                    <?= esc_html($child_item['children-item']->title) ?>
                                                </a>
                                                <div class="sm_plus_icon_child d-block text-white flex align-items-center content-center"
                                                    style="width:34px; height:34px;"
                                                    data-childsmicon="id_<?= $child_id ?>">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="16px"
                                                        viewBox="0 -960 960 960" width="16px" fill="white">
                                                        <path
                                                            d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <?php else: ?>
                                            <a href="<?= esc_url($child_item['children-item']->url) ?>"
                                                aria-label=" <?= esc_html($child_item['children-item']->title) ?>">
                                                <?= esc_html($child_item['children-item']->title) ?>
                                            </a>
                                            <?php endif; ?>

                                            <?php if (!empty($child_item['grandchildren'])): ?>
                                            <ul class="grandchild_ul_sm" id="id_<?= $child_id ?>">
                                                <?php foreach ($child_item['grandchildren'] as $grandchild_id => $grandchild_item): ?>
                                                <li class="grandchild_list_item_sm">
                                                    <a href="<?= esc_url($grandchild_item['grandchildren-item']->url) ?>"
                                                        aria-label="<?= esc_html($grandchild_item['grandchildren-item']->title) ?>">
                                                        <?= esc_html($grandchild_item['grandchildren-item']->title) ?>
                                                    </a>
                                                </li>
                                                <?php endforeach; ?>
                                            </ul>
                                            <?php endif; ?>
                                        </li>
                                        <?php endforeach; ?>
                                    </ul>
                                    <?php endif; ?>
                                </li>
                                <?php endforeach; ?>

                                <div class="lang_version_mobile">
                                    <a href="https://www.charltonslaw.com.cn/" target="_self" rel="noopener"
                                        class="d-block text-white ">中文</a>
                                </div>
                                <div class="social_icon_block_header">
                                    <a class="social-networks__link d-block" href="https://www.facebook.com/charltons/"
                                        target="_blank" rel="noopener">
                                        <img style="max-width: 24px;" src="/media/icons/social-media/facebook.svg"
                                            alt="facebook">
                                    </a>
                                    <a class="social-networks__link d-block"
                                        href="https://www.linkedin.com/company/charltons-law/mycompany/" target="_blank"
                                        rel="noopener">
                                        <img style="max-width: 24px;"
                                            src="https://dev2.charltonslaw.com/static/images/icons/social-media/in.svg"
                                            alt="linkedin">
                                    </a>
                                    <a class="social-networks__link d-block"
                                        href="https://www.instagram.com/charltonslaw/" target="_blank" rel="noopener">
                                        <img style="max-width: 24px;" src="/media/icons/social-media/instagram.svg"
                                            alt="instagram">
                                    </a>
                                    <a class="social-networks__link d-block"
                                        href="https://www.youtube.com/@charltons-law" target="_blank" rel="noopener">
                                        <img style="max-width: 24px;" src="/media/icons/social-media/youtube.svg"
                                            alt="youtube">
                                    </a>
                                    <a class="social-networks__link d-block"
                                        href="https://creators.spotify.com/pod/show/charltons" target="_blank"
                                        rel="noopener noreferrer nofollow"><img style="max-width: 24px;"
                                            src="/media/icons/social-media/spotify.svg"
                                            alt="Spotify for Creators - Charltons Law Podcasts"></a>
                                    <a class="social-networks__link d-block" href="https://rumble.com/c/c-1647355"
                                        target="_blank" rel="noopener">
                                        <img style="max-width: 24px;" src="/media/icons/social-media/rumble.svg"
                                            alt="rumble">
                                    </a>
                                </div>
                                <div class="flex align-items-center content-center pt-3">
                                    <small class="text-center text-white text-sm fw-light">©Copyright
                                        Charltons 2024. All rights
                                        reserved.</small>
                                </div>
                            </ul>
                        </div>
                    </nav>
                    <?php endif; ?>

                    <div class="nav_right_col flex gap-2 ml-auto relative">
                        <!-- .container -->
                        <div class="search-and-social flex align-items-center">
                            <div class="social_icon_block_header lg_show">
                                <a class="social-networks__link d-block" href="https://www.facebook.com/charltons/"
                                    target="_blank" rel="noopener">
                                    <img style="max-width: 24px;" src="/media/icons/social-media/facebook.svg"
                                        alt="facebook">
                                </a>
                                <a class="social-networks__link d-block"
                                    href="https://www.linkedin.com/company/charltons-law/mycompany/" target="_blank"
                                    rel="noopener">
                                    <img style="max-width: 24px;"
                                        src="https://dev2.charltonslaw.com/static/images/icons/social-media/in.svg"
                                        alt="linkedin">
                                </a>
                                <a class="social-networks__link d-block" href="https://www.instagram.com/charltonslaw/"
                                    target="_blank" rel="noopener">
                                    <img style="max-width: 24px;" src="/media/icons/social-media/instagram.svg"
                                        alt="instagram">
                                </a>
                                <a class="social-networks__link d-block" href="https://www.youtube.com/@charltons-law"
                                    target="_blank" rel="noopener">
                                    <img style="max-width: 24px;" src="/media/icons/social-media/youtube.svg"
                                        alt="youtube">
                                </a>
                                <a class="social-networks__link d-block"
                                    href="https://creators.spotify.com/pod/show/charltons" target="_blank"
                                    rel="noopener noreferrer nofollow">
                                    <img style="max-width: 24px;" src="/media/icons/social-media/spotify.svg"
                                        alt="Spotify for Creators">
                                </a>
                                <a class="social-networks__link d-block" href="https://rumble.com/c/c-1647355"
                                    target="_blank" rel="noopener">
                                    <img style="max-width: 24px;" src="/media/icons/social-media/rumble.svg"
                                        alt="rumble">
                                </a>
                            </div>

                            <div class="search_icon_wrapper">
                                <button type="button" aria-label="search button" id="showsearchinput">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                        width="24px" fill="#ffffff">
                                        <path
                                            d="M779.38-153.85 528.92-404.31q-30 25.54-69 39.54t-78.38 14q-96.1 0-162.67-66.53-66.56-66.53-66.56-162.57 0-96.05 66.53-162.71 66.53-66.65 162.57-66.65 96.05 0 162.71 66.56Q610.77-676.1 610.77-580q0 41.69-14.77 80.69t-38.77 66.69l250.46 250.47-28.31 28.3ZM381.54-390.77q79.61 0 134.42-54.81 54.81-54.8 54.81-134.42 0-79.62-54.81-134.42-54.81-54.81-134.42-54.81-79.62 0-134.42 54.81-54.81 54.8-54.81 134.42 0 79.62 54.81 134.42 54.8 54.81 134.42 54.81Z" />
                                    </svg>
                                </button>

                            </div>

                            <div class="lang_version">
                                <a href="https://www.charltonslaw.com.cn/" target="_self" rel="noopener"
                                    class="text-white ">中文</a>
                            </div>
                            <div class="mobile_btn_nav_reveal text-white  uppercase" id="menuMobileButton" type="button"
                                role="button" title="mobile menu" data-menu-reveal="no">
                                <span class="default_mobile_menu flex align-items-center">
                                    <svg width="30" height="31" viewBox="0 0 30 31" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 7.5H30" />
                                        <path d="M0 15.5H30" />
                                        <path d="M0 23.5H30" />
                                    </svg>
                                </span>
                                <span class="close_mobile_menu">
                                    <svg width="23" height="23" viewBox="0 0 23 23" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L22.319 22.1069" />
                                        <path d="M1 22L22.319 0.893129" />
                                    </svg>
                                </span>

                            </div>
                        </div>
                    </div>
                </div>
                <?php echo do_shortcode('[custom_search_form]'); ?>
            </div>
        </header> <!-- #main-header -->

        <?php
        $main_header = ob_get_clean();

        /**
         * Filters the HTML output for the main header.
         *
         * @since 3.10
         *
         * @param string $main_header
         */
        echo et_core_intentionally_unescaped(apply_filters('et_html_main_header', $main_header), 'html');
        ?>
        <div id="et-main-area">
            <?php

            /**
             * Fires after the header, before the main content is output.
             *
             * @since 3.10
             */
            do_action('et_before_main_content');