"use strict";

function gallery() {
  const gallerySection = document.querySelector(".gallery");
  if (!gallerySection || gallerySection.dataset.galleryInitialized) return;
  gallerySection.dataset.galleryInitialized = "true";

  const popup = document.querySelector(".galleryPopup");
  const popupWrapper = popup?.querySelector(".swiper-wrapper");
  const closeBtn = popup?.querySelector(".galleryPopup__close");
  const gallerySliderEl = popup?.querySelector(".galleryPopup__slider");
  const popupCaption = popup?.querySelector(".galleryPopup__caption");
  const mobilePagination = popup?.querySelector(
    ".galleryPopup__mobile-pagination"
  );
  const buttons = gallerySection.querySelectorAll(".filter-button[data-type]");
  let popupSlider = null;

  if (!popup || !popupWrapper || !gallerySliderEl) return;

  const getActiveFilter = () =>
    gallerySection.querySelector(".filter-button.active")?.dataset.type ||
    "all";

  const getFilteredItems = () => {
    const activeFilter = getActiveFilter();
    const items = Array.from(gallerySection.querySelectorAll(".media-item"));

    if (activeFilter === "all") return items;
    return items.filter((item) => item.classList.contains(activeFilter));
  };

  const updatePattern = () => {
    const pattern = [
      { column: "1 / span 8", row: 1, span: 6 },
      { column: "9 / span 4", row: 1, span: 3 },
      { column: "9 / span 4", row: 4, span: 3 },
      { column: "1 / span 4", row: 7, span: 6 },
      { column: "5 / span 4", row: 7, span: 4 },
      { column: "9 / span 4", row: 7, span: 6 },
      { column: "1 / span 4", row: 13, span: 3 },
      { column: "5 / span 4", row: 11, span: 7 },
      { column: "9 / span 4", row: 13, span: 3 },
      { column: "1 / span 4", row: 16, span: 6 },
      { column: "5 / span 4", row: 18, span: 4 },
      { column: "9 / span 4", row: 16, span: 6 }
    ];
    const rowsPerBlock = 21;

    gallerySection.querySelectorAll(".media-item").forEach((item) => {
      for (let i = 1; i <= 12; i++) {
        item.classList.remove(`media-item--${i}`);
      }
      item.style.gridColumn = "";
      item.style.gridRow = "";
    });

    getFilteredItems().forEach((item, index) => {
      const patternIndex = index % pattern.length;
      const blockIndex = Math.floor(index / pattern.length);
      const placement = pattern[patternIndex];
      const rowStart = blockIndex * rowsPerBlock + placement.row;

      item.classList.add(`media-item--${patternIndex + 1}`);
      item.style.gridColumn = placement.column;
      item.style.gridRow = `${rowStart} / span ${placement.span}`;
    });
  };

  const createSlide = (item) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    const media = document.createElement("div");
    media.className = "galleryPopup__media";

    const type = item.dataset.mediaType || "photo";

    if (type === "video") {
      media.classList.add("galleryPopup__media--video");
      const provider = item.dataset.videoProvider;
      const src = item.dataset.videoSrc;

      if (provider === "mp4") {
        const video = document.createElement("video");
        video.src = src;
        video.controls = true;
        video.playsInline = true;
        media.appendChild(video);
      } else {
        const iframe = document.createElement("iframe");
        iframe.src = src;
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        media.appendChild(iframe);
      }
    } else {
      const img = document.createElement("img");
      img.src = item.dataset.mediaSrc || item.querySelector("img")?.src || "";
      img.alt = item.querySelector("img")?.alt || "";
      media.appendChild(img);
    }

    slide.appendChild(media);

    return slide;
  };

  const updatePopupCaption = (items, index) => {
    if (!popupCaption) return;
    popupCaption.textContent =
      items[index]?.querySelector(".media-item__caption")?.textContent.trim() ||
      "";
  };

  const updateMobilePagination = (index, total) => {
    if (!mobilePagination) return;
    mobilePagination.textContent = `${index + 1}/${total}`;
  };

  const stopPopupMedia = () => {
    popupWrapper.querySelectorAll("video").forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });

    popupWrapper.querySelectorAll("iframe").forEach((iframe) => {
      iframe.src = iframe.src;
    });
  };

  const closePopup = () => {
    stopPopupMedia();
    popup.classList.remove("active");
    document.body.classList.remove("no-scroll");

    if (popupSlider) {
      popupSlider.destroy(true, true);
      popupSlider = null;
    }

    popupWrapper.innerHTML = "";
    if (popupCaption) popupCaption.textContent = "";
  };

  const openPopup = (clickedItem) => {
    const items = getFilteredItems();
    const activeIndex = Math.max(items.indexOf(clickedItem), 0);

    popup.dataset.filter = getActiveFilter();
    popup.dataset.activeIndex = activeIndex;
    popup.dataset.total = items.length;
    updatePopupCaption(items, activeIndex);
    updateMobilePagination(activeIndex, items.length);

    popupWrapper.innerHTML = "";
    items.forEach((item) => popupWrapper.appendChild(createSlide(item)));

    popupSlider = new Swiper(gallerySliderEl, {
      initialSlide: activeIndex,
      loop: false,
      spaceBetween: 80,
      speed: 1000,
      pagination: {
        el: popup.querySelector(".swiper-pagination"),
        type: "fraction",
        clickable: true,
        renderFraction(currentClass, totalClass) {
          return `<span class="${currentClass}"></span>/<span class="${totalClass}"></span>`;
        }
      },
      navigation: {
        nextEl: popup.querySelector(".swiper-button-next"),
        prevEl: popup.querySelector(".swiper-button-prev")
      },
      on: {
        slideChange() {
          stopPopupMedia();
          updatePopupCaption(items, popupSlider.realIndex);
          updateMobilePagination(popupSlider.realIndex, items.length);
        }
      }
    });

    popup.classList.add("active");
    document.body.classList.add("no-scroll");
  };

  gallerySection.querySelectorAll(".media-item").forEach((item) => {
    item.addEventListener("click", () => openPopup(item));
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      closePopup();
      setTimeout(updatePattern, 350);
    });
  });

  closeBtn?.addEventListener("click", closePopup);
  popup.addEventListener("click", (e) => {
    if (e.target === popup) closePopup();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("active")) {
      closePopup();
    }
  });

  updatePattern();
}

document.addEventListener("DOMContentLoaded", gallery);
