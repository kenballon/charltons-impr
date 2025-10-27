<?php get_header(); ?>

<section class="pnf-404 ">
    <div class="page_not_found_wrapper w-full flex content-center flex-col items-center">
        <img src="/wp-content/uploads/2025/09/red-blur.webp" alt="creative blur">
        <img src="/wp-content/uploads/2025/09/blur-black-4.webp" alt="creative ring">
        <div class="details_pnf w-full flex content-center flex-col items-center">
            <h1 class="pnf-headline text-white">404</h1>
            <p class="text-center text-white">Sorry, the page you are looking for could not be found.</p>
            <a href="<?php echo home_url(); ?>" class="default_link text-medium mt-4">Home</a>
        </div>
    </div>
</section>
<?php

get_footer();