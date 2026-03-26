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
    // Signal to CSS that JS is ready to handle animations
    document.documentElement.classList.add('js-ready');

    const fadeElements = document.querySelectorAll('.fade-in');
    const productCards = document.querySelectorAll('.products .product-card.fade-in');

    productCards.forEach((card, index) => {
        card.classList.add('fade-in--stagger');
        card.dataset.revealDelay = String(index * 100);
    });

    if ('IntersectionObserver' in window && fadeElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = Number(entry.target.dataset.revealDelay || 0);

                    if (delay > 0) {
                        setTimeout(() => {
                            entry.target.classList.add('is-visible');
                        }, delay);
                    } else {
                        entry.target.classList.add('is-visible');
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.01,
            rootMargin: '0px 0px 50px 0px'
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
    // MAGNETIC HOVER FOR PRIMARY CTAS
    // ========================================
    const magneticButtons = Array.from(document.querySelectorAll('.btn--primary, .hero-dark__btn'));
    const canUseMagnet =
        magneticButtons.length > 0 &&
        window.matchMedia('(pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (canUseMagnet) {
        const MAGNET_TRIGGER_DISTANCE = 40;
        const MAGNET_MIN_OFFSET = 5;
        const MAGNET_MAX_OFFSET = 10;
        const SPRING_STIFFNESS = 150;
        const SPRING_DAMPING = 15;

        let pointerX = 0;
        let pointerY = 0;
        let pointerInsideWindow = false;
        let rafId = null;
        let lastTime = performance.now();

        const states = magneticButtons.map(function (button) {
            button.classList.add('magnetic-cta');
            return {
                button: button,
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                targetX: 0,
                targetY: 0,
                scale: 1,
                targetScale: 1
            };
        });

        function applyTransform(state) {
            state.button.style.transform =
                'translate3d(' + state.x.toFixed(2) + 'px, ' + state.y.toFixed(2) + 'px, 0) scale(' + state.scale.toFixed(3) + ')';
        }

        function updateMagnetTargets() {
            states.forEach(function (state) {
                if (!pointerInsideWindow) {
                    state.targetX = 0;
                    state.targetY = 0;
                    return;
                }

                var rect = state.button.getBoundingClientRect();
                var nearestX = Math.max(rect.left, Math.min(pointerX, rect.right));
                var nearestY = Math.max(rect.top, Math.min(pointerY, rect.bottom));
                var distance = Math.hypot(pointerX - nearestX, pointerY - nearestY);

                if (distance > MAGNET_TRIGGER_DISTANCE) {
                    state.targetX = 0;
                    state.targetY = 0;
                    return;
                }

                var centerX = rect.left + rect.width / 2;
                var centerY = rect.top + rect.height / 2;
                var dx = pointerX - centerX;
                var dy = pointerY - centerY;
                var length = Math.hypot(dx, dy);

                if (length < 0.001) {
                    state.targetX = 0;
                    state.targetY = 0;
                    return;
                }

                var pullStrength = 1 - distance / MAGNET_TRIGGER_DISTANCE;
                var offset = MAGNET_MIN_OFFSET + (MAGNET_MAX_OFFSET - MAGNET_MIN_OFFSET) * pullStrength;

                state.targetX = (dx / length) * offset;
                state.targetY = (dy / length) * offset;
            });
        }

        function tick(now) {
            var dt = Math.min((now - lastTime) / 1000, 0.034);
            lastTime = now;

            var hasMotion = false;

            states.forEach(function (state) {
                var ax = SPRING_STIFFNESS * (state.targetX - state.x) - SPRING_DAMPING * state.vx;
                var ay = SPRING_STIFFNESS * (state.targetY - state.y) - SPRING_DAMPING * state.vy;

                state.vx += ax * dt;
                state.vy += ay * dt;
                state.x += state.vx * dt;
                state.y += state.vy * dt;

                state.scale += (state.targetScale - state.scale) * Math.min(1, dt * 24);

                applyTransform(state);

                if (
                    Math.abs(state.targetX - state.x) > 0.02 ||
                    Math.abs(state.targetY - state.y) > 0.02 ||
                    Math.abs(state.vx) > 0.02 ||
                    Math.abs(state.vy) > 0.02 ||
                    Math.abs(state.targetScale - state.scale) > 0.002
                ) {
                    hasMotion = true;
                }
            });

            if (hasMotion || pointerInsideWindow) {
                rafId = requestAnimationFrame(tick);
            } else {
                rafId = null;
            }
        }

        function ensureAnimation() {
            if (rafId === null) {
                lastTime = performance.now();
                rafId = requestAnimationFrame(tick);
            }
        }

        function setPressed(button, pressed) {
            states.forEach(function (state) {
                if (state.button === button) {
                    state.targetScale = pressed ? 0.95 : 1;
                }
            });
            ensureAnimation();
        }

        document.addEventListener('mousemove', function (e) {
            pointerX = e.clientX;
            pointerY = e.clientY;
            pointerInsideWindow = true;
            updateMagnetTargets();
            ensureAnimation();
        }, { passive: true });

        window.addEventListener('mouseout', function (e) {
            if (e.relatedTarget === null) {
                pointerInsideWindow = false;
                updateMagnetTargets();
                ensureAnimation();
            }
        });

        window.addEventListener('resize', function () {
            updateMagnetTargets();
            ensureAnimation();
        });

        window.addEventListener('scroll', function () {
            updateMagnetTargets();
            ensureAnimation();
        }, { passive: true });

        magneticButtons.forEach(function (button) {
            button.addEventListener('pointerdown', function () {
                setPressed(button, true);
            });

            button.addEventListener('pointerup', function () {
                setPressed(button, false);
            });

            button.addEventListener('pointerleave', function () {
                setPressed(button, false);
            });

            button.addEventListener('pointercancel', function () {
                setPressed(button, false);
            });

            button.addEventListener('blur', function () {
                setPressed(button, false);
            });

            button.addEventListener('click', function () {
                setPressed(button, true);
                setTimeout(function () {
                    setPressed(button, false);
                }, 90);
            });
        });
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