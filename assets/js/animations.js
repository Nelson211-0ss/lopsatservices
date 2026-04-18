(function () {
  var reduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var io = null;
  var scheduled = false;

  function revealAll() {
    document.querySelectorAll("[data-reveal], [data-reveal-stagger]").forEach(function (el) {
      el.classList.add("is-inview");
    });
  }

  function ensureObserver() {
    if (io) return io;
    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("is-inview");
          io.unobserve(en.target);
        });
      },
      {
        threshold: 0.06,
        rootMargin: "0px 0px -10% 0px",
      }
    );
    return io;
  }

  function observeRevealables() {
    if (reduced) {
      revealAll();
      return;
    }

    var observer = ensureObserver();
    document.querySelectorAll("[data-reveal], [data-reveal-stagger]").forEach(function (el) {
      if (el.classList.contains("is-inview")) return;
      observer.observe(el);
    });
  }

  function scheduleObserve() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      observeRevealables();
    });
  }

  function init() {
    scheduleObserve();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Footer/header injected after fetch — pick up new [data-reveal] nodes */
  window.addEventListener("lopsat:layout-ready", function () {
    if (reduced) {
      revealAll();
      return;
    }
    scheduleObserve();
  });
})();
