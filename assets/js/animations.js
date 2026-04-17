(function () {
  var reduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function revealAll() {
    document.querySelectorAll("[data-reveal], [data-reveal-stagger]").forEach(function (el) {
      el.classList.add("is-inview");
    });
  }

  function init() {
    if (reduced) {
      revealAll();
      return;
    }

    var els = document.querySelectorAll("[data-reveal]");
    var staggerParents = document.querySelectorAll("[data-reveal-stagger]");

    if (!els.length && !staggerParents.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("is-inview");
          io.unobserve(en.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );

    els.forEach(function (el) {
      io.observe(el);
    });
    staggerParents.forEach(function (el) {
      io.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
