/**
 * Minimal Mobile Startpage Controller
 * Clean Cat Petting, Time-of-Day Boxes, Themes & Search
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

  function haptic(ms = 12) {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(ms); } catch(e) {}
    }
  }

  // ── Multi-Theme System ──
  const THEMES = ['crimson', 'matrix', 'cyberpunk', 'jade', 'abyssal', 'synthwave', 'parchment'];
  const THEME_COLORS = {
    crimson: '#0c0406',
    matrix: '#020b06',
    cyberpunk: '#080911',
    jade: '#081512',
    abyssal: '#030a12',
    synthwave: '#0d0614',
    parchment: '#eae1cd'
  };

  let currentTheme = 'crimson';
  try {
    const params = new URLSearchParams(window.location.search);
    const qTheme = params.get('theme');
    if (qTheme && THEMES.indexOf(qTheme) >= 0) {
      currentTheme = qTheme;
    } else {
      currentTheme = localStorage.getItem('hiraeth_mobile_theme') || 'crimson';
      if (THEMES.indexOf(currentTheme) < 0) currentTheme = 'crimson';
    }
  } catch(e) {
    currentTheme = 'crimson';
  }

  const themeBtn = document.getElementById('themeBtn');

  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[theme] || '#0c0406');

    if (themeBtn) themeBtn.textContent = theme;

    try { localStorage.setItem('hiraeth_mobile_theme', theme); } catch(e) {}
    document.dispatchEvent(new CustomEvent('themechange'));
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      haptic(15);
      const idx = THEMES.indexOf(currentTheme);
      const nextTheme = THEMES[(idx + 1) % THEMES.length];
      applyTheme(nextTheme);
    });
  }
  applyTheme(currentTheme);

  // ── Sleeping Cat Petting ──
  const catLogo = document.getElementById('catLogo');
  const signalShell = document.querySelector('.signal-shell');
  const kittyState = document.getElementById('kittyState');
  let petTimer = null;

  if (catLogo) {
    const HEARTS = ['♥', '✦', '🐾', 'zzZ', '★'];

    function spawnFloatingHeart(e) {
      const heart = document.createElement('span');
      heart.className = 'pet-heart';
      heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];

      const rect = catLogo.getBoundingClientRect();
      const x = (e && e.clientX) ? (e.clientX - rect.left) : (rect.width * (0.3 + Math.random() * 0.4));
      const y = (e && e.clientY) ? (e.clientY - rect.top) : (rect.height * 0.35);

      heart.style.left = `${Math.max(8, Math.min(rect.width - 25, x))}px`;
      heart.style.top = `${Math.max(8, y)}px`;

      catLogo.appendChild(heart);
      setTimeout(() => heart.remove(), 750);
    }

    function petKitty(e) {
      haptic(20);
      catLogo.classList.remove('pet-bounce');
      void catLogo.offsetWidth;
      catLogo.classList.add('pet-bounce');
      spawnFloatingHeart(e);

      if (kittyState) {
        kittyState.textContent = 'PURRING ♥';
        clearTimeout(petTimer);
        petTimer = setTimeout(() => {
          kittyState.textContent = 'PURRING';
        }, 1800);
      }
    }

    catLogo.addEventListener('click', petKitty);
    if (signalShell) {
      signalShell.addEventListener('click', (e) => {
        if (!e.target.closest('.cat-logo')) {
          petKitty(e);
        }
      });
    }
  }

  // ── Time & Day Progress Boxes (12 Blocks = 2h each) ──
  const kittyTime = document.getElementById('kittyTime');
  const timeMeter = document.getElementById('timeMeter');

  function updateTime() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    
    if (kittyTime) {
      kittyTime.textContent = `${hh}:${mm}`;
    }

    if (timeMeter) {
      const boxes = timeMeter.querySelectorAll('i');
      const totalMinutes = now.getHours() * 60 + now.getMinutes();
      // 1440 min / 12 boxes = 120 min (2 hours per box)
      const litCount = Math.floor(totalMinutes / 120);
      const currentIdx = Math.min(litCount, boxes.length - 1);

      boxes.forEach((box, idx) => {
        box.className = '';
        if (idx < litCount) {
          box.classList.add('lit');
        } else if (idx === currentIdx) {
          box.classList.add('active-now');
        }
      });
    }
  }

  updateTime();
  setInterval(updateTime, 1000);

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
