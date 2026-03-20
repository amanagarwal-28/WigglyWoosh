(function () {
    'use strict';

    // ========================================
    // MOBILE HAMBURGER MENU
    // ========================================
    const hamburger = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    const navCta = document.querySelector('.navbar__cta');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isOpen);
            navLinks.classList.toggle('is-open');
            if (navCta) navCta.classList.toggle('is-open');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('is-open');
                if (navCta) navCta.classList.remove('is-open');
            });
        });
    }

    // ========================================
    // HEADER SCROLL SHADOW
    // ========================================
    const header = document.getElementById('header');
    let lastScrollY = 0;
    let ticking = false;

    function updateHeader() {
        if (header) {
            if (window.scrollY > 10) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        }
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // ========================================
    // INTERSECTION OBSERVER — FADE IN
    // ========================================
    const fadeElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show all elements
        fadeElements.forEach(el => el.classList.add('is-visible'));
    }

    // ========================================
    // INTERSECTION OBSERVER — DASHBOARD BARS
    // ========================================
    const dashboardPreview = document.querySelector('.dashboard-preview');

    if (dashboardPreview && 'IntersectionObserver' in window) {
        const dashObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // Animate the vitals bars
                    const bars = entry.target.querySelectorAll('.vital-card__fill');
                    bars.forEach(function (bar) {
                        const targetWidth = bar.style.width;
                        bar.style.width = '0%';
                        // Force reflow
                        bar.offsetHeight;
                        // Trigger animation
                        requestAnimationFrame(function () {
                            bar.style.width = targetWidth;
                        });
                    });

                    dashObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        dashObserver.observe(dashboardPreview);
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
                var elementPosition = target.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // WAITLIST FORM HANDLER
    // ========================================
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(waitlistForm);
            const data = Object.fromEntries(formData);
            console.log('Waitlist submission:', data);

            // Replace with actual API call
            const btn = waitlistForm.querySelector('.waitlist-form__btn');
            const originalText = btn.textContent;
            btn.textContent = '✓ You\'re on the list!';
            btn.style.background = '#10B981';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                waitlistForm.reset();
            }, 3000);
        });
    }

    // ========================================
    // ACTIVE NAV LINK HIGHLIGHT ON SCROLL
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.navbar__links a');

    if (sections.length > 0 && navLinksAll.length > 0 && 'IntersectionObserver' in window) {
        const navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinksAll.forEach(function (link) {
                        link.classList.remove('is-active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('is-active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        });

        sections.forEach(function (section) {
            navObserver.observe(section);
        });
    }

    // ========================================
    // MOBILE STICKY CTA — SHOW/HIDE ON SCROLL
    // ========================================
    const mobileCta = document.querySelector('.mobile-sticky-cta');
    const waitlistSection = document.getElementById('waitlist');

    if (mobileCta && waitlistSection && 'IntersectionObserver' in window) {
        const ctaObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                // Hide sticky CTA when the waitlist form is visible
                if (entry.isIntersecting) {
                    mobileCta.style.transform = 'translateY(100%)';
                    mobileCta.style.transition = 'transform 0.3s ease';
                } else {
                    mobileCta.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.3
        });

        ctaObserver.observe(waitlistSection);
    }

    // ========================================
    // HERO SECTION — ALSO HIDE STICKY CTA
    // ========================================
    const heroSection = document.getElementById('hero');
    if (mobileCta && heroSection && 'IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    mobileCta.style.transform = 'translateY(100%)';
                    mobileCta.style.transition = 'transform 0.3s ease';
                }
            });
        }, {
            threshold: 0.5
        });

        heroObserver.observe(heroSection);
    }

    // ========================================
    // CONSOLE BRANDING
    // ========================================
    console.log(
        '%c🐾 Wiggly Woosh %c— The Future of Pet Care',
        'color: #1B6B4A; font-size: 18px; font-weight: bold;',
        'color: #F5A623; font-size: 14px;'
    );
    console.log('Patent Publication No. 202641027315 A');
    console.log('© 2026 Wiggly Woosh™. All rights reserved.');

})();