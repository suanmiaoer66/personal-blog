(() => {
  'use strict';

  if (!('IntersectionObserver' in window) || !window.matchMedia) return;

  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let stopMotion = () => {};

  function startMotion() {
    const root = document.documentElement;
    const hero = document.querySelector('.hero');
    const main = document.querySelector('main');
    const compact = window.matchMedia('(max-width: 800px)');
    const items = [...document.querySelectorAll([
      '.hero-copy > *', '.hero-visual', '.hero-bottom',
      '.section-label', '.about-copy > *', '.section-heading',
      '.column-heading', '.timeline-item', '.filter-bar',
      '.project-card', '.article-card', '.quote-strip > *',
      '.contact-copy > :not(.copy-status)',
      '.contact-form > .form-row', '.contact-form > .field',
      '.contact-form > .form-footer', '.contact-form > .form-demo-note',
      '.site-footer'
    ].join(','))];
    const groups = [
      [...document.querySelectorAll('.hero-copy > *')],
      [...document.querySelectorAll('.project-card')],
      [...document.querySelectorAll('.article-card')],
      [...document.querySelectorAll('.quote-strip > *')]
    ];
    let frame = 0;
    let active = true;

    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');

    function updateDelays() {
      groups.forEach((group) => {
        group.filter((item) => !item.hidden).forEach((item, index) => {
          const delay = Math.min(index, 4) * (compact.matches ? 35 : 75);
          item.style.setProperty('--reveal-delay', `${delay}ms`);
        });
      });
    }

    function reveal(item, immediate = false) {
      if (immediate) item.style.setProperty('--reveal-delay', '0ms');
      item.classList.add('is-visible');
      item.classList.remove('motion-above');
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const item = entry.target;
        if (item.hidden) continue;
        if (item.contains(document.activeElement)) {
          reveal(item, true);
          continue;
        }
        if (entry.isIntersecting) {
          reveal(item);
        } else if (!entry.isIntersecting) {
          // Reset only after leaving the real viewport, never mid-paragraph.
          const rect = entry.boundingClientRect;
          if (rect.height && (rect.bottom <= 0 || rect.top >= window.innerHeight)) {
            item.classList.remove('is-visible');
            item.classList.toggle('motion-above', rect.bottom <= 0);
          }
        }
      }
    }, { threshold: 0 });

    function paintScroll() {
      frame = 0;
      if (!active) return;
      const range = root.scrollHeight - window.innerHeight;
      const position = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      progress.style.setProperty('--scroll-progress', position.toFixed(4));
      if (!hero) return;
      if (compact.matches) {
        hero.style.removeProperty('--hero-opacity');
        hero.style.removeProperty('--hero-drift');
        hero.style.removeProperty('--portrait-drift');
        hero.style.removeProperty('--badge-turn');
        return;
      }
      const rect = hero.getBoundingClientRect();
      const departure = Math.min(1, Math.max(0, -rect.top / (rect.height * 0.72)));
      hero.style.setProperty('--hero-opacity', (1 - departure * departure).toFixed(3));
      hero.style.setProperty('--hero-drift', `${(-departure * 18).toFixed(2)}px`);
      hero.style.setProperty('--portrait-drift', `${(departure * 24).toFixed(2)}px`);
      hero.style.setProperty('--badge-turn', `${(departure * 42).toFixed(2)}deg`);
    }

    function schedulePaint() {
      if (active && !frame) frame = requestAnimationFrame(paintScroll);
    }

    function onResize() {
      updateDelays();
      schedulePaint();
    }

    function onFocus(event) {
      // The form's browser validation can scroll directly to an offscreen input.
      let item = event.target.closest('.motion-item');
      while (item) {
        reveal(item, true);
        item = item.parentElement?.closest('.motion-item');
      }
    }

    const filterObserver = new MutationObserver((records) => {
      updateDelays();
      records.forEach(({ target }) => {
        target.classList.remove('is-visible', 'motion-above');
        if (!target.hidden) {
          observer.unobserve(target);
          observer.observe(target);
        }
      });
      schedulePaint();
    });
    document.querySelectorAll('.project-grid, .article-grid').forEach((grid) => {
      filterObserver.observe(grid, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
    });

    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(schedulePaint) : null;
    if (main) resizeObserver?.observe(main);

    items.forEach((item) => {
      item.classList.add('motion-item');
      observer.observe(item);
    });
    updateDelays();
    document.body.append(progress);
    root.classList.add('motion-active');
    window.addEventListener('scroll', schedulePaint, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pageshow', schedulePaint);
    document.addEventListener('focusin', onFocus);
    schedulePaint();

    return () => {
      active = false;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      filterObserver.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', schedulePaint);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pageshow', schedulePaint);
      document.removeEventListener('focusin', onFocus);
      root.classList.remove('motion-active');
      items.forEach((item) => {
        item.classList.remove('motion-item', 'is-visible', 'motion-above');
        item.style.removeProperty('--reveal-delay');
      });
      ['--hero-opacity', '--hero-drift', '--portrait-drift', '--badge-turn'].forEach((property) => {
        hero?.style.removeProperty(property);
      });
      progress.remove();
    };
  }

  function syncPreference() {
    stopMotion();
    stopMotion = preference.matches ? () => {} : startMotion();
  }

  preference.addEventListener('change', syncPreference);
  syncPreference();
})();
