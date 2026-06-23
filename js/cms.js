/* ============================================================
   SELAH CMS — Inline editing system
   Wrapped as callable function for component loader
   ============================================================ */

window.__selahCms = function () {
  'use strict';

  var STORAGE_KEY = 'selah_cms_data';
  var ADMIN_KEY = 'selah_admin_logged_in';

  function getData() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { return {}; }
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function applyContent() {
    var data = getData();
    document.querySelectorAll('[data-cms]').forEach(function (el) {
      var key = el.getAttribute('data-cms');
      if (data[key] !== undefined) el.innerHTML = data[key];
    });
    document.querySelectorAll('[data-cms-img]').forEach(function (el) {
      var key = el.getAttribute('data-cms-img');
      if (data[key] !== undefined) el.src = data[key];
    });
    document.querySelectorAll('[data-cms-bg]').forEach(function (el) {
      var key = el.getAttribute('data-cms-bg');
      if (data[key] !== undefined) el.style.backgroundImage = "url('" + data[key] + "')";
    });
  }

  applyContent();

  if (localStorage.getItem(ADMIN_KEY) !== 'true') return;

  // ── Count editables ──
  var textEls = document.querySelectorAll('[data-cms]');
  var imgEls = document.querySelectorAll('[data-cms-img]');
  var bgEls = document.querySelectorAll('[data-cms-bg]');
  var totalEditable = textEls.length + imgEls.length + bgEls.length;

  // ── Inject admin styles ──
  var style = document.createElement('style');
  style.textContent =
    '#cms-banner{position:fixed;top:0;left:0;right:0;z-index:99998;' +
    'background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);' +
    'color:#fff;padding:0;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,.4);transition:transform .3s ease}' +
    '#cms-banner.collapsed{transform:translateY(-100%)}' +
    '.cms-banner-main{display:flex;align-items:center;gap:16px;padding:10px 20px;max-width:1200px;margin:0 auto}' +
    '.cms-banner-badge{background:#ffd700;color:#1a1a2e;font-weight:900;font-size:.65rem;' +
    'letter-spacing:2px;padding:4px 12px;border-radius:4px;animation:cmsPulse 2s ease-in-out infinite;white-space:nowrap}' +
    '@keyframes cmsPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,215,0,.5)}50%{box-shadow:0 0 12px 4px rgba(255,215,0,.25)}}' +
    '.cms-banner-info{flex:1;display:flex;align-items:center;gap:16px;flex-wrap:wrap}' +
    '.cms-banner-text{font-size:.8rem;color:rgba(255,255,255,.85)}' +
    '.cms-banner-text strong{color:#ffd700}' +
    '.cms-banner-stats{display:flex;gap:12px}' +
    '.cms-stat{background:rgba(255,255,255,.1);padding:4px 12px;border-radius:20px;font-size:.7rem;color:rgba(255,255,255,.8);white-space:nowrap}' +
    '.cms-stat b{color:#ffd700}' +
    '.cms-banner-actions{display:flex;gap:8px;flex-shrink:0}' +
    '.cms-tb-btn{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.2);' +
    'padding:6px 14px;font-size:.72rem;font-weight:700;letter-spacing:1px;cursor:pointer;text-decoration:none;border-radius:5px;transition:all .2s}' +
    '.cms-tb-btn:hover{background:rgba(255,255,255,.22);border-color:rgba(255,255,255,.4)}' +
    '.cms-tb-btn.gold{background:rgba(255,215,0,.2);border-color:rgba(255,215,0,.4);color:#ffd700}' +
    '.cms-tb-btn.gold:hover{background:rgba(255,215,0,.35)}' +
    '.cms-tb-btn.red{background:rgba(230,48,48,.2);border-color:rgba(230,48,48,.4);color:#ff6b6b}' +
    '.cms-tb-btn.red:hover{background:rgba(230,48,48,.35)}' +
    '#cms-toggle{position:fixed;top:12px;right:12px;z-index:99999;width:44px;height:44px;border-radius:50%;' +
    'background:#ffd700;color:#1a1a2e;border:none;font-size:1.2rem;font-weight:900;cursor:pointer;' +
    'box-shadow:0 4px 16px rgba(0,0,0,.3);transition:transform .2s,opacity .2s;display:none}' +
    '#cms-toggle.show{display:flex;align-items:center;justify-content:center}' +
    '#cms-toggle:hover{transform:scale(1.1)}' +
    'body.cms-active{padding-top:46px}' +
    'body.cms-active .navbar{top:46px}' +
    'body.cms-active .mob-nav{top:106px}' +
    '[data-cms],[data-cms-img],[data-cms-bg]{position:relative}' +
    'body.cms-active [data-cms]:hover,body.cms-active [data-cms-img]:hover,body.cms-active [data-cms-bg]:hover{' +
    'outline:2px dashed #ffd700!important;outline-offset:3px;cursor:pointer}' +
    'body.cms-active [data-cms]::after,body.cms-active [data-cms-img]::after,body.cms-active [data-cms-bg]::after{' +
    'content:attr(data-cms-label);position:absolute;top:-8px;right:-4px;z-index:100;' +
    'background:#ffd700;color:#1a1a2e;font-size:.6rem;font-weight:800;letter-spacing:.5px;' +
    'padding:2px 8px;border-radius:3px;opacity:0;pointer-events:none;transition:opacity .15s;white-space:nowrap;font-family:"Barlow Condensed",sans-serif}' +
    'body.cms-active [data-cms]:hover::after,body.cms-active [data-cms-img]:hover::after,body.cms-active [data-cms-bg]:hover::after{opacity:1}' +
    '.cms-edit-overlay{position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);' +
    'display:flex;align-items:center;justify-content:center;animation:cmsFadeIn .2s ease}' +
    '@keyframes cmsFadeIn{from{opacity:0}to{opacity:1}}' +
    '.cms-edit-box{background:#fff;border-radius:14px;padding:28px;width:90%;max-width:560px;' +
    'box-shadow:0 20px 60px rgba(0,0,0,.4);max-height:80vh;overflow-y:auto;animation:cmsSlideUp .25s ease}' +
    '@keyframes cmsSlideUp{from{transform:translateY(20px);opacity:0}to{transform:none;opacity:1}}' +
    '.cms-edit-box h3{margin:0 0 4px;font-size:1rem;color:#1a2b5e;font-family:"Barlow Condensed",sans-serif;letter-spacing:1px;font-weight:800}' +
    '.cms-edit-type{font-size:.7rem;color:#999;letter-spacing:1px;margin-bottom:16px;display:flex;align-items:center;gap:6px}' +
    '.cms-edit-type span{background:#ffd700;color:#1a1a2e;padding:1px 8px;border-radius:3px;font-weight:800;font-size:.6rem}' +
    '.cms-edit-box textarea{width:100%;min-height:120px;border:2px solid #e0e0e0;padding:12px;font-size:.9rem;font-family:inherit;border-radius:8px;resize:vertical;transition:border-color .2s}' +
    '.cms-edit-box textarea:focus{outline:none;border-color:#1a2b5e}' +
    '.cms-edit-box input[type=text]{width:100%;border:2px solid #e0e0e0;padding:12px;font-size:.9rem;font-family:inherit;border-radius:8px;transition:border-color .2s}' +
    '.cms-edit-box input[type=text]:focus{outline:none;border-color:#1a2b5e}' +
    '.cms-edit-box .cms-preview{margin:12px 0;max-width:100%;max-height:200px;object-fit:contain;border-radius:8px;background:#f5f5f5;border:1px solid #eee}' +
    '.cms-edit-btns{display:flex;gap:10px;margin-top:18px;justify-content:flex-end}' +
    '.cms-edit-btns button{padding:10px 24px;font-weight:700;font-size:.82rem;border:none;border-radius:8px;cursor:pointer;letter-spacing:1px;transition:all .2s}' +
    '.cms-btn-save{background:#1a2b5e;color:#fff}.cms-btn-save:hover{background:#2a3b7e;transform:translateY(-1px)}' +
    '.cms-btn-cancel{background:#eee;color:#333}.cms-btn-cancel:hover{background:#ddd}' +
    '.cms-btn-reset{background:#e63030;color:#fff;margin-right:auto}.cms-btn-reset:hover{background:#c02020}' +
    '.cms-toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:100001;' +
    'background:#1a2b5e;color:#fff;padding:12px 28px;border-radius:8px;font-size:.85rem;font-weight:700;' +
    'letter-spacing:1px;box-shadow:0 8px 24px rgba(0,0,0,.3);animation:cmsToastIn .3s ease,cmsToastOut .3s ease 2.2s forwards}' +
    '.cms-toast.success{background:#27ae60}.cms-toast.error{background:#e63030}' +
    '@keyframes cmsToastIn{from{transform:translateX(-50%) translateY(20px);opacity:0}}' +
    '@keyframes cmsToastOut{to{transform:translateX(-50%) translateY(20px);opacity:0}}';
  document.head.appendChild(style);

  // ── Label all editables ──
  textEls.forEach(function (el) { el.setAttribute('data-cms-label', 'EDIT TEXT'); });
  imgEls.forEach(function (el) { el.setAttribute('data-cms-label', 'EDIT IMAGE'); });
  bgEls.forEach(function (el) { el.setAttribute('data-cms-label', 'EDIT BACKGROUND'); });

  // ── Build banner ──
  document.body.classList.add('cms-active');

  var savedCount = Object.keys(getData()).length;
  var banner = document.createElement('div');
  banner.id = 'cms-banner';
  banner.innerHTML =
    '<div class="cms-banner-main">' +
      '<div class="cms-banner-badge">ADMIN MODE</div>' +
      '<div class="cms-banner-info">' +
        '<div class="cms-banner-text">Logged in as <strong>Administrator</strong> — click any highlighted element to edit</div>' +
        '<div class="cms-banner-stats">' +
          '<div class="cms-stat"><b>' + textEls.length + '</b> texts</div>' +
          '<div class="cms-stat"><b>' + imgEls.length + '</b> images</div>' +
          '<div class="cms-stat"><b>' + bgEls.length + '</b> backgrounds</div>' +
          '<div class="cms-stat"><b>' + savedCount + '</b> saved edits</div>' +
        '</div>' +
      '</div>' +
      '<div class="cms-banner-actions">' +
        '<a href="admin.html" class="cms-tb-btn gold">Dashboard</a>' +
        '<button class="cms-tb-btn" id="cmsMinimize">Minimize</button>' +
        '<button class="cms-tb-btn red" id="cmsLogout">Logout</button>' +
      '</div>' +
    '</div>';
  document.body.prepend(banner);

  var toggleBtn = document.createElement('button');
  toggleBtn.id = 'cms-toggle';
  toggleBtn.title = 'Show Admin Panel';
  toggleBtn.textContent = 'A';
  document.body.appendChild(toggleBtn);

  document.getElementById('cmsMinimize').addEventListener('click', function () {
    banner.classList.add('collapsed');
    document.body.classList.remove('cms-active');
    toggleBtn.classList.add('show');
  });

  toggleBtn.addEventListener('click', function () {
    banner.classList.remove('collapsed');
    document.body.classList.add('cms-active');
    toggleBtn.classList.remove('show');
  });

  document.getElementById('cmsLogout').addEventListener('click', function () {
    localStorage.removeItem(ADMIN_KEY);
    location.reload();
  });

  function toast(msg, type) {
    var t = document.createElement('div');
    t.className = 'cms-toast ' + (type || '');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }

  function openTextEditor(el) {
    var key = el.getAttribute('data-cms');
    var data = getData();
    var current = data[key] !== undefined ? data[key] : el.innerHTML;

    var overlay = document.createElement('div');
    overlay.className = 'cms-edit-overlay';
    overlay.innerHTML =
      '<div class="cms-edit-box">' +
        '<h3>' + key + '</h3>' +
        '<div class="cms-edit-type"><span>TEXT</span> Edit text content (HTML supported)</div>' +
        '<textarea id="cmsEditVal">' + current.replace(/</g, '&lt;') + '</textarea>' +
        '<div class="cms-edit-btns">' +
          '<button class="cms-btn-reset" id="cmsReset">Reset Default</button>' +
          '<button class="cms-btn-cancel" id="cmsCancel">Cancel</button>' +
          '<button class="cms-btn-save" id="cmsSave">Save</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    document.getElementById('cmsEditVal').focus();

    document.getElementById('cmsSave').onclick = function () {
      var val = document.getElementById('cmsEditVal').value;
      var d = getData(); d[key] = val; saveData(d);
      el.innerHTML = val; overlay.remove();
      toast('Saved: ' + key, 'success');
    };
    document.getElementById('cmsCancel').onclick = function () { overlay.remove(); };
    document.getElementById('cmsReset').onclick = function () {
      if (!confirm('Reset this field to default?')) return;
      var d = getData(); delete d[key]; saveData(d);
      overlay.remove(); toast('Reset: ' + key, 'success'); location.reload();
    };
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
  }

  function openImageEditor(el, type) {
    var attr = type === 'img' ? 'data-cms-img' : 'data-cms-bg';
    var key = el.getAttribute(attr);
    var data = getData();
    var current = type === 'img'
      ? (data[key] || el.src)
      : (data[key] || el.style.backgroundImage.replace(/^url\(['"]?|['"]?\)$/g, ''));
    var label = type === 'img' ? 'IMAGE' : 'BACKGROUND';

    var overlay = document.createElement('div');
    overlay.className = 'cms-edit-overlay';
    overlay.innerHTML =
      '<div class="cms-edit-box">' +
        '<h3>' + key + '</h3>' +
        '<div class="cms-edit-type"><span>' + label + '</span> Enter URL or upload file</div>' +
        '<input type="text" id="cmsImgUrl" value="' + current.replace(/"/g, '&quot;') + '" placeholder="https://placehold.co/...">' +
        '<div style="margin:12px 0"><input type="file" id="cmsImgFile" accept="image/*" style="font-size:.85rem"></div>' +
        '<img class="cms-preview" id="cmsImgPreview" src="' + current.replace(/"/g, '&quot;') + '">' +
        '<div class="cms-edit-btns">' +
          '<button class="cms-btn-reset" id="cmsReset">Reset Default</button>' +
          '<button class="cms-btn-cancel" id="cmsCancel">Cancel</button>' +
          '<button class="cms-btn-save" id="cmsSave">Save</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var urlInput = document.getElementById('cmsImgUrl');
    var preview = document.getElementById('cmsImgPreview');
    var fileInput = document.getElementById('cmsImgFile');

    urlInput.addEventListener('input', function () { preview.src = urlInput.value; });
    fileInput.addEventListener('change', function () {
      var file = fileInput.files[0]; if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) { urlInput.value = e.target.result; preview.src = e.target.result; };
      reader.readAsDataURL(file);
    });

    document.getElementById('cmsSave').onclick = function () {
      var val = urlInput.value;
      var d = getData(); d[key] = val; saveData(d);
      if (type === 'img') el.src = val; else el.style.backgroundImage = "url('" + val + "')";
      overlay.remove(); toast('Saved: ' + key, 'success');
    };
    document.getElementById('cmsCancel').onclick = function () { overlay.remove(); };
    document.getElementById('cmsReset').onclick = function () {
      if (!confirm('Reset this image to default?')) return;
      var d = getData(); delete d[key]; saveData(d);
      overlay.remove(); toast('Reset: ' + key, 'success'); location.reload();
    };
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
  }

  document.addEventListener('click', function (e) {
    if (!document.body.classList.contains('cms-active')) return;
    var textEl = e.target.closest('[data-cms]');
    if (textEl) { e.preventDefault(); e.stopPropagation(); openTextEditor(textEl); return; }
    var imgEl = e.target.closest('[data-cms-img]');
    if (imgEl) { e.preventDefault(); e.stopPropagation(); openImageEditor(imgEl, 'img'); return; }
    var bgEl = e.target.closest('[data-cms-bg]');
    if (bgEl) { e.preventDefault(); e.stopPropagation(); openImageEditor(bgEl, 'bg'); return; }
  }, true);
};
