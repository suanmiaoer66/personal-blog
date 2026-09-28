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

  function setupFilters(buttonSelector, cardSelector) {
    const buttons = [...document.querySelectorAll(buttonSelector)];
    const cards = [...document.querySelectorAll(cardSelector)];
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        buttons.forEach((item) => {
          const selected = item === button;
          item.classList.toggle('active', selected);
          item.setAttribute('aria-pressed', String(selected));
        });
        cards.forEach((card) => {
          const categories = (card.dataset.category || '').split(/\s+/);
          card.hidden = filter !== 'all' && !categories.includes(filter);
        });
      });
    });
  }

  setupFilters('.project-filter[data-filter]', '.project-card[data-category]');
  setupFilters('.article-filter[data-filter]', '.article-card[data-category]');

  const projects = {
    between: {
      eyebrow: 'SELECTED PROJECT · 01',
      title: 'Between 间隙',
      subtitle: '在起点与终点之间，给偶遇留一点空间。',
      meta: '个人概念项目 · 交互设计 · 2026',
      image: 'assets/between.svg',
      alt: 'Between 城市漫步项目的界面与路线视觉设计',
      content: `
        <h3>从一个很小的困惑开始</h3>
        <p>地图擅长告诉我们怎样更快到达，却很少回答“今天想怎样走”。Between 是一次围绕日常步行的交互探索：把目的地暂时放在一边，让一段路本身成为值得期待的事情。</p>
        <h3>把选择变得轻一点</h3>
        <p>我将路线入口收敛为步行时长、沿途氛围和出发位置。用户可以从“沿着绿意走”“看看老建筑”“找一家安静的小店”开始，再决定是否收藏途中的地点。界面把路线概览与当下需要的方向信息分开，减少走路时反复查看屏幕的负担。</p>
        <div class="detail-grid"><div><h4>我的工作</h4><p>场景梳理、信息架构、交互流程、视觉系统与可点击原型。</p></div><div><h4>使用工具</h4><p>Figma、纸笔草图与步行观察笔记。</p></div></div>
        <h3>这次探索留下的思考</h3>
        <p>一个鼓励走出屏幕的产品，也应该知道什么时候安静下来。我尝试把提醒集中在必要的转向和用户主动收藏的节点。这个项目目前是概念原型，尚未接入实时地图，也没有上线后的使用数据；下一步会用真实路线验证方向提示与无障碍信息是否足够清楚。</p>`
    },
    folio: {
      eyebrow: 'SELECTED PROJECT · 02',
      title: 'Folio 灵感手记',
      subtitle: '让零散的念头，有一个可以慢慢生长的地方。',
      meta: '个人练习项目 · 设计与开发 · 2025',
      image: 'assets/folio.svg',
      alt: 'Folio 轻量笔记项目的编辑器与笔记卡片视觉设计',
      content: `
        <h3>先把想法写下来</h3>
        <p>有时我只是想记下一句话，却会在文件夹、标签和格式之间停顿。Folio 从这个日常体验出发，探索一个打开后就能写的笔记空间，把组织内容的工作留到稍后。</p>
        <h3>设计与代码一起推敲</h3>
        <p>这个练习围绕三个动作展开：快速记录、按关键词找回、把相关片段整理成集合。我先在 Figma 中梳理信息层级，再用 HTML、CSS 和 JavaScript 制作本地交互原型。实现过程中，我重新调整了空状态、长标题换行与键盘焦点，让视觉稿里的安静感能够在真实操作中成立。</p>
        <div class="detail-grid"><div><h4>我的工作</h4><p>产品范围定义、界面设计、响应式布局与前端交互原型。</p></div><div><h4>关注细节</h4><p>阅读宽度、输入反馈、键盘访问和内容为空时的引导。</p></div></div>
        <h3>完成，也保留边界</h3>
        <p>Folio 是用于学习的个人作品，当前展示的是设计方向与本地原型，不包含云同步、账号服务或协作能力。它让我理解到，轻量并不是删掉所有功能，而是让最常见的动作更容易开始、让内容始终留在中心。</p>`
    },
    still: {
      eyebrow: 'SELECTED PROJECT · 03',
      title: 'Still 此刻',
      subtitle: '留出一小段时间，只做眼前这一件事。',
      meta: '个人实验 · 前端开发 · 2025',
      image: 'assets/still.svg',
      alt: 'Still 专注计时项目的极简计时器视觉设计',
      content: `
        <h3>一个足够安静的开始</h3>
        <p>Still 是一个围绕专注时段的小型前端实验。我希望它像桌边的一只沙漏：帮助人感知时间，但不过度提醒、不制造完成任务的压力。</p>
        <h3>简单界面背后的状态</h3>
        <p>界面只保留本次任务、剩余时间和开始、暂停、重置操作。我把练习重点放在状态转换上：暂停后恢复应当连续，重置应当清楚，浏览器标签页切换后也要根据实际经过的时间校正显示。颜色变化与动效只提供辅助信息，核心状态始终用文字表达。</p>
        <div class="detail-grid"><div><h4>我的工作</h4><p>交互设计、计时逻辑、响应式样式和键盘操作检查。</p></div><div><h4>使用技术</h4><p>原生 JavaScript、CSS 自定义属性与浏览器时间 API。</p></div></div>
        <h3>把克制做成具体选择</h3>
        <p>这个项目没有积分、排行或连续打卡；休息也不被当作一种失败。作为练习作品，它尚未开展长期使用研究。后续更值得验证的问题，是不同时间长度和提示方式能否适应真实的工作节奏，而不是继续添加更多数字。</p>`
    }
  };

  const articles = {
    less: {
      eyebrow: 'DESIGN NOTES · 设计随笔',
      title: '好的设计，有时只是少做一点',
      meta: '2026.09.18 · 约 4 分钟阅读',
      content: `
        <h3>先问一句：它真的需要出现吗</h3>
        <p>做界面时，我经常把“更完整”误认为“更好”：补一个入口，加一行解释，再给空白处放上一张卡片。直到把页面缩小看一遍，才发现每一块都在争取注意力，最重要的事情反而不容易被看见。</p>
        <h3>删掉之前，先理解它的工作</h3>
        <p>后来我开始给每一个元素写下一句理由。这个按钮帮助谁完成什么？这段提示解决的是实际疑惑，还是我对留白的不安？如果两个元素承担同一件事，我就尝试合并；如果一段说明只有少数人在特殊时刻需要，就让它在那个时刻出现。</p>
        <h3>简单不等于让人猜</h3>
        <p>少做一点并不意味着只留下图标，也不是把所有辅助信息都藏起来。错误提示、明确的按钮文字和可见的键盘焦点，有时会让页面看起来多了一点东西，却能让使用过程少一点犹豫。我更愿意把“简单”理解为：在需要的时候，能顺利找到下一步。</p>
        <h3>给自己留一次回看的机会</h3>
        <p>现在完成一版设计后，我会暂时离开，再带着一个具体任务回来走一遍。那些让我停下来的地方，比视觉上不够饱满的区域更值得修改。好的设计未必会让人注意到设计本身；有时候，它只是让一件小事顺顺当当地完成。</p>`
    },
    walk: {
      eyebrow: 'LIFE JOURNAL · 生活观察',
      title: '在城市里，重新练习观察',
      meta: '2026.09.06 · 约 3 分钟阅读',
      content: `
        <h3>换一条回家的路</h3>
        <p>有段时间，我对附近街道的认识几乎只剩下导航里的蓝线。直到一个没有安排的傍晚，我提前下车，沿着不熟悉的小路慢慢走回去。旧楼门口的椅子、修鞋摊手写的价目表、从树叶里落下来的光，忽然重新变得具体。</p>
        <h3>不急着把一切变成素材</h3>
        <p>刚开始，我总想立刻拍下来，仿佛没有保存就不算看见。后来试着先停留十几秒：读完整块招牌，看看人们怎样绕开一个台阶，听一会儿路口不同方向的声音。照片留下的是一个画面，而多看一会儿，有时才能发现画面里的关系。</p>
        <h3>日常也有自己的信息设计</h3>
        <p>菜场摊位用颜色区分价格，咖啡店把营业时间贴在门把手旁，老小区的指路牌经历了几次手写补充。这些未经统一设计的细节往往很直接：有人需要找到路，有人需要避免白跑一趟。我喜欢从中观察，人是怎样在有限条件下让信息发挥作用的。</p>
        <h3>把注意力还给当下</h3>
        <p>散步没有让我每天都产生灵感，但它给了注意力一个缓冲区。回到桌前时，我不一定带回一张可以使用的照片，却常常带回一个更具体的问题。对我来说，这已经是一段路很好的收获。</p>`
    },
    learn: {
      eyebrow: 'DESIGN NOTES · 学习记录',
      title: '从设计到代码：我的学习笔记',
      meta: '2026.08.24 · 约 5 分钟阅读',
      content: `
        <h3>从能看见的反馈开始</h3>
        <p>第一次把自己的页面写出来时，最有吸引力的并不是用了多少新技术，而是修改一行样式后，那个原本只存在于画布上的按钮真的发生了变化。我因此给自己选了很小的起点：一个页面、一种布局、一次可以完整走通的交互。</p>
        <h3>先理解结构，再微调像素</h3>
        <p>我曾经花很长时间对齐某个边距，却忽略了标题层级和内容顺序。后来逐渐习惯先写有语义的 HTML，再确定布局，最后处理字体、颜色和间距。当内容长短变化或屏幕变窄时，清楚的结构通常比一组精准但脆弱的坐标更有用。</p>
        <h3>让真实状态参与设计</h3>
        <p>写代码迫使我回答视觉稿里容易略过的问题：数据为空怎么办，输入错误怎么办，按钮被连续点击会怎样，网络请求失败后用户还能做什么？这些状态让我把设计从“页面长什么样”扩展到“事情是怎样发生的”。它们也经常反过来改变最初的界面。</p>
        <h3>学会读懂，再继续加工具</h3>
        <p>遇到陌生实现时，我会先把它拆成可以解释的小部分，尝试用自己的话说清楚输入、状态和输出。工具能让搭建更快，但理解浏览器怎样排版、事件怎样触发、焦点怎样移动，仍然是解决问题时最可靠的底子。</p>
        <h3>保留一份能复看的记录</h3>
        <p>现在我的学习笔记不再只保存“正确代码”，也会记录最初的误解、报错出现的条件，以及最后为什么这样修改。进步经常不是一次突然的突破，而是下次遇到同类问题时，能够更平静、更有条理地走到答案。</p>`
    }
  };

  const detailDialog = document.querySelector('#detail-dialog');
  const dialogContent = document.querySelector('#dialog-content');

  function openDetail(item, kind) {
    if (!item || !detailDialog || !dialogContent) return;
    dialogContent.innerHTML = `
      <p class="detail-eyebrow">${item.eyebrow}</p>
      <h2 class="detail-title" id="detail-title">${item.title}</h2>
      ${item.subtitle ? `<p class="detail-subtitle">${item.subtitle}</p>` : ''}
      <p class="detail-meta">${item.meta}</p>
      ${item.image ? `<img class="detail-image" src="${item.image}" alt="${item.alt}" width="900" height="640">` : ''}
      <div class="detail-body">${item.content}</div>
      ${kind === 'project' ? '<p class="detail-note">本页为个人网站的示例作品内容，可替换为你的真实项目。</p>' : ''}`;
    detailDialog.setAttribute('aria-labelledby', 'detail-title');
    document.body.classList.add('modal-open');
    detailDialog.showModal();
    detailDialog.scrollTop = 0;
    document.querySelector('#dialog-close')?.focus();
  }

  document.querySelectorAll('[data-project]').forEach((button) => {
    button.addEventListener('click', () => openDetail(projects[button.dataset.project], 'project'));
  });
  document.querySelectorAll('[data-article]').forEach((button) => {
    button.addEventListener('click', () => openDetail(articles[button.dataset.article], 'article'));
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
