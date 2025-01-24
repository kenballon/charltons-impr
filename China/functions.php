<?php

require_once ('nl-archives.php');

add_action('wp_enqueue_scripts', 'enqueue_load_fa');

function enqueue_load_fa()
{
    wp_enqueue_style('load-fa', 'https://use.fontawesome.com/releases/v5.11.2/css/all.css');
}

function chr_theme_enqueue_styles()
{
    wp_enqueue_style(
        'parent-style',
        get_template_directory_uri() . '/css/style.css'
    );
}

add_action('wp_enqueue_scripts', 'chr_theme_enqueue_styles');

function true_loadmore_scripts()
{
    // wp_enqueue_script('jquery');
    wp_enqueue_script('true_loadmore', get_stylesheet_directory_uri() . '/loadmore.js', array('jquery'));
}

add_action('wp_enqueue_scripts', 'true_loadmore_scripts');

function mainjs_script()
{
    wp_enqueue_script('mainjs', get_stylesheet_directory_uri() . '/js/main.js', array('jquery'));
}

add_action('wp_enqueue_scripts', 'mainjs_script');

function pagination_script()
{
    wp_enqueue_script('paginationjs', get_stylesheet_directory_uri() . '/js/jQuery.paginate.js', array('jquery'));
}

add_action('wp_enqueue_scripts', 'pagination_script');

function custom_add_google_fonts()
{
    wp_enqueue_style('custom-google-fonts', 'https://fonts.googleapis.com/css?family=Open+Sans|Public+Sans:300,400,500,600,700,800,900&display=swap', false);
}

add_action('wp_enqueue_scripts', 'custom_add_google_fonts');

// Shortcode - Recent news
function get_recent_news_homepage_shortcode()
{
    $count = 4;

    $query_args = array(
        'post_type' => 'post',
        'post_status' => 'publish',
        'category_name' => 'news',
        'order' => 'DESC',
        'posts_per_page' => $count
    );

    $query = new WP_Query($query_args);

    while ($query->have_posts()):
        $query->the_post();
        $output = $output
            . '<div class="news-list__item">'
            . '<div class="news-list-item__date">' . get_the_date('Y年m月d日') . '</div>'
            . '<div class="news-list-item__text">'
            . '<a href="' . get_permalink() . '">' . $query->post->post_title
            . '</a>'
            . '</div>'
            . '</div>';
    endwhile;
    wp_reset_postdata();

    return $output;
}

add_shortcode('get_recent_news_homepage', 'get_recent_news_homepage_shortcode');

function get_recent_insight_homepage_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('category' => 'ipo', 'count' => 1, 'offset' => 0), $atts));

    $query_args = array(
        'post_type' => 'project',
        'posts_per_page' => $count,
        'offset' => $offset,
        'tax_query' => array(
            array(
                'taxonomy' => 'project_category',
                'field' => 'slug',  // or term_id
                'terms' => $category  // or cat id if using term_id
            ),
        )
    );

    $query = new WP_Query($query_args);
    $output = '';
    while ($query->have_posts()):
        $query->the_post();

        if ($category == 'ipo' && $count == 1) {
            $output = '<h2 class="text-white">' . get_the_title() . '</h2>'
                . '<div class="chr_custom_post_excerpt my-1">' . get_the_excerpt() . '</div>'
                . '<a href="' . get_the_permalink() . '" class="read-more cta_btn_link white-cta"> 阅读更多 ›</a>';
        } else {
            $output .= '<li class="pub-list__pub"><a href="' . get_permalink() . '">' . get_the_title() . '</a></li>';
        }
    endwhile;

    wp_reset_postdata();
    return $output;
}

add_shortcode('get_recent_insight_homepage', 'get_recent_insight_homepage_shortcode');

// Breadcrumbs filters
function show_breadcrumb_shortcode()
{
    global $post;

    $count = 1;
    $postAncestors = get_post_ancestors($post);
    $sortedAncestorArray = array();
    $output = '';
    $output .= '<ul>';
    $output .= '<li><a href="/">主页</a></li>';
    foreach ($postAncestors as $ancestor) {
        $sortedAncestorArray[] = $ancestor;
    }
    krsort($sortedAncestorArray);  // Sort an array by key in reverse order

    foreach ($sortedAncestorArray as $ancestor) {
        $output .= "<li><a href='" . esc_url(get_permalink($ancestor)) . "' title='" . get_the_title($ancestor) . "'>" . get_the_title($ancestor) . '</a></li>';
        $count++;
    }
    if ($displayCurrent) {  // If TRUE - output the current page title
        // $output .= "<span>". the_title($post) ."</span>";
    }

    $output .= '<li><span>' . get_the_title($post) . '</span></li>';
    $output .= '</ul>';
    return $output;
}

add_shortcode('show_breadcrumb', 'show_breadcrumb_shortcode');

// content 2 submenu
function show_parent_menu_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('depth' => 3, 'menu_id' => 0, 'exclude' => '', 'parent_id' => 13), $atts));
    $output = '';

    if ($post->post_parent) {
        $ancestors = get_post_ancestors($post->ID);
        $root = count($ancestors) - 1;
        $parent = $ancestors[$root];
    } else {
        $parent = $post->ID;
    }

    if ($menu_id != 0) {
        $parent = $menu_id;
    }

    $output .= '<ul class="cm-parent">';
    $args = array(
        'child_of' => $parent_id,
        'title_li' => '',
        'depth' => $depth,
        'post__not_in' => array(221953),
        'echo' => 0
    );

    $output .= wp_list_pages($args);
    $output .= '</ul>';

    return $output;
}

add_shortcode('show_parent_menu', 'show_parent_menu_shortcode');

function show_current_page_children_menu_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('include_parent_title' => 'no', 'menu_title' => get_the_title($post->ID), 'exclude' => '', 'depth' => 1, 'menu_id' => 0), $atts));
    $output = '';

    if ($include_parent_title == 'yes') {  // include heading if yes
        $output .= '<h2>' . $menu_title . '</h2>';
    }

    if ($menu_id == 0) {
        $parent_id = $post->ID;
    } else {
        $parent_id = $menu_id;
    }

    $output .= '<ul>';
    $args = array(
        'child_of' => $parent_id,
        'title_li' => '',
        'depth' => $depth,
        'exclude' => $exclude,
        'echo' => 0
    );
    $output .= wp_list_pages($args);
    $output .= '</ul>';

    return $output;
}

add_shortcode('show_current_page_children_menu', 'show_current_page_children_menu_shortcode');
add_shortcode('show_children_of_parent_menu', 'show_current_page_children_menu_shortcode');

function show_current_page_sibling_menu_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('include_parent_title' => 'no', 'menu_title' => get_the_title(wp_get_post_parent_id($post->ID)), 'exclude' => '', 'depth' => 1), $atts));
    $output = '';

    if ($include_parent_title == 'yes') {  // include heading if yes
        $output .= '<h2>' . $menu_title . '</h2>';
    }
    $output .= '<ul>';
    $args = array(
        'child_of' => wp_get_post_parent_id($post->ID),
        'title_li' => '',
        'depth' => $depth,
        'exclude' => $exclude,
        'depth' => 1,
        'echo' => 0
    );

    $output .= wp_list_pages($args);
    $output .= '</ul>';

    return $output;
}

add_shortcode('show_current_page_sibling_menu', 'show_current_page_sibling_menu_shortcode');

function show_current_page_parent_menu_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('include_parent_title' => 'no', 'menu_title' => get_the_title(wp_get_post_parent_id(wp_get_post_parent_id($post->ID)))), $atts));
    $output = '';

    if ($include_parent_title == 'yes') {  // include heading if yes
        $output .= '<h2>' . $menu_title . '</h2>';
    }
    $output .= '<ul>';
    $args = array(
        'child_of' => wp_get_post_parent_id(wp_get_post_parent_id($post->ID)),
        'title_li' => '',
        'depth' => 1,
        'echo' => 0
    );

    $output .= wp_list_pages($args);
    $output .= '</ul>';

    return $output;
}

add_shortcode('show_current_page_parent_menu', 'show_current_page_parent_menu_shortcode');

function show_parent_menu_link_shortcode()
{
    global $post;

    $output = '<a href="' . get_the_permalink(wp_get_post_parent_id($post->ID)) . '">' . get_the_title(wp_get_post_parent_id($post->ID)) . '</a>';
    return $output;
}

add_shortcode('show_parent_menu_link', 'show_parent_menu_link_shortcode');

function get_url_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('id' => ''), $atts));
    $output = '';
    $the_link = get_the_permalink($id);
    $the_domain = 'https://' . $_SERVER['HTTP_HOST'];
    $the_link = str_replace($the_domain, '', $the_link);
    $output .= $the_link;
    return $output;
}

add_shortcode('get_url', 'get_url_shortcode');

function get_title_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('id' => ''), $atts));

    $output = '';
    $output .= get_the_title($id);
    return $output;
}

add_shortcode('get_title', 'get_title_shortcode');

function get_featured_img_url_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('id' => ''), $atts));

    $output = '';
    $output .= get_the_post_thumbnail_url($post->ID, 'full');
    return $output;
}

add_shortcode('get_featured_img_url', 'get_featured_img_url_shortcode');

function get_post_date_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('id' => ''), $atts));
    return get_the_date('Y年m月d日');
}

add_shortcode('get_post_date', 'get_post_date_shortcode');

function get_month_year_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('id' => ''), $atts));
    return get_the_date('Y年 m月');
}

add_shortcode('get_month_year', 'get_month_year_shortcode');

function get_post_excerpt_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('id' => ''), $atts));
    return get_the_excerpt();
}

add_shortcode('get_post_excerpt', 'get_post_excerpt_shortcode');

function show_parent_title_shortcode($atts, $content = null)
{
    global $post;

    if ($post->post_parent) {
        $ancestors = get_post_ancestors($post->ID);
        $root = count($ancestors) - 1;
        $parent = $ancestors[$root];
    } else {
        $parent = $post->ID;
    }

    return get_the_title($parent);
}

add_shortcode('show_parent_title', 'show_parent_title_shortcode');

function get_text_translation_shortcode($atts, $content = null)
{
    extract(shortcode_atts(array('text' => ''), $atts));
    include 'translations.php';
    return $translation[$text];
}

add_shortcode('get_text_translation', 'get_text_translation_shortcode');

function show_text_insights_shortcode()
{
    return 'Insights';
}

add_shortcode('show_text_insights', 'show_text_insights_shortcode');

function show_text_view_all_shortcode()
{
    return 'view all';
}

add_shortcode('show_text_view_all', 'show_text_view_all_shortcode');

function show_nl_text_hong_kong_law_shortcode()
{
    return '香港法律';
}

add_shortcode('show_nl_text_hong_kong_law', 'show_nl_text_hong_kong_law_shortcode');

function show_nl_text_word_version_shortcode()
{
    return 'Word version';
}

add_shortcode('show_nl_text_word_version', 'show_nl_text_word_version_shortcode');

function show_nl_text_pdf_version_shortcode()
{
    return 'PDF version';
}

add_shortcode('show_nl_text_pdf_version', 'show_nl_text_pdf_version_shortcode');

function show_newsletters_options_shortcode()
{
    $output = "
\t<option value=\"#\" selected=\"selected\">------------------ 选择法讯类别 ------------------</option>
\t<option value=/xin-guan-bing-du-zi-liao/\">新冠病毒资料</option>
\t<option value=\"/fa-lv-jian-xun/xiang-gang-fa-xun/\">香港法讯</option>
\t<option value=\"/fa-lv-jian-xun/zhong-guo-fa-xun/\">中国法讯</option>
\t<option value=\"/boke/\">播客</option>
\t";

    return $output;
}

add_shortcode('show_newsletters_options', 'show_newsletters_options_shortcode');

function show_news_sitepath_shortcode()
{
    $output = '';
    $output .= '<ul>';
    $output .= '<li><a href="/">主页</a></li>';
    $output .= '<li><span>最新动态及活动</span></li>';
    $output .= '</ul>';
    return $output;
}

add_shortcode('show_news_sitepath', 'show_news_sitepath_shortcode');

function show_news_events_sitepath_shortcode()
{
    $output = '';
    $output .= '<ul>';
    $output .= '<li><a href="/">主页</a></li>';
    $output .= '<li><a href="/zui-xin-dong-tai-ji-huo-dong/">最新动态及活动</a></li>';
    $output .= '<li><span>' . get_the_title($post) . '</span></li>';
    $output .= '</ul>';
    return $output;
}

add_shortcode('show_news_events_sitepath', 'show_news_events_sitepath_shortcode');

function get_insights_ipos_breadcrumb_shortcode()
{
    $output = '';
    $output .= '<ul>';
    $output .= '<li><a href="/">主页</a></li>';
    $output .= '<li><a href="/zi-xun-ji-zhi-shi/">资讯及知识</a></li>';
    $output .= '<li><a href="/zi-xun-ji-zhi-shi/shou-ci-gong-kai-zhao-gu/">首次公开招股</a></li>';
    $output .= '<li><span>' . get_the_title($post) . '</span></li>';
    $output .= '</ul>';
    return $output;
}

add_shortcode('get_insights_ipos_breadcrumb', 'get_insights_ipos_breadcrumb_shortcode');

function get_insights_regulatory_breadcrumb_shortcode()
{
    $output = '';
    $output .= '<ul>';
    $output .= '<li><a href="/">主页</a></li>';
    $output .= '<li><a href="/zi-xun-ji-zhi-shi/">资讯及知识</a></li>';
    $output .= '<li><a href="/zi-xun-ji-zhi-shi/xiang-gang-fa-gui-he-gui-xing/">香港法规合规性</a></li>';
    $output .= '<li><span>' . get_the_title($post) . '</span></li>';
    $output .= '</ul>';
    return $output;
}

add_shortcode('get_insights_regulatory_breadcrumb', 'get_insights_regulatory_breadcrumb_shortcode');

function get_insights_company_law_breadcrumb_shortcode()
{
    $output = '';
    $output .= '<ul>';
    $output .= '<li><a href="/">主页</a></li>';
    $output .= '<li><a href="/zi-xun-ji-zhi-shi/">资讯及知识</a></li>';
    $output .= '<li><a href="/zi-xun-ji-zhi-shi/xiang-gang-gong-si-fa/">香港公司法</a></li>';
    $output .= '<li><span>' . get_the_title($post) . '</span></li>';
    $output .= '</ul>';
    return $output;
}

add_shortcode('get_insights_company_law_breadcrumb', 'get_insights_company_law_breadcrumb_shortcode');

function get_insights_china_breadcrumb_shortcode()
{
    $output = '';
    $output .= '<ul>';
    $output .= '<li><a href="/">主页</a></li>';
    $output .= '<li><a href="/zi-xun-ji-zhi-shi/">资讯及知识</a></li>';
    $output .= '<li><a href="/zi-xun-ji-zhi-shi/zhong-guo/">中国</a></li>';
    $output .= '<li><span>' . get_the_title($post) . '</span></li>';
    $output .= '</ul>';
    return $output;
}

add_shortcode('get_insights_china_breadcrumb', 'get_insights_china_breadcrumb_shortcode');

function get_insights_myanmar_breadcrumb_shortcode()
{
    $output = '';
    $output .= '<ul>';
    $output .= '<li><a href="/">主页</a></li>';
    $output .= '<li><a href="/zi-xun-ji-zhi-shi/">资讯及知识</a></li>';
    $output .= '<li><a href="/zi-xun-ji-zhi-shi/mian-dian/">缅甸</a></li>';
    $output .= '<li><span>' . get_the_title($post) . '</span></li>';
    $output .= '</ul>';
    return $output;
}

add_shortcode('get_insights_myanmar_breadcrumb', 'get_insights_myanmar_breadcrumb_shortcode');

function get_insights_publications_breadcrumb_shortcode()
{
    $output = '';
    $output .= '<ul>';
    $output .= '<li><a href="/">主页</a></li>';
    $output .= '<li><a href="/zi-xun-ji-zhi-shi/">资讯及知识</a></li>';
    $output .= '<li><a href="/zi-xun-ji-zhi-shi/kan-wu-ji-yan-shi-gao/">刊物及演示稿</a></li>';
    $output .= '<li><span>' . get_the_title($post) . '</span></li>';
    $output .= '</ul>';
    return $output;
}

add_shortcode('get_insights_publications_breadcrumb', 'get_insights_publications_breadcrumb_shortcode');

function show_podcasts_series_sitepath_shortcode()
{
    $output = '';
    $output .= '<ul>';
    $output .= '<li><a href="/">主页</a></li>';
    $output .= '<li><a href="/information-insights/podcasts-series/">Podcasts Series</a></li>';
    $output .= '<li><span>' . get_the_title($post) . '</span></li>';
    $output .= '</ul>';
    return $output;
}

add_shortcode('show_podcasts_series_sitepath', 'show_podcasts_series_sitepath_shortcode');

// INSIGHTS RIGHT COLUMN
function get_ipo_rightbar_content_shortcode()
{
    $output = "
<div class=\"right-content-col\">
<h2>相关内容</h2>
<div class=\"right-thumb-content\">
\t<h2 class=\"rtc-title\">联系</h2>
\t<div class=\"rtc-image profile-photo\">
\t\t<a href=\"/ben-suo/ben-suo-zhuan-cai-ji-wen-hua/tuan-dui-gai-kuang/julia-charlton/\"><img src=\"/legal/the-firm/Julia-Charlton.jpg\"/></a>
\t\t<h3 class=\"rtc-caption\">周怡菁 Julia Charlton</h3>
\t</div>
\t<div class=\"rtc-image profile-photo\">
\t\t<a href=\"/ben-suo/ben-suo-zhuan-cai-ji-wen-hua/tuan-dui-gai-kuang/clinton-morrow/\"><img src=\"/legal/the-firm/Clinton-Morrow.jpg\"/></a>
\t\t<h3 class=\"rtc-caption\">莫旗顿 Clinton Morrow</h3>
\t</div>
\t<div class=\"rtc-image profile-photo\">
\t\t<a href=\"/ben-suo/ben-suo-zhuan-cai-ji-wen-hua/tuan-dui-gai-kuang/calvin-ho/\"><img src=\"/legal/the-firm/Calvin-Ho.jpg\"/></a>
\t\t<h3 class=\"rtc-caption\">何轶伦 Calvin Ho</h3>
\t</div>
</div>

<div class=\"con-thumb-right\">
<div class=\"right-thumb-content\">
\t<h2 class=\"rtc-title\">服务</h2>
\t<div class=\"rtc-image\">
        <a rel=\"nofollow\" href=\"/wo-men-de-ye-wu-fan-wei/qi-ye-jin-rong-ji-zi-ben-shi-chang/fu-wu/gong-si/xun-qiu-yu-xiang-gang-shang-shi-de-gong-si/\"><img src=\"/fa-lv/wo-men-de-ye-wu-fan-wei/xun-qiu-yu-xiang-gang-shang-shi-de-gong-si.jpg\"/></a>
        <h3 class=\"rtc-caption\">于香港上市</h3>
    </div>
</div>
</div>
</div>";

    return $output;
}

add_shortcode('get_ipo_rightbar_content', 'get_ipo_rightbar_content_shortcode');
add_shortcode('get_regulatory_rightbar_content', 'get_ipo_rightbar_content_shortcode');  // create another function to output different content if needed.
add_shortcode('get_company_law_rightbar_content', 'get_ipo_rightbar_content_shortcode');  // create another function to output different content if needed.
add_shortcode('get_china_rightbar_content', 'get_ipo_rightbar_content_shortcode');  // create another function to output different content if needed.
add_shortcode('get_myanmar_rightbar_content', 'get_ipo_rightbar_content_shortcode');  // create another function to output different content if needed.
add_shortcode('get_publications_rightbar_content', 'get_ipo_rightbar_content_shortcode');  // create another function to output different content if needed.

// Shortcode - recent INSIGHTS THUMBS
function get_insights_thumbs_shortcode($atts, $content = null)
{
    extract(shortcode_atts(array('post_type' => 'project', 'cat_name' => 'ipo', 'count' => 4), $atts));

    $query_args = array(
        'post_type' => 'project',
        'posts_per_page' => $count,
        'tax_query' => array(
            array(
                'taxonomy' => 'project_category',
                'field' => 'slug',  // or term_id
                'terms' => $cat_name  // or cat id if using term_id
            ),
        )
    );

    $query = new WP_Query($query_args);
    $output = '';
    while ($query->have_posts()):
        $query->the_post();

        $featured_img_url = get_the_post_thumbnail_url($query->post->ID, 'full');

        $output .= "<div class=\"rtc-image\">
\t\t<a href=\"" . get_permalink() . '"><img src="' . $featured_img_url . "\" /></a>
\t\t<h3 class=\"rtc-caption\">" . $query->post->post_title . "</h3>
\t\t</div>";
    endwhile;
    wp_reset_postdata();

    return $output;
}

add_shortcode('get_insights_thumbs', 'get_insights_thumbs_shortcode');

// Shortcode - recent INSIGHTS THUMBS
function get_newsletter_thumbs_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('category' => 'hong-kong-law', 'count' => 4), $atts));

    $query_args = array(
        'post_type' => 'post',
        'posts_per_page' => $count,
        'category_name' => $category,
        'post__not_in' => array(get_the_ID())
    );

    $query = new WP_Query($query_args);
    $output = '';

    while ($query->have_posts()):
        $query->the_post();

        $featured_img_url = get_the_post_thumbnail_url($query->post->ID, 'full');

        $output .= "<div class=\"rtc-image\">
\t\t<a href=\"" . get_permalink() . '"><img src="' . $featured_img_url . "\" /></a>
\t\t<h3 class=\"rtc-caption\">" . $query->post->post_title . "</h3>
\t\t</div>";
    endwhile;
    wp_reset_postdata();

    return $output;
}

add_shortcode('get_newsletter_thumbs', 'get_newsletter_thumbs_shortcode');

// Shortcode - RIGHT SIDE LATEST NEWS
function get_posts_thumbs_shortcode($atts, $content = null)
{
    extract(shortcode_atts(array('category' => 'news', 'count' => 4), $atts));
    $query_args = array(
        'post_type' => 'post',
        'posts_per_page' => $count,
        'category_name' => $category,
        'meta_key' => 'end_date',
        'post__not_in' => array(get_the_ID()),
    );

    $query = new WP_Query($query_args);
    $output = '';
    $today = strtotime(date('d.m.Y'));

    $getCurrentID = get_the_ID();

    $count = 0;

    while ($query->have_posts()):
        $query->the_post();
        $endDate = strtotime($query->post->end_date);
        $featured_img_url = get_the_post_thumbnail_url($query->post->ID, 'full');
        if ($today <= $endDate) {
            $count += 1;
            if ($count > 1) {
                $viewMore = '<h4 class="view-all-toggle">' . do_shortcode('[get_text_translation text="view more"]') . '</h4></div>';
            } else {
                $viewMore = '</div>';
            }

            if (get_the_ID($query->post->ID) == $getCurrentID) {
                $latestEvents = '';
            } else {
                $latestEvents = "<div class=\"right-thumb-content toggle-thumbs custom_styles\">
\t\t\t\t<h2 class=\"rtc-title\">" . do_shortcode('[get_text_translation text="Latest news"]') . '</h2>';
            }
            $output .= "<div class=\"rtc-image\">
\t\t\t\t\t\t\t<a href=\"" . get_permalink() . '"><img src="' . $featured_img_url . "\" /></a>
\t\t\t\t\t\t\t<h3 class=\"rtc-caption\"><span>" . $query->post->post_title . "</a></h3>
\t\t\t\t\t\t</div>";
        }
    endwhile;
    wp_reset_postdata();

    return $latestEvents . $output . $viewMore;
}

add_shortcode('get_posts_thumbs', 'get_posts_thumbs_shortcode');

// Shortcode - recent POSTS THUMBS
function get_posts_thumbs_v2_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('category' => 'news', 'count' => 2), $atts));

    $query_args = array(
        'post_type' => 'post',
        'posts_per_page' => $count,
        'category_name' => $category,
        'post__not_in' => array(get_the_ID())
    );

    $query = new WP_Query($query_args);
    $output = '';
    while ($query->have_posts()):
        $query->the_post();

        $featured_img_url = get_the_post_thumbnail_url($query->post->ID, 'full');
        $category_nice_name = get_the_category($query->post->ID);

        // $output .='<div class="thumb-v2">
        // <a href="'.get_permalink().'"><img src="'.$featured_img_url.'" /></a>
        // <h5><span>'.get_the_date( 'd M Y' ).'</span> | <span>'.$category_nice_name[0]->cat_name.'</span></h5>
        // <h3>'.$query->post->post_title.'</h3>
        // </div>';
        $output .= "<div class=\"thumb-v2\">
\t\t<h5><span>" . get_the_date('d M Y') . '</span> | <span>' . $category_nice_name[0]->cat_name . "</span></h5>
\t\t<h3><a href=\"" . get_permalink() . '">' . $query->post->post_title . "</a></h3>
\t\t</div>";
    endwhile;
    wp_reset_postdata();

    return $output;
}

add_shortcode('get_posts_thumbs_v2', 'get_posts_thumbs_v2_shortcode');

function get_insights_cn_thumbs_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('category' => 'insights', 'count' => 2, 'offset' => 0), $atts));

    $query_args = array(
        'post_type' => 'project',
        'posts_per_page' => $count,
        'order' => 'DESC',
        'offset' => $offset,
        'tax_query' => array(
            array(
                'taxonomy' => 'project_category',
                'field' => 'slug',  // or term_id
                'terms' => $category  // or cat id if using term_id
            ),
        )
    );

    $query = new WP_Query($query_args);
    $output = '';
    while ($query->have_posts()):
        $query->the_post();
        $output .= "<div class=\"thumb-v2\">
\t\t<h5><span>" . get_the_date('Y年m月') . "</span></h5>
\t\t<h3><a href=\"" . get_permalink() . '">' . $query->post->post_title . "</a></h3>
\t\t</div>";
    endwhile;
    wp_reset_postdata();

    return $output;
}

add_shortcode('get_insights_cn_thumbs', 'get_insights_cn_thumbs_shortcode');

// insight searchform
add_shortcode('search_form', 'get_search_form');

// remove autop
function remove_the_wpautop_function()
{
    remove_filter('the_content', 'wpautop');
    remove_filter('the_excerpt', 'wpautop');
}

// rename projects slug to hong-kong-law;
function project_register_post_type()
{
    register_post_type(
        'project',
        array(
            'labels' => array(
                'name' => __('Projects'),
                'singular_name' => __('Project')
            ),
            'public' => true,
            'has_archive' => true,
            'rewrite' => array('slug' => 'xiang-gang-fa-lv')
        )
    );
}  // end example_register_post_type

add_action('init', 'project_register_post_type');

add_action('after_setup_theme', 'remove_the_wpautop_function');

function show_nl_breadcrumb_shortcode()
{
    $output = '<div style="display:none;">Newsletter</div>';
    return $output;
}

add_shortcode('show_nl_breadcrumb', 'show_nl_breadcrumb_shortcode');

// function show_nl_disclaimer_shortcode(){

// return '<p><b> This newsletter is for information purposes only. </b>
// <br /><br />
// Its contents do not constitute legal advice and it should not be regarded as a substitute for detailed advice in individual cases. <br />
// Transmission of this information is not intended to create and receipt does not constitute a lawyer-client relationship between Charltons and the user or browser.<br />
// Charltons is not responsible for any third party content which can be accessed through the website.<br />
// <br />
// If you do not wish to receive this newsletter please let us know by emailing us at <a class="unsubscribe" href="mailto:unsubscribe@charltonslaw.com?subject=unsubscribe%20%5BHong Kong Law%5D">unsubscribe@charltonslaw.com</a></p>';
// }
// add_shortcode('show_nl_disclaimer', 'show_nl_disclaimer_shortcode');

// function show_nl_award_shortcode(){
// $output = '<h3><img src="/media/charltons-logo.png" /></h3>
// <p><span>Boutique Transactional Law Firm of the Year 2017</span><br />
// Asian Legal Business Awards</p>';
// return $output;

// }
// add_shortcode('show_nl_award', 'show_nl_award_shortcode');

// function show_nl_address_shortcode(){
// $output = '<p>Dominion Centre,12th Floor<br />
// 43-59 Queen’s Road East<br />
// Hong Kong</p>';
// return $output;
// }
// add_shortcode('show_nl_address', 'show_nl_address_shortcode');

// function show_nl_contact_shortcode()  {
// return '<p>Tel: + (852) 2905 7888<br />
// Fax: + (852) 2854 9596<br />
// <a href="http://www.charltonslaw.com">www.charltonslaw.com</a></p>';
// }
// add_shortcode('show_nl_contact', 'show_nl_contact_shortcode');

// next/prev post link
function next_post_shortcode($atts)
{
    global $post;

    $output = '';
    $next_post = get_next_post();
    $next_post_id = $next_post->ID;
    $output = "<div class=\"podcast-series-thumb\">
\t<a href=\"" . get_permalink($next_post_id) . "\" target=\"_self\" class=\"pst-next-thumb\">
\t<div class=\"pst-post-thumb\"><img src=\"" . get_the_post_thumbnail_url($next_post_id) . "\" /></div>
\t<div class=\"pst-post-title\">" . get_the_title($next_post_id) . "</div>
\t</a>
\t</div>";
    return $output;
}

add_shortcode('next_post', 'next_post_shortcode');

function prev_post_shortcode($atts)
{
    global $post;

    $output = '';
    $prev_post = get_previous_post();
    $prev_post_id = $prev_post->ID;
    $output = "<div class=\"podcast-series-thumb\">
\t<a href=\"" . get_permalink($prev_post_id) . "\" target=\"_self\" class=\"pst-prev-thumb\">
\t<div class=\"pst-post-thumb\"><img src=\"" . get_the_post_thumbnail_url($prev_post_id) . "\" /></div>
\t<div class=\"pst-post-title\">" . get_the_title($prev_post_id) . "</div>
\t</a>
\t</div>";
    return $output;
}

add_shortcode('prev_post', 'prev_post_shortcode');

// post nav

function postnav_prev_shortcode($atts)
{
    $previous_post = get_previous_post();
    $result = '<div class="prev-thumbnail"><a href="' . get_permalink($previous_post->ID) . '" class="prev-thumb">' . get_the_post_thumbnail($previous_post->ID, 'thumbnail') . '</a><a href="' . get_permalink($previous_post->ID) . '" class="prev-link">' . get_the_title($previous_post->ID) . '</a></div>';
    return $result;
}

function postnav_next_shortcode($atts)
{
    $next_post = get_next_post();
    $result = '<div class="next-thumbnail"><a href="' . get_permalink($next_post->ID) . '" class="next-thumb">' . get_the_post_thumbnail($next_post->ID, 'thumbnail') . '</a><a href="' . get_permalink($next_post->ID) . '" class="next-link">' . get_the_title($next_post->ID) . '</a></div>';
    return $result;
}

add_shortcode('postnav_prev', 'postnav_prev_shortcode');
add_shortcode('postnav_next', 'postnav_next_shortcode');

function next_prev_post_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('category' => 'news', 'order_direction' => 'DESC'), $atts));

    $query_args = array(
        'post_type' => 'post',
        'posts_per_page' => 1000,
        'order' => $order_direction,
        'category_name' => $category,
        //		'post__not_in' => array( get_the_ID() )
    );

    $query = new WP_Query($query_args);
    $output = '';
    while ($query->have_posts()):
        $query->the_post();
        $ids[] = $post->ID;
    endwhile;
    wp_reset_postdata();
    $current_post_id = get_the_ID();
    $next_post_id = 0;

    foreach ($ids as $key => $id) {
        if ($current_post_id === $id) {
            $prev_post_id = $ids[$key - 1];
            $next_post_id = $ids[$key + 1];
        }
    }

    if ($prev_post_id != '') {
        $prev_link = '<div class="prev-thumbnail"><a rel="prev" href="' . get_permalink($prev_post_id) . '" class="prev-thumb">' . get_the_title($prev_post_id) . '</a></div>';
    } else {
        $prev_link = '<div class="prev-thumbnail">&nbsp;</div>';
    }

    if ($next_post_id != '') {
        $next_link = '<div class="next-thumbnail"><a rel="next" href="' . get_permalink($next_post_id) . '" class="next-thumb">' . get_the_title($next_post_id) . '</a></div>';
    } else {
        $next_link = '<div class="next-thumbnail">&nbsp;</div>';
    }

    return $prev_link . $next_link;
}

add_shortcode('next_prev_post', 'next_prev_post_shortcode');

// Register category for pages
function chr_register_page_category()
{
    register_taxonomy_for_object_type('category', 'page');
}

add_action('init', 'chr_register_page_category');

// Shortcode - Recent publications
function chr_recent_posts_shortcode($atts = [])
{
    $atts = array_change_key_case(
        (array) $atts,
        CASE_LOWER
    );

    $chr_atts = shortcode_atts(
        ['numberposts' => 3, 'offset' => 0, 'category' => 28],
        $atts,
        'chr-recent-posts'
    );

    $recent_posts = wp_get_recent_posts($chr_atts);
    $output = '';
    foreach ($recent_posts as $recent) {
        $output = $output
            . '<li class="pub-list__pub">'
            . '<a href="' . get_permalink($recent['ID']) . '">'
            . $recent['post_title']
            . '</a>'
            . '</li>';
    }
    $output = '<ul class="pub-list">' . $output
        . '<li><a href="" class="pub-list__all-link">'
        . 'View all publications&nbsp;›</a></li>'
        . '</ul>';
    return $output;
}

add_shortcode('chr-recent-posts', 'chr_recent_posts_shortcode');

// Shortcode - Last publication
function chr_recent_posts_details_shortcode($atts = [])
{
    $output = '<h2><a href="' . get_permalink(220839) . '">' . get_the_title(220839) . '</a></h2>'
        . '<div>' . get_the_excerpt(220839) . '</div>'
        . '<a href="' . get_the_permalink(220839) . '" class="read-more">'
        . '阅读更多&nbsp;›</a>';

    return $output;
}

add_shortcode('chr-recent-posts-details', 'chr_recent_posts_details_shortcode');

// Shortcode - latest News & Events
// Usage::[recent_posts num="5" cat="7"]
function latest_news_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array(
        'cat' => '13',
        'num' => '1',
        'order' => 'DESC',
        'orderby' => 'post_date',
    ), $atts));

    $args = array(
        'cat' => $cat,
        'posts_per_page' => $num,
        'order' => $order,
        'orderby' => $orderby,
    );

    $output = '';

    $posts = get_posts($args);

    foreach ($posts as $post) {
        setup_postdata($post);

        $output = '<h2><a href="' . get_the_permalink() . '">' . get_the_title() . '</a></h2>'
            . '<div>' . get_the_excerpt() . '</div>'
            . '<a href="' . get_the_permalink() . '" class="read-more">'
            . '阅读更多&nbsp;›</a>';

        // $output .= '<li><a href="'. get_the_permalink() .'">'. get_the_title() .'</a></li>';
    }

    wp_reset_postdata();

    return $output;
}

add_shortcode('chr-latest-news', 'latest_news_shortcode');

function latest_publications_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array(
        'ids' => '',
    ), $atts));

    $args = array(
        'ids' => $cat,
    );

    $output = "
\t<ul>
\t<li>[link id=\"45707\" /]</li>
\t<li>[link id=\"45702\" /]</li>
\t<li>[link id=\"15537\" /]</li>
\t</ul>
\t";

    return $output;
}

add_shortcode('chr-latest-publications', 'latest_publications_shortcode');

// Lawyer search shortcode
function chr_lawyer_search_shortcode()
{
    $team_category_obj = get_category_by_slug('team-profile');
    $cat_id = $team_category_obj->term_id;

    $nonce = wp_create_nonce('chr_lawyer_search_nonce');

    $output = '<div class="lawyer-search-block">'
        . '<input type="text" class="lawyer-search-input"'
        . ' id="autoComplete" data-nonce="' . $nonce . '"/>'
        . '<a href="?s=&cat=' . $cat_id . '" class="lawyer-search-button"></a>'
        . '</div>';

    return $output;
}

add_shortcode('chr-lawyer-search', 'chr_lawyer_search_shortcode');

// AJAX - lawyer search
function chr_lawyer_search()
{
    if (!wp_verify_nonce($_REQUEST['nonce'], 'chr_lawyer_search_nonce')) {
        http_response_code(400);
        exit(json_encode(array('error' => 'Wrong parameters')));
    }

    $lawyers = array();

    $query_args = array(
        'post_type' => 'page',
        'post_status' => 'publish',
        'posts_per_page' => 100,
        'category_name' => 'team-profile',
        // 's' => sanitize_text_field($_REQUEST['query'])
    );

    $query = new WP_Query($query_args);

    while ($query->have_posts()):
        $query->the_post();
        $lawyers[] = array(
            'name' => $query->post->post_title,
            'link' => get_permalink()
        );
    endwhile;
    wp_reset_postdata();

    echo json_encode($lawyers);

    die();
}

add_action('wp_ajax_chr_lawyer_search', 'chr_lawyer_search');
add_action('wp_ajax_nopriv_chr_lawyer_search', 'chr_lawyer_search');

function chr_lawyer_search_enqueuer()
{
    if (!is_home() && !is_front_page())
        return;

    $team_cat_obj = get_category_by_slug('team-profile');
    $team_cat_id = $team_cat_obj->term_id;

    $dir = get_stylesheet_directory_uri();

    wp_register_script(
        'chr-lawyer-search',
        $dir . '/js/chr-lawyer-search.js'
    );

    wp_register_script(
        'autocomplete-js',
        $dir . '/js/autoComplete.min.js'
    );

    wp_localize_script(
        'chr-lawyer-search',
        'lawyerSearchAjax',
        array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'team_cat_id' => $team_cat_id
        )
    );

    wp_enqueue_style(
        'chr-lawyer-search-style',
        $dir . '/css/autoComplete.min.css'
    );
    wp_enqueue_script('autocomplete-js');
    wp_enqueue_script('chr-lawyer-search');
}

add_action('wp_enqueue_scripts', 'chr_lawyer_search_enqueuer');

// change login form styling
function chr_login_logo()
{
    echo '<style type="text/css">
    h1 a {
      background-image: url(' . get_stylesheet_directory_uri() . '/login/logo.png) !important;
    }
  </style>';
}

add_action('login_head', 'chr_login_logo');

function chr_login_url()
{
    return 'https://www.charltonslaw.com';
}

add_filter('login_headerurl', 'chr_login_url');

function chr_login_url_text()
{
    return 'Charltons Law';
}

add_filter('login_headertitle', 'chr_login_url_text');

function chr_login_custom_css()
{
    wp_enqueue_style('login-styles', get_stylesheet_directory_uri() . '/login/login_styles.css');
}

add_action('login_enqueue_scripts', 'chr_login_custom_css');
// END login form styling

// add post thumbnails
add_theme_support('post-thumbnails');

// Prevent featured post cropping
function wpc_remove_height_cropping($height)
{
    return '9999';
}

function wpc_remove_width_cropping($width)
{
    return '9999';
}

add_filter('et_pb_blog_image_height', 'wpc_remove_height_cropping');
add_filter('et_pb_blog_image_width', 'wpc_remove_width_cropping');

// Newsletter filter
function misha_filter_function()
{
    // $paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
    // $paged = ( get_query_var( 'page' ) ) ? get_query_var( 'page' ) : 1;
    $args = array(
        'posts_per_page' => 8,
        'paged' => $_POST['page'] + 1,
        'orderby' => 'date',  // we will sort posts by date
        'order' => $_POST['date']  // ASC or DESC
    );

    // for taxonomies / categories
    if (isset($_POST['categoryfilter']))
        $args['tax_query'] = array(
            array(
                'taxonomy' => 'category',
                'field' => 'id',
                'terms' => $_POST['categoryfilter']
            )
        );

    if (isset($_POST['date_from']) && $_POST['date_from'] && isset($_POST['date_to']) && $_POST['date_to']) {
        $args['date_query'] = array(
            'column' => 'post_date',
            'compare' => 'between',
            'relation' => 'OR',
            'before' => $_POST['date_to'],
            'after' => $_POST['date_from'],
        );
    } else {
        if (isset($_POST['date_from']) && $_POST['date_from'])
            $args['date_query'] = array(
                'column' => 'post_date',
                'compare' => '>=',
                'relation' => 'OR',
                'before' => '',
                'after' => $_POST['date_from'],
            );
        if (isset($_POST['date_to']) && $_POST['date_to'])
            $args['date_query'] = array(
                'column' => 'post_date',
                'compare' => '<=',
                'relation' => 'OR',
                'before' => $_POST['date_to'],
                'after' => '',
            );
    }

    $query = new WP_Query($args);

    $temp_query = $wp_query;
    $wp_query = null;
    $wp_query = $query;

    if ($query->have_posts()):
        while ($query->have_posts()):
            $query->the_post();
            echo "<div class=\"column size-1of4\">
\t\t\t\t<article id=\"post-" . get_the_ID() . "\" class=\"et_pb_post clearfix post type-post status-publish format-standard has-post-thumbnail hentry\">
\t\t\t\t\t<div class=\"et_pb_image_container\"><a href=\"" . get_permalink() . "\" class=\"entry-featured-image-url\">
\t\t\t\t\t\t<img src=\"" . get_the_post_thumbnail_url() . '" alt="' . get_the_title() . "\">
\t\t\t\t\t\t</a>
\t\t\t\t\t</div>
\t\t\t\t\t<a href=\"" . get_permalink() . '"><h2 class="entry-title">' . $query->post->post_title . "</h2></a>
\t\t\t\t\t<div class=\"post-content\">
\t\t\t\t\t\t<p>" . get_the_excerpt() . "</p>
\t\t\t\t\t\t<a href=\"" . get_permalink() . "\" class=\"more-link read-more\">阅读更多</a>
\t\t\t\t\t</div>
\t\t\t\t</article>
\t\t\t</div>";
        endwhile;
?>

<?php if ($wp_query->max_num_pages > 1): ?>
<script>
var ajaxurl = '<?php echo site_url() ?>/wp-admin/admin-ajax.php';
var true_posts = '<?php echo serialize($wp_query->query_vars); ?>';
var current_page = <?php echo (get_query_var('paged')) ? get_query_var('paged') : 1; ?>;
var max_pages = '<?php echo $wp_query->max_num_pages; ?>';
</script>
<!--<a id="true_loadmore">Load more</a>-->
<?php endif; ?>


<?php
        wp_reset_postdata();

        // kama_pagenavi($before = '', $after = '', $echo = true, $args = array(), $wp_query = $query); // пагинация, функция нах-ся в function.php
        // reset the main query object to avoid
        // unexpected results on other parts of the page
        $wp_query = NULL;
        $wp_query = $temp_query;
    else:
        echo 'No posts found';
    endif;

    die();
}

add_action('wp_ajax_myfilter', 'misha_filter_function');  // wp_ajax_{ACTION HERE}
add_action('wp_ajax_nopriv_myfilter', 'misha_filter_function');

function true_load_posts()
{
    $args = unserialize(stripslashes($_POST['query']));
    $args['paged'] = $_POST['page'] + 1;  // следующая страница
    $args['post_status'] = 'publish';

    echo 'Loaded';
}

add_action('wp_ajax_loadmore', 'true_load_posts');
add_action('wp_ajax_nopriv_loadmore', 'true_load_posts');

/* add category_id in body class teddy */
function category_id_class($classes)
{
    global $post;

    foreach ((get_the_category($post->ID)) as $category)
        $classes[] = 'cat-' . $category->cat_ID . '-id';

    return $classes;
}

add_filter('post_class', 'category_id_class');
add_filter('body_class', 'category_id_class');

function show_last_modified_shortcode($atts, $content = null)
{
    global $post;

    extract(shortcode_atts(array('type' => 'post'), $atts));

    $query_args = array(
        'post_type' => $type,
        'post_status' => 'publish',
        'posts_per_page' => 50,
        'orderby' => 'modified',
        'order' => 'DESC'
    );

    $query = new WP_Query($query_args);
    $output = '';
    $cntr = 0;

    $output = '<table border="1" style="font-size:11px;padding:5px !important;">
                                                <tr><td style="padding:5px !important;">#</td>
                                                <td style="padding:5px !important;"><b>Post ID</b></td>
                                                <td style="padding:5px !important;"><b>Title</b></td>
                                                <td style="padding:5px !important;"><b>Modified Date</b></td>
                                                </tr>';
    while ($query->have_posts()):
        $query->the_post();
        $cntr++;

        if ($cntr & 1) {
            $bg = 'background-color:#ededed';
        } else {
            $bg = '';
        }

        $output .= '<tr style="' . $bg . '">
                                                            <td style="padding:5px !important;">' . $cntr . '</td>
                                                            <td style="padding:5px !important;">' . $post->ID . '</td>
                                                            <td style="padding:5px !important;">' . get_permalink() . '</td>
                                                            <td style="padding:5px !important;"><span>' . date('d M, Y H:i:s', get_post_modified_time()) . '</span></td>
                                                            </tr>';
    endwhile;
    wp_reset_postdata();
    $output .= '</table>';

    return $output;
}

add_shortcode('show_last_modified', 'show_last_modified_shortcode');

// ADDED BY KENNETH BALLON

/**
 * Retrieves the latest post details including title, excerpt, featured image, and URL.
 * Allows filtering by category, the number of posts to display, and whether to include the thumbnail.
 *
 * @param array $atts Shortcode attributes.
 * @return string HTML output of the latest post details.
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
            $output .= '<div class="cta_wrapper"><a href="' . esc_url($post_url) . '" class="cta_btn_link white-cta" aria-label="Read full article on ' . esc_attr($post_title) . '">阅读更多 ›</a></div>';
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

// Register the shortcode [get_recent_post_item]
add_shortcode('get_recent_post_item', 'get_latest_post_details');

// END ADDED BY KENNETH BALLON