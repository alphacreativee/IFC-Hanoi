"use strict";

function stackingPlanImageDrag() {
  const imageWraps = document.querySelectorAll(".stackingPlan__image");
  if (!imageWraps.length) return;

  let floorPlanSlider = null;
  const stackPathKeys = [
    "h3",
    "h4",
    "h5",
    "h1",
    "h2",
    "o4",
    "h35",
    "b1",
    "h23",
    "h6",
    "o21",
    "o5",
    "o3",
    "o1",
    "b2",
  ];

  const setPopupSlides = (popup, imageSources) => {
    const sliderEl = popup.querySelector(".stackingPlanPopup__slider");
    const wrapper = popup.querySelector(".swiper-wrapper");
    if (!sliderEl || !wrapper) return;

    if (floorPlanSlider) {
      floorPlanSlider.destroy(true, true);
      floorPlanSlider = null;
    }

    wrapper.innerHTML = "";
    imageSources.forEach((src) => {
      const slide = document.createElement("div");
      const image = document.createElement("img");

      slide.className = "swiper-slide";
      image.className = "stackingPlanPopup__image";
      image.src = src;
      image.alt = "IFC Hanoi floor plan";
      image.loading = "lazy";

      slide.appendChild(image);
      wrapper.appendChild(slide);
    });

    sliderEl.classList.toggle("is-single", imageSources.length <= 1);

    if (imageSources.length > 1) {
      floorPlanSlider = new Swiper(sliderEl, {
        slidesPerView: 1,
        spaceBetween: 16,
        speed: 600,
        navigation: {
          nextEl: popup.querySelector(".stackingPlanPopup__nav--next"),
          prevEl: popup.querySelector(".stackingPlanPopup__nav--prev"),
        },
      });
    }
  };

  const getFloorPlanSources = (trigger) =>
    (trigger?.dataset.floorplans || "")
      .split(",")
      .map((src) => src.trim())
      .filter(Boolean);

  const hasFloorPlans = (trigger) => getFloorPlanSources(trigger).length > 0;

  const setPopupContent = (popup, trigger) => {
    const titleEl = popup.querySelector("[data-stacking-popup-title]");
    const descriptionEl = popup.querySelector(
      "[data-stacking-popup-description]",
    );
    const contentEl = popup.querySelector(".stackingPlanPopup__content");
    const title = trigger?.dataset.popupTitle || "";
    const description = trigger?.dataset.popupDescription || "";

    if (titleEl) titleEl.textContent = title;
    if (descriptionEl) descriptionEl.textContent = description;
    if (contentEl) {
      contentEl.classList.toggle("is-hidden", !title && !description);
    }
  };

  const openFloorPlanPopup = (trigger) => {
    const popup = document.querySelector("[data-stacking-popup]");
    if (!popup) return;

    const imageSources = getFloorPlanSources(trigger);

    if (!imageSources.length) return;

    setPopupContent(popup, trigger);
    setPopupSlides(popup, imageSources);
    popup.classList.add("active");
    popup.setAttribute("aria-hidden", "false");
  };

  const closeFloorPlanPopup = () => {
    const popup = document.querySelector("[data-stacking-popup]");
    if (!popup) return;

    popup.classList.remove("active");
    popup.setAttribute("aria-hidden", "true");
  };

  const createStackingOverlay = async (
    wrap,
    onActiveKeyChange,
    onRegionClick,
    hasRegionPopup,
  ) => {
    const canvas = wrap.querySelector("[data-stacking-overlay]");
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx || typeof Path2D === "undefined") return null;

    const response = await fetch(canvas.dataset.src);
    if (!response.ok) return null;

    const svgText = await response.text();
    const svgDoc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const svgEl = svgDoc.querySelector("svg");
    const pathEls = Array.from(svgDoc.querySelectorAll("path"));
    const viewBox = (svgEl?.getAttribute("viewBox") || "0 0 563 537")
      .split(/\s+/)
      .map(Number);
    const viewWidth = viewBox[2] || 563;
    const viewHeight = viewBox[3] || 537;
    const regions = pathEls
      .map((pathEl, index) => ({
        key: stackPathKeys[index],
        path: new Path2D(pathEl.getAttribute("d") || ""),
      }))
      .filter((region) => region.key);

    let activeKey = null;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      drawActiveRegion();
    };

    const drawActiveRegion = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!activeKey) return;

      const activeRegion = regions.find((region) => region.key === activeKey);
      if (!activeRegion) return;

      ctx.save();
      ctx.scale(canvas.width / viewWidth, canvas.height / viewHeight);
      ctx.fillStyle = "rgba(147, 65, 23, 0.3)";
      ctx.strokeStyle = "#ff5600";
      ctx.lineWidth = 1.5;
      ctx.fill(activeRegion.path);
      ctx.stroke(activeRegion.path);
      ctx.restore();
    };

    const getKeyFromEvent = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * viewWidth;
      const y = ((event.clientY - rect.top) / rect.height) * viewHeight;

      for (let index = regions.length - 1; index >= 0; index--) {
        if (ctx.isPointInPath(regions[index].path, x, y)) {
          return regions[index].key;
        }
      }

      return null;
    };

    const setActiveKey = (key) => {
      activeKey = key;
      drawActiveRegion();
    };

    canvas.addEventListener("mousemove", (event) => {
      const key = getKeyFromEvent(event);

      canvas.style.cursor = key && hasRegionPopup(key) ? "pointer" : "default";
      onActiveKeyChange(key);
    });

    canvas.addEventListener("mouseleave", () => {
      canvas.style.cursor = "default";
      onActiveKeyChange(null);
    });

    canvas.addEventListener("click", (event) => {
      const key = getKeyFromEvent(event);
      if (key) onRegionClick(key);
    });

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(canvas);
    }

    return { setActiveKey };
  };

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-stacking-popup-close]")) {
      event.preventDefault();
      closeFloorPlanPopup();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeFloorPlanPopup();
    }
  });

  imageWraps.forEach((wrap) => {
    if (wrap.dataset.dragInitialized === "true") return;

    wrap.dataset.dragInitialized = "true";

    const image = wrap.querySelector(".stackingPlan__building");
    const triggers = wrap.querySelectorAll("[data-stack-trigger]");
    const triggerByKey = new Map();
    let overlayApi = null;

    triggers.forEach((trigger) => {
      if (trigger.dataset.stackKey) {
        triggerByKey.set(trigger.dataset.stackKey, trigger);
      }
    });

    const setActiveKey = (key) => {
      triggers.forEach((item) => {
        item.classList.toggle("active", Boolean(key) && item.dataset.stackKey === key);
      });

      overlayApi?.setActiveKey(key);
    };

    if (image) {
      image.setAttribute("draggable", "false");
      image.addEventListener("dragstart", (event) => event.preventDefault());
    }

    createStackingOverlay(
      wrap,
      setActiveKey,
      (key) => {
        const trigger = triggerByKey.get(key);
        if (trigger) openFloorPlanPopup(trigger);
      },
      (key) => hasFloorPlans(triggerByKey.get(key)),
    ).then((api) => {
      overlayApi = api;
    });

    triggers.forEach((trigger) => {
      const stackKey = trigger.dataset.stackKey;

      trigger.addEventListener("mouseenter", () => {
        setActiveKey(stackKey);
      });

      trigger.addEventListener("mouseleave", () => {
        setActiveKey(null);
      });

      trigger.addEventListener("focus", () => {
        setActiveKey(stackKey);
      });

      trigger.addEventListener("blur", () => {
        setActiveKey(null);
      });

      trigger.addEventListener("click", () => {
        openFloorPlanPopup(trigger);
      });
    });

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasDragged = false;

    wrap.addEventListener("pointerdown", (event) => {
      if (wrap.scrollWidth <= wrap.clientWidth) return;

      isDown = true;
      startX = event.clientX;
      scrollLeft = wrap.scrollLeft;
      hasDragged = false;
      wrap.classList.add("is-dragging");
      wrap.setPointerCapture(event.pointerId);
    });

    wrap.addEventListener("pointermove", (event) => {
      if (!isDown) return;

      event.preventDefault();
      if (Math.abs(event.clientX - startX) > 4) {
        hasDragged = true;
      }
      wrap.scrollLeft = scrollLeft - (event.clientX - startX);
    });

    wrap.addEventListener(
      "click",
      (event) => {
        if (!hasDragged) return;

        event.preventDefault();
        event.stopPropagation();
        hasDragged = false;
      },
      true,
    );

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

document.addEventListener("DOMContentLoaded", stackingPlanImageDrag);
