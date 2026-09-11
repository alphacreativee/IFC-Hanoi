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
      path.style.cursor = "pointer";
      if (!path) return null;

      return { trigger, path };
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

  pairs.forEach(({ trigger, path }) => {
    if (isTouch) {
      // Mobile: tap vào trigger
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const alreadyActive = path.classList.contains("active");
        alreadyActive ? resetZoom() : activate(path);
      });

      // Mobile: tap trực tiếp vào path trên SVG cũng active tương ứng
      path.addEventListener("click", (e) => {
        e.stopPropagation();
        const alreadyActive = path.classList.contains("active");
        alreadyActive ? resetZoom() : activate(path);
      });
    } else {
      // Desktop: hover vào trigger
      trigger.addEventListener("mouseenter", () => activate(path));
      trigger.addEventListener("mouseleave", resetZoom);

      // Desktop: hover trực tiếp vào path trên SVG cũng active tương ứng
      path.addEventListener("mouseenter", () => activate(path));
      path.addEventListener("mouseleave", resetZoom);
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

document.addEventListener("DOMContentLoaded", () => {
  hoverHighlightPath();
});
