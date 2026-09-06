/**
 * Minimal Mobile Startpage Controller
 * Clean Search, Bangs, and Multi-Theme Switcher
 */

(function() {
  'use strict';

  // ── Clean Up Any Stale Service Workers & Caches ──
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(regs) {
      for (var i = 0; i < regs.length; i++) regs[i].unregister();
    });
  }
  if ('caches' in window) {
    caches.keys().then(function(keys) {
      for (var j = 0; j < keys.length; j++) caches.delete(keys[j]);
    });
  }

  // ── Multi-Theme System ──
  const THEMES = ['crimson', 'matrix', 'cyberpunk', 'solaris', 'abyssal', 'synthwave', 'parchment'];
  const THEME_COLORS = {
    crimson: '#0c0406',
    matrix: '#020b06',
    cyberpunk: '#080911',
    solaris: '#0c0904',
    abyssal: '#030a12',
    synthwave: '#0d0614',
    parchment: '#eae1cd'
  };

  let currentTheme = 'crimson';
  try {
    currentTheme = localStorage.getItem('hiraeth_mobile_theme') || 'crimson';
    if (THEMES.indexOf(currentTheme) < 0) currentTheme = 'crimson';
  } catch(e) {
    currentTheme = 'crimson';
  }

  const themeBtn = document.getElementById('themeBtn');

  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[theme] || '#0c0406');

    if (themeBtn) {
      themeBtn.textContent = theme;
    }

    try {
      localStorage.setItem('hiraeth_mobile_theme', theme);
    } catch(e) {}

    // Notify grid.js to repaint with new theme colors
    document.dispatchEvent(new CustomEvent('themechange'));
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const idx = THEMES.indexOf(currentTheme);
      const nextTheme = THEMES[(idx + 1) % THEMES.length];
      applyTheme(nextTheme);
    });
  }

  // Apply initial theme
  applyTheme(currentTheme);

  // ── Search & Bang Engine ──
  const bangs = {
    '!dd': 'https://duckduckgo.com/?q=',
    '@dd': 'https://duckduckgo.com/?q=',
    '!yt': 'https://www.youtube.com/results?search_query=',
    '@yt': 'https://www.youtube.com/results?search_query=',
    '!rd': 'https://www.reddit.com/search/?q=',
    '@rd': 'https://www.reddit.com/search/?q=',
    '!gh': 'https://github.com/search?q=',
    '@gh': 'https://github.com/search?q=',
    '!fmhy': 'https://fmhy.net/search/?q=',
    '@fmhy': 'https://fmhy.net/search/?q=',
    '!ani': 'https://miruro.to/search?query=',
    '@ani': 'https://miruro.to/search?query='
  };

  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');

  if (input && clearBtn) {
    input.addEventListener('input', () => {
      clearBtn.classList.toggle('active', input.value.length > 0);
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.classList.remove('active');
      input.focus();
    });
  }

  if (form && input) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const raw = input.value.trim();
      if (!raw) return;

      // 1. Direct URL navigation
      const isUrl = /^(https?:\/\/|[a-z0-9-]+\.[a-z]{2,}(\/.*)?$|localhost(:\d+)?)/i.test(raw);
      if (isUrl && !raw.includes(' ')) {
        const target = raw.startsWith('http://') || raw.startsWith('https://') ? raw : 'https://' + raw;
        window.location.href = target;
        return;
      }

      // 2. Bang matching
      for (const [bang, base] of Object.entries(bangs)) {
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
})();
