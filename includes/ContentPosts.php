<?php

class ContentPosts
{
    private ?string $category;
    private ?string $tags;
    private string $featImgSize;
    private string $dateFormat;
    private string $postType;

    public function __construct(string $postType = 'post', ?string $category = null, ?string $tags = null, string $featImgSize = 'medium_large', string $dateFormat = 'd M Y')
    {
        $this->postType = $postType;
        $this->category = $category;
        $this->tags = $tags;
        $this->featImgSize = $featImgSize;
        $this->dateFormat = $dateFormat;
    }

    /**
     * Get query arguments for fetching posts.
     *
     * @param int $num_posts
     * @return array
     */
    private function getQueryArgs(int $num_posts): array
    {
        return [
            'post_type' => $this->postType,
            'post_status' => 'publish',
            'has_password' => false,
            'category_name' => $this->category,
            'tag' => $this->tags,
            'posts_per_page' => $num_posts,
        ];
    }

    /**
     * Fetch posts based on the query arguments.
     *
     * @param int $num_posts
     * @return array
     */
    private function fetchPosts(int $num_posts = -1): array
    {
        if (!$this->category && !$this->tags) {
            return [];
        }

        $query = new WP_Query($this->getQueryArgs($num_posts));
        $posts = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $posts[] = $this->getPostData();
            }

            wp_reset_postdata();
        }

        return $posts;
    }

    /**
     * Get data for a single post.
     *
     * @return array
     */
    private function getPostData(): array
    {
        return [
            'title' => get_the_title(),
            'url' => get_permalink(),
            'excerpt' => get_the_excerpt(),
            'featured_image' => get_the_post_thumbnail_url(null, $this->featImgSize),
            'date' => get_the_date($this->dateFormat),
            'tags' => get_the_tags() ? array_map(function ($tag) {
                return $tag->slug;
            }, get_the_tags()) : [],
        ];
    }

    /**
     * Get a specified number of posts with an optional offset.
     *
     * @param int $num_posts
     * @param int $offset
     * @return array
     */
    public function getPosts(int $num_posts = 1, int $offset = 0): array
    {
        $posts = $this->fetchPosts($num_posts + $offset);
        return array_slice($posts, $offset, $num_posts);
    }

    /**
     * Get all posts with pagination.
     *
     * @param int $page
     * @param int $posts_per_page
     * @param int $offset
     * @return array
     */
    public function getAllPosts(int $page = 1, int $posts_per_page = 10, int $offset = 0): array
    {
        $offset = ($page - 1) * $posts_per_page + $offset;
        return $this->getPosts($posts_per_page, $offset);
    }
}
