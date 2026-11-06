/* Fernok site interactions — vanilla, no framework. */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function initNav() {
  const toggle = $('[data-nav-toggle]');
  const panel = $('#mobile-nav');
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    panel.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  panel.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 880 && !panel.hidden) setOpen(false);
  });
}

function initSearch() {
  const dialog = $('#site-search');
  const input = $('#search-input');
  const results = $('#search-results');
  if (!dialog || !input || !results) return;

  let index = [];
  let active = 0;
  let loading = null;

  const typeLabels = { post: '文章', doc: '文档', project: '项目' };

  const load = () => {
    if (loading) return loading;
    loading = fetch('/search.json')
      .then((response) => (response.ok ? response.json() : []))
      .catch(() => []);
    return loading;
  };

  const setActive = (next) => {
    const items = $$('.search-result', results);
    if (!items.length) return;
    active = (next + items.length) % items.length;
    items.forEach((item, itemIndex) => {
      const isActive = itemIndex === active;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', String(isActive));
      if (isActive) item.scrollIntoView({ block: 'nearest' });
    });
  };

  const renderEmpty = (message) => {
    results.replaceChildren();
    const empty = document.createElement('div');
    empty.className = 'search-empty';
    empty.textContent = message;
    results.append(empty);
  };

  const render = (query) => {
    const normalized = query.trim().toLowerCase();
    const matches = index
      .filter((item) => {
        if (!normalized) return true;
        const haystack = [item.title, item.description, ...(item.tags || [])].join(' ').toLowerCase();
        return haystack.includes(normalized);
      })
      .slice(0, 12);

    results.replaceChildren();
    active = 0;

    if (!matches.length) {
      renderEmpty(normalized ? `没有找到与「${query.trim()}」相关的内容` : '这里还没有可搜索的内容');
      return;
    }

    matches.forEach((item, itemIndex) => {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.href = item.href;
      link.setAttribute('role', 'option');
      link.setAttribute('aria-selected', String(itemIndex === 0));
      if (itemIndex === 0) link.classList.add('is-active');

      const type = document.createElement('span');
      type.className = 'search-result__type';
      type.textContent = typeLabels[item.type] || '页面';

      const body = document.createElement('span');
      const title = document.createElement('span');
      title.className = 'search-result__title';
      title.textContent = item.title;
      const desc = document.createElement('span');
      desc.className = 'search-result__desc';
      desc.textContent = item.description || '';
      body.append(title, desc);

      const arrow = document.createElement('span');
      arrow.className = 'search-result__arrow';
      arrow.textContent = '↗';

      link.append(type, body, arrow);
      link.addEventListener('mouseenter', () => setActive(itemIndex));
      results.append(link);
    });
  };

  const open = async () => {
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
    input.focus();
    input.select();

    const data = await load();
    if (!index.length) {
      index = Array.isArray(data) ? data : [];
      render(input.value);
    }
  };

  const close = () => {
    if (dialog.open && typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    document.body.style.overflow = '';
  };

  const shortcut = /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? '⌘K' : 'Ctrl K';
  $$('[data-search-kbd]').forEach((node) => {
    node.textContent = shortcut;
  });

  $$('[data-search-open]').forEach((button) => button.addEventListener('click', open));
  $$('[data-search-close]').forEach((button) => button.addEventListener('click', close));

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  input.addEventListener('input', () => {
    if (index.length) render(input.value);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive(active + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive(active - 1);
    } else if (event.key === 'Enter') {
      const selected = $$('.search-result', results)[active];
      if (selected) {
        event.preventDefault();
        selected.click();
      }
    }
  });

  window.addEventListener('keydown', (event) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
    const command = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    if (command || (event.key === '/' && !typing)) {
      event.preventDefault();
      open();
    }
  });
}

function initFilters() {
  $$('[data-filter-group]').forEach((group) => {
    const buttons = $$('[data-filter]', group);
    const scope = group.closest('[data-filter-scope]') || document;
    const cards = $$('[data-post-card], [data-project-card]', scope);
    const count = $('[data-filter-count]', scope);
    const empty = $('[data-filter-empty]', scope);
    if (!buttons.length) return;

    const apply = (value) => {
      let visible = 0;

      cards.forEach((card) => {
        let matches = value === 'all';
        if (!matches) {
          if (card.hasAttribute('data-status')) {
            matches = card.getAttribute('data-status') === value;
          }
          if (!matches && card.hasAttribute('data-tags')) {
            try {
              const tags = JSON.parse(card.getAttribute('data-tags') || '[]');
              matches = tags.includes(value);
            } catch {
              matches = false;
            }
          }
        }
        card.hidden = !matches;
        if (matches) visible += 1;
      });

      buttons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.getAttribute('data-filter') === value));
      });

      if (count) {
        const total = String(visible).padStart(2, '0');
        count.textContent = value === 'all' ? `${total} ${count.dataset.unit || 'ITEMS'}` : `${total} 个结果`;
      }
      if (empty) empty.hidden = visible !== 0;
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => apply(button.getAttribute('data-filter') || 'all'));
    });
  });
}

function initCopyButtons() {
  $$('.prose pre').forEach((pre) => {
    if ($('.code-copy', pre)) return;
    const button = document.createElement('button');
    button.className = 'code-copy';
    button.type = 'button';
    button.textContent = '复制';

    button.addEventListener('click', async () => {
      const code = $('code', pre)?.textContent || pre.textContent || '';
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = '已复制';
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.append(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        button.textContent = '已复制';
      }
      window.setTimeout(() => {
        button.textContent = '复制';
      }, 1600);
    });

    pre.append(button);
  });
}

function initCopyLink() {
  $$('[data-copy-link]').forEach((button) => {
    button.addEventListener('click', async () => {
      const original = button.getAttribute('data-label') || button.textContent;
      try {
        await navigator.clipboard.writeText(window.location.href);
        button.textContent = '链接已复制';
      } catch {
        button.textContent = '复制失败';
      }
      window.setTimeout(() => {
        button.textContent = original;
      }, 1800);
    });
  });
}

function initToc() {
  const toc = $('[data-toc]');
  if (!toc) return;
  const links = $$('a[href^="#"]', toc);
  const headings = links
    .map((link) => {
      const id = link.getAttribute('href')?.slice(1);
      const heading = id ? document.getElementById(id) : null;
      return heading ? { link, heading } : null;
    })
    .filter(Boolean);

  if (!headings.length) return;

  let ticking = false;
  const update = () => {
    let current = headings[0];
    for (const item of headings) {
      if (item.heading.getBoundingClientRect().top <= 130) current = item;
    }
    links.forEach((link) => link.classList.remove('is-active'));
    current.link.classList.add('is-active');
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  update();
}

function initReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
  );

  items.forEach((item) => {
    item.classList.add('is-armed');
    observer.observe(item);
  });
}

function initYear() {
  $$('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

function init() {
  initNav();
  initSearch();
  initFilters();
  initCopyButtons();
  initCopyLink();
  initToc();
  initReveal();
  initYear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
