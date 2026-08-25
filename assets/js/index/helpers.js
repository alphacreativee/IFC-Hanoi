export function animationIntro() {
  gsap.registerPlugin(SplitText, ScrollTrigger);

  document.fonts.ready.then(() => {
    document.querySelectorAll("[el-intro]").forEach((container) => {
      if (container.dataset.scriptInitialized) return;
      container.dataset.scriptInitialized = "true";

      const titleEl = container.querySelector("[el-title-intro]");
      const lineEl = container.querySelector("[el-txt-line-intro]");
      const fadeEls = container.querySelectorAll("[el-fade-intro]");
      const heightLine = container.querySelectorAll("[el-line-intro]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none none",
          // markers: true,
        },
      });

      // ----- Đặt các label cố định, không phụ thuộc thứ tự add -----
      tl.addLabel("lineStart", 0);
      tl.addLabel("titleStart", 0.5); // fix cứng thời điểm title bắt đầu
      tl.addLabel("descStart", 1.3);
      tl.addLabel("fadeStart", 2.0);

      // ----- 0. Line -----
      if (heightLine.length) {
        console.log("heightLine found:", heightLine.length); // debug
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

      // ----- 1. Title -----
      if (titleEl) {
        SplitText.create(titleEl, {
          type: "chars",
          charsClass: "char",
          autoSplit: true,
          onSplit: (self) => {
            tl.fromTo(
              self.chars,
              { transformOrigin: "50% 100%", scaleY: 0, opacity: 0 },
              {
                ease: "power3.out",
                opacity: 1,
                scaleY: 1,
                duration: 0.5,
                stagger: 0.05,
              },
              "titleStart", // luôn cố định, không phụ thuộc line có chạy hay không
            );
          },
        });
      }

      // ----- 2. Txt line -----
      if (lineEl) {
        SplitText.create(lineEl, {
          type: "lines",
          mask: "lines",
          linesClass: "line",
          autoSplit: true,
          onSplit: (self) => {
            tl.fromTo(
              self.lines,
              { y: "100%" },
              { y: "0%", duration: 0.8, ease: "power3.inOut", stagger: 0.05 },
              "descStart",
            );
          },
        });
      }

      // ----- 3. Fade -----
      if (fadeEls.length) {
        tl.fromTo(
          fadeEls,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "none" },
          "fadeStart",
        );
      }
    });
  });
}
export function animationRetail() {
  gsap.registerPlugin(SplitText, ScrollTrigger);

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

      // Clone title + description
      const title = sourceContent.querySelector("h3")?.cloneNode(true);
      const desc = sourceContent.querySelector(".description")?.cloneNode(true);

      if (title) contentBox.appendChild(title);
      if (desc) contentBox.appendChild(desc);

      if (shouldAnimate) {
        animateContent(contentBox);
      }
      // Nếu shouldAnimate = false: KHÔNG add is-ready ở đây.
      // Giữ nguyên trạng thái ẩn (CSS mặc định), chờ ScrollTrigger
      // hoặc lần đổi slide kế tiếp mới thực sự hiện + animate.
    }

    // ----- Animation title + description -----
    function animateContent(box) {
      const titleEl = box.querySelector("h3");
      const descEl = box.querySelector(".description");

      const tl = gsap.timeline({ paused: true });

      let pending = (titleEl ? 1 : 0) + (descEl ? 1 : 0);
      let started = false;

      function tryStart() {
        pending--;
        if (pending === 0 && !started) {
          started = true;
          box.classList.add("is-ready");
          tl.play(0);
        }
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
            tryStart();
          },
        });
      }

      if (pending === 0) {
        box.classList.add("is-ready");
      }

      // Fallback an toàn nếu SplitText load quá lâu / lỗi
      setTimeout(() => {
        if (!box.classList.contains("is-ready")) {
          box.classList.add("is-ready");
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
  const sliderNews = document.querySelectorAll(".news-slider");
  if (!sliderNews.length) return;
  sliderNews.forEach((sliderEl) => {
    new Swiper(sliderEl, {
      slidesPerView: 3,
      spaceBetween: 12,
      // navigation: {
      //   nextEl: sliderEl.querySelector(".swiper-button-next"),
      //   prevEl: sliderEl.querySelector(".swiper-button-prev"),
      // },
    });
  });
}
