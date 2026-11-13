// ===== STAYOUNG Sports Academy — JavaScript =====

document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    const heroSection = document.getElementById('hero');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on load

    // ---- Mobile Menu Toggle ----
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let menuOpen = false;

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            menuOpen = !menuOpen;
            mobileMenu.classList.toggle('hidden');
            // Update icon
            const icon = menuBtn.querySelector('[data-lucide]');
            if (icon) {
                icon.setAttribute('data-lucide', menuOpen ? 'x' : 'menu');
                lucide.createIcons();
            }
        });

        // Close mobile menu on link click
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuOpen = false;
                mobileMenu.classList.add('hidden');
                const icon = menuBtn.querySelector('[data-lucide]');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // ---- Scroll Animations (Intersection Observer) ----
    const scrollElements = document.querySelectorAll('.scroll-animate');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the animation slightly for each element
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    scrollElements.forEach(el => observer.observe(el));

    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ---- Active Nav Link Highlighting ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 100;
        let currentId = null;

        sections.forEach(section => {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const active = link.getAttribute('href') === `#${currentId}`;
            link.classList.toggle('text-accent-500', active);
            link.classList.toggle('font-bold', active);
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
});

// ---- Contact Form Handler ----
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const name = formData.get('name');
    const phone = formData.get('phone');
    const select = form.querySelector('select[name="interest"]');
    // Use the visible label (without the emoji) instead of the raw value
    const interest = select.value
        ? select.options[select.selectedIndex].text.replace(/^[^A-Za-z]+/, '')
        : 'General Inquiry';
    const message = formData.get('message') || '';

    const text = `Hi! I'm ${name}.\n\nInterested in: ${interest}\nPhone: ${phone}\n\n${message}`;
    const waUrl = `https://wa.me/919944654359?text=${encodeURIComponent(text)}`;

    // Open WhatsApp straight away (delayed pop-ups get blocked on mobile)
    window.open(waUrl, '_blank');

    // Show feedback on the button
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="flex items-center justify-center gap-2">✓ Opening WhatsApp...</span>';
    btn.classList.add('bg-gray-900');
    btn.classList.remove('bg-accent-500');

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-gray-900');
        btn.classList.add('bg-accent-500');
        if (typeof lucide !== 'undefined') lucide.createIcons();
        form.reset();
    }, 2000);
}

// ---- Gallery Lightbox ----
document.addEventListener('DOMContentLoaded', () => {
    const items = [...document.querySelectorAll('.gallery-item')];
    const box = document.getElementById('lightbox');
    if (!items.length || !box) return;
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    let current = 0;

    const show = (i) => {
        current = (i + items.length) % items.length;
        img.src = items[current].dataset.full;
        img.alt = items[current].dataset.caption;
        cap.textContent = items[current].dataset.caption;
    };
    const open = (i) => {
        show(i);
        box.classList.remove('hidden');
        box.classList.add('flex');
        document.body.style.overflow = 'hidden';
    };
    const close = () => {
        box.classList.add('hidden');
        box.classList.remove('flex');
        document.body.style.overflow = '';
    };

    items.forEach((el, i) => el.addEventListener('click', () => open(i)));
    document.getElementById('lightbox-close').addEventListener('click', close);
    document.getElementById('lightbox-prev').addEventListener('click', () => show(current - 1));
    document.getElementById('lightbox-next').addEventListener('click', () => show(current + 1));
    box.addEventListener('click', (e) => { if (e.target === box) close(); });
    document.addEventListener('keydown', (e) => {
        if (box.classList.contains('hidden')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') show(current - 1);
        if (e.key === 'ArrowRight') show(current + 1);
    });
});
