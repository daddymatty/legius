/* LEGIUS — interaction layer. Vanilla JS, no dependencies, loaded with `defer`. */
(function () {
  "use strict";

  /* ---- Mobile navigation ---- */
  var burger = document.querySelector("[data-burger]");
  var mnav = document.querySelector("[data-mobile-nav]");
  if (burger && mnav) {
    burger.addEventListener("click", function () {
      var open = mnav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mnav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        mnav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* ---- Reveal on scroll (IntersectionObserver) ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      /* threshold 0 = reveal as soon as any part enters — works for tall blocks too */
      { threshold: 0, rootMargin: "0px 0px -5% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
    /* Safety net: if anything is still hidden shortly after load, force-reveal it. */
    window.addEventListener("load", function () {
      setTimeout(function () {
        reveals.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
        });
      }, 300);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Lead forms (front-end capture, no backend dependency) ---- */
  document.querySelectorAll("form[data-lead-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = Object.fromEntries(new FormData(form).entries());
      data.page = location.pathname;
      data.ts = new Date().toISOString();
      try {
        var store = JSON.parse(localStorage.getItem("legius_leads") || "[]");
        store.push(data);
        localStorage.setItem("legius_leads", JSON.stringify(store));
      } catch (err) {}

      /* Hook point for real integrations (CRM / endpoint / GTM). */
      if (window.dataLayer) {
        window.dataLayer.push({ event: "lead_submit", form_id: form.id || "lead", source: data.source || "site" });
      }
      // Example endpoint (configure on deploy):
      // fetch('/api/lead', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});

      var note = form.querySelector(".form-note");
      if (note) note.classList.add("show");
      form.reset();
      setTimeout(function () { if (note) note.classList.remove("show"); }, 6000);
    });
  });

  /* ---- TOC active highlight on article pages ---- */
  var tocLinks = document.querySelectorAll(".toc a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });
    var tocIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            tocLinks.forEach(function (a) { a.style.color = ""; a.style.fontWeight = ""; });
            var active = map[en.target.id];
            if (active) { active.style.color = "var(--c-gold)"; active.style.fontWeight = "700"; }
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    Object.keys(map).forEach(function (id) { tocIo.observe(document.getElementById(id)); });
  }

  /* ---- Header shadow on scroll ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.style.boxShadow = window.scrollY > 8 ? "var(--shadow-sm)" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Current year in footer ---- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
