(function () {
  function syncHeaderOffset() {
    var headerHost = document.getElementById("site-header");
    var headerEl = headerHost ? headerHost.querySelector(".fixed, .sticky") : null;
    if (!headerEl) {
      document.body.style.paddingTop = "";
      return;
    }
    var headerHeight = Math.ceil(headerEl.getBoundingClientRect().height);
    document.body.style.paddingTop = String(headerHeight) + "px";
  }

  function bindMobileNav() {
    var btn = document.getElementById("menu-btn");
    var nav = document.getElementById("mobile-nav");
    var openIcon = document.getElementById("icon-open");
    var closeIcon = document.getElementById("icon-close");
    if (!btn || !nav) return;

    btn.addEventListener("click", function () {
      nav.classList.toggle("hidden");
      var menuOpen = !nav.classList.contains("hidden");
      btn.setAttribute("aria-expanded", menuOpen ? "true" : "false");
      btn.setAttribute("aria-label", menuOpen ? "Close menu" : "Open menu");
      if (openIcon && closeIcon) {
        openIcon.classList.toggle("hidden", menuOpen);
        closeIcon.classList.toggle("hidden", !menuOpen);
      }
      syncHeaderOffset();
    });

    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.add("hidden");
        btn.setAttribute("aria-expanded", "false");
        if (openIcon && closeIcon) {
          openIcon.classList.remove("hidden");
          closeIcon.classList.add("hidden");
        }
        syncHeaderOffset();
      });
    });
  }

  function setYear() {
    var y = document.getElementById("y");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function bindSearchPlaceholder() {
    var s = document.getElementById("header-search-btn");
    if (s) {
      s.addEventListener("click", function () {
        window.location.href = "index.html#logistics";
      });
    }
  }

  function bindFooter() {
    var topBtn = document.getElementById("footer-back-top");
    if (topBtn) {
      topBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
    var form = document.getElementById("footer-newsletter-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var emailInput = form.querySelector('[name="email"]');
        var privacy = form.querySelector('[name="privacy"]');
        if (!privacy || !privacy.checked) {
          window.alert("Please agree to the privacy policy to subscribe.");
          return;
        }
        var v = emailInput && emailInput.value ? String(emailInput.value).trim() : "";
        if (!v) {
          window.alert("Please enter your email address.");
          return;
        }
        window.location.href =
          "mailto:sales@lopsatservicesltd.com?subject=" +
          encodeURIComponent("Newsletter signup") +
          "&body=" +
          encodeURIComponent("Please add this email to updates: " + v);
      });
    }
  }

  function needsRemotePartials() {
    var h = document.getElementById("site-header");
    if (!h) return false;
    return !h.querySelector(".sticky, .fixed");
  }

  async function loadPartialsFromDisk() {
    var headerHost = document.getElementById("site-header");
    var footerHost = document.getElementById("site-footer");
    var base = document.documentElement.dataset.basePath || "";
    try {
      var results = await Promise.all([
        fetch(base + "partials/header.html").then(function (r) {
          if (!r.ok) throw new Error("header");
          return r.text();
        }),
        fetch(base + "partials/footer.html").then(function (r) {
          if (!r.ok) throw new Error("footer");
          return r.text();
        }),
      ]);
      if (headerHost) {
        headerHost.innerHTML = results[0];
        headerHost.removeAttribute("aria-busy");
      }
      if (footerHost) footerHost.innerHTML = results[1];
    } catch (e) {
      if (headerHost) {
        headerHost.removeAttribute("aria-busy");
        if (!headerHost.querySelector(".sticky, .fixed")) {
          headerHost.innerHTML =
            '<p class="bg-slate-800 px-4 py-3 text-center text-sm text-amber-200">Header partial could not load. Open <code class="rounded bg-slate-900 px-1 font-mono text-xs text-slate-200">index.html</code> from this folder (header/footer are inlined), or serve via HTTP.</p>';
        }
      }
      console.error(e);
    }
    if (typeof tailwind !== "undefined" && typeof tailwind.refresh === "function") {
      tailwind.refresh();
    }
  }

  function initShell() {
    bindMobileNav();
    bindSearchPlaceholder();
    setYear();
    bindFooter();
    syncHeaderOffset();
    window.addEventListener("resize", syncHeaderOffset);
    window.dispatchEvent(new CustomEvent("lopsat:layout-ready"));
  }

  async function boot() {
    if (needsRemotePartials()) {
      await loadPartialsFromDisk();
    } else {
      var headerHost = document.getElementById("site-header");
      if (headerHost) headerHost.removeAttribute("aria-busy");
    }
    if (typeof tailwind !== "undefined" && typeof tailwind.refresh === "function") {
      tailwind.refresh();
    }
    initShell();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
