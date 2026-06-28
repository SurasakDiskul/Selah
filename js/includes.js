/* ============================================================
   SELAH — Component Loader
   Loads header.html & footer.html, then boots i18n, main, cms
   ============================================================ */
(function () {
  'use strict';

  var pending = 0;

  function boot() {
    pending--;
    if (pending > 0) return;

    // active nav link from <body data-page="...">
    var page = document.body.getAttribute('data-page') || '';
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === page) a.classList.add('active');
    });

    if (typeof window.__selahI18n === 'function') window.__selahI18n();
    if (typeof window.__selahMain === 'function') window.__selahMain();
    if (typeof window.__selahCms === 'function') window.__selahCms();
  }

  function load(selector, url) {
    var el = document.querySelector(selector);
    if (!el) return;
    pending++;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) el.innerHTML = xhr.responseText;
      boot();
    };
    xhr.onerror = boot;
    xhr.send();
  }

  // If a page has no header/footer placeholders, still boot once.
  if (!document.querySelector('#site-header') && !document.querySelector('#site-footer')) {
    pending = 1; boot(); return;
  }

  load('#site-header', 'components/header.html');
  load('#site-footer', 'components/footer.html');
})();
