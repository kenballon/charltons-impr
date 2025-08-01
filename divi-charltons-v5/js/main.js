import FilterButton from "./FilterButton.js";
// =======================================
//  KENNETH BALLON NEW NAV JS CODE
// =======================================
// Get the current URL
const currentUrl = window.location.href;
const origin = window.location.origin;

document.addEventListener("readystatechange", (e) => {
    if (e.target.readyState === "complete") {
        customHeaderNavigation();
        maybeShowLoadMoreButton("hong-kong-law");
        initNewsletterPage();

        const buttonAllActive = document.getElementById("all");
        currentUrl.startsWith(origin + "/news")
            ? buttonAllActive?.classList.add("active")
            : "";

        const defaultFilterdBtn = document?.getElementById("hong-kong-law");
        defaultFilterdBtn?.classList.add("active");

        const newseventsWrapper = document.querySelector('#all_news_posts');
        newseventsWrapper && getNewsAndEventsPosts(["awards-and-rankings", "news"]);
        getArchivedAllPosts(["hong-kong-law"]);


        if (window.location.pathname.includes("/news/newsletters/hong-kong-law-3/")) {
            maybeShowLoadMoreButton({
                filterCategories: ["hong-kong-law"],
                containerSelector: "#newsletters_post",
                itemClass: "newsletter_post_item",
                loadMoreWrapperSelector: "#btn_load_more_wrapper",
                batchSize: 16,
                createCardUI: createCardUI,
                cardType: "newsletter"
            });
        }

        if (window.location.pathname.includes("/our-firm/awards-2/")) {
            maybeShowLoadMoreButton({
                filterTags: ["awards"],
                containerSelector: "#all_awards_wrapper",
                itemClass: "awards_card_item",
                loadMoreWrapperSelector: "#btn_load_more_wrapper",
                batchSize: 15,
                createCardUI: createCardUI,
                cardType: "award"
            });
        }

        if (window.location.pathname.includes("/webinars-and-podcasts/")) {
            console.log("Webinars and Podcasts page detected.");
            initRenderPagination(["webinars-and-podcasts", "webinars"])
        }
    }
});

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

// =====================
// Utility Functions
// =====================

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

// ==================================================
// MOBILE ICON PLUS INTERACTIVITY
// ==================================================
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

function toggleClass(element, removeClass, addClass) {
    if (element.classList.contains(removeClass)) {
        element.classList.remove(removeClass);
        element.classList.add(addClass);
    }
}


// =======================================
//  News and Events JS
// =======================================
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
    NewslettersFilterButtons: ".newsletter_category_filter",
    TagsPPWFilterButtons: ".ppw_tag_btn_filter",
    paginationdots_first: "#ne_pagination_dots_first",
    paginationdots_last: "#ne_pagination_dots",
    podAndWebinarFilterButtons: ".pod_web_btn_filter",
    NewsletterAchiveFilter: ".archive_btn_filter"
};

// ============================================================
//  PPW (Publication, Presentations, and Webinars) JS CODE
// ============================================================
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

const insightFilterButtons = document.getElementById("insights_filter_toggle");
const svgFilterIcon = document.getElementById("insights_filter_icon");
const svgCloseIcon = document.getElementById("insights_filter_close_icon");
const filterBtnsContainer = document.querySelector(
    ".insights_page.btn_tag_filter_wrapper"
);

function toggleFilter(event) {
    event.preventDefault();

    const isActive = insightFilterButtons.classList.toggle("active");
    const dataStateValue = isActive ? "true" : "false";
    insightFilterButtons.setAttribute("data-state", dataStateValue);

    svgCloseIcon.classList.toggle("hidden", !isActive);
    svgFilterIcon.classList.toggle("hidden", isActive);
    filterBtnsContainer.classList.toggle("hidden", !isActive);
}

// open filter button or show/hide filter buttons
insightFilterButtons?.addEventListener("click", toggleFilter);
// ============================================================
//  PPW (Publication, Presentations, and Webinars) JS CODE: END
// ============================================================

// =======================================
//  SHARING TO SOCIAL MEDIA JS CODE
// =======================================

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

function parseDate(dateString) {
    const parts = dateString.split("-");
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is zero-based in JavaScript Date
    const year = parseInt(parts[2], 10);

    return new Date(year, month, day);
}

// Utility function to sort posts by date
function sortPostsByDate(posts) {
    return posts.sort(
        (a, b) =>
            new Date(b.post_date.split("-").reverse().join("-")) -
            new Date(a.post_date.split("-").reverse().join("-"))
    );
}

// Utility function to add "Load More" button
function addLoadMoreButton(
    buttonContainer,
    postsContainer,
    posts,
    currentPostIndex,
    maxPosts,
    createCardUI,
    type = "award"
) {
    const loadMoreButton = document.createElement("button");
    loadMoreButton.textContent = "See More";
    loadMoreButton.className =
        "load-more-button btn-primary border-0 cursor-pointer";
    buttonContainer?.appendChild(loadMoreButton);

    loadMoreButton.addEventListener("click", () => {
        if (loadMoreButton.textContent === "See More") {
            const remainingPosts = posts.slice(
                currentPostIndex,
                currentPostIndex + maxPosts
            );
            remainingPosts.forEach((post) => {
                const article = createCardUI(post, type);
                postsContainer.appendChild(article);
            });
            currentPostIndex += maxPosts;

            // Change button text to "Show Less" if all posts are loaded
            if (currentPostIndex >= posts.length) {
                loadMoreButton.textContent = "Show Less";
            }
        } else {
            // Reset to initial state
            postsContainer.innerHTML = "";
            const initialPosts = posts.slice(0, maxPosts);
            initialPosts.forEach((post) => {
                const article = createCardUI(post, type);
                postsContainer.appendChild(article);
            });
            currentPostIndex = maxPosts;
            loadMoreButton.textContent = "See More";
        }
    });
}

async function showFilteredAwards(filterID) {
    await filterAndRenderPosts({
        dbName: "PostsDatabase",
        storeName: "posts",
        filterFn: (post) => {
            const postTags = post.tags.toLowerCase().split(",");
            return postTags.includes("awards");
        },
        postFilter: (post) => {
            const postTags = post.tags.toLowerCase().split(",");
            return !filterID || postTags.includes(filterID);
        },
        renderType: "award",
        maxInitialPosts: 15,
        containerId: "all_awards_wrapper",
        loadMoreId: "btn_load_more_wrapper"
    });
}

async function showFilteredAwardsByYear(filterID) {
    await filterAndRenderPosts({
        dbName: "PostsDatabase",
        storeName: "posts",
        filterFn: (post) => {
            const postTags = post.tags.toLowerCase().split(",");
            return postTags.includes("awards");
        },
        postFilter: (post) => {
            const postYear = parseInt(post.post_date.split(" ")[2], 10);
            if (!filterID) return true;
            const filterYear = parseInt(filterID, 10);
            if (filterYear === 2020) {
                return postYear >= 2020;
            } else if (filterYear === 2010) {
                return postYear >= 2010 && postYear <= 2019;
            } else if (filterYear === 2000) {
                return postYear >= 2000 && postYear <= 2009;
            } else {
                return postYear === filterYear;
            }
        },
        renderType: "award",
        maxInitialPosts: 20,
        containerId: "all_awards_wrapper",
        loadMoreId: "btn_load_more_wrapper"
    });
}

FilterButton.initializeAll(SELECTORS.awardsFilterButton, (filterID) => {
    currentFilterID = filterID === "all" ? null : filterID;

    showFilteredAwards(currentFilterID);

    const awardsYearFilterBtn = document?.querySelector(
        ".awards_btn_yrfilter.active"
    );
    awardsYearFilterBtn ? awardsYearFilterBtn.classList.remove("active") : null;
});

FilterButton.initializeAll(".awards_btn_yrfilter", (filterID) => {
    currentFilterID = filterID === "all" ? null : filterID;
    showFilteredAwardsByYear(currentFilterID);
    const awardsTagFilterBtn = document?.querySelector(
        ".awards_btn_filter.active"
    );
    awardsTagFilterBtn ? awardsTagFilterBtn.classList.remove("active") : null;

});

const searchInput = document?.getElementById("newsletterSearch");
const showCloseButton = document?.getElementById("nl_close_search");
const nlSearchIcon = document?.getElementById("nl_search_icon");

FilterButton.initializeAll(SELECTORS.NewslettersFilterButtons, (filterID) => {
    currentFilterID = filterID === "all" ? null : filterID;
    showFilteredNewsletters(currentFilterID);
});

async function showFilteredNewsletters(filterCategoryID) {
    await filterAndRenderPosts({
        dbName: "PostsDatabase",
        storeName: "posts",
        filterFn: (post) => {
            const categories = post.categories.toLowerCase().split(", ");
            return categories.includes(filterCategoryID);
        },
        postFilter: (post) => {
            const categories = post.categories.toLowerCase().split(", ");
            return !filterCategoryID || categories.includes(filterCategoryID);
        },
        renderType: "newsletter",
        maxInitialPosts: 16,
        containerId: "newsletters_post",
        loadMoreId: "btn_load_more_wrapper"
    });
}
// Generic utility to filter, sort, and render posts with optional load more
async function filterAndRenderPosts({
    dbName,
    storeName,
    filterFn,
    postFilter = null,
    renderType = "news",
    maxInitialPosts = 15,
    containerId,
    loadMoreId
}) {
    const posts = await fetchPostsFromDB(dbName, storeName, filterFn);
    const sortedPosts = sortPostsByDate(posts);
    const container = document?.getElementById(containerId);
    const loadMoreContainer = document?.getElementById(loadMoreId);
    if (!container || !loadMoreContainer) return;
    loadMoreContainer.innerHTML = "";
    container.innerHTML = "";
    let filteredPosts = sortedPosts;
    if (postFilter) {
        filteredPosts = sortedPosts.filter(postFilter);
    }
    const initialPosts = filteredPosts.slice(0, maxInitialPosts);
    initialPosts.forEach((post) => {
        const article = createCardUI(post, renderType, true);
        container?.appendChild(article);
    });
    let currentPostIndex = maxInitialPosts;
    if (filteredPosts.length > maxInitialPosts) {
        addLoadMoreButton(
            loadMoreContainer,
            container,
            filteredPosts,
            currentPostIndex,
            maxInitialPosts,
            createCardUI,
            renderType
        );
    }
}

//SEARCH NEWSLETTERS
searchInput?.addEventListener("input", async function (e) {
    const searchValue = e.target.value.toLowerCase();
    const activeFilterBtn = document?.querySelector(
        ".newsletter_category_filter.active"
    );

    showCloseButton.classList.toggle("active", searchInput.value.length >= 2);
    if (searchInput.value.length >= 2) {
        nlSearchIcon.style.display = "none";
    } else if (searchInput.value.length === 0) {
        nlSearchIcon.style.display = "flex";
    }

    const dbName = "PostsDatabase";
    const storeName = "posts";
    const maxInitialPosts = 16;
    let currentPostIndex = 0;

    const searchNewsletterPosts = await fetchPostsFromDB(
        dbName,
        storeName,
        (post) => {
            const categories = post.categories.toLowerCase().split(", ");
            return categories.includes(activeFilterBtn?.id);
        }
    );

    const sortedNewslettersPosts = sortPostsByDate(searchNewsletterPosts);

    const newsletterContainer = document?.getElementById("newsletters_post");
    const loadMoreContainer = document?.getElementById("btn_load_more_wrapper");
    if (!newsletterContainer || !loadMoreContainer) return;
    loadMoreContainer.innerHTML = "";
    newsletterContainer.innerHTML = "";

    const filteredPosts = sortedNewslettersPosts.filter((post) => {
        const postTitle = post.title.toLowerCase();
        return postTitle.includes(searchValue);
    });

    const initialPosts = filteredPosts.slice(0, maxInitialPosts);

    initialPosts.forEach((post) => {
        const article = createCardUI(post, "newsletter", true);
        newsletterContainer?.appendChild(article);
    });

    currentPostIndex = maxInitialPosts;

    if (filteredPosts.length > maxInitialPosts) {
        addLoadMoreButton(
            loadMoreContainer,
            newsletterContainer,
            filteredPosts,
            currentPostIndex,
            maxInitialPosts,
            createCardUI,
            "newsletter"
        );
    }
});

showCloseButton?.addEventListener("click", function () {
    searchInput.value = "";
    showCloseButton.classList.remove("active");
    const activeFilterBtn = document?.querySelector(
        ".newsletter_category_filter.active"
    );
    showFilteredNewsletters(activeFilterBtn?.id);
});
//SEARCH NEWSLETTERS END

const buttonSVG = document.querySelectorAll('.arrow_right_svg_plus_icon');

buttonSVG.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
        const parentItem = button.closest('.services_list_item');
        if (parentItem) {
            const subServicesList = parentItem.querySelector('.sub_services_list');
            if (subServicesList) {
                subServicesList.classList.toggle('active');
            }
        }
    });
});

// =======================================
//  NEWS & EVENTS PAGE JS CODE : REFACTORED
// =======================================

function renderPosts(posts, page, postsPerPage = 15, elementID) {

    const awardNewsPostContainer = document?.getElementById(elementID);
    if (!awardNewsPostContainer) return;

    awardNewsPostContainer.innerHTML = "";

    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const postsToRender = posts.slice(start, end);

    // Batch DOM updates using DocumentFragment
    const fragment = document.createDocumentFragment();
    postsToRender.forEach((post) => {
        const article = createCardUI(post, "news", true);
        fragment.appendChild(article);
    });
    awardNewsPostContainer.appendChild(fragment);
}

function renderPagination(posts, postsPerPage = 15, elementID) {
    const paginationWrapper = document?.getElementById("news_pagination_btns_wrapper");
    const prevBtn = document?.getElementById("prev_post_btn");
    const nextBtn = document?.getElementById("next_post_btn");
    const firstBtn = document?.getElementById("first_post_btn");
    const lastBtn = document?.getElementById("last_post_btn");
    const paginationDotsFirst = document?.getElementById("ne_pagination_dots_first");
    const paginationDotsLast = document?.getElementById("ne_pagination_dots");

    let currentPage = 1;
    const totalPages = Math.ceil(posts.length / postsPerPage);

    function togglePaginationVisibility(isVisible) {
        document?.querySelector('.pagination_container').classList.toggle('d-none', !isVisible);
    }

    function createPageButton(page) {
        const button = document.createElement("button");
        button.textContent = page;
        button.className = "pagination_btn";
        button.setAttribute("type", "button");
        button.setAttribute("aria-label", `Go to page ${page}`);
        button.addEventListener("click", () => {
            currentPage = page;
            renderPosts(posts, currentPage, postsPerPage, elementID);
            updatePagination();
        });
        return button;
    }

    function updatePagination() {
        if (!paginationWrapper) return;
        paginationWrapper.innerHTML = "";

        const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
        const endPage = Math.min(startPage + 4, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = createPageButton(i);
            if (i === currentPage) pageButton.classList.add("active");

            paginationWrapper.appendChild(pageButton);
        }

        updateButtonStates(endPage);
    }

    function updateButtonStates(endPage) {
        const isFirstPage = currentPage === 1;
        const isLastPage = currentPage === totalPages;

        prevBtn?.classList.toggle("d-none", isFirstPage);
        nextBtn?.classList.toggle("d-none", isLastPage);
        firstBtn?.classList.toggle("d-none", isFirstPage || currentPage <= 5);
        lastBtn?.classList.toggle("d-none", isLastPage || endPage === totalPages);
        paginationDotsFirst?.classList.toggle("d-none", isFirstPage || currentPage <= 5);
        paginationDotsLast?.classList.toggle("d-none", isLastPage || endPage === totalPages);

        firstBtn.textContent = "1";
        lastBtn.textContent = totalPages;
    }

    prevBtn?.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPosts(posts, currentPage, postsPerPage, elementID);
            updatePagination();
        }
    });

    nextBtn?.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPosts(posts, currentPage, postsPerPage, elementID);
            updatePagination();
        }
    });

    firstBtn?.addEventListener("click", () => {
        currentPage = 1;
        renderPosts(posts, currentPage, postsPerPage, elementID);
        updatePagination();
    });

    lastBtn?.addEventListener("click", () => {
        currentPage = totalPages;
        renderPosts(posts, currentPage, postsPerPage, elementID);
        updatePagination();
    });

    if (totalPages <= 1) {
        togglePaginationVisibility(false);
        return;
    }

    togglePaginationVisibility(true);

    updatePagination();
}

async function getNewsAndEventsPosts(categories = [], filterID = null) {
    const dbName = "PostsDatabase";
    const storeName = "posts";

    // get all posts from db that matches the categories
    const awardsOrNews = await fetchPostsFromDB(dbName, storeName, (post) => {
        const postCategories = post.categories.toLowerCase().split(",");
        const matchesCategory = postCategories.some((category) => categories.includes(category));
        return matchesCategory;
    });

    let filteredPosts = awardsOrNews;

    // Filter posts by tag if filterID is provided
    if (filterID) {
        filteredPosts = awardsOrNews.filter((post) => {
            const postTags = post.tags.toLowerCase().split(",");
            return postTags.includes(filterID);
        });
    }

    const sortedPosts = sortPostsByDate(filteredPosts);

    // Initial render
    renderPosts(sortedPosts, 1, 15, "all_news_posts");
    renderPagination(sortedPosts, 15, "all_news_posts");
}

// filter for awards 
FilterButton.initializeAll(SELECTORS.newsEventsFilterButtons, (filterID) => {
    currentFilterID = filterID === "all" ? null : filterID;
    getNewsAndEventsPosts(["awards-and-rankings", "news"], currentFilterID);
});


function filterPostsByCategoryAndTag(posts, filterID) {
    return posts.filter((post) => {
        const postCategories = post.categories.toLowerCase().split(",");
        const postTags = post.tags.toLowerCase().split(",");

        // Check if the filterID matches either a category or a tag
        const matchesCategory = postCategories.includes(filterID);
        const matchesTag = postTags.includes(filterID);

        return matchesCategory || matchesTag;
    });
}

async function getPodcastsAndWebinars(categories = [], filterID = null) {

    const dbName = "PostsDatabase";
    const storeName = "posts";

    const posts = await fetchPostsFromDB(dbName, storeName, (post) => {
        if (categories.length === 0) return true; // If no categories specified, include all

        const postCategories = post.categories
            .toLowerCase()
            .split(",")
            .map(cat => cat.trim());
        return categories.some(category =>
            postCategories.includes(category.toLowerCase())
        );
    });

    let filteredPosts = posts;

    // Filter by tag if filterID is provided
    if (filterID) {
        filteredPosts = posts.filter((post) => {
            const postCategories = (post.categories || "")
                .toLowerCase()
                .split(",")
                .map(cat => cat.trim());

            const postTags = (post.tags || "")
                .toLowerCase()
                .split(",")
                .map(tag => tag.trim());

            return postCategories.includes(filterID.toLowerCase()) ||
                postTags.includes(filterID.toLowerCase());
        });
    }

    // Filter posts to only include those with featured images
    filteredPosts = filteredPosts.filter((post) => {
        return post.featured_image && post.featured_image.trim() !== '';
    });

    // Sort the filtered posts by date
    const sortedPosts = sortPostsByDate(filteredPosts);

    // Initial render
    renderPosts(sortedPosts, 1, 15, "pod-and-web");
    renderPagination(sortedPosts, 15, "pod-and-web");
}

FilterButton.initializeAll(SELECTORS.podAndWebinarFilterButtons, (filterID) => {
    currentFilterID = filterID === "all" ? null : filterID;

    // Fetch and filter by category and tag
    getPodcastsAndWebinars(["webinars-and-podcasts", "webinars"], currentFilterID);
});

async function initRenderPagination(categories = []) {

    const dbName = "PostsDatabase";
    const storeName = "posts";

    const posts = await fetchPostsFromDB(dbName, storeName, (post) => {
        if (categories.length === 0) return true; // If no categories specified, include all

        const postCategories = post.categories
            .toLowerCase()
            .split(",")
            .map(cat => cat.trim());

        return categories.some(category =>
            postCategories.includes(category.toLowerCase())
        );
    });

    let filteredPosts = posts;

    // Filter posts to only include those with featured images
    filteredPosts = filteredPosts.filter((post) => {
        return post.featured_image && post.featured_image.trim() !== '';
    });

    // Sort the filtered posts by date
    const sortedPosts = sortPostsByDate(filteredPosts);

    renderPagination(sortedPosts, 15, "pod-and-web");
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

async function getArchivedAllPosts(categories = []) {
    const dbName = "PostsDatabase";
    const storeName = "posts";

    const allPosts = await fetchPostsFromDB(dbName, storeName, (post) => post);

    let filteredPosts = allPosts;

    if (categories.length) {
        filteredPosts = filteredPosts.filter((post) => {
            // Split categories by comma and trim whitespace
            const postCategories = post.categories
                .split(",")
                .map(cat => cat.trim().toLowerCase());
            return categories.some((category) => postCategories.includes(category));
        });
    }

    const sortedPosts = sortPostsByDate(filteredPosts);

    // Group posts by year
    const postsByYear = {};
    sortedPosts.forEach((post) => {
        const parts = post.post_date.split("-");
        const year = parts[2];
        if (!postsByYear[year]) postsByYear[year] = [];
        postsByYear[year].push(post);
    });

    // Render a single table
    const archivedPostsContainer = document?.getElementById("archived_posts_container");
    if (!archivedPostsContainer) return;
    archivedPostsContainer.innerHTML = "";

    const table = createUITable(postsByYear, categories);
    archivedPostsContainer.appendChild(table);
}

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

            const [day, month, _year] = post.post_date.split("-");
            const dateObj = new Date(`${_year}-${month}-${day}`);
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

function getRenderedPostIds(containerSelector, itemClass) {
    return Array.from(document.querySelectorAll(`${containerSelector} .${itemClass}`))
        .map(el => el.getAttribute('data-post-id'));
}

async function getAllPostsFromDB({ dbName, storeName, filterCategories = [], filterTags = [] }) {
    const posts = await fetchPostsFromDB(dbName, storeName, (post) => {
        const categories = post.categories?.toLowerCase().split(",").map(s => s.trim()) || [];
        const tags = post.tags?.toLowerCase().split(",").map(s => s.trim()) || [];
        const catMatch = !filterCategories.length || filterCategories.some(cat => categories.includes(cat));
        const tagMatch = !filterTags.length || filterTags.some(tag => tags.includes(tag));
        return catMatch && tagMatch;
    });
    return sortPostsByDate(posts);
}

async function maybeShowLoadMoreButton({
    dbName = "PostsDatabase",
    storeName = "posts",
    filterCategories = [],
    filterTags = [],
    containerSelector,
    itemClass,
    loadMoreWrapperSelector,
    batchSize = 16,
    createCardUI,
    cardType = ""
}) {
    const postsContainer = document.querySelector(containerSelector);
    const buttonContainer = document.querySelector(loadMoreWrapperSelector);


    if (!postsContainer) {
        console.warn(`maybeShowLoadMoreButton: Container selector "${containerSelector}" not found in DOM.`);
        return;
    }
    if (!buttonContainer) {
        console.warn(`maybeShowLoadMoreButton: Load more wrapper selector "${loadMoreWrapperSelector}" not found in DOM.`);
        return;
    }

    if (!postsContainer || !buttonContainer) return; // Exit if containers are missing

    const renderedIds = getRenderedPostIds(containerSelector, itemClass);
    const allPosts = await getAllPostsFromDB({ dbName, storeName, filterCategories, filterTags });

    // console.log(`All posts fetched: ${allPosts.length}, Rendered IDs: ${renderedIds.length}`);

    if (allPosts.length > renderedIds.length) {
        addLoadMoreButton(
            buttonContainer,
            postsContainer,
            allPosts,
            renderedIds.length,
            batchSize,
            createCardUI,
            cardType
        );
    }
}

// PROFILE SINGLE PAGE OBSERVER 
const sectionTextContent = [...document.querySelectorAll('.profile_content_section')];

// Function to check which section is near the top of the viewport (within 150px)
function updateActiveNavItem() {
    const navItems = document.querySelectorAll('.profile_bio_nav_item');
    let activeSection = null;

    // Check each section to see if it's within 150px of the viewport top
    sectionTextContent.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;

        // If section is within 350px of the top and visible
        if (sectionTop <= 350 && sectionTop + rect.height > 350) {
            activeSection = section;
        }
    });

    // Update nav items based on active section
    navItems.forEach(item => {
        if (activeSection && item.id === activeSection.id) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Use scroll event with throttling for better performance
let scrollTimeout;
function throttledScrollHandler() {
    if (scrollTimeout) {
        return;
    }

    scrollTimeout = setTimeout(() => {
        updateActiveNavItem();
        scrollTimeout = null;
    }, 16); // ~60fps
}

// Initialize and add scroll listener
if (sectionTextContent.length > 0) {
    window.addEventListener('scroll', throttledScrollHandler);
    // Call once on load to set initial state
    updateActiveNavItem();
}