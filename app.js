/**
 * Hiraeth Mobile Startpage Controller
 * Minimal • Retro 3D Terminal • 100% Fitted • Crimson Default
 */

(function() {
  'use strict';

  const DEFAULTS = [
    { id: '1', name: 'hiraeth', url: 'https://hiraeth-dev.github.io' },
    { id: '2', name: 'github', url: 'https://github.com' },
    { id: '3', name: 'x.com', url: 'https://x.com' },
    { id: '4', name: 'youtube', url: 'https://youtube.com' },
    { id: '5', name: 'reddit', url: 'https://reddit.com' },
    { id: '6', name: 'miruro', url: 'https://miruro.to' },
    { id: '7', name: 'fmhy', url: 'https://fmhy.net' },
    { id: '8', name: 'hacker news', url: 'https://news.ycombinator.com' }
  ];

  const BANGS = {
    '!g': 'https://www.google.com/search?q=',
    '!dd': 'https://duckduckgo.com/?q=',
    '!yt': 'https://www.youtube.com/results?search_query=',
    '!gh': 'https://github.com/search?q=',
    '!rd': 'https://www.reddit.com/search/?q=',
    '!ani': 'https://miruro.to/search?query=',
    '!fmhy': 'https://fmhy.net/search/?q='
  };

  const THEMES = ['crimson', 'parchment', 'cyberpunk', 'solaris', 'synthwave'];
  const THEME_COLORS = {
    crimson: '#0c0406',
    parchment: '#eae1cd',
    cyberpunk: '#090a10',
    solaris: '#0c0a06',
    synthwave: '#0c0614'
  };

  let state = {
    shortcuts: [],
    theme: 'crimson',
    editMode: false,
    editingId: null
  };

  function loadState() {
    try {
      const savedSc = localStorage.getItem('hiraeth_mobile_shortcuts');
      state.shortcuts = savedSc ? JSON.parse(savedSc) : DEFAULTS.slice();
      state.theme = localStorage.getItem('hiraeth_mobile_theme') || 'crimson';
    } catch(e) {
      state.shortcuts = DEFAULTS.slice();
      state.theme = 'crimson';
    }
  }

  function saveShortcuts() {
    try {
      localStorage.setItem('hiraeth_mobile_shortcuts', JSON.stringify(state.shortcuts));
    } catch(e) {}
  }

  // ── Theme Switcher ──
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[theme] || '#0c0406');
    try { localStorage.setItem('hiraeth_mobile_theme', theme); } catch(e) {}

    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.textContent = `[${theme}]`;

    document.dispatchEvent(new CustomEvent('themechange'));
  }

  function cycleTheme() {
    const idx = THEMES.indexOf(state.theme);
    const nextTheme = THEMES[(idx + 1) % THEMES.length];
    applyTheme(nextTheme);
  }

  // ── Clock & Date ──
  function updateClock() {
    const clockEl = document.getElementById('terminalClock');
    const dateEl = document.getElementById('terminalDate');
    if (!clockEl) return;

    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    clockEl.innerHTML = `${h}<span class="colon">:</span>${m}`;

    if (dateEl) {
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      dateEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
    }
  }

  // ── Speed Dial Shortcuts Rendering ──
  function renderShortcuts() {
    const grid = document.getElementById('shortcutsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    state.shortcuts.forEach((sc, idx) => {
      const a = document.createElement('a');
      a.className = 'speed-link';
      a.href = sc.url;
      a.dataset.id = sc.id;

      const numStr = String(idx + 1).padStart(2, '0');
      a.innerHTML = `
        <span class="link-num">${numStr}</span>
        <span class="link-label">${escapeHtml(sc.name)}</span>
        <button type="button" class="del-btn" title="Delete" aria-label="Delete">×</button>
      `;

      a.addEventListener('click', e => {
        if (e.target.closest('.del-btn')) {
          e.preventDefault();
          e.stopPropagation();
          deleteShortcut(sc.id);
          return;
        }
        if (state.editMode) {
          e.preventDefault();
          openModal(sc);
        }
      });

      grid.appendChild(a);
    });
  }

  function deleteShortcut(id) {
    state.shortcuts = state.shortcuts.filter(s => s.id !== id);
    saveShortcuts();
    renderShortcuts();
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Search & Bang Engine ──
  function setupSearch() {
    const form = document.getElementById('dictSearchForm');
    const input = document.getElementById('dictInput');
    const clearBtn = document.getElementById('dictClear');
    const bangPills = document.querySelectorAll('.bang-pill');

    if (!form || !input) return;

    input.addEventListener('input', () => {
      if (clearBtn) clearBtn.classList.toggle('active', input.value.length > 0);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.classList.remove('active');
        input.focus();
      });
    }

    bangPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const bang = pill.dataset.bang;
        if (input.value.startsWith(bang)) {
          form.dispatchEvent(new Event('submit'));
        } else {
          input.value = bang + ' ';
          input.focus();
          if (clearBtn) clearBtn.classList.add('active');
        }
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const raw = input.value.trim();
      if (!raw) return;

      // 1. Direct URL detection
      const isUrl = /^(https?:\/\/|[a-z0-9-]+\.[a-z]{2,}(\/.*)?$|localhost(:\d+)?)/i.test(raw);
      if (isUrl && !raw.includes(' ')) {
        const target = raw.startsWith('http://') || raw.startsWith('https://') ? raw : 'https://' + raw;
        window.location.href = target;
        return;
      }

      // 2. Bang detection
      for (const [bang, base] of Object.entries(BANGS)) {
        if (raw === bang) {
          window.location.href = base.split('?')[0].split('/search')[0];
          return;
        }
        if (raw.startsWith(bang + ' ')) {
          const q = raw.slice(bang.length).trim();
          window.location.href = base + encodeURIComponent(q);
          return;
        }
      }

      // 3. Fallback: Google
      window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(raw);
    });
  }

  // ── Modal Handling ──
  function openModal(shortcut = null) {
    const modal = document.getElementById('shortcutModal');
    const title = document.getElementById('modalTitle');
    const nameIn = document.getElementById('modalNameInput');
    const urlIn = document.getElementById('modalUrlInput');

    if (!modal) return;
    if (shortcut) {
      state.editingId = shortcut.id;
      if (title) title.textContent = 'EDIT SHORTCUT';
      if (nameIn) nameIn.value = shortcut.name;
      if (urlIn) urlIn.value = shortcut.url;
    } else {
      state.editingId = null;
      if (title) title.textContent = 'ADD SHORTCUT';
      if (nameIn) nameIn.value = '';
      if (urlIn) urlIn.value = '';
    }

    modal.classList.add('open');
    if (nameIn) setTimeout(() => nameIn.focus(), 100);
  }

  function closeModal() {
    const modal = document.getElementById('shortcutModal');
    if (modal) modal.classList.remove('open');
    state.editingId = null;
  }

  function setupModalEvents() {
    const modal = document.getElementById('shortcutModal');
    const form = document.getElementById('modalForm');
    const cancelBtn = document.getElementById('modalCancelBtn');

    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
      });
    }

    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('modalNameInput').value.trim();
        let url = document.getElementById('modalUrlInput').value.trim();
        if (!name || !url) return;

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }

        if (state.editingId) {
          const sc = state.shortcuts.find(s => s.id === state.editingId);
          if (sc) {
            sc.name = name;
            sc.url = url;
          }
        } else {
          state.shortcuts.push({
            id: 'sc-' + Date.now(),
            name,
            url
          });
        }

        saveShortcuts();
        renderShortcuts();
        closeModal();
      });
    }
  }

  // ── Controls Setup ──
  function setupControls() {
    document.getElementById('themeToggleBtn')?.addEventListener('click', cycleTheme);

    const editBtn = document.getElementById('footerEditBtn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        state.editMode = !state.editMode;
        document.getElementById('shortcutsGrid')?.classList.toggle('edit-mode', state.editMode);
        editBtn.classList.toggle('active', state.editMode);
        editBtn.textContent = state.editMode ? '[done]' : '[edit]';
      });
    }

    document.getElementById('footerAddBtn')?.addEventListener('click', () => {
      openModal(null);
    });

    document.getElementById('footerResetBtn')?.addEventListener('click', () => {
      if (confirm('Reset shortcuts to hiraeth defaults?')) {
        state.shortcuts = DEFAULTS.slice();
        saveShortcuts();
        renderShortcuts();
      }
    });
  }

  // ── Init ──
  function init() {
    loadState();
    applyTheme(state.theme);
    updateClock();
    setInterval(updateClock, 1000);
    renderShortcuts();
    setupSearch();
    setupControls();
    setupModalEvents();

    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
