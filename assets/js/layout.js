(function () {
  function syncHeaderOffset() {
    var headerHost = document.getElementById("site-header");
    var headerEl = headerHost ? headerHost.querySelector(".fixed, .sticky") : null;
    if (!headerEl) {
      document.body.style.paddingTop = "";
      document.documentElement.style.removeProperty("--site-header-height");
      return;
    }
    var headerHeight = Math.ceil(headerEl.getBoundingClientRect().height);
    document.body.style.paddingTop = String(headerHeight) + "px";
    document.documentElement.style.setProperty("--site-header-height", headerHeight + "px");
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
          "mailto:info@lopsatservicesltd.com?subject=" +
          encodeURIComponent("Newsletter signup") +
          "&body=" +
          encodeURIComponent("Please add this email to updates: " + v);
      });
    }
  }

  function needsRemoteHeader() {
    var h = document.getElementById("site-header");
    return !!(h && !h.querySelector(".sticky, .fixed"));
  }

  function needsRemoteFooter() {
    var f = document.getElementById("site-footer");
    return !!(f && !f.querySelector("footer"));
  }

  /**
   * Partials live at /partials/… on the server. Root-relative URLs avoid broken fetches when the
   * page URL is not a sibling of partials/ (e.g. clean URLs, rewrites, or trailing-slash paths).
   */
  function partialUrl(file) {
    var suffix = "partials/" + file;
    var raw = document.documentElement.getAttribute("data-base-path");
    var base = raw == null ? "" : String(raw).trim();
    var http =
      typeof location !== "undefined" &&
      location.protocol &&
      /^https?:$/i.test(location.protocol);
    if (base !== "") {
      var seg = base.replace(/^\/+/, "").replace(/\/+$/, "");
      var joined = (seg ? "/" + seg + "/" : "/") + suffix;
      return http ? joined : suffix;
    }
    return http ? "/" + suffix : suffix;
  }

  async function loadPartialsFromDisk() {
    var headerHost = document.getElementById("site-header");
    var footerHost = document.getElementById("site-footer");
    var loadHeader = needsRemoteHeader();
    var loadFooter = needsRemoteFooter();

    if (!loadHeader && !loadFooter) {
      if (headerHost) headerHost.removeAttribute("aria-busy");
      return;
    }

    try {
      if (loadHeader && loadFooter) {
        var results = await Promise.all([
          fetch(partialUrl("header.html")).then(function (r) {
            if (!r.ok) throw new Error("header");
            return r.text();
          }),
          fetch(partialUrl("footer.html")).then(function (r) {
            if (!r.ok) throw new Error("footer");
            return r.text();
          }),
        ]);
        if (headerHost) {
          headerHost.innerHTML = results[0];
          headerHost.removeAttribute("aria-busy");
        }
        if (footerHost) footerHost.innerHTML = results[1];
      } else if (loadHeader) {
        var headerHtml = await fetch(partialUrl("header.html")).then(function (r) {
          if (!r.ok) throw new Error("header");
          return r.text();
        });
        if (headerHost) {
          headerHost.innerHTML = headerHtml;
          headerHost.removeAttribute("aria-busy");
        }
      } else if (loadFooter) {
        var footerHtml = await fetch(partialUrl("footer.html")).then(function (r) {
          if (!r.ok) throw new Error("footer");
          return r.text();
        });
        if (footerHost) footerHost.innerHTML = footerHtml;
      }
    } catch (e) {
      if (headerHost) {
        headerHost.removeAttribute("aria-busy");
        if (loadHeader && !headerHost.querySelector(".sticky, .fixed")) {
          headerHost.innerHTML =
            '<p class="bg-slate-800 px-4 py-3 text-center text-sm text-amber-200">Header partial could not load. Open <code class="rounded bg-slate-900 px-1 font-mono text-xs text-slate-200">index.html</code> from this folder (header/footer are inlined), or serve via HTTP.</p>';
        }
      }
      if (
        footerHost &&
        loadFooter &&
        !footerHost.querySelector("footer")
      ) {
        footerHost.innerHTML =
          '<div class="border-t border-zinc-800 bg-zinc-950 px-4 py-8 text-center text-sm text-amber-200"><p>Footer could not load. Upload the <code class="rounded bg-black px-1.5 py-0.5 font-mono text-xs text-zinc-200">partials/</code> folder and confirm <code class="rounded bg-black px-1.5 py-0.5 font-mono text-xs text-zinc-200">/partials/footer.html</code> returns 200 in the browser.</p></div>';
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
    await loadPartialsFromDisk();
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
