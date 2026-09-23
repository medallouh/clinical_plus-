/* ============================================================
   CLINICALPLUS — script.js
   Plateforme d'apprentissage médical
   Code complet — Sans dépendances externes
   ============================================================ */

'use strict';

/* ============================================================
   1. DONNÉES DES MATIÈRES
   ============================================================ */

const MATIERES = [
    {
        id: 1,
        nom: 'Anatomie',
        icone: '🫀',
        slug: 'anatomie',
        description: 'Structure et organisation du corps humain'
    },
    {
        id: 2,
        nom: 'Physiologie',
        icone: '🧬',
        slug: 'physiologie',
        description: 'Fonctionnement des systèmes de l\'organisme'
    },
    {
        id: 3,
        nom: 'Pharmacologie',
        icone: '💊',
        slug: 'pharmacologie',
        description: 'Médicaments, effets et utilisations'
    },
    {
        id: 4,
        nom: 'Microbiologie',
        icone: '🦠',
        slug: 'microbiologie',
        description: 'Micro-organismes et leur rôle en santé'
    },
    {
        id: 5,
        nom: 'Soins infirmiers',
        icone: '🩹',
        slug: 'soins-infirmiers',
        description: 'Pratiques et techniques de soins'
    },
    {
        id: 6,
        nom: 'Biochimie',
        icone: '🧪',
        slug: 'biochimie',
        description: 'Chimie du vivant et métabolismes'
    },
    {
        id: 7,
        nom: 'Psychologie',
        icone: '🧠',
        slug: 'psychologie',
        description: 'Comportement et processus mentaux'
    },
    {
        id: 8,
        nom: 'Pathologie',
        icone: '🌡️',
        slug: 'pathologie',
        description: 'Étude des maladies et désordres'
    },
    {
        id: 9,
        nom: 'Hygiène hospitalière',
        icone: '👩‍⚕️',
        slug: 'hygiene-hospitaliere',
        description: 'Prévention des infections nosocomiales'
    },
    {
        id: 10,
        nom: 'Santé publique',
        icone: '📋',
        slug: 'sante-publique',
        description: 'Santé des populations et prévention'
    }
];

/* ============================================================
   2. UTILITAIRES
   ============================================================ */

/**
 * Raccourci pour querySelector
 */
function $(selector, context) {
    return (context || document).querySelector(selector);
}

/**
 * Raccourci pour querySelectorAll (retourne un tableau)
 */
function $$(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
}

/**
 * Échappe le HTML pour éviter les injections XSS
 */
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Construit l'URL vers la page d'une matière
 */
function buildMatiereUrl(matiere) {
    var slug = matiere.slug || (matiere.nom || '').toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');
    return 'matiere.html?slug=' + encodeURIComponent(slug);
}

/* ============================================================
   3. AFFICHAGE DES MATIÈRES
   ============================================================ */

function afficherMatieres() {
    var container = $('#matieres-container');

    if (!container) {
        console.warn('⚠️ #matieres-container introuvable dans le HTML.');
        return;
    }

    // Construction du HTML
    var html = '';

    for (var i = 0; i < MATIERES.length; i++) {
        var m = MATIERES[i];
        html += '<a href="' + buildMatiereUrl(m) + '" class="matiere-card" style="transition-delay:' + (i * 40) + 'ms;">';
        html += '    <div class="matiere-icon">' + escapeHtml(m.icone) + '</div>';
        html += '    <h3>' + escapeHtml(m.nom) + '</h3>';
        html += '    <p>' + escapeHtml(m.description) + '</p>';
        html += '    <span class="matiere-link">Explorer →</span>';
        html += '</a>';
    }

    container.innerHTML = html;

    console.log('✅ ' + MATIERES.length + ' matières affichées.');
}

/* ============================================================
   4. MENU MOBILE
   ============================================================ */

function initMobileMenu() {
    var btn = $('.mobile-menu');
    var nav = $('.main-nav');

    if (!btn || !nav) return;

    // Ouvrir / fermer au clic sur le bouton
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        nav.classList.toggle('open');
        btn.classList.toggle('active');

        var isOpen = nav.classList.contains('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Fermer au clic sur un lien
    var links = $$('.nav-link', nav);
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function () {
            nav.classList.remove('open');
            btn.classList.remove('active');
        });
    }

    // Fermer au clic à l'extérieur
    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target) && !btn.contains(e.target)) {
            nav.classList.remove('open');
            btn.classList.remove('active');
        }
    });

    // Fermer avec la touche Échap
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            nav.classList.remove('open');
            btn.classList.remove('active');
        }
    });
}

/* ============================================================
   5. HEADER AU SCROLL
   ============================================================ */

function initHeaderScroll() {
    var header = $('.site-header');
    if (!header) return;

    function onScroll() {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ============================================================
   6. SMOOTH SCROLL (liens d'ancre)
   ============================================================ */

function initSmoothScroll() {
    var links = $$('a[href^="#"]');

    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href === '#') return;

            var target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            var offset = 90;
            var top = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    }
}

/* ============================================================
   7. ANIMATION AU SCROLL (fade-in)
   ============================================================ */

function initScrollReveal() {
    var selectors = [
        '.feature-card',
        '.track-card',
        '.option-card',
        '.subject-card',
        '.course-card',
        '.resource-card',
        '.matiere-card',
        '.dashboard-preview',
        '.contact-box',
        '.section-heading'
    ];

    var elements = $$(selectors.join(','));
    if (!elements.length) return;

    // Style injecté
    var style = document.createElement('style');
    style.textContent =
        '.reveal {' +
        '   opacity: 0;' +
        '   transform: translateY(28px);' +
        '   transition: opacity .7s cubic-bezier(.25,.8,.3,1), transform .7s cubic-bezier(.25,.8,.3,1);' +
        '}' +
        '.reveal.visible {' +
        '   opacity: 1;' +
        '   transform: translateY(0);' +
        '}' +
        '@media (prefers-reduced-motion: reduce) {' +
        '   .reveal { opacity: 1; transform: none; transition: none; }' +
        '}';
    document.head.appendChild(style);

    // Fallback si IntersectionObserver indisponible
    if (!('IntersectionObserver' in window)) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.add('visible');
        }
        return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    for (var j = 0; j < elements.length; j++) {
        elements[j].classList.add('reveal');
        observer.observe(elements[j]);
    }
}

/* ============================================================
   8. BOUTON RETOUR EN HAUT
   ============================================================ */

function initBackToTop() {
    // Style
    var style = document.createElement('style');
    style.textContent =
        '.back-to-top {' +
        '   position: fixed;' +
        '   bottom: 30px;' +
        '   right: 30px;' +
        '   width: 48px;' +
        '   height: 48px;' +
        '   border-radius: 50%;' +
        '   background: linear-gradient(135deg, #35B7ED, #168BD0);' +
        '   color: #fff;' +
        '   border: none;' +
        '   font-size: 1.4rem;' +
        '   font-weight: 700;' +
        '   cursor: pointer;' +
        '   box-shadow: 0 8px 24px rgba(22,139,208,.35);' +
        '   opacity: 0;' +
        '   visibility: hidden;' +
        '   transform: translateY(10px);' +
        '   transition: opacity .3s, visibility .3s, transform .3s;' +
        '   z-index: 999;' +
        '}' +
        '.back-to-top.show {' +
        '   opacity: 1;' +
        '   visibility: visible;' +
        '   transform: translateY(0);' +
        '}' +
        '.back-to-top:hover {' +
        '   transform: translateY(-4px);' +
        '}' +
        '@media (max-width: 768px) {' +
        '   .back-to-top { bottom: 20px; right: 20px; width: 44px; height: 44px; }' +
        '}';
    document.head.appendChild(style);

    // Bouton
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Retour en haut');
    document.body.appendChild(btn);

    function onScroll() {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============================================================
   9. BARRE DE PROGRESSION AU SCROLL
   ============================================================ */

function initScrollProgress() {
    var style = document.createElement('style');
    style.textContent =
        '.scroll-progress {' +
        '   position: fixed;' +
        '   top: 0;' +
        '   left: 0;' +
        '   height: 3px;' +
        '   width: 0%;' +
        '   background: linear-gradient(90deg, #35B7ED, #168BD0, #ff6b61);' +
        '   z-index: 9999;' +
        '   transition: width .1s linear;' +
        '}';
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    function onScroll() {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
        bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ============================================================
   10. LIEN ACTIF SELON LA SECTION VISIBLE
   ============================================================ */

function initActiveNavOnScroll() {
    var sections = $$('section[id]');
    var navLinks = $$('.main-nav .nav-link');

    if (!sections.length || !navLinks.length) return;
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var id = entry.target.id;
                navLinks.forEach(function (link) {
                    var href = link.getAttribute('href') || '';
                    if (href === '#' + id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
    });

    for (var i = 0; i < sections.length; i++) {
        observer.observe(sections[i]);
    }
}

/* ============================================================
   11. ANNÉE DYNAMIQUE DANS LE FOOTER
   ============================================================ */

function initFooterYear() {
    var footer = $('.footer-bottom p');
    if (!footer) return;

    var year = new Date().getFullYear();
    footer.textContent = '© ' + year + ' Clinicalplus. Tous droits réservés.';
}

/* ============================================================
   12. EMPÊCHER LE SAUT DES LIENS VIDES
   ============================================================ */

function initEmptyLinks() {
    var selectors = [
        '.track-card',
        '.course-card',
        '.resource-card',
        '.subject-card',
        '.option-card',
        '.hero-button',
        '.dashboard-button',
        '.secondary-button',
        '.nav-link',
        '.login-button'
    ];

    var elements = $$(selectors.join(','));

    for (var i = 0; i < elements.length; i++) {
        (function (el) {
            var href = el.getAttribute('href');
            if (!href || href === '#') {
                el.addEventListener('click', function (e) {
                    e.preventDefault();
                });
            }
        })(elements[i]);
    }
}

/* ============================================================
   13. LAZY LOADING DES IMAGES
   ============================================================ */

function initLazyImages() {
    var images = $$('img');

    for (var i = 0; i < images.length; i++) {
        if (!images[i].hasAttribute('loading')) {
            images[i].setAttribute('loading', 'lazy');
        }
    }
}

/* ============================================================
   14. INITIALISATION GLOBALE
   ============================================================ */

function init() {
    console.log('%c🚀 Clinicalplus chargé', 'color:#168BD0;font-weight:bold;font-size:14px;');

    try {
        initMobileMenu();
        initHeaderScroll();
        initSmoothScroll();
        initScrollReveal();
        initBackToTop();
        initScrollProgress();
        initActiveNavOnScroll();
        initFooterYear();
        initEmptyLinks();
        initLazyImages();

        afficherMatieres();
    } catch (err) {
        console.error('❌ Erreur lors de l\'initialisation :', err);
    }
}

/* ============================================================
   15. DÉMARRAGE
   ============================================================ */

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}