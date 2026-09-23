/* ============================================================
   CLINICALPLUS — dashboard.js
   Espace étudiant
   ============================================================ */

'use strict';

/* ============================================================
   1. CONFIGURATION
   ============================================================ */

var STORAGE_KEY = 'clinicalplus_user';

/* ============================================================
   2. UTILITAIRES
   ============================================================ */

function $(selector, context) {
    return (context || document).querySelector(selector);
}

function $$(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/* ============================================================
   3. RÉCUPÉRATION DE L'UTILISATEUR
   ============================================================ */

function getCurrentUser() {
    var stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);

    if (!stored) return null;

    try {
        return JSON.parse(stored);
    } catch (err) {
        return null;
    }
}

/* ============================================================
   4. PROTECTION DE LA PAGE
   Si l'utilisateur n'est pas connecté → redirection
   ============================================================ */

function protectPage() {
    var user = getCurrentUser();

    if (!user || !user.email) {
        console.warn('⛔ Non connecté — redirection vers la page de connexion.');
        window.location.href = 'connexion.html';
        return null;
    }

    return user;
}

/* ============================================================
   5. INJECTION DES INFOS UTILISATEUR
   ============================================================ */

function displayUser(user) {
    // Nom affiché
    var displayName = user.name || user.email.split('@')[0];
    displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

    var welcomeName = $('#welcomeName');
    if (welcomeName) welcomeName.textContent = displayName;

    var userName = $('#userName');
    if (userName) userName.textContent = displayName;

    var ddName = $('#ddName');
    if (ddName) ddName.textContent = displayName;

    var ddEmail = $('#ddEmail');
    if (ddEmail) ddEmail.textContent = user.email;

    // Avatar : première lettre du nom
    var initial = displayName.charAt(0).toUpperCase();
    var userAvatar = $('#userAvatar');
    if (userAvatar) userAvatar.textContent = initial;
}

/* ============================================================
   6. MENU UTILISATEUR (DROPDOWN)
   ============================================================ */

function initUserMenu() {
    var menu = $('#userMenu');
    var trigger = $('#userTrigger');
    if (!menu || !trigger) return;

    trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = menu.classList.toggle('open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
        if (!menu.contains(e.target)) {
            menu.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            menu.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }
    });

    // Actions du menu
    $$('a[data-action]', menu).forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var action = link.getAttribute('data-action');

            if (action === 'logout') {
                logout();
            } else if (action === 'profile') {
                alert('Page "Mon profil" à venir');
            } else if (action === 'settings') {
                alert('Page "Paramètres" à venir');
            }
        });
    });
}

/* ============================================================
   7. DÉCONNEXION
   ============================================================ */

function logout() {
    var confirmed = window.confirm('Voulez-vous vraiment vous déconnecter ?');
    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);

    console.log('👋 Déconnexion réussie');

    window.location.href = 'connexion.html';
}

/* ============================================================
   8. COURS DE L'ÉTUDIANT (données locales)
   ============================================================ */

var MY_COURSES = [
    {
        id: 1,
        title: 'Anatomie générale',
        badge: 'ANATOMIE',
        icon: '🫀',
        description: 'Étude de la structure et de l\'organisation du corps humain.',
        progress: 85,
        chapters: '12 / 14 chapitres'
    },
    {
        id: 2,
        title: 'Physiologie humaine',
        badge: 'PHYSIOLOGIE',
        icon: '🧬',
        description: 'Fonctionnement normal des systèmes de l\'organisme.',
        progress: 72,
        chapters: '10 / 14 chapitres'
    },
    {
        id: 3,
        title: 'Pharmacologie',
        badge: 'PHARMACOLOGIE',
        icon: '💊',
        description: 'Principes fondamentaux des médicaments et leurs effets.',
        progress: 45,
        chapters: '6 / 14 chapitres'
    },
    {
        id: 4,
        title: 'Microbiologie',
        badge: 'MICROBIOLOGIE',
        icon: '🦠',
        description: 'Étude des micro-organismes et de leur importance en santé.',
        progress: 30,
        chapters: '4 / 14 chapitres'
    },
    {
        id: 5,
        title: 'Biochimie',
        badge: 'BIOCHIMIE',
        icon: '🧪',
        description: 'Chimie du vivant et métabolismes essentiels.',
        progress: 60,
        chapters: '8 / 13 chapitres'
    },
    {
        id: 6,
        title: 'Psychologie',
        badge: 'PSYCHOLOGIE',
        icon: '🧠',
        description: 'Comportement humain et processus mentaux.',
        progress: 20,
        chapters: '3 / 15 chapitres'
    }
];

function renderMyCourses() {
    var container = $('#myCoursesGrid');
    if (!container) return;

    var html = '';

    for (var i = 0; i < MY_COURSES.length; i++) {
        var c = MY_COURSES[i];
        html +=
            '<a href="#" class="my-course-card">' +
                '<div class="my-course-top">' +
                    '<span class="my-course-badge">' + escapeHtml(c.badge) + '</span>' +
                    '<span class="my-course-icon">' + escapeHtml(c.icon) + '</span>' +
                '</div>' +
                '<h3>' + escapeHtml(c.title) + '</h3>' +
                '<p>' + escapeHtml(c.description) + '</p>' +
                '<div class="my-course-progress">' +
                    '<div class="my-course-progress-top">' +
                        '<span>Progression</span>' +
                        '<strong>' + c.progress + '%</strong>' +
                    '</div>' +
                    '<div class="my-course-bar"><span style="width:' + c.progress + '%"></span></div>' +
                    '<p class="progress-meta" style="margin-top:8px;">' + escapeHtml(c.chapters) + '</p>' +
                '</div>' +
            '</a>';
    }

    container.innerHTML = html;

    // Animation
    setTimeout(function () {
        $$('.my-course-bar span', container).forEach(function (bar) {
            // Déjà en place
        });
    }, 100);
}

/* ============================================================
   9. STATISTIQUES (animation des chiffres)
   ============================================================ */

function animateNumber(elementId, target, suffix) {
    var el = document.getElementById(elementId);
    if (!el) return;

    suffix = suffix || '';
    var start = 0;
    var duration = 900;
    var startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var value = Math.floor(progress * (target - start) + start);
        el.textContent = value + suffix;
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = target + suffix;
        }
    }

    requestAnimationFrame(step);
}

function animateStats() {
    animateNumber('statCourses', 12);
    animateNumber('statSummaries', 8);
    animateNumber('statExams', 15);
    animateNumber('statProgress', 68, '%');
}

/* ============================================================
   10. ANNÉE DYNAMIQUE
   ============================================================ */

function initYear() {
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
}

/* ============================================================
   11. MENU MOBILE
   ============================================================ */

function initMobileMenu() {
    var btn = $('.mobile-menu');
    var nav = $('.main-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        nav.classList.toggle('open');
    });

    $$('.nav-link', nav).forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('open');
        });
    });

    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target) && !btn.contains(e.target)) {
            nav.classList.remove('open');
        }
    });
}

/* ============================================================
   12. SMOOTH SCROLL POUR LES ANCRES
   ============================================================ */

function initSmoothScroll() {
    $$('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = link.getAttribute('href');
            if (!href || href === '#') return;

            var target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            var offset = 100;
            var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });
}

/* ============================================================
   13. LIEN ACTIF SELON SECTION
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
                    link.classList.toggle('active', href === '#' + id);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
}

/* ============================================================
   14. INITIALISATION
   ============================================================ */

function init() {
    console.log('%c🎓 Clinicalplus — Espace étudiant', 'color:#168BD0;font-weight:bold;font-size:14px;');

    var user = protectPage();
    if (!user) return;

    console.log('👤 Connecté :', user.email);

    try {
        displayUser(user);
        initUserMenu();
        initMobileMenu();
        initSmoothScroll();
        initActiveNavOnScroll();
        initYear();
        renderMyCourses();
        animateStats();
    } catch (err) {
        console.error('❌ Erreur initialisation :', err);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}