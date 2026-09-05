export function customDropdown() {
  const dropdowns = document.querySelectorAll(
    ".dropdown-custom, .dropdown-custom-select",
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
  const threshold = isMobile ? 100 : window.innerHeight;

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
    },
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
    numberOfMonths: 2,
    // lang: "en-US",
  });
}
export function staggerText() {
  gsap.registerPlugin(SplitText);

  document.querySelectorAll("[staggertext]").forEach((el) => {
    const split = new SplitText(el, {
      type: "words, chars",
      wordsClass: "gsap_split_word",
      charsClass: "gsap_split_letter",
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
        from: "start",
      },
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
    ease: "none",
  });
  tl.to(
    "#loading",

    {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 1,
      ease: "power2.inOut",
    },
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
        disableOnInteraction: false,
      },
      pagination: {
        el: sliderEl.querySelector(".swiper-pagination"),
      },
      navigation: {
        nextEl: sliderEl.querySelector(".swiper-button-next"),
        prevEl: sliderEl.querySelector(".swiper-button-prev"),
      },
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
            disableOnInteraction: false,
          }
        : false,
      pagination: {
        el: sliderEl.querySelector(".swiper-pagination"),
      },
      navigation: {
        nextEl: sliderEl.querySelector(".swiper-button-next"),
        prevEl: sliderEl.querySelector(".swiper-button-prev"),
      },
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
                toggleActions: "play none none none",
                // markers: true,
              },
            },
          );
        },
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
              opacity: 0,
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
                toggleActions: "play none none none",
                // markers: true,
              },
            },
          );
        },
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
          toggleActions: "play none none none",
          // markers: true,
        },
      },
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
              toggleActions: "play none none none",
              // markers: true,
            },
          },
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
            toggleActions: "play none none none",
            // markers: true,
          },
        },
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
    const isMobile = window.innerWidth < 991;

    const percentParallax = isMobile ? 10 : 13;
    const row =
      el.closest("[parallax-row]") || el.closest(".parallax-row") || el;

    // Hàm tạo animation
    const createParallax = () => {
      // Kill cái cũ nếu có (tránh bị double)
      if (el._parallaxTween) {
        el._parallaxTween.scrollTrigger?.kill();
        el._parallaxTween.kill();
      }

      el._parallaxTween = gsap.fromTo(
        img,
        { yPercent: -percentParallax },
        {
          yPercent: percentParallax,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            // markers: true, // bật lên để debug
          },
        },
      );
    };

    // Nếu ảnh đã load rồi thì chạy luôn
    if (img.complete) {
      createParallax();
    } else {
      // Chờ ảnh load xong mới tạo ScrollTrigger
      img.addEventListener("load", createParallax, { once: true });
    }
  });

  // Quan trọng: refresh lại tất cả ScrollTrigger sau khi trang load xong
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
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
          toggleActions: "play none none none",
          // markers: true,
        },
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
            ease: "power2.out",
          },
          0, // bắt đầu từ đầu timeline
        );
      }

      // ----- 1. Title (chars) -----
      if (titleEl) {
        SplitText.create(titleEl, {
          type: "chars",
          charsClass: "char",
          autoSplit: true,
          onSplit: (self) => {
            tl.fromTo(
              self.chars,
              {
                transformOrigin: "50% 100%",
                scaleY: 0,
                opacity: 0,
              },
              {
                ease: "power3.out",
                opacity: 1,
                scaleY: 1,
                duration: 0.5,
                stagger: 0.04,
              },
              logoEl ? "<+0.15" : 0, // nếu có logo thì delay nhẹ sau logo
            );
          },
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
                stagger: 0.06,
              },
              "<+0.4",
            );
          },
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
            ease: "power2.out",
          },
          ">-0.15",
        );
      }
    });
  });
}
export function headerMobile() {
  if (window.innerWidth > 992) return;

  const hamBtn = document.getElementById("ham-btn");
  const headerMenu = document.querySelector(".header-menu");
  const headerMain = document.getElementById("header");
  if (!hamBtn || !headerMenu) return;

  hamBtn.addEventListener("click", () => {
    hamBtn.classList.toggle("active");
    headerMenu.classList.toggle("show");
    headerMain.classList.toggle("change-color");
    document.body.classList.toggle("no-scroll");
  });
  const menuSub = document.querySelectorAll("li.menu-item-has-children > a");
  menuSub.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      console.log(this);

      const subMenu = this.parentElement.querySelector(".sub-menu");
      const allSubMenus = Array.from(
        document.querySelectorAll("#header .sub-menu"),
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
          { once: true },
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
          toggleActions: "play none none none",
          // markers: true,
        },
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
          "lineStart",
        );
        tl.to(
          heightLine,
          {
            rotate: 18.9,
            transformOrigin: "50% 50%",
            duration: 0.4,
            ease: "power3.out",
          },
          "lineStart+=0.4",
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
      ".form-message, .form-note, .note, .section-contact__note",
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
      },
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
        },
      });
    });
  });
}
