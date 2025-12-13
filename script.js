document.addEventListener("DOMContentLoaded", () => {
    // Testimonial Slider Logic (from script.js)
    const cards = document.querySelectorAll(".testimonial-card");
    const track = document.querySelector(".testimonial-track");
    const testimonialsRight = document.querySelector(".testimonials-right"); // Get the container

    let index = 0;

    if (cards.length > 0) {
        // Calculate card height + the vertical margin (16px from CSS: margin: 16px 0;)
        // The total height of the area the track moves by per slide.
        const cardHeightWithMargin = cards[0].offsetHeight + 16;
        
        // Calculate the initial offset to center the *active* card in the view.
        // Formula: (Container Height / 2) - (Card Height / 2)
        // We use clientHeight for the container, and offsetHeight for the card.
        const containerHeight = testimonialsRight.clientHeight;
        const cardHeight = cards[0].offsetHeight;
        const initialOffset = (containerHeight / 2) - (cardHeight / 2);

        function updateSlider() {
            // New transform calculation: 
            // Initial centering offset MINUS the cumulative movement (index * height).
            const translateYValue = initialOffset - (index * cardHeightWithMargin);
            track.style.transform = `translateY(${translateYValue}px)`;

            cards.forEach((card, i) => {
                card.classList.toggle("active", i === index);
            });
        }
        
        // Initial call to center the first card
        updateSlider(); 
        
        document.getElementById("next").addEventListener("click", () => {
            if (index < cards.length - 1) {
                index++;
                updateSlider();
            }
        });

        document.getElementById("prev").addEventListener("click", () => {
            if (index > 0) {
                index--;
                updateSlider();
            }
        });
    }
    
    // ... [Other existing JS code: modelViewer, title, radios, etc. ] ... 
    
    // The rest of the original script.js code follows here:
    
    const modelViewer = document.querySelector(".showcase__model");
    const title = document.querySelector(".title");
    const radios = document.querySelectorAll('input[name="modelColor"]');

    const prevBtn = document.querySelector(".next img:first-child");
    const nextBtn = document.querySelector(".next img:last-child");

    /* =========================
      MODEL LIST (ORDER MATTERS)
    ========================= */
    const models = [
        "./model/headphone.glb",
        "./model/h1.glb",
          "./model/h2.glb",
          "./model/h3.glb",
              "./model/h4.glb",
               "./model/h5.glb",
            
               "./model/h6.glb",
                "./model/h7.glb",
                 "./model/h8.glb",
                  "./model/h9.glb",

                  
                   "./model/h10.glb",
                    "./model/h11.glb",
                   "./model/h12.glb",
                     
             "./model/h14.glb"
    ];

    let currentModelIndex = 0;

    /* =========================
      LOAD MODEL FUNCTION
    ========================= */
    function loadModel(index) {
        modelViewer.setAttribute("src", models[index]);
    }

    /* =========================
      ARROW BUTTONS
    ========================= */
    prevBtn.addEventListener("click", () => {
        currentModelIndex =
          (currentModelIndex - 1 + models.length) % models.length;
        loadModel(currentModelIndex);
    });

    nextBtn.addEventListener("click", () => {
        currentModelIndex =
          (currentModelIndex + 1) % models.length;
        loadModel(currentModelIndex);
    });

    /* =========================
      RADIO → EXPOSURE + TITLE
    ========================= */
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





const bannerBg = document.getElementById("bannerBg");
const thumbs = document.querySelectorAll(".thumb");

thumbs.forEach(thumb => {
  thumb.addEventListener("click", () => {

    // remove active
    thumbs.forEach(t => t.classList.remove("active"));
    thumb.classList.add("active");

    // change background
    const img = thumb.dataset.img;
    bannerBg.style.backgroundImage = `url(${img})`;
  });
});
