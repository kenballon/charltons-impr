import FilterButton from "./FilterButton.js";

// Get the current URL
const currentUrl = window.location.href;
const origin = window.location.origin;

document.addEventListener("readystatechange", (e) => {
    if (e.target.readyState === "complete") {
        customHeaderNavigation();
        initNewsletterPage();
        loadNewsPagination();

        const buttonAllActive = document.getElementById("all");
        currentUrl.startsWith(origin + "/news")
            ? buttonAllActive?.classList.add("active")
            : "";

        const defaultFilterdBtn = document?.getElementById("hong-kong-law");
        defaultFilterdBtn?.classList.add("active");

        const newseventsWrapper = document.querySelector('#all_news_posts');
        // newseventsWrapper && getNewsAndEventsPosts(["awards-and-rankings", "news"]);
        const hasServerPagination = document.querySelector('#news_posts_wrapper .pagination_container');
        if (newseventsWrapper && !hasServerPagination) {
            // Only use client-side fetch/render when pagination is NOT server-driven
            // getNewsAndEventsPosts(["awards-and-rankings", "news"]);
        }
        // getArchivedAllPosts(["hong-kong-law"]);


        if (window.location.pathname.includes("/news/newsletters/hong-kong-law-3/")) {

            initLoadMoreWithFilters({
                loadMoreBtnId: "newsletter-load-more-btn",
                loadingSpinnerId: ".loading-spinner",
                postsContainerId: "newsletters_post",
                ajaxAction: "load_more_newsletters",
                postsPerPage: 20,
                buttonSelector: ".newsletter_category_filter",
                isSearchEnabled: true,
                searchInputId: "newsletterSearch",
                searchCloseButtonId: "nl_close_search",
                searchIconId: "nl_search_icon",
            });

        }

        if (window.location.pathname.includes("/our-firm/awards-2/")) {
            initLoadMoreWithFilters({
                loadMoreBtnId: "awards-load-more-btn",
                loadingSpinnerId: ".loading-spinner",
                postsContainerId: "all_awards_wrapper",
                ajaxAction: "load_more_content",
                postsPerPage: 20,
                buttonSelector: ".awards_btn_filter",
                // filterOnClickCallback: ({ value }) => {
                //     console.log("Selected filter:", value);
                // }
            });

        }

        if (window.location.pathname.includes("/webinars-and-podcasts/")) {
            initLoadMoreWithFilters({
                loadMoreBtnId: "webinars-load-more-btn",
                loadingSpinnerId: ".loading-spinner",
                postsContainerId: "pod-and-web",
                ajaxAction: "load_more_content",
                postsPerPage: 15,
                buttonSelector: ".pod_web_btn_filter",
            });
        }
        if (window.location.pathname.includes("/news/")) {
            initFilterButton({
                buttonSelector: ".news_btn_tag_filter",
                onClickCallback: ({ value }) => {
                    console.log("Selected filter:", value);

                    // clear div container #all_news_posts

                    const allNewsPostsContainer = document.querySelector('#all_news_posts');
                    allNewsPostsContainer && (allNewsPostsContainer.innerHTML = "");
                }
            });
        }
    }
});

// ==================================================
// #region HEADER NAV:::START
// ==================================================

function customHeaderNavigation() {
    // mobile nav reveal
    const header = document.querySelector("header");
    const mobileNavMenu = document.querySelector(".mobile_nav_show");

    if (header && mobileNavMenu) {
        const headerHeight = header.offsetHeight;

        window.addEventListener("resize", (e) => {
            mobileNavMenu.style.top = `${headerHeight}px`;
        });
        mobileNavMenu.style.top = `${headerHeight}px`;
    }
    // mobile nav reveal end

    const parentNavLinkItem = document.querySelectorAll(".nav_parent_list_item");
    const subMenuLinkItemsBtn = document.querySelectorAll(
        ".nav_child_list_item .btn_wrapper button"
    );
    const grandchildrenUl = document?.querySelectorAll(".grandchild_ul");
    const postCardWrapper = document.querySelectorAll(".post_wrapper");
    let animationTimeouts = [];
    let lastOpenedButton = null;

    parentNavLinkItem.forEach((parentLinkItem) => {
        const navLinkId = parentLinkItem.getAttribute("data-parentlistid");
        const subMenuWrapperActive =
            parentLinkItem?.querySelector(".submenu_wrapper");
        const btnPlusIcons = subMenuWrapperActive?.querySelectorAll(
            ".nav_child_list_item button"
        );

        // add active class on hover for parent link
        subMenuWrapperActive?.addEventListener("mouseenter", () => {
            parentLinkItem.classList.add("active-hovered");
            subMenuWrapperActive.classList.add("active-hover");
        });

        // remove active class on hover for parent link
        subMenuWrapperActive?.addEventListener("mouseleave", () => {
            const cardPosts = subMenuWrapperActive.querySelectorAll(".card-post");

            parentLinkItem.classList.remove("active-hovered");
            subMenuWrapperActive.classList.remove("active-hover");

            grandchildrenUl.forEach((ul) => {
                ul.classList.remove("active-hover");
                const activeChild = ul.querySelector(".grandchild_list_item.active");
                if (activeChild) {
                    activeChild.classList.remove("active");
                }
            });

            cardPosts.forEach((card) => {
                const activeChild = card.querySelector(".post_wrapper.active");

                if (activeChild?.classList.contains("active")) {
                    activeChild.classList.remove("active");
                }
            });

            btnPlusIcons.forEach((btn) => {
                const btnParentLink = btn.closest(".nav_child_list_item");
                if (btn.classList.contains("opened")) {
                    btn.classList.remove("opened");
                    lastOpenedButton = null;
                }
                if (btnParentLink.classList.contains("active")) {
                    btnParentLink.classList.remove("active");
                }
            });
        });
    });

    subMenuLinkItemsBtn.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const parentListItem = e.target.closest(".nav_parent_list_item");
            const grandChildren = parentListItem.querySelectorAll(
                ".grand_children .grandchild_ul"
            );
            const childListItem = e.target.closest(".nav_child_list_item");

            // If the clicked button is the same as the last opened button, toggle it
            if (btn === lastOpenedButton) {
                btn.classList.toggle("opened");

                grandChildren.forEach((grandchild) => {
                    if (btn.id === grandchild.id) {
                        grandchild.classList.toggle("active-hover");
                    }
                });

                if (btn.classList.contains("opened")) {
                    childListItem.classList.add("active");
                } else {
                    childListItem.classList.remove("active");
                }

                // If the button is now closed, set lastOpenedButton to null
                if (!btn.classList.contains("opened")) {
                    lastOpenedButton = null;
                }

                return;
            }

            // If there was a previously opened button, close it
            if (lastOpenedButton) {
                lastOpenedButton.classList.remove("opened");
                const lastChildListItem = lastOpenedButton.closest(
                    ".nav_child_list_item"
                );
                if (lastChildListItem) {
                    lastChildListItem.classList.remove("active");
                }
            }

            grandChildren.forEach((grandchild) => {
                grandchild.classList.remove("active-hover");
            });

            grandChildren.forEach((grandchild) => {
                if (btn.id === grandchild.id) {
                    btn.classList.toggle("opened");
                    grandchild.classList.add("active-hover");
                }
            });

            // Add the active class to the current childListItem
            childListItem.classList.add("active");

            // Update the last opened button
            lastOpenedButton = btn;
        });
    });

    const grandchildrenListAnchor = document.querySelectorAll(
        ".grandchild_list_item"
    );

    grandchildrenListAnchor.forEach((anchor) => {
        const linkHrefVal = anchor.querySelector("a").getAttribute("href");

        anchor.addEventListener("mouseenter", () => {
            grandchildrenListAnchor.forEach((li) => li.classList.remove("active"));
            anchor.classList.add("active");

            postCardWrapper.forEach((dataUrl) => {
                const dataUrlVal = dataUrl.getAttribute("data-url");

                if (dataUrlVal === linkHrefVal) {
                    dataUrl.classList.add("active");
                } else {
                    dataUrl.classList.remove("active");
                }
            });
        });
    });

    // helper functions call
    menuMobileBtnToggle();
    mobilePlusIconClick();

    customSearch();
    revealSearch();
}

function customSearch() {
    const searchInput = document?.getElementById("search-input");
    const searchMatchesWrapper = document.querySelector(
        ".search_matches_wrapper"
    );
    const searchResultsList = document.querySelector(".search-results-list");
    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "loading-indicator";
    loadingIndicator.textContent = "Loading...";
    loadingIndicator.style.display = "none";
    searchMatchesWrapper?.appendChild(loadingIndicator);

    // Cache for storing previous search results
    const searchCache = {};

    async function fetchLatestPosts() {
        try {
            const data = await fetchPostData(ajax_object.ajax_url, { action: 'ajax_latest_posts' });
            searchResultsList.innerHTML = data;
            searchMatchesWrapper.style.display = "block";
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function handleClickOutside(event) {
        if (
            !searchMatchesWrapper.contains(event.target) &&
            !searchInput.contains(event.target)
        ) {
            searchMatchesWrapper.style.display = "none";
        }
    }

    if (searchInput) {
        searchInput.addEventListener("focus", function () {
            fetchLatestPosts();
        });

        searchInput.addEventListener(
            "input",
            debounce(async function () {
                let searchQuery = this.value.trim();

                if (searchQuery.length > 2) {
                    if (searchCache[searchQuery]) {
                        searchResultsList.innerHTML = searchCache[searchQuery];
                        searchMatchesWrapper.style.display = "block";
                    } else {
                        loadingIndicator.style.display = "block";
                        try {
                            const data = await fetchPostData(ajax_object.ajax_url, {
                                action: 'ajax_search',
                                search: searchQuery
                            });
                            searchCache[searchQuery] = data; // Cache the results
                            searchResultsList.innerHTML = data;
                            searchMatchesWrapper.style.display = "block";
                        } catch (error) {
                            console.error("Error:", error);
                        } finally {
                            loadingIndicator.style.display = "none";
                        }
                    }
                } else {
                    searchResultsList.innerHTML = ""; // Clear search results
                    searchMatchesWrapper.style.display = "none"; // Hide search wrapper
                }
            }, 300) // Debounce delay of 300ms
        );
    }

    // Add event listener to document for detecting clicks outside
    document.addEventListener("click", handleClickOutside);
}

function revealSearch() {
    const header = document.querySelector("header");
    const searchFormButton = document.getElementById("showsearchinput");
    const searchInput = document?.getElementById("search-input");
    const navSearchWrapper = document.querySelector(".nav_search_wrapper");
    const searchWrapper = document.querySelector(".search_wrapper");
    const closeSearchButton = document.getElementById("close_search");

    searchFormButton?.addEventListener("click", () => {
        navSearchWrapper.classList.add("hide-animate");
        header.classList.add("search-open");

        setTimeout(() => {
            toggleClass(navSearchWrapper, "hide-animate", "hidden");
            toggleClass(searchWrapper, "d-none", "show");
            searchInput.focus();
        }, 200);
    });

    closeSearchButton?.addEventListener("click", () => {
        toggleClass(searchWrapper, "show", "hide-animate");
        header.classList.remove("search-open");

        setTimeout(() => {
            toggleClass(searchWrapper, "hide-animate", "d-none");
            toggleClass(navSearchWrapper, "hidden", "show");
        }, 200);
    });
}

function mobilePlusIconClick() {
    const mobileParentIconPlus = document.querySelectorAll(".sm_plus_icon");
    const mobileChildIconPlus = document.querySelectorAll(".sm_plus_icon_child");

    mobileParentIconPlus.forEach((el) => {
        const id = el.dataset.smiconplus;
        const correspondingChildEl = document.getElementById(id);

        el.addEventListener("click", () => {
            if (window.innerWidth <= 1310) {
                if (correspondingChildEl) {
                    correspondingChildEl.classList.toggle("active");
                    el.classList.toggle("active");
                }
            }
        });
    });

    mobileChildIconPlus.forEach((childElement) => {
        childElement.addEventListener("click", () => {
            if (window.innerWidth <= 1310) {
                document
                    .querySelectorAll(".grandchild_ul_sm")
                    .forEach((grandchildEl) => {
                        if (
                            grandchildEl.id === childElement.getAttribute("data-childsmicon")
                        ) {
                            grandchildEl.classList.toggle("active");
                            childElement.classList.toggle("active");
                        }
                    });
            }
        });
    });
}

function menuMobileBtnToggle() {
    const menuBtn = document.getElementById("menuMobileButton");
    const mobileMenuShow = document.querySelector(".mobile_nav_show");

    menuBtn?.addEventListener("click", () => {
        if (window.innerWidth <= 1310) {
            let dataToggleMenuBtn = menuBtn.getAttribute("data-menu-reveal");

            if (dataToggleMenuBtn === "no") {
                menuBtn.setAttribute("data-menu-reveal", "yes");
                menuBtn.classList.add("reveal_menu_nav");
                menuBtn.querySelector(".default_mobile_menu").classList.add("hide");
                menuBtn.querySelector(".close_mobile_menu").classList.add("active");

                if (mobileMenuShow.classList.contains("default")) {
                    mobileMenuShow.classList.remove("default");
                    mobileMenuShow.classList.add("opened");
                }
            } else {
                menuBtn.setAttribute("data-menu-reveal", "no");
                menuBtn.classList.remove("reveal_menu_nav");
                mobileMenuShow.classList.remove("opened");
                mobileMenuShow.classList.add("closed");
                menuBtn.querySelector(".default_mobile_menu").classList.remove("hide");
                menuBtn.querySelector(".close_mobile_menu").classList.remove("active");

                setTimeout(() => {
                    mobileMenuShow.classList.remove("closed");
                    mobileMenuShow.classList.add("default");
                }, 500);
            }
        }
    });
}

// ==================================================
// #endregion HEADER NAV:::END
// ==================================================

// ==================================================
// #region Utility Functions:::START
// ==================================================

/**
 * Debounce a function by a given delay.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {Function}
 */
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Fetch data via POST request (AJAX helper).
 * @param {string} url - The endpoint URL.
 * @param {object} bodyObj - The body as a key-value object.
 * @returns {Promise<string>} - The response text.
 */
async function fetchPostData(url, bodyObj) {
    const body = Object.entries(bodyObj)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    });
    return response.text();
}

function toggleClass(element, removeClass, addClass) {
    if (element.classList.contains(removeClass)) {
        element.classList.remove(removeClass);
        element.classList.add(addClass);
    }
}

function toggleFilter(event) {
    event.preventDefault();

    const isActive = insightFilterButtons.classList.toggle("active");
    const dataStateValue = isActive ? "true" : "false";
    insightFilterButtons.setAttribute("data-state", dataStateValue);

    svgCloseIcon.classList.toggle("hidden", !isActive);
    svgFilterIcon.classList.toggle("hidden", isActive);
    filterBtnsContainer.classList.toggle("hidden", !isActive);
}

/**
 * Creates an article card element based on the provided post data and type.
 *
 * @param {Object} post - The post data object.
 * @param {string} [type="award"] - The type of the post (e.g., "award", "newsletter", "news").
 * @param {boolean} [isInitial=false] - Flag indicating if this is an initial card creation.
 * @returns {HTMLElement} The created article card element.
 */
function createCardUI(post, type = "award", isInitial = false) {
    const articleCard = document.createElement("article");
    articleCard.className = getClassName(type);
    articleCard.setAttribute("data-category", post.categories);
    articleCard.setAttribute("data-tags", post.tags);
    articleCard.setAttribute("data-post-id", post.id);

    const postDate = post.post_date;

    if (type === "newsletter") {
        articleCard.setAttribute("data-nl_date", post.post_date);
        articleCard.innerHTML = getNewsletterHTML(post, postDate);
    } else if (type === "news") {
        articleCard.innerHTML = getNewsHTML(post, postDate);
    } else {
        articleCard.innerHTML = getAwardHTML(post, postDate);
    }
    return articleCard;
}

function getClassName(type) {
    switch (type) {
        case "award":
            return "awards_card_item";
        case "newsletter":
            return "newsletter_post_item flex-col";
        case "news":
            return "news_article_wrapper";
        default:
            return "";
    }
}

function getImageHTML(post, width, height, className) {
    return `
    <img decoding="async" width="${width}" height="${height}" class="${className}"
      src="${sanitizeHTML(post.featured_image)}"
      srcset="${sanitizeHTML(post.featured_image_small || post.featured_image)} 300w,
              ${sanitizeHTML(post.featured_image_medium || post.featured_image)} 768w,
              ${sanitizeHTML(post.featured_image_large || post.featured_image)} 1024w"
      alt="${sanitizeHTML(decodeHTMLEntities(post.title))}">
  `;
}

function getNewsletterHTML(post, postDate) {
    return `
    <a href="${sanitizeHTML(post.url)}" rel="noopener noreferrer" aria-label="${sanitizeHTML(decodeHTMLEntities(post.title))}">
      <div class="post-thumbnail">
        ${getImageHTML(post, 286, 286, "")}
        <time class="post-date" datetime="${sanitizeHTML(post.post_date)}">${postDate}</time>
        <h2 class="post-title" title="${sanitizeHTML(decodeHTMLEntities(post.title))}">${sanitizeHTML(decodeHTMLEntities(post.title))}</h2>
      </div>
    </a>
  `;
}

function getNewsHTML(post, postDate) {
    return `
    <div class="news_card_image">
      <a href="${sanitizeHTML(post.url)}" rel="noopener noreferrer" aria-label="${sanitizeHTML(decodeHTMLEntities(post.title))}" title="${sanitizeHTML(decodeHTMLEntities(post.title))}">
        ${getImageHTML(post, 320, 320, "border-1")}
      </a>
    </div>
    <div class="news_card_content">
      <div class="newsevents__post_date">${postDate}</div>
      <a href="${sanitizeHTML(post.url)}" rel="noopener noreferrer" aria-label="${sanitizeHTML(decodeHTMLEntities(post.title))}" title="${sanitizeHTML(decodeHTMLEntities(post.title))}">
        <h2 class="newsevents__post_title fw-medium">${sanitizeHTML(decodeHTMLEntities(post.title))}</h2>
      </a>
    </div>
  `;
}

function getAwardHTML(post, postDate) {
    return `
    <a href="${sanitizeHTML(post.url)}" rel="noopener noreferrer" aria-label="${sanitizeHTML(decodeHTMLEntities(post.title))}">
      ${getImageHTML(post, 300, 300, "awards_card_img")}
      <div>
        <div class="categ_date flex">
          <div class="categ_lbl capitalize pr-2">${sanitizeHTML(decodeHTMLEntities(post.category_names))}</div>
          <div class="date_posted text-gray-700 fw-light">${postDate}</div>
        </div>
        <div class="title">${sanitizeHTML(decodeHTMLEntities(post.title))}</div>
      </div>
    </a>
  `;
}

function sanitizeHTML(html) {
    const tempDiv = document.createElement("div");
    tempDiv.textContent = html;
    return tempDiv.innerHTML;
}

function decodeHTMLEntities(text) {
    let textArea = document.createElement("textarea");
    let prev = text;
    let curr = text;
    do {
        prev = curr;
        textArea.innerHTML = prev;
        curr = textArea.value;
    } while (curr !== prev);
    return curr;
}

// Safely bolds words from the query that appear in the given text
function highlightMatches(text, query) {
    const safeText = sanitizeHTML(text || "");
    const q = (query || "").trim();
    if (!q) return safeText;

    // Build a regex of unique words >= 2 chars
    const terms = Array.from(new Set(q.split(/\s+/).filter(w => w.length >= 2)));
    if (terms.length === 0) return safeText;

    const escaped = terms.map(t => escapeRegExp(t));
    // Word boundaries to match whole words; case-insensitive
    const pattern = `\\b(${escaped.join("|")})\\b`;
    const re = new RegExp(pattern, "gi");
    return safeText.replace(re, "<strong>$1</strong>");
}

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseMultiValue(raw) {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
        const trimmed = raw.trim();
        if (!trimmed) return null;
        if (trimmed.includes(',')) {
            return trimmed.split(',').map(v => v.trim()).filter(Boolean);
        }
        return trimmed;
    }
    return raw;
}

// Helper: resolve filter type and value from options or button dataset
function resolveFilterTypeAndValue(button, options = {}) {
    const { filterType, filterValue } = options;
    const rawType = (typeof filterType !== 'undefined') ? filterType : (button.dataset.filterType ?? '');
    const rawValue = (typeof filterValue !== 'undefined') ? filterValue : (button.dataset.filterValue ?? button.id ?? '');
    return {
        type: parseMultiValue(rawType),
        value: parseMultiValue(rawValue)
    };
}

// Optional helper: simple logger you can reuse as onClickCallback
function defaultFilterClickLogger(payload) {
    // payload: { type, value, button, event }
    console.log('Selected filter:', payload?.value);
}

function parseYearDecade(label) {
    if (!label) return null;
    const str = String(label).trim().toLowerCase();
    // Formats: 2020, 1990
    const decadeMatch = str.match(/^(\d{4})$/);
    if (decadeMatch) {
        const start = parseInt(decadeMatch[1], 10);
        if (!isNaN(start)) return { start, end: start + 9 };
    }
    // Formats: 2010-2019
    const rangeMatch = str.match(/^(\d{4})\s*[-–]\s*(\d{4})$/);
    if (rangeMatch) {
        const start = parseInt(rangeMatch[1], 10);
        const end = parseInt(rangeMatch[2], 10);
        if (!isNaN(start) && !isNaN(end) && end >= start) return { start, end };
    }
    // Single year => treat as its decade
    const yearMatch = str.match(/^(\d{4})$/);
    if (yearMatch) {
        const y = parseInt(yearMatch[1], 10);
        const decadeStart = y - (y % 10);
        return { start: decadeStart, end: decadeStart + 9 };
    }
    return null;
}
// ==================================================
// #endregion Utility Functions:::END
// ==================================================

let currentFilterID = null;
let postsPerPage = 15;
let currentPage = 1;

const SELECTORS = {
    allNewsPosts: "#all_news_posts",
    cardsPosts: ".news_article_wrapper",
    paginationWrapper: "#news_pagination_btns_wrapper",
    prevBtn: "#prev_post_btn",
    nextBtn: "#next_post_btn",
    firstBtn: "#first_post_btn",
    lastBtn: "#last_post_btn",
    newsEventsFilterButtons: ".news_btn_tag_filter",
    awardsFilterButton: ".awards_btn_filter",
    newsHiddenInput: ".newsevents_hidden_input",
    CategPPWFilterButtons: ".ppw_category_filter",
    TagsPPWFilterButtons: ".ppw_tag_btn_filter",
    paginationdots_first: "#ne_pagination_dots_first",
    paginationdots_last: "#ne_pagination_dots",
    podAndWebinarFilterButtons: ".pod_web_btn_filter",
    NewsletterAchiveFilter: ".archive_btn_filter"
};

// ============================================================
//  #region Publication and Presentations:::START
// ============================================================
const insightFilterButtons = document.getElementById("insights_filter_toggle");
const svgFilterIcon = document.getElementById("insights_filter_icon");
const svgCloseIcon = document.getElementById("insights_filter_close_icon");
const filterBtnsContainer = document.querySelector(
    ".insights_page.btn_tag_filter_wrapper"
);
const ppwArticlesPost = Array.from(
    document.querySelectorAll(".insights_post_title_wrapper")
);

const articlePostContainers = document.querySelectorAll(".articles_wrapper");

// Filter by tag
FilterButton.initializeAll(SELECTORS.TagsPPWFilterButtons, (filterID) => {
    filterByCategoryOrTag(filterID === "all" ? null : filterID, "tag");
});

// Filter by category
FilterButton.initializeAll(SELECTORS.CategPPWFilterButtons, (filterID) => {
    filterByCategoryOrTag(filterID === "all" ? null : filterID, "category");
});


// Function to filter by category or tag
function filterByCategoryOrTag(filterName, type) {
    const filterBtns = document.querySelectorAll(
        type === "category" ? ".ppw_tag_btn_filter" : ".ppw_category_filter"
    );

    // Remove active class from filter buttons
    filterBtns.forEach((btn) => btn.classList.remove("active"));

    // Clear article containers
    articlePostContainers.forEach((container) => (container.innerHTML = ""));

    // Filter posts
    ppwArticlesPost.forEach((post) => {
        const postCategory = post.dataset.category
            ? post.dataset.category.split(",").map((cat) => cat.trim())
            : [];
        const postTags = post.dataset.tags
            ? post.dataset.tags.split(",").map((tag) => tag.trim())
            : [];
        const postYear = post.dataset.year;

        const shouldAppend =
            type === "category"
                ? !filterName || postCategory.includes(filterName)
                : !filterName || postTags.includes(filterName);

        if (shouldAppend) {
            articlePostContainers.forEach((container) => {
                if (container.id === postYear) {
                    container.appendChild(post);
                }
            });
        }
    });

    // Toggle visibility of yearly wrappers
    articlePostContainers.forEach((container) => {
        const parentDiv = container.closest(".insights_yearly_wrapper");
        if (container.children.length === 0) {
            parentDiv.classList.remove("flex");
            parentDiv.classList.add("d-none");
        } else {
            parentDiv.classList.add("flex");
            parentDiv.classList.remove("d-none");
        }
    });
}


// open filter button or show/hide filter buttons
insightFilterButtons?.addEventListener("click", toggleFilter);
// ============================================================
//  #endregion Publication and Presentations:::END
// ============================================================

// ============================================================
//  #region SHARING TO SOCIAL MEDIA JS CODE:::START
// ============================================================

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

    const openDownloadOptions = document?.getElementById("open_dl_options");
    const downloadDialog = document?.getElementById("nlDowloadOptions");
    const downloadPDF = document?.getElementById("dl_pdf");
    const openWordUrl = document?.getElementById("dl_word");

    const inputPdfElement = document?.getElementById("pdf_url_hidden_input");
    const inputWordElement = document?.getElementById("word_url_hidden_input");

    const inputPdfVal = inputPdfElement ? inputPdfElement.value : null;
    const inputWordVal = inputWordElement ? inputWordElement.value : null;

    openDownloadOptions?.addEventListener("click", () =>
        toggleDownloadDialog(downloadDialog)
    );

    const toggleDownloadDialog = (toggleDiv) => {
        const isOpen = toggleDiv.classList.toggle("open");
        toggleDiv.setAttribute("aria-hidden", !isOpen);

        const handleClickOutside = (event) => {
            if (
                !toggleDiv.contains(event.target) &&
                !openDownloadOptions.contains(event.target)
            ) {
                toggleDiv.classList.remove("open");
                toggleDiv.setAttribute("aria-hidden", "true");
                document.removeEventListener("click", handleClickOutside);
            }
        };

        if (isOpen) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }
    };

    downloadPDF?.addEventListener("click", () => {
        openDownloadURL(
            inputPdfVal,
            "PDF URL is not available."
        );
        downloadDialog.classList.remove("open");
    });
    openWordUrl?.addEventListener("click", () => {
        openDownloadURL(
            inputWordVal,
            "Word URL is not available."
        );
        downloadDialog.classList.remove("open");
    });

    // refactoring this code to accomodate the new design and requirements
    // const nlShareButton = document.getElementById("nl_sharebtn");
    // const shareDialog = document.getElementById("nlShareOptions");
    const nlShareButton = document.querySelectorAll(".share_btn");

    const shareDialogHTML = /*html*/ `   
    <div id="nlShareOptions">
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

// ============================================================
//  #endregion SHARING TO SOCIAL MEDIA JS CODE:::END
// ============================================================

// ============================================================
// #region PROFILE SINGLE PAGE OBSERVER:::START
// ============================================================
// This code observes the profile content sections and updates the navigation items accordingly

const sectionTextContent = [...document.querySelectorAll('.profile_content_section')];

let options = {
    threshold: [0, 0.3],
    rootMargin: '-250px 0px -70% 0px'
}

const handleIntersection = (entries, observer) => {
    entries.forEach(entry => {
        const section = entry.target;
        const navItems = document.querySelectorAll('.profile_bio_nav_item .profile_bio_nav_item_label');
        const isLastSection = section === sectionTextContent[sectionTextContent.length - 1];

        const shouldActivate = isLastSection
            ? entry.isIntersecting && entry.intersectionRatio > 0
            : entry.isIntersecting;

        if (shouldActivate) {
            navItems.forEach(item => {
                if (item.getAttribute('data-id') === section.id) {
                    // item.classList.add('active');
                    item.parentNode.classList.add('active');
                } else {
                    // item.classList.remove('active');
                    item.parentNode.classList.remove('active');
                }
            }
            );
        }
    });
}

const observeProfileContent = new IntersectionObserver(handleIntersection, options);

sectionTextContent.forEach(section => {
    observeProfileContent.observe(section);
});

const stickyNav = document?.querySelector('.lawyer_profile_section_nav');
const navLinks = document?.querySelectorAll('.profile_bio_nav_item .profile_bio_nav_item_label');
const dropdownShowLink = document?.querySelectorAll('.material-symbols-outlined');

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('data-id');
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const stickyNavHeight = stickyNav ? stickyNav.offsetHeight : 0;
            const desiredOffset = 90; // Adjust this value as needed for your design
            // Calculate the scroll position, accounting for sticky nav height and desired offset
            // Use getBoundingClientRect().top to get the position relative to the viewport
            // and then add the current scroll position to get the absolute position
            // Also subtract the sticky nav height and desired offset
            // to ensure the target element is positioned correctly below the sticky nav

            const scrollToPosition = targetElement.getBoundingClientRect().top + window.scrollY - stickyNavHeight - desiredOffset;


            window.scrollTo({
                top: scrollToPosition,
                behavior: 'smooth'
            });

            // Remove active class from all nav items
            if (window.innerWidth <= 767) {
                navLinks.forEach(item => {
                    item.parentNode.classList.remove('active');
                    item.parentNode.style.display = "none";

                });
                // Add active class to the clicked nav item
                this.parentNode.classList.add('active');
            }
        }
    });
});

dropdownShowLink.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const parentItem = this.closest('.profile_bio_nav_item');
        if (parentItem) {

            // Toggle the active class on the parent item

            const nextElement = parentItem.nextElementSibling;
            const prevElement = parentItem.previousElementSibling;
            if (nextElement) {
                nextElement.style.display = nextElement.style.display === "flex" ? "none" : "flex";
            }
            if (prevElement) {
                prevElement.style.display = prevElement.style.display === "flex" ? "none" : "flex";
            }
        }
    });
})


const expandMoreBtn = document?.querySelectorAll('.expand_more .material-symbols-outlined');

expandMoreBtn.forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();

        const parentItem = this.closest('details');

        if (parentItem) {
            if (parentItem.hasAttribute('open')) {
                parentItem.removeAttribute('open');
            } else {
                parentItem.setAttribute('open', '');
            }
        }
    })
});

// =======================================
// #endregion PROFILE SINGLE PAGE OBSERVER:::END
// =======================================

// =======================================
// #region NEWS & EVENTS PAGE JS CODE : REFACTORED
// =======================================

// FilterButton.initializeAll(SELECTORS.newsEventsFilterButtons, (filterID) => {
//     currentFilterID = filterID === "all" ? null : filterID;
//     getNewsAndEventsPosts(["awards-and-rankings", "news"], currentFilterID);
// });

// =======================================
// #endregion NEWS & EVENTS PAGE JS CODE : REFACTORED
// =======================================

// Initialize client-side filtering for webinars/podcasts only when load-more is not active
if (!window.location.pathname.includes("/webinars-and-podcasts/") && !document.getElementById('webinars-load-more-btn')) {
    FilterButton.initializeAll(SELECTORS.podAndWebinarFilterButtons, (filterID) => {
        currentFilterID = filterID === "all" ? null : filterID;
        // Fetch and filter by category and tag
        getPodcastsAndWebinars(["webinars-and-podcasts", "webinars"], currentFilterID);
    });
}

const hamburgerMenuBtn = document?.querySelector('.nav_trail_active .hamburger');
const aboutUsUlNav = document?.getElementById('about_us_nav');
const aboutUsNavUlMobile = document?.getElementById('about_us_ul_nav_mobile');

hamburgerMenuBtn?.addEventListener('click', () => {
    const toggleClass = (element, className) => element?.classList.toggle(className);

    toggleClass(aboutUsUlNav, 'about_us_active');
    toggleClass(aboutUsNavUlMobile, 'dropdown_active');
    toggleClass(hamburgerMenuBtn, 'active');

    const ariaHiddenValue = aboutUsNavUlMobile?.classList.contains('dropdown_active') ? 'false' : 'true';
    aboutUsNavUlMobile?.setAttribute('aria-hidden', ariaHiddenValue);
});

function createUITable(postsByYear, categories) {
    const table = document.createElement("table");
    table.className = "archive_table";
    table.setAttribute("data-archive-category", categories[0] || "");

    Object.keys(postsByYear).sort((a, b) => b - a).forEach((year) => {
        // Thead for each year
        const thead = document.createElement("thead");
        thead.setAttribute("data-archive-year-head", year);
        const trHead = document.createElement("tr");
        const th = document.createElement("th");
        th.colSpan = 2;
        th.innerHTML = `
            <div>
                <span class="material-symbols-outlined">calendar_month</span>
                <span class="label_thead">${year}</span>
            </div>
        `;
        trHead.appendChild(th);
        thead.appendChild(trHead);
        table.appendChild(thead);

        // Tbody for each year
        const tbody = document.createElement("tbody");
        tbody.setAttribute("data-archive-year-body", year);

        postsByYear[year].forEach((post) => {
            const tr = document.createElement("tr");
            tr.setAttribute("data-archive-post-content", post.post_date);
            tr.setAttribute("data-archive-post-category", post.categories.toLowerCase());

            // Handle new date format "14 Jun 2014"
            const [day, month, _year] = post.post_date.split(" ");
            const dateObj = new Date(`${day} ${month} ${_year}`);
            const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('en-US', { month: 'short' })}`;

            const tdDate = document.createElement("td");
            tdDate.textContent = formattedDate;

            const tdTitle = document.createElement("td");
            const a = document.createElement("a");
            a.href = post.url || "#";
            a.className = "default_link";
            a.target = "_blank";
            a.textContent = decodeHTMLEntities(post.title); // Only decode, do not sanitize for textContent
            tdTitle.appendChild(a);

            tr.appendChild(tdDate);
            tr.appendChild(tdTitle);
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
    });

    return table;
}

FilterButton.initializeAll(SELECTORS.NewsletterAchiveFilter, (filterID) => {
    currentFilterID = filterID === "all" ? null : filterID;
    console.log(`Current Filter ID: ${currentFilterID}`);

    getArchivedAllPosts([currentFilterID]);
});

function initSearchFeature(options) {
    const {
        inputId,
        closeButtonId = null,
        iconId = null,
        minChars = 2,
        debounceMs = 500,
        onSearch,
        onClear
    } = options || {};

    const input = inputId ? document.getElementById(inputId) : null;
    const closeBtn = closeButtonId ? document.getElementById(closeButtonId) : null;
    const icon = iconId ? document.getElementById(iconId) : null;
    if (!input) return;

    let t;
    input.addEventListener('input', (e) => {
        const val = (e.target.value || '').trim();
        if (closeBtn) closeBtn.classList.toggle('active', val.length >= minChars);
        if (icon) icon.style.display = val.length >= minChars ? 'none' : 'flex';

        clearTimeout(t);
        t = setTimeout(() => {
            if (val.length >= minChars) {
                if (typeof onSearch === 'function') onSearch(val);
            } else if (val.length === 0) {
                if (typeof onClear === 'function') onClear();
            }
        }, debounceMs);
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            input.value = '';
            closeBtn.classList.remove('active');
            if (icon) icon.style.display = 'flex';
            if (typeof onClear === 'function') onClear();
        });
    }
}

/**
 * Initializes filter buttons with click event handlers and active state management.
 * 
 * This function sets up event listeners for filter buttons that manage active states
 * and execute callback functions with resolved filter type and value data.
 * 
 * @param {Object} filterAttributes - Configuration object for filter button initialization
 * @param {string} filterAttributes.buttonSelector - CSS selector for filter buttons (e.g., ".filter-button")
 * @param {string|string[]|null} [filterAttributes.filterType] - Type of filter (e.g., "category", "categories", "tag", "tags", "yearDecade")
 * @param {string|string[]|null} [filterAttributes.filterValue] - Filter value(s) - can be single value or array
 * @param {string} [filterAttributes.activeClass="active"] - CSS class name to apply to active buttons
 * @param {Function} [filterAttributes.onClickCallback] - Callback function executed when button is clicked
 * 
 * @param {Object} filterAttributes.onClickCallback.payload - Callback function parameters
 * @param {string|string[]|null} filterAttributes.onClickCallback.payload.type - Resolved filter type
 * @param {string|string[]|null} filterAttributes.onClickCallback.payload.value - Resolved filter value
 * @param {HTMLElement} filterAttributes.onClickCallback.payload.button - The clicked button element
 * @param {Event} filterAttributes.onClickCallback.payload.event - The original click event
 * 
 * @returns {void}
 * 
 * @example
 * // Basic usage with category filter
 * initFilterButton({
 *     buttonSelector: '.category-filter',
 *     filterType: 'category',
 *     filterValue: 'news',
 *     onClickCallback: ({ type, value, button }) => {
 *         console.log(`Filter applied: ${type} = ${value}`);
 *     }
 * });
 * 
 * @example
 * // Usage with data attributes (filter type/value read from button dataset)
 * initFilterButton({
 *     buttonSelector: '.dynamic-filter',
 *     onClickCallback: ({ type, value, button }) => {
 *         // type and value are resolved from button.dataset.filterType and button.dataset.filterValue
 *         filterPosts(type, value);
 *     }
 * });
 * 
 * @example
 * // Usage with custom active class
 * initFilterButton({
 *     buttonSelector: '.tag-filter',
 *     filterType: 'tag',
 *     activeClass: 'selected',
 *     onClickCallback: ({ value }) => {
 *         updateTagFilter(value);
 *     }
 * });
 * 
 * @since 1.0.0
 * @author Charltons Development Team
 * 
 * @see {@link resolveFilterTypeAndValue} - Helper function for resolving filter data
 * @see {@link parseMultiValue} - Utility for parsing filter values
 */
function initFilterButton(filterAttributes) {
    const {
        buttonSelector, // e.g. ".filter-button"
        filterType, // e.g. category, categories, tag, tags, yearDecade
        filterValue, // could accept a single value or an array
        activeClass = 'active',
        onClickCallback // callback function to handle click events
    } = filterAttributes || {};

    // Initialize the filter button with the given attributes
    const filterButtons = document?.querySelectorAll(buttonSelector);

    if (!filterButtons || filterButtons.length === 0) {
        return;
    }

    filterButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove(activeClass));

            // Add active class to the clicked button
            button.classList.add(activeClass);

            const { type: resolvedFilterType, value: resolvedFilterValue } =
                resolveFilterTypeAndValue(button, { filterType, filterValue });

            // Invoke optional callback with resolved values
            if (typeof onClickCallback === 'function') {
                onClickCallback({
                    type: resolvedFilterType,
                    value: resolvedFilterValue,
                    button,
                    event: e
                });
            }

        })
    })
}

function initLoadMoreWithFilters(config) {
    const {
        loadMoreBtnId,
        loadingSpinnerId = ".loading-spinner",
        postsContainerId,
        ajaxAction, // PHP Ajax Action
        postsPerPage = 20,
        buttonSelector,
        filterOnClickCallback,
        // Search integration
        isSearchEnabled = false,
        searchInputId,
        searchCloseButtonId = null,
        searchIconId = null,
        searchMinChars = 2,
        searchDebounceMs = 500,
        ajaxActionSearch = 'global_search'
    } = config || {};

    const loadMoreBtn = document.getElementById(loadMoreBtnId);
    const loadingSpinner = document.querySelector(loadingSpinnerId);
    const postsContainer = document.getElementById(postsContainerId);

    if (!loadMoreBtn || !postsContainer) {
        console.warn('Load more functionality not initialized: missing elements');
        return;
    }

    // If search is enabled, attach search behavior that replaces the container with results
    if (isSearchEnabled) {
        initSearchFeature({
            inputId: searchInputId,
            closeButtonId: searchCloseButtonId,
            iconId: searchIconId,
            minChars: searchMinChars,
            debounceMs: searchDebounceMs,
            onSearch: (query) => {
                // Clear and show loading, hide load more during search
                postsContainer.innerHTML = '';
                loadMoreBtn.style.display = 'none';
                if (loadingSpinner) loadingSpinner.style.display = 'block';
                loadSearchResults(query);
            },
            onClear: () => {
                // Restore the non-search list (first page with current filters)
                const categoryRaw = (loadMoreBtn.dataset.category || '').trim();
                const tagsRaw = (loadMoreBtn.dataset.tags || '').trim();
                const yearStartRaw = (loadMoreBtn.dataset.yearStart || '').trim();
                const yearEndRaw = (loadMoreBtn.dataset.yearEnd || '').trim();

                const category = categoryRaw && categoryRaw !== 'all' ? categoryRaw : null;
                const tags = tagsRaw ? tagsRaw.split(',').map(s => s.trim()).filter(Boolean) : null;
                const yearStart = yearStartRaw ? parseInt(yearStartRaw, 10) : null;
                const yearEnd = yearEndRaw ? parseInt(yearEndRaw, 10) : null;

                loadMoreBtn.dataset.offset = '0';
                postsContainer.innerHTML = '';
                if (loadingSpinner) loadingSpinner.style.display = 'block';
                loadCategoryPosts(category, 0, tags, yearStart, yearEnd);
            }
        });
    }

    // Normalize type to 'category' or 'tag'
    const normalizeType = (t) => {
        if (!t) return null;
        const s = Array.isArray(t) ? (t[0] || '') : String(t);
        const v = s.trim().toLowerCase();
        if (v === 'category' || v === 'categories') return 'category';
        if (v === 'tag' || v === 'tags') return 'tag';
        return v || null;
    };

    // Hook up filter buttons
    const selector = buttonSelector;
    if (selector) {
        initFilterButton({
            buttonSelector: selector,
            onClickCallback: (payload) => {
                const type = normalizeType(payload?.type);
                const selected = Array.isArray(payload?.value) ? payload.value : (payload?.value ? [payload.value] : []);
                const cleaned = selected.map(v => (v || '').toString().trim()).filter(Boolean);

                // State
                let category = null;
                let tagsArr = [];
                let yearStart = null;
                let yearEnd = null;

                if (type === 'category') {
                    category = cleaned.length ? cleaned[0] : null;
                } else if (type === 'tag') {
                    tagsArr = cleaned.length ? cleaned : [];
                } else if (type === 'years') {
                    // Compute decade range from the clicked value (e.g., "2000" => 2000-2009 by default)
                    const yr = cleaned.length ? cleaned[0] : null;
                    const range = yr ? parseYearDecade(String(yr)) : null;
                    if (range) {
                        yearStart = range.start;
                        yearEnd = range.end;
                        // Optional: make 2020 open-ended through current year (uncomment if desired)
                        // if (yearStart === 2020) yearEnd = new Date().getFullYear();
                    }
                    // Force the "awards" tag for years filtering
                    tagsArr = ['awards'];
                } else {
                    // Fallback: treat as category
                    category = cleaned.length ? cleaned[0] : null;
                }

                const isAll = cleaned.length === 0 || cleaned[0] === 'all';

                // Reset state for a new filter selection
                loadMoreBtn.dataset.category = isAll ? '' : (category || '');
                loadMoreBtn.dataset.tags = isAll ? '' : (tagsArr.length ? Array.from(new Set(tagsArr)).join(',') : '');
                loadMoreBtn.dataset.yearStart = isAll ? '' : (yearStart ?? '');
                loadMoreBtn.dataset.yearEnd = isAll ? '' : (yearEnd ?? '');
                loadMoreBtn.dataset.offset = '0';
                postsContainer.innerHTML = '';

                // Show loading state
                loadMoreBtn.style.display = 'none';
                if (loadingSpinner) loadingSpinner.style.display = 'block';

                // Fetch first page for this filter
                loadCategoryPosts(
                    isAll ? null : (category || null),
                    0,
                    isAll ? null : (tagsArr.length ? Array.from(new Set(tagsArr)) : null),
                    isAll ? null : (yearStart ?? null),
                    isAll ? null : (yearEnd ?? null)
                );

                // Bubble user callback (optional)
                if (typeof filterOnClickCallback === 'function') {
                    filterOnClickCallback(payload);
                }
            }
        });
    }

    // Load more: fetch next page and append
    loadMoreBtn.addEventListener("click", function () {
        const offset = parseInt(this.dataset.offset || '0', 10);
        const categoryRaw = (this.dataset.category || '').trim();
        const tagsRaw = (this.dataset.tags || '').trim();
        const yearStartRaw = (this.dataset.yearStart || '').trim();
        const yearEndRaw = (this.dataset.yearEnd || '').trim();

        const category = categoryRaw && categoryRaw !== 'all' ? categoryRaw : null;
        const tags = tagsRaw ? tagsRaw.split(',').map(s => s.trim()).filter(Boolean) : null;
        const yearStart = yearStartRaw ? parseInt(yearStartRaw, 10) : null;
        const yearEnd = yearEndRaw ? parseInt(yearEndRaw, 10) : null;

        // Show loading state
        loadMoreBtn.style.display = "none";
        if (loadingSpinner) loadingSpinner.style.display = "block";

        loadCategoryPosts(category, offset, tags, yearStart, yearEnd);
    });

    // Core fetcher: now supports category and tags
    function loadCategoryPosts(category, offset, tags, yearStart, yearEnd) {
        const postType = loadMoreBtn.dataset.postType || "project";
        const callback = loadMoreBtn.dataset.callback || null;

        const requestBody = {
            action: ajaxAction,
            offset: offset,
            post_type: postType,
            posts_per_page: postsPerPage
        };

        // Categories (custom + legacy)
        if (category) {
            requestBody.category = category;
            requestBody.filter_category = category; // legacy
            requestBody.category_name = category;   // WP native alias
        }

        // Tags (CSV): support several keys so PHP can pick what it expects
        if (tags && tags.length) {
            const tagsCsv = tags.join(',');
            requestBody.tag = tagsCsv;           // WP native
            requestBody.tags = tagsCsv;          // custom
            requestBody.filter_tag = tagsCsv;    // legacy
            requestBody.filter_tags = tagsCsv;   // legacy plural
        }

        // Years/decade range
        if (Number.isInteger(yearStart)) {
            requestBody.year_start = yearStart;
            requestBody.filter_year_start = yearStart; // legacy alias
        }
        if (Number.isInteger(yearEnd)) {
            requestBody.year_end = yearEnd;
            requestBody.filter_year_end = yearEnd;     // legacy alias
        }
        if (Number.isInteger(yearStart) && Number.isInteger(yearEnd)) {
            const rangeStr = `${yearStart}-${yearEnd}`;
            requestBody.year_range = rangeStr;
            requestBody.years = rangeStr; // extra alias
        }

        if (callback) requestBody.callback = callback;

        fetch(ajax_object.ajax_url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(requestBody)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    postsContainer.insertAdjacentHTML("beforeend", data.data.content);
                    loadMoreBtn.dataset.offset = data.data.next_offset;
                    loadMoreBtn.style.display = data.data.has_more ? "block" : "none";
                } else {
                    console.error("Error:", data.data);
                    loadMoreBtn.style.display = "none";
                }
            })
            .catch(error => {
                console.error("Error loading more posts:", error);
                loadMoreBtn.style.display = "block";
            })
            .finally(() => {
                if (loadingSpinner) loadingSpinner.style.display = "none";
            });
    }

    // Search fetcher: uses separate ajax action, respects active category/tags, and always hides Load More (limit 4)
    function loadSearchResults(query) {
        const postType = loadMoreBtn.dataset.postType || undefined;

        // Read current filter state from the Load More button's dataset
        const categoryRaw = (loadMoreBtn.dataset.category || '').trim();
        const categoryLower = categoryRaw.toLowerCase();
        const tagsRaw = (loadMoreBtn.dataset.tags || '').trim();

        // If filter id is "all" (any case) or empty, don't constrain by category/tags
        const category = categoryRaw && categoryLower !== 'all' ? categoryRaw : null;
        let tags = null;
        if (tagsRaw) {
            const tagsLower = tagsRaw.toLowerCase();
            if (tagsLower !== 'all') {
                const arr = tagsRaw.split(',').map(s => s.trim()).filter(Boolean);
                tags = arr.length ? arr : null;
            }
        }

        const requestBody = {
            action: ajaxActionSearch,
            posts_per_page: 4,
            limit: 4,
            s: query,
            query: query,
            search: query
        };

        if (postType) requestBody.post_type = postType;

        // Include category under multiple keys for compatibility (category/categories/category_name/filter_category)
        if (category) {
            requestBody.category = category;
            requestBody.categories = category;
            requestBody.category_name = category;
            requestBody.filter_category = category;
        }

        // Include tags as CSV under multiple keys (tag/tags/filter_tag/filter_tags)
        if (tags && tags.length) {
            const tagsCsv = tags.join(',');
            requestBody.tag = tagsCsv;
            requestBody.tags = tagsCsv;
            requestBody.filter_tag = tagsCsv;
            requestBody.filter_tags = tagsCsv;
        }

        fetch(ajax_object.ajax_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(requestBody)
        })
            .then(r => r.json())
            .then(data => {
                // console.log(data);
                postsContainer.innerHTML = '';
                if (data && Array.isArray(data.data) && data.data.length > 0) {
                    data.data.forEach(post => {
                        const articleCard = `
                                <article class="newsletter_post_item flex-col"
                                         data-category="${sanitizeHTML(post.categories || '')}"
                                         data-tags="${sanitizeHTML(post.tags || '')}"
                                         data-nl_date="${sanitizeHTML(post.post_date || '')}"
                                         data-post-id="${sanitizeHTML(post.id || '')}">
                                    <a href="${sanitizeHTML(post.url || '#')}"
                                       rel="noopener noreferrer"
                                       aria-label="${sanitizeHTML(decodeHTMLEntities(post.title || ''))}">
                                        <div class="post-thumbnail">
                                            ${post.featured_image ? `
                                                <img decoding="async" width="286" height="286" class=""
                                                     src="${sanitizeHTML(post.featured_image)}"
                                                     alt="${sanitizeHTML(decodeHTMLEntities(post.title || ''))}">
                                            ` : ''}
                                            <time class="post-date" datetime="${sanitizeHTML(post.post_date || '')}">
                                                ${sanitizeHTML(post.post_date || '')}
                                            </time>
                                            <h2 class="post-title"
                                                title="${sanitizeHTML(decodeHTMLEntities(post.title || ''))}">
                                                ${sanitizeHTML(decodeHTMLEntities(post.title || ''))}
                                            </h2>
                                        </div>
                                    </a>
                                </article>
                            `;

                        postsContainer.insertAdjacentHTML('beforeend', articleCard);

                    });
                    // Hide Load More during search results
                    loadMoreBtn.style.display = 'none';
                } else {
                    postsContainer.innerHTML = '<p>No results found.</p>';
                    loadMoreBtn.style.display = 'none';
                }
            })
            .catch(err => {
                console.error('Error performing search:', err);
                loadMoreBtn.style.display = 'none';
            })
            .finally(() => {
                if (loadingSpinner) loadingSpinner.style.display = 'none';
            });
    }
}

function loadNewsPagination() {
    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) return;

    // Use standard querySelector (more compatible)
    // TODO: works well with using an ID than querySeletor
    const target = document.getElementById('all_news_posts');

    if (!target) return;

    try {
        const observer = new IntersectionObserver(
            function (entries, obs) {
                entries.forEach(function (entry) {
                    console.log('Intersection detected:', {
                        isIntersecting: entry.isIntersecting,
                        intersectionRatio: entry.intersectionRatio
                    });

                    if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                        console.log('News & Events section is at least 50% visible. Activating pagination...');
                        // You can now customize the pagination with different options:
                        // activatePagination(); // Uses default 'news' category
                        // activatePagination({ categories: ['news', 'events'] }); // Multiple categories
                        // activatePagination({ categories: 'awards', tags: ['featured', 'important'] }); // Category + tags
                        // activatePagination({ categories: 'insights', postsPerPage: 10 }); // Custom posts per page
                        activatePagination();
                        obs.disconnect();
                    }
                });
            },
            {
                threshold: [0.3] // Trigger when 30% of the element is visible
            }
        );

        observer.observe(target);


    } catch (error) {
        console.error('Error setting up IntersectionObserver:', error);
    }
}

// TODO: 
// Refactor initFilterButton() to accommodate the activatePagination() needs

/**
 * Activates pagination for posts by fetching total post count and creating page buttons
 * 
 * @param {Object} options - Configuration options for pagination
 * @param {string|string[]} [options.categories] - Category slug(s) to filter by. Can be a single string or array of strings
 * @param {string|string[]} [options.tags] - Tag slug(s) to filter by. Can be a single string or array of strings
 * @param {number} [options.postsPerPage=15] - Number of posts to display per page
 * @param {string} [options.postsContainer='#all_news_posts'] - CSS selector for posts container
 * @param {string} [options.paginationWrapper='.news_pagination_btns_wrapper'] - CSS selector for pagination wrapper
 * @param {string} [options.paginationBtnClass='pagination_btn'] - CSS class for pagination buttons
 * @param {string} [options.activeBtnClass='active'] - CSS class for active pagination button
 * 
 * This function:
 * 1. Validates required DOM elements exist
 * 2. Fetches category/tag IDs from WordPress REST API
 * 3. Gets total post count for the specified filters
 * 4. Calculates total pages needed
 * 5. Creates interactive pagination buttons
 */
async function activatePagination(options = {}) {
    console.log('Activating pagination...');

    // Normalize and validate options
    const {
        categories = 'news',
        tags = null,
        postsPerPage = 15,
        postsContainer = '#all_news_posts',
        paginationWrapper = '.news_pagination_btns_wrapper',
        paginationBtnClass = 'pagination_btn',
        activeBtnClass = 'active'
    } = options;

    // Normalize categories and tags to arrays
    const categoryArray = Array.isArray(categories) ? categories : [categories];
    const tagArray = tags ? (Array.isArray(tags) ? tags : [tags]) : null;

    // Configuration constants
    const CONFIG = {
        POSTS_PER_PAGE: postsPerPage,
        INITIAL_PAGE: 1,
        CATEGORIES: categoryArray,
        TAGS: tagArray,
        SELECTORS: {
            POSTS_CONTAINER: postsContainer,
            PAGINATION_WRAPPER: paginationWrapper
        },
        CSS_CLASSES: {
            PAGINATION_BTN: paginationBtnClass,
            ACTIVE_BTN: activeBtnClass
        }
    };

    // Early return if required elements don't exist
    const { postsContainer: postsContainerEl, paginationWrapper: paginationWrapperEl } = validateRequiredElements(CONFIG.SELECTORS);
    if (!postsContainerEl || !paginationWrapperEl) {
        console.warn('Pagination not activated: Required DOM elements not found');
        return;
    }

    // State management
    let currentPage = CONFIG.INITIAL_PAGE;

    try {
        // Fetch category and tag data and total posts
        const categoryIds = await fetchCategoryIds(CONFIG.CATEGORIES);
        const tagIds = CONFIG.TAGS ? await fetchTagIds(CONFIG.TAGS) : null;
        const totalPosts = await fetchTotalPostsCount(categoryIds, tagIds);

        // Calculate pagination
        const totalPages = Math.ceil(totalPosts / CONFIG.POSTS_PER_PAGE);

        // Store total pages globally for use in updateActiveButtonState
        window.paginationTotalPages = totalPages;

        // Generate pagination UI
        renderPaginationButtons(paginationWrapperEl, totalPages, currentPage, CONFIG.CSS_CLASSES);

        console.log(`Pagination activated: ${totalPages} pages for ${totalPosts} posts`);

    } catch (error) {
        console.error('Failed to activate pagination:', error.message);
        handlePaginationError(paginationWrapperEl);
    }

    /**
     * Validates that required DOM elements exist
     * @param {Object} selectors - Object containing CSS selectors
     * @returns {Object} Object containing found elements or null
     */
    function validateRequiredElements(selectors) {
        return {
            postsContainer: document.querySelector(selectors.POSTS_CONTAINER),
            paginationWrapper: document.querySelector(selectors.PAGINATION_WRAPPER)
        };
    }

    /**
     * Fetches category IDs for the given slugs
     * @param {string[]} categorySlugs - Array of category slugs to search for
     * @returns {Promise<number[]>} Array of category IDs
     */
    async function fetchCategoryIds(categorySlugs) {
        const categoryIds = [];

        for (const slug of categorySlugs) {
            const categoryApiUrl = `${window.origin}/wp-json/wp/v2/categories?slug=${slug}`;

            const response = await fetch(categoryApiUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch category '${slug}': ${response.status} ${response.statusText}`);
            }

            const categories = await response.json();

            if (!Array.isArray(categories) || categories.length === 0) {
                console.warn(`Category '${slug}' not found, skipping...`);
                continue;
            }

            categoryIds.push(categories[0].id);
        }

        if (categoryIds.length === 0) {
            throw new Error('No valid categories found');
        }

        return categoryIds;
    }

    /**
     * Fetches tag IDs for the given slugs
     * @param {string[]} tagSlugs - Array of tag slugs to search for
     * @returns {Promise<number[]>} Array of tag IDs
     */
    async function fetchTagIds(tagSlugs) {
        const tagIds = [];

        for (const slug of tagSlugs) {
            const tagApiUrl = `${window.origin}/wp-json/wp/v2/tags?slug=${slug}`;

            const response = await fetch(tagApiUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch tag '${slug}': ${response.status} ${response.statusText}`);
            }

            const tags = await response.json();

            if (!Array.isArray(tags) || tags.length === 0) {
                console.warn(`Tag '${slug}' not found, skipping...`);
                continue;
            }

            tagIds.push(tags[0].id);
        }

        return tagIds;
    }

    /**
     * Fetches the total count of posts for given category and tag IDs
     * @param {number[]} categoryIds - Array of category IDs
     * @param {number[]|null} tagIds - Array of tag IDs or null
     * @returns {Promise<number>} Total number of posts
     */
    async function fetchTotalPostsCount(categoryIds, tagIds = null) {
        let postsApiUrl = `${window.origin}/wp-json/wp/v2/posts?per_page=1`;

        // Add categories parameter
        if (categoryIds.length > 0) {
            postsApiUrl += `&categories=${categoryIds.join(',')}`;
        }

        // Add tags parameter if provided
        if (tagIds && tagIds.length > 0) {
            postsApiUrl += `&tags=${tagIds.join(',')}`;
        }

        const response = await fetch(postsApiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch posts count: ${response.status} ${response.statusText}`);
        }

        const totalPosts = parseInt(response.headers.get('X-WP-Total'), 10);

        if (isNaN(totalPosts) || totalPosts < 0) {
            throw new Error('Invalid total posts count received from API');
        }

        return totalPosts;
    }

    /**
     * Creates pagination buttons and renders them in the container with smart pagination display
     * @param {HTMLElement} container - Container element for pagination buttons
     * @param {number} totalPages - Total number of pages
     * @param {number} activePage - Currently active page number
     * @param {Object} cssClasses - CSS class names configuration
     */
    function renderPaginationButtons(container, totalPages, activePage, cssClasses) {
        // Clear existing buttons
        container.innerHTML = '';

        // If 5 or fewer pages, show all pages without Previous/Next
        if (totalPages <= 5) {
            for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
                const button = createPaginationButton(pageNumber, activePage, cssClasses);
                container.appendChild(button);
            }
            return;
        }

        // For more than 5 pages, implement smart pagination
        const maxVisiblePages = 5;
        let startPage, endPage;

        // Calculate the range of pages to show
        if (activePage <= 3) {
            // Show pages 1-5 when on pages 1-3
            startPage = 1;
            endPage = maxVisiblePages;
        } else if (activePage >= totalPages - 2) {
            // Show last 5 pages when near the end
            startPage = totalPages - maxVisiblePages + 1;
            endPage = totalPages;
        } else {
            // Show current page in the middle
            startPage = activePage - 2;
            endPage = activePage + 2;
        }

        // Add Previous button (only show if not on first page)
        if (activePage > 1) {
            const prevButton = createNavigationButton('Previous', activePage - 1, cssClasses);
            container.appendChild(prevButton);
        }

        // Add dots before if needed (when startPage > 1)
        if (startPage > 1) {
            // Always show page 1
            const firstPageButton = createPaginationButton(1, activePage, cssClasses);
            container.appendChild(firstPageButton);

            // Add dots if there's a gap
            if (startPage > 2) {
                const dotsElement = createDotsElement();
                container.appendChild(dotsElement);
            }
        }

        // Add visible page numbers
        for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
            const button = createPaginationButton(pageNumber, activePage, cssClasses);
            container.appendChild(button);
        }

        // Add dots after if needed (when endPage < totalPages)
        if (endPage < totalPages) {
            // Add dots if there's a gap
            if (endPage < totalPages - 1) {
                const dotsElement = createDotsElement();
                container.appendChild(dotsElement);
            }

            // Always show last page
            const lastPageButton = createPaginationButton(totalPages, activePage, cssClasses);
            container.appendChild(lastPageButton);
        }

        // Add Next button (only show if not on last page)
        if (activePage < totalPages) {
            const nextButton = createNavigationButton('Next', activePage + 1, cssClasses);
            container.appendChild(nextButton);
        }
    }

    /**
     * Creates a single pagination button with proper accessibility attributes and event handling
     * @param {number} pageNumber - Page number for this button
     * @param {number} activePage - Currently active page number
     * @param {Object} cssClasses - CSS class names configuration
     * @returns {HTMLButtonElement} Configured button element
     */
    function createPaginationButton(pageNumber, activePage, cssClasses) {
        const button = document.createElement('button');

        // Set basic attributes
        button.className = cssClasses.PAGINATION_BTN;
        button.type = 'button';
        button.textContent = pageNumber;
        button.setAttribute('aria-label', `Go to page ${pageNumber}`);

        // Set active state if this is the current page
        if (pageNumber === activePage) {
            button.classList.add(cssClasses.ACTIVE_BTN);
            button.setAttribute('aria-current', 'page');
        }

        // Add click event handler
        button.addEventListener('click', () => handlePageClick(pageNumber));

        return button;
    }

    /**
     * Creates a navigation button (Previous/Next) with proper event handling
     * @param {string} text - Button text ('Previous' or 'Next')
     * @param {number} targetPage - The page number to navigate to
     * @param {Object} cssClasses - CSS class names configuration
     * @returns {HTMLButtonElement} Configured navigation button element
     */
    function createNavigationButton(text, targetPage, cssClasses) {
        const button = document.createElement('button');

        // Set basic attributes
        button.className = `${cssClasses.PAGINATION_BTN} pagination_nav_btn`;
        button.type = 'button';
        button.textContent = text;
        button.setAttribute('aria-label', `${text} page`);

        // Add click event handler
        button.addEventListener('click', () => handlePageClick(targetPage));

        return button;
    }

    /**
     * Creates a dots element (...) to indicate hidden pages
     * @returns {HTMLSpanElement} Dots element
     */
    function createDotsElement() {
        const dots = document.createElement('span');
        dots.className = 'pagination_dots';
        dots.textContent = '...';
        dots.setAttribute('aria-hidden', 'true');
        return dots;
    }

    /**
     * Handles pagination button click events
     * @param {number} selectedPage - The page number that was clicked
     */
    async function handlePageClick(selectedPage) {
        if (selectedPage === currentPage) {
            return; // No action needed if same page is clicked
        }

        // Update current page state
        currentPage = selectedPage;

        // Update button active states
        updateActiveButtonState(paginationWrapperEl, selectedPage, CONFIG.CSS_CLASSES);

        // Show loading state
        showLoadingState(postsContainerEl);

        try {
            // Fetch and render posts for the selected page
            const categoryIds = await fetchCategoryIds(CONFIG.CATEGORIES);
            const tagIds = CONFIG.TAGS ? await fetchTagIds(CONFIG.TAGS) : null;
            const posts = await fetchPostsByPage(categoryIds, tagIds, selectedPage, CONFIG.POSTS_PER_PAGE);

            // Clear current content and render new posts
            renderPostsContent(postsContainerEl, posts);

            console.log(`Page ${selectedPage} loaded with ${posts.length} posts`);
        } catch (error) {
            console.error(`Failed to load page ${selectedPage}:`, error.message);
            handlePageLoadError(postsContainerEl);
        }
    }

    /**
     * Fetches posts for a specific page
     * @param {number[]} categoryIds - Array of category IDs
     * @param {number[]|null} tagIds - Array of tag IDs or null
     * @param {number} page - The page number to fetch
     * @param {number} postsPerPage - Number of posts per page
     * @returns {Promise<Array>} Array of post objects
     */
    async function fetchPostsByPage(categoryIds, tagIds, page, postsPerPage) {
        const offset = (page - 1) * postsPerPage;
        let postsApiUrl = `${window.origin}/wp-json/wp/v2/posts?per_page=${postsPerPage}&offset=${offset}&_embed`;

        // Add categories parameter
        if (categoryIds.length > 0) {
            postsApiUrl += `&categories=${categoryIds.join(',')}`;
        }

        // Add tags parameter if provided
        if (tagIds && tagIds.length > 0) {
            postsApiUrl += `&tags=${tagIds.join(',')}`;
        }

        const response = await fetch(postsApiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
        }

        const posts = await response.json();

        if (!Array.isArray(posts)) {
            throw new Error('Invalid posts data received from API');
        }

        console.log(posts);

        return posts.map(post => ({
            id: post.id,
            title: post.title.rendered,
            url: post.link,
            post_date: formatPostDate(post.date),
            featured_image: post.featured_image_url || post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
            excerpt: post.excerpt.rendered,
            categories: post._embedded?.['wp:term']?.[0]?.map(cat => cat.name).join(', ') || ''
        }));
    }

    /**
     * Formats the post date from WordPress format to display format
     * @param {string} dateString - WordPress date string
     * @returns {string} Formatted date string
     */
    function formatPostDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Shows loading state in the posts container
     * @param {HTMLElement} container - Posts container element
     */
    function showLoadingState(container) {
        container.innerHTML = `
            <div class="loading-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <div class="spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid hsl(358, 81%, 51%); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p>Loading News...</p>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </div>
        `;
    }

    /**
     * Renders posts content in the container
     * @param {HTMLElement} container - Posts container element
     * @param {Array} posts - Array of post objects
     */
    function renderPostsContent(container, posts) {
        // Clear current content
        container.innerHTML = '';

        if (posts.length === 0) {
            container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 2rem;">No posts found.</p>';
            return;
        }

        // Create post cards using the existing createCardUI function if available, or create simple cards
        posts.forEach(post => {
            const articleCard = document.createElement('article');
            articleCard.className = 'news_article_wrapper';
            articleCard.innerHTML = getNewsHTML(post, post.post_date);
            container.appendChild(articleCard);
        });
    }

    /**
     * Handles page load errors
     * @param {HTMLElement} container - Posts container element
     */
    function handlePageLoadError(container) {
        container.innerHTML = `
            <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #e74c3c;">
                <p>Failed to load posts. Please try again.</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Refresh Page
                </button>
            </div>
        `;
    }

    /**
     * Updates the active state of pagination buttons by re-rendering the entire pagination
     * @param {HTMLElement} container - Container with pagination buttons
     * @param {number} activePage - The page number to mark as active
     * @param {Object} cssClasses - CSS class names configuration
     */
    function updateActiveButtonState(container, activePage, cssClasses) {
        // Since we have dynamic pagination with Previous/Next/Dots, 
        // it's easier to re-render the entire pagination than to update individual buttons
        const totalPages = calculateTotalPages();
        renderPaginationButtons(container, totalPages, activePage, cssClasses);
    }

    /**
     * Helper function to calculate total pages (cached from initial load)
     * @returns {number} Total number of pages
     */
    function calculateTotalPages() {
        // This will be set during initial pagination setup
        return window.paginationTotalPages || Math.ceil(15 / CONFIG.POSTS_PER_PAGE); // fallback
    }

    /**
     * Handles pagination errors by showing user-friendly message
     * @param {HTMLElement} container - Pagination container element
     */
    function handlePaginationError(container) {
        container.innerHTML = '<p class="pagination-error">Unable to load pagination. Please refresh the page.</p>';
    }
};