document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     1️⃣ TESTIMONIAL SLIDER (VERTICAL CENTERED)
  ===================================================== */
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

  /* =====================================================
     2️⃣ MODEL VIEWER SETUP (ONLY HERO LOADS)
  ===================================================== */
  const modelViewer = document.querySelector(".showcase__model");
  const title = document.querySelector(".title");
  const radios = document.querySelectorAll('input[name="modelColor"]');

  const prevBtn = document.querySelector(".next img:first-child");
  const nextBtn = document.querySelector(".next img:last-child");

  /* =====================================================
     3️⃣ MODEL LIST (NO PRELOAD, NO PRIORITY)
     👉 index 0 ALWAYS loads first
  ===================================================== */
  const MODELS = [
    "./model/headphone.glb", // ONLY this loads on page load
    "./model/h1.glb",
    "./model/h2.glb",
    "./model/h3.glb",
    "./model/h4.glb"
  ];

  let currentModelIndex = 0;

  function loadModel(index) {
    modelViewer.setAttribute("src", MODELS[index]);
  }

  /* =====================================================
     4️⃣ MODEL SWITCHING (ON-DEMAND ONLY)
  ===================================================== */
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

  /* =====================================================
     5️⃣ RADIO → EXPOSURE + TITLE COLOR
  ===================================================== */
  title.style.transition = "color 0.4s ease";

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      const value = radio.value;
      modelViewer.setAttribute("exposure", value);

      if (value === "1") title.style.color = "#ffffff";
      if (value === "12") title.style.color = "#3c3c3c";
      if (value === "6") title.style.color = "#282828";
    });
  });

});


/* =====================================================
   6️⃣ PRODUCT BANNER THUMB SWITCH
===================================================== */
const bannerBg = document.getElementById("bannerBg");
const thumbs = document.querySelectorAll(".thumb");

thumbs.forEach(thumb => {
  thumb.addEventListener("click", () => {
    thumbs.forEach(t => t.classList.remove("active"));
    thumb.classList.add("active");

    bannerBg.style.backgroundImage = `url(${thumb.dataset.img})`;
  });
});
