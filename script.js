/* ================= PAGE LOADER CONTROL ================= */

window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  const MIN_DISPLAY = 1500; // keep loader at least this long (ms)
  const MAX_WAIT = 8000; // safety net (ms) in case model never fires 'load'
  let hidden = false;
  const start = Date.now();

  function hideLoader() {
    if (hidden) return;
    hidden = true;
    loader.classList.add("hide");
  }

  // Use a direct query here to avoid any temporal ordering issues
  const mainModel = document.querySelector(".showcase__model");

  if (mainModel) {
    mainModel.addEventListener("load", () => {
      const elapsed = Date.now() - start;
      const delay = Math.max(0, MIN_DISPLAY - elapsed);
      setTimeout(hideLoader, delay);
    }, { once: true });

    mainModel.addEventListener("error", () => {
      const elapsed = Date.now() - start;
      const delay = Math.max(0, MIN_DISPLAY - elapsed);
      setTimeout(hideLoader, delay);
      console.warn("Main model failed to load — hiding loader after minimum display time.");
    }, { once: true });
  } else {
    // fallback: hide after minimum display time
    setTimeout(hideLoader, MIN_DISPLAY);
  }

  // Safety net: hide after MAX_WAIT no matter what
  setTimeout(() => {
    hideLoader();
    document.body.classList.add("model-load-timeout");
    console.warn("Loader hidden after timeout waiting for model load.");
  }, MAX_WAIT);

  // Start resource preloading (kept from original logic)
  setTimeout(() => {
    preloadHighPriority();
    setTimeout(preloadMediumPriority, 1200);
    setTimeout(preloadLowPriority, 3000);
  }, 500);
});

/* =====================================================
   1️⃣ MODEL VIEWER + PRIORITY PRELOADING (TOP PRIORITY)
===================================================== */

const MODELS = [
  "./model/headphone.glb", // immediate
  "./model/h1.glb",        // high
  "./model/h2.glb",        // medium
  "./model/h3.glb"         // low
];

let currentModelIndex = 0;

const modelViewer = document.querySelector(".showcase__model");
const title = document.querySelector(".title");
const radios = document.querySelectorAll('input[name="modelColor"]');
const prevBtn = document.querySelector(".next img:first-child");
const nextBtn = document.querySelector(".next img:last-child");

function preloadHighPriority() {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "fetch";
  link.href = MODELS[1];
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

function preloadMediumPriority() {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "fetch";
  link.href = MODELS[2];
  document.head.appendChild(link);
}

function preloadLowPriority() {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "fetch";
      link.href = MODELS[3];
      document.head.appendChild(link);
    });
  }
}

function loadModel(index) {
  if (!modelViewer) return;

  modelViewer.classList.add("loading");
  modelViewer.setAttribute("src", MODELS[index]);

  modelViewer.addEventListener("load", () => {
    modelViewer.classList.remove("loading");
  }, { once: true });

  modelViewer.addEventListener("error", () => {
    modelViewer.classList.remove("loading");
  }, { once: true });
}

// Preload logic merged into the main 'load' handler above.

prevBtn?.addEventListener("click", () => {
  currentModelIndex =
    (currentModelIndex - 1 + MODELS.length) % MODELS.length;
  loadModel(currentModelIndex);
});

nextBtn?.addEventListener("click", () => {
  currentModelIndex =
    (currentModelIndex + 1) % MODELS.length;
  loadModel(currentModelIndex);
});

radios.forEach(radio => {
  radio.addEventListener("change", () => {
    const value = radio.value;
    modelViewer?.setAttribute("exposure", value);

    if (!title) return;
    if (value === "1") title.style.color = "#ffffff";
    if (value === "12") title.style.color = "#282828";
    if (value === "6") title.style.color = "#3c3c3c";
  });
});


/* =====================================================
   2️⃣ TESTIMONIAL SLIDER (NON-CRITICAL)
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const cards = document.querySelectorAll(".testimonial-card");
  const track = document.querySelector(".testimonial-track");
  const testimonialsRight = document.querySelector(".testimonials-right");

  let testimonialIndex = 0;

  if (cards.length && track && testimonialsRight) {
    const cardHeightWithMargin = cards[0].offsetHeight + 16;
    const containerHeight = testimonialsRight.clientHeight;
    const cardHeight = cards[0].offsetHeight;
    const initialOffset = (containerHeight / 2) - (cardHeight / 2);

    function updateTestimonialSlider() {
      const translateY =
        initialOffset - testimonialIndex * cardHeightWithMargin;
      track.style.transform = `translateY(${translateY}px)`;

      cards.forEach((card, i) =>
        card.classList.toggle("active", i === testimonialIndex)
      );
    }

    updateTestimonialSlider();

    document.getElementById("next")?.addEventListener("click", () => {
      if (testimonialIndex < cards.length - 1) {
        testimonialIndex++;
        updateTestimonialSlider();
      }
    });

    document.getElementById("prev")?.addEventListener("click", () => {
      if (testimonialIndex > 0) {
        testimonialIndex--;
        updateTestimonialSlider();
      }
    });
  }

});

/* =====================================================
   4️⃣ FAQ ACCORDION (FEATURES SECTION)
===================================================== */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const header = item.querySelector(".faq-header");

  header.addEventListener("click", () => {

    // Close all other items
    faqItems.forEach(other => {
      if (other !== item) {
        other.classList.remove("active");
        const icon = other.querySelector(".icon");
        if (icon) icon.textContent = "+";
      }
    });

    // Toggle current
    item.classList.toggle("active");

    const icon = item.querySelector(".icon");
    if (icon) {
      icon.textContent = item.classList.contains("active") ? "−" : "+";
    }
  });
});

/* =====================================================
   3️⃣ PRODUCT BANNER THUMB SWITCH (LOW PRIORITY)
===================================================== */

const thumbs = document.querySelectorAll(".thumb");
const modelA = document.getElementById("modelA");
const modelB = document.getElementById("modelB");

let current = modelA;
let next = modelB;

thumbs.forEach(thumb => {
  thumb.addEventListener("click", () => {

    thumbs.forEach(t => t.classList.remove("active"));
    thumb.classList.add("active");

    const newSrc = thumb.dataset.model;

    // Load new model into hidden layer
    next.setAttribute("src", newSrc);

    next.addEventListener("load", () => {
      // Fade swap
      current.classList.remove("active");
      next.classList.add("active");

      // Swap references
      [current, next] = [next, current];
    }, { once: true });
  });
});

