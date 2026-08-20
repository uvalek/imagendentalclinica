/* Imagen Dental Kids — interacciones de la pagina.
   Tres cosas: el menu de movil, el acordeon de preguntas, y los ojos del hero.
   Sin librerias ni dependencias. */
(function () {
  'use strict';

  /* ---------- 1. Menu desplegable en movil ---------- */
  var btnMenu = document.getElementById('btn-menu');
  var menu    = document.getElementById('menu-movil');

  function cerrarMenu() {
    if (!menu) return;
    menu.hidden = true;
    btnMenu.setAttribute('aria-expanded', 'false');
  }

  if (btnMenu && menu) {
    btnMenu.addEventListener('click', function (e) {
      e.stopPropagation();
      var abierto = !menu.hidden;
      menu.hidden = abierto;
      btnMenu.setAttribute('aria-expanded', String(!abierto));
    });

    // Al tocar cualquier enlace del menu, se cierra
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-cierra-menu]'),
      function (a) { a.addEventListener('click', cerrarMenu); }
    );

    // Clic fuera, tecla Escape, o pasar a escritorio
    document.addEventListener('click', function (e) {
      if (!menu.hidden && !menu.contains(e.target)) cerrarMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { cerrarMenu(); btnMenu.focus(); }
    });
    var anchoEscritorio = window.matchMedia('(min-width: 1080px)');
    anchoEscritorio.addEventListener('change', cerrarMenu);
  }

  /* ---------- 2. Acordeon de preguntas frecuentes ----------
     Igual que el original: solo una abierta a la vez, y la 1 empieza abierta. */
  var botonesFaq = document.querySelectorAll('[data-faq]');
  Array.prototype.forEach.call(botonesFaq, function (btn) {
    btn.addEventListener('click', function () {
      var abrirEste = btn.getAttribute('aria-expanded') !== 'true';
      Array.prototype.forEach.call(botonesFaq, function (otro) {
        var panel = document.getElementById('faq-panel-' + otro.dataset.faq);
        var activo = otro === btn && abrirEste;
        otro.setAttribute('aria-expanded', String(activo));
        if (panel) panel.hidden = !activo;
      });
    });
  });

  /* ---------- 3. Ojos del hero: siguen el cursor y parpadean ----------
     Copiado tal cual del diseno original. */
  var pupilas = Array.prototype.slice.call(document.querySelectorAll('[data-pupil]'));
  var ojos    = Array.prototype.slice.call(document.querySelectorAll('[data-eye]'));
  var quietoPorPreferencia = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (pupilas.length && !quietoPorPreferencia) {
    var mx = 0, my = 0, raf = null;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        pupilas.forEach(function (p) {
          var r = p.getBoundingClientRect();
          var dx = mx - (r.left + r.width / 2);
          var dy = my - (r.top + r.height / 2);
          var d = Math.hypot(dx, dy) || 1;
          var max = r.width * 0.42;
          var k = Math.min(1, d / 420) * max;
          p.style.transform = 'translate(' + (dx / d * k).toFixed(1) + 'px,' + (dy / d * k).toFixed(1) + 'px)';
        });
      });
    }, { passive: true });
  }

  if (ojos.length && !quietoPorPreferencia) {
    (function parpadear() {
      ojos.forEach(function (el) { el.style.transform = 'scaleY(0.08)'; });
      setTimeout(function () {
        ojos.forEach(function (el) { el.style.transform = 'scaleY(1)'; });
      }, 130);
      setTimeout(parpadear, 3500 + Math.random() * 5000);
    })();
  }
})();
