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

  const projects = {
    fundamentals: {
      eyebrow: 'FINANCIAL ANALYSIS · 示例案例 01',
      title: '公司财务与估值分析',
      subtitle: '从公开披露到估值假设，呈现可追溯的分析过程。',
      meta: '案例方向 · 基本面研究 / 财务建模',
      content: `
        <h3>研究问题与资料</h3>
        <p>以一家上市公司为研究对象，整理公开年报中的业务结构、收入来源与财务披露。记录数据口径及来源，区分已披露事实与模型假设。</p>
        <h3>分析方法</h3>
        <p>联动利润表、资产负债表和现金流量表，观察盈利能力、营运资本与现金流。结合 DCF 和可比公司估值，并对收入增速、利润率、折现率进行敏感性分析。</p>
        <h3>交付与边界</h3>
        <p>计划产出估值模型、假设说明及风险摘要。展示重点是分析方法与推导逻辑，不包含真实投资建议或业绩结果。</p>
        <div class="detail-grid"><div><h4>示例角色</h4><p>资料整理、财务分析与估值建模。</p></div><div><h4>工具</h4><p>Excel / Python</p></div></div>`
    },
    allocation: {
      eyebrow: 'PORTFOLIO ANALYSIS · 示例案例 02',
      title: '多资产组合分析',
      subtitle: '通过数据整理与可视化，理解资产之间的风险关系。',
      meta: '案例方向 · 数据分析 / 资产配置',
      content: `
        <h3>数据与问题</h3>
        <p>选取股票、债券等资产的公开价格序列，核对币种、频率及样本区间。统一日期与缺失值处理规则，说明收益口径和数据限制。</p>
        <h3>分析方法</h3>
        <p>计算收益、波动率与相关性，比较不同权重下的组合特征。用时间序列图、相关性矩阵及风险图表，解释单一资产与组合之间的差异。</p>
        <h3>交付与边界</h3>
        <p>计划产出可复用的数据处理脚本和分析报告。明确样本区间、再平衡及费用假设；历史样本仅用于理解方法，不代表未来表现。</p>
        <div class="detail-grid"><div><h4>示例角色</h4><p>数据整理、风险计算与结果可视化。</p></div><div><h4>工具</h4><p>Python / pandas / NumPy</p></div></div>`
    }
  };

  const detailDialog = document.querySelector('#detail-dialog');
  const dialogContent = document.querySelector('#dialog-content');

  function openDetail(item) {
    if (!item || !detailDialog || !dialogContent) return;
    dialogContent.innerHTML = `
      <p class="detail-eyebrow">${item.eyebrow}</p>
      <h2 class="detail-title" id="detail-title">${item.title}</h2>
      ${item.subtitle ? `<p class="detail-subtitle">${item.subtitle}</p>` : ''}
      <p class="detail-meta">${item.meta}</p>
      <div class="detail-body">${item.content}</div>
      <p class="detail-note">展示案例结构的示例内容，非真实投资业绩。</p>`;
    detailDialog.setAttribute('aria-labelledby', 'detail-title');
    document.body.classList.add('modal-open');
    detailDialog.showModal();
    detailDialog.scrollTop = 0;
    document.querySelector('#dialog-close')?.focus();
  }

  document.querySelectorAll('[data-project]').forEach((button) => {
    button.addEventListener('click', () => openDetail(projects[button.dataset.project]));
  });

  document.querySelector('#dialog-close')?.addEventListener('click', () => detailDialog?.close());
  detailDialog?.addEventListener('close', () => document.body.classList.remove('modal-open'));
  detailDialog?.addEventListener('click', (event) => {
    if (event.target !== detailDialog) return;
    const rect = detailDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) {
      detailDialog.close();
    }
  });

  if ('IntersectionObserver' in window) {
    const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (!visible.length) return;
      const section = visible[visible.length - 1].target;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${section.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    const observed = new Set();
    navLinks.forEach((link) => {
      const section = document.getElementById(link.hash.slice(1));
      if (section && !observed.has(section)) {
        observer.observe(section);
        observed.add(section);
      }
    });
  }

  const contactForm = document.querySelector('#contact-form');
  const formStatus = document.querySelector('#form-status');
  const submitButton = document.querySelector('#submit-button');
  const configuredEndpoint = typeof window.SITE_CONFIG?.contactEndpoint === 'string'
    ? window.SITE_CONFIG.contactEndpoint.trim() : '';
  if (configuredEndpoint) {
    const formDemoNote = document.querySelector('.form-demo-note');
    if (formDemoNote) {
      formDemoNote.textContent = '提交后会将填写的信息发送至本站联络服务。';
    }
  }
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
      setFormStatus('表单填写正确。当前为演示模式，留言尚未发送。', 'demo');
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
