(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Listings data (shared by home page, cabinet and detail page)
     --------------------------------------------------------- */
  const dealTypeLabels = { apartment: "Квартира", house: "Дом", townhouse: "Таунхаус", commercial: "Коммерческая" };

  const LISTINGS = {
    "listing-1": {
      tag: "Новостройка", tagClass: "", deal: "sale", type: "apartment",
      title: "Светлая квартира",
      subtitle: "в центре Алматы",
      price: "54 900 000 ₸", priceSuffix: "", priceValue: 54900000,
      city: "Алматы", district: "Бостандыкский р-н",
      rooms: "3 комн.", area: "92 м²", floor: "9/16 эт.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
      description: "Просторная квартира в новом жилом комплексе с закрытой территорией и подземным паркингом. Панорамные окна, чистовая отделка, до метро 7 минут пешком."
    },
    "listing-2": {
      tag: "Вторичка", tagClass: "", deal: "sale", type: "apartment",
      title: "Компактная студия",
      subtitle: "новый район Астаны",
      price: "21 200 000 ₸", priceSuffix: "", priceValue: 21200000,
      city: "Астана", district: "Есильский р-н",
      rooms: "Студия", area: "34 м²", floor: "5/12 эт.",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80",
      description: "Компактная студия с продуманной планировкой в новом районе Астаны. Подходит под аренду или для первого жилья, рядом школа и супермаркет."
    },
    "listing-3": {
      tag: "Дом", tagClass: "", deal: "sale", type: "house",
      title: "Дом с участком",
      subtitle: "тихий район Шымкента",
      price: "62 000 000 ₸", priceSuffix: "", priceValue: 62000000,
      city: "Шымкент", district: "Абайский р-н",
      rooms: "5 комн.", area: "180 м²", floor: "2 этажа",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80",
      description: "Кирпичный дом с участком 6 соток в тихом районе Шымкента. Отдельная кухня-гостиная, баня, гараж на два автомобиля, документы в порядке."
    },
    "listing-4": {
      tag: "Вторичка", tagClass: "", deal: "sale", type: "apartment",
      title: "Квартира с видом на горы",
      subtitle: "у подножия Алатау",
      price: "38 500 000 ₸", priceSuffix: "", priceValue: 38500000,
      city: "Алматы", district: "Медеуский р-н",
      rooms: "2 комн.", area: "68 м²", floor: "3/9 эт.",
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80",
      description: "Уютная квартира с ремонтом в развитом районе у подножия гор. Рядом парк и школа, из окон открывается вид на горы."
    },
    "listing-5": {
      tag: "Аренда", tagClass: "rent", deal: "rent", type: "apartment",
      title: "Меблированная квартира",
      subtitle: "центр Караганды",
      price: "180 000 ₸", priceSuffix: " / мес", priceValue: 180000,
      city: "Караганда", district: "центр",
      rooms: "2 комн.", area: "45 м²", floor: "2/5 эт.",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
      description: "Светлая квартира в центре Караганды, полностью меблирована и готова к заезду. Рядом остановки транспорта, рынок и поликлиника."
    },
    "listing-6": {
      tag: "Новостройка", tagClass: "", deal: "sale", type: "townhouse",
      title: "Таунхаус с террасой",
      subtitle: "закрытый посёлок в Астане",
      price: "71 300 000 ₸", priceSuffix: "", priceValue: 71300000,
      city: "Астана", district: "р-н Алматы",
      rooms: "4 комн.", area: "140 м²", floor: "3 этажа",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
      description: "Таунхаус в закрытом посёлке с собственным двориком и террасой. Отдельный вход, паркинг на два авто, охраняемая территория."
    }
  };

  const FEATURED_ROWS = [
    [ { id: "listing-1", size: "lg" }, { id: "listing-2", size: "sm" }, { id: "listing-3", size: "sm" } ],
    [ { id: "listing-6", size: "wide" }, { id: "listing-4", size: "sm" }, { id: "listing-5", size: "sm" } ]
  ];

  const LIFESTYLES = [
    { key: "quiet", label: "Тихо", desc: "Объекты рядом с парками и спокойными районами", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80" },
    { key: "center", label: "В центре", desc: "Городская жизнь рядом", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80" },
    { key: "family", label: "Для семьи", desc: "Больше пространства", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80" },
    { key: "view", label: "С видом", desc: "Высокие этажи и панорамы", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80" },
    { key: "minimal", label: "Минимализм", desc: "Современные интерьеры", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80" }
  ];

  const CUSTOM_KEY = "spectrum_custom_listings";
  function getCustomListings() {
    try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)) || {}; }
    catch { return {}; }
  }
  function setCustomListings(map) {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(map));
  }
  function getListingById(id) {
    return LISTINGS[id] || getCustomListings()[id] || null;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  /* ---------------------------------------------------------
     Shared card markup (home masonry, favorites, similar, stories)
     --------------------------------------------------------- */
  function cardMarkup(id, item, sizeClass) {
    const cls = sizeClass ? ` card--${sizeClass}` : "";
    return `
      <article class="card${cls}" data-city="${slug(item.city)}" data-deal="${item.deal}" data-type="${item.type}" data-price="${item.priceValue}">
        <a class="card__link" href="listing.html?id=${id}" aria-label="Открыть объект: ${escapeHtml(item.title)}"></a>
        <div class="card__media">
          <img src="${item.image}" alt="${escapeHtml(item.title)}, ${escapeHtml(item.city)}" loading="lazy">
          <button type="button" class="card__fav" aria-label="В избранное" data-fav="${id}">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 20.5s-7.5-4.6-9.7-9.3C.8 7.7 2.6 4 6.3 4c2.1 0 3.7 1.2 4.7 2.7C12 5.2 13.6 4 15.7 4c3.7 0 5.5 3.7 4 7.2-2.2 4.7-9.7 9.3-9.7 9.3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
          </button>
          <span class="card__arrow" aria-hidden="true">
            <svg viewBox="0 0 20 10"><path d="M0 5H19M19 5L14 1M19 5L14 9" stroke="currentColor" stroke-width="1.3"/></svg>
          </span>
        </div>
        <div class="card__body">
          <p class="card__price">${item.price}${item.priceSuffix ? `<span> ${item.priceSuffix}</span>` : ""}</p>
          <p class="card__meta">${escapeHtml(item.rooms)} · ${escapeHtml(item.area)} · ${escapeHtml(item.city)}, ${escapeHtml(item.district)}</p>
        </div>
      </article>`;
  }

  function slug(city) {
    const map = { "Алматы": "almaty", "Астана": "astana", "Шымкент": "shymkent", "Караганда": "karaganda" };
    return map[city] || city.toLowerCase();
  }

  function storyMarkup(id, item, index, total) {
    const num = String(index).padStart(2, "0");
    const totalStr = String(total).padStart(2, "0");
    return `
      <article class="story">
        <a class="story__link" href="listing.html?id=${id}" aria-label="Открыть историю: ${escapeHtml(item.title)}">
          <span class="story__index">${num} / ${totalStr}</span>
          <div class="story__media"><img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy"></div>
          <h3 class="story__title">${escapeHtml(item.title)}</h3>
          <p class="story__place">${escapeHtml(item.subtitle)}</p>
          <p class="story__meta">${escapeHtml(item.area)} · ${escapeHtml(item.rooms)} · ${item.price}</p>
          <span class="story__cta">Открыть историю <svg viewBox="0 0 20 10" aria-hidden="true"><path d="M0 5H19M19 5L14 1M19 5L14 9" stroke="currentColor" stroke-width="1.3"/></svg></span>
        </a>
      </article>`;
  }

  /* ---------------------------------------------------------
     Render: homepage featured masonry
     --------------------------------------------------------- */
  FEATURED_ROWS.forEach((row, i) => {
    const el = document.getElementById(`featured-row-${i + 1}`);
    if (!el) return;
    el.innerHTML = row.map(({ id, size }) => cardMarkup(id, LISTINGS[id], size)).join("");
  });

  /* ---------------------------------------------------------
     Render: homepage stories strip
     --------------------------------------------------------- */
  const storiesTrack = document.getElementById("stories-track");
  if (storiesTrack) {
    const ids = Object.keys(LISTINGS);
    storiesTrack.innerHTML = ids.map((id, i) => storyMarkup(id, LISTINGS[id], i + 1, ids.length)).join("");
  }

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------------------------------------------------
     Sticky header shadow on scroll
     --------------------------------------------------------- */
  const header = document.getElementById("site-header");
  if (header) {
    const setScrolled = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });
  }

  /* ---------------------------------------------------------
     Close mobile menu after choosing a link
     --------------------------------------------------------- */
  const menuToggle = document.getElementById("menu-toggle");
  if (menuToggle) {
    document.querySelectorAll(".nav a").forEach((link) => {
      link.addEventListener("click", () => { menuToggle.checked = false; });
    });
  }

  /* ---------------------------------------------------------
     Toast helper
     --------------------------------------------------------- */
  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toast-text");
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  /* ---------------------------------------------------------
     Favorites (shared across pages via localStorage)
     --------------------------------------------------------- */
  const FAV_KEY = "spectrum_favorites";
  function getFavorites() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
    catch { return []; }
  }
  function setFavorites(list) {
    localStorage.setItem(FAV_KEY, JSON.stringify(list));
  }
  function syncFavButtons() {
    const favorites = getFavorites();
    document.querySelectorAll("[data-fav]").forEach((btn) => {
      btn.classList.toggle("is-active", favorites.includes(btn.dataset.fav));
    });
    const favCount = document.getElementById("fav-count");
    if (favCount) favCount.textContent = String(favorites.length);
  }
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-fav]");
    if (!btn) return;
    e.preventDefault();
    const id = btn.dataset.fav;
    const favorites = getFavorites();
    const idx = favorites.indexOf(id);
    if (idx === -1) {
      favorites.push(id);
      showToast("Добавлено в избранное");
    } else {
      favorites.splice(idx, 1);
      showToast("Убрано из избранного");
    }
    setFavorites(favorites);
    syncFavButtons();
    renderCabinetFavorites();
  });
  syncFavButtons();

  /* ---------------------------------------------------------
     Hero search: filters the featured masonry grid
     --------------------------------------------------------- */
  const heroSearch = document.getElementById("hero-search");
  if (heroSearch) {
    const dealTabs = heroSearch.querySelectorAll(".search-panel__tab");
    dealTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        dealTabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
      });
    });

    heroSearch.addEventListener("submit", (e) => {
      e.preventDefault();
      const activeTab = heroSearch.querySelector(".search-panel__tab.is-active");
      const deal = activeTab ? activeTab.dataset.deal : "sale";
      const city = heroSearch.city.value;
      const type = heroSearch.type.value;
      const budget = Number(heroSearch.budget.value) || Infinity;

      const cards = document.querySelectorAll(".featured-grid .card");
      let visibleCount = 0;
      cards.forEach((card) => {
        const matches =
          card.dataset.deal === deal &&
          (city === "all" || card.dataset.city === city) &&
          (type === "all" || card.dataset.type === type) &&
          Number(card.dataset.price) <= budget;
        card.style.display = matches ? "" : "none";
        if (matches) visibleCount += 1;
      });

      const empty = document.getElementById("featured-empty");
      if (empty) empty.hidden = visibleCount > 0;

      const target = document.getElementById("featured");
      if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }

  /* ---------------------------------------------------------
     Lifestyle category selector: crossfading image panel
     --------------------------------------------------------- */
  const lifestyleList = document.getElementById("lifestyle-list");
  if (lifestyleList) {
    const imgA = document.getElementById("lifestyle-img-a");
    const imgB = document.getElementById("lifestyle-img-b");
    const desc = document.getElementById("lifestyle-desc");
    const buttons = lifestyleList.querySelectorAll("[data-lifestyle]");
    let showingA = true;

    function activate(key) {
      const item = LIFESTYLES.find((l) => l.key === key);
      if (!item) return;
      buttons.forEach((b) => b.classList.toggle("is-active", b.dataset.lifestyle === key));
      if (desc) desc.textContent = item.desc;
      if (!imgA || !imgB) return;
      const incoming = showingA ? imgB : imgA;
      const outgoing = showingA ? imgA : imgB;
      incoming.src = item.image;
      incoming.alt = item.label;
      requestAnimationFrame(() => {
        incoming.classList.add("is-active");
        outgoing.classList.remove("is-active");
      });
      showingA = !showingA;
    }

    buttons.forEach((btn) => {
      btn.addEventListener("mouseenter", () => activate(btn.dataset.lifestyle));
      btn.addEventListener("click", (e) => { e.preventDefault(); activate(btn.dataset.lifestyle); });
      btn.addEventListener("focus", () => activate(btn.dataset.lifestyle));
    });
  }

  /* ---------------------------------------------------------
     Cabinet: buyer / seller role switch
     --------------------------------------------------------- */
  const roleSwitch = document.querySelector(".role-switch");
  if (roleSwitch) {
    const roleTag = document.getElementById("role-tag");
    const panelBuyer = document.getElementById("panel-buyer");
    const panelSeller = document.getElementById("panel-seller");
    const ROLE_KEY = "spectrum_role";

    function setRole(role) {
      roleSwitch.querySelectorAll("button").forEach((b) => b.classList.toggle("is-active", b.dataset.role === role));
      panelBuyer.classList.toggle("is-active", role === "buyer");
      panelSeller.classList.toggle("is-active", role === "seller");
      if (roleTag) {
        roleTag.textContent = role === "buyer" ? "Режим покупателя" : "Режим продавца";
        roleTag.classList.toggle("profile-card__role-tag--buyer", role === "buyer");
        roleTag.classList.toggle("profile-card__role-tag--seller", role === "seller");
      }
      localStorage.setItem(ROLE_KEY, role);
    }

    roleSwitch.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => setRole(btn.dataset.role));
    });

    const params = new URLSearchParams(window.location.search);
    const initialRole = params.get("role") === "seller"
      ? "seller"
      : (localStorage.getItem(ROLE_KEY) || "buyer");
    setRole(initialRole);
  }

  /* ---------------------------------------------------------
     Cabinet: favorites grid (rendered from real favorites state)
     --------------------------------------------------------- */
  function renderCabinetFavorites() {
    const grid = document.getElementById("favorites-grid");
    const empty = document.getElementById("favorites-empty");
    if (!grid) return;
    const ids = getFavorites();
    grid.innerHTML = ids.map((id) => {
      const item = getListingById(id);
      return item ? cardMarkup(id, item) : "";
    }).join("");
    if (empty) empty.hidden = ids.length > 0;
    syncFavButtons();
  }
  renderCabinetFavorites();

  /* ---------------------------------------------------------
     Cabinet: add-listing form
     --------------------------------------------------------- */
  const toggleFormBtn = document.getElementById("toggle-form");
  const cancelFormBtn = document.getElementById("cancel-form");
  const listingForm = document.getElementById("listing-form");
  const ownedList = document.getElementById("owned-list");

  if (toggleFormBtn && listingForm) {
    toggleFormBtn.addEventListener("click", () => {
      listingForm.classList.toggle("is-open");
      if (listingForm.classList.contains("is-open")) {
        listingForm.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }
    });
  }
  if (cancelFormBtn && listingForm) {
    cancelFormBtn.addEventListener("click", () => {
      listingForm.reset();
      listingForm.classList.remove("is-open");
    });
  }

  const priceInput = document.getElementById("f-price");
  if (priceInput) {
    priceInput.addEventListener("input", () => {
      const digits = priceInput.value.replace(/\D/g, "");
      priceInput.value = digits ? Number(digits).toLocaleString("ru-RU").replace(/,/g, " ") : "";
    });
  }

  function buildOwnedRow(id, opts) {
    const row = document.createElement("div");
    row.className = "owned-row";
    row.setAttribute("data-listing", "");
    row.dataset.listingId = id;
    row.innerHTML = `
      <a class="owned-row__link" href="listing.html?id=${encodeURIComponent(id)}" aria-label="Открыть объявление: ${escapeHtml(opts.title)}"></a>
      <div class="owned-row__media${opts.image ? "" : " owned-row__media--placeholder"}">
        ${opts.image
          ? `<img src="${opts.image}" alt="${escapeHtml(opts.title)}">`
          : `<svg viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0-4 4m4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`}
      </div>
      <div class="owned-row__body">
        <p class="owned-row__title">${escapeHtml(opts.title)}</p>
        <p class="owned-row__meta"><span>${escapeHtml(opts.metaLeft)}</span><span>${escapeHtml(opts.metaMid || "-")}</span><span>${escapeHtml(opts.metaRight)}</span></p>
      </div>
      <p class="owned-row__price">${escapeHtml(opts.price)}</p>
      <span class="owned-row__status ${opts.statusClass}">${escapeHtml(opts.statusLabel)}</span>
      <div class="owned-row__actions">
        <button type="button" class="icon-btn" aria-label="Редактировать">
          <svg viewBox="0 0 24 24" fill="none"><path d="m16.5 3.5 4 4L8 20H4v-4L16.5 3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
        </button>
        <button type="button" class="icon-btn icon-btn--danger" aria-label="Удалить" data-remove-listing>
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    `;
    return row;
  }

  if (listingForm && ownedList) {
    listingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!listingForm.checkValidity()) {
        listingForm.reportValidity();
        return;
      }
      const data = new FormData(listingForm);
      const typeLabel = dealTypeLabels[data.get("type")] || "Объект";
      const deal = data.get("deal");
      const price = data.get("price") || "0";
      const priceSuffix = deal === "rent" ? " / мес" : "";
      const title = `${typeLabel}, ${data.get("area")} м², ${data.get("city")}`;
      const id = "custom-" + Date.now();

      const listingData = {
        tag: deal === "rent" ? "Аренда" : "Новое", tagClass: deal === "rent" ? "rent" : "",
        deal, type: data.get("type"),
        title, subtitle: data.get("address") || "",
        price: `${price} ₸`, priceSuffix, priceValue: Number(String(price).replace(/\D/g, "")) || 0,
        city: data.get("city"), district: data.get("address"),
        rooms: data.get("rooms") ? `${data.get("rooms")} комн.` : "-",
        area: `${data.get("area")} м²`,
        floor: data.get("floor") || "-",
        image: null,
        description: data.get("description") || "Продавец пока не добавил описание объявления."
      };
      const customListings = getCustomListings();
      customListings[id] = listingData;
      setCustomListings(customListings);

      const row = buildOwnedRow(id, {
        title,
        metaLeft: data.get("address"),
        metaMid: data.get("floor"),
        metaRight: "0 просмотров",
        price: `${price} ₸${priceSuffix}`,
        statusClass: "status--pending",
        statusLabel: "На модерации",
        image: null
      });
      ownedList.prepend(row);
      listingForm.reset();
      listingForm.classList.remove("is-open");
      showToast("Объявление отправлено на модерацию");
      row.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    });
  }

  if (ownedList) {
    ownedList.addEventListener("click", (e) => {
      const removeBtn = e.target.closest("[data-remove-listing]");
      if (!removeBtn) return;
      const row = removeBtn.closest(".owned-row");
      if (row) {
        const id = row.dataset.listingId;
        if (id && id.startsWith("custom-")) {
          const customListings = getCustomListings();
          delete customListings[id];
          setCustomListings(customListings);
        }
        row.style.transition = "opacity 0.25s ease, transform 0.25s ease";
        row.style.opacity = "0";
        row.style.transform = "translateX(-8px)";
        setTimeout(() => row.remove(), 220);
        showToast("Объявление удалено");
      }
    });
  }

  /* ---------------------------------------------------------
     Listing detail page
     --------------------------------------------------------- */
  const detailRoot = document.getElementById("listing-detail");
  if (detailRoot) {
    const notFound = document.getElementById("listing-not-found");
    const params = new URLSearchParams(window.location.search);
    const listing = getListingById(params.get("id"));

    if (!listing) {
      detailRoot.hidden = true;
      if (notFound) notFound.hidden = false;
    } else {
      document.title = `${listing.title} - Spectrum`;

      const imageEl = document.getElementById("ld-image");
      const photoEl = document.getElementById("ld-photo");
      if (listing.image) {
        imageEl.src = listing.image;
        imageEl.alt = listing.title;
      } else if (photoEl) {
        photoEl.classList.add("ld-photo--placeholder");
        imageEl.remove();
      }

      const tagEl = document.getElementById("ld-tag");
      if (tagEl) tagEl.textContent = listing.tag;

      document.getElementById("ld-price").textContent = listing.price;
      const suffixEl = document.getElementById("ld-price-suffix");
      if (suffixEl) suffixEl.textContent = listing.priceSuffix || "";
      document.getElementById("ld-title").textContent = listing.title;
      document.getElementById("ld-subtitle").textContent = listing.subtitle || `${listing.city}, ${listing.district}`;
      document.getElementById("ld-summary").textContent = `${listing.area} · ${listing.rooms} · ${listing.floor}`;
      document.getElementById("ld-description").textContent = listing.description;

      document.getElementById("ld-spec-area").textContent = listing.area;
      document.getElementById("ld-spec-rooms").textContent = listing.rooms;
      document.getElementById("ld-spec-floor").textContent = listing.floor;
      document.getElementById("ld-spec-type").textContent = dealTypeLabels[listing.type] || "-";
      document.getElementById("ld-spec-city").textContent = `${listing.city}, ${listing.district}`;

      const favBtn = document.getElementById("ld-fav");
      if (favBtn) {
        favBtn.dataset.fav = params.get("id");
        syncFavButtons();
      }

      const phoneBtn = document.getElementById("ld-phone");
      const phoneNumber = document.getElementById("ld-phone-number");
      if (phoneBtn && phoneNumber) {
        phoneBtn.addEventListener("click", () => {
          phoneNumber.textContent = "+7 (701) 555-24-10";
          phoneNumber.hidden = false;
          phoneBtn.hidden = true;
        });
      }
      const messageBtn = document.getElementById("ld-message");
      if (messageBtn) {
        messageBtn.addEventListener("click", () => showToast("Сообщение отправлено продавцу"));
      }

      const similarWrap = document.getElementById("ld-similar");
      if (similarWrap) {
        const currentId = params.get("id");
        const similarIds = Object.keys(LISTINGS).filter((key) => key !== currentId).slice(0, 3);
        similarWrap.innerHTML = similarIds.map((id) => cardMarkup(id, LISTINGS[id])).join("");
        syncFavButtons();
      }
    }
  }
})();
