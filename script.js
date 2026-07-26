(() => {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {

        /* =========================================
           ELEMENTS
        ========================================= */

        const navbar = document.getElementById("mainNavbar");
        const navbarMenu = document.getElementById("navbarMenu");
        const backToTop = document.getElementById("backToTop");
        const typingText = document.getElementById("typingText");
        const currentYear = document.getElementById("currentYear");

        const navLinks = document.querySelectorAll(
            "#mainNavbar .nav-link"
        );

        const sections = document.querySelectorAll(
            "main section[id]"
        );

        const revealElements = document.querySelectorAll(
            ".reveal"
        );

        const counters = document.querySelectorAll(
            ".counter"
        );

        const progressBars = document.querySelectorAll(
            ".progress-bar[data-width]"
        );

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


        /* =========================================
           CURRENT YEAR
        ========================================= */

        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }


        /* =========================================
           NAVBAR SCROLL AND ACTIVE LINK
        ========================================= */

        const handlePageScroll = () => {

            const scrollTop = window.scrollY;

            if (navbar) {
                navbar.classList.toggle(
                    "scrolled",
                    scrollTop > 20
                );
            }

            if (backToTop) {
                backToTop.classList.toggle(
                    "visible",
                    scrollTop > 450
                );
            }

            let currentSection = "home";

            sections.forEach((section) => {

                const sectionTop =
                    section.offsetTop - 180;

                if (scrollTop >= sectionTop) {
                    currentSection = section.id;
                }
            });

            navLinks.forEach((link) => {

                const href =
                    link.getAttribute("href");

                link.classList.toggle(
                    "active",
                    href === `#${currentSection}`
                );
            });
        };

        window.addEventListener(
            "scroll",
            handlePageScroll,
            { passive: true }
        );

        handlePageScroll();


        /* =========================================
           MOBILE NAVBAR CLOSE
        ========================================= */

        navLinks.forEach((link) => {

            link.addEventListener("click", () => {

                if (
                    navbarMenu &&
                    navbarMenu.classList.contains("show") &&
                    window.bootstrap
                ) {
                    const collapse =
                        bootstrap.Collapse.getOrCreateInstance(
                            navbarMenu
                        );

                    collapse.hide();
                }
            });
        });


        /* =========================================
           SMOOTH SCROLL
        ========================================= */

        document.querySelectorAll('a[href^="#"]').forEach(
            (link) => {

                link.addEventListener("click", (event) => {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const targetElement =
                        document.querySelector(targetId);

                    if (!targetElement) {
                        return;
                    }

                    event.preventDefault();

                    targetElement.scrollIntoView({
                        behavior:
                            reduceMotion ? "auto" : "smooth",
                        block: "start"
                    });
                });
            }
        );


        /* =========================================
           BACK TO TOP
        ========================================= */

        if (backToTop) {

            backToTop.addEventListener("click", () => {

                window.scrollTo({
                    top: 0,
                    behavior:
                        reduceMotion ? "auto" : "smooth"
                });
            });
        }


        /* =========================================
           REVEAL ANIMATION
        ========================================= */

        if (
            "IntersectionObserver" in window &&
            !reduceMotion
        ) {
            const revealObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach((entry) => {

                            if (!entry.isIntersecting) {
                                return;
                            }

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        });
                    },
                    {
                        threshold: 0.12
                    }
                );

            revealElements.forEach((element) => {
                revealObserver.observe(element);
            });

        } else {

            revealElements.forEach((element) => {
                element.classList.add("visible");
            });
        }


        /* =========================================
           COUNTER ANIMATION
        ========================================= */

        const animateCounter = (counter) => {

            const target = Number(
                counter.dataset.target || 0
            );

            const suffix =
                counter.dataset.suffix || "";

            const duration =
                reduceMotion ? 0 : 1400;

            const startTime =
                performance.now();

            const updateCounter = (currentTime) => {

                const progress =
                    duration === 0
                        ? 1
                        : Math.min(
                            (currentTime - startTime) /
                            duration,
                            1
                        );

                const easing =
                    1 - Math.pow(1 - progress, 3);

                const currentValue =
                    Math.floor(target * easing);

                counter.textContent =
                    `${currentValue}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(
                        updateCounter
                    );
                }
            };

            requestAnimationFrame(updateCounter);
        };


        if ("IntersectionObserver" in window) {

            const counterObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach((entry) => {

                            if (!entry.isIntersecting) {
                                return;
                            }

                            animateCounter(entry.target);

                            observer.unobserve(
                                entry.target
                            );
                        });
                    },
                    {
                        threshold: 0.5
                    }
                );

            counters.forEach((counter) => {
                counterObserver.observe(counter);
            });

        } else {

            counters.forEach((counter) => {
                animateCounter(counter);
            });
        }


        /* =========================================
           SKILL PROGRESS BARS
        ========================================= */

        const showProgressBar = (progressBar) => {

            const width =
                progressBar.dataset.width || "0";

            progressBar.style.width =
                `${width}%`;
        };


        if ("IntersectionObserver" in window) {

            const progressObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach((entry) => {

                            if (!entry.isIntersecting) {
                                return;
                            }

                            showProgressBar(
                                entry.target
                            );

                            observer.unobserve(
                                entry.target
                            );
                        });
                    },
                    {
                        threshold: 0.4
                    }
                );

            progressBars.forEach((progressBar) => {
                progressObserver.observe(progressBar);
            });

        } else {

            progressBars.forEach((progressBar) => {
                showProgressBar(progressBar);
            });
        }


        /* =========================================
           TYPING ANIMATION
        ========================================= */

        const typingPhrases = [
            "scalable web applications",
            "secure REST APIs",
            "responsive user experiences",
            "cloud-ready software",
            "business-focused solutions"
        ];

        let phraseIndex = 0;
        let characterIndex = 0;
        let deleting = false;


        const runTypingAnimation = () => {

            if (!typingText || reduceMotion) {
                return;
            }

            const currentPhrase =
                typingPhrases[phraseIndex];

            if (deleting) {
                characterIndex--;
            } else {
                characterIndex++;
            }

            typingText.textContent =
                currentPhrase.substring(
                    0,
                    characterIndex
                );

            let speed =
                deleting ? 45 : 85;

            if (
                !deleting &&
                characterIndex === currentPhrase.length
            ) {
                deleting = true;
                speed = 1400;

            } else if (
                deleting &&
                characterIndex === 0
            ) {
                deleting = false;

                phraseIndex =
                    (phraseIndex + 1) %
                    typingPhrases.length;

                speed = 300;
            }

            window.setTimeout(
                runTypingAnimation,
                speed
            );
        };


        if (typingText) {

            if (reduceMotion) {
                typingText.textContent =
                    typingPhrases[0];
            } else {
                runTypingAnimation();
            }
        }


        /* =========================================
           CONTACT FORM
           FRONTEND VALIDATION
        ========================================= */

        const contactForm =
            document.getElementById("contactForm");

        const formStatus =
            document.getElementById("formStatus");


        if (contactForm) {

            contactForm.addEventListener(
                "submit",
                async (event) => {

                    event.preventDefault();

                    formStatus.textContent = "";
                    formStatus.className =
                        "form-status mt-3";


                    if (!contactForm.checkValidity()) {

                        event.stopPropagation();

                        contactForm.classList.add(
                            "was-validated"
                        );

                        formStatus.className =
                            "form-status mt-3 text-danger";

                        formStatus.textContent =
                            "Please fill all required fields correctly.";

                        return;
                    }


                    const submitButton =
                        contactForm.querySelector(
                            'button[type="submit"]'
                        );

                    const originalButtonHtml =
                        submitButton.innerHTML;


                    const contactData = {

                        name:
                            document
                                .getElementById("name")
                                .value
                                .trim(),

                        email:
                            document
                                .getElementById("email")
                                .value
                                .trim(),

                        subject:
                            document
                                .getElementById("subject")
                                .value
                                .trim(),

                        message:
                            document
                                .getElementById("message")
                                .value
                                .trim()
                    };


                    try {

                        submitButton.disabled = true;

                        submitButton.innerHTML = `
                            <span
                                class="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true">
                            </span>
                            Sending...
                        `;

                        formStatus.className =
                            "form-status mt-3 text-primary";

                        formStatus.textContent =
                            "Sending your message...";


                        /*
                        ====================================
                        BACKEND API CONNECT KARNE KE BAAD
                        NICHE KA CODE USE KAREN
                        ====================================

                        const response = await fetch(
                            "https://localhost:7127/api/contact/send",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "application/json"
                                },

                                body: JSON.stringify(
                                    contactData
                                )
                            }
                        );

                        const result =
                            await response.json();

                        if (!response.ok) {
                            throw new Error(
                                result.message ||
                                "Message could not be sent."
                            );
                        }
                        */


                        // Temporary frontend simulation
                        await new Promise((resolve) => {
                            setTimeout(resolve, 1200);
                        });


                        console.log(
                            "Contact form data:",
                            contactData
                        );


                        formStatus.className =
                            "form-status mt-3 text-success";

                        formStatus.textContent =
                            "Thank you! Your message has been submitted successfully.";


                        contactForm.reset();

                        contactForm.classList.remove(
                            "was-validated"
                        );


                    } catch (error) {

                        console.error(
                            "Contact form error:",
                            error
                        );

                        formStatus.className =
                            "form-status mt-3 text-danger";

                        formStatus.textContent =
                            error.message ||
                            "Message could not be sent. Please try again.";


                    } finally {

                        submitButton.disabled = false;

                        submitButton.innerHTML =
                            originalButtonHtml;
                    }
                }
            );


            contactForm.querySelectorAll(
                "input, textarea"
            ).forEach((input) => {

                input.addEventListener("input", () => {

                    if (input.checkValidity()) {
                        input.classList.remove(
                            "is-invalid"
                        );
                    }

                    if (formStatus) {
                        formStatus.textContent = "";
                    }
                });
            });
        }


        /* =========================================
           PROJECT EMPTY LINKS PREVENT
        ========================================= */

        document.querySelectorAll('a[href="#"]').forEach(
            (link) => {

                link.addEventListener("click", (event) => {

                    event.preventDefault();

                    console.warn(
                        "Please replace # with the actual project URL."
                    );
                });
            }
        );

    });

})();