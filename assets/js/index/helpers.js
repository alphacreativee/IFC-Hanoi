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
