(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
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
  });
  syncFavButtons();

  /* ---------------------------------------------------------
     Hero search card: deal tabs (Купить / Снять)
     --------------------------------------------------------- */
  const searchTabs = document.querySelectorAll(".search-card__tab");
  searchTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      searchTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
    });
  });

  /* ---------------------------------------------------------
     Listing filter chips (home page)
     --------------------------------------------------------- */
  const chipRow = document.querySelector(".chip-row");
  const listingGrid = document.getElementById("listing-grid");
  if (chipRow && listingGrid) {
    const chips = chipRow.querySelectorAll(".chip");
    const cards = listingGrid.querySelectorAll(".card");

    function applyFilter(filter) {
      cards.forEach((card) => {
        const matches =
          filter === "all" ||
          card.dataset.city === filter ||
          (filter === "rent" && card.dataset.deal === "rent");
        card.style.display = matches ? "" : "none";
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        applyFilter(chip.dataset.filter);
      });
    });

    const heroSearch = document.getElementById("hero-search");
    if (heroSearch) {
      heroSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const city = heroSearch.city.value;
        const targetChip = chipRow.querySelector(`[data-filter="${city}"]`) || chipRow.querySelector('[data-filter="all"]');
        chips.forEach((c) => c.classList.remove("is-active"));
        targetChip.classList.add("is-active");
        applyFilter(targetChip.dataset.filter);
        listingGrid.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      });
    }
  }

  /* ---------------------------------------------------------
     How it works: buyer / seller step toggle
     --------------------------------------------------------- */
  const howToggle = document.querySelector(".how-toggle");
  if (howToggle) {
    const buySteps = document.querySelector(".steps--buy");
    const sellSteps = document.querySelector(".steps--sell");
    howToggle.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        howToggle.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
        btn.classList.add("is-active");
        const showSell = btn.dataset.how === "sell";
        buySteps.hidden = showSell;
        sellSteps.hidden = !showSell;
      });
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
     Cabinet: favorites empty state
     --------------------------------------------------------- */
  const favoritesGrid = document.getElementById("favorites-grid");
  const favoritesEmpty = document.getElementById("favorites-empty");
  if (favoritesGrid && favoritesEmpty) {
    function updateFavoritesEmptyState() {
      const visibleCards = favoritesGrid.querySelectorAll(".card");
      favoritesEmpty.hidden = visibleCards.length > 0;
    }
    updateFavoritesEmptyState();
  }

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

  const dealTypeLabels = { apartment: "Квартира", house: "Дом", townhouse: "Таунхаус", commercial: "Коммерческая" };

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
      const priceSuffix = deal === "rent" ? " ₸ / мес" : " ₸";

      const row = document.createElement("div");
      row.className = "owned-row";
      row.setAttribute("data-listing", "");
      row.innerHTML = `
        <div class="owned-row__media owned-row__media--placeholder">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0-4 4m4-4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </div>
        <div class="owned-row__body">
          <p class="owned-row__title">${typeLabel}, ${escapeHtml(data.get("area"))} м², ${escapeHtml(data.get("city"))}</p>
          <p class="owned-row__meta"><span>${escapeHtml(data.get("address"))}</span><span>${escapeHtml(data.get("floor") || "—")}</span><span>0 просмотров</span></p>
        </div>
        <p class="owned-row__price">${escapeHtml(price)}${priceSuffix}</p>
        <span class="owned-row__status status--pending">На модерации</span>
        <div class="owned-row__actions">
          <button type="button" class="icon-btn" aria-label="Редактировать">
            <svg viewBox="0 0 24 24" fill="none"><path d="m16.5 3.5 4 4L8 20H4v-4L16.5 3.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
          </button>
          <button type="button" class="icon-btn icon-btn--danger" aria-label="Удалить" data-remove-listing>
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      `;
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
        row.style.transition = "opacity 0.25s ease, transform 0.25s ease";
        row.style.opacity = "0";
        row.style.transform = "translateX(-8px)";
        setTimeout(() => row.remove(), 220);
        showToast("Объявление удалено");
      }
    });
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }
})();
