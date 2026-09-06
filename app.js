/**
 * Minimal Mobile Startpage Controller
 * Cat Petting, Box Game & Time-of-Day Meter, Search & Themes
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

  // ── Sleeping Cat Interaction ──
  const catLogo = document.getElementById('catLogo');
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

    catLogo.addEventListener('click', (e) => {
      haptic(20);
      catLogo.classList.remove('pet-bounce');
      void catLogo.offsetWidth;
      catLogo.classList.add('pet-bounce');
      spawnFloatingHeart(e);
    });
  }

  // ── Spot-The-Error Box Game & Time-of-Day Mode ──
  const purrMeter = document.getElementById('purrMeter');
  const meterLabel = document.getElementById('meterLabel');
  const meterScore = document.getElementById('meterScore');

  if (purrMeter) {
    const meterBoxes = Array.from(purrMeter.querySelectorAll('i'));
    const N = meterBoxes.length || 11;
    const ROUND_SIZE = 7;
    const HIT_SCORE = 10;

    let mode = 'game'; // 'game' or 'time'
    let score = 0;
    let best = 0;
    try { best = Number(localStorage.getItem('hiraeth_spot_best') || 0) || 0; } catch (e) {}
    let targetIdx = -1;
    let roundActive = false;
    let roundTimer = null;
    const ROUND_MS = 1500;

    function pad4(n) {
      return String(n).padStart(4, '0');
    }

    function updateHud() {
      if (mode === 'game') {
        if (meterLabel) meterLabel.textContent = 'SPOT THE ERROR';
        if (meterScore) meterScore.textContent = `SCORE ${pad4(score)} (BEST ${pad4(best)})`;
      } else {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const pct = Math.round(((now.getHours() * 60 + now.getMinutes()) / 1440) * 100);
        if (meterLabel) meterLabel.textContent = `TIME ${hh}:${mm}`;
        if (meterScore) meterScore.textContent = `DAY ${pct}%`;
      }
    }

    function shuffledIndices() {
      const idx = Array.from({ length: N }, (_, i) => i);
      for (let i = idx.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [idx[i], idx[j]] = [idx[j], idx[i]];
      }
      return idx;
    }

    function newRound() {
      if (mode !== 'game') return;
      meterBoxes.forEach(box => {
        box.className = '';
      });
      const picks = shuffledIndices().slice(0, ROUND_SIZE);
      targetIdx = picks[Math.floor(Math.random() * picks.length)];
      picks.forEach(i => {
        if (i === targetIdx) {
          meterBoxes[i].classList.add('g-error');
        } else {
          meterBoxes[i].classList.add(Math.random() < 0.5 ? 'g-primary' : 'g-secondary');
        }
      });
      roundActive = true;
      clearTimeout(roundTimer);
      roundTimer = setTimeout(() => {
        if (!roundActive || mode !== 'game') return;
        score = 0;
        updateHud();
        newRound();
      }, ROUND_MS);
    }

    function renderTimeOfDay() {
      if (mode !== 'time') return;
      clearTimeout(roundTimer);
      roundActive = false;
      const now = new Date();
      const totalMinutes = now.getHours() * 60 + now.getMinutes();
      const litCount = Math.round((totalMinutes / 1440) * N);

      meterBoxes.forEach((box, idx) => {
        box.className = '';
        if (idx < litCount) {
          box.classList.add('hour-lit');
        }
      });
      updateHud();
    }

    // Clicking boxes
    meterBoxes.forEach((box, i) => {
      box.addEventListener('click', () => {
        if (mode === 'time') {
          // Tap anywhere to switch back into game mode!
          haptic(15);
          mode = 'game';
          updateHud();
          newRound();
          return;
        }

        if (!roundActive) return;
        if (i === targetIdx) {
          // Success hit
          haptic(25);
          roundActive = false;
          clearTimeout(roundTimer);
          score += HIT_SCORE;
          if (score > best) {
            best = score;
            try { localStorage.setItem('hiraeth_spot_best', String(best)); } catch (e) {}
          }
          box.classList.remove('g-error');
          box.classList.add('g-win');
          updateHud();
          setTimeout(newRound, 400);
        } else if (box.classList.contains('g-primary') || box.classList.contains('g-secondary')) {
          // Miss
          haptic(40);
          score = 0;
          updateHud();
          box.classList.remove('g-miss');
          void box.offsetWidth;
          box.classList.add('g-miss');
        }
      });
    });

    // Toggle mode by tapping the HUD label
    if (meterLabel) {
      meterLabel.addEventListener('click', () => {
        haptic(15);
        if (mode === 'game') {
          mode = 'time';
          renderTimeOfDay();
        } else {
          mode = 'game';
          updateHud();
          newRound();
        }
      });
    }

    updateHud();
    newRound();
  }

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
