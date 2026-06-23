/* ============================================================
   SELAH — Component Loader
   Loads header.html & footer.html then boots main.js + cms.js
   ============================================================ */
(function () {
  'use strict';

  var pending = 0;

  function onReady() {
    pending--;
    if (pending > 0) return;

    // Set active nav link based on data-page attribute on <body>
    var page = document.body.getAttribute('data-page') || '';
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === page) {
        a.classList.add('active');
      }
    });

    // Boot main.js logic
    if (typeof window.__selahMain === 'function') window.__selahMain();
    // Boot cms.js logic
    if (typeof window.__selahCms === 'function') window.__selahCms();
  }

  function loadComponent(selector, url) {
    var el = document.querySelector(selector);
    if (!el) return;
    pending++;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        el.innerHTML = xhr.responseText;
      }
      onReady();
    };
    xhr.onerror = function () { onReady(); };
    xhr.send();
  }

  loadComponent('#site-header', 'components/header.html');
  loadComponent('#site-footer', 'components/footer.html');
})();
