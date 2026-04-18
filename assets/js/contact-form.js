(function () {
  var form = document.getElementById("contact-request-form");
  if (!form) return;

  var statusEl = document.getElementById("contact-form-status");

  function setStatus(msg, isError) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className =
      "mt-4 rounded-xl px-4 py-3 text-sm " +
      (isError ? "bg-red-950/50 text-red-200 ring-1 ring-red-500/30" : "bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500/25");
    if (!msg) statusEl.className = "sr-only";
  }

  function clearFieldError(input) {
    input.removeAttribute("aria-invalid");
    var id = input.getAttribute("aria-describedby");
    if (id) {
      var err = document.getElementById(id);
      if (err) err.textContent = "";
    }
  }

  function showFieldError(input, message) {
    input.setAttribute("aria-invalid", "true");
    var id = input.getAttribute("aria-describedby");
    if (id) {
      var err = document.getElementById(id);
      if (err) err.textContent = message;
    }
  }

  form.querySelectorAll("input, select, textarea").forEach(function (el) {
    el.addEventListener("input", function () {
      clearFieldError(el);
      setStatus("");
    });
    el.addEventListener("change", function () {
      clearFieldError(el);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setStatus("");

    var name = form.querySelector('[name="name"]');
    var email = form.querySelector('[name="email"]');
    var service = form.querySelector('[name="service"]');
    var message = form.querySelector('[name="message"]');
    var consent = form.querySelector('[name="consent"]');
    var phone = form.querySelector('[name="phone"]');

    var ok = true;
    if (!name || !String(name.value).trim()) {
      if (name) showFieldError(name, "Please enter your name.");
      ok = false;
    }
    if (!email || !String(email.value).trim()) {
      if (email) showFieldError(email, "Please enter your email.");
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email.value).trim())) {
      showFieldError(email, "Please enter a valid email address.");
      ok = false;
    }
    if (!service || !String(service.value).trim()) {
      if (service) showFieldError(service, "Please choose a topic.");
      ok = false;
    }
    if (!message || !String(message.value).trim()) {
      if (message) showFieldError(message, "Please describe your request.");
      ok = false;
    }
    if (!consent || !consent.checked) {
      setStatus("Please confirm we may use your details to respond to this enquiry.", true);
      ok = false;
    }
    if (!ok) return;

    var serviceLabel = service.options[service.selectedIndex].text;
    var subject = "[Website enquiry] " + serviceLabel + " — " + String(name.value).trim();
    var body =
      "Name: " +
      String(name.value).trim() +
      "\nEmail: " +
      String(email.value).trim() +
      "\nPhone: " +
      (phone && phone.value ? String(phone.value).trim() : "—") +
      "\nTopic: " +
      serviceLabel +
      "\n\nMessage:\n" +
      String(message.value).trim() +
      "\n";

    setStatus("Opening your email app… If nothing opens, email us at info@lopsatservicesltd.com", false);
    window.location.href =
      "mailto:info@lopsatservicesltd.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
  });
})();
