(() => {
  'use strict';

  const menuToggle = document.querySelector('#menu-toggle');
  const siteNav = document.querySelector('#site-nav');

  function setMenuOpen(open) {
    if (!menuToggle || !siteNav) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    siteNav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  }

  menuToggle?.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  siteNav?.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (menuToggle?.getAttribute('aria-expanded') === 'true' &&
        !siteNav?.contains(event.target) && !menuToggle.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  const navItems = [...document.querySelectorAll('.nav-link[href^="#"]')]
    .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter(({ section }) => section);
  let navFrame = 0;

  function updateActiveNav() {
    navFrame = 0;
    if (!navItems.length) return;
    const readingLine = Math.max(96, window.innerHeight * 0.2);
    let activeSection = navItems[0].section;
    navItems.forEach(({ section }) => {
      if (section.getBoundingClientRect().top <= readingLine) activeSection = section;
    });
    if (window.scrollY > 0 &&
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      activeSection = navItems[navItems.length - 1].section;
    }
    navItems.forEach(({ link, section }) => {
      const active = section === activeSection;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function scheduleActiveNav() {
    if (!navFrame) navFrame = window.requestAnimationFrame(updateActiveNav);
  }

  window.addEventListener('scroll', scheduleActiveNav, { passive: true });
  window.addEventListener('resize', scheduleActiveNav);
  window.addEventListener('load', scheduleActiveNav);
  updateActiveNav();

  const contactForm = document.querySelector('#contact-form');
  const formStatus = document.querySelector('#form-status');
  const submitButton = document.querySelector('#submit-button');
  const configuredEndpoint = typeof window.SITE_CONFIG?.contactEndpoint === 'string'
    ? window.SITE_CONFIG.contactEndpoint.trim() : '';
  let isSubmitting = false;

  function setFormStatus(message, state) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.dataset.state = state;
  }

  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!contactForm.reportValidity()) return;

    const values = new FormData(contactForm);
    if (String(values.get('website') || '').trim()) {
      setFormStatus('无法提交此表单，请清空自动填写的隐藏字段后重试。', 'error');
      return;
    }

    const payload = {};
    for (const key of ['firstName', 'lastName', 'email', 'phone', 'message']) {
      payload[key] = String(values.get(key) || '').trim();
    }
    if (!payload.firstName || !payload.lastName || !payload.email || !payload.message) {
      setFormStatus('请填写姓名、邮箱和留言内容，必填内容不能只有空格。', 'error');
      return;
    }

    const endpoint = configuredEndpoint;
    if (!endpoint) {
      setFormStatus('留言尚未发送，联络服务暂未开通。', 'demo');
      return;
    }

    let endpointUrl;
    try {
      endpointUrl = new URL(endpoint, window.location.href);
      if (!['https:', 'http:'].includes(endpointUrl.protocol)) throw new Error('Invalid protocol');
    } catch {
      setFormStatus('留言接口配置有误，请通过页面上的联系方式联络。', 'error');
      return;
    }

    isSubmitting = true;
    const originalButtonContents = submitButton ? [...submitButton.childNodes] : [];
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = '发送中…';
    }
    contactForm.setAttribute('aria-busy', 'true');
    setFormStatus('正在发送留言…', 'pending');

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpointUrl.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setFormStatus('留言已提交，谢谢你的来信。', 'success');
      contactForm.reset();
    } catch (error) {
      setFormStatus(error.name === 'AbortError'
        ? '发送超时，内容已保留。请稍后重试，或通过邮箱联络。'
        : '暂时未能发送，内容已保留。请检查网络后重试，或通过邮箱联络。', 'error');
    } finally {
      window.clearTimeout(timeout);
      isSubmitting = false;
      contactForm.removeAttribute('aria-busy');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.replaceChildren(...originalButtonContents);
      }
    }
  });

  if (contactForm && submitButton) submitButton.disabled = false;

  const copyEmail = document.querySelector('#copy-email');
  const contactEmail = document.querySelector('#contact-email');
  copyEmail?.addEventListener('click', async () => {
    if (!contactEmail) return;
    let feedback = document.querySelector('#copy-status') || document.querySelector('#copy-feedback');
    if (!feedback) {
      feedback = document.createElement('span');
      feedback.id = 'copy-feedback';
      feedback.className = 'copy-feedback';
      feedback.setAttribute('role', 'status');
      copyEmail.insertAdjacentElement('afterend', feedback);
    }
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(contactEmail.textContent.trim());
      feedback.textContent = '邮箱已复制';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(contactEmail);
      selection?.removeAllRanges();
      selection?.addRange(range);
      feedback.textContent = '邮箱已选中，请手动复制';
    }
  });
})();
