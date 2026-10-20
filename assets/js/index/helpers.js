// export function animationRetail() {
//   gsap.registerPlugin(SplitText, ScrollTrigger);
//   if (!document.querySelector(".slider-retail")) return;
//   document.querySelectorAll(".slider-retail").forEach((sliderEl) => {
//     if (sliderEl.dataset.scriptInitialized) return;
//     sliderEl.dataset.scriptInitialized = "true";

//     const container = sliderEl.closest(".retail-col");
//     const paginationRows = container.querySelectorAll(".slider-pagination-row");
//     const contentBox = container.querySelector(".slider-content");

//     let hasPlayedIntro = false; // chỉ chạy hiệu ứng scroll 1 lần

//     // ----- Init Swiper -----
//     const swiper = new Swiper(sliderEl, {
//       slidesPerView: 1,
//       speed: 800,
//       effect: "fade",
//       fadeEffect: { crossFade: true },
//       allowTouchMove: true,
//       on: {
//         slideChange: function () {
//           updatePagination(this.activeIndex);
//           // Chỉ animate nếu intro đã chạy rồi (tránh animate khi chưa scroll tới)
//           updateContent(this.activeIndex, hasPlayedIntro);
//         },
//       },
//     });

//     // ----- Click pagination -----
//     paginationRows.forEach((row, index) => {
//       row.addEventListener("click", () => {
//         swiper.slideTo(index);
//       });
//     });

//     // ----- Active class cho pagination -----
//     function updatePagination(activeIndex) {
//       paginationRows.forEach((row, i) => {
//         row.classList.toggle("active", i === activeIndex);
//       });
//     }

//     // ----- Update content -----
//     function updateContent(activeIndex, shouldAnimate = false) {
//       const activeSlide = swiper.slides[activeIndex];
//       const sourceContent = activeSlide.querySelector(".retail-content");

//       if (!sourceContent || !contentBox) return;

//       // Ẩn lại trước khi đổ content mới (tránh flash khi đổi slide)
//       contentBox.classList.remove("is-ready");

//       // Clear old content
//       contentBox.innerHTML = "";

//       // Clone title + description
//       const title = sourceContent.querySelector("h3")?.cloneNode(true);
//       const desc = sourceContent.querySelector(".description")?.cloneNode(true);

//       if (title) contentBox.appendChild(title);
//       if (desc) contentBox.appendChild(desc);

//       if (shouldAnimate) {
//         animateContent(contentBox);
//       }
//       // Nếu shouldAnimate = false: KHÔNG add is-ready ở đây.
//       // Giữ nguyên trạng thái ẩn (CSS mặc định), chờ ScrollTrigger
//       // hoặc lần đổi slide kế tiếp mới thực sự hiện + animate.
//     }

//     // ----- Animation title + description -----
//     function animateContent(box) {
//       const titleEl = box.querySelector("h3");
//       const descEl = box.querySelector(".description");

//       const tl = gsap.timeline({ paused: true });

//       let pending = (titleEl ? 1 : 0) + (descEl ? 1 : 0);
//       let started = false;

//       function tryStart() {
//         pending--;
//         if (pending === 0 && !started) {
//           started = true;
//           box.classList.add("is-ready");
//           tl.play(0);
//         }
//       }

//       // Title (chars)
//       if (titleEl) {
//         SplitText.create(titleEl, {
//           type: "chars",
//           charsClass: "char",
//           autoSplit: true,
//           onSplit: (self) => {
//             tl.fromTo(
//               self.chars,
//               {
//                 transformOrigin: "50% 100%",
//                 scaleY: 0,
//                 opacity: 0,
//               },
//               {
//                 ease: "power3.out",
//                 opacity: 1,
//                 scaleY: 1,
//                 duration: 0.45,
//                 stagger: 0.035,
//               },
//               0,
//             );
//             tryStart();
//           },
//         });
//       }

//       // Description (lines + mask)
//       if (descEl) {
//         SplitText.create(descEl, {
//           type: "lines",
//           mask: "lines",
//           linesClass: "line",
//           autoSplit: true,
//           onSplit: (self) => {
//             tl.fromTo(
//               self.lines,
//               { y: "110%" },
//               {
//                 y: "0%",
//                 duration: 0.65,
//                 ease: "power3.inOut",
//                 stagger: 0.05,
//               },
//               "<+0.25",
//             );
//             tryStart();
//           },
//         });
//       }

//       if (pending === 0) {
//         box.classList.add("is-ready");
//       }

//       // Fallback an toàn nếu SplitText load quá lâu / lỗi
//       setTimeout(() => {
//         if (!box.classList.contains("is-ready")) {
//           box.classList.add("is-ready");
//           tl.play(0);
//         }
//       }, 3000);
//     }

//     // ----- ScrollTrigger: hiệu ứng xuất hiện khi cuộn tới -----
//     ScrollTrigger.create({
//       trigger: container,
//       start: "top 50%",
//       once: true,
//       onEnter: () => {
//         if (!hasPlayedIntro) {
//           hasPlayedIntro = true;
//           updateContent(swiper.activeIndex, true); // animate lần đầu
//         }
//       },
//     });

//     // Init trạng thái ban đầu: chỉ đổ pagination + content, KHÔNG hiện, KHÔNG animate
//     updatePagination(0);
//     updateContent(0, false); // content nằm sẵn trong DOM nhưng vẫn ẩn (CSS)
//   });
// }
export function animationRetail() {
  gsap.registerPlugin(SplitText, ScrollTrigger);
  if (!document.querySelector(".slider-retail")) return;
  document.querySelectorAll(".slider-retail").forEach((sliderEl) => {
    if (sliderEl.dataset.scriptInitialized) return;
    sliderEl.dataset.scriptInitialized = "true";

    const container = sliderEl.closest(".retail-col");
    const paginationRows = container.querySelectorAll(".slider-pagination-row");
    const contentBox = container.querySelector(".slider-content");

    let hasPlayedIntro = false; // chỉ chạy hiệu ứng scroll 1 lần

    // ----- Init Swiper -----
    const swiper = new Swiper(sliderEl, {
      slidesPerView: 1,
      speed: 800,
      effect: "fade",
      fadeEffect: { crossFade: true },
      allowTouchMove: true,
      on: {
        slideChange: function () {
          updatePagination(this.activeIndex);
          // Chỉ animate nếu intro đã chạy rồi (tránh animate khi chưa scroll tới)
          updateContent(this.activeIndex, hasPlayedIntro);
        },
      },
    });

    // ----- Click pagination -----
    paginationRows.forEach((row, index) => {
      row.addEventListener("click", () => {
        swiper.slideTo(index);
      });
    });

    // ----- Event delegation cho nút retail-btn (bản clone không giữ listener) -----
    if (contentBox) {
      contentBox.addEventListener("click", (e) => {
        const btn = e.target.closest(".retail-btn a");
        if (!btn) return;
        e.preventDefault();
        // TODO: xử lý mở VR 360 tại đây
      });
    }

    // ----- Active class cho pagination -----
    function updatePagination(activeIndex) {
      paginationRows.forEach((row, i) => {
        row.classList.toggle("active", i === activeIndex);
      });
    }

    // ----- Update content -----
    function updateContent(activeIndex, shouldAnimate = false) {
      const activeSlide = swiper.slides[activeIndex];
      const sourceContent = activeSlide.querySelector(".retail-content");

      if (!sourceContent || !contentBox) return;

      // Ẩn lại trước khi đổ content mới (tránh flash khi đổi slide)
      contentBox.classList.remove("is-ready");

      // Clear old content
      contentBox.innerHTML = "";

      // Clone title + description + button
      const title = sourceContent.querySelector("h3")?.cloneNode(true);
      const desc = sourceContent.querySelector(".description")?.cloneNode(true);
      const btn = sourceContent.querySelector(".retail-btn")?.cloneNode(true);

      if (title) contentBox.appendChild(title);
      if (desc) contentBox.appendChild(desc);
      if (btn) contentBox.appendChild(btn);

      if (shouldAnimate) {
        animateContent(contentBox);
      }
      // Nếu shouldAnimate = false: KHÔNG add is-ready ở đây.
      // Giữ nguyên trạng thái ẩn (CSS mặc định), chờ ScrollTrigger
      // hoặc lần đổi slide kế tiếp mới thực sự hiện + animate.
    }

    // ----- Animation title + description + button -----
    function animateContent(box) {
      const titleEl = box.querySelector("h3");
      const descEl = box.querySelector(".description");
      const btnEl = box.querySelector(".retail-btn");

      const tl = gsap.timeline({ paused: true });

      let pending = (titleEl ? 1 : 0) + (descEl ? 1 : 0);
      let started = false;
      let btnAdded = false;

      function tryStart() {
        pending--;
        if (pending === 0 && !started) {
          started = true;
          box.classList.add("is-ready");
          tl.play(0);
        }
      }

      // Button (fade + slide up), chỉ add 1 lần
      function addButtonAnim() {
        if (!btnEl || btnAdded) return;
        btnAdded = true;
        tl.fromTo(
          btnEl,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          ">-0.2", // bắt đầu hơi sớm hơn lúc animation trước kết thúc
        );
      }

      // Title (chars)
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
                duration: 0.45,
                stagger: 0.035,
              },
              0,
            );
            // Không có description -> button chạy sau title
            if (!descEl) addButtonAnim();
            tryStart();
          },
        });
      }

      // Description (lines + mask)
      if (descEl) {
        SplitText.create(descEl, {
          type: "lines",
          mask: "lines",
          linesClass: "line",
          autoSplit: true,
          onSplit: (self) => {
            tl.fromTo(
              self.lines,
              { y: "110%" },
              {
                y: "0%",
                duration: 0.65,
                ease: "power3.inOut",
                stagger: 0.05,
              },
              "<+0.25",
            );
            // Button chạy sau description
            addButtonAnim();
            tryStart();
          },
        });
      }

      // Không có title lẫn description -> chỉ animate button
      if (pending === 0) {
        addButtonAnim();
        started = true;
        box.classList.add("is-ready");
        tl.play(0);
      }

      // Fallback an toàn nếu SplitText load quá lâu / lỗi
      setTimeout(() => {
        if (!box.classList.contains("is-ready")) {
          box.classList.add("is-ready");
          addButtonAnim();
          tl.play(0);
        }
      }, 3000);
    }

    // ----- ScrollTrigger: hiệu ứng xuất hiện khi cuộn tới -----
    ScrollTrigger.create({
      trigger: container,
      start: "top 50%",
      once: true,
      onEnter: () => {
        if (!hasPlayedIntro) {
          hasPlayedIntro = true;
          updateContent(swiper.activeIndex, true); // animate lần đầu
        }
      },
    });

    // Init trạng thái ban đầu: chỉ đổ pagination + content, KHÔNG hiện, KHÔNG animate
    updatePagination(0);
    updateContent(0, false); // content nằm sẵn trong DOM nhưng vẫn ẩn (CSS)
  });
}
export function sliderNews() {
  const sliders = document.querySelectorAll(".news-slider");
  if (!sliders.length) return;
  sliders.forEach((sliderEl) => {
    const wrapper = sliderEl.closest(".news-slider-wrap");
    const slidesCount = sliderEl.querySelectorAll(".swiper-slide").length;
    const prevEl = wrapper?.querySelector(".news-nav--prev");
    const nextEl = wrapper?.querySelector(".news-nav--next");
    if (sliderEl.dataset.newsInitialized === "true") return;
    sliderEl.dataset.newsInitialized = "true";

    const swiper = new Swiper(sliderEl, {
      slidesPerView: 3,
      spaceBetween: 12,
      loop: true,
      speed: 700,
      watchOverflow: true,
      navigation: { nextEl, prevEl },
      breakpoints: {
        0: { slidesPerView: 1, spaceBetween: 16 },
        768: { slidesPerView: 2, spaceBetween: 16 },
        992: { slidesPerView: 3, spaceBetween: 12 },
      },
    });

    const updateNavigation = () => {
      const visibleCount = swiper.params.slidesPerView;
      const shouldShow = slidesCount > visibleCount;
      if (prevEl) prevEl.hidden = !shouldShow;
      if (nextEl) nextEl.hidden = !shouldShow;
      updateNavigationPosition();
    };

    const updateNavigationPosition = () => {
      const image = sliderEl.querySelector(".news-image");
      if (!wrapper || !image) return;
      const wrapperRect = wrapper.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();
      let layoutTop = 0;
      let node = image;
      while (node && node !== wrapper) {
        layoutTop += node.offsetTop;
        node = node.offsetParent;
      }
      const imageTop = node === wrapper ? layoutTop : imageRect.top - wrapperRect.top;
      const imageHeight = image.offsetHeight || imageRect.height;
      const centerY = imageTop + imageHeight / 2;
      if (prevEl) prevEl.style.top = `${centerY}px`;
      if (nextEl) nextEl.style.top = `${centerY}px`;
    };
    const scheduleNavigationPositionUpdate = () => {
      requestAnimationFrame(() => requestAnimationFrame(updateNavigationPosition));
    };

    swiper.on("breakpoint", updateNavigation);
    swiper.on("resize", scheduleNavigationPositionUpdate);
    window.addEventListener("resize", scheduleNavigationPositionUpdate, { passive: true });
    window.addEventListener("load", scheduleNavigationPositionUpdate, { once: true });
    sliderEl.querySelectorAll(".news-image img").forEach((image) => {
      if (!image.complete) {
        image.addEventListener("load", scheduleNavigationPositionUpdate, { once: true });
      }
    });
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(scheduleNavigationPositionUpdate);
      resizeObserver.observe(wrapper);
      const image = sliderEl.querySelector(".news-image");
      if (image) resizeObserver.observe(image);
    }
    updateNavigation();
    scheduleNavigationPositionUpdate();
  });
}
