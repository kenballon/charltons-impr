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

add_action('wp_enqueue_scripts', 'theme_gsap_script');

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
