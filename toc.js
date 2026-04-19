(function () {
  var BREAKPOINT = 1280;
  var TOC_WIDTH  = 148;
  var NAV_H      = 52;  // sticky nav bar height
  var GAP        = 18;  // gap between toc right edge and content left edge

  function build() {
    if (window.innerWidth < BREAKPOINT) return;

    var sections = Array.from(
      document.querySelectorAll('section.section[id]')
    ).filter(function (s) { return s.querySelector('.section-label'); });

    if (sections.length < 3) return;

    var style = document.createElement('style');
    style.textContent = [
      '.__toc{',
        'position:fixed;',
        'top:' + (NAV_H + 16) + 'px;',
        'left:max(12px,calc(50% - 430px - ' + (TOC_WIDTH + GAP) + 'px));',
        'width:' + TOC_WIDTH + 'px;',
        'z-index:90;',
      '}',
      '.__toc-title{',
        'font-size:10px;font-weight:700;letter-spacing:.12em;',
        'text-transform:uppercase;color:#3a3f58;',
        'margin-bottom:10px;padding-left:12px;',
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
      '}',
      '.__toc-list{list-style:none;padding:0;margin:0;}',
      '.__toc-item{margin-bottom:1px;}',
      '.__toc-link{',
        'display:block;padding:5px 8px 5px 12px;',
        'font-size:12px;line-height:1.45;',
        'color:#3e4460;text-decoration:none;',
        'border-left:2px solid transparent;',
        'border-radius:0 4px 4px 0;',
        'transition:color .12s,border-color .12s,background .12s;',
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
      '}',
      '.__toc-link:hover{color:#8b90a8;background:rgba(255,255,255,.03);border-left-color:#2e3350;text-decoration:none;}',
      '.__toc-link.__toc-active{color:#7c6af7;border-left-color:#7c6af7;background:rgba(124,106,247,.06);}',
    ].join('');
    document.head.appendChild(style);

    var toc = document.createElement('nav');
    toc.className = '__toc';
    toc.setAttribute('aria-label', 'On this page');

    var title = document.createElement('div');
    title.className = '__toc-title';
    title.textContent = 'On this page';
    toc.appendChild(title);

    var list = document.createElement('ul');
    list.className = '__toc-list';

    var items = [];
    sections.forEach(function (section) {
      var h2    = section.querySelector('h2');
      var label = section.querySelector('.section-label');
      var text  = h2 ? h2.textContent.trim() : (label ? label.textContent.trim() : '');
      if (!text) return;

      var li = document.createElement('li');
      li.className = '__toc-item';

      var a = document.createElement('a');
      a.className = '__toc-link';
      a.href = '#' + section.id;
      a.textContent = text;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var top = section.getBoundingClientRect().top + window.scrollY - NAV_H - 12;
        window.scrollTo({ top: top, behavior: 'smooth' });
        history.pushState(null, '', '#' + section.id);
      });

      li.appendChild(a);
      list.appendChild(li);
      items.push({ a: a, section: section });
    });

    toc.appendChild(list);
    document.body.appendChild(toc);

    // Track active section via IntersectionObserver
    var activeId = sections[0] ? sections[0].id : null;

    function highlight(id) {
      activeId = id;
      items.forEach(function (item) {
        item.a.classList.toggle('__toc-active', item.section.id === id);
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      // Pick the entry closest to the top of the detection band
      var visible = entries
        .filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      if (visible.length) highlight(visible[0].target.id);
    }, {
      rootMargin: '-' + (NAV_H + 8) + 'px 0px -70% 0px',
      threshold: 0,
    });

    sections.forEach(function (s) { observer.observe(s); });

    // Set initial highlight from URL hash or first visible section
    var hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
      highlight(hash);
    } else {
      for (var i = sections.length - 1; i >= 0; i--) {
        if (sections[i].getBoundingClientRect().top <= NAV_H + 60) {
          highlight(sections[i].id);
          break;
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
