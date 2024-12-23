import FilterButton from "./FilterButton.js";

function loadOptionUrl() {
  window.location = document.getElementById("option-url").value;
}

jQuery(document).ready(function ($) {
  // remove default show dropdown menu replaced in css by => .et_menu_container:hover ul

  function getMenuHeight(elem) {
    var submenuMaxHeight = 0;
    $(elem).each(function () {
      if ($(this).height() > submenuMaxHeight) {
        submenuMaxHeight = $(this).height();
      }
    });

    return submenuMaxHeight;
  }

  // CONTENT2 RIGHT THUMBS
  $(".right-thumb-content.toggle-thumbs .rtc-title, .view-all-toggle").click(
    function () {
      $(this)
        .siblings()
        .not(".rtc-image:nth-of-type(1)")
        .not(".toggle-thumbs .rtc-title")
        .not(".toggle-thumbs .view-all-toggle")
        .toggle();
      var rightBlogList = $(this).siblings(".rtc-image:nth-of-type(2)");
      if (rightBlogList.is(":hidden")) {
        $(this).parent().children(".view-all-toggle").text("view more");
        $(this)
          .parent()
          .children(".rtc-title")
          .removeClass("h-shown")
          .addClass("h-hidden");
      } else {
        $(this).parent().children(".view-all-toggle").text("view less");
        $(this)
          .parent()
          .children(".rtc-title")
          .removeClass("h-hidden")
          .addClass("h-shown");
      }
    }
  );

  // SUBPAGE MENU
  var width = $(window).width();

  if (width > 979) {
    $("nav.page-menu-items ul li").click(function () {
      $("nav.page-menu-items ul li ul").toggle();
    });

    $("nav.page-menu-items ul li").click(function () {
      //$("nav.page-menu-items ul li ul").hide();
    });
  }
  if (width < 979) {
    $(".page-menu-panel .hamburger").click(function () {
      $(".page-menu-items").toggle();
    });

    $(".page-menu-section li.has-children").append("<span>+</span>");
    $(".page-menu-section li.has-children").click(function () {
      $(".page-menu-section li.has-children").not(this).find("ul").hide();
      $(this).find("ul").slideToggle();
    });
  }

  var win = $(this); //this = window

  if (win.width() >= 979) {
    $("nav.page-menu-items ul li").click(function () {
      $("nav.page-menu-items ul li ul").toggle();
    });

    $("nav.page-menu-items ul li").click(function () {
      //$("nav.page-menu-items ul li ul").hide();
    });
  }

  // CONTENT MENUBAR MOBILE/DESKTOP
  $(".content-menubar > ul > li > ul > li.page_item_has_children").append(
    "<span>+</span>"
  );

  // CONTENT MENUBAR MOBILE
  if (win.width() <= 979) {
    $(".page-menu-panel .hamburger").click(function () {
      $(".content-menubar ul.cm-parent").slideToggle();
    });

    $(".content-menubar > ul > li.page_item_has_children").append(
      "<span>+</span>"
    );

    $("ul.cm-parent > li.page_item_has_children").click(function () {
      //$(this).find('ul').hide();
      //$('ul.cm-parent > li.page_item_has_children').children('ul').hide();
      $(this).children("ul").slideToggle();
    });

    $(
      "ul.cm-parent > li.page_item_has_children > ul > li.page_item_has_children"
    ).click(function () {
      //$(this).find('ul').hide();
      //$(this).parent().parent().css("display","block");
      $("ul.cm-parent > li.page_item_has_children").children("ul").hide();
      $(this).children("ul").slideToggle();
    });
  }

  // CONTENT MENUBAR DESKTOP
  if (win.width() >= 979) {
    $(".content-menubar > ul > li > ul > li.page_item_has_children").click(
      function () {
        if ($(this).parent().hasClass("open")) {
          $(this).parent().removeClass("open");
        } else {
          $(this).parent().addClass("open");
        }

        //console.log(jQuery(this).parent().height());

        $(".content-menubar ul li ul li.page_item_has_children")
          .not(this)
          .find("ul")
          .hide();
        $(this).find("ul").slideToggle();
      }
    );

    var append_count = 0;
    $(".content-menubar ul.cm-parent > li").each(function () {
      if (!$(this).hasClass("page_item_has_children")) {
        $(this).append('<ul class="children"></ul>');
      }
    });
    // insert span to control A tag alignment
    $(".content-menubar ul.cm-parent > li > a").each(function () {
      var temp_text = $(this).text();
      $(this)
        .text("")
        .prepend("<span>" + temp_text + "</span>");
    });

    var maxHeight = -1;
    $(".content-menubar ul.cm-parent li ul.children").each(function () {
      if ($(this).height() > maxHeight) {
        maxHeight = $(this).height();
      }
    });

    $(".content-menubar > ul.cm-parent").mouseenter(function () {
      var target_el = ".content-menubar ul.cm-parent li ul";
      $(".content-menubar > ul.cm-parent > li > ul").css(
        "visibility",
        "visible"
      );

      // *******************						toggle class, menu geight "thefirm categories"

      var menubarHeight =
        ".content-menubar > ul > li > ul > li.page_item_has_children span";
      var menubarHeightAuto = ".content-menubar > ul.cm-parent > li > ul";

      $(menubarHeight).click(function () {
        $(menubarHeightAuto).toggleClass("menubarHeightAutoClass");
      });

      // 						*** end

      //console.log(getMenuHeight(target_el));
      $(".content-menubar ul.children li.page-item-221953").css(
        "display",
        "none"
      ); /*hide Company */
    });

    $(".content-menubar ul.cm-parent").mouseleave(function () {
      $(".content-menubar > ul.cm-parent > li > ul").css(
        "visibility",
        "hidden"
      );
    });
  }

  if ($(".content-wrapper15").length) {
    $(window).scroll(function () {
      var top_of_hero = $(
        ".content-wrapper15 div.et_pb_row.et_pb_row_0"
      ).offset().top;
      var bottom_of_hero =
        $(".content-wrapper15 div.et_pb_row.et_pb_row_0").offset().top +
        $(".content-wrapper15 div.et_pb_row.et_pb_row_0").outerHeight();

      var top_of_menu = $(".float-anchor-menu").offset().top;
      var bottom_of_menu =
        $(".float-anchor-menu").offset().top +
        $(".float-anchor-menu").outerHeight();

      $("section").each(function () {
        var top_of_elem = $(this).offset().top;
        var bottom_of_elem = $(this).offset().top + $(this).outerHeight();

        if (top_of_elem < top_of_menu && bottom_of_elem > top_of_menu) {
          $(".float-anchor-menu li a").parent().removeClass("active");
          $('.float-anchor-menu li a[href="#' + $(this).attr("id") + '"]')
            .parent()
            .addClass("active");
          $(".float-anchor-menu")
            .removeClass("expand-float-menu")
            .addClass("collapse-float-menu");
        }
      });

      if (top_of_menu < bottom_of_hero) {
        $(".float-anchor-menu li a").parent().removeClass("active");
        $(".float-anchor-menu").addClass("expand-float-menu");
      }
    });
  }

  // click target blank
  $(".cat-271-id .insights-table a, .page-id-16470 td a").click(function () {
    $(this).attr("target", "_blank");
  });

  // sitemap
  $(".smap-node > ul li ul").hide();
  $(".smap-node > ul li.page_item_has_children").click(function () {
    $(this).find("ul").slideToggle();
  });

  // newsletter search submit
  $("#newsletter-go").click(function () {
    $(".newsletter-search").submit();
  });
});

// =======================================
//  KENNETH BALLON NEW NAV JS CODE
// =======================================
// Get the current URL
const currentUrl = window.location.href;
const origin = window.location.origin;

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") {
    customHeaderNavigation();
    tabFunc();
    showAwardImageFunc();
    showNewsEvents();
    allNewsLettersPosts();
    initNewsletterPage();

    const buttonAllActive = document.getElementById("all");
    currentUrl.startsWith(origin + "/news")
      ? buttonAllActive?.classList.add("active")
      : "";

    const defaultFilterdBtn = document?.getElementById("hong-kong-law");
    defaultFilterdBtn?.classList.add("active");
  }
});

function customHeaderNavigation() {
  // mobile nav reveal
  const header = document.querySelector("header");
  const mobileNavMenu = document.querySelector(".mobile_nav_show");
  const headerHeight = header.offsetHeight;

  window.addEventListener("resize", (e) => {
    mobileNavMenu.style.top = `${headerHeight}px`;
  });
  mobileNavMenu.style.top = `${headerHeight}px`;
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

    parentLinkItem.addEventListener("mouseenter", () => {
      if (navLinkId === subMenuWrapperActive?.id) {
        const listItem = subMenuWrapperActive.querySelectorAll(
          ".nav_child_list_item"
        );

        const links = subMenuWrapperActive.querySelectorAll(".link_wrapper");
        links.forEach((link, index) => {
          const timeoutId = setTimeout(() => {
            requestAnimationFrame(() => {
              link.style.transform = "translate(0, 0)";
            });
          }, index * 20);
          animationTimeouts.push(timeoutId);
        });

        listItem.forEach((item) => {
          item.style.opacity = 1;
        });
      }
    });

    parentLinkItem.addEventListener("mouseleave", (e) => {
      const anchorParent = e.target.closest(".nav_parent_list_item");
      const anchorParentId = anchorParent.getAttribute("data-parentlistid");
      animationTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      animationTimeouts = [];

      if (anchorParentId === subMenuWrapperActive?.id) {
        const listItem = subMenuWrapperActive.querySelectorAll(
          ".nav_child_list_item"
        );
        const links = subMenuWrapperActive.querySelectorAll(".link_wrapper");

        subMenuWrapperActive.classList.remove("active-hover");
        anchorParent.classList.remove("active-nav");

        links.forEach((link) => {
          link.style.transform = "translate3d(0, 40px, 0)";
        });

        listItem.forEach((item) => {
          item.style.opacity = 0;
        });
      }
    });

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
  searchMatchesWrapper.appendChild(loadingIndicator);

  // Cache for storing previous search results
  const searchCache = {};

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  function fetchLatestPosts() {
    fetch(ajax_object.ajax_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "action=ajax_latest_posts",
    })
      .then((response) => response.text())
      .then((data) => {
        searchResultsList.innerHTML = data;
        searchMatchesWrapper.style.display = "block";
      })
      .catch((error) => console.error("Error:", error));
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
      debounce(function () {
        let searchQuery = this.value.trim();

        if (searchQuery.length > 2) {
          if (searchCache[searchQuery]) {
            searchResultsList.innerHTML = searchCache[searchQuery];
            searchMatchesWrapper.style.display = "block";
          } else {
            loadingIndicator.style.display = "block";
            fetch(ajax_object.ajax_url, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body:
                "action=ajax_search&search=" + encodeURIComponent(searchQuery),
            })
              .then((response) => response.text())
              .then((data) => {
                searchCache[searchQuery] = data; // Cache the results
                searchResultsList.innerHTML = data;
                searchMatchesWrapper.style.display = "block";
              })
              .catch((error) => console.error("Error:", error))
              .finally(() => {
                loadingIndicator.style.display = "none";
              });
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

  searchFormButton.addEventListener("click", () => {
    navSearchWrapper.classList.add("hide-animate");
    header.classList.add("search-open");

    setTimeout(() => {
      toggleClass(navSearchWrapper, "hide-animate", "hidden");
      toggleClass(searchWrapper, "d-none", "show");
      searchInput.focus();
    }, 200);
  });

  closeSearchButton.addEventListener("click", () => {
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

  menuBtn.addEventListener("click", () => {
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
//  Awards Page JS
// =======================================

const tabFunc = () => {
  const awardSectionComponent = document.querySelectorAll(
    ".awards_section_component"
  );

  awardSectionComponent.forEach((section) => {
    const nextBtn = section.querySelector(".next_tab_btn");
    const prevBtn = section.querySelector(".prev_tab_btn");

    const tabWrapper = section.querySelector(".award_tabs");
    const tabBtns = section.querySelectorAll(".tab_btn");

    let tabWidth = 0;
    tabBtns.forEach((btn) => {
      tabWidth += btn.getBoundingClientRect().width;
    });

    let tabContainerWrapper = section.querySelector(".award_tabs_container");
    if (window.innerWidth <= 1023) {
      tabContainerWrapper.style.maxWidth = `${
        (tabWidth / tabBtns.length) * 3
      }px`;
    } else {
      tabContainerWrapper.style.maxWidth = `${
        (tabWidth / tabBtns.length) * 5
      }px`;
    }

    const containerWidth = section
      .querySelector(".award_tabs_container")
      .getBoundingClientRect().width;

    let totalTranslation = 0;
    const maxTranslation =
      tabWidth - tabContainerWrapper.getBoundingClientRect().width;

    if (tabWidth <= containerWidth) {
      nextBtn.disabled = true;
    }

    nextBtn.addEventListener("click", () => {
      totalTranslation -= tabBtns[0].getBoundingClientRect().width;
      if (totalTranslation <= -maxTranslation) {
        totalTranslation = -maxTranslation;
        nextBtn.disabled = true;
      } else {
        prevBtn.disabled = false;
      }
      tabWrapper.style.transform = `translateX(${totalTranslation}px)`;
    });

    prevBtn.addEventListener("click", () => {
      totalTranslation += tabBtns[0].getBoundingClientRect().width;
      if (totalTranslation >= 0) {
        totalTranslation = 0;
        prevBtn.disabled = true;
      } else {
        nextBtn.disabled = false;
      }
      tabWrapper.style.transform = `translateX(${totalTranslation}px)`;
    });

    const tabContents = section.querySelectorAll(".tab_content");

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const targetTab = e.currentTarget.dataset.tab;

        tabBtns.forEach((btn) => {
          btn.classList.remove("active");
        });

        e.currentTarget.classList.add("active");

        tabContents.forEach((content) => {
          if (content.id === targetTab) {
            content.classList.add("active");
          } else {
            content.classList.remove("active");
          }
        });
      });
    });
  });
};

const showAwardImageFunc = () => {
  const awardComponentWrapper = document.querySelectorAll(".component_wrapper");

  awardComponentWrapper.forEach((component) => {
    const images = component.querySelectorAll(".award_img_wrapper img");
    const listItems = component.querySelectorAll(".award_list_wrapper > li"); // Select only direct children

    listItems.forEach((listItem) => {
      listItem.addEventListener("mouseenter", (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        const targetId = e.currentTarget.id;
        images.forEach((image) => {
          if (image.dataset.awardimageid === targetId) {
            image.classList.add("active");
          } else {
            image.classList.remove("active");
          }
        });
      });
    });
  });
};

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
  newsHiddenInput: ".newsevents_hidden_input",
  CategPPWFilterButtons: ".ppw_category_filter",
  TagsPPWFilterButtons: ".ppw_tag_btn_filter",
  paginationDots: "#ne_pagination_dots",
};

FilterButton.initializeAll(SELECTORS.newsEventsFilterButtons, (filterID) => {
  currentFilterID = filterID === "all" ? null : filterID;
  currentPage = 1;
  showNewsEvents(currentFilterID);
});

function showNewsEvents(filterID = null) {
  const newsPostContainer = document.querySelector(SELECTORS.allNewsPosts);

  if (newsPostContainer) {
    let newsPosts = Array.from(
      newsPostContainer.querySelectorAll(SELECTORS.cardsPosts)
    );

    /**
     * Iterates over each news post and applies a filter based on a given filter ID.
     * Each post has a hidden input field containing comma-separated tags.
     * If a filter ID is provided, the function checks if the filter ID matches any of the tags.
     * If a match is found, the post is made visible; otherwise, it is hidden.
     * If no filter ID is provided, all posts are made visible.
     *
     * @param {Array} newsPosts - An array of DOM elements representing news posts.
     * @param {string} filterID - The ID to filter the posts by. If null or undefined, all posts are made visible.
     */
    newsPosts.forEach((post) => {
      const newsHiddenInput = post.querySelector(".newsevents_hidden_input");

      let inputValArr = newsHiddenInput.value
        .split(",")
        .map((tag) => tag.trim());

      if (filterID) {
        let isMatch = inputValArr.some((inputVal) => filterID == inputVal);
        if (isMatch) {
          post.classList.remove("d-none");
          post.setAttribute("aria-hidden", "false");
        } else {
          post.classList.add("d-none");
          post.setAttribute("aria-hidden", "true");
        }
      } else {
        post.classList.remove("d-none");
        post.setAttribute("aria-hidden", "false");
      }
    });

    const visiblePosts = newsPosts.filter(
      (post) => !post.classList.contains("d-none")
    );

    const totalPages = Math.ceil(visiblePosts.length / postsPerPage);

    generatePaginationButtons(totalPages);
    updateNavigationButtons(totalPages);

    visiblePosts.forEach((post, index) => {
      if (
        index >= (currentPage - 1) * postsPerPage &&
        index < currentPage * postsPerPage
      ) {
        if (post.classList.contains("d-none")) {
          post.classList.remove("d-none");
          post.setAttribute("aria-hidden", "false");
        }
      } else {
        if (!post.classList.contains("d-none")) {
          post.classList.add("d-none");
          post.setAttribute("aria-hidden", "true");
        }
      }
    });
  }
}

function generatePaginationButtons(totalPages) {
  const paginationWrapper = document.querySelector(SELECTORS.paginationWrapper);

  paginationWrapper.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("pagination_btn");
    button.id = `page_${i}`;
    button.textContent = i;

    // Determine the start and end page for the current set of pagination buttons
    let startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
    let endPage = startPage + 4;

    // Add the d-none class to the button if it's not within the current set of pagination buttons
    if (i < startPage || i > endPage) {
      button.classList.add("d-none");
    }

    // Add the active class to the current page button
    if (i === currentPage) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      currentPage = i;
      showNewsEvents(currentFilterID);
    });

    paginationWrapper.appendChild(button);
  }
}

function updateNavigationButtons(totalPages) {
  const buttons = {
    prev: document.querySelector(SELECTORS.prevBtn),
    first: document.querySelector(SELECTORS.firstBtn),
    next: document.querySelector(SELECTORS.nextBtn),
    last: document.querySelector(SELECTORS.lastBtn),
    dots: document.querySelector(SELECTORS.paginationDots),
  };

  const toggleClass = (element, className, condition) => {
    element.classList.toggle(className, !condition);
  };

  // Show the "Previous" and "First" buttons if the current page is not the first page
  toggleClass(buttons.prev, "d-none", currentPage > 1);
  toggleClass(buttons.first, "d-none", currentPage >= 6);

  if (currentPage >= 6) {
    buttons.first.textContent = "1";
  }

  // Show the "Next" and "Last" buttons if the current page is not the last page
  toggleClass(buttons.next, "d-none", currentPage < totalPages);
  toggleClass(buttons.last, "d-none", currentPage < totalPages);

  if (totalPages > 5) {
    buttons.last.textContent = totalPages;
    buttons.dots.classList.remove("d-none");
  } else {
    buttons.dots.classList.add("d-none");
  }

  if (currentPage >= totalPages) {
    buttons.dots.classList.add("d-none");
  }
}

// Add event listeners to the navigation buttons
document.getElementById("prev_post_btn")?.addEventListener("click", () => {
  currentPage--;
  showNewsEvents(currentFilterID);
});

document.getElementById("first_post_btn")?.addEventListener("click", () => {
  currentPage = 1;
  showNewsEvents(currentFilterID);
});

document.getElementById("next_post_btn")?.addEventListener("click", () => {
  currentPage++;
  showNewsEvents(currentFilterID);
});

document.getElementById("last_post_btn")?.addEventListener("click", () => {
  currentPage = Math.ceil(
    document.querySelectorAll(SELECTORS.cardsPosts).length / postsPerPage
  );
  showNewsEvents(currentFilterID);
});

// =======================================
//  PPW JS CODE
// =======================================
const ppwArticlesPost = Array.from(
  document.querySelectorAll(".insights_post_title_wrapper")
);
const articlePostContainers = document.querySelectorAll(".articles_wrapper");

FilterButton.initializeAll(SELECTORS.CategPPWFilterButtons, (filterID) => {
  filterByCategoryOrTag(filterID === "all" ? null : filterID, "category");
});

FilterButton.initializeAll(SELECTORS.TagsPPWFilterButtons, (filterID) => {
  filterByCategoryOrTag(filterID === "all" ? null : filterID, "tag");
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
    const postCategory = post.dataset.category;
    const postTags = post.dataset.tags ? post.dataset.tags.split(",") : [];
    const postYear = post.dataset.year;

    const shouldAppend =
      type === "category"
        ? !filterName || postCategory === filterName
        : !filterName || postTags.some((tag) => tag.trim() === filterName);

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
// =======================================
//  INSIGHTS FILTER JS CODE
// =======================================
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

// Add event listener to the button
insightFilterButtons?.addEventListener("click", toggleFilter);

// =======================================
//  NEWSLETTERS PAGE JS CODE
// =======================================

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
  const readTimeElement = document.getElementById("read_time_est");

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

  const toggleDialog = (dialog, button) => {
    const handleClickOutside = (event) => {
      if (!dialog.contains(event.target) && !button.contains(event.target)) {
        dialog.classList.remove("open");
        button.setAttribute("data-dialog", "close");
        button.classList.remove("open");
        document.removeEventListener("click", handleClickOutside);
      }
    };

    dialog.classList.toggle("open");
    if (dialog.classList.contains("open")) {
      button.setAttribute("data-dialog", "open");
      button.classList.add("open");
      document.addEventListener("click", handleClickOutside);
    } else {
      button.setAttribute("data-dialog", "close");
      button.classList.remove("open");
      document.removeEventListener("click", handleClickOutside);
    }
  };

  const openDownloadOptions = document.getElementById("open_dl_options");
  const downloadDialog = document.getElementById("nlDowloadOptions");
  const downloadPDF = document.getElementById("dl_pdf");
  const openWordUrl = document.getElementById("dl_word");
  const nlShareButton = document.getElementById("nl_sharebtn");
  const shareDialog = document.getElementById("nlShareOptions");

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
    shareDialog.classList.remove("open");
  };

  document.querySelectorAll("#nlShareOptions button").forEach((button) => {
    const action = shareActions[button.textContent.trim()];
    if (action)
      button.addEventListener("click", () => handleShareAction(action));
  });

  nlShareButton?.addEventListener("click", () =>
    toggleDialog(shareDialog, nlShareButton)
  );
}

// temporary code, removing after.
function getPostTitle(category, startYear, endYear) {
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

        // console.table(posts);
        const filteredPosts = posts.filter((post) => {
          const postYear = new Date(
            post.post_date.split("-").reverse().join("-")
          ).getFullYear();
          const postCategories = sanitizeHTML(post.categories)
            .toLowerCase()
            .split(", ");
          return (
            postYear >= startYear &&
            postYear <= endYear &&
            postCategories.includes(category)
          );
        });

        const postTitles = filteredPosts.map((post) => post.title);

        displayTitles(postTitles);
      };

      getAllRequest.onerror = function () {
        console.log("Error reading posts from IndexedDB.");
      };
    })
    .catch((error) => {
      console.log("Error opening IndexedDB:", error);
    })
    .finally(() => {
      console.log("Done");
    });
}

function decodeHtmlEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}
function displayTitles(titles) {
  const decodedTitles = titles.map(decodeHtmlEntities);
  exportToTxt(decodedTitles);
}

function exportToTxt(titles) {
  const blob = new Blob([titles.join("\n")], {
    type: "text/plain;charset=utf-8",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "post_titles.txt";
  link.click();
}

const getPostTitlesButton = document?.getElementById("get_post_titles");

getPostTitlesButton?.addEventListener("click", () =>
  getPostTitle("hong-kong-law", 2023, 2024)
);
