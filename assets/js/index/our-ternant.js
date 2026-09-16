"use strict";

const ourTernant = document.querySelector(".ourTernant");

if (ourTernant) {
  const tenantData = {
    b1f: [
      {
        id: "gs25",
        name: "GS25",
        logo: "./assets/images/tenants/gs25.svg",
        location: "Hospitality Tower",
        open: "10:00 - 21:00",
        website: "gs25.com.vn",
        url: "https://gs25.com.vn/",
        tel: "1900 63 60 78",
        content: `
          <p>GS25 is a leading South Korean convenience-store brand, offering a practical mix of ready-to-eat food, beverages and everyday essentials. Its IFC Hanoi location is designed as a quick, welcoming stop for office workers, residents and visitors throughout the day.</p>
          <p>Alongside familiar convenience products, guests can discover Korean-inspired snacks, seasonal selections and freshly prepared options in a modern retail setting. This sample copy can be replaced when the official tenant information is ready.</p>
        `,
        media: ["retail-1.jpg", "img-4.jpg", "retail-4.jpg"]
      },
      {
        id: "adidas",
        name: "adidas",
        logo: "./assets/images/tenants/adidas.svg",
        location: "Retail Podium",
        open: "09:30 - 21:30",
        website: "adidas.com.vn",
        url: "https://www.adidas.com.vn/",
        tel: "Updating",
        content: `
          <p>Adidas brings performance, comfort and contemporary street style together through footwear, apparel and accessories for sport and everyday life. The IFC Hanoi store presents the brand in a clean, energetic space with collections for a wide range of activities.</p>
          <p>Visitors can explore seasonal releases, sport essentials and lifestyle favourites supported by in-store advice. This placeholder editorial content can be updated with the tenant's official introduction and campaign imagery later.</p>
        `,
        media: ["retail-2.jpg", "img-5.jpg"]
      },
      { id: "annam", name: "Annam Gourmet", media: ["retail-3.jpg"] },
      { id: "akemi", name: "AKEMI", media: ["img-1.jpg", "img-2.jpg"] },
      { id: "anta", name: "ANTA", media: ["retail-4.jpg"] },
      {
        id: "bath-body-works",
        name: "Bath & Body Works",
        media: ["img-6.jpg", "img-7.jpg"]
      }
    ],
    "1f": [
      {
        id: "texas",
        name: "Texas Chicken",
        open: "<p>Buổi sáng 9:00 - 12:00</p><p>Buổi chiều 13:00 - 18:00</p>",
        media: ["retail-1.jpg", "img-4.jpg"]
      },
      { id: "kfc", name: "KFC", media: ["retail-2.jpg"] },
      { id: "starbucks", name: "Starbucks", media: ["retail-3.jpg", "img-5.jpg"] },
      { id: "highlands", name: "Highlands Coffee", media: ["retail-4.jpg"] },
      { id: "pizza-4ps", name: "Pizza 4P's", media: ["img-6.jpg"] },
      { id: "jollibee", name: "Jollibee", media: ["img-7.jpg", "img-8.jpg"] }
    ],
    "2f": [
      { id: "uniqlo", name: "UNIQLO", media: ["img-1.jpg", "retail-2.jpg"] },
      { id: "guardian", name: "Guardian", media: ["img-2.jpg"] },
      { id: "muji", name: "MUJI", media: ["img-3.jpg", "retail-3.jpg"] },
      { id: "nike", name: "Nike", media: ["img-4.jpg"] },
      { id: "skechers", name: "Skechers", media: ["img-5.jpg"] },
      { id: "watsons", name: "Watsons", media: ["img-6.jpg", "img-7.jpg"] }
    ],
    "3f": [
      { id: "cgv", name: "CGV Cinemas", media: ["img-6.jpg", "img-7.jpg"] },
      { id: "california", name: "California Fitness", media: ["img-8.jpg"] },
      { id: "lotte", name: "Lotte Mart", media: ["retail-4.jpg", "img-4.jpg"] },
      { id: "ti-ni-world", name: "tiNiWorld", media: ["img-5.jpg"] }
    ]
  };

  const floorTabs = Array.from(ourTernant.querySelectorAll("[data-floor-tab]"));
  const floorSelect = ourTernant.querySelector("[data-floor-select]");
  const tenantList = ourTernant.querySelector("[data-tenant-list]");
  const tenantDetail = ourTernant.querySelector("[data-tenant-detail]");
  const planImage = ourTernant.querySelector("[data-floor-plan]");
  let activeFloor = "b1f";
  let mediaSlider = null;

  const getTenantContent = (tenant) =>
    tenant.content || `
      <p>${tenant.name} brings a distinctive retail experience to IFC Hanoi, adding more choice and convenience for office workers, residents and visitors.</p>
      <p>This is sample tenant content. Official brand information, opening hours, contact details and campaign imagery can be updated when the final materials are available.</p>
    `;

  const destroyMediaSlider = () => {
    if (!mediaSlider) return;
    mediaSlider.destroy(true, true);
    mediaSlider = null;
  };

  const renderTenantDetail = (tenant) => {
    destroyMediaSlider();
    const content = getTenantContent(tenant);
    const media = tenant.media || [];
    const hasMultipleMedia = media.length > 1;

    tenantDetail.innerHTML = `
      <article id="tenant-${tenant.id}" class="ourTernant__article" role="tabpanel">
        <div class="ourTernant__article-head">
          <h3 class="ourTernant__title">${tenant.name}</h3>
          <dl class="ourTernant__meta">
            <div><dt>Floor</dt><dd>${activeFloor.toUpperCase()}</dd></div>
            <div><dt>Location</dt><dd>${tenant.location || "Retail Podium"}</dd></div>
            <div><dt>Open</dt><dd>${tenant.open || "09:30 - 21:30"}</dd></div>
            <div><dt>Website</dt><dd>${tenant.url ? `<a href="${tenant.url}">${tenant.website}</a>` : "Updating"}</dd></div>
            <div><dt>Tel</dt><dd>${
              tenant.tel && tenant.tel !== "Updating"
                ? `<a href="tel:${tenant.tel.replace(/\s/g, "")}">${tenant.tel}</a>`
                : "Updating"
            }</dd></div>
          </dl>
        </div>
        <div class="ourTernant__copy ourTernant__editor-content" data-acf-field="content">
          ${content}
        </div>
        <div class="ourTernant__media${hasMultipleMedia ? "" : " is-single"}">
          <div class="swiper ourTernant__media-slider">
            <div class="swiper-wrapper">
              ${media.map((image) => `<div class="swiper-slide"><img src="./assets/images/del/${image}" alt="${tenant.name} placeholder media" /></div>`).join("")}
            </div>
          </div>
          <div class="ourTernant__media-nav" aria-hidden="${!hasMultipleMedia}">
            <button class="ourTernant__media-prev" type="button" aria-label="Previous image">
              <svg viewBox="0 0 52 22" aria-hidden="true">
                <path d="M52 11H1M1 11 11 1M1 11l10 10" />
              </svg>
            </button>
            <button class="ourTernant__media-next" type="button" aria-label="Next image">
              <svg viewBox="0 0 52 22" aria-hidden="true">
                <path d="M0 11h51M51 11 41 1M51 11 41 21" />
              </svg>
            </button>
          </div>
        </div>
      </article>`;

    if (hasMultipleMedia) {
      mediaSlider = new Swiper(
        tenantDetail.querySelector(".ourTernant__media-slider"),
        {
          slidesPerView: 1,
          speed: 800,
          loop: true,
          grabCursor: true,
          navigation: {
            prevEl: tenantDetail.querySelector(".ourTernant__media-prev"),
            nextEl: tenantDetail.querySelector(".ourTernant__media-next")
          }
        }
      );
    }
  };

  const selectTenant = (tenantId, focus = false) => {
    const tenants = tenantData[activeFloor];
    const tenant = tenants.find((item) => item.id === tenantId);
    const cards = Array.from(tenantList.querySelectorAll("[data-tenant]"));
    const activeCard = cards.find((card) => card.dataset.tenant === tenantId);
    if (!tenant || !activeCard) return;

    cards.forEach((card) => {
      const isActive = card === activeCard;
      card.classList.toggle("active", isActive);
      card.setAttribute("aria-selected", String(isActive));
      card.tabIndex = isActive ? 0 : -1;
    });

    renderTenantDetail(tenant);
    if (focus) activeCard.focus();
  };

  const bindTenantEvents = () => {
    const cards = Array.from(tenantList.querySelectorAll("[data-tenant]"));
    cards.forEach((card, index) => {
      card.addEventListener("click", () => selectTenant(card.dataset.tenant));
      card.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % cards.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + cards.length) % cards.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = cards.length - 1;
        selectTenant(cards[nextIndex].dataset.tenant, true);
      });
    });
  };

  const renderTenantList = () => {
    const tenants = tenantData[activeFloor];
    tenantList.innerHTML = tenants
      .map(
        (tenant, index) => `
          <button class="ourTernant__tenant-card${index === 0 ? " active" : ""}" type="button" role="tab" aria-label="${tenant.name}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-tenant="${tenant.id}">
            ${tenant.logo
              ? `<img class="ourTernant__tenant-logo-image" src="${tenant.logo}" alt="" />`
              : `<span class="ourTernant__tenant-logo ourTernant__tenant-logo--${tenant.id}" aria-hidden="true">${tenant.name}</span>`}
          </button>`
      )
      .join("");
    bindTenantEvents();
    renderTenantDetail(tenants[0]);
  };

  const selectFloor = (tab, focus = false) => {
    if (!tab || !planImage) return;
    activeFloor = tab.dataset.floor;
    if (floorSelect) floorSelect.value = activeFloor;
    floorTabs.forEach((floorTab) => {
      const isActive = floorTab === tab;
      floorTab.classList.toggle("active", isActive);
      floorTab.setAttribute("aria-selected", String(isActive));
      floorTab.tabIndex = isActive ? 0 : -1;
    });

    planImage.classList.add("is-changing");
    planImage.onload = () => planImage.classList.remove("is-changing");
    planImage.alt = `${tab.textContent.trim()} floor plan`;
    planImage.src = tab.dataset.plan;
    renderTenantList();
    if (focus) tab.focus();
  };

  floorTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectFloor(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % floorTabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + floorTabs.length) % floorTabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = floorTabs.length - 1;
      selectFloor(floorTabs[nextIndex], true);
    });
  });

  floorSelect?.addEventListener("change", () => {
    const selectedTab = floorTabs.find(
      (tab) => tab.dataset.floor === floorSelect.value
    );
    selectFloor(selectedTab);
  });

  renderTenantList();
}
