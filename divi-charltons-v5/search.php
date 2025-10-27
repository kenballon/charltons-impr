<?php get_header(); ?>
<?php
$search_refer = $_GET['section'];
if ($search_refer == 'site') {
    get_template_part('search', 'site');
} elseif ($search_refer == 'newsletter') {
    get_template_part('search', 'newsletters');
}
;

?>
<?php get_footer(); ?>