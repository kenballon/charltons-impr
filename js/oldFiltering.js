function allNewsLettersPosts() {
  const newsLetterPostItems = document.querySelectorAll(
    ".newsletter_post_item"
  );

  const searchInput = document?.getElementById("newsletterSearch");
  const showCloseButton = document?.getElementById("nl_close_search");
  const nlSearchIcon = document?.getElementById("nl_search_icon");
  const loader = document.getElementById("loader");
  const nlCategTitle = document.getElementById("nl_categ_title");

  FilterButton.initializeAll(SELECTORS.CategPPWFilterButtons, (filterID) => {
    filterByCategoryNewsletter(filterID);
  });

  function filterByCategoryNewsletter(category = "hong-kong-law") {
    const newsLetterPostItems = document.querySelectorAll(
      ".newsletter_post_item"
    );

    newsLetterPostItems.forEach((post) => {
      const postCategory = post.dataset.category;
      const shouldAppend = !category || postCategory === category;

      if (shouldAppend) {
        post.classList.remove("d-none");
      } else {
        post.classList.add("d-none");
      }
    });

    nlCategTitle.textContent = category
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    getAllNewsletterPost(category);
    newsLetterSearchFunc(category);
  }

  // Call the function on initial page load
  newsLetterSearchFunc();

  //SEARCH NEWSLETTERS
  searchInput?.addEventListener("input", function () {
    showCloseButton.classList.toggle("active", searchInput.value.length >= 2);
    if (searchInput.value.length >= 2) {
      nlSearchIcon.style.display = "none";
    } else if (searchInput.value.length === 0) {
      nlSearchIcon.style.display = "flex";
    }
  });

  showCloseButton?.addEventListener("click", function () {
    searchInput.value = "";
    showCloseButton.classList.remove("active");
    nlSearchIcon.style.display = "flex";

    const filterBtnPillActive = document?.querySelectorAll(
      ".ppw_category_filter"
    );

    filterBtnPillActive.forEach((btn) => {
      if (btn.classList.contains("active")) {
        getAllNewsletterPost(btn.id);
      }
    });
  });
  //SEARCH NEWSLETTERS END
}

const loadMoreButton = document?.getElementById("btn_load_more");

const openIndexedDB = (dbName, version = 1) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onerror = (event) => {
      console.error("IndexedDB Error:", event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Perform any database upgrade operations here if needed
      console.log("Database upgrade needed:", db);
    };
  });
};

function newsLetterSearchFunc(
  category = "hong-kong-law",
  searchInputId = "newsletterSearch"
) {
  const searchInput = document?.getElementById(searchInputId);

  if (!searchInput) {
    console.warn("Search input element not found");
    return;
  }

  // Remove any existing event listener to avoid multiple bindings
  searchInput.removeEventListener("input", searchInput._handler);

  const handler = async function () {
    const dbName = "PostsDatabase";
    const storeName = "posts";
    const searchQuery = this.value.toLowerCase();
    const matchedPosts = [];

    if (searchQuery.length >= 2) {
      try {
        const db = await openIndexedDB(dbName);
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);

        objectStore.openCursor().onsuccess = function (event) {
          const cursor = event.target.result;
          if (cursor) {
            const {
              title = "",
              excerpt = "",
              categories = "",
              date = "",
            } = cursor.value;
            const postCategories = categories.toLowerCase().split(", ");

            if (
              postCategories.includes(category.toLowerCase()) &&
              (title.toLowerCase().includes(searchQuery) ||
                excerpt.toLowerCase().includes(searchQuery))
            ) {
              matchedPosts.push(cursor.value);
            }
            cursor.continue();
          }
        };

        transaction.oncomplete = function () {
          displayPosts(matchedPosts);
        };

        objectStore.openCursor().onerror = function (event) {
          console.error("Cursor Error:", event.target.errorCode);
        };
      } catch (error) {
        console.error("Failed to open database:", error);
      }
    } else if (searchQuery.length === 0) {
      getAllNewsletterPost(category);
    }
  };

  // Add the event listener with the handler function
  searchInput.addEventListener("input", handler);
  searchInput._handler = handler; // Store the handler for future reference
}

function getAllNewsletterPost(category = "hong-kong-law") {
  const dbName = "PostsDatabase";
  const storeName = "posts";

  if (!window.indexedDB) {
    console.log("Your browser doesn't support IndexedDB.");
    return;
  }

  openIndexedDB(dbName)
    .then((db) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = function () {
        let posts = getAllRequest.result;

        // Sort posts by post_date in descending order
        posts.sort((a, b) => {
          const dateA = new Date(a.post_date.split("-").reverse().join("-"));
          const dateB = new Date(b.post_date.split("-").reverse().join("-"));
          return dateB - dateA;
        });

        // Filter posts by category if a category is provided
        if (category) {
          posts = posts.filter((post) => {
            const postCategories = sanitizeHTML(post.categories)
              .toLowerCase()
              .split(", ");
            return postCategories.includes(category.toLowerCase());
          });
        }

        displayPosts(posts);
      };

      getAllRequest.onerror = function () {
        console.log("Error reading posts from IndexedDB.");
      };
    })
    .catch((error) => {
      console.log("Error opening IndexedDB:", error);
    })
    .finally(() => {
      loader.style.display = "none";
    });
}

function displayPosts(posts) {
  const container = document?.getElementById("newsletters_post");
  container.innerHTML = ""; // Clear previous content

  // Display the first 12 posts immediately
  posts.slice(0, 12).forEach((post) => {
    const article = createPostElement(post);
    container.appendChild(article);
  });

  // Delay the insertion of the remaining posts and add "d-none" class
  const remainingPosts = posts.slice(12);
  insertPostsInBatches(container, remainingPosts, 12);
}

function insertPostsInBatches(container, posts, batchSize) {
  let index = 0;

  function insertBatch() {
    const batch = posts.slice(index, index + batchSize);
    batch.forEach((post) => {
      const article = createPostElement(post);
      article.classList.add("d-none");
      container.appendChild(article);
    });

    index += batchSize;

    if (index < posts.length) {
      setTimeout(insertBatch, 100); // Delay for 100ms before inserting the next batch
    }
  }

  insertBatch();
}

function createPostElement(post) {
  const article = document.createElement("article");
  article.className = "newsletter_post_item flex-col";
  article.setAttribute("data-nl_date", post.post_date);

  // Sanitize and strip HTML tags from categories and join them with commas
  const categories = sanitizeHTML(post.categories)
    .toLowerCase()
    .split(",")
    .join(", ");
  article.setAttribute("data-category", categories);

  const link = document.createElement("a");
  link.href = post.url;
  link.tabIndex = 0;

  const thumbnailDiv = document.createElement("div");
  thumbnailDiv.className = "post-thumbnail";

  const img = document.createElement("img");
  img.src = post.featured_image;
  img.alt = post.title;
  img.width = 286;
  img.height = 286;
  // img.loading = "lazy";
  img.fetchpriority = "high";

  const title = document.createElement("h2");
  title.className = "post-title";
  title.title = decodeHTMLEntities(post.title);
  title.textContent = decodeHTMLEntities(post.title);

  const postDate = document.createElement("time");
  postDate.className = "post-date";

  const date = parseDate(post.post_date);
  if (!date || isNaN(date.getTime())) {
    postDate.textContent = "Invalid Date";
  } else {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    postDate.textContent = formattedDate;
    postDate.setAttribute("datetime", date.toISOString());
  }

  const excerptDiv = document.createElement("div");
  excerptDiv.className = "post-excerpt";

  // Sanitize and strip HTML tags from excerpt
  const excerptText = decodeHTMLEntities(post.excerpt);
  excerptDiv.textContent = excerptText;

  thumbnailDiv.appendChild(img);
  thumbnailDiv.appendChild(postDate);
  thumbnailDiv.appendChild(title);
  thumbnailDiv.appendChild(excerptDiv);
  link.appendChild(thumbnailDiv);
  article.appendChild(link);

  return article;
}

function sanitizeHTML(html) {
  const tempDiv = document.createElement("div");
  tempDiv.textContent = html;
  return tempDiv.innerHTML;
}

function decodeHTMLEntities(text) {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

function parseDate(dateString) {
  const parts = dateString.split("-");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is zero-based in JavaScript Date
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}

function loadMoreHandler() {
  try {
    const hiddenItems = document.querySelectorAll(
      ".newsletter_post_item.d-none"
    );
    const newsLetterPostItems = document.querySelectorAll(
      ".newsletter_post_item"
    );

    if (hiddenItems.length > 0) {
      hiddenItems.forEach((item, index) => {
        if (index < 12) item.classList.remove("d-none");
      });
      loadMoreButton.innerHTML =
        hiddenItems.length <= 12 ? "Show Less" : "See More";
    } else {
      newsLetterPostItems.forEach((item, index) => {
        if (index >= 12) item.classList.add("d-none");
      });
      loadMoreButton.textContent = "See More";
    }
  } catch (error) {
    console.error("Error in loadMoreHandler:", error);
  }
}

function updateNewsLetterPostItemsCount() {
  try {
    const newsLetterPostItems = document.querySelectorAll(
      ".newsletter_post_item"
    );
    const hiddenItems = document.querySelectorAll(
      ".newsletter_post_item.d-none"
    );

    loadMoreButton.classList.toggle("d-none", newsLetterPostItems.length <= 12);
    loadMoreButton.innerHTML =
      hiddenItems.length > 0 ? "See More" : "Show Less";
  } catch (error) {
    console.error("Error in updateNewsLetterPostItemsCount:", error);
  }
}

const newslettersPostElement = document?.getElementById("newsletters_post");

if (newslettersPostElement) {
  try {
    const observer = new MutationObserver(() =>
      updateNewsLetterPostItemsCount()
    );

    observer.observe(newslettersPostElement, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  } catch (error) {
    console.error("Error in MutationObserver setup:", error);
  }
} else {
  console.warn("newslettersPostElement not found.");
}

loadMoreButton?.addEventListener("click", loadMoreHandler);

function initNewsletterPage() {
  const wordsPerMinute = 200;
  const wrapper = document.querySelector(".single_post_content_wrapper");
  const readTimeElement = document?.getElementById("read_time_est");

  if (wrapper && readTimeElement) {
    const wordCount = wrapper.innerText.trim().split(/\s+/).length;
    readTimeElement.innerText = `${Math.ceil(
      wordCount / wordsPerMinute
    )} minute read`;
  } else {
    console.warn("Wrapper or read time element not found!");
  }

  const openDownloadURL = (url, errorMessage) => {
    if (!url) return console.error(errorMessage);
    const link = Object.assign(document.createElement("a"), {
      href: url,
      target: "_blank",
    });
    document.body.appendChild(link).click();
    document.body.removeChild(link);
  };

  const openDownloadOptions = document.getElementById("open_dl_options");
  const downloadDialog = document.getElementById("nlDowloadOptions");
  const downloadPDF = document.getElementById("dl_pdf");
  const openWordUrl = document.getElementById("dl_word");

  openDownloadOptions?.addEventListener("click", () =>
    toggleDialog(downloadDialog, openDownloadOptions)
  );
  downloadPDF?.addEventListener("click", () => {
    openDownloadURL(
      document.getElementById("pdf_url_hidden_input")?.value,
      "PDF URL is not available."
    );
    downloadDialog.classList.remove("open");
  });
  openWordUrl?.addEventListener("click", () => {
    openDownloadURL(
      document.getElementById("word_url_hidden_input")?.value,
      "Word URL is not available."
    );
    downloadDialog.classList.remove("open");
  });

  // refactoring this code to accomodate the new design and requirements
  // const nlShareButton = document.getElementById("nl_sharebtn");
  // const shareDialog = document.getElementById("nlShareOptions");
  const nlShareButton = document.querySelectorAll(".share_btn");

  const shareDialogHTML = /*html*/ `   
    <div id="nlShareOptions" aria-hidden="true">
    <ul>
        <li>
            <button>
                <div class="flex gap-1 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                        viewBox="0 0 24 24">
                        <path fill="#5f6368" fill-rule="evenodd"
                            d="m12.505 9.678.59-.59a5 5 0 0 1 1.027 7.862l-2.829 2.83a5 5 0 0 1-7.07-7.072l2.382-2.383q.002.646.117 1.298l-1.793 1.792a4 4 0 0 0 5.657 5.657l2.828-2.828a4 4 0 0 0-1.046-6.411q.063-.081.137-.155m-1.01 4.646-.589.59a5 5 0 0 1-1.027-7.862l2.828-2.83a5 5 0 0 1 7.071 7.072l-2.382 2.383a7.7 7.7 0 0 0-.117-1.297l1.792-1.793a4 4 0 1 0-5.657-5.657l-2.828 2.828a4 4 0 0 0 1.047 6.411 2 2 0 0 1-.138.155"
                            clip-rule="evenodd"></path>
                    </svg>
                    <div>Copy link</div>
                </div>
            </button>
        </li>
        <li>
            <button aria-label="Share on linkedin" class="flex gap-1 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                    viewBox="0 0 24 24" class="cg aoi">
                    <path fill="#5f6368"
                        d="M21 4.324v15.352A1.324 1.324 0 0 1 19.676 21H4.324A1.324 1.324 0 0 1 3 19.676V4.324A1.324 1.324 0 0 1 4.324 3h15.352A1.324 1.324 0 0 1 21 4.324M8.295 9.886H5.648v8.478h2.636V9.886zm.221-2.914a1.52 1.52 0 0 0-1.51-1.533H6.96a1.533 1.533 0 0 0 0 3.066 1.52 1.52 0 0 0 1.556-1.487zm9.825 6.236c0-2.555-1.626-3.542-3.229-3.542a3.02 3.02 0 0 0-2.67 1.37h-.082V9.875H9.875v8.477h2.648v-4.494a1.754 1.754 0 0 1 1.579-1.893h.104c.837 0 1.464.523 1.464 1.858v4.54h2.647l.024-5.144z">
                    </path>
                </svg>
                <div class="ca hq">Share on LinkedIn</div>
            </button>
        </li>
        <li>
            <button aria-label="Share on twitter" class="flex gap-1 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                    viewBox="0 0 24 24" class="cg aoi">
                    <path fill="#5f6368"
                        d="M13.346 10.932 18.88 4.5h-1.311l-4.805 5.585L8.926 4.5H4.5l5.803 8.446L4.5 19.69h1.311l5.074-5.898 4.053 5.898h4.426zM11.55 13.02l-.588-.84-4.678-6.693h2.014l3.776 5.4.588.842 4.907 7.02h-2.014z">
                    </path>
                </svg>
                <div>Share on X</div>
            </button>
        </li>
        <li>
            <button aria-label="Share on facebook" class="flex gap-1 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                    viewBox="0 0 24 24" class="cg aoi">
                    <path fill="#5f6368"
                        d="M22 12.061C22 6.505 17.523 2 12 2S2 6.505 2 12.061c0 5.022 3.657 9.184 8.438 9.939v-7.03h-2.54V12.06h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.908h-2.33V22c4.78-.755 8.437-4.917 8.437-9.939">
                    </path>
                </svg>
                <div>Share on Facebook</div>
            </button>
        </li>
    </ul>
    </div>
    `;

  const toggleDialog = (button) => {
    const existingDialog = document.getElementById("nlShareOptions");

    const handleClickOutside = (event) => {
      const newDialog = document.getElementById("nlShareOptions");
      if (
        newDialog &&
        !newDialog.contains(event.target) &&
        !button.contains(event.target)
      ) {
        newDialog.remove();
        button.setAttribute("data-dialog", "close");
        button.classList.remove("open");
        document.removeEventListener("click", handleClickOutside);
      }
    };

    if (existingDialog) {
      existingDialog.remove();
      button.setAttribute("data-dialog", "close");
      button.classList.remove("open");
      document.removeEventListener("click", handleClickOutside);
    } else {
      button.insertAdjacentHTML("afterend", shareDialogHTML);
      const newDialog = button.nextElementSibling;
      newDialog.classList.add("open");
      button.setAttribute("data-dialog", "open");
      button.classList.add("open");

      // Attach event listeners to the share buttons after the dialog is inserted into the DOM
      document
        .querySelectorAll("#nlShareOptions button")
        .forEach((shareButton) => {
          const action = shareActions[shareButton.textContent.trim()];
          if (action) {
            shareButton.addEventListener("click", () => {
              handleShareAction(action);
              nlShareButton.forEach((btn) => {
                btn.setAttribute("data-dialog", "close");
                btn.classList.remove("open");
              });
            });
          }
        });

      document.addEventListener("click", handleClickOutside);
    }
  };

  nlShareButton.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleDialog(btn);
    });
  });

  const shareActions = {
    "Copy link": "copy",
    "Share on LinkedIn": "https://www.linkedin.com/shareArticle?url=",
    "Share on X": "https://twitter.com/intent/tweet?url=",
    "Share on Facebook": "https://www.facebook.com/sharer/sharer.php?u=",
  };

  const handleShareAction = (action) => {
    const url = window.location.href;
    if (action === "copy") {
      navigator.clipboard.writeText(url).then(() => {
        const successDiv = Object.assign(document.createElement("div"), {
          textContent: "URL copied to clipboard!",
          style:
            "position: absolute; top: 80%; left: 50%; transform: translate(-50%, -50%); background-color: black; color: white; padding: 10px; border-radius: 5px; z-index: 900;",
        });
        document.body.appendChild(successDiv);
        setTimeout(() => document.body.removeChild(successDiv), 2000);
      });
    } else if (action === "mailto") {
      window.location.href = `mailto:?subject=${encodeURIComponent(
        "Check out this page"
      )}&body=${encodeURIComponent(`I found this interesting: ${url}`)}`;
    } else {
      window.open(action + encodeURIComponent(url), "_blank");
    }
    const shareDialog = document.getElementById("nlShareOptions");
    if (shareDialog) {
      shareDialog.remove();
    }
  };
}

// function that gets all tags that has the value of awards
async function getAwardPosts() {
  const dbName = "PostsDatabase";
  const storeName = "posts";
  const tagValue = "awards";
  const maxInitialPosts = 16;
  let currentPostIndex = 0;

  try {
    const db = await openIndexedDB(dbName);
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);

    const awardPosts = [];

    objectStore.openCursor().onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        const {
          title,
          url,
          post_date,
          categories,
          category_names,
          featured_image,
          tags,
        } = cursor.value;
        const postTags = tags.toLowerCase().split(", ");

        if (postTags.includes(tagValue)) {
          awardPosts.push({
            title,
            url,
            post_date,
            categories,
            category_names,
            featured_image,
            tags,
          });
        }
        cursor.continue();
      }
    };

    transaction.oncomplete = function () {
      const awardsContainer = document?.getElementById("all_awards_wrapper");
      const loadMoreContainer = document?.getElementById("load_more_container");

      awardPosts.sort((a, b) => {
        const dateA = new Date(a.post_date.split("-").reverse().join("-"));
        const dateB = new Date(b.post_date.split("-").reverse().join("-"));
        return dateB - dateA;
      });

      // Load only the first 16 posts initially
      const initialPosts = awardPosts.slice(0, maxInitialPosts);
      initialPosts.forEach((post) => {
        const article = createCardUI(post);
        awardsContainer?.appendChild(article);
      });

      currentPostIndex = maxInitialPosts;

      // Add a "Load More" button if there are more than 16 posts
      if (awardPosts.length > maxInitialPosts) {
        const loadMoreButton = document.createElement("button");
        loadMoreButton.textContent = "See More";
        loadMoreButton.className =
          "load-more-button btn-primary border-0 cursor-pointer";
        loadMoreContainer?.appendChild(loadMoreButton);

        loadMoreButton.addEventListener("click", () => {
          const remainingPosts = awardPosts.slice(
            currentPostIndex,
            currentPostIndex + maxInitialPosts
          );
          remainingPosts.forEach((post) => {
            const article = createCardUI(post);
            awardsContainer.appendChild(article);
          });
          currentPostIndex += maxInitialPosts;

          // Remove the button if all posts are loaded
          if (currentPostIndex >= awardPosts.length) {
            loadMoreButton.remove();
          }
        });
      }
    };

    objectStore.openCursor().onerror = function (event) {
      console.error("Cursor Error:", event.target.errorCode);
    };
  } catch (error) {
    console.error("Failed to open database:", error);
  }
}

function createCardUI(post, type = "award") {
  const articleCard = document.createElement("article");
  articleCard.className =
    type === "award" ? "awards_card_item" : "newsletter_post_item flex-col";
  articleCard.setAttribute("data-tags", post.tags);

  const link = document.createElement("a");
  link.href = post.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute(
    "aria-label",
    `Read more about ${decodeHTMLEntities(post.title)}`
  );

  if (type === "newsletter") {
    articleCard.setAttribute("data-nl_date", post.post_date);
    articleCard.setAttribute("data-category", post.category_names);

    const postThumbnail = document.createElement("div");
    postThumbnail.className = "post-thumbnail";

    const img = document.createElement("img");
    img.src = post.featured_image;
    img.alt = decodeHTMLEntities(post.title);
    img.width = "286";
    img.height = "286";
    img.setAttribute("fetchpriority", "high");
    img.setAttribute("decoding", "async");

    const time = document.createElement("time");
    time.className = "post-date";
    const date = parseDate(post.post_date);
    if (!date || isNaN(date.getTime())) {
      time.textContent = "Invalid Date";
    } else {
      const options = { day: "numeric", month: "short", year: "numeric" };
      const formattedDate = date.toLocaleDateString("en-GB", options);
      time.textContent = formattedDate;
      time.setAttribute("datetime", formattedDate);
    }

    const title = document.createElement("h2");
    title.className = "post-title";
    title.title = decodeHTMLEntities(post.title);
    title.textContent = decodeHTMLEntities(post.title);

    postThumbnail.appendChild(img);
    postThumbnail.appendChild(time);
    postThumbnail.appendChild(title);
    link.appendChild(postThumbnail);
  } else {
    const img = document.createElement("img");
    img.src = post.featured_image;
    img.alt = decodeHTMLEntities(post.title);
    img.className = "awards_card_img";
    img.width = "300";
    img.height = "300";
    img.loading = "lazy";

    const div = document.createElement("div");

    const flexDiv = document.createElement("div");
    flexDiv.className = "categ_date flex";

    const categLbl = document.createElement("div");
    categLbl.className = "categ_lbl capitalize pr-2";
    categLbl.textContent = decodeHTMLEntities(post.category_names);

    const datePosted = document.createElement("div");
    datePosted.className = "date_posted text-gray-700 fw-light";
    const date = parseDate(post.post_date);
    if (!date || isNaN(date.getTime())) {
      datePosted.textContent = "Invalid Date";
    } else {
      const options = { day: "numeric", month: "short", year: "numeric" };
      const formattedDate = date.toLocaleDateString("en-GB", options);
      datePosted.textContent = formattedDate;
    }

    const titleDiv = document.createElement("div");
    titleDiv.className = "title";
    titleDiv.textContent = decodeHTMLEntities(post.title);

    flexDiv.appendChild(categLbl);
    flexDiv.appendChild(datePosted);
    div.appendChild(flexDiv);
    div.appendChild(titleDiv);
    link.appendChild(img);
    link.appendChild(div);
  }

  articleCard.appendChild(link);
  return articleCard;
}

FilterButton.initializeAll(SELECTORS.awardsFilterButton, (filterID) => {
  currentFilterID = filterID === "all" ? null : filterID;
  showAwardedPosts(currentFilterID);
});

function showAwardedPosts(filterID) {
  const awardPosts = document.querySelectorAll(".awards_card_item");
  awardPosts.forEach((post) => {
    const postTags = post.getAttribute("data-tags").split(", ");
    const shouldAppend = !filterID || postTags.includes(filterID);

    if (shouldAppend) {
      post.classList.remove("d-none");
    } else {
      post.classList.add("d-none");
    }
  });
}
