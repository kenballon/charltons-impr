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

// Generic function to handle IndexedDB operations
async function fetchPostsFromDB(dbName, storeName, filterCallback) {
  try {
    const db = await openIndexedDB(dbName);
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);
    const posts = [];

    objectStore.openCursor().onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        if (filterCallback(cursor.value)) {
          posts.push(cursor.value);
        }
        cursor.continue();
      }
    };

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(posts);
      transaction.onerror = (event) => reject(event.target.errorCode);
    });
  } catch (error) {
    console.error("Failed to open database:", error);
    return [];
  }
}

// Refactored getAwardPosts function
async function getAwardPosts() {
  const dbName = "PostsDatabase";
  const storeName = "posts";
  const tagValue = "awards";
  const maxInitialPosts = 16;
  let currentPostIndex = 0;

  const awardPosts = await fetchPostsFromDB(dbName, storeName, (post) => {
    const postTags = post.tags.toLowerCase().split(", ");
    return postTags.includes(tagValue);
  });

  awardPosts.sort(
    (a, b) =>
      new Date(b.post_date.split("-").reverse().join("-")) -
      new Date(a.post_date.split("-").reverse().join("-"))
  );

  console.log(awardPosts);

  const awardsContainer = document?.getElementById("all_awards_wrapper");
  const loadMoreContainer = document?.getElementById("load_more_container");
  // Load only the first 16 posts initially
  const initialPosts = awardPosts.slice(0, maxInitialPosts);
  initialPosts.forEach((post) => {
    const article = createAwardPostElement(post, "award");
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
        const article = createAwardPostElement(post, "award");
        awardsContainer.appendChild(article);
      });
      currentPostIndex += maxInitialPosts;

      // Remove the button if all posts are loaded
      if (currentPostIndex >= awardPosts.length) {
        loadMoreButton.remove();
      }
    });
  }
}

function createAwardPostElement(post, type) {
  const div = document.createElement("article");
  div.className =
    type === "award" ? "awards_card_item" : "newsletter_post_item flex-col";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "tags";
  input.className = "tags_values";
  input.value = post.tags;

  const link = document.createElement("a");
  link.href = post.url;

  const img = document.createElement("img");
  img.src = post.featured_image;
  img.alt = decodeHTMLEntities(post.title);
  img.className = "awards_card_img";
  img.width = "300";
  img.height = "300";
  img.loading = "lazy";

  const article = document.createElement("article");

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
  article.appendChild(flexDiv);
  article.appendChild(titleDiv);
  link.appendChild(img);
  link.appendChild(article);
  div.appendChild(input);
  div.appendChild(link);

  return div;
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
