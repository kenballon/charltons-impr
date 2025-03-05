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
    getNewsletterPosts();
    initNewsletterPage();
    getAwardPosts();

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
  searchMatchesWrapper?.appendChild(loadingIndicator);

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
  awardsFilterButton: ".awards_btn_filter",
  newsHiddenInput: ".newsevents_hidden_input",
  CategPPWFilterButtons: ".ppw_category_filter",
  NewslettersFilterButtons: ".newsletter_category_filter",
  TagsPPWFilterButtons: ".ppw_tag_btn_filter",
  paginationdots_first: "#ne_pagination_dots_first",
  paginationdots_last: "#ne_pagination_dots",
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
    dots_first: document.querySelector(SELECTORS.paginationdots_first),
    dots_last: document.querySelector(SELECTORS.paginationdots_last),
  };

  const toggleClass = (element, className, condition) => {
    element.classList.toggle(className, !condition);
  };

  // Show the "Previous" and "First" buttons if the current page is not the first page
  toggleClass(buttons.prev, "d-none", currentPage > 1);
  toggleClass(buttons.first, "d-none", currentPage >= 6);

  if (currentPage >= 6) {
    buttons.first.textContent = "1";
    buttons.dots_first.classList.remove("d-none");
  } else if (currentPage < 6) {
    buttons.dots_first.classList.add("d-none");
    buttons.first.classList.add("d-none");
  }

  // Show the "Next" and "Last" buttons if the current page is not the last page
  toggleClass(buttons.next, "d-none", currentPage < totalPages);
  toggleClass(buttons.last, "d-none", currentPage < totalPages);

  if (totalPages > 5) {
    buttons.last.textContent = totalPages;
    buttons.dots_last.classList.remove("d-none");
  } else {
    buttons.dots_last.classList.add("d-none");
    buttons.last.classList.add("d-none");
  }

  if (currentPage >= totalPages) {
    buttons.dots_last.classList.add("d-none");
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
//  NEWSLETTERS PAGE JS CODE
// =======================================
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

  const openDownloadOptions = document.getElementById("open_dl_options");
  const downloadDialog = document.getElementById("nlDowloadOptions");
  const downloadPDF = document.getElementById("dl_pdf");
  const openWordUrl = document.getElementById("dl_word");

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
 * Creates a card UI element for a given post.
 *
 * @param {Object} post - The post object containing data for the card.
 * @param {string} [type="award"] - The type of card to create ("award" or "newsletter").
 * @param {boolean} [isInitial=false] - Flag indicating if the card is part of the initial load.
 * @returns {HTMLElement} The created article card element.
 *
 * This function generates an article card element based on the provided post data.
 * It supports two types of cards: "award" and "newsletter". The card includes an image,
 * title, and date, and is linked to the post URL. The function also handles lazy loading
 * for images that are not part of the initial load.
 */
function createCardUI(post, type = "award", isInitial = false) {
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

  function createImageElement(post, className, width, height, isInitial) {
    const img = document.createElement("img");    
    img.setAttribute("decoding", "async");
    img.width = width;
    img.height = height;
    img.className = className;

    const defaultImage = post.featured_image;
    img.src = defaultImage;
    img.srcset = `
        ${post.featured_image_small || defaultImage} 300w,
        ${post.featured_image_medium || defaultImage} 768w,
        ${post.featured_image_large || defaultImage} 1024w
    `;

    img.sizes = "(max-width: 300px) 300px, (max-width: 768px) 768px, 1024px";
    img.alt = decodeHTMLEntities(post.title);
   

    if (!isInitial) {
      img.loading = "lazy";
    }

    return img;
  }

  function createDateElement(post) {
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
    return time;
  }

  function createTitleElement(post) {
    const title = document.createElement("h2");
    title.className = "post-title";
    title.title = decodeHTMLEntities(post.title);
    title.textContent = decodeHTMLEntities(post.title);
    return title;
  }

  if (type === "newsletter") {
    articleCard.setAttribute("data-nl_date", post.post_date);
    articleCard.setAttribute("data-category", post.category_names);

    const postThumbnail = document.createElement("div");
    postThumbnail.className = "post-thumbnail";

    const img = createImageElement(post, "", 286, 286, isInitial);
    const time = createDateElement(post);
    const title = createTitleElement(post);

    postThumbnail.appendChild(img);
    postThumbnail.appendChild(time);
    postThumbnail.appendChild(title);
    link.appendChild(postThumbnail);
  } else {
    const img = createImageElement(
      post,
      "awards_card_img",
      300,
      300,
      isInitial
    );

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

  const sortedAwardPosts = sortPostsByDate(awardPosts);

  const awardsContainer = document?.getElementById("all_awards_wrapper");
  const loadMoreContainer = document?.getElementById("load_more_container");
  // Load only the first 16 posts initially
  const initialPosts = sortedAwardPosts.slice(0, maxInitialPosts);
  initialPosts.forEach((post) => {
    const article = createCardUI(post, "award", true);
    awardsContainer?.appendChild(article);
  });

  currentPostIndex = maxInitialPosts;

  // Add a "Load More" button if there are more than 16 posts
  if (sortedAwardPosts.length > maxInitialPosts) {
    addLoadMoreButton(
      loadMoreContainer,
      awardsContainer,
      sortedAwardPosts,
      currentPostIndex,
      maxInitialPosts,
      createCardUI
    );
  }
}

async function showFilteredAwards(filterID) {
  const dbName = "PostsDatabase";
  const storeName = "posts";
  const tagValue = "awards";
  const maxInitialPosts = 16;
  let currentPostIndex = 0;

  const awardPosts = await fetchPostsFromDB(dbName, storeName, (post) => {
    const postTags = post.tags.toLowerCase().split(", ");
    return postTags.includes(tagValue);
  });

  const sortedAwardPosts = sortPostsByDate(awardPosts);

  const awardsContainer = document?.getElementById("all_awards_wrapper");
  const loadMoreContainer = document?.getElementById("load_more_container");
  loadMoreContainer.innerHTML = "";
  awardsContainer.innerHTML = ""; // Clear existing posts

  const filteredPosts = sortedAwardPosts.filter((post) => {
    const postTags = post.tags.toLowerCase().split(", ");
    return !filterID || postTags.includes(filterID);
  });

  // Load only the first 16 posts initially
  const initialPosts = filteredPosts.slice(0, maxInitialPosts);
  initialPosts.forEach((post) => {
    const article = createCardUI(post, "award", true);
    awardsContainer?.appendChild(article);
  });

  currentPostIndex = maxInitialPosts;

  // Add a "Load More" button if there are more than 16 posts
  if (filteredPosts.length > maxInitialPosts) {
    addLoadMoreButton(
      loadMoreContainer,
      awardsContainer,
      filteredPosts,
      currentPostIndex,
      maxInitialPosts,
      createCardUI
    );
  }
}

async function showFilteredAwardsByYear(filterID) {
  const dbName = "PostsDatabase";
  const storeName = "posts";
  const tagValue = "awards";
  const maxInitialPosts = 16;
  let currentPostIndex = 0;

  const awardPosts = await fetchPostsFromDB(dbName, storeName, (post) => {
    const postTags = post.tags.toLowerCase().split(", ");
    return postTags.includes(tagValue);
  });

  const sortedAwardPosts = sortPostsByDate(awardPosts);

  const awardsContainer = document?.getElementById("all_awards_wrapper");
  const loadMoreContainer = document?.getElementById("load_more_container");
  loadMoreContainer.innerHTML = "";
  awardsContainer.innerHTML = ""; // Clear existing posts

  const filteredPosts = sortedAwardPosts.filter((post) => {
    const postYear = parseInt(post.post_date.split("-")[2], 10);
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
  });

  // Load only the first 16 posts initially
  const initialPosts = filteredPosts.slice(0, maxInitialPosts);
  initialPosts.forEach((post) => {
    const article = createCardUI(post, "award", true);
    awardsContainer?.appendChild(article);
  });

  currentPostIndex = maxInitialPosts;

  // Add a "Load More" button if there are more than 16 posts
  if (filteredPosts.length > maxInitialPosts) {
    addLoadMoreButton(
      loadMoreContainer,
      awardsContainer,
      filteredPosts,
      currentPostIndex,
      maxInitialPosts,
      createCardUI
    );
  }
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

async function getNewsletterPosts(category = "hong-kong-law") {
  const dbName = "PostsDatabase";
  const storeName = "posts";
  const maxInitialPosts = 16;
  let currentPostIndex = 0;

  const newsletterPosts = await fetchPostsFromDB(dbName, storeName, (post) => {
    const categories = post.categories.toLowerCase().split(", ");
    return categories.includes(category);
  });

  const sortedNewsletterPosts = sortPostsByDate(newsletterPosts);

  const newsletterContainer = document?.getElementById("newsletters_post");
  const loadMoreContainer = document?.getElementById("btn_load_more_wrapper");

  const initialPosts = sortedNewsletterPosts.slice(0, maxInitialPosts);
  initialPosts.forEach((post) => {
    const article = createCardUI(post, "newsletter", true);
    newsletterContainer?.appendChild(article);
  });

  currentPostIndex = maxInitialPosts;

  if (sortedNewsletterPosts.length > maxInitialPosts) {
    addLoadMoreButton(
      loadMoreContainer,
      newsletterContainer,
      sortedNewsletterPosts,
      currentPostIndex,
      maxInitialPosts,
      createCardUI,
      "newsletter"
    );
  }
}

FilterButton.initializeAll(SELECTORS.NewslettersFilterButtons, (filterID) => {
  currentFilterID = filterID === "all" ? null : filterID;
  showFilteredNewsletters(currentFilterID);
});

async function showFilteredNewsletters(filterCategoryID) {
  const dbName = "PostsDatabase";
  const storeName = "posts";
  const maxInitialPosts = 16;
  let currentPostIndex = 0;

  const newsletterPosts = await fetchPostsFromDB(dbName, storeName, (post) => {
    const categories = post.categories.toLowerCase().split(", ");
    return categories.includes(filterCategoryID);
  });

  const sortedNewslettersPosts = sortPostsByDate(newsletterPosts);

  const newsletterContainer = document?.getElementById("newsletters_post");
  const loadMoreContainer = document?.getElementById("btn_load_more_wrapper");

  loadMoreContainer.innerHTML = "";
  newsletterContainer.innerHTML = "";

  const filteredPosts = sortedNewslettersPosts.filter((post) => {
    const categories = post.categories.toLowerCase().split(", ");
    return !filterCategoryID || categories.includes(filterCategoryID);
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

  console.log(sortedNewslettersPosts.length);

  const newsletterContainer = document?.getElementById("newsletters_post");
  const loadMoreContainer = document?.getElementById("btn_load_more_wrapper");

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
