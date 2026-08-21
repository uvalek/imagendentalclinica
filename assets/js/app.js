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

  /* ---------- 4. Aparición por bloques al bajar ----------
     Marca los bloques de cada sección y los revela cuando entran en pantalla.
     Los elementos se eligen desde aquí para no ensuciar el HTML del diseño. */
  (function animaciones() {
    var raiz = document.documentElement;
    raiz.classList.add('anim-ok');          // avisa al fallback del <head> que sí arrancó

    if (!('IntersectionObserver' in window)) { raiz.classList.remove('js'); return; }

    var grupos = [];

    // Cada sección aporta sus bloques. Si un bloque es una rejilla de tarjetas
    // o una lista, se animan las piezas de dentro para que entren escalonadas.
    document.querySelectorAll('section > div').forEach(function (contenedor) {
      Array.prototype.forEach.call(contenedor.children, function (bloque) {
        var estilo = getComputedStyle(bloque);
        if (estilo.position === 'absolute') return;      // adornos de fondo: se quedan quietos

        var rejilla = estilo.display === 'grid' && bloque.children.length > 1;
        var lista = bloque.tagName === 'UL' && bloque.children.length > 1;
        if (rejilla || lista) {
          grupos.push(Array.prototype.slice.call(bloque.children));
        } else {
          grupos.push([bloque]);
        }
      });
    });

    // La lista de credenciales y los pasos de la primera visita, escalonados
    document.querySelectorAll('section ul').forEach(function (ul) {
      if (ul.children.length > 1 && grupos.every(function (g) { return g.indexOf(ul.children[0]) === -1; })) {
        grupos.push(Array.prototype.slice.call(ul.children));
      }
    });

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        observador.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    grupos.forEach(function (piezas) {
      piezas.forEach(function (el, i) {
        // Si ya trae un transform propio del diseño, solo se desvanece
        var tieneTransform = getComputedStyle(el).transform !== 'none';
        el.classList.add(tieneTransform ? 'anima-suave' : 'anima');
        el.style.setProperty('--retraso', Math.min(i, 6) * 90 + 'ms');
        observador.observe(el);
      });
    });

    // Las tarjetas blancas se levantan al pasar el cursor
    document.querySelectorAll('section > div > div').forEach(function (rejilla) {
      if (getComputedStyle(rejilla).display !== 'grid') return;
      Array.prototype.forEach.call(rejilla.children, function (t) {
        if (getComputedStyle(t).backgroundColor === 'rgb(255, 255, 255)') t.classList.add('tarjeta-lift');
      });
    });

    // El botón flotante de WhatsApp entra solo (es el que va fijo en pantalla)
    var flotante = Array.prototype.filter.call(
      document.querySelectorAll('a[href*="wa.me"]'),
      function (a) { return getComputedStyle(a).position === 'fixed'; }
    )[0];
    if (flotante) {
      flotante.classList.add('wa-flotante');
      requestAnimationFrame(function () { flotante.classList.add('visible'); });
    }
  })();
})();
