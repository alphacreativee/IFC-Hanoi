export function customDropdown() {
  const dropdowns = document.querySelectorAll(
    ".dropdown-custom, .dropdown-custom-select"
  );
  if (!dropdowns.length) return;
  dropdowns.forEach((dropdown) => {
    const btnDropdown = dropdown.querySelector(".dropdown-custom-btn");
    const dropdownMenu = dropdown.querySelector(".dropdown-custom-menu");
    const dropdownItems = dropdown.querySelectorAll(".dropdown-custom-item");
    const valueSelect = dropdown.querySelector(".value-select");
    const displayText = dropdown.querySelector(".dropdown-custom-text");

    const isSelectType = dropdown.classList.contains("dropdown-custom-select");

    btnDropdown.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllDropdowns(dropdown);
      dropdownMenu.classList.toggle("dropdown--active");
      btnDropdown.classList.toggle("--active");
    });

    document.addEventListener("click", function () {
      closeAllDropdowns();
    });

    dropdownItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();

        if (isSelectType) {
          const optionText = item.textContent;
          displayText.textContent = optionText;
          dropdown.classList.add("selected");
        } else {
          const currentImgEl = valueSelect.querySelector("img");
          const currentImg = currentImgEl ? currentImgEl.src : "";
          const currentText = valueSelect.querySelector("span").textContent;
          const clickedHtml = item.innerHTML;

          valueSelect.innerHTML = clickedHtml;

          const isSelectTime = currentText.trim() === "Time";

          if (!isSelectTime) {
            if (currentImg) {
              item.innerHTML = `<span>${currentText}</span><img src="${currentImg}" alt="" />`;
            } else {
              item.innerHTML = `<span>${currentText}</span>`;
            }
          }
        }

        closeAllDropdowns();
      });
    });

    window.addEventListener("scroll", function () {
      if (dropdownMenu.closest(".header-lang")) {
        dropdownMenu.classList.remove("dropdown--active");
        btnDropdown.classList.remove("--active");
      }
    });
  });

  function closeAllDropdowns(exception) {
    dropdowns.forEach((dropdown) => {
      const menu = dropdown.querySelector(".dropdown-custom-menu");
      const btn = dropdown.querySelector(".dropdown-custom-btn");

      if (!exception || dropdown !== exception) {
        menu.classList.remove("dropdown--active");
        btn.classList.remove("--active");
      }
    });
  }
}
export function headerScroll() {
  const header = document.getElementById("header");
  if (!header) return null;

  const isMobile = window.innerWidth <= 991;
  // const threshold = isMobile ? 100 : window.innerHeight;

  const banner = document.querySelector(".banner");

  const threshold = isMobile
    ? 100
    : banner?.getBoundingClientRect().height || window.innerHeight || 100;

  const trigger = ScrollTrigger.create({
    start: "top top",
    end: 9999,
    onUpdate: (self) => {
      const currentScroll = self.scroll();

      if (currentScroll > threshold) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  });

  return trigger;
}

/////// thêm class select-tab vào thì vẫn filter theo đúng type đó, không show hết item.
export function createFilterTab() {
  document.querySelectorAll(".filter-section").forEach((section) => {
    let result;

    const targetSelector = section.dataset.target;
    if (targetSelector) {
      result = document.querySelector(targetSelector);
    } else {
      result = section.querySelector(".filter-section-result");
      if (!result) {
        result = section.nextElementSibling;
        if (!result?.classList.contains("filter-section-result")) return;
      }
    }

    if (!result) return;
    //check select tab
    const isSelectTab = section.classList.contains("select-tab");
    const buttons = section.querySelectorAll(".filter-button[data-type]");

    const activeBtn = section.querySelector(".filter-button.active");
    if (activeBtn) {
      const activeType = activeBtn.dataset.type;
      if (activeType !== "all") {
        result.querySelectorAll(".filter-item").forEach((item) => {
          item.style.display = item.classList.contains(activeType)
            ? ""
            : "none";
        });
      }
    }

    buttons.forEach((btn) => {
      btn.addEventListener("click", function () {
        section
          .querySelectorAll(".filter-button")
          .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const type = this.dataset.type;
        const items = result.querySelectorAll(".filter-item");

        gsap
          .timeline()
          .to(result, { autoAlpha: 0, duration: 0.3 })
          .call(() => {
            items.forEach((item) => {
              // Nếu là select-tab thì không có trường hợp "all" → luôn filter theo type
              if (!isSelectTab && type === "all") {
                item.style.display = "";
              } else {
                item.style.display = item.classList.contains(type)
                  ? ""
                  : "none";
              }
            });
          })
          .to(result, { autoAlpha: 1, duration: 0.3 });
      });
    });
  });
}

export function getDateLightPick() {
  var picker = new Lightpick({
    field: document.getElementById("datepicker"),
    minDate: new Date(),
    singleDate: false,
    numberOfMonths: 2
    // lang: "en-US",
  });
}
export function staggerText() {
  gsap.registerPlugin(SplitText);

  document.querySelectorAll("[staggertext]").forEach((el) => {
    if (window.innerWidth <= 767 && el.closest(".breadcrumb")) return;

    const split = new SplitText(el, {
      type: "words, chars",
      wordsClass: "gsap_split_word",
      charsClass: "gsap_split_letter"
    });

    split.chars.forEach((letterEl) => {
      const isSpace = letterEl.textContent.trim() === "";

      const mask = document.createElement("span");
      mask.className = "letter-mask" + (isSpace ? " space" : "");

      const col = document.createElement("span");
      col.className = "letter-col";

      letterEl.parentNode.insertBefore(mask, letterEl);
      col.appendChild(letterEl);
      const clone = document.createElement("span");
      clone.className = "gsap_split_letter";
      clone.textContent = letterEl.textContent;
      col.appendChild(clone);

      mask.appendChild(col);
    });

    const cols = el.querySelectorAll(".letter-col");

    gsap.set(cols, { yPercent: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(cols, {
      yPercent: -50,
      duration: 0.5,
      ease: "power3.out",
      stagger: {
        each: 0.03,
        from: "start"
      }
    });

    el.addEventListener("mouseenter", () => {
      tl.timeScale(1).play();
    });
    el.addEventListener("mouseleave", () => {
      tl.timeScale(1.5).reverse();
    });
  });
}
export function loadingAnimation() {
  if (!document.querySelector("#loading")) return;
  const tl = gsap.timeline();
  tl.to(".loading-col-overlay", {
    clipPath: "inset(0 0 0 100%)",
    opacity: 0,
    duration: 0.75,
    ease: "none"
  });
  tl.to(
    "#loading",

    {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 1,
      ease: "power2.inOut"
    }
  );

  return tl;
}
export function imageSlider() {
  const sliders = document.querySelectorAll(".image-slider");
  if (!sliders.length) return;

  sliders.forEach((sliderEl) => {
    new Swiper(sliderEl, {
      loop: true,
      speed: 2000,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      },
      pagination: {
        el: sliderEl.querySelector(".swiper-pagination")
      },
      navigation: {
        nextEl: sliderEl.querySelector(".swiper-button-next"),
        prevEl: sliderEl.querySelector(".swiper-button-prev")
      }
    });
  });
}
export function bannerSlider() {
  const sliders = document.querySelectorAll(".banner .image-slider");
  if (!sliders.length) return;

  const imageDelay = 3000;

  sliders.forEach((sliderEl) => {
    const slides = sliderEl.querySelectorAll(".swiper-slide");
    const hasMultipleSlides = slides.length > 1;

    slides.forEach((slide) => {
      const videoTime =
        slide.dataset.videoTime ||
        slide.dataset.slideVideo ||
        slide.getAttribute("slide-video");
      const delay = videoTime ? Number(videoTime) * 1000 : imageDelay;

      slide.dataset.swiperAutoplay =
        Number.isFinite(delay) && delay > 0 ? delay : imageDelay;
    });

    new Swiper(sliderEl, {
      loop: hasMultipleSlides,
      speed: 1000,
      autoplay: hasMultipleSlides
        ? {
            delay: imageDelay,
            disableOnInteraction: false
          }
        : false,
      pagination: {
        el: sliderEl.querySelector(".swiper-pagination")
      },
      navigation: {
        nextEl: sliderEl.querySelector(".swiper-button-next"),
        prevEl: sliderEl.querySelector(".swiper-button-prev")
      }
    });
  });
}
export function animationTextLine() {
  gsap.registerPlugin(SplitText, ScrollTrigger);

  document.fonts.ready.then(() => {
    document.querySelectorAll("[el-txt-line]").forEach((el) => {
      if (el.dataset.scriptInitialized) return;
      el.dataset.scriptInitialized = "true";

      let splitTitle;

      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit: (self) => {
          splitTitle = self;

          return gsap.fromTo(
            self.lines,
            { y: "100%" },
            {
              y: "0%",
              duration: 0.8,
              ease: "power3.inOut",
              stagger: 0.05,
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                end: "bottom 85%",
                toggleActions: "play none none none"
                // markers: true,
              }
            }
          );
        }
      });
    });
  });
}
export function animationTextLineAuto() {
  gsap.registerPlugin(SplitText);

  document.fonts.ready.then(() => {
    document.querySelectorAll("[el-txt-line-auto]").forEach((el) => {
      if (el.dataset.scriptInitialized) return;
      el.dataset.scriptInitialized = "true";

      let splitTitle;

      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit: (self) => {
          splitTitle = self;

          // Reveal ngay trước khi animate, tránh flash text gốc
          gsap.set(el, { visibility: "visible" });

          return gsap.fromTo(
            self.lines,
            { y: "100%" },
            {
              y: "0%",
              duration: 0.8,
              ease: "power3.inOut",
              stagger: 0.05
            }
          );
        }
      });
    });
  });
}
export function animationTitle() {
  gsap.registerPlugin(SplitText, ScrollTrigger);

  document.fonts.ready.then(() => {
    document.querySelectorAll("[el-title]").forEach((title) => {
      if (title.dataset.scriptInitialized) return;
      title.dataset.scriptInitialized = "true";

      SplitText.create(title, {
        type: "chars",
        charsClass: "char",
        autoSplit: true,
        onSplit: (self) => {
          return gsap.fromTo(
            self.chars,
            {
              transformOrigin: "50% 100%",
              scaleY: 0,
              opacity: 0
            },
            {
              ease: "power3.out",
              opacity: 1,
              scaleY: 1,
              duration: 0.5,
              stagger: 0.05,
              scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none none"
                // markers: true,
              }
            }
          );
        }
      });
    });
  });
}
export function animationFade() {
  gsap.registerPlugin(ScrollTrigger);

  // ----- Fade đơn lẻ -----
  document.querySelectorAll("[el-fade]").forEach((el) => {
    if (el.dataset.scriptInitialized) return;
    el.dataset.scriptInitialized = "true";

    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "bottom 85%",
          toggleActions: "play none none none"
          // markers: true,
        }
      }
    );
  });
  // ----- Fade theo danh sách (stagger) -----
  document.querySelectorAll("[el-fade-list]").forEach((listEl) => {
    if (listEl.dataset.scriptInitialized) return;
    listEl.dataset.scriptInitialized = "true";

    const items = listEl.children;
    if (!items.length) return;

    const isMobile = window.matchMedia("(max-width: 991px)").matches;

    if (isMobile) {
      // Mobile: mỗi item tự có ScrollTrigger riêng
      Array.from(items).forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              end: "bottom 90%",
              toggleActions: "play none none none"
              // markers: true,
            }
          }
        );
      });
    } else {
      // Desktop: cả list stagger theo 1 trigger chung
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: listEl,
            start: "top 85%",
            end: "bottom 85%",
            toggleActions: "play none none none"
            // markers: true,
          }
        }
      );
    }
  });
}
export function imageParallax() {
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll("[parallax-image]").forEach((el) => {
    if (el.dataset.scriptInitialized) return;
    el.dataset.scriptInitialized = "true";

    const img = el.querySelector("img");
    if (!img) return;

    gsap.set(img, { willChange: "transform", force3D: true });

    const row =
      el.closest("[parallax-row]") || el.closest(".parallax-row") || el;

    let mm = gsap.matchMedia();

    const createParallax = () => {
      if (el._parallaxTween) {
        el._parallaxTween.scrollTrigger?.kill();
        el._parallaxTween.kill();
        el._parallaxTween = null;
      }

      mm.add(
        {
          isMobile: "(max-width: 990px)",
          isDesktop: "(min-width: 991px)"
        },
        (context) => {
          const { isMobile } = context.conditions;
          const percentParallax = isMobile ? 10 : 13;

          // Chỉ "to" - GSAP tự lấy giá trị hiện tại (đã set sẵn = CSS) làm điểm bắt đầu
          el._parallaxTween = gsap.to(img, {
            yPercent: percentParallax,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 70%",
              end: "bottom top",
              scrub: 1,
              invalidateOnRefresh: true
              // markers: true,
            }
          });
        }
      );
    };

    if (img.complete) {
      createParallax();
    } else {
      img.addEventListener("load", createParallax, { once: true });
    }
  });
}
export function animationBox() {
  gsap.registerPlugin(SplitText, ScrollTrigger);

  document.fonts.ready.then(() => {
    document.querySelectorAll("[box-row]").forEach((container) => {
      if (container.dataset.scriptInitialized) return;
      container.dataset.scriptInitialized = "true";

      const logoEl = container.querySelector("[box-logo]");
      const titleEl = container.querySelector("[box-title]");
      const descEl = container.querySelector("[box-desc]");
      const btnEl = container.querySelector("[box-btn]");
      const startPoint = container.dataset.start || "top 80%";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: startPoint,
          toggleActions: "play none none none"
          // markers: true,
        }
      });

      // ----- 0. Logo (fade) - chạy đầu tiên nếu có -----
      if (logoEl) {
        tl.fromTo(
          logoEl,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out"
          },
          0 // bắt đầu từ đầu timeline
        );
      }

      // ----- 1. Title (chars) -----
      if (titleEl) {
        SplitText.create(titleEl, {
          type: "words, chars",
          charsClass: "char",
          wordsClass: "word",
          autoSplit: true,
          onSplit: (self) => {
            tl.fromTo(
              self.chars,
              {
                transformOrigin: "50% 100%",
                scaleY: 0,
                opacity: 0
              },
              {
                ease: "power3.out",
                opacity: 1,
                scaleY: 1,
                duration: 0.5,
                stagger: 0.04
              },
              logoEl ? "<+0.15" : 0 // nếu có logo thì delay nhẹ sau logo
            );
          }
        });
      }

      // ----- 2. Description (lines, mask) -----
      if (descEl) {
        SplitText.create(descEl, {
          type: "lines",
          mask: "lines",
          linesClass: "line",
          autoSplit: true,
          onSplit: (self) => {
            tl.fromTo(
              self.lines,
              { y: "100%" },
              {
                y: "0%",
                duration: 0.7,
                ease: "power3.inOut",
                stagger: 0.06
              },
              "<+0.4"
            );
          }
        });
      }

      // ----- 3. Button -----
      if (btnEl) {
        tl.fromTo(
          btnEl,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out"
          },
          ">-0.15"
        );
      }
    });
  });
}
export function headerMobile() {
  console.log("phần trên");

  if (window.innerWidth > 992) return;

  console.log("phần giữa");

  const hamBtn = document.getElementById("ham-btn");
  const headerMenu = document.querySelector(".header-menu");
  const headerMain = document.getElementById("header");
  if (!hamBtn || !headerMenu) return;

  console.log("phần dưới");

  hamBtn.addEventListener("click", () => {
    hamBtn.classList.toggle("active");
    headerMenu.classList.toggle("show");
    headerMain.classList.toggle("change-color");
    document.body.classList.toggle("no-scroll");
  });
  const menuSub = document.querySelectorAll("li.menu-item-has-children > a");

  console.log(menuSub);

  menuSub.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      console.log("click");

      const subMenu = this.parentElement.querySelector(".sub-menu");
      const allSubMenus = Array.from(
        document.querySelectorAll("#header .sub-menu")
      ).filter((el) => el !== subMenu);

      allSubMenus.forEach((el) => {
        el.style.maxHeight = el.scrollHeight + "px";
        el.offsetHeight; // force reflow
        el.style.maxHeight = 0;
        el.classList.remove("open");
      });

      if (subMenu.classList.contains("open")) {
        subMenu.style.maxHeight = subMenu.scrollHeight + "px";
        subMenu.offsetHeight; // force reflow
        subMenu.style.maxHeight = 0;
        subMenu.classList.remove("open");
      } else {
        subMenu.classList.add("open");
        subMenu.style.maxHeight = subMenu.scrollHeight + "px";

        subMenu.addEventListener(
          "transitionend",
          function handler() {
            if (subMenu.classList.contains("open")) {
              subMenu.style.maxHeight = "none";
            }
            subMenu.removeEventListener("transitionend", handler);
          },
          { once: true }
        );
      }
    });
  });
}
// export function animationIntro() {
//   gsap.registerPlugin(SplitText, ScrollTrigger);

//   document.fonts.ready.then(() => {
//     document.querySelectorAll("[el-intro]").forEach((container) => {
//       if (container.dataset.scriptInitialized) return;
//       container.dataset.scriptInitialized = "true";

//       const titleEl = container.querySelector("[el-title-intro]");
//       const lineEl = container.querySelector("[el-txt-line-intro]");
//       const fadeEls = container.querySelectorAll("[el-fade-intro]");
//       const heightLine = container.querySelectorAll("[el-line-intro]");
//       const introBg = container.querySelector(".intro-bg");

//       const isMobile = window.innerWidth <= 768;

//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: container,
//           start: "top 85%",
//           toggleActions: "play none none none",
//           // markers: true,
//         },
//         onComplete: () => {
//           if (introBg) introBg.classList.add("active");
//         },
//       });

//       if (isMobile) {
//         tl.addLabel("titleStart", 0);
//         tl.addLabel("lineStart", 0.5);
//         tl.addLabel("descStart", 1.3);
//         tl.addLabel("fadeStart", 2.0);
//       } else {
//         tl.addLabel("lineStart", 0);
//         tl.addLabel("titleStart", 0.5);
//         tl.addLabel("descStart", 1.3);
//         tl.addLabel("fadeStart", 2.0);
//       }

//       // ----- Line -----
//       if (heightLine.length) {
//         tl.fromTo(
//           heightLine,
//           { scaleY: 0, rotate: 0, transformOrigin: "0% 0%" },
//           { scaleY: 1, duration: 0.5, ease: "power2.out" },
//           "lineStart",
//         );
//         tl.to(
//           heightLine,
//           {
//             rotate: 18.9,
//             transformOrigin: "50% 50%",
//             duration: 0.4,
//             ease: "power3.out",
//           },
//           "lineStart+=0.4",
//         );
//       } else {
//         console.warn("⚠️ el-line-intro không tìm thấy trong container này");
//       }

//       // ----- Title -----
//       if (titleEl) {
//         SplitText.create(titleEl, {
//           type: "words, chars",
//           charsClass: "char",
//           wordsClass: "word",
//           onSplit: (self) => {
//             tl.fromTo(
//               self.chars,
//               { transformOrigin: "50% 100%", scaleY: 0, opacity: 0 },
//               {
//                 ease: "power3.out",
//                 opacity: 1,
//                 scaleY: 1,
//                 duration: 0.5,
//                 stagger: 0.05,
//               },
//               "titleStart",
//             );
//           },
//         });
//       }

//       // ----- Txt line (description) -----
//       if (lineEl) {
//         SplitText.create(lineEl, {
//           type: "lines",
//           mask: "lines",
//           linesClass: "line",
//           autoSplit: true,
//           onSplit: (self) => {
//             tl.fromTo(
//               self.lines,
//               { y: "100%" },
//               { y: "0%", duration: 0.8, ease: "power3.inOut", stagger: 0.05 },
//               "descStart",
//             );
//           },
//         });
//       }

//       // ----- Fade -----
//       if (fadeEls.length) {
//         tl.fromTo(
//           fadeEls,
//           { opacity: 0, y: 20 },
//           { opacity: 1, y: 0, duration: 0.4, ease: "none" },
//           "fadeStart",
//         );
//       }
//     });
//   });
// }

export function animationIntro() {
  gsap.registerPlugin(ScrollTrigger);
  document.fonts.ready.then(() => {
    document.querySelectorAll("[el-intro]").forEach((container) => {
      if (container.dataset.scriptInitialized) return;
      container.dataset.scriptInitialized = "true";

      const heightLine = container.querySelectorAll("[el-line-intro]");
      const boxLeft = container.querySelector("[box-left]");
      const boxRight = container.querySelector("[box-right]");
      const introBg = container.querySelector(".intro-bg");
      const isMobile = window.innerWidth <= 768;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none none"
          // markers: true,
        }
      });

      if (isMobile) {
        tl.addLabel("titleStart", 0);
        tl.addLabel("lineStart", 0.5);
        tl.addLabel("descStart", 1.3);
        tl.addLabel("fadeStart", 2.0);
      } else {
        tl.addLabel("lineStart", 0);
        tl.addLabel("titleStart", 0.5);
        tl.addLabel("descStart", 1.3);
        tl.addLabel("fadeStart", 2.0);
      }

      // ----- Line: tween như bản gốc -----
      if (heightLine.length) {
        tl.fromTo(
          heightLine,
          { scaleY: 0, rotate: 0, transformOrigin: "0% 0%" },
          { scaleY: 1, duration: 0.5, ease: "power2.out" },
          "lineStart"
        );
        tl.to(
          heightLine,
          {
            rotate: 18.9,
            transformOrigin: "50% 50%",
            duration: 0.4,
            ease: "power3.out"
          },
          "lineStart+=0.4"
        );
      } else {
        console.warn("⚠️ el-line-intro không tìm thấy trong container này");
      }

      // ----- Box left/right: add active sớm hơn (ngay sau khi line xong) -----
      if (boxLeft) {
        tl.call(() => boxLeft.classList.add("active"), null, "lineStart+=0.8");
      }
      if (boxRight) {
        tl.call(() => boxRight.classList.add("active"), null, "lineStart+=0.8");
      }
      if (introBg) {
        tl.call(() => introBg.classList.add("active"), null, "lineStart+=0.8");
      }
    });
  });
}

export function leasingContactForm() {
  const $forms = $(".section-contact__form");
  if (!$forms.length) return;

  $forms.each(function () {
    const currentForm = $(this);
    if (currentForm.data("leasingFormInitialized")) return;
    currentForm.data("leasingFormInitialized", true);

    const submitBtn = currentForm.find('[type="submit"]');
    const note = currentForm.find(
      ".form-message, .form-note, .note, .section-contact__note"
    );

    const getFieldValue = ($formItem) => {
      const $field = $formItem.find("input, textarea, select").first();
      return $.trim($field.val() || "");
    };

    const validateForm = () => {
      let isValid = true;

      currentForm.find(".form-item.required").each(function () {
        const $formItem = $(this);
        const hasValue = getFieldValue($formItem).length > 0;

        $formItem.toggleClass("error", !hasValue);
        if (!hasValue) isValid = false;
      });

      return isValid;
    };

    currentForm.on(
      "input change",
      ".form-item.required input, .form-item.required textarea, .form-item.required select",
      function () {
        const $formItem = $(this).closest(".form-item");
        $formItem.toggleClass("error", !$.trim($(this).val() || ""));
      }
    );

    currentForm.on("submit", function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      const formData = new FormData(currentForm[0]);
      const emailRecepient = submitBtn.attr("email_recepient");

      formData.append("action", "leasing_form");
      if (emailRecepient) {
        formData.append("email_recepient", emailRecepient);
      }

      $.ajax({
        url:
          typeof ajaxUrl !== "undefined"
            ? ajaxUrl
            : currentForm.attr("action") || window.location.href,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        beforeSend() {
          submitBtn.addClass("aloading");
        },
        success(response) {
          if (response.success) {
            currentForm[0].reset();

            currentForm.find(".dropdown-custom-select").removeClass("selected");

            currentForm
              .find(".dropdown-custom-text span")
              .text("Select option");

            note.stop(true, true).fadeIn().delay(9000).fadeOut();

            submitBtn.prop("disabled", true);
          }
        },
        complete() {
          submitBtn.removeClass("aloading");
        }
      });
    });
  });
}
// export function revealClipImage() {
//   const sections = document.querySelectorAll(".clip-image-reveal");
//   if (!sections.length) return;

//   sections.forEach((section) => {
//     const imageItems = Array.from(
//       section.querySelectorAll(".design-image-item"),
//     );
//     const bgItems = Array.from(section.querySelectorAll(".design-bg-item"));

//     if (imageItems.length < 2 || bgItems.length < 2) {
//       return;
//     }

//     imageItems.forEach((item, i) => {
//       item.style.zIndex = imageItems.length - i;
//     });
//     bgItems.forEach((item, i) => {
//       item.style.zIndex = bgItems.length - i;
//     });

//     gsap.set(imageItems.slice(1), { clipPath: "inset(0 0 0 0)" });
//     gsap.set(bgItems.slice(1), { clipPath: "inset(0 0 0 0)" });

//     const steps = imageItems.length;
//     const scrollMultiplier = 1.5; // tăng số này để cuộn lâu hơn (1 = mặc định, 2 = gấp đôi...)

//     const tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: section,
//         start: "top top",
//         end: `+=${window.innerHeight * (steps - 1) * scrollMultiplier}`,
//         pin: true,
//         pinType: "transform",
//         scrub: 1,
//         anticipatePin: 1,
//         invalidateOnRefresh: true,
//         // markers: true,
//       },
//     });

//     for (let i = 1; i < steps; i++) {
//       tl.to(
//         imageItems[i - 1],
//         { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "none" },
//         i,
//       ).to(
//         bgItems[i - 1],
//         { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "none" },
//         i,
//       );
//     }
//   });
// }
export function revealClipImage() {
  const sections = document.querySelectorAll(".clip-image-reveal");
  if (!sections.length) return;

  sections.forEach((section) => {
    const imageItems = Array.from(
      section.querySelectorAll(".design-image-item")
    );
    const bgItems = Array.from(section.querySelectorAll(".design-bg-item"));

    if (imageItems.length < 2 || bgItems.length < 2) return;

    imageItems.forEach((item, i) => {
      item.style.zIndex = imageItems.length - i;
    });
    bgItems.forEach((item, i) => {
      item.style.zIndex = bgItems.length - i;
    });

    // item[0] hiện đủ; các item còn lại ẩn hoàn toàn bằng clip (không dùng opacity)
    gsap.set(imageItems.slice(1), { clipPath: "inset(100% 0 0 0)" });
    gsap.set(bgItems.slice(1), { clipPath: "inset(100% 0 0 0)" });

    const steps = imageItems.length;
    const scrollMultiplier = 1.5;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * (steps - 1) * scrollMultiplier}`,
        pin: true,
        pinType: "transform",
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    for (let i = 1; i < steps; i++) {
      tl.to(
        imageItems[i - 1],
        { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "none" },
        i
      )
        .to(
          imageItems[i],
          { clipPath: "inset(0% 0 0 0)", duration: 1, ease: "none" },
          i // chạy đúng cùng lúc, cùng tốc độ -> luôn khớp khít, không hở/chồng
        )
        .to(
          bgItems[i - 1],
          { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "none" },
          i
        )
        .to(
          bgItems[i],
          { clipPath: "inset(0% 0 0 0)", duration: 1, ease: "none" },
          i
        );
    }
  });
}

export function facilitiesSection() {
  const sections = document.querySelectorAll(".facilities");
  if (!sections.length) return;

  gsap.registerPlugin(ScrollTrigger);

  sections.forEach((section) => {
    const features = section.querySelectorAll("[data-facility-feature]");

    if (features.length) {
      gsap.fromTo(
        features,
        {
          autoAlpha: 0,
          x: 80
        },
        {
          autoAlpha: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.16,
          scrollTrigger: {
            trigger: section.querySelector(".facilities__visual") || section,
            start: "top 72%",
            once: true
          }
        }
      );
    }

    const sliderEl = section.querySelector(".facilities__slider");
    if (!sliderEl || sliderEl.dataset.facilitiesInitialized === "true") return;

    sliderEl.dataset.facilitiesInitialized = "true";

    new Swiper(sliderEl, {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      speed: 1000,
      grabCursor: true,
      navigation: {
        nextEl: section.querySelector(".facilities__nav--next"),
        prevEl: section.querySelector(".facilities__nav--prev")
      },
      breakpoints: {
        992: {
          slidesPerView: 2,
          spaceBetween: 16
        }
      }
    });
  });
}

// function này nữa build lại function thì bỏ function này
export function stackingPlanImageDrag() {
  const imageWraps = document.querySelectorAll(".stackingPlan__image");
  if (!imageWraps.length) return;

  imageWraps.forEach((wrap) => {
    if (wrap.dataset.dragInitialized === "true") return;

    wrap.dataset.dragInitialized = "true";

    const image = wrap.querySelector("img");
    if (image) {
      image.setAttribute("draggable", "false");
      image.addEventListener("dragstart", (event) => event.preventDefault());
    }

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    wrap.addEventListener("pointerdown", (event) => {
      if (wrap.scrollWidth <= wrap.clientWidth) return;

      isDown = true;
      startX = event.clientX;
      scrollLeft = wrap.scrollLeft;
      wrap.classList.add("is-dragging");
      wrap.setPointerCapture(event.pointerId);
    });

    wrap.addEventListener("pointermove", (event) => {
      if (!isDown) return;

      event.preventDefault();
      wrap.scrollLeft = scrollLeft - (event.clientX - startX);
    });

    const stopDrag = (event) => {
      if (!isDown) return;

      isDown = false;
      wrap.classList.remove("is-dragging");

      if (wrap.hasPointerCapture(event.pointerId)) {
        wrap.releasePointerCapture(event.pointerId);
      }
    };

    wrap.addEventListener("pointerup", stopDrag);
    wrap.addEventListener("pointercancel", stopDrag);
    wrap.addEventListener("pointerleave", stopDrag);
  });
}
