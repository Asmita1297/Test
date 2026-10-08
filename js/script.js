
class ImageSlider {
    constructor(selector) {
        this.slider = document.querySelector(selector);

        if (!this.slider) return;

        this.track = this.slider.querySelector(".slider-track");
        this.slides = Array.from(this.track.children);
        this.prevBtn = this.slider.querySelector(".prev");
        this.nextBtn = this.slider.querySelector(".next");
        this.dotsContainer = this.slider.querySelector(".slider-dots");

        this.dots = [];
        this.currentIndex = 0;
        this.autoSlideInterval = null;
        this.slideDuration = 5000;
        this.isPaused = false;

        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        this.createDots();
        this.bindEvents();
        this.updateSlidePosition();
        this.startAutoSlide();
    }

    createDots() {
        this.slides.forEach((slide, index) => {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.classList.add("slider-dot");
            dot.setAttribute(
                "aria-label",
                `Go to image ${index + 1}`
            );

            dot.addEventListener("click", () => {
                this.goToSlide(index);
                this.restartAutoSlide();
            });

            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        });
    }

    updateSlidePosition() {
        const offset = -this.currentIndex * 100;

        this.track.style.transform =
            `translateX(${offset}%)`;

        this.updateDots();
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            const active = index === this.currentIndex;

            dot.classList.toggle("active", active);
            dot.setAttribute("aria-current", String(active));
        });
    }

    nextSlide() {
        this.currentIndex =
            (this.currentIndex + 1) % this.slides.length;

        this.updateSlidePosition();
    }

    prevSlide() {
        this.currentIndex =
            (this.currentIndex - 1 + this.slides.length)
            % this.slides.length;

        this.updateSlidePosition();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlidePosition();
    }

    startAutoSlide() {
        this.stopAutoSlide();

        if (this.isPaused || document.hidden ||
            this.slides.length <= 1) {
            return;
        }

        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideDuration);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval !== null) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    restartAutoSlide() {
        if (!this.isPaused) {
            this.startAutoSlide();
        }
    }

    bindEvents() {
        // NEXT IMAGE
        this.nextBtn.addEventListener("click", () => {
            this.nextSlide();
            this.restartAutoSlide();
        });

        // PREVIOUS IMAGE
        this.prevBtn.addEventListener("click", () => {
            this.prevSlide();
            this.restartAutoSlide();
        });

        // PAUSE WHEN CURSOR ENTERS
        this.slider.addEventListener("mouseenter", () => {
            this.isPaused = true;
            this.stopAutoSlide();
        });

        // RESUME WHEN CURSOR LEAVES
        this.slider.addEventListener("mouseleave", () => {
            this.isPaused = false;
            this.startAutoSlide();
        });

        // KEYBOARD ACCESSIBILITY
        this.slider.addEventListener("focusin", () => {
            this.isPaused = true;
            this.stopAutoSlide();
        });

        this.slider.addEventListener("focusout", (event) => {
            if (!this.slider.contains(event.relatedTarget)) {
                this.isPaused = false;
                this.startAutoSlide();
            }
        });

        // PAUSE WHEN BROWSER TAB IS HIDDEN
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.stopAutoSlide();
            } else if (!this.isPaused) {
                this.startAutoSlide();
            }
        });
    }
}

// START AFTER PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {
    new ImageSlider(".slider");

    // SEARCH WEBSITE SECTIONS
    const searchForm = document.querySelector("#search-form");
    const searchInput = document.querySelector("#search-input");

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        const sections = document.querySelectorAll("main section");

        const matchingSection = Array.from(sections).find(section => {
            const heading = section.querySelector("h1");
            return heading &&
                heading.textContent.toLowerCase().includes(query);
        });

        if (matchingSection) {
            matchingSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        } else {
            alert("No matching section found.");
        }
    });

    // CONTACT FORM DEMONSTRATION
    const contactForm = document.querySelector("#contact-form");
    const formStatus = document.querySelector("#form-status");

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        formStatus.textContent =
            "Form validated. An email service is required to send messages.";
    });
});
