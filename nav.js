(function () {
  var scriptSrc = document.currentScript ? document.currentScript.src : '';
  var base = scriptSrc ? scriptSrc.replace(/nav\.js(\?.*)?$/, '') : '/';

  function inject(pages) {
    var currentPath = window.location.pathname;

    var style = document.createElement('style');
    style.textContent = [
      '.__ct-nav{position:sticky;top:0;z-index:999;background:#0f1117;border-bottom:1px solid #2e3350;padding:0 24px;display:flex;align-items:center;gap:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;height:44px;}',
      '.__ct-nav-home{color:#8b90a8;text-decoration:none;font-weight:600;letter-spacing:.08em;font-size:11px;text-transform:uppercase;padding:0 16px 0 0;border-right:1px solid #2e3350;margin-right:4px;white-space:nowrap;flex-shrink:0;}',
      '.__ct-nav-home:hover{color:#7c6af7;}',
      '.__ct-nav-links{display:flex;align-items:center;gap:2px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;flex:1;}',
      '.__ct-nav-links::-webkit-scrollbar{display:none;}',
      '.__ct-nav-link{color:#8b90a8;text-decoration:none;padding:0 12px;height:44px;display:inline-flex;align-items:center;border-bottom:2px solid transparent;white-space:nowrap;transition:color .15s;}',
      '.__ct-nav-link:hover{color:#e8eaf0;text-decoration:none;}',
      '.__ct-nav-link.__ct-active{color:#7c6af7;border-bottom-color:#7c6af7;}',
      '.__ct-nav-kofi{margin-left:auto;flex-shrink:0;color:#ff5e5b;text-decoration:none;font-size:12px;font-weight:600;padding:4px 12px;border:1px solid rgba(255,94,91,.35);border-radius:20px;white-space:nowrap;transition:background .2s,border-color .2s,color .2s;}',
      '.__ct-nav-kofi:hover{background:rgba(255,94,91,.12);border-color:rgba(255,94,91,.7);color:#ff7a78;text-decoration:none;}'
    ].join('');
    document.head.appendChild(style);

    var nav = document.createElement('nav');
    nav.className = '__ct-nav';
    nav.setAttribute('aria-label', 'Claude Code Tips');

    var home = document.createElement('a');
    home.className = '__ct-nav-home';
    home.href = base;
    home.textContent = 'CC Tips';
    nav.appendChild(home);

    var links = document.createElement('div');
    links.className = '__ct-nav-links';

    pages.forEach(function (page) {
      var a = document.createElement('a');
      a.className = '__ct-nav-link';
      a.href = base + page.url;
      a.textContent = page.title;
      if (currentPath.indexOf('/' + page.url.replace(/\/$/, '') + '/') !== -1 || currentPath.endsWith('/' + page.url.replace(/\/$/, ''))) {
        a.className += ' __ct-active';
      }
      links.appendChild(a);
    });

    nav.appendChild(links);

    var kofi = document.createElement('a');
    kofi.className = '__ct-nav-kofi';
    kofi.href = 'https://ko-fi.com/devycelabs';
    kofi.target = '_blank';
    kofi.rel = 'noopener';
    kofi.textContent = '☕ Support';
    nav.appendChild(kofi);

    document.body.insertBefore(nav, document.body.firstChild);
  }

  function init() {
    fetch(base + 'pages.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { inject(data.pages || []); })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
