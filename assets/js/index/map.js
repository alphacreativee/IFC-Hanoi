// export function hoverHighlightPath() {
//   const triggers = document.querySelectorAll(".map-point-item");
//   if (!triggers.length) return;

//   const svg = document.querySelector(".map svg"); // đổi selector nếu SVG có id/class riêng
//   if (!svg) return;

//   triggers.forEach((trigger) => {
//     // Tìm class dạng "point-X" trong classList
//     const pointClass = Array.from(trigger.classList).find((cls) =>
//       cls.startsWith("point-"),
//     );

//     if (!pointClass) return;

//     const path = svg.querySelector(`#${pointClass}`);
//     if (!path) return;

//     trigger.addEventListener("mouseenter", () => {
//       path.classList.add("active");
//     });

//     trigger.addEventListener("mouseleave", () => {
//       path.classList.remove("active");
//     });
//   });
// }
// export function hoverHighlightPath() {
//   const triggers = document.querySelectorAll(".map-point-item");
//   if (!triggers.length) return;

//   const svg = document.querySelector(".map svg");
//   if (!svg) return;

//   const pairs = Array.from(triggers)
//     .map((trigger) => {
//       const pointClass = Array.from(trigger.classList).find((cls) =>
//         cls.startsWith("point-"),
//       );
//       if (!pointClass) return null;

//       const path = svg.querySelector(`#${pointClass}`);
//       if (!path) return null;

//       return { trigger, path };
//     })
//     .filter(Boolean);

//   if (!pairs.length) return;

//   pairs.forEach(({ trigger, path }) => {
//     trigger.addEventListener("mouseenter", () => {
//       pairs.forEach((item) => {
//         const isActive = item.path === path;

//         item.path.classList.toggle("active", isActive);
//         item.path.classList.toggle("dimmed", !isActive);
//       });
//     });

//     trigger.addEventListener("mouseleave", () => {
//       pairs.forEach((item) => {
//         item.path.classList.remove("active", "dimmed");
//       });
//     });
//   });
// }
// export function hoverHighlightPath() {
//   const triggers = document.querySelectorAll(".map-point-item");
//   if (!triggers.length) return;

//   const svg = document.querySelector(".map svg");
//   if (!svg) return;

//   const pairs = Array.from(triggers)
//     .map((trigger) => {
//       const pointClass = Array.from(trigger.classList).find((cls) =>
//         cls.startsWith("point-"),
//       );
//       if (!pointClass) return null;

//       const path = svg.querySelector(`#${pointClass}`);
//       if (!path) return null;

//       return { trigger, path };
//     })
//     .filter(Boolean);

//   if (!pairs.length) return;

//   pairs.forEach(({ trigger, path }) => {
//     trigger.addEventListener("mouseenter", () => {
//       pairs.forEach((item) => {
//         const isActive = item.path === path;
//         item.path.classList.toggle("active", isActive);
//         item.path.classList.toggle("dimmed", !isActive);
//       });

//       // Lấy tâm của path (theo tọa độ nội bộ SVG) để làm transform-origin
//       const bbox = path.getBBox();
//       const centerX = bbox.x + bbox.width / 2;
//       const centerY = bbox.y + bbox.height / 2;

//       const viewBox = svg.viewBox.baseVal;
//       // Tính % vị trí tâm path so với toàn viewBox -> dùng cho transform-origin
//       const originXPercent = ((centerX - viewBox.x) / viewBox.width) * 100;
//       const originYPercent = ((centerY - viewBox.y) / viewBox.height) * 100;

//       svg.style.transformOrigin = `${originXPercent}% ${originYPercent}%`;
//       svg.classList.add("zoomed");
//     });

//     trigger.addEventListener("mouseleave", () => {
//       pairs.forEach((item) => {
//         item.path.classList.remove("active", "dimmed");
//       });
//       svg.classList.remove("zoomed");
//     });
//   });
// }
export function hoverHighlightPath() {
  if (!document.querySelector(".map")) return;
  const triggers = document.querySelectorAll(".map-point-item");
  if (!triggers.length) return;

  const container = document.querySelector(".map-image");
  const svg = document.querySelector(".map svg");
  if (!svg || !container) return;

  const isTouch = window.matchMedia("(hover: none)").matches;
  const isMobile = window.matchMedia("(max-width: 991px)").matches; // 👈 breakpoint áp dụng zoom

  const pairs = Array.from(triggers)
    .map((trigger) => {
      const pointClass = Array.from(trigger.classList).find((cls) =>
        cls.startsWith("point-"),
      );
      if (!pointClass) return null;

      const path = svg.querySelector(`#${pointClass}`);
      if (!path) return null;

      return { trigger, path };
    })
    .filter(Boolean);

  if (!pairs.length) return;

  const resetZoom = () => {
    pairs.forEach((item) => {
      item.path.classList.remove("active", "dimmed");
    });

    if (isMobile) {
      svg.classList.remove("zoomed");
      svg.style.transform = "";
      svg.style.transformOrigin = "";
    }
  };

  const zoomToPath = (path) => {
    // Chỉ tính toán + áp transform khi ở mobile
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

    svg.style.transformOrigin = `${Ox}px ${Oy}px`;
    svg.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
    svg.classList.add("zoomed");
  };

  pairs.forEach(({ trigger, path }) => {
    const activate = () => {
      pairs.forEach((item) => {
        const isActive = item.path === path;
        item.path.classList.toggle("active", isActive);
        item.path.classList.toggle("dimmed", !isActive);
      });
      zoomToPath(path); // tự bỏ qua nếu không phải mobile
    };

    if (isTouch) {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const alreadyActive = path.classList.contains("active");
        alreadyActive ? resetZoom() : activate();
      });
    } else {
      trigger.addEventListener("mouseenter", activate);
      trigger.addEventListener("mouseleave", resetZoom);
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
