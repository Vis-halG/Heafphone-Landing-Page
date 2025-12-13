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
     2️⃣ MODEL VIEWER SETUP
  ===================================================== */
  const modelViewer = document.querySelector(".showcase__model");
  const title = document.querySelector(".title");
  const radios = document.querySelectorAll('input[name="modelColor"]');

  const prevBtn = document.querySelector(".next img:first-child");
  const nextBtn = document.querySelector(".next img:last-child");

  /* =====================================================
     3️⃣ MODEL LIST WITH SMART PRELOADING
     👉 First model loads immediately
     👉 Others preload in background after page loads
  ===================================================== */
  const MODELS = [
    "./model/headphone.glb", // Loads first on page load
    "./model/h1.glb",        // Preloads in background
    "./model/h2.glb",        // Preloads in background
    "./model/h3.glb"         // Preloads in background
  ];

  let currentModelIndex = 0;
  const preloadedModels = new Set([0]); // Track which models are preloaded

  // Preload models in background (non-blocking)
  function preloadModelsInBackground() {
    MODELS.forEach((modelPath, index) => {
      if (index === 0) return; // Skip first model (already loading)
      
      // Wait a bit, then preload each model
      setTimeout(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'fetch';
        link.href = modelPath;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
        
        console.log(`🎧 Preloading model ${index + 1}:`, modelPath);
        preloadedModels.add(index);
      }, 1500 * index); // Stagger loads: 1.5s, 3s, 4.5s
    });
  }

  // Load specific model
  function loadModel(index) {
    if (!modelViewer) return;
    
    // Add loading indicator
    modelViewer.classList.add('loading');
    
    // Update model source
    modelViewer.setAttribute("src", MODELS[index]);
    
    // Remove loading indicator when done
    modelViewer.addEventListener('load', () => {
      modelViewer.classList.remove('loading');
      console.log(`✅ Model ${index + 1} loaded`);
    }, { once: true });

    // Handle load errors
    modelViewer.addEventListener('error', (e) => {
      modelViewer.classList.remove('loading');
      console.error(`❌ Failed to load model ${index + 1}:`, e);
    }, { once: true });
  }

  // Start background preloading after initial page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      console.log('🚀 Starting background model preload...');
      preloadModelsInBackground();
    }, 1000); // Wait 1 second after page fully loads
  });

  /* =====================================================
     4️⃣ MODEL SWITCHING (INSTANT - ALREADY PRELOADED)
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
  if (title) {
    title.style.transition = "color 0.4s ease";
  }

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      const value = radio.value;
      if (modelViewer) {
        modelViewer.setAttribute("exposure", value);
      }

      if (title) {
        if (value === "1") title.style.color = "#ffffff";
        if (value === "12") title.style.color = "#3c3c3c";
        if (value === "6") title.style.color = "#282828";
      }
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