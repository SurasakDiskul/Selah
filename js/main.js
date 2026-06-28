/* ============================================================
   SELAH INTERNATIONAL — MAIN JS v4
   Wrapped as callable function for component loader
   ============================================================ */

window.__selahMain = function () {
  'use strict';

  /* ---- NAVBAR SHADOW + TRANSPARENT ---- */
  var navbar = document.querySelector('.navbar');
  var isHeroPage = document.body.classList.contains('hero-page');

  if (isHeroPage && navbar) navbar.classList.add('transparent');

  window.addEventListener('scroll', function () {
    if (!navbar) return;
    var scrolled = window.scrollY > 60;
    navbar.classList.toggle('shadow', scrolled);
    if (isHeroPage) navbar.classList.toggle('transparent', !scrolled);
  }, { passive: true });

  /* ---- MOBILE NAV ---- */
  var ham    = document.getElementById('ham');
  var mobNav = document.getElementById('mobNav');

  if (ham && mobNav) {
    var toggle = function (force) {
      var open = force !== undefined ? force : !mobNav.classList.contains('open');
      mobNav.classList.toggle('open', open);
      ham.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    ham.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    mobNav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { toggle(false); }); });
    document.addEventListener('click', function (e) {
      if (mobNav.classList.contains('open') && !mobNav.contains(e.target) && !ham.contains(e.target)) {
        toggle(false);
      }
    });
  }

  /* ---- HERO SLIDER ---- */
  var slides = Array.from(document.querySelectorAll('.slide'));
  var dots   = Array.from(document.querySelectorAll('.hdot'));
  var cur = 0, timer;

  function goSlide(n) {
    if (!slides.length) return;
    slides[cur].classList.remove('on');
    if (dots[cur]) dots[cur].classList.remove('on');
    cur = ((n % slides.length) + slides.length) % slides.length;
    slides[cur].classList.add('on');
    if (dots[cur]) dots[cur].classList.add('on');
  }

  function startSlider() {
    clearInterval(timer);
    timer = setInterval(function () { goSlide(cur + 1); }, 4500);
  }

  if (slides.length > 1) {
    dots.forEach(function (d, i) { d.addEventListener('click', function () { goSlide(i); startSlider(); }); });
    startSlider();
  }

  /* ---- SCROLL REVEAL ---- */
  var revEls = document.querySelectorAll('[data-anim]');
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      revObs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -44px 0px' });
  revEls.forEach(function (el) { revObs.observe(el); });

  /* ---- CONTACT FORM AJAX ---- */
  var cform = document.querySelector('.cform');
  if (cform) {
    cform.addEventListener('submit', async function (e) {
      e.preventDefault();
      var btn  = cform.querySelector('.submit-btn');
      var orig = btn.textContent;
      btn.textContent = 'SENDING...';
      btn.disabled = true;
      try {
        var res  = await fetch('php/contact.php', { method: 'POST', body: new FormData(cform) });
        var data = await res.json();
        showMsg(data.message, data.success);
        if (data.success) cform.reset();
      } catch (err) {
        showMsg('Network error. Please email us at SELAH@SELAH-INTER.COM', false);
      } finally {
        btn.textContent = orig;
        btn.disabled = false;
      }
    });

    function showMsg(txt, ok) {
      var m = cform.querySelector('.form-msg');
      if (!m) { m = document.createElement('p'); m.className = 'form-msg'; cform.appendChild(m); }
      m.textContent = txt;
      m.style.cssText = 'background:' + (ok ? '#e8f5e9' : '#fce4e4') + ';color:' + (ok ? '#2e7d32' : '#c62828') + ';border:1px solid ' + (ok ? '#a5d6a7' : '#ef9a9a');
      setTimeout(function () { if (m) m.remove(); }, 7000);
    }
  }

  /* ---- FOOTER SUBSCRIBE ---- */
  document.querySelectorAll('.foot-sub-form').forEach(function (f) {
    var btn = f.querySelector('button');
    if (btn) btn.addEventListener('click', function () {
      var inp = f.querySelector('input');
      if (!/\S+@\S+\.\S+/.test(inp.value.trim())) {
        inp.style.borderColor = 'rgba(220,50,50,.5)';
        var ph = inp.placeholder;
        inp.placeholder = 'PLEASE ENTER VALID EMAIL';
        setTimeout(function () { inp.style.borderColor = ''; inp.placeholder = ph; }, 3000);
        return;
      }
      inp.value = '';
      inp.placeholder = 'THANK YOU! ✓';
      setTimeout(function () { inp.placeholder = 'ENTER YOUR EMAILS'; }, 4000);
    });
  });

  /* ---- PRODUCT CARD TILT ---- */
  document.querySelectorAll('.prod-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width  - 0.5;
      var y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = 'perspective(700px) rotateY(' + (x*7) + 'deg) rotateX(' + (-y*7) + 'deg) translateZ(4px)';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });

  /* ---- HIGHLIGHTS MARQUEE (JS Smooth Step-by-Step) ---- */
  var marqueeTrack = document.querySelector('.highlights-track');
  if (marqueeTrack) {
    var stepIndex = 0;
    var totalItems = 10; // We have 10 original items + 10 cloned items
    var isHovered = false;

    marqueeTrack.addEventListener('mouseenter', function() { isHovered = true; });
    marqueeTrack.addEventListener('mouseleave', function() { isHovered = false; });

    setInterval(function() {
      if (isHovered) return; // Pause when hovered

      stepIndex++;
      
      // Calculate how far to translate. We move 1 item's width per step.
      // Easiest way is to calculate percentage based on the number of items in a single set (10).
      var translatePct = -(stepIndex * (100 / (totalItems * 2))); // *2 because of 2 sets
      
      marqueeTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      marqueeTrack.style.transform = 'translateX(' + translatePct + '%)';

      // Reset seamlessly when reaching the end of the first set (10 items)
      if (stepIndex >= totalItems) {
        setTimeout(function() {
          // Disable transition temporarily to snap back to the start instantly
          marqueeTrack.style.transition = 'none';
          marqueeTrack.style.transform = 'translateX(0%)';
          stepIndex = 0;
        }, 650); // wait slightly longer than the transition duration
      }
    }, 2500); // Wait 2.5 seconds before moving to the next image
  }

};
