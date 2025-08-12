<?php

require_once ('nl-archives.php');

// Enqueue parent and child theme styles
function divi_child_enqueue_styles()
{
    wp_enqueue_style('divi-parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('divi-child-style', get_stylesheet_directory_uri() . '/style.css', ['divi-parent-style']);
}

add_action('wp_enqueue_scripts', 'divi_child_enqueue_styles');

function clf_theme_enqueue_styles()
{
    wp_register_style('custom-style', get_stylesheet_directory_uri() . '/css/style.css', [], '0.0.56', 'all');
    wp_enqueue_style('custom-style');

    // Material Symbols
    wp_enqueue_style(
        'material-symbols',
        'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@200',
        false
    );
}

add_action('wp_enqueue_scripts', 'clf_theme_enqueue_styles');

function mainjs_script()
{
    // Enqueue the FilterButtons.js script
    wp_enqueue_script(
        'filterbutton',
        get_stylesheet_directory_uri() . '/js/FilterButton.js',
        [],
        null,
        true  // Load the script in the footer
    );

    // Enqueue the main.js script
    wp_enqueue_script(
        'mainjs',
        get_stylesheet_directory_uri() . '/js/main.js',
        ['jquery'],
        filemtime(get_stylesheet_directory() . '/js/main.js'),  // Dynamic version based on file modification time
        true  // Load the script in the footer
    );

    // Localize the script with the AJAX URL
    wp_localize_script('mainjs', 'ajax_object', ['ajax_url' => admin_url('admin-ajax.php')]);
}

add_action('wp_enqueue_scripts', 'mainjs_script');

function mainjs_module($tag, $handle, $src)
{
    // List of scripts to load as module
    $module_scripts = ['mainjs', 'filterbutton'];

    if (in_array($handle, $module_scripts)) {
        $tag = '<script type="module" src="' . esc_url($src) . '" defer></script>';
    }
    return $tag;
}

add_filter('script_loader_tag', 'mainjs_module', 10, 3);

function theme_gsap_script()
{
    wp_enqueue_script('gsap-js', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js', array(), false, true);
    wp_enqueue_script('gsap-st', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js', array('gsap-js'), false, true);
    wp_enqueue_script('gsap-splittext', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js', array('gsap-js'), false, true);
    wp_enqueue_script('gsap-js2', get_stylesheet_directory_uri() . '/js/app-gsap.js', array('gsap-js', 'gsap-splittext'), false, true);
}

// add_action('wp_enqueue_scripts', 'theme_gsap_script');

function enqueue_load_fa()
{
    wp_enqueue_style('load-fa', 'https://use.fontawesome.com/releases/v5.11.2/css/all.css');
}

add_action('wp_enqueue_scripts', 'enqueue_load_fa');

function project_register_post_type()
{
    register_post_type(
        'project',
        [
            'labels' => array(
                'name' => __('Projects'),
                'singular_name' => __('Project')
            ),
            'public' => true,
            'has_archive' => true,
            'rewrite' => ['slug' => 'hong-kong-law'],
            'taxonomies' => ['post_tag'],
        ]
    );
}

add_action('init', 'project_register_post_type');

// =============================================
// Custom Shortcodes Functions
// =============================================

require_once get_stylesheet_directory() . '/includes/custom-shortcodes.php';

// =============================================
// Custom Main Navigation Menu
// =============================================
function get_menu_id($location)
{
    $locations = get_nav_menu_locations();
    return $locations[$location] ?? '';
}

function get_custom_nav_menu($location)
{
    $menu_id = get_menu_id($location);

    if (!$menu_id) {
        return null;
    }

    $menu_items = wp_get_nav_menu_items($menu_id);

    if (!$menu_items) {
        return null;
    }

    $menu_array = [];

    // Organize menu items into a hierarchical array
    foreach ($menu_items as $item) {
        if ($item->menu_item_parent == 0) {
            // Top level
            $menu_array[$item->ID] = [
                'item' => $item,
                'subchildren' => []
            ];
        } elseif (isset($menu_array[$item->menu_item_parent])) {
            // 2nd level (subchildren)
            $menu_array[$item->menu_item_parent]['subchildren'][$item->ID] = [
                'children-item' => $item,
                'grandchildren' => []
            ];
        } else {
            // 3rd level (grandchildren)
            foreach ($menu_array as &$top_item) {
                foreach ($top_item['subchildren'] as &$sub_item) {
                    if ($sub_item['children-item']->ID == $item->menu_item_parent) {
                        $sub_item['grandchildren'][$item->ID] = [
                            'grandchildren-item' => $item
                        ];
                        break 2;
                    }
                }
            }
        }
    }

    return $menu_array;
}

remove_filter('the_content', 'wpautop');
remove_filter('the_excerpt', 'wpautop');

// =============================================
// Custom Main Navigation Menu | END:::
// =============================================

function get_posts_for_indexeddb_ajax()
{
    check_ajax_referer('get_posts_for_indexeddb_nonce', 'nonce');

    $hash_only = isset($_POST['hash_only']) && $_POST['hash_only'] === 'true';

    $custom_type = 'project';
    $limit = -1;
    $category = '';

    $args_post = [
        'post_type' => 'post',
        'posts_per_page' => $limit,
        'post_status' => 'publish',
    ];
    if (!empty($category)) {
        $args_post['category_name'] = $category;
    }

    // Prepare query args for projects
    $args_project = [
        'post_type' => $custom_type,
        'posts_per_page' => $limit,
        'post_status' => 'publish',
    ];
    if (!empty($category)) {
        $args_project['tax_query'] = [
            [
                'taxonomy' => $custom_type . '_category',
                'field' => 'slug',
                'terms' => explode(',', $category),
            ]
        ];
    }

    // Get posts for both types
    $posts = function_exists('get_all_posts_data') ? get_all_posts_data(['post'], $args_post) : [];
    $projects = function_exists('get_all_posts_data') ? get_all_posts_data([$custom_type], $args_project) : [];

    // Merge and sort by date (latest first)
    $all_posts = array_merge($posts, $projects);
    usort($all_posts, function ($a, $b) {
        $a_ts = strtotime($a['post_date'] ?? '');
        $b_ts = strtotime($b['post_date'] ?? '');
        return $b_ts <=> $a_ts;
    });

    // Filter out posts without any image
    $all_posts = array_filter($all_posts, function ($post) {
        $native_img = !empty($post['featured_image']);
        $plugin_img = !empty(get_post_meta($post['id'], 'fiuw_image_url', true));
        return $native_img || $plugin_img;
    });

    // Generate hash for all posts
    $json_data = json_encode(array_values($all_posts));
    $data_hash = md5($json_data);

    // If this is a hash-only request, just return the hash
    if ($hash_only) {
        wp_send_json_success(['hash' => $data_hash]);
        wp_die();
    }

    // Otherwise return full post data with hash
    $response = [
        'hash' => $data_hash,
        'posts' => array_values($all_posts),
        'last_updated' => current_time('timestamp')
    ];

    wp_send_json_success($response);
    wp_die();
}

add_action('wp_ajax_get_posts_for_indexeddb', 'get_posts_for_indexeddb_ajax');
add_action('wp_ajax_nopriv_get_posts_for_indexeddb', 'get_posts_for_indexeddb_ajax');

function enqueue_lazy_indexeddb_storage()
{
    $script_path = get_stylesheet_directory() . '/js/indexeddb-loader.js';
    $script_url = get_stylesheet_directory_uri() . '/js/indexeddb-loader.js';

    // Check if file exists and get version safely
    $version = file_exists($script_path) ? filemtime($script_path) : '1.0';

    // Register and enqueue the script
    wp_register_script(
        'lazy-indexeddb-posts',
        $script_url,
        [],
        $version,
        true
    );

    wp_enqueue_script('lazy-indexeddb-posts');

    // Create endpoint data for AJAX instead of embedding all data
    wp_localize_script('lazy-indexeddb-posts', 'indexedDB_settings', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'action' => 'get_posts_for_indexeddb',
        'nonce' => wp_create_nonce('get_posts_for_indexeddb_nonce')
    ]);
}

add_action('wp_enqueue_scripts', 'enqueue_lazy_indexeddb_storage');
