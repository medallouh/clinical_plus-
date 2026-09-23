/* ============================================================
   CLINICALPLUS — connexion.js
   Gestion de la page de connexion / inscription
   ============================================================ */

'use strict';

/* ============================================================
   1. CONFIGURATION
   ============================================================ */

var CONFIG = {
    // Simulation : true = pas de vrai backend (démo)
    simulateBackend: true,

    // Clé de stockage local
    storageKey: 'clinicalplus_user',

    // Durée de simulation des requêtes (ms)
    fakeDelay: 900
};

/* ============================================================
   2. UTILITAIRES
   ============================================================ */

function $(selector, context) {
    return (context || document).querySelector(selector);
}

function $$(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/**
 * Affiche une erreur sous un champ
 */
function showFieldError(inputId, message) {
    var input = document.getElementById(inputId);
    if (!input) return;

    var group = input.closest('.form-group');
    var errorEl = document.querySelector('[data-error-for="' + inputId + '"]');

    if (group) group.classList.add('has-error');
    if (errorEl) errorEl.textContent = message;
}

/**
 * Efface l'erreur d'un champ
 */
function clearFieldError(inputId) {
    var input = document.getElementById(inputId);
    if (!input) return;

    var group = input.closest('.form-group');
    var errorEl = document.querySelector('[data-error-for="' + inputId + '"]');

    if (group) group.classList.remove('has-error');
    if (errorEl) errorEl.textContent = '';
}

/**
 * Efface toutes les erreurs d'un formulaire
 */
function clearFormErrors(form) {
    $$('.form-group.has-error', form).forEach(function (g) {
        g.classList.remove('has-error');
    });
    $$('.form-error', form).forEach(function (e) {
        e.textContent = '';
    });
}

/**
 * Affiche un message global
 */
function showMessage(form, text, type) {
    var message = $('[data-message]', form);
    if (!message) return;

    message.textContent = text;
    message.className = 'auth-message show ' + (type || 'info');

    if (type === 'success') {
        setTimeout(function () {
            message.classList.remove('show');
        }, 4000);
    }
}

/**
 * Active / désactive le loader du bouton
 */
function setLoading(button, loading) {
    if (!button) return;
    button.disabled = loading;
    button.classList.toggle('loading', loading);
}

/**
 * Simule une requête réseau
 */
function fakeRequest(data) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve({ ok: true, data: data });
        }, CONFIG.fakeDelay);
    });
}

/* ============================================================
   3. GESTION DES ONGLETS
   ============================================================ */

function initTabs() {
    var tabs = $$('.auth-tab');
    var forms = $$('.auth-form');

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var target = tab.getAttribute('data-tab');

            // Onglet actif
            tabs.forEach(function (t) {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            // Formulaire actif
            forms.forEach(function (f) {
                f.classList.remove('active');
            });

            var activeForm = document.getElementById(target === 'register' ? 'registerForm' : 'loginForm');
            if (activeForm) {
                activeForm.classList.add('active');
                clearFormErrors(activeForm);
                var msg = $('[data-message]', activeForm);
                if (msg) msg.classList.remove('show');
            }
        });
    });
}

/* ============================================================
   4. AFFICHER / MASQUER LE MOT DE PASSE
   ============================================================ */

function initPasswordToggles() {
    $$('.toggle-password').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetId = btn.getAttribute('data-target');
            var input = document.getElementById(targetId);
            if (!input) return;

            var isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.textContent = isPassword ? '🙈' : '👁️';
        });
    });
}

/* ============================================================
   5. VALIDATION — CONNEXION
   ============================================================ */

function validateLoginForm(form) {
    clearFormErrors(form);

    var email = document.getElementById('loginEmail');
    var password = document.getElementById('loginPassword');
    var isValid = true;

    if (!email.value.trim()) {
        showFieldError('loginEmail', 'Veuillez saisir votre adresse email.');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        showFieldError('loginEmail', 'Adresse email invalide.');
        isValid = false;
    }

    if (!password.value) {
        showFieldError('loginPassword', 'Veuillez saisir votre mot de passe.');
        isValid = false;
    } else if (password.value.length < 6) {
        showFieldError('loginPassword', 'Le mot de passe doit contenir au moins 6 caractères.');
        isValid = false;
    }

    return isValid;
}

/* ============================================================
   6. VALIDATION — INSCRIPTION
   ============================================================ */

function validateRegisterForm(form) {
    clearFormErrors(form);

    var name = document.getElementById('registerName');
    var email = document.getElementById('registerEmail');
    var password = document.getElementById('registerPassword');
    var confirm = document.getElementById('registerConfirm');
    var terms = document.getElementById('acceptTerms');
    var isValid = true;

    if (!name.value.trim() || name.value.trim().length < 2) {
        showFieldError('registerName', 'Veuillez saisir votre nom complet.');
        isValid = false;
    }

    if (!email.value.trim()) {
        showFieldError('registerEmail', 'Veuillez saisir votre adresse email.');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        showFieldError('registerEmail', 'Adresse email invalide.');
        isValid = false;
    }

    if (!password.value) {
        showFieldError('registerPassword', 'Veuillez choisir un mot de passe.');
        isValid = false;
    } else if (password.value.length < 6) {
        showFieldError('registerPassword', 'Le mot de passe doit contenir au moins 6 caractères.');
        isValid = false;
    }

    if (!confirm.value) {
        showFieldError('registerConfirm', 'Veuillez confirmer votre mot de passe.');
        isValid = false;
    } else if (password.value !== confirm.value) {
        showFieldError('registerConfirm', 'Les mots de passe ne correspondent pas.');
        isValid = false;
    }

    if (!terms.checked) {
        showMessage(form, 'Veuillez accepter les conditions d\'utilisation.', 'error');
        isValid = false;
    }

    return isValid;
}

/* ============================================================
   7. SOUMISSION — CONNEXION
   ============================================================ */

function initLoginForm() {
    var form = document.getElementById('loginForm');
    if (!form) return;

    // Nettoyage à la saisie
    ['loginEmail', 'loginPassword'].forEach(function (id) {
        var input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function () {
                clearFieldError(id);
            });
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateLoginForm(form)) return;

        var submitBtn = $('.auth-submit', form);
        setLoading(submitBtn, true);
        showMessage(form, 'Connexion en cours…', 'info');

        var email = document.getElementById('loginEmail').value.trim();
        var remember = document.getElementById('rememberMe').checked;

        if (CONFIG.simulateBackend) {
            // Simulation d'une connexion
            fakeRequest({ email: email }).then(function (response) {
                setLoading(submitBtn, false);

                if (response.ok) {
                    // Sauvegarde de l'utilisateur
                    var user = {
                        email: email,
                        name: email.split('@')[0],
                        loggedInAt: Date.now()
                    };

                    if (remember) {
                        localStorage.setItem(CONFIG.storageKey, JSON.stringify(user));
                    } else {
                        sessionStorage.setItem(CONFIG.storageKey, JSON.stringify(user));
                    }

                    showMessage(form, '✅ Connexion réussie ! Redirection…', 'success');

                    setTimeout(function () {
                        window.location.href = 'index.html';
                    }, 1200);
                }
            });
        } else {
            // Ici vous brancheriez votre vrai backend
            // fetch('/api/login', { method:'POST', ... })
        }
    });
}

/* ============================================================
   8. SOUMISSION — INSCRIPTION
   ============================================================ */

function initRegisterForm() {
    var form = document.getElementById('registerForm');
    if (!form) return;

    ['registerName', 'registerEmail', 'registerPassword', 'registerConfirm'].forEach(function (id) {
        var input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function () {
                clearFieldError(id);
            });
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateRegisterForm(form)) return;

        var submitBtn = $('.auth-submit', form);
        setLoading(submitBtn, true);
        showMessage(form, 'Création du compte en cours…', 'info');

        var name = document.getElementById('registerName').value.trim();
        var email = document.getElementById('registerEmail').value.trim();

        if (CONFIG.simulateBackend) {
            fakeRequest({ name: name, email: email }).then(function (response) {
                setLoading(submitBtn, false);

                if (response.ok) {
                    var user = {
                        email: email,
                        name: name,
                        loggedInAt: Date.now()
                    };

                    localStorage.setItem(CONFIG.storageKey, JSON.stringify(user));

                    showMessage(form, '🎉 Compte créé avec succès ! Redirection…', 'success');

                    setTimeout(function () {
                        window.location.href = 'index.html';
                    }, 1400);
                }
            });
        }
    });
}

/* ============================================================
   9. ANNÉE DYNAMIQUE
   ============================================================ */

function initYear() {
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
}

/* ============================================================
   10. REDIRECTION SI DÉJÀ CONNECTÉ
   ============================================================ */

function checkAlreadyLoggedIn() {
    var stored = localStorage.getItem(CONFIG.storageKey) || sessionStorage.getItem(CONFIG.storageKey);
    if (!stored) return;

    try {
        var user = JSON.parse(stored);
        if (user && user.email) {
            console.log('✅ Utilisateur déjà connecté :', user.email);
            // Optionnel : rediriger automatiquement
            // window.location.href = 'index.html';
        }
    } catch (err) {
        console.warn('Données utilisateur invalides.');
    }
}

/* ============================================================
   11. INITIALISATION
   ============================================================ */

function init() {
    console.log('%c🔐 Clinicalplus — Connexion', 'color:#168BD0;font-weight:bold;');

    try {
        initTabs();
        initPasswordToggles();
        initLoginForm();
        initRegisterForm();
        initYear();
        checkAlreadyLoggedIn();
    } catch (err) {
        console.error('❌ Erreur initialisation :', err);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}