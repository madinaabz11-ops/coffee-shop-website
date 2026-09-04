(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll-reveal
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
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // Active nav link tracking
  const navLinks = document.querySelectorAll(".nav a[data-nav]");
  const hero = document.getElementById("hero");
  const sections = Array.from(navLinks)
    .map((link) => document.getElementById(link.dataset.nav))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === hero) {
            if (entry.isIntersecting) {
              navLinks.forEach((l) => l.classList.remove("is-active"));
            }
            return;
          }
          const link = document.querySelector(`.nav a[data-nav="${entry.target.id}"]`);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => navObserver.observe(section));
    if (hero) navObserver.observe(hero);
  }

  // Close mobile menu after choosing a link
  const menuToggle = document.getElementById("menu-toggle");
  if (menuToggle) {
    document.querySelectorAll(".nav a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.checked = false;
      });
    });
  }

  // Commerce modal (booking / order -> WhatsApp handoff)
  const WHATSAPP_NUMBER = "77083659156";
  const MODAL_COPY = {
    booking: { eyebrow: "Забронировать столик", title: "Оставьте контакты" },
    order: { eyebrow: "Заказать кофе", title: "Что вам собрать?" },
  };

  const modal = document.getElementById("commerce-modal");
  const modalForm = document.getElementById("commerce-form");

  if (modal && modalForm) {
    const modalEyebrow = document.getElementById("modal-eyebrow");
    const modalTitle = document.getElementById("modal-title");
    let lastFocused = null;

    const phoneField = document.getElementById("cf-phone");
    if (phoneField) {
      const formatPhone = (raw) => {
        let digits = raw.replace(/\D/g, "");
        if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
        digits = digits.slice(0, 10);
        let out = "+7";
        if (digits.length > 0) out += " " + digits.slice(0, 3);
        if (digits.length > 3) out += " " + digits.slice(3, 6);
        if (digits.length > 6) out += "-" + digits.slice(6, 8);
        if (digits.length > 8) out += "-" + digits.slice(8, 10);
        return out;
      };
      phoneField.addEventListener("input", () => {
        phoneField.value = formatPhone(phoneField.value);
      });
      phoneField.addEventListener("focus", () => {
        if (!phoneField.value) phoneField.value = "+7 ";
      });
    }

    const dateField = document.getElementById("cf-date");
    const timeField = document.getElementById("cf-time");
    if (dateField) {
      const toISODate = (d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const today = new Date();
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + 89);
      dateField.min = toISODate(today);
      dateField.max = toISODate(maxDate);
    }

    const openModal = (mode) => {
      const resolvedMode = mode in MODAL_COPY ? mode : "booking";
      const copy = MODAL_COPY[resolvedMode];
      modal.dataset.mode = resolvedMode;
      modalEyebrow.textContent = copy.eyebrow;
      modalTitle.textContent = copy.title;
      const isBooking = resolvedMode === "booking";
      if (dateField) dateField.required = isBooking;
      if (timeField) timeField.required = isBooking;
      lastFocused = document.activeElement;
      if (menuToggle) menuToggle.checked = false;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      const firstField = document.getElementById("cf-name");
      if (firstField) firstField.focus();
    };

    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused instanceof HTMLElement) lastFocused.focus();
    };

    document.querySelectorAll("[data-modal-open]").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.dataset.modalOpen));
    });

    modal.querySelectorAll("[data-modal-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });

    modalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const mode = modal.dataset.mode || "booking";
      const name = modalForm.name.value.trim();
      const phone = modalForm.phone.value.trim();
      let message;

      if (mode === "order") {
        const order = modalForm.order.value.trim();
        message = `Здравствуйте! Хочу заказать кофе с собой в ХВОЯ.\nИмя: ${name}\nТелефон: ${phone}\nЗаказ: ${order || "уточню по звонку"}`;
      } else {
        const date = modalForm.date.value || "уточню";
        const time = modalForm.time.value || "уточню";
        const guests = modalForm.guests.value || "2";
        message = `Здравствуйте! Хочу забронировать столик в ХВОЯ.\nИмя: ${name}\nТелефон: ${phone}\nДата: ${date}\nВремя: ${time}\nГостей: ${guests}`;
      }

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener");
      closeModal();
      modalForm.reset();
    });
  }

  // Map modal (pin badge -> map popup, no navigation away from the site)
  const mapModal = document.getElementById("map-modal");
  if (mapModal) {
    const mapIframe = mapModal.querySelector("iframe");
    let mapLastFocused = null;

    const openMapModal = () => {
      if (mapIframe && !mapIframe.src) mapIframe.src = mapIframe.dataset.src;
      mapLastFocused = document.activeElement;
      if (menuToggle) menuToggle.checked = false;
      mapModal.classList.add("is-open");
      mapModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      mapModal.querySelector(".modal__close").focus();
    };

    const closeMapModal = () => {
      mapModal.classList.remove("is-open");
      mapModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (mapLastFocused instanceof HTMLElement) mapLastFocused.focus();
    };

    document.querySelectorAll("[data-map-open]").forEach((btn) => {
      btn.addEventListener("click", openMapModal);
    });
    mapModal.querySelectorAll("[data-map-close]").forEach((el) => {
      el.addEventListener("click", closeMapModal);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mapModal.classList.contains("is-open")) closeMapModal();
    });
  }
})();
