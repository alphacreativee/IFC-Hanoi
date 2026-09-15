function hoverHighlightPath() {
  if (!document.querySelector(".map")) return;
  const triggers = document.querySelectorAll(".map-point-item");
  if (!triggers.length) return;

  const container = document.querySelector(".map-image");
  const svg = document.querySelector(".map svg");
  if (!svg || !container) return;

  const isTouch = window.matchMedia("(hover: none)").matches;
  const isMobile = window.matchMedia("(max-width: 991px)").matches;

  const pairs = Array.from(triggers)
    .map((trigger) => {
      const pointClass = Array.from(trigger.classList).find((cls) =>
        cls.startsWith("point-"),
      );
      if (!pointClass) return null;
      const path = svg.querySelector(`#${pointClass}`);
      if (!path) return null;
      const numberPath = svg.querySelector(
        `[data-point-target="${pointClass}"]`,
      );
      const interactivePaths = [path, numberPath].filter(Boolean);

      return { trigger, path, interactivePaths };
    })
    .filter(Boolean);

  if (!pairs.length) return;

  const resetZoom = () => {
    pairs.forEach((item) => {
      item.path.classList.remove("active");
      item.trigger.classList.remove("active");
    });

    if (isMobile) {
      svg.classList.remove("zoomed");
      svg.style.transform = "";
      svg.style.transformOrigin = "";
    }
  };

  const zoomToPath = (path) => {
    if (!isMobile) return;

    const viewBox = svg.viewBox.baseVal;
    const bbox = path.getBBox();

    const containerW = container.clientWidth;
    const containerH = container.clientHeight;

    const baseScale = Math.min(
      containerW / viewBox.width,
      containerH / viewBox.height,
    );

    const offsetX = (containerW - viewBox.width * baseScale) / 2;
    const offsetY = (containerH - viewBox.height * baseScale) / 2;

    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;

    const Ox = offsetX + (cx - viewBox.x) * baseScale;
    const Oy = offsetY + (cy - viewBox.y) * baseScale;

    const centerX = containerW / 2;
    const centerY = containerH / 2;
    const s = 1.6;

    let dx = centerX - Ox;
    let dy = centerY - Oy;

    const lowerX = -(s - 1) * (containerW - Ox);
    const upperX = (s - 1) * Ox;
    const lowerY = -(s - 1) * (containerH - Oy);
    const upperY = (s - 1) * Oy;

    dx = Math.min(upperX, Math.max(lowerX, dx));
    dy = Math.min(upperY, Math.max(lowerY, dy));

    // Làm tròn để tránh subpixel rendering gây nhòe
    dx = Math.round(dx);
    dy = Math.round(dy);
    const Ox_r = Math.round(Ox);
    const Oy_r = Math.round(Oy);

    svg.style.transformOrigin = `${Ox_r}px ${Oy_r}px`;
    svg.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
    svg.classList.add("zoomed");
  };

  const activate = (path) => {
    pairs.forEach((item) => {
      const isActive = item.path === path;
      item.path.classList.toggle("active", isActive);
      item.trigger.classList.toggle("active", isActive);
    });
    zoomToPath(path);
  };

  pairs.forEach(({ trigger, path, interactivePaths }) => {
    if (isTouch) {
      // Mobile: tap vào trigger
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const alreadyActive = path.classList.contains("active");
        alreadyActive ? resetZoom() : activate(path);
      });

      // Mobile: tap vào nền hoặc chữ số của marker.
      interactivePaths.forEach((interactivePath) => {
        interactivePath.addEventListener("click", (e) => {
          e.stopPropagation();
          const alreadyActive = path.classList.contains("active");
          alreadyActive ? resetZoom() : activate(path);
        });
      });
    } else {
      // Desktop: hover vào trigger
      trigger.addEventListener("mouseenter", () => activate(path));
      trigger.addEventListener("mouseleave", resetZoom);

      // Desktop: nền và chữ số hoạt động như một marker duy nhất.
      interactivePaths.forEach((interactivePath) => {
        interactivePath.addEventListener("mouseenter", () => activate(path));
        interactivePath.addEventListener("mouseleave", (e) => {
          if (!interactivePaths.includes(e.relatedTarget)) {
            resetZoom();
          }
        });
      });
    }
  });

  if (isTouch) {
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".map-image") &&
        !e.target.closest(".map-point-item")
      ) {
        resetZoom();
      }
    });
  }
}
function animateLineLogo() {
  const line = document.querySelector(".line-stroke-logo");
  if (!line) {
    console.log("❌ Không tìm thấy .line-stroke-logo");
    return;
  }

  const length = line.getTotalLength();
  console.log("✅ length =", length);

  const dashLength = length * 0.5;
  line.style.strokeDasharray = `${dashLength} ${length - dashLength}`;
  line.style.setProperty("--line-length", length);
}

document.addEventListener("DOMContentLoaded", animateLineLogo);
document.addEventListener("DOMContentLoaded", () => {
  hoverHighlightPath();
});
function animateVerticalLine() {
  const line = document.querySelector(".line-vertical-run");
  if (!line) return;

  const length = line.getTotalLength();
  const dashLength = length * 0.4; // đoạn sáng chiếm 40% độ dài, chỉnh tùy ý

  line.style.strokeDasharray = `${dashLength} ${length - dashLength}`;

  line.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -length }], {
    duration: 1500,
    iterations: Infinity,
    easing: "linear",
  });
}

document.addEventListener("DOMContentLoaded", animateVerticalLine);
function animatePinOutlineRun() {
  const outline = document.querySelector(".pin-outline-run");
  if (!outline) return;

  const length = outline.getTotalLength();
  const dashLength = length * 0.25;

  outline.style.strokeDasharray = `${dashLength} ${length - dashLength}`;

  outline.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -length }], {
    duration: 3000,
    iterations: Infinity,
    easing: "linear",
  });
}

document.addEventListener("DOMContentLoaded", animatePinOutlineRun);
function animateLineDashRun() {
  const lines = document.querySelectorAll(".line-dash-run");
  if (!lines.length) return;

  lines.forEach((line) => {
    const length = line.getTotalLength();
    const dashLength = length * 0.9;

    line.style.strokeDasharray = `${dashLength} ${length - dashLength}`;

    line.animate([{ strokeDashoffset: -length }, { strokeDashoffset: 0 }], {
      duration: 3000,
      iterations: Infinity,
      easing: "linear",
    });
  });
}

document.addEventListener("DOMContentLoaded", animateLineDashRun);
