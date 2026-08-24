export function animationIntro() {
  gsap.registerPlugin(SplitText, ScrollTrigger);

  document.fonts.ready.then(() => {
    document.querySelectorAll("[el-intro]").forEach((container) => {
      if (container.dataset.scriptInitialized) return;
      container.dataset.scriptInitialized = "true";

      const titleEl = container.querySelector("[el-title-intro]");
      const lineEl = container.querySelector("[el-txt-line-intro]");
      const fadeEls = container.querySelectorAll("[el-fade-intro]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none none",
          // markers: true,
        },
      });

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
                stagger: 0.05,
              },
              0, // bắt đầu từ đầu timeline
            );
          },
        });
      }

      // ----- 2. Txt line (lines, mask) -----
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
              {
                y: "0%",
                duration: 0.8,
                ease: "power3.inOut",
                stagger: 0.05,
              },
              "<+0.6",
            );
          },
        });
      }

      // ----- 3. Fade -----
      if (fadeEls.length) {
        tl.fromTo(
          fadeEls,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "none",
          },
          ">-0.2", // nối sau txt-line
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
          updateContent(this.activeIndex, true); // true = animate ngay
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

      // Clear old content
      contentBox.innerHTML = "";

      // Clone title + description
      const title = sourceContent.querySelector("h3")?.cloneNode(true);
      const desc = sourceContent.querySelector(".description")?.cloneNode(true);

      if (title) contentBox.appendChild(title);
      if (desc) contentBox.appendChild(desc);

      // Chỉ animate khi được yêu cầu
      if (shouldAnimate) {
        animateContent(contentBox);
      }
    }

    // ----- Animation title + description -----
    function animateContent(box) {
      const titleEl = box.querySelector("h3");
      const descEl = box.querySelector(".description");

      const tl = gsap.timeline();

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
          },
        });
      }
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

    // Init trạng thái ban đầu (chưa animate)
    updatePagination(0);
    updateContent(0, false); // chỉ đổ content, chưa chạy hiệu ứng
  });
}
