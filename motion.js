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
    const sections = [...document.querySelectorAll('main > section:not(#home)')];
    const items = [...document.querySelectorAll([
      '.hero-copy > *', '.hero-visual',
      '.section-label', '.about-copy > *', '.research-heading',
      '.resume-row', '.skill-card', '.project-card',
      '.interest-visual', '.interest-item',
      '.contact-copy > :not(.copy-status)',
      '.contact-form > .form-row', '.contact-form > .field',
      '.contact-form > .form-footer', '.contact-form > .form-demo-note',
      '.site-footer'
    ].join(','))];
    const groups = [
      { items: [...document.querySelectorAll('.hero-copy > *')], interval: null },
      ...[...document.querySelectorAll('.resume-list')].map((list) => ({
        items: [...list.querySelectorAll('.resume-row')], interval: 350
      })),
      ...[...document.querySelectorAll('.skills-grid')].map((grid) => ({
        items: [...grid.querySelectorAll('.skill-card')], interval: 350
      })),
      ...[...document.querySelectorAll('.project-grid')].map((grid) => ({
        items: [...grid.querySelectorAll('.project-card')], interval: 350
      })),
      { items: [...document.querySelectorAll('.interest-item')], interval: 150 }
    ];
    let frame = 0;
    let active = true;

    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');

    function updateDelays() {
      groups.forEach(({ items: group, interval }) => {
        group.forEach((item, index) => {
          const delay = interval === null
            ? Math.min(index, 4) * (compact.matches ? 60 : 110)
            : index * interval;
          item.style.setProperty('--reveal-delay', `${delay}ms`);
        });
      });
    }

    function reveal(item, immediate = false) {
      if (item.classList.contains('motion-section')) {
        item.classList.add('is-section-visible');
        return;
      }
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
            item.classList.remove('is-visible', 'is-section-visible');
            if (item.classList.contains('motion-item')) {
              item.classList.toggle('motion-above', rect.bottom <= 0);
            }
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
        return;
      }
      const rect = hero.getBoundingClientRect();
      const departure = Math.min(1, Math.max(0, -rect.top / (rect.height * 0.72)));
      hero.style.setProperty('--hero-opacity', (1 - departure * departure).toFixed(3));
      hero.style.setProperty('--hero-drift', `${(-departure * 18).toFixed(2)}px`);
      hero.style.setProperty('--portrait-drift', `${(departure * 24).toFixed(2)}px`);
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
      let item = event.target.closest('.motion-item, .motion-section');
      while (item) {
        reveal(item, true);
        item = item.parentElement?.closest('.motion-item, .motion-section');
      }
    }

    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(schedulePaint) : null;
    if (main) resizeObserver?.observe(main);

    // Observe the full section so its existing background fades with the module.
    // No section translation: adjacent color bands keep their original layout.
    sections.forEach((section) => {
      section.classList.add('motion-section');
      observer.observe(section);
    });
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
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', schedulePaint);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pageshow', schedulePaint);
      document.removeEventListener('focusin', onFocus);
      root.classList.remove('motion-active');
      sections.forEach((section) => {
        section.classList.remove('motion-section', 'is-section-visible');
      });
      items.forEach((item) => {
        item.classList.remove('motion-item', 'is-visible', 'motion-above');
        item.style.removeProperty('--reveal-delay');
      });
      ['--hero-opacity', '--hero-drift', '--portrait-drift'].forEach((property) => {
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
