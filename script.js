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
})();
