(function () {
  var slides = [
    {
      tag: "Logistics & freight",
      title: "Reliable, fast, and secure logistics solutions",
      desc:
        "Lopsat Services Ltd is headquartered at Myraid business center, Juba-South Sudan (Airport R, Next to panaroma plaza). We move cargo by air, road, and sea; clear customs; handle ports and warehousing; and support corporate and residential relocations.",
      ctaHref: "logistics.html",
      ctaLabel: "Our solutions",
      image:
        "/assets/images/unsplash-1586528116311-ad8dd3c8310d.jpg",
    },
    {
      tag: "Automotive imports",
      title: "Trusted new and used vehicles from global markets",
      desc:
        "We supply durable cars sourced from Japan, the United Kingdom, Germany, and the United States. Tell us what you need and our sales team will guide delivery and documentation.",
      ctaHref: "automotive.html",
      ctaLabel: "Explore vehicles",
      image:
        "/assets/images/unsplash-semi-truck-hero.jpg",
    },
    {
      tag: "Tours & travel",
      title: "Ticketing and reservations with individual attention",
      desc:
        "From single travelers to large groups, Lopsat Tours and Travel combines flexible itineraries with cost-saving options and the same professional standards as our logistics arm.",
      ctaHref: "travel.html",
      ctaLabel: "Plan travel",
      image:
        "/assets/images/unsplash-1436491865332-7a61a109cc05.jpg",
    },
    {
      tag: "Partners worldwide",
      title: "International forwarding aligned to your supply chain",
      desc:
        "Our network of agents and counterparts helps you import, export, and distribute with options that balance speed and total landed cost—backed by specialists who stay close to your requirements.",
      ctaHref: "contact.html",
      ctaLabel: "Get a quote",
      image:
        "/assets/images/unsplash-container-trailer-hero.jpg",
    },
  ];

  var index = 0;
  var bgEls = [];
  var autoTimer = null;
  var reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var AUTO_MS = reduceMotion ? 14000 : 6500;

  function $(id) {
    return document.getElementById(id);
  }

  function preloadImages() {
    slides.forEach(function (s) {
      var img = new Image();
      img.src = s.image;
    });
  }

  function buildBackgroundLayers() {
    var root = $("hero-bg-root");
    if (!root) return;
    root.innerHTML = "";
    bgEls = [];
    var transitionClass = reduceMotion ? "" : " transition-opacity duration-[1100ms] ease-in-out";
    slides.forEach(function (s, i) {
      var el = document.createElement("div");
      el.className =
        "hero-bg-layer absolute inset-0 bg-cover bg-center bg-no-repeat" + transitionClass;
      el.style.backgroundImage = "url('" + s.image + "')";
      el.style.opacity = i === 0 ? "1" : "0";
      el.setAttribute("aria-hidden", i === 0 ? "false" : "true");
      root.appendChild(el);
      bgEls.push(el);
    });
  }

  function syncBackground() {
    bgEls.forEach(function (el, i) {
      var on = i === index;
      el.style.opacity = on ? "1" : "0";
      el.setAttribute("aria-hidden", on ? "false" : "true");
    });
  }

  function renderDots() {
    var host = $("hero-dots");
    if (!host) return;
    host.innerHTML = "";
    for (var d = 0; d < slides.length; d++) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Show highlight " + (d + 1));
      b.className =
        "pointer-events-auto h-2.5 w-2.5 rounded-full border transition " +
        (d === index
          ? "border-blue-300 bg-blue-500 shadow shadow-blue-950/40"
          : "border-slate-500 bg-transparent hover:bg-slate-700/60");
      (function (j) {
        b.addEventListener("click", function () {
          index = j;
          render();
          restartAuto();
        });
      })(d);
      host.appendChild(b);
    }
  }

  function render() {
    var s = slides[index];
    var tag = $("hero-tag");
    var title = $("hero-title");
    var desc = $("hero-desc");
    var cta = $("hero-cta");
    var ctaLabel = $("hero-cta-label");
    if (tag) tag.textContent = s.tag;
    if (title) title.textContent = s.title;
    if (desc) desc.textContent = s.desc;
    if (cta) cta.setAttribute("href", s.ctaHref);
    if (ctaLabel) ctaLabel.textContent = s.ctaLabel;
    syncBackground();
    renderDots();
  }

  function clearAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function restartAuto() {
    clearAuto();
    autoTimer = window.setInterval(function () {
      index = (index + 1) % slides.length;
      render();
    }, AUTO_MS);
  }

  function wire() {
    var up = $("hero-slide-up");
    var down = $("hero-slide-down");
    if (up) {
      up.setAttribute("aria-label", "Previous highlight");
      up.setAttribute("tabindex", "0");
      up.addEventListener("click", function () {
        index = (index - 1 + slides.length) % slides.length;
        render();
        restartAuto();
      });
    }
    if (down) {
      down.setAttribute("aria-label", "Next highlight");
      down.setAttribute("tabindex", "0");
      down.addEventListener("click", function () {
        index = (index + 1) % slides.length;
        render();
        restartAuto();
      });
    }

    var hero = $("hero");
    if (hero) {
      hero.addEventListener("mouseenter", clearAuto);
      hero.addEventListener("mouseleave", restartAuto);
    }
  }

  function init() {
    if (!$("hero-title")) return;
    preloadImages();
    buildBackgroundLayers();
    wire();
    render();
    restartAuto();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
