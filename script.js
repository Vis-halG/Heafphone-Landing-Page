/* =====================================================
   0️⃣ BASIC SELECTORS
===================================================== */

const modelViewer = document.querySelector(".showcase__model");
const title = document.querySelector(".title");
const radios = document.querySelectorAll('input[name="modelColor"]');
const prevBtn = document.querySelector(".next img:first-child");
const nextBtn = document.querySelector(".next img:last-child");

/* =====================================================
   1️⃣ SCREEN LOADER – ONLY MAIN MODEL CONTROLS IT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const loader = document.getElementById("page-loader");
  if (!loader || !modelViewer) return;

  let hidden = false;

  const hideLoader = () => {
    if (hidden) return;
    hidden = true;
    loader.classList.add("hide");
  };

  // 🔑 Loader hides ONLY when main model loads
  modelViewer.addEventListener("load", hideLoader, { once: true });

  // Safety fallback
  setTimeout(hideLoader, 5000);
});

/* =====================================================
   2️⃣ MODEL SWITCHING + PRELOAD (BACKGROUND)
===================================================== */

const MODELS = [
  "./model/headphone.glb", // already visible
  "./model/h1.glb",
  "./model/h2.glb",
  "./model/h3.glb"
];

let currentModelIndex = 0;

function loadModel(index) {
  if (!modelViewer) return;

  modelViewer.classList.add("slide-out");

  setTimeout(() => {
    modelViewer.setAttribute("src", MODELS[index]);
    modelViewer.classList.remove("slide-out");
    modelViewer.classList.add("slide-in");

    modelViewer.addEventListener("load", () => {
      modelViewer.classList.remove("slide-in");
    }, { once: true });

  }, 300);
}

// Controls
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

// 🔥 Background preload (IDLE)
requestIdleCallback?.(() => {
  MODELS.slice(1).forEach(src => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "fetch";
    link.href = src;
    document.head.appendChild(link);
  });
});

/* =====================================================
   3️⃣ EXPOSURE / COLOR RADIO (LIGHT)
===================================================== */

radios.forEach(radio => {
  radio.addEventListener("change", () => {
    modelViewer?.setAttribute("exposure", radio.value);

    if (!title) return;
    title.style.color =
      radio.value === "1" ? "#ffffff" :
      radio.value === "6" ? "#3c3c3c" :
      "#282828";
  });
});

/* =====================================================
   4️⃣ INFINITE TESTIMONIAL SLIDER
===================================================== */
window.addEventListener("load", () => {
  const track = document.querySelector(".testimonial-track");
  const wrap = document.querySelector(".testimonials-right");
  let cards = Array.from(document.querySelectorAll(".testimonial-card"));
  
  if (!track || !wrap || cards.length === 0) return;

  // 1. INFINITE LOGIC: Clone cards (Shuruat aur end me extra cards add karna)
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });
  // Update cards list after cloning
  const allCards = document.querySelectorAll(".testimonial-card");

  let index = 0;
  const gap = 16;
  
  function updateSlider() {
    const cardHeight = allCards[0].offsetHeight;
    const wrapHeight = wrap.clientHeight;
    
    // Center point calculation
    const offset = (wrapHeight / 2) - (cardHeight / 2);
    const scrollPos = offset - (index * (cardHeight + gap));
    
    track.style.transform = `translateY(${scrollPos}px)`;

    // 2. UNBLUR CENTER CARD: Check positions
    allCards.forEach((card, i) => {
      if (i === index) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });
  }

  // Next Button
  document.getElementById("next")?.addEventListener("click", () => {
    index++;
    if (index >= allCards.length) index = 0; // Reset to start
    updateSlider();
  });

  // Prev Button
  document.getElementById("prev")?.addEventListener("click", () => {
    index--;
    if (index < 0) index = allCards.length - 1; // Go to last
    updateSlider();
  });

  // 3. AUTO SCROLL (Optional)
  let autoRun = setInterval(() => {
    index = (index + 1) % allCards.length;
    updateSlider();
  }, 4000); // Har 4 second me change hoga

  // Pause on hover
  wrap.addEventListener("mouseenter", () => clearInterval(autoRun));
  wrap.addEventListener("mouseleave", () => {
    autoRun = setInterval(() => {
      index = (index + 1) % allCards.length;
      updateSlider();
    }, 4000);
  });

  updateSlider();
  window.addEventListener("resize", updateSlider);
});

/* =====================================================
   5️⃣ FAQ ACCORDION (NON-BLOCKING)
===================================================== */

setTimeout(() => {

  document.querySelectorAll(".faq-item").forEach(item => {
    const header = item.querySelector(".faq-header");

    header?.addEventListener("click", () => {

      document.querySelectorAll(".faq-item").forEach(other => {
        if (other !== item) {
          other.classList.remove("active");
          other.querySelector(".icon").textContent = "+";
        }
      });

      item.classList.toggle("active");
      const icon = item.querySelector(".icon");
      if (icon) icon.textContent =
        item.classList.contains("active") ? "−" : "+";
    });
  });

}, 1500);

/* =====================================================
   6️⃣ PRODUCT THUMB MODEL SWAP (IDLE)
===================================================== */

requestIdleCallback?.(() => {

  const thumbs = document.querySelectorAll(".thumb");
  const modelA = document.getElementById("modelA");
  const modelB = document.getElementById("modelB");

  if (!thumbs.length || !modelA || !modelB) return;

  let current = modelA;
  let next = modelB;

  thumbs.forEach(thumb => {
    thumb.addEventListener("click", () => {

      thumbs.forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");

      next.setAttribute("src", thumb.dataset.model);

      next.addEventListener("load", () => {
        current.classList.remove("active");
        next.classList.add("active");
        [current, next] = [next, current];
      }, { once: true });

    });
  });

});

/* =====================================================
   7️⃣ GSAP STORY TITLE – LAZY LOAD ON SCROLL
===================================================== */

const storyTitle = document.querySelector(".story-title");

if (storyTitle) {

  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;

    gsap.registerPlugin(ScrollTrigger);

    const words = storyTitle.innerText.split(" ");
    storyTitle.innerHTML = words
      .map(w => `<span>${w}&nbsp;</span>`)
      .join("");

    gsap.to(storyTitle.querySelectorAll("span"), {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
      stagger: 0.08,
      scrollTrigger: {
        trigger: storyTitle,
        start: "top 85%",
        end: "top 30%",
        scrub: true
      }
    });

    observer.disconnect();
  }, { threshold: 0.3 });

  observer.observe(storyTitle);
}



/* =====================================================
   8️⃣ PRODUCT SECTION – SLOW SCROLL LINKED MOTION
===================================================== */

const productSection = document.querySelector(".products");
const productCards = document.querySelectorAll(".product-card");

if (productSection && productCards.length) {

  gsap.registerPlugin(ScrollTrigger);

  // Initial state (slightly more offset)
  gsap.set(productCards, {
    opacity: 0,
    y: 160,        // ⬅️ movement zyada
    scale: 0.9
  });

  gsap.to(productCards, {
    opacity: 1,
    y: 0,
    scale: 1,
    ease: "none",  // 🔑 scrub ke sath best
    stagger: 0.25, // ⬅️ reveal dheere
    scrollTrigger: {
      trigger: productSection,
       start: "top 95%",
      end: "top 10%",
      scrub: true         // ⬅️ smooth + slow follow
      // markers: true
    }
  });
}




/* =====================================================
   🔢 SCROLL COUNTER (3.2k+) – FIXED & RELIABLE
===================================================== */

const counterEl = document.querySelector(".count-number");

if (counterEl) {
  gsap.registerPlugin(ScrollTrigger);

  const finalValue = parseInt(counterEl.dataset.count, 10);

  const counterObj = { value: 0 };

  gsap.to(counterObj, {
    value: finalValue,
    duration: 2.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: counterEl,
      start: "top 80%",
      once: true
    },
    onUpdate: () => {
      const val = Math.floor(counterObj.value);
      counterEl.innerHTML =
        (val / 1000).toFixed(1) + "k<span>+</span>";
    }
  });
}
