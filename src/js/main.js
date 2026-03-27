(function () {
    'use strict';

    // ========================================
    // MOBILE HAMBURGER MENU
    // ========================================
    const hamburger = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    const navCta = document.querySelector('.navbar__cta');
    const authControls = document.getElementById('authControls');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isOpen);
            navLinks.classList.toggle('is-open');
            if (navCta) navCta.classList.toggle('is-open');
            if (authControls) authControls.classList.toggle('is-open');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('is-open');
                if (navCta) navCta.classList.remove('is-open');
                if (authControls) authControls.classList.remove('is-open');
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

    updateHeader();

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
    const waitlistEmailInput = document.getElementById('waitlistEmail');
    const waitlistNameInput = document.getElementById('waitlistName');
    const waitlistStatus = document.getElementById('waitlistStatus');

    function setWaitlistStatus(message, isError) {
        if (!waitlistStatus) return;
        waitlistStatus.textContent = message || '';
        waitlistStatus.classList.toggle('is-error', !!isError);
    }

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(waitlistForm);
            const name = String(formData.get('name') || '').trim();
            const role = String(formData.get('role') || '').trim();

            const btn = waitlistForm.querySelector('.waitlist-form__btn');
            const originalHTML = btn.innerHTML;
            btn.disabled = true;
            btn.textContent = 'Saving...';
            setWaitlistStatus('');

            const authConfig = window.WW_AUTH_CONFIG || {};
            const hasUrl = !!authConfig.supabaseUrl && authConfig.supabaseUrl.indexOf('YOUR_PROJECT_ID') === -1;
            const hasKey = !!authConfig.supabaseAnonKey && authConfig.supabaseAnonKey.indexOf('YOUR_SUPABASE_ANON_KEY') === -1;
            const hasClient = !!(window.supabase && window.supabase.createClient);

            if (!hasUrl || !hasKey || !hasClient) {
                setWaitlistStatus('Auth setup is missing. Please configure Supabase keys first.', true);
                btn.innerHTML = originalHTML;
                btn.disabled = false;
                return;
            }

            try {
                const supabaseClient = window.supabase.createClient(authConfig.supabaseUrl, authConfig.supabaseAnonKey);
                const sessionResult = await supabaseClient.auth.getSession();
                const session = sessionResult && sessionResult.data ? sessionResult.data.session : null;
                const user = session ? session.user : null;

                if (!user || !user.email) {
                    setWaitlistStatus('Please log in first, then join the waitlist.', true);
                    const loginTrigger = document.querySelector('.auth-open-btn[data-auth-mode="login"]');
                    if (loginTrigger) loginTrigger.click();
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                    return;
                }

                if (waitlistEmailInput) {
                    waitlistEmailInput.value = user.email;
                    waitlistEmailInput.readOnly = true;
                }

                const { error } = await supabaseClient.from('waitlist').insert([{
                    name: name,
                    email: user.email,
                    role: role,
                    signed_up_at: new Date().toISOString()
                }]);

                if (error) throw error;

                btn.textContent = '✓ Added to waitlist';
                btn.style.background = '#10B981';
                setWaitlistStatus('Saved. You are now on the waitlist.', false);

                setTimeout(function () {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                    if (waitlistNameInput) waitlistNameInput.value = '';
                    const roleSelect = document.getElementById('waitlistRole');
                    if (roleSelect) roleSelect.selectedIndex = 0;
                }, 2200);
            } catch (error) {
                setWaitlistStatus(error && error.message ? error.message : 'Unable to save right now. Please retry.', true);
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
            }
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
    const heroSectionEl = document.getElementById('hero');
    if (mobileCta && heroSectionEl && 'IntersectionObserver' in window) {
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

        heroObserver.observe(heroSectionEl);
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
    const magneticButtons = Array.from(document.querySelectorAll('.btn--primary, .hero-dark__btn')).filter(function (b) {
        return !b.id || b.id !== 'waitlistHeroBtn';
    });
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
    // HERO WAITLIST BUTTON — DOG SPRINT ANIMATION
    // ========================================
    (function () {
        var heroBtn = document.getElementById('waitlistHeroBtn');
        if (!heroBtn) return;

        var dogSvg = heroBtn.querySelector('.ww-btn__dog');
        var dogStage = heroBtn.querySelector('.ww-btn__dog-stage');
        if (!dogSvg || !dogStage) return;

        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Spring state
        var DOG_STIFFNESS = 110;
        var DOG_DAMPING = 11;
        var dogX = 0;   // current position (px, relative to stage start)
        var dogVx = 0;   // velocity
        var dogTarget = 0;
        var dogRafId = null;
        var lastDogTime = 0;

        function scrollToWaitlistForm() {
            var waitlistForm = document.getElementById('waitlistForm');
            var fallbackTarget = document.querySelector(heroBtn.getAttribute('href'));
            var target = waitlistForm || fallbackTarget;
            if (!target) return;

            var headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
            var offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }

        function setDogX(px) {
            dogSvg.style.setProperty('--dog-x', px.toFixed(2) + 'px');
        }

        function springTick(now) {
            var dt = Math.min((now - lastDogTime) / 1000, 0.034);
            lastDogTime = now;

            var ax = DOG_STIFFNESS * (dogTarget - dogX) - DOG_DAMPING * dogVx;
            dogVx += ax * dt;
            dogX += dogVx * dt;
            setDogX(dogX);

            var settled = Math.abs(dogTarget - dogX) < 0.5 && Math.abs(dogVx) < 0.5;
            if (!settled) {
                dogRafId = requestAnimationFrame(springTick);
            } else {
                dogX = dogTarget;
                setDogX(dogX);
                dogRafId = null;
                onDogArrived();
            }
        }

        function onDogArrived() {
            heroBtn.classList.remove('ww-btn--running');
            heroBtn.classList.add('ww-btn--confirmed');

            // Let the confirmation state be visible briefly before scrolling.
            setTimeout(scrollToWaitlistForm, 220);
        }

        function runDogAnimation() {
            // Measure available sprint distance: stage width minus dog width minus padding
            var stageW = dogStage.offsetWidth || 200;
            var dogW = dogSvg.offsetWidth || 80;
            var padding = 24;
            dogTarget = stageW - dogW - padding * 2;

            dogX = -dogW;  // start offscreen left
            dogVx = 260;    // give it an immediate forward kick (spring units/s)
            lastDogTime = performance.now();

            setDogX(dogX);

            if (dogRafId) cancelAnimationFrame(dogRafId);
            dogRafId = requestAnimationFrame(springTick);
        }

        heroBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation(); // block smooth-scroll & any other click handlers

            if (heroBtn.classList.contains('ww-btn--running') ||
                heroBtn.classList.contains('ww-btn--confirmed')) return;

            if (reducedMotion) {
                heroBtn.classList.add('ww-btn--confirmed');
                setTimeout(scrollToWaitlistForm, 120);
                return;
            }

            heroBtn.classList.add('ww-btn--running');
            runDogAnimation();
        }, { capture: true });
    }());

    // ========================================
    // AUTH — SUPABASE LOGIN / SIGNUP
    // ========================================
    (function () {
        const authModal = document.getElementById('authModal');
        const authModalClose = document.getElementById('authModalClose');
        const authOpenButtons = document.querySelectorAll('.auth-open-btn');
        const authStatus = document.getElementById('authStatus');
        const authTabs = document.querySelectorAll('[data-auth-tab]');
        const authTitle = document.getElementById('authModalTitle');

        const signupForm = document.getElementById('signupForm');
        const loginForm = document.getElementById('loginForm');
        const forgotForm = document.getElementById('forgotForm');
        const signupSubmitBtn = document.getElementById('signupSubmitBtn');
        const loginSubmitBtn = document.getElementById('loginSubmitBtn');
        const forgotSubmitBtn = document.getElementById('forgotSubmitBtn');
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        const switchToSignupLink = document.getElementById('switchToSignupLink');
        const switchToLoginLink = document.getElementById('switchToLoginLink');

        const authUserPanel = document.getElementById('authUserPanel');
        const authUserEmail = document.getElementById('authUserEmail');
        const authLogoutBtn = document.getElementById('authLogoutBtn');

        if (!authModal || !signupForm || !loginForm) return;

        function setStatus(message, kind) {
            if (!authStatus) return;
            authStatus.textContent = message || '';
            authStatus.classList.remove('is-error', 'is-success');
            if (kind === 'error') authStatus.classList.add('is-error');
            if (kind === 'success') authStatus.classList.add('is-success');
        }

        function setLoading(button, loading, loadingText, idleText) {
            if (!button) return;
            button.disabled = loading;
            button.textContent = loading ? loadingText : idleText;
        }

        function switchAuthMode(mode) {
            const isForgot = mode === 'forgot';
            const isSignup = !isForgot && mode !== 'login';
            const isLogin = !isForgot && !isSignup;

            signupForm.classList.toggle('is-hidden', !isSignup);
            loginForm.classList.toggle('is-hidden', !isLogin);
            if (forgotForm) forgotForm.classList.toggle('is-hidden', !isForgot);

            const titles = { signup: 'Create your account', login: 'Log in to your account', forgot: 'Reset your password' };
            if (authTitle) authTitle.textContent = titles[mode] || 'Create your account';

            authTabs.forEach(function (tab) {
                const active = tab.getAttribute('data-auth-tab') === mode;
                tab.classList.toggle('is-active', active);
                tab.setAttribute('aria-selected', active ? 'true' : 'false');
            });

            setStatus('');
        }

        function openAuthModal(mode) {
            switchAuthMode(mode || 'login');
            authModal.classList.add('is-open');
            authModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeAuthModal() {
            authModal.classList.remove('is-open');
            authModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            setStatus('');
        }

        authOpenButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                openAuthModal(btn.getAttribute('data-auth-mode'));
            });
        });

        authTabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                switchAuthMode(tab.getAttribute('data-auth-tab'));
            });
        });

        if (authModalClose) {
            authModalClose.addEventListener('click', closeAuthModal);
        }

        authModal.addEventListener('click', function (event) {
            const clickedClose = event.target && event.target.hasAttribute('data-auth-close');
            if (clickedClose) closeAuthModal();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && authModal.classList.contains('is-open')) {
                closeAuthModal();
            }
        });

        function updateAuthUi(user) {
            const loggedIn = !!user;

            authOpenButtons.forEach(function (btn) {
                btn.hidden = loggedIn;
            });

            if (authUserPanel) authUserPanel.hidden = !loggedIn;

            if (authUserEmail) {
                authUserEmail.textContent = loggedIn
                    ? (user.email || (user.user_metadata && user.user_metadata.full_name) || 'Signed in')
                    : '';
            }

            if (waitlistEmailInput) {
                if (loggedIn && user.email) {
                    waitlistEmailInput.value = user.email;
                    waitlistEmailInput.readOnly = true;
                } else {
                    waitlistEmailInput.readOnly = false;
                    waitlistEmailInput.value = '';
                }
            }

            if (waitlistNameInput && loggedIn && user.user_metadata && user.user_metadata.full_name) {
                if (!waitlistNameInput.value.trim()) {
                    waitlistNameInput.value = user.user_metadata.full_name;
                }
            }
        }

        const authConfig = window.WW_AUTH_CONFIG || {};
        const hasUrl = !!authConfig.supabaseUrl && authConfig.supabaseUrl.indexOf('YOUR_PROJECT_ID') === -1;
        const hasAnonKey = !!authConfig.supabaseAnonKey && authConfig.supabaseAnonKey.indexOf('YOUR_SUPABASE_ANON_KEY') === -1;
        const hasClient = !!(window.supabase && window.supabase.createClient);

        if (!hasUrl || !hasAnonKey || !hasClient) {
            updateAuthUi(null);
            setStatus('Configure src/js/auth-config.js with your Supabase URL and anon key.', 'error');
            signupForm.addEventListener('submit', function (event) {
                event.preventDefault();
                setStatus('Auth setup pending: please add Supabase credentials.', 'error');
            });
            loginForm.addEventListener('submit', function (event) {
                event.preventDefault();
                setStatus('Auth setup pending: please add Supabase credentials.', 'error');
            });
            return;
        }

        const supabaseClient = window.supabase.createClient(authConfig.supabaseUrl, authConfig.supabaseAnonKey);

        async function refreshSessionUi() {
            const result = await supabaseClient.auth.getSession();
            const session = result && result.data ? result.data.session : null;
            updateAuthUi(session ? session.user : null);
        }

        signupForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const data = new FormData(signupForm);
            const name = String(data.get('name') || '').trim();
            const email = String(data.get('email') || '').trim();
            const password = String(data.get('password') || '');

            if (!name || !email || password.length < 8) {
                setStatus('Enter your name, a valid email, and a password with at least 8 characters.', 'error');
                return;
            }

            setLoading(signupSubmitBtn, true, 'Creating account...', 'Create Account');
            setStatus('');

            try {
                const response = await supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: name
                        }
                    }
                });

                if (response.error) throw response.error;

                const hasSession = !!(response.data && response.data.session);
                if (hasSession) {
                    setStatus('Account created and signed in successfully.', 'success');
                    closeAuthModal();
                } else {
                    setStatus('Account created. Check your email to confirm your sign up.', 'success');
                }

                signupForm.reset();
                await refreshSessionUi();
            } catch (error) {
                setStatus(error && error.message ? error.message : 'Unable to create account right now.', 'error');
            } finally {
                setLoading(signupSubmitBtn, false, 'Creating account...', 'Create Account');
            }
        });

        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const data = new FormData(loginForm);
            const email = String(data.get('email') || '').trim();
            const password = String(data.get('password') || '');

            if (!email || !password) {
                setStatus('Please enter your email and password.', 'error');
                return;
            }

            setLoading(loginSubmitBtn, true, 'Logging in...', 'Log In');
            setStatus('');

            try {
                const response = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (response.error) throw response.error;

                setStatus('Logged in successfully.', 'success');
                loginForm.reset();
                closeAuthModal();
                await refreshSessionUi();
            } catch (error) {
                setStatus(error && error.message ? error.message : 'Unable to log in right now.', 'error');
            } finally {
                setLoading(loginSubmitBtn, false, 'Logging in...', 'Log In');
            }
        });

        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', function () {
                switchAuthMode('forgot');
            });
        }

        if (switchToSignupLink) {
            switchToSignupLink.addEventListener('click', function () {
                switchAuthMode('signup');
            });
        }

        if (switchToLoginLink) {
            switchToLoginLink.addEventListener('click', function () {
                switchAuthMode('login');
            });
        }

        const googleSignInBtn = document.getElementById('googleSignInBtn');
        if (googleSignInBtn) {
            googleSignInBtn.addEventListener('click', async function () {
                setStatus('');
                googleSignInBtn.disabled = true;
                googleSignInBtn.textContent = 'Redirecting to Google...';

                try {
                    const response = await supabaseClient.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: window.location.origin + window.location.pathname
                        }
                    });

                    if (response.error) throw response.error;
                    // Supabase will redirect the browser to Google
                } catch (error) {
                    setStatus(error && error.message ? error.message : 'Unable to sign in with Google right now.', 'error');
                    googleSignInBtn.disabled = false;
                    googleSignInBtn.textContent = 'Continue with Google';
                }
            });
        }

        if (forgotForm) {
            forgotForm.addEventListener('submit', async function (event) {
                event.preventDefault();

                const data = new FormData(forgotForm);
                const email = String(data.get('email') || '').trim();

                if (!email) {
                    setStatus('Please enter your email address.', 'error');
                    return;
                }

                setLoading(forgotSubmitBtn, true, 'Sending...', 'Send Reset Link');
                setStatus('');

                try {
                    const response = await supabaseClient.auth.resetPasswordForEmail(email, {
                        redirectTo: window.location.origin + window.location.pathname
                    });

                    if (response.error) throw response.error;

                    setStatus('Reset link sent. Check your email.', 'success');
                    forgotForm.reset();
                } catch (error) {
                    setStatus(error && error.message ? error.message : 'Unable to send reset link right now.', 'error');
                } finally {
                    setLoading(forgotSubmitBtn, false, 'Sending...', 'Send Reset Link');
                }
            });
        }

        if (authLogoutBtn) {
            authLogoutBtn.addEventListener('click', async function () {
                setStatus('');
                const response = await supabaseClient.auth.signOut();
                if (response.error) {
                    setStatus(response.error.message || 'Unable to log out right now.', 'error');
                    return;
                }

                updateAuthUi(null);
            });
        }

        supabaseClient.auth.onAuthStateChange(function (_event, session) {
            updateAuthUi(session ? session.user : null);
        });

        refreshSessionUi();
    }());

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