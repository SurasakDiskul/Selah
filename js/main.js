/* ============================================================
   SELAH INTERNATIONAL — MAIN JS v3
   Scroll reveal · Hero slider · Mobile nav
   Contact AJAX · Footer subscribe
   ============================================================ */

(function () {
  'use strict';

  /* ---- NAVBAR SHADOW ---- */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('shadow', window.scrollY > 24);
  }, { passive: true });

  /* ---- MOBILE NAV ---- */
  const ham    = document.getElementById('ham');
  const mobNav = document.getElementById('mobNav');

  if (ham && mobNav) {
    const toggle = (force) => {
      const open = force !== undefined ? force : !mobNav.classList.contains('open');
      mobNav.classList.toggle('open', open);
      ham.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    ham.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    mobNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('click', (e) => {
      if (mobNav.classList.contains('open') && !mobNav.contains(e.target) && !ham.contains(e.target)) {
        toggle(false);
      }
    });
  }

  /* ---- HERO SLIDER ---- */
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots   = Array.from(document.querySelectorAll('.hdot'));
  let cur = 0, timer;

  function goSlide(n) {
    if (!slides.length) return;
    slides[cur].classList.remove('on');
    dots[cur]?.classList.remove('on');
    cur = ((n % slides.length) + slides.length) % slides.length;
    slides[cur].classList.add('on');
    dots[cur]?.classList.add('on');
  }

  function startSlider() {
    clearInterval(timer);
    timer = setInterval(() => goSlide(cur + 1), 4500);
  }

  if (slides.length > 1) {
    dots.forEach((d, i) => d.addEventListener('click', () => { goSlide(i); startSlider(); }));
    startSlider();
  }

  /* ---- SCROLL REVEAL ---- */
  const revEls = document.querySelectorAll('[data-anim]');
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('in');
      revObs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -44px 0px' });

  revEls.forEach(el => revObs.observe(el));

  /* ---- CONTACT FORM AJAX ---- */
  const cform = document.querySelector('.cform');
  if (cform) {
    cform.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn  = cform.querySelector('.submit-btn');
      const orig = btn.textContent;
      btn.textContent = 'SENDING...';
      btn.disabled = true;

      try {
        const res  = await fetch('php/contact.php', { method: 'POST', body: new FormData(cform) });
        const data = await res.json();
        showMsg(data.message, data.success);
        if (data.success) cform.reset();
      } catch {
        showMsg('Network error. Please email us at SELAH@SELAH-INTER.COM', false);
      } finally {
        btn.textContent = orig;
        btn.disabled = false;
      }
    });

    function showMsg(txt, ok) {
      let m = cform.querySelector('.form-msg');
      if (!m) { m = document.createElement('p'); m.className = 'form-msg'; cform.appendChild(m); }
      m.textContent = txt;
      m.style.cssText = `background:${ok?'#e8f5e9':'#fce4e4'};color:${ok?'#2e7d32':'#c62828'};border:1px solid ${ok?'#a5d6a7':'#ef9a9a'}`;
      setTimeout(() => m?.remove(), 7000);
    }
  }

  /* ---- FOOTER SUBSCRIBE ---- */
  document.querySelectorAll('.foot-sub-form').forEach(f => {
    f.querySelector('button')?.addEventListener('click', () => {
      const inp = f.querySelector('input');
      if (!/\S+@\S+\.\S+/.test(inp.value.trim())) {
        inp.style.borderColor = 'rgba(220,50,50,.5)';
        const ph = inp.placeholder;
        inp.placeholder = 'PLEASE ENTER VALID EMAIL';
        setTimeout(() => { inp.style.borderColor = ''; inp.placeholder = ph; }, 3000);
        return;
      }
      inp.value = '';
      inp.placeholder = 'THANK YOU! ✓';
      setTimeout(() => inp.placeholder = 'ENTER YOUR EMAILS', 4000);
    });
  });

  /* ---- PRODUCT CARD TILT ---- */
  document.querySelectorAll('.prod-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

})();
