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

    // Parallax target
    var heroProductImg = document.querySelector('.hero-dark__product-img');
    var heroSection = document.querySelector('.hero-dark');

    function updateHeader() {
        if (header) {
            if (window.scrollY > 10) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        }

        // Parallax on hero product image
        if (heroProductImg && heroSection) {
            var rect = heroSection.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                heroProductImg.style.transform = 'translateY(' + (window.scrollY * 0.08) + 'px)';
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

    // Counter animation helper
    function animateCounter(el, target, duration, suffix) {
        var isDecimal = String(target).indexOf('.') !== -1;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = start + (target - start) * eased;

            if (isDecimal) {
                el.textContent = current.toFixed(1);
            } else {
                el.textContent = Math.round(current);
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                // Restore original HTML (with <small> tags)
                if (isDecimal) {
                    el.innerHTML = target.toFixed(1) + ' ' + suffix;
                } else {
                    el.innerHTML = Math.round(target) + ' ' + suffix;
                }
            }
        }
        requestAnimationFrame(step);
    }

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

                    // Animate the number counters
                    var valueEls = entry.target.querySelectorAll('.vital-card__value');
                    valueEls.forEach(function (el) {
                        var smallTag = el.querySelector('small');
                        var suffix = smallTag ? '<small>' + smallTag.textContent + '</small>' : '';
                        var textContent = el.textContent.trim();
                        var numericPart = parseFloat(textContent);

                        if (!isNaN(numericPart)) {
                            animateCounter(el, numericPart, 1800, suffix);
                        }
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
            const name = formData.get('name') || '';
            const email = formData.get('email') || '';
            const role = formData.get('role') || '';

            const subject = encodeURIComponent('Waitlist Enquiry - ' + name);
            const body = encodeURIComponent(
                'New Waitlist Enquiry\n\n' +
                'Name: ' + name + '\n' +
                'Email: ' + email + '\n' +
                'Role: ' + role + '\n'
            );

            window.location.href = 'mailto:admin@wigglywoosh.co.in?subject=' + subject + '&body=' + body;

            const btn = waitlistForm.querySelector('.waitlist-form__btn');
            const originalText = btn.textContent;
            btn.textContent = '✓ Opening your email client...';
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
    // THEME TOGGLE
    // ========================================
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    if (themeToggle) {
        themeToggle.addEventListener('click', function (e) {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';

            // Try using View Transitions API for circular reveal
            if (document.startViewTransition) {
                // Get button center coordinates
                var rect = themeToggle.getBoundingClientRect();
                var x = rect.left + rect.width / 2;
                var y = rect.top + rect.height / 2;
                // Max radius to cover entire screen
                var maxRadius = Math.hypot(
                    Math.max(x, window.innerWidth - x),
                    Math.max(y, window.innerHeight - y)
                );

                var transition = document.startViewTransition(function () {
                    html.setAttribute('data-theme', next);
                    localStorage.setItem('ww-theme', next);
                });

                transition.ready.then(function () {
                    document.documentElement.animate(
                        {
                            clipPath: [
                                'circle(0px at ' + x + 'px ' + y + 'px)',
                                'circle(' + maxRadius + 'px at ' + x + 'px ' + y + 'px)'
                            ]
                        },
                        {
                            duration: 600,
                            easing: 'ease-in-out',
                            pseudoElement: '::view-transition-new(root)'
                        }
                    );
                });
            } else {
                // Fallback for browsers without View Transitions
                html.classList.add('theme-switching');
                html.setAttribute('data-theme', next);
                localStorage.setItem('ww-theme', next);

                setTimeout(function () {
                    html.classList.remove('theme-switching');
                }, 500);
            }
        });
    }

    // ========================================
    // 3D TILT EFFECT ON CARDS
    // ========================================
    var tiltCards = document.querySelectorAll('.product-card, .eco-card');

    tiltCards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = ((y - centerY) / centerY) * -5;
            var rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });

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