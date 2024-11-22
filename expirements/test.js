function showNewsLettersPostItems(
  selectedCategory = "hong-kong-law",
  loaderId = "loader"
) {
  const postsPerPage = -1; // Replace with the desired number of posts per page
  const search = ""; // Replace with the desired search term
  const postType = "post"; // Replace with the desired post type
  const checkInterval = 900000; // Check for new posts every 15 minutes

  function fetchPosts(callback) {
    fetch(
      `/wp-admin/admin-ajax.php?action=get_newsletters_posts&posts_per_page=${postsPerPage}&search=${search}&post_type=${postType}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          callback(data);
        } else {
          console.error("Expected an array of posts but got:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }

  function storeInIndexedDB(posts) {
    const request = indexedDB.open("newslettersDB", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      const objectStore = db.createObjectStore("posts", { keyPath: "url" });
      objectStore.createIndex("title", "title", { unique: false });
      objectStore.createIndex("date", "date", { unique: false });
      objectStore.createIndex("excerpt", "excerpt", { unique: false });
      objectStore.createIndex("image_src", "image_src", { unique: false });
      objectStore.createIndex("image_alt", "image_alt", { unique: false });
      objectStore.createIndex("category", "category", { unique: false });
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(["posts"], "readwrite");
      const objectStore = transaction.objectStore("posts");

      posts.forEach((post) => {
        objectStore.put(post);
      });

      transaction.oncomplete = function () {
        console.log("All posts have been stored in IndexedDB.");

        // Calculate the size of the data being stored
        const jsonString = JSON.stringify(posts);
        const sizeInBytes = new Blob([jsonString]).size;
        const sizeInMB = sizeInBytes / (1024 * 1024);
        console.log(`Data size: ${sizeInMB.toFixed(2)} MB`);
      };

      transaction.onerror = function (event) {
        console.error("Transaction error: ", event.target.error);
      };
    };

    request.onerror = function (event) {
      console.error("IndexedDB error: ", event.target.error);
    };
  }

  function getPostsFromIndexedDB(callback) {
    const request = indexedDB.open("newslettersDB", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("posts")) {
        db.createObjectStore("posts", { keyPath: "url" });
      }
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(["posts"], "readonly");
      const objectStore = transaction.objectStore("posts");

      const posts = [];
      objectStore.openCursor().onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          posts.push(cursor.value);
          cursor.continue();
        } else {
          callback(posts);
        }
      };
    };

    request.onerror = function (event) {
      console.error("IndexedDB error: ", event.target.error);
      callback([]);
    };
  }

  function renderPosts(posts) {
    const container = document.getElementById("newsletters_post");

    if (!container) {
      console.error("Container element not found");
      return;
    }

    container.innerHTML = "";

    const filteredPosts = posts.filter((post) =>
      post.category.includes(selectedCategory)
    );

    // Sort posts by date from newest to oldest
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    filteredPosts.forEach((post) => {
      const article = document.createElement("article");
      article.classList.add("newsletter_post_item", "flex-col");
      article.setAttribute("data-nl_date", post.date);
      article.setAttribute("data-category", selectedCategory);

      article.innerHTML = /*html*/ `
                <div class="post-thumbnail">
                    <img src="${post.image_src}" alt="${
        post.image_alt
      }" width="286" height="286" loading="lazy" fetchpriority="high">
                    <h2 class="post-title" title="${post.title}">
                      <a href="${post.url}"> ${post.title}</a>
                    </h2>
                    ${
                      post.excerpt
                        ? `<div class="post-excerpt">${post.excerpt}</div>`
                        : ""
                    }
                    <a class="cta-gridview" href="${
                      post.url
                    }">Read Newsletter</a>
                </div>
                <div class="newsletter_post_text_contents mt-auto">
                    <a class="read-newsletter-button" href="${
                      post.url
                    }">Read Newsletter</a>
                </div>
            `;

      container.appendChild(article);
    });
  }

  function checkForNewPosts() {
    fetchPosts((fetchedPosts) => {
      getPostsFromIndexedDB((storedPosts) => {
        const newPosts = fetchedPosts.filter(
          (fetchedPost) =>
            !storedPosts.some(
              (storedPost) => storedPost.url === fetchedPost.url
            )
        );

        if (newPosts.length > 0) {
          storeInIndexedDB([...storedPosts, ...newPosts]);
          renderPosts([...storedPosts, ...newPosts]);
        }
      });
    });
  }

  getPostsFromIndexedDB((posts) => {
    if (posts.length > 0) {
      renderPosts(posts);
    } else {
      fetchPosts((fetchedPosts) => {
        storeInIndexedDB(fetchedPosts);
        renderPosts(fetchedPosts);
      });
    }
  });

  setInterval(checkForNewPosts, checkInterval);
}
