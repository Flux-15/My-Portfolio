document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const goUpBtn = document.getElementById("goUpBtn");

    // Smooth Scroll for Navigation Links
    document.querySelectorAll("nav ul li a").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute("href"));
            targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    // Scroll Reveal Effect
    function revealOnScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (sectionTop < windowHeight - 100) {
                section.classList.add("reveal");
            }
        });
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Run once on page load

    // Go Up Button Functionality
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            goUpBtn.style.display = "block";
        } else {
            goUpBtn.style.display = "none";
        }
    });

    goUpBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
