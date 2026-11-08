(function () {
  var root = document.documentElement;
  function effective() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  try { var saved = localStorage.getItem('kr-theme'); if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved); } catch (e) {}
  var themeBtn = document.getElementById('theme');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = effective() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('kr-theme', next); } catch (e) {}
  });

  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (burger && nav) {
    burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  document.querySelectorAll('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      var done = function () { var old = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = old; }, 1400); };
      var fallback = function () {
        var el = b.previousElementSibling;
        if (el && window.getSelection) { var r = document.createRange(); r.selectNodeContents(el); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, fallback); } else { fallback(); }
    });
  });

  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      status.hidden = false;
      status.className = '';
      status.textContent = 'Sending message…';
      try {
        var res = await fetch(form.action, { method: form.method, body: new FormData(form), headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          status.className = 'ok';
          status.textContent = "Thanks, your message is sent. I'll get back to you shortly.";
          form.reset();
        } else {
          var data = {};
          try { data = await res.json(); } catch (e) {}
          status.className = 'err';
          status.textContent = (data && data.error) || 'Something went wrong. Please try again or email me directly.';
        }
      } catch (err) {
        status.className = 'err';
        status.textContent = 'Unable to send right now. Please email me directly.';
      }
    });
  }
})();
