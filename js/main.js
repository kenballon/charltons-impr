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

document.addEventListener("DOMContentLoaded", () => {
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
});

function customSearch() {
  let searchTimer;
  const searchInput = document.getElementById("search-input");
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

function revealSearch() {
  const header = document.querySelector("header");
  const searchFormButton = document.getElementById("showsearchinput");
  const searchInput = document.getElementById("search-input");
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

// =======================================
//  Awards Page JS
// =======================================
document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") {
    tabFunc();
    showAwardImageFunc();
    showNewsEvents();

    const buttonAllActive = document.getElementById("all");
    currentUrl.startsWith(origin + "/news")
      ? buttonAllActive?.classList.add("active")
      : "";
  }
});

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
    const listItems = component.querySelectorAll(".award_list_wrapper li");

    listItems.forEach((listItem) => {
      listItem.addEventListener("mouseenter", (e) => {
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
  paginationWrapper: ".news_pagination_btns_wrapper",
  prevBtn: "#prev_post_btn",
  nextBtn: "#next_post_btn",
  firstBtn: "#first_post_btn",
  lastBtn: "#last_post_btn",
  newsEventsFilterButtons: ".news_btn_tag_filter",
  newsHiddenInput: ".newsevents_hidden_input",
  CategPPWFilterButtons: ".ppw_category_filter",
  TagsPPWFilterButtons: ".ppw_tag_btn_filter",
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
  const prevButton = document.querySelector(SELECTORS.prevBtn);
  const firstButton = document.querySelector(SELECTORS.firstBtn);
  const nextButton = document.querySelector(SELECTORS.nextBtn);
  const lastButton = document.querySelector(SELECTORS.lastBtn);

  // Show the "Previous" and "First" buttons if the current page is not the first page
  if (currentPage > 1) {
    if (
      prevButton.classList.contains("d-none") &&
      firstButton.classList.contains("d-none")
    ) {
      prevButton.classList.remove("d-none");
      firstButton.classList.remove("d-none");
    }
  } else {
    prevButton.classList.add("d-none");
    firstButton.classList.add("d-none");
  }

  // Show the "Next" and "Last" buttons if the current page is not the last page
  if (currentPage < totalPages) {
    nextButton.classList.remove("d-none");
    lastButton.classList.remove("d-none");
  } else {
    nextButton.classList.add("d-none");
    lastButton.classList.add("d-none");
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
//  TEST ONLY JS CODE
// =======================================

// function handleFilterRedirection(currentUrl, origin) {
//   console.log(origin);

//   // Check if the URL matches the specific page
//   if (currentUrl.startsWith(origin + "/information-insights/test-only")) {
//     // Check if the URL contains an extra slash before the query parameters
//     if (currentUrl.includes("/?filter=")) {
//       // Remove the extra slash
//       currentUrl = currentUrl.replace("/?filter=", "?filter=");
//       // Update the browser's URL without reloading the page
//       window.history.replaceState({}, document.title, currentUrl);
//     }

//     // Get the query parameter from the URL
//     const urlParams = new URLSearchParams(window.location.search);
//     const filter = urlParams.get("filter");

//     // Check if the filter parameter exists and simulate a click event on the corresponding button
//     if (filter) {
//       const filterBtns = document.querySelectorAll(
//         SELECTORS.CategPPWFilterButtons
//       );

//       filterBtns.forEach((btn) => {
//         if (btn.id === filter) {
//           console.log(filter);
//           btn.click();
//         } else if (btn.classList.contains("active")) {
//           btn.classList.remove("active");
//         }
//       });
//     }
//   }
// }
