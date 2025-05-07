    document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');
    const ctaLinks = document.querySelectorAll('a.cta-button[href^="#"]');
    const allScrollLinks = [...navLinks, ...ctaLinks];

    allScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open after clicking a link
                if (navUl.classList.contains('active')) {
                    navUl.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('active');
            menuToggle.classList.toggle('active');

            // Update aria-expanded attribute for accessibility
            const isExpanded = navUl.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded.toString());
        });
    }

    // Optional: Close mobile menu when clicking outside of it
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navUl.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && navUl.classList.contains('active')) {
            navUl.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Optional: Add a subtle scroll animation to sections or elements as they come into view
    const animatedSections = document.querySelectorAll('section');
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // observer.unobserve(entry.target); // Optional: stop observing after animation
            } else {
                // Optional: Reset if you want animation to replay on scroll up/down
                // entry.target.style.opacity = '0';
                // entry.target.style.transform = 'translateY(20px)';
            }
        });
    }, observerOptions);

    animatedSections.forEach(section => {
        section.style.opacity = '0'; // Initial state for animation
        section.style.transform = 'translateY(20px)'; // Initial state for animation
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Slideshow for Book Recommendations
    let slideIndex = 1;
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");

    function showSlides(n) {
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
            slides[i].classList.remove("active");
        }
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("active-dot");
        }
        
        if (slides.length > 0 && dots.length > 0) { // Check if slides and dots exist
            slides[slideIndex - 1].style.display = "block"; // Or "flex" if slide content needs it
            slides[slideIndex - 1].classList.add("active");
            dots[slideIndex - 1].classList.add("active-dot");
        }
    }

    // Next/previous controls
    window.plusSlides = function(n) {
        showSlides(slideIndex += n);
    }

    // Thumbnail image controls
    window.currentSlide = function(n) {
        showSlides(slideIndex = n);
    }

    // Initialize slideshow if slides exist
    if (slides.length > 0 && dots.length > 0) { // Ensure dots also exist before proceeding
        showSlides(slideIndex);

        // Add event listeners to prev/next buttons if they exist
        const prevButton = document.querySelector('.prev-slide');
        const nextButton = document.querySelector('.next-slide');
        if(prevButton) {
            prevButton.addEventListener('click', () => plusSlides(-1));
        }
        if(nextButton) {
            nextButton.addEventListener('click', () => plusSlides(1));
        }

        // Add event listeners to dots if they exist
        for (let i = 0; i < dots.length; i++) {
            dots[i].addEventListener('click', () => currentSlide(i + 1));
        }
    }

    // Active navigation link highlighting on scroll
    const sections = document.querySelectorAll("main section[id]"); // Get all sections with an ID in main
    const navHeaderLinks = document.querySelectorAll("nav ul li a");
    const headerHeight = document.querySelector('header').offsetHeight;

    function changeNavActiveState() {
        let currentSectionId = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Adjusted offset
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
                currentSectionId = section.getAttribute("id");
            }
        });

        // If no section is "active" by the logic above (e.g., at the very top or bottom of page),
        // you might want to default to the first one or handle it differently.
        // For now, if currentSectionId is empty, no link will be active.

        navHeaderLinks.forEach(link => {
            link.classList.remove("active-link");
            link.removeAttribute("aria-current"); // Remove aria-current from all links
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active-link");
                link.setAttribute("aria-current", "page"); // Set aria-current for the active link
            }
        });
    }

    // Initial check in case the page loads on a specific section
    if(sections.length > 0 && navHeaderLinks.length > 0) {
      changeNavActiveState(); 
      window.addEventListener("scroll", changeNavActiveState);
    }
});
