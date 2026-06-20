/* ============================================================
   Nikita Akulinin — Portfolio · interactions
   theme · nav · reveal · counters · filters · faq · form
   ============================================================ */
(function () {
    'use strict';

    /* ---------- Theme (light / dark) ---------- */
    function initTheme() {
        var root = document.documentElement;
        var saved = null;
        try { saved = localStorage.getItem('theme'); } catch (e) {}
        if (saved === 'dark' || saved === 'light') {
            root.setAttribute('data-theme', saved);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.setAttribute('data-theme', 'dark');
        }
        document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                root.setAttribute('data-theme', next);
                try { localStorage.setItem('theme', next); } catch (e) {}
            });
        });
    }

    /* ---------- Navbar: scrolled state + mobile menu ---------- */
    function initNav() {
        var navbar = document.querySelector('.navbar');
        var toggle = document.querySelector('.nav-toggle');
        var menu = document.querySelector('.nav-menu');

        function onScroll() {
            if (!navbar) return;
            navbar.classList.toggle('scrolled', window.scrollY > 14);
        }
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        if (toggle && menu) {
            toggle.addEventListener('click', function () {
                var open = menu.classList.toggle('open');
                toggle.classList.toggle('open', open);
                toggle.setAttribute('aria-expanded', String(open));
            });
            menu.querySelectorAll('.nav-link').forEach(function (link) {
                link.addEventListener('click', function () {
                    menu.classList.remove('open');
                    toggle.classList.remove('open');
                });
            });
        }
    }

    /* ---------- Scroll reveal ---------- */
    function initReveal() {
        var els = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window) || !els.length) {
            els.forEach(function (el) { el.classList.add('in'); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        els.forEach(function (el) { io.observe(el); });
    }

    /* ---------- Animated counters ---------- */
    function initCounters() {
        var nums = document.querySelectorAll('[data-count]');
        if (!nums.length) return;

        function animate(el) {
            var target = parseFloat(el.getAttribute('data-count'));
            var suffix = el.getAttribute('data-suffix') || '';
            var dur = 1400, start = null;
            function step(ts) {
                if (!start) start = ts;
                var p = Math.min((ts - start) / dur, 1);
                var eased = 1 - Math.pow(1 - p, 3);
                var val = target * eased;
                el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
                if (p < 1) requestAnimationFrame(step);
                else el.textContent = (target % 1 === 0 ? target : target.toFixed(1)) + suffix;
            }
            requestAnimationFrame(step);
        }

        if (!('IntersectionObserver' in window)) { nums.forEach(animate); return; }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
            });
        }, { threshold: 0.5 });
        nums.forEach(function (el) { io.observe(el); });
    }

    /* ---------- Portfolio filters ---------- */
    function initFilters() {
        var btns = document.querySelectorAll('.filter-btn');
        var items = document.querySelectorAll('.portfolio-item');
        if (!btns.length) return;
        btns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                btns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var f = btn.getAttribute('data-filter');
                items.forEach(function (item) {
                    var match = f === 'all' || item.getAttribute('data-category') === f;
                    item.classList.toggle('hide', !match);
                });
            });
        });
    }

    /* ---------- FAQ accordion ---------- */
    function initFaq() {
        document.querySelectorAll('.faq-item').forEach(function (item) {
            var q = item.querySelector('.faq-q');
            var a = item.querySelector('.faq-a');
            if (!q || !a) return;
            q.addEventListener('click', function () {
                var open = item.classList.toggle('open');
                q.setAttribute('aria-expanded', String(open));
                a.style.maxHeight = open ? a.scrollHeight + 'px' : null;
            });
        });
    }

    /* ---------- Contact form (front-end demo validation) ---------- */
    function initForm() {
        var form = document.getElementById('contactForm');
        if (!form) return;

        function msg(text, type) {
            var prev = form.querySelector('.form-message');
            if (prev) prev.remove();
            var el = document.createElement('div');
            el.className = 'form-message ' + type;
            el.textContent = text;
            form.insertBefore(el, form.firstChild);
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var data = new FormData(form);
            var name = (data.get('name') || '').toString().trim();
            var email = (data.get('email') || '').toString().trim();
            var message = (data.get('message') || '').toString().trim();
            var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!name || !email || !message) { msg('Please fill in all required fields.', 'error'); return; }
            if (!emailOk) { msg('Please enter a valid email address.', 'error'); return; }

            var submit = form.querySelector('button[type="submit"]');
            if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }
            setTimeout(function () {
                msg('Thanks, ' + name + '! Your message has been sent. I\'ll reply within 24 hours.', 'success');
                form.reset();
                if (submit) { submit.disabled = false; submit.textContent = 'Send Message'; }
            }, 900);
        });
    }

    /* ---------- Year in footer ---------- */
    function initYear() {
        document.querySelectorAll('[data-year]').forEach(function (el) {
            el.textContent = new Date().getFullYear();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initTheme();
        initNav();
        initReveal();
        initCounters();
        initFilters();
        initFaq();
        initForm();
        initYear();
    });
})();
