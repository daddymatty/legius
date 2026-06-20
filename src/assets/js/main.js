/* LEGIUS — interaction layer. Vanilla JS, no dependencies, loaded with `defer`. */
(function () {
  "use strict";

  /* ---- Google Analytics 4 (gtag.js init kept here so no inline script — CSP stays strict) ---- */
  var gaTag = document.querySelector("script[data-ga]");
  if (gaTag) {
    var gaId = gaTag.getAttribute("data-ga");
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", gaId, { anonymize_ip: true });
  }

  /* ---- Mobile navigation ---- */
  var burger = document.querySelector("[data-burger]");
  var mnav = document.querySelector("[data-mobile-nav]");
  if (burger && mnav) {
    burger.addEventListener("click", function () {
      var open = mnav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
      /* keep header fully expanded while the menu (anchored at 120px) is open */
      if (open) { var h = document.querySelector(".site-header"); if (h) h.classList.remove("util-hidden"); }
    });
    mnav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        mnav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mnav.classList.contains("open")) {
        mnav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        burger.focus();
      }
    });
  }

  /* ---- Reveal on scroll (IntersectionObserver) ---- */
  var reveals = document.querySelectorAll(".reveal");
  /* Stagger reveals that share a parent (e.g. grid cards) for a cascade effect. */
  reveals.forEach(function (el) {
    var p = el.parentNode;
    if (!p) return;
    var idx = p.__revealIdx || 0;
    if (idx > 0) el.style.setProperty("--reveal-delay", Math.min(idx * 80, 400) + "ms");
    p.__revealIdx = idx + 1;
  });
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

  /* ---- Lead forms: inline validation + POST to endpoint (Telegram proxy),
         always keep a localStorage backup. ---- */
  function setFieldError(input, msg) {
    var field = input.closest(".field");
    if (!field) return;
    field.classList.add("field--invalid");
    var err = field.querySelector(".field__err");
    if (!err) { err = document.createElement("div"); err.className = "field__err"; field.appendChild(err); }
    err.textContent = msg;
  }
  function clearFieldError(input) {
    var field = input.closest(".field");
    if (!field) return;
    field.classList.remove("field--invalid");
    var err = field.querySelector(".field__err");
    if (err) err.textContent = "";
  }
  function validateLeadForm(form) {
    var first = null;
    var name = form.querySelector("[name=name]");
    var phone = form.querySelector("[name=phone]");
    var email = form.querySelector("[name=email]");
    if (name) { if (name.value.trim().length < 2) { setFieldError(name, "Вкажіть ваше ім’я"); first = first || name; } else clearFieldError(name); }
    if (phone) { if (phone.value.replace(/\D/g, "").length < 9) { setFieldError(phone, "Вкажіть коректний номер телефону"); first = first || phone; } else clearFieldError(phone); }
    if (email && email.value.trim()) { if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) { setFieldError(email, "Невірний формат e-mail"); first = first || email; } else clearFieldError(email); }
    if (first) first.focus();
    return !first;
  }
  /* Lazy-load Cloudflare Turnstile: keep the third-party widget off the
     initial render/LCP path (the hero form card was the LCP element and had
     to wait for the widget). Load on first form engagement, with an idle
     fallback so a token still exists even without interaction. Turnstile
     implicitly renders any .cf-turnstile element once api.js loads. */
  (function () {
    if (!document.querySelector(".cf-turnstile")) return;
    var loaded = false;
    function loadTurnstile() {
      if (loaded) return;
      loaded = true;
      var s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true; s.defer = true;
      document.head.appendChild(s);
    }
    document.querySelectorAll("form[data-lead-form]").forEach(function (f) {
      f.addEventListener("focusin", loadTurnstile, { once: true });
      f.addEventListener("pointerdown", loadTurnstile, { once: true });
    });
    window.addEventListener("load", function () {
      if ("requestIdleCallback" in window) requestIdleCallback(loadTurnstile, { timeout: 5000 });
      else setTimeout(loadTurnstile, 3000);
    });
  })();

  document.querySelectorAll("form[data-lead-form]").forEach(function (form) {
    form.querySelectorAll("input, textarea").forEach(function (inp) {
      inp.addEventListener("input", function () { clearFieldError(inp); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = Object.fromEntries(new FormData(form).entries());
      if (data.company) return; /* honeypot tripped — silently drop bot submission */
      if (!validateLeadForm(form)) return; /* show inline errors, don't submit */
      data.page = location.pathname;
      data.ts = new Date().toISOString();

      try {
        var store = JSON.parse(localStorage.getItem("legius_leads") || "[]");
        store.push(data);
        localStorage.setItem("legius_leads", JSON.stringify(store));
      } catch (err) {}

      if (window.dataLayer) {
        window.dataLayer.push({ event: "lead_submit", form_id: form.id || "lead", source: data.source || "site" });
      }
      if (window.gtag) {
        window.gtag("event", "generate_lead", { form_id: form.id || "lead", source: data.source || "site" });
      }

      var note = form.querySelector(".form-note");
      var btn = form.querySelector("button[type=submit]");
      var endpoint = form.getAttribute("data-endpoint");

      var showOk = function () {
        if (note) { note.classList.remove("error"); note.classList.add("show"); }
        form.reset();
        setTimeout(function () { if (note) note.classList.remove("show"); }, 6000);
      };

      if (!endpoint) { showOk(); return; } /* no backend yet → optimistic */

      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Надсилаємо…"; }
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (r) { if (!r.ok) throw new Error("bad status"); return r; })
        .then(function () { showOk(); })
        .catch(function () {
          if (note) {
            note.textContent = "Не вдалося надіслати автоматично. Зателефонуйте нам або напишіть у месенджер.";
            note.classList.add("error", "show");
          }
        })
        .finally(function () {
          if (btn) { btn.disabled = false; if (btn.dataset.label) btn.textContent = btn.dataset.label; }
        });
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

  /* ---- Header: shadow + hide utility bar on scroll down, show on scroll up ----
     Uses a movement threshold + rAF so tiny trackpad/momentum jitters don't
     rapidly toggle the util-bar (which made the header "jump"). */
  var header = document.querySelector(".site-header");
  var progress = document.querySelector("[data-scroll-progress]");
  if (header || progress) {
    var lastToggleY = window.scrollY; // reference point for direction changes
    var THRESHOLD = 12;               // ignore movements smaller than this
    var ticking = false;
    var update = function () {
      ticking = false;
      var y = window.scrollY;
      if (header) {
        header.style.boxShadow = y > 8 ? "var(--shadow-sm)" : "none";
        if (y <= 60) {
          header.classList.remove("util-hidden"); // always expanded near the top
          lastToggleY = y;
        } else if (y - lastToggleY > THRESHOLD) {
          header.classList.add("util-hidden");     // moved down enough → collapse
          lastToggleY = y;
        } else if (lastToggleY - y > THRESHOLD) {
          header.classList.remove("util-hidden");  // moved up enough → expand
          lastToggleY = y;
        }
      }
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      }
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---- Count-up animation for big numbers (mosaic tiles) ---- */
  var counters = document.querySelectorAll(".tile__big");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (counters.length && "IntersectionObserver" in window && !reduce) {
    var fmt = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); };
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          cio.unobserve(en.target);
          var el = en.target, raw = el.textContent.trim();
          var m = raw.match(/[\d   ]+/);
          if (!m) return;
          var target = parseInt(m[0].replace(/[^\d]/g, ""), 10);
          if (!target) return;
          var prefix = raw.slice(0, m.index), suffix = raw.slice(m.index + m[0].length);
          var dur = 1100, start = null;
          var step = function (ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var val = Math.round(target * (1 - Math.pow(1 - p, 3)));
            el.textContent = prefix + fmt(val) + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---- Back-to-top button ---- */
  var toTop = document.querySelector("[data-to-top]");
  if (toTop) {
    toTop.hidden = false;
    var toggleTop = function () { toTop.classList.toggle("show", window.scrollY > 600); };
    window.addEventListener("scroll", toggleTop, { passive: true });
    toggleTop();
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- Reusable filter: chip bar + grid, toggling items by a data attribute ---- */
  function setupFilter(bar, grid, attr) {
    if (!bar || !grid) return;
    var btns = bar.querySelectorAll("[data-filter]");
    var items = grid.querySelectorAll("[" + attr + "]");
    bar.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      var f = btn.getAttribute("data-filter");
      btns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      items.forEach(function (it) {
        var show = f === "all" || it.getAttribute(attr) === f;
        it.hidden = !show;
        if (show) it.classList.add("in"); /* reveal cards that were below the fold */
      });
    });
  }
  /* Practices filter (homepage) */
  setupFilter(document.querySelector("[data-practice-filter]"), document.querySelector("[data-practice-grid]"), "data-group");
  /* Cases archive page: filter by specialization */
  setupFilter(document.querySelector("[data-cases-filter]"), document.querySelector("[data-cases-grid]"), "data-practice");

  /* Cases filter (homepage): show 2 rows (6) by default; a selected practice
     reveals all its matching cases. */
  (function () {
    var grid = document.querySelector("[data-case-grid]");
    if (!grid) return;
    var bar = document.querySelector("[data-case-filter]");
    var cards = [].slice.call(grid.querySelectorAll(".case-card"));
    var DEFAULT = 6;
    var filter = "all";
    function render() {
      var limit = filter === "all" ? DEFAULT : Infinity;
      var shown = 0;
      cards.forEach(function (c) {
        var ok = filter === "all" || c.getAttribute("data-practice") === filter;
        if (ok && shown < limit) { c.hidden = false; c.classList.add("in"); shown++; }
        else c.hidden = true;
      });
    }
    if (bar) {
      bar.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-filter]");
        if (!btn) return;
        filter = btn.getAttribute("data-filter");
        bar.querySelectorAll("[data-filter]").forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        render();
      });
    }
    render();
  })();

  /* Reviews carousel: prev/next scroll the horizontal track by one card */
  (function () {
    var car = document.querySelector("[data-carousel]");
    if (!car) return;
    var track = car.querySelector("[data-hscroll]");
    if (!track) return;
    var step = function () {
      var first = track.firstElementChild;
      return first ? first.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
    };
    var prev = car.querySelector("[data-carousel-prev]");
    var next = car.querySelector("[data-carousel-next]");
    var atEnd = function () { return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; };
    var atStart = function () { return track.scrollLeft <= 4; };
    if (next) next.addEventListener("click", function () {
      if (atEnd()) track.scrollTo({ left: 0, behavior: "smooth" });        // loop to start
      else track.scrollBy({ left: step(), behavior: "smooth" });
    });
    if (prev) prev.addEventListener("click", function () {
      if (atStart()) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" }); // loop to end
      else track.scrollBy({ left: -step(), behavior: "smooth" });
    });
  })();

  /* Blog index: practice filter + "show more" pagination (combined) */
  (function () {
    var grid = document.querySelector("[data-blog-grid]");
    if (!grid) return;
    var bar = document.querySelector("[data-blog-filter]");
    var moreWrap = document.querySelector("[data-blog-more]");
    var moreBtn = moreWrap && moreWrap.querySelector("button");
    var cards = [].slice.call(grid.querySelectorAll(".post-card"));
    var STEP = 9;
    var filter = "all";
    var limit = STEP;
    function render() {
      var matched = 0, shown = 0;
      cards.forEach(function (c) {
        var ok = filter === "all" || c.getAttribute("data-cluster") === filter;
        if (ok && shown < limit) { c.hidden = false; c.classList.add("in"); shown++; matched++; }
        else { c.hidden = true; if (ok) matched++; }
      });
      if (moreWrap) moreWrap.hidden = matched <= limit;
    }
    if (bar) {
      bar.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-filter]");
        if (!btn) return;
        filter = btn.getAttribute("data-filter");
        limit = STEP;
        bar.querySelectorAll("[data-filter]").forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        render();
      });
    }
    if (moreBtn) moreBtn.addEventListener("click", function () { limit += STEP; render(); });
    render();
  })();

  /* ---- Current year in footer ---- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
