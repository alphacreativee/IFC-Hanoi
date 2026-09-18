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

    if (
      !slider ||
      !previous ||
      !next ||
      slides.length < 2 ||
      sliders.has(detail)
    ) {
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

  let interactionLocked = false;
  let unlockTimer = null;

  function runTenantInteraction(callback) {
    if (interactionLocked) return;

    interactionLocked = true;
    root.classList.add("is-switching");
    callback();

    window.clearTimeout(unlockTimer);
    unlockTimer = window.setTimeout(() => {
      interactionLocked = false;
      root.classList.remove("is-switching");
    }, 550);
  }

  floorTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      runTenantInteraction(() => showFloor(tab.dataset.floor));
    });
  });

  floorSelect?.querySelectorAll("[data-floor-option]").forEach((option) => {
    option.addEventListener("click", () => {
      runTenantInteraction(() => showFloor(option.dataset.floorOption));
    });
  });

  tenantCards.forEach((card) => {
    card.addEventListener("click", () => {
      runTenantInteraction(() => showTenant(card.dataset.tenant));
    });
  });

  const initialFloor =
    floorTabs.find((tab) => tab.classList.contains("active"))?.dataset.floor ||
    "b1f";

  showFloor(initialFloor);

  const detail = root.querySelector(".ourTenant__detail");
  const exploreButton = root.querySelector(".ourTenant__scroll-explore");

  if (detail && exploreButton) {
    const hideExploreButton = () => {
      exploreButton.classList.remove("is-visible");
      exploreButton.classList.add("is-hiding");
      window.setTimeout(() => exploreButton.classList.remove("is-hiding"), 400);
    };

    const rightColumn = root.querySelector(".ourTenant__right-column");
    const positionExploreButton = () => {
      if (!rightColumn) return;
      const isMobile = window.innerWidth <= 767;
      const center = isMobile
        ? window.innerWidth / 2
        : rightColumn.getBoundingClientRect().left +
          rightColumn.getBoundingClientRect().width / 2;
      exploreButton.style.left = `${center}px`;
    };

    positionExploreButton();
    window.addEventListener("resize", positionExploreButton);

    const plan = root.querySelector(".ourTenant__plan");
    let exploreDismissed = false;
    const updateExploreVisibility = () => {
      if (exploreDismissed) {
        hideExploreButton();
        return;
      }

      const detailRect = detail.getBoundingClientRect();
      const detailVisible =
        detailRect.top < window.innerHeight && detailRect.bottom > 0;
      const isMobile = window.innerWidth <= 767;

      if (isMobile && plan) {
        const planRect = plan.getBoundingClientRect();
        const planEnteredOneThird =
          planRect.top <= window.innerHeight - planRect.height / 3 &&
          planRect.bottom > 0;

        if (planEnteredOneThird && !detailVisible) {
          exploreButton.classList.remove("is-hiding");
          exploreButton.classList.add("is-visible");
        } else {
          hideExploreButton();
        }
        return;
      }

      const planRect = plan?.getBoundingClientRect();
      const planHalfVisible =
        planRect &&
        planRect.top <= window.innerHeight - planRect.height / 2 &&
        planRect.bottom > 0;

      if (!planHalfVisible || detailVisible) {
        hideExploreButton();
      } else {
        exploreButton.classList.remove("is-hiding");
        exploreButton.classList.add("is-visible");
      }
    };

    const observer = new IntersectionObserver(updateExploreVisibility, {
      threshold: 0.1
    });

    observer.observe(detail);
    if (plan) observer.observe(plan);
    window.addEventListener("scroll", updateExploreVisibility, {
      passive: true
    });
    updateExploreVisibility();
    exploreButton.addEventListener("click", () => {
      exploreDismissed = true;
      const target = detail;
      const start = window.pageYOffset;
      const targetTop = target.getBoundingClientRect().top + start - 109;
      if (window.siteLenis) {
        window.siteLenis.scrollTo(targetTop, { duration: 1.2 });
      } else {
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }
      hideExploreButton();
    });
  }
}
