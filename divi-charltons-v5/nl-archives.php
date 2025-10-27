<?php

// Charltons Customizations (entire file)

// list all newsletters
// original function
function list_all_charltons_newsletter_archives($limit = 20)
{
    global $wpdb;
    $query = 'select newsletter, lang from wp_charltons_category_sort order by sortorder';
    $results = $wpdb->get_results($query);
    if ($results) {
        foreach ((array) $results as $result) {
            list_charltons_newsletters($result->newsletter, $result->lang, true, $limit);
        }
    }
}

// get a list of the newsletters
// original function
function list_charltons_newsletters($newsletter = false, $language = false, $subheadings = false, $limits = false)
{
    global $wpdb;
    $filter = '';

    // the $newsletter is a filter based on the category slug of the newsletter
    if ($newsletter) {
        $filter = " and t.meta_value = '" . $newsletter . "' ";
    }
    if ($language) {
        $filter = $filter . " and l.meta_value = '" . $language . " ' ";
    }

    // we don't check to see if this is a proper number
    // might cause problems later
    if ($limits) {
        $maxitems = ' limit ' . $limits;
    } else {
        $maxitems = '';
    }

    $query = "
    select
    year(p.post_date) AS nlyear, p.id, date_format(p.post_date, '%e %M') as nldate, convert(i.meta_value,unsigned integer) as nlissue, t.meta_value as nltype, l.meta_value as nllang, p.post_title, p.post_date
    from
    wp_postmeta i, wp_postmeta t, wp_postmeta l, wp_posts p
    where
    p.post_type = 'post' and p.post_status='publish' and p.id = i.post_id and p.id = t.post_id and p.id = l.post_id
      and i.meta_key = 'nl_issue' and t.meta_key = 'nl_type' and l.meta_key = 'nl_lang'" . $filter . '
    order
      by 8 desc' . $maxitems . '
    ;';

    $last_changed = wp_cache_get_last_changed('posts');
    $key = md5($query);
    $key = "wp_get_archives:$key:$last_changed";
    if (!$results = wp_cache_get($key, 'posts')) {
        $results = $wpdb->get_results($query);
        wp_cache_set($key, $results, 'posts');
    }

    $lastyear = '1900';
    $lastcategory = 'xxx';
    if ($results) {
        echo '<table id="archivelist">';
        foreach ((array) $results as $result) {
            if ($lastyear != $result->nlyear) {
                $lastyear = $result->nlyear;
                $lastcategory = 'xxx';

                if ($subheadings) {
                    if ($lastcategory != $result->nltype) {
                        $lastcategory = $result->nltype;
                        $categoryObj = get_category_by_slug($result->nltype);

                        echo '<tr class="nl-year"><th colspan="2"><h2>' . $categoryObj->name . ' (' . $lastyear . ')' . '</h2></th></tr>';
                    }
                } else {
                    echo '<tr class="nl-year"><th colspan="2"><h2>' . $result->nlyear . '</h2></th></tr>';
                }
            }
            echo '<tr>';
            echo '<!-- <td width="40px">' . $result->nlissue . '</td>-->';
            echo '<td width="10%" valign="top" nowrap>' . $result->nldate . '</td>';
            echo '<td valign="top" align="left"><a href="' . get_permalink($result->id) . '">' . $result->post_title . '</a></td>';
        }
        echo '</tr></table>';
    } else {
        // nothing found
        echo '<p><br><br></p>';
    }
}

function get_insights_achive_shortcode($atts, $content = null)
{
    global $post;
    extract(shortcode_atts(array('category' => 'ipo'), $atts));

    $query_args = array(
        'post_type' => 'project',
        'posts_per_page' => 3000,
        'order' => 'DESC',
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
    $output = '<table id="archivelist">';
    $lastyear = '1900';
    while ($query->have_posts()):
        $query->the_post();

        $year = substr(get_the_date(), 0, 4);

        if ($year != $lastyear) {
            $output .= '<tr class="nl-year"><th colspan="2"><h2>' . $year . '</h2></th></tr>';
        }

        $output .= '<tr>';
        $output .= '<td width="10%" valign="top" nowrap>' . get_the_date('M Y') . '</td>';
        $output .= '<td valign="top" align="left"><a href="' . get_the_permalink() . '">' . get_the_title() . '</a></td>';
        $output .= '</tr>';

        $lastyear = $year;
    endwhile;
    $output .= '</table>';
    wp_reset_postdata();
    return $output;
}

add_shortcode('get_insights_achive', 'get_insights_achive_shortcode');