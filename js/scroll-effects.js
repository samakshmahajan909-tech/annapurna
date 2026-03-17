/* ===================================
   SCROLL EFFECTS - Apple Style
   Using GSAP & ScrollTrigger
   =================================== */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initScrollProgress();
    initHeroAnimations();
    initTextReveal();
    initHorizontalScroll();
    initServiceZoom();
    initImpactCounter();
    initGalleryReveal();
    initParallaxEffects();
    initDonateEffects();
    initNavigation();
});

/* ===================================
   LENIS SMOOTH SCROLL
   =================================== */

let lenis;

function initSmoothScroll() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

/* ===================================
   SCROLL PROGRESS BAR
   =================================== */

function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    if (!progressBar) return;

    gsap.to(progressBar, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
        }
    });
}

/* ===================================
   HERO ANIMATIONS
   =================================== */

function initHeroAnimations() {
    const heroSection = document.querySelector('.hero-parallax');
    if (!heroSection) return;

    // Title words animation
    const titleWords = document.querySelectorAll('.title-word');
    const heroDescription = document.querySelector('.hero-description');
    const heroCta = document.querySelector('.hero-cta');
    const scrollIndicator = document.querySelector('.scroll-indicator-hero');
    const parallaxBg = document.querySelector('.hero-parallax-bg .parallax-img');

    // Initial animation timeline
    const heroTl = gsap.timeline({ delay: 0.5 });

    heroTl
        .to(titleWords, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out'
        })
        .to(heroDescription, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4')
        .to(heroCta, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4')
        .to(scrollIndicator, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.2');

    // Parallax effect on scroll
    if (parallaxBg) {
        gsap.to(parallaxBg, {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            }
        });
    }

    // Fade out hero content on scroll
    gsap.to('.hero-parallax-content', {
        opacity: 0,
        y: -100,
        ease: 'none',
        scrollTrigger: {
            trigger: heroSection,
            start: 'center center',
            end: 'bottom top',
            scrub: true,
        }
    });
}

/* ===================================
   TEXT REVEAL (Word by Word)
   =================================== */

function initTextReveal() {
    const revealWords = document.querySelectorAll('.reveal-word');
    if (revealWords.length === 0) return;

    gsap.to(revealWords, {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.intro-section',
            start: 'top 80%',
            end: 'center center',
            scrub: true,
        }
    });
}

/* ===================================
   HORIZONTAL SCROLL SECTION
   =================================== */

function initHorizontalScroll() {
    const horizontalSection = document.querySelector('.about-horizontal');
    const horizontalContainer = document.querySelector('.horizontal-container');
    
    if (!horizontalSection || !horizontalContainer) return;

    // Only enable horizontal scroll on desktop
    if (window.innerWidth <= 768) {
        return;
    }

    const panels = gsap.utils.toArray('.horizontal-panel');
    const totalWidth = horizontalContainer.scrollWidth - window.innerWidth;

    // Pin and horizontal scroll
    gsap.to(horizontalContainer, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
            trigger: horizontalSection,
            start: 'top top',
            end: () => `+=${totalWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
        }
    });

    // Scale images within panels
    panels.forEach((panel) => {
        const img = panel.querySelector('.scale-image');
        if (img) {
            gsap.to(img, {
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: panel,
                    containerAnimation: gsap.to(horizontalContainer, { x: -totalWidth }),
                    start: 'left right',
                    end: 'center center',
                    scrub: true,
                }
            });
        }
    });
}

/* ===================================
   SERVICE ZOOM CARDS
   =================================== */

function initServiceZoom() {
    const serviceCards = document.querySelectorAll('.service-zoom-card');
    
    serviceCards.forEach((card) => {
        const bg = card.querySelector('.service-zoom-bg img');
        const content = card.querySelector('.service-zoom-content');

        // Background zoom effect
        gsap.to(bg, {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
            }
        });

        // Content reveal
        gsap.to(content, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 60%',
                toggleActions: 'play none none reverse',
            }
        });
    });
}

/* ===================================
   IMPACT COUNTER ANIMATION
   =================================== */

function initImpactCounter() {
    const impactSection = document.querySelector('.impact-counter');
    const impactItems = document.querySelectorAll('.impact-item');
    const impactBg = document.querySelector('.impact-bg-parallax img');
    
    if (!impactSection) return;

    // Parallax background
    if (impactBg) {
        gsap.to(impactBg, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: impactSection,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            }
        });
    }

    // Impact items reveal
    gsap.to(impactItems, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: impactSection,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
        }
    });

    // Counter animation
    const counters = document.querySelectorAll('.impact-number');
    
    counters.forEach((counter) => {
        const target = parseInt(counter.dataset.count);
        
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(counter, {
                    innerText: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { innerText: 1 },
                    onUpdate: function() {
                        counter.innerText = Math.floor(counter.innerText).toLocaleString() + '+';
                    }
                });
            },
            once: true
        });
    });
}

/* ===================================
   GALLERY IMAGE REVEAL
   =================================== */

function initGalleryReveal() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach((item, index) => {
        const speed = parseFloat(item.dataset.speed) || 1;
        const image = item.querySelector('.gallery-image');
        const img = item.querySelector('img');

        // Staggered reveal
        gsap.from(item, {
            opacity: 0,
            y: 60,
            duration: 1,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            }
        });

        // Parallax on each image
        gsap.to(img, {
            yPercent: -20 * speed,
            ease: 'none',
            scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            }
        });
    });
}

/* ===================================
   PARALLAX EFFECTS
   =================================== */

function initParallaxEffects() {
    // Generic parallax for any element with data-parallax
    document.querySelectorAll('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        
        gsap.to(el, {
            yPercent: -100 * speed,
            ease: 'none',
            scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            }
        });
    });
}

/* ===================================
   DONATE SECTION EFFECTS
   =================================== */

function initDonateEffects() {
    const donateSection = document.querySelector('.donate-section');
    const stackImages = document.querySelectorAll('.stack-img');
    
    if (!donateSection || stackImages.length === 0) return;

    // Stack images animation
    stackImages.forEach((img, index) => {
        gsap.to(img, {
            y: -30 * (index + 1),
            rotation: (index - 1) * 5,
            ease: 'none',
            scrollTrigger: {
                trigger: donateSection,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
            }
        });
    });

    // Amount button interactions
    const amountBtns = document.querySelectorAll('.donate-content .amount-btn');
    const impactPreviews = document.querySelectorAll('.impact-preview-item');

    amountBtns.forEach((btn) => {
        btn.addEventListener('click', function() {
            // Remove active from all
            amountBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');

            // Update impact preview
            const amount = this.dataset.amount;
            impactPreviews.forEach(preview => {
                preview.classList.remove('active');
                if (preview.dataset.amount === amount) {
                    preview.classList.add('active');
                }
            });
        });
    });
}

/* ===================================
   NAVIGATION
   =================================== */

function initNavigation() {
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Header scroll effect
    ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        toggleClass: {
            targets: header,
            className: 'scrolled'
        }
    });

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => updateActiveLink(section.id),
            onEnterBack: () => updateActiveLink(section.id),
        });
    });

    function updateActiveLink(id) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }
}

/* ===================================
   SMOOTH SCROLL TO ANCHOR
   =================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target && lenis) {
            lenis.scrollTo(target, {
                offset: -80,
                duration: 1.5,
            });
        }
    });
});

/* ===================================
   REFRESH SCROLL TRIGGER ON RESIZE
   =================================== */

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

/* ===================================
   PRELOADER (Optional)
   =================================== */

window.addEventListener('load', () => {
    // Hide preloader if exists
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => preloader.remove()
        });
    }
    
    // Refresh ScrollTrigger after all images loaded
    ScrollTrigger.refresh();
});