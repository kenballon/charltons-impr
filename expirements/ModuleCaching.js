// posts-cache.js
class PostsCacheManager {
  constructor() {
    this.storageKey = "wp_posts_cache";
    this.version = "1.0";
    this.expiration = 3600000; // 1 hour in milliseconds

    // Initialize IndexedDB
    this.initIndexedDB();
  }

  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("WPPostsCache", 1);

      request.onerror = () => reject("IndexedDB initialization failed");

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("posts")) {
          db.createObjectStore("posts", { keyPath: "id" });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
      };
    });
  }

  async storePosts(posts) {
    const transaction = this.db.transaction(["posts"], "readwrite");
    const store = transaction.objectStore("posts");

    // Store each post
    posts.forEach((post) => {
      store.put({
        ...post,
        timestamp: Date.now(),
      });
    });

    // Also store in localStorage for faster access
    localStorage.setItem(
      this.storageKey,
      JSON.stringify({
        version: this.version,
        timestamp: Date.now(),
        posts: posts,
      })
    );
  }

  async getPosts() {
    // Try localStorage first for faster access
    const cached = localStorage.getItem(this.storageKey);
    if (cached) {
      const data = JSON.parse(cached);
      if (
        data.version === this.version &&
        Date.now() - data.timestamp < this.expiration
      ) {
        return data.posts;
      }
    }

    // Fall back to IndexedDB
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["posts"], "readonly");
      const store = transaction.objectStore("posts");
      const request = store.getAll();

      request.onsuccess = () => {
        const posts = request.result.filter(
          (post) => Date.now() - post.timestamp < this.expiration
        );
        resolve(posts);
      };

      request.onerror = () => reject("Failed to retrieve posts from IndexedDB");
    });
  }

  async filterPosts(search = "", category = "", limit = 4) {
    const posts = await this.getPosts();
    return posts
      .filter((post) => {
        const matchesSearch =
          !search ||
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          !category || post.categories.some((cat) => cat.slug === category);

        return matchesSearch && matchesCategory;
      })
      .slice(0, limit || posts.length);
  }
}

// Initialize cache manager and store initial posts data
document.addEventListener("DOMContentLoaded", async () => {
  const cacheManager = new PostsCacheManager();
  await cacheManager.initIndexedDB();

  // Store initial posts data if available
  if (typeof postsData !== "undefined" && postsData.posts) {
    await cacheManager.storePosts(postsData.posts);
  }

  // Example: Handle search input
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("input", async (e) => {
      const searchTerm = e.target.value;
      const filteredPosts = await cacheManager.filterPosts(searchTerm);
      // Update UI with filtered posts
      updatePostsUI(filteredPosts);
    });
  }
});

// Helper function to update posts UI
function updatePostsUI(posts) {
  const container = document.querySelector(".posts-grid");
  if (!container) return;

  container.innerHTML = posts
    .map(
      (post) => `
        <article class="post-item">
            ${
              post.image.url
                ? `
                <div class="post-thumbnail">
                    <img src="${post.image.url}"
                         alt="${post.image.alt}"
                         width="${post.image.width}"
                         height="${post.image.height}"
                         loading="lazy">
                </div>
            `
                : ""
            }
            
            <div class="post-content">
                <time datetime="${post.date.raw}">
                    ${post.date.formatted}
                </time>
                
                <h2 class="post-title">
                    <a href="${post.url}">
                        ${post.title}
                    </a>
                </h2>
                
                <div class="post-excerpt">
                    ${post.excerpt}
                </div>
                
                ${
                  post.categories.length
                    ? `
                    <div class="post-categories">
                        ${post.categories
                          .map(
                            (category) => `
                            <span class="category-${category.slug}">
                                ${category.name}
                            </span>
                        `
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
            </div>
        </article>
    `
    )
    .join("");
}
