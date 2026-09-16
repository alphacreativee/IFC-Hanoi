"use strict";

const root = document.querySelector(".ourTenant");

if (root) {
  const floorTabs = [...root.querySelectorAll("[data-floor-tab]")];
  const floorSelect = root.querySelector("[data-floor-select]");
  const floorSelectText = floorSelect?.querySelector(".dropdown-custom-text");
  const tenantCards = [...root.querySelectorAll("[data-tenant]")];
  const tenantDetails = [...root.querySelectorAll("[data-tenant-content]")];
  const sliders = new WeakMap();

  function initSlider(detail) {
    const slider = detail.querySelector(".ourTenant__media-slider");
    const previous = detail.querySelector(".ourTenant__media-prev");
    const next = detail.querySelector(".ourTenant__media-next");
    const slides = slider?.querySelectorAll(".swiper-slide");

    if (!slider || !previous || !next || slides.length < 2 || sliders.has(detail)) {
      return;
    }

    sliders.set(
      detail,
      new Swiper(slider, {
        slidesPerView: 1,
        speed: 800,
        loop: true,
        grabCursor: true,
        navigation: { prevEl: previous, nextEl: next }
      })
    );
  }

  function showTenant(tenantId) {
    tenantCards.forEach((card) => {
      const isActive = card.dataset.tenant === tenantId;
      card.classList.toggle("active", isActive);
      card.setAttribute("aria-selected", String(isActive));
    });

    tenantDetails.forEach((detail) => {
      const isActive = detail.dataset.tenantContent === tenantId;
      detail.hidden = !isActive;
      detail.classList.toggle("active", isActive);

      if (isActive) {
        initSlider(detail);
      }
    });

    const activeCard = tenantCards.find(
      (card) => card.dataset.tenant === tenantId
    );
    const planImage = root.querySelector("[data-floor-plan]");

    if (planImage && activeCard?.dataset.plan) {
      planImage.src = activeCard.dataset.plan;
    }
  }

  function showFloor(floorKey) {
    floorTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.floor === floorKey);
    });

    if (floorSelectText) {
      floorSelectText.textContent = floorKey.toUpperCase();
    }

    floorSelect?.querySelectorAll("[data-floor-option]").forEach((option) => {
      option.classList.toggle(
        "active",
        option.dataset.floorOption === floorKey
      );
    });

    const activeTab = floorTabs.find((tab) => tab.dataset.floor === floorKey);
    const planImage = root.querySelector("[data-floor-plan]");
    const planContainer = planImage?.closest(".ourTenant__plan");
    if (planContainer) {
      if (activeTab?.dataset.plan) {
        planContainer.removeAttribute("hidden");
        planImage.src = activeTab.dataset.plan;
        planImage.alt = `${activeTab.textContent.trim()} floor plan`;
      } else {
        planContainer.setAttribute("hidden", "hidden");
      }
    }

    tenantCards.forEach((card) => {
      card.hidden = card.dataset.floor !== floorKey;
    });

    const firstTenant = tenantCards.find(
      (card) => card.dataset.floor === floorKey
    );

    if (firstTenant) {
      showTenant(firstTenant.dataset.tenant);
    }
  }

  floorTabs.forEach((tab) => {
    tab.addEventListener("click", () => showFloor(tab.dataset.floor));
  });

  floorSelect?.querySelectorAll("[data-floor-option]").forEach((option) => {
    option.addEventListener("click", () => {
      showFloor(option.dataset.floorOption);
    });
  });

  tenantCards.forEach((card) => {
    card.addEventListener("click", () => showTenant(card.dataset.tenant));
  });

  const initialFloor =
    floorTabs.find((tab) => tab.classList.contains("active"))?.dataset.floor ||
    "b1f";

  showFloor(initialFloor);
}
