document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     1️⃣ TESTIMONIAL SLIDER (VERTICAL CENTERED)
  ===================================================== */
  const cards = document.querySelectorAll(".testimonial-card");
  const track = document.querySelector(".testimonial-track");
  const testimonialsRight = document.querySelector(".testimonials-right");

  let testimonialIndex = 0;

  if (cards.length > 0 && track && testimonialsRight) {

    const cardHeightWithMargin = cards[0].offsetHeight + 16;
    const containerHeight = testimonialsRight.clientHeight;
    const cardHeight = cards[0].offsetHeight;
    const initialOffset = (containerHeight / 2) - (cardHeight / 2);

    function updateTestimonialSlider() {
      const translateY =
        initialOffset - (testimonialIndex * cardHeightWithMargin);
      track.style.transform = `translateY(${translateY}px)`;

      cards.forEach((card, i) => {
        card.classList.toggle("active", i === testimonialIndex);
      });
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

  /* =====================================================
     2️⃣ MODEL VIEWER SETUP
  ===================================================== */
  const modelViewer = document.querySelector(".showcase__model");
  const title = document.querySelector(".title");
  const radios = document.querySelectorAll('input[name="modelColor"]');

  const prevBtn = document.querySelector(".next img:first-child");
  const nextBtn = document.querySelector(".next img:last-child");

  /* =====================================================
     3️⃣ MODEL PRIORITY LIST
  ===================================================== */
  const MODEL_PRIORITY = {
    immediate: ["./model/headphone.glb"],

    high: [
      "./model/h1.glb",
      "./model/h2.glb"
    ],

    medium: [
      "./model/h3.glb",
      "./model/h4.glb",
      "./model/h5.glb"
    ],

    low: [
      "./model/h6.glb",
      "./model/h7.glb",
      "./model/h8.glb"
    ],

    ondemand: [
      "./model/h9.glb",
      "./model/h10.glb",
      "./model/h11.glb",
      "./model/h12.glb",
      "./model/h14.glb"
    ]
  };

  const ALL_MODELS = Object.values(MODEL_PRIORITY).flat();
  let currentModelIndex = 0;

  /* =====================================================
     4️⃣ MODEL PRELOAD FUNCTION
  ===================================================== */
  function preloadModel(src) {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "fetch";
    link.href = src;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }

  /* =====================================================
     5️⃣ APPLY PRIORITY PRELOADING
  ===================================================== */
  // Immediate (Hero)
  MODEL_PRIORITY.immediate.forEach(preloadModel);

  // High priority after page load
  window.addEventListener("load", () => {
    MODEL_PRIORITY.high.forEach(preloadModel);
  });

  // Medium priority during idle time
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      MODEL_PRIORITY.medium.forEach(preloadModel);
    });
  } else {
    setTimeout(() => {
      MODEL_PRIORITY.medium.forEach(preloadModel);
    }, 2000);
  }

  // On-demand (deep users)
  let ondemandLoaded = false;
  function loadOnDemandModels() {
    if (ondemandLoaded) return;
    ondemandLoaded = true;
    MODEL_PRIORITY.ondemand.forEach(preloadModel);
  }

  /* =====================================================
     6️⃣ MODEL SWITCHING (ARROWS)
  ===================================================== */
  function loadModel(index) {
    modelViewer.setAttribute("src", ALL_MODELS[index]);
  }

  let interactionCount = 0;

  prevBtn?.addEventListener("click", () => {
    currentModelIndex =
      (currentModelIndex - 1 + ALL_MODELS.length) % ALL_MODELS.length;
    loadModel(currentModelIndex);

    interactionCount++;
    if (interactionCount === 5) loadOnDemandModels();
  });

  nextBtn?.addEventListener("click", () => {
    currentModelIndex =
      (currentModelIndex + 1) % ALL_MODELS.length;
    loadModel(currentModelIndex);

    interactionCount++;
    if (interactionCount === 5) loadOnDemandModels();
  });

  /* =====================================================
     7️⃣ RADIO → EXPOSURE + TITLE COLOR
  ===================================================== */
  title.style.transition = "color 0.4s ease";

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      const value = radio.value;
      modelViewer.setAttribute("exposure", value);

      switch (value) {
        case "1":
          title.style.color = "#ffffff";
          break;
        case "12":
          title.style.color = "#3c3c3c";
          break;
        case "6":
          title.style.color = "#282828";
          break;
      }
    });
  });

});


/* =====================================================
   8️⃣ PRODUCT BANNER THUMB SWITCH
===================================================== */
const bannerBg = document.getElementById("bannerBg");
const thumbs = document.querySelectorAll(".thumb");

thumbs.forEach(thumb => {
  thumb.addEventListener("click", () => {
    thumbs.forEach(t => t.classList.remove("active"));
    thumb.classList.add("active");

    const img = thumb.dataset.img;
    bannerBg.style.backgroundImage = `url(${img})`;
  });
});
