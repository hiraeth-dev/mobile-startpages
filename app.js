/**
 * Aether Mobile Startpage — App Controller
 * Pure Vanilla JS, Zero External Dependencies, Offline-First
 */

(function() {
  'use strict';

  // ── SVGs Dictionary (100% Vector, No Emojis) ──
  const ICONS = {
    hiraeth: '<svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    github: '<svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    reddit: '<svg viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>',
    miruro: '<svg viewBox="0 0 24 24"><path d="M21 3H3C1.895 3 1 3.895 1 5v12c0 1.105.895 2 2 2h6l-2 3h10l-2-3h6c1.105 0 2-.895 2-2V5c0-1.105-.895-2-2-2zm0 14H3V5h18v12zm-11-2l6-4-6-4v8z"/></svg>',
    fmhy: '<svg viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5zm14-1.5V4H6.5a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5H18zM8 8h8v2H8V8zm0 4h5v2H8v-2z"/></svg>',
    hackernews: '<svg viewBox="0 0 24 24"><path d="M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.874v-5.064l4.113-7.708h-2.056l-2.994 5.922-3.008-5.922H6.951z"/></svg>',
    claude: '<svg viewBox="0 0 24 24"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/></svg>',
    wikipedia: '<svg viewBox="0 0 24 24"><path d="M12.09 13.047L8.682 3.6h2.247l2.25 6.963 2.193-6.963h2.179l-4.184 12.35h-1.277zm-6.685-9.447L.95 16.5h2.164l1.096-3.238h4.437l.488 1.458.74-2.188-3.076-8.932H5.405zm.18 7.37l1.458-4.321 1.458 4.321H5.585zm12.33-7.37l-2.73 8.1 1.459 4.301h2.164L23.25 3.6h-5.335z"/></svg>',
    spotify: '<svg viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>',
    twitch: '<svg viewBox="0 0 24 24"><path d="M2.149 0L.537 4.119v16.036h5.313V24h3.882l3.822-3.845h4.949L23.463 15V0H2.149zm19.349 13.91l-3.374 3.375h-5.448l-3.045 3.045v-3.045H5.852V2.149h15.646v11.761zm-4.329-6.358h-2.179v6.522h2.179V7.552zm-5.761 0H9.229v6.522h2.179V7.552z"/></svg>',
    globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    code: '<svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
  };

  // ── Default Curated Shortcuts ──
  const DEFAULT_SHORTCUTS = [
    { id: 'sc-1', name: 'Hiraeth', url: 'https://hiraeth-dev.github.io', category: 'favs', icon: 'hiraeth' },
    { id: 'sc-2', name: 'GitHub', url: 'https://github.com', category: 'favs', icon: 'github' },
    { id: 'sc-3', name: 'X / Twitter', url: 'https://x.com', category: 'media', icon: 'x' },
    { id: 'sc-4', name: 'YouTube', url: 'https://youtube.com', category: 'favs', icon: 'youtube' },
    { id: 'sc-5', name: 'Reddit', url: 'https://reddit.com', category: 'media', icon: 'reddit' },
    { id: 'sc-6', name: 'Miruro', url: 'https://miruro.to', category: 'favs', icon: 'miruro' },
    { id: 'sc-7', name: 'FMHY', url: 'https://fmhy.net', category: 'tools', icon: 'fmhy' },
    { id: 'sc-8', name: 'Hacker News', url: 'https://news.ycombinator.com', category: 'dev', icon: 'hackernews' },
    { id: 'sc-9', name: 'Claude', url: 'https://claude.ai', category: 'dev', icon: 'claude' },
    { id: 'sc-10', name: 'Spotify', url: 'https://open.spotify.com', category: 'media', icon: 'spotify' },
    { id: 'sc-11', name: 'Wikipedia', url: 'https://wikipedia.org', category: 'tools', icon: 'wikipedia' },
    { id: 'sc-12', name: 'Twitch', url: 'https://twitch.tv', category: 'media', icon: 'twitch' }
  ];

  // ── Search Engines & Bangs ──
  const ENGINES = {
    google: { name: 'Google', url: 'https://www.google.com/search?q=', bang: '!g' },
    duckduckgo: { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', bang: '!dd' },
    startpage: { name: 'Startpage', url: 'https://www.startpage.com/sp/search?query=', bang: '!s' },
    youtube: { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=', bang: '!yt' },
    reddit: { name: 'Reddit', url: 'https://www.reddit.com/search/?q=', bang: '!rd' },
    github: { name: 'GitHub', url: 'https://github.com/search?q=', bang: '!gh' },
    fmhy: { name: 'FMHY', url: 'https://fmhy.net/search/?q=', bang: '!fmhy' },
    miruro: { name: 'Miruro Anime', url: 'https://miruro.to/search?query=', bang: '!ani' },
    wikipedia: { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Special:Search?search=', bang: '!w' }
  };

  const THEME_COLORS = {
    oled: '#000000',
    cyber: '#070714',
    crimson: '#0c0406',
    emerald: '#020b08',
    parchment: '#f8f4ec'
  };

  // ── State Management ──
  let state = {
    shortcuts: [],
    theme: 'oled',
    engine: 'google',
    activeCategory: 'all',
    editMode: false,
    use24h: true,
    notes: '',
    editingShortcutId: null
  };

  function loadState() {
    try {
      const savedSc = localStorage.getItem('aether_shortcuts');
      state.shortcuts = savedSc ? JSON.parse(savedSc) : DEFAULT_SHORTCUTS.slice();

      state.theme = localStorage.getItem('aether_theme') || 'oled';
      state.engine = localStorage.getItem('aether_engine') || 'google';
      state.use24h = localStorage.getItem('aether_24h') !== 'false';
      state.notes = localStorage.getItem('aether_notes') || '';
    } catch(e) {
      state.shortcuts = DEFAULT_SHORTCUTS.slice();
    }
  }

  function saveShortcuts() {
    try {
      localStorage.setItem('aether_shortcuts', JSON.stringify(state.shortcuts));
    } catch(e) {}
  }

  function haptic(ms = 12) {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(ms); } catch(e) {}
    }
  }

  // ── Theme Switcher ──
  function applyTheme(themeId) {
    state.theme = themeId;
    document.documentElement.setAttribute('data-theme', themeId);
    try {
      localStorage.setItem('aether_theme', themeId);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', THEME_COLORS[themeId] || '#000000');
    } catch(e) {}

    // Update active highlight in theme sheet
    document.querySelectorAll('.theme-card-option').forEach(el => {
      el.classList.toggle('active', el.dataset.theme === themeId);
    });
  }

  // ── Clock & Date ──
  function updateClock() {
    const clockEl = document.getElementById('clockDigits');
    const periodEl = document.getElementById('clockPeriod');
    const dateEl = document.getElementById('dateDisplay');
    const greetingEl = document.getElementById('greetingText');
    if (!clockEl) return;

    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let period = '';

    if (!state.use24h) {
      period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
    }
    const hStr = String(hours).padStart(2, '0');

    clockEl.innerHTML = `${hStr}<span class="time-colon">:</span>${minutes}`;
    if (periodEl) {
      periodEl.textContent = period;
      periodEl.style.display = period ? 'inline' : 'none';
    }

    // Date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (dateEl) {
      dateEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
    }

    // Dynamic greeting
    if (greetingEl) {
      const realHour = now.getHours();
      let greeting = 'Hello, traveler';
      if (realHour >= 5 && realHour < 12) greeting = 'Good morning';
      else if (realHour >= 12 && realHour < 17) greeting = 'Good afternoon';
      else if (realHour >= 17 && realHour < 22) greeting = 'Good evening';
      else greeting = 'Night session';
      greetingEl.textContent = greeting;
    }
  }

  // ── Real-Time Weather ──
  function initWeather() {
    const weatherChip = document.getElementById('weatherChip');
    if (!weatherChip) return;

    const cachedWeather = localStorage.getItem('aether_weather');
    const cachedTime = localStorage.getItem('aether_weather_time');
    if (cachedWeather && cachedTime && (Date.now() - parseInt(cachedTime, 10) < 1800000)) {
      renderWeather(JSON.parse(cachedWeather));
      return;
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(28.61, 77.20) // Default capital fallback
      );
    } else {
      fetchWeather(28.61, 77.20);
    }
  }

  function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.current_weather) {
          const w = {
            temp: Math.round(data.current_weather.temperature),
            code: data.current_weather.weathercode
          };
          localStorage.setItem('aether_weather', JSON.stringify(w));
          localStorage.setItem('aether_weather_time', Date.now().toString());
          renderWeather(w);
        }
      })
      .catch(() => {
        renderWeather({ temp: 24, code: 0 });
      });
  }

  function renderWeather(w) {
    const chip = document.getElementById('weatherChip');
    if (!chip) return;
    let label = 'Clear';
    if (w.code > 0 && w.code <= 3) label = 'Cloudy';
    else if (w.code >= 51 && w.code <= 67) label = 'Rain';
    else if (w.code >= 71 && w.code <= 86) label = 'Snow';
    else if (w.code >= 95) label = 'Storm';

    chip.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
      </svg>
      <span>${w.temp}°C • ${label}</span>
    `;
  }

  // ── Battery Status ──
  function initBattery() {
    const chip = document.getElementById('batteryChip');
    if (!chip) return;

    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        function updateBat() {
          const level = Math.round(battery.level * 100);
          const charging = battery.charging;
          chip.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="6" width="18" height="12" rx="2"></rect>
              <line x1="23" y1="10" x2="23" y2="14"></line>
            </svg>
            <span>${charging ? '⚡' : ''}${level}%</span>
          `;
        }
        updateBat();
        battery.addEventListener('levelchange', updateBat);
        battery.addEventListener('chargingchange', updateBat);
      }).catch(() => {
        chip.style.display = 'none';
      });
    } else {
      chip.style.display = 'none';
    }
  }

  // ── Shortcuts Grid Rendering ──
  function renderShortcuts() {
    const grid = document.getElementById('shortcutsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const filtered = state.shortcuts.filter(sc => {
      if (state.activeCategory === 'all') return true;
      if (state.activeCategory === 'favs') return sc.category === 'favs';
      return sc.category === state.activeCategory;
    });

    filtered.forEach(sc => {
      const card = document.createElement('div');
      card.className = 'shortcut-card';
      card.dataset.id = sc.id;

      let hostname = '';
      try { hostname = new URL(sc.url).hostname.replace(/^www\./, ''); } catch(e) { hostname = sc.url; }

      const iconSvg = ICONS[sc.icon] || ICONS.globe;

      card.innerHTML = `
        <div class="shortcut-icon-wrap">${iconSvg}</div>
        <div class="shortcut-info">
          <span class="shortcut-name">${escapeHtml(sc.name)}</span>
          <span class="shortcut-domain">${escapeHtml(hostname)}</span>
        </div>
        <button type="button" class="shortcut-delete-btn" title="Delete shortcut" aria-label="Delete">
          <svg viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;

      // Click handler: if in edit mode, open edit modal; otherwise navigate
      card.addEventListener('click', e => {
        if (e.target.closest('.shortcut-delete-btn')) {
          e.stopPropagation();
          haptic(20);
          deleteShortcut(sc.id);
          return;
        }

        haptic(10);
        if (state.editMode) {
          e.preventDefault();
          openShortcutModal(sc);
        } else {
          window.location.href = sc.url;
        }
      });

      grid.appendChild(card);
    });

    // Add Shortcut Card
    const addCard = document.createElement('div');
    addCard.className = 'shortcut-card add-card';
    addCard.innerHTML = `
      <div class="shortcut-icon-wrap" style="color:var(--fg-dim)">${ICONS.plus}</div>
      <div class="shortcut-info">
        <span class="shortcut-name">Add New</span>
        <span class="shortcut-domain">Shortcut</span>
      </div>
    `;
    addCard.addEventListener('click', () => {
      haptic(15);
      openShortcutModal(null);
    });
    grid.appendChild(addCard);
  }

  function deleteShortcut(id) {
    state.shortcuts = state.shortcuts.filter(sc => sc.id !== id);
    saveShortcuts();
    renderShortcuts();
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Search & Bang Processing ──
  function setupSearch() {
    const form = document.getElementById('searchForm');
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    const engineBtn = document.getElementById('engineToggleBtn');
    const bangChips = document.querySelectorAll('.bang-chip');

    if (!form || !input) return;

    // Clear button toggle
    input.addEventListener('input', () => {
      if (clearBtn) clearBtn.classList.toggle('active', input.value.length > 0);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.classList.remove('active');
        input.focus();
        haptic(10);
      });
    }

    // Engine toggle on search icon tap (cycles active default)
    if (engineBtn) {
      engineBtn.addEventListener('click', () => {
        haptic(15);
        cycleEngine();
      });
    }

    // Bang chips tap
    bangChips.forEach(chip => {
      chip.addEventListener('click', () => {
        haptic(12);
        const bang = chip.dataset.bang;
        if (input.value.startsWith(bang)) {
          // already selected, trigger search
          form.dispatchEvent(new Event('submit'));
        } else {
          input.value = bang + ' ';
          input.focus();
          if (clearBtn) clearBtn.classList.add('active');
        }
      });
    });

    // Submit handler
    form.addEventListener('submit', e => {
      e.preventDefault();
      const raw = input.value.trim();
      if (!raw) return;

      haptic(15);

      // 1. Check if direct URL
      const isUrl = /^(https?:\/\/|[a-z0-9-]+\.[a-z]{2,}(\/.*)?$|localhost(:\d+)?)/i.test(raw);
      if (isUrl && !raw.includes(' ')) {
        const target = raw.startsWith('http://') || raw.startsWith('https://') ? raw : 'https://' + raw;
        window.location.href = target;
        return;
      }

      // 2. Check for Bang prefix
      for (const [key, conf] of Object.entries(ENGINES)) {
        if (raw === conf.bang) {
          // typing '!gh' opens GitHub directly
          const rootUrl = conf.url.split('?')[0].split('/search')[0];
          window.location.href = rootUrl;
          return;
        }
        if (raw.startsWith(conf.bang + ' ')) {
          const query = raw.slice(conf.bang.length).trim();
          window.location.href = conf.url + encodeURIComponent(query);
          return;
        }
      }

      // 3. Fall back to current default engine
      const engineConf = ENGINES[state.engine] || ENGINES.google;
      window.location.href = engineConf.url + encodeURIComponent(raw);
    });
  }

  function cycleEngine() {
    const keys = Object.keys(ENGINES);
    const currIdx = keys.indexOf(state.engine);
    const nextKey = keys[(currIdx + 1) % keys.length];
    state.engine = nextKey;
    try { localStorage.setItem('aether_engine', nextKey); } catch(e) {}
    updateEngineUI();
  }

  function updateEngineUI() {
    const btn = document.getElementById('engineToggleBtn');
    const input = document.getElementById('searchInput');
    const conf = ENGINES[state.engine] || ENGINES.google;

    if (btn) {
      btn.title = `Engine: ${conf.name} (Tap to switch)`;
      // Select appropriate icon
      let icon = ICONS.globe;
      if (state.engine === 'github') icon = ICONS.github;
      else if (state.engine === 'youtube') icon = ICONS.youtube;
      else if (state.engine === 'reddit') icon = ICONS.reddit;
      btn.innerHTML = icon;
    }

    if (input) {
      input.placeholder = `Search with ${conf.name} or type URL…`;
    }

    // Update settings dropdown
    const select = document.getElementById('defaultEngineSelect');
    if (select) select.value = state.engine;
  }

  // ── Category Tabs ──
  function setupCategories() {
    const pills = document.querySelectorAll('.category-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        haptic(10);
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.activeCategory = pill.dataset.category;
        renderShortcuts();
      });
    });
  }

  // ── Scratchpad Notes ──
  function setupNotes() {
    const textarea = document.getElementById('notesTextarea');
    const copyBtn = document.getElementById('copyNotesBtn');
    const clearBtn = document.getElementById('clearNotesBtn');
    const countEl = document.getElementById('notesCharCount');

    if (!textarea) return;

    textarea.value = state.notes;
    updateNotesCount();

    textarea.addEventListener('input', () => {
      state.notes = textarea.value;
      try { localStorage.setItem('aether_notes', state.notes); } catch(e) {}
      updateNotesCount();
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        haptic(15);
        if (!textarea.value) return;
        navigator.clipboard.writeText(textarea.value).then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => copyBtn.textContent = originalText, 1500);
        });
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        haptic(20);
        if (confirm('Clear scratchpad notes?')) {
          textarea.value = '';
          state.notes = '';
          try { localStorage.removeItem('aether_notes'); } catch(e) {}
          updateNotesCount();
        }
      });
    }

    function updateNotesCount() {
      if (countEl) {
        const len = textarea.value.length;
        countEl.textContent = `${len} char${len === 1 ? '' : 's'}`;
      }
    }
  }

  // ── Add/Edit Shortcut Modal ──
  function openShortcutModal(shortcut) {
    const modal = document.getElementById('shortcutModal');
    const titleEl = document.getElementById('shortcutModalTitle');
    const nameInput = document.getElementById('scNameInput');
    const urlInput = document.getElementById('scUrlInput');
    const catSelect = document.getElementById('scCategorySelect');
    const iconSelect = document.getElementById('scIconSelect');

    if (!modal) return;

    if (shortcut) {
      state.editingShortcutId = shortcut.id;
      if (titleEl) titleEl.textContent = 'Edit Shortcut';
      if (nameInput) nameInput.value = shortcut.name;
      if (urlInput) urlInput.value = shortcut.url;
      if (catSelect) catSelect.value = shortcut.category || 'all';
      if (iconSelect) iconSelect.value = shortcut.icon || 'globe';
    } else {
      state.editingShortcutId = null;
      if (titleEl) titleEl.textContent = 'Add Shortcut';
      if (nameInput) nameInput.value = '';
      if (urlInput) urlInput.value = '';
      if (catSelect) catSelect.value = 'favs';
      if (iconSelect) iconSelect.value = 'globe';
    }

    modal.classList.add('open');
    if (nameInput) setTimeout(() => nameInput.focus(), 150);
  }

  function closeShortcutModal() {
    const modal = document.getElementById('shortcutModal');
    if (modal) modal.classList.remove('open');
    state.editingShortcutId = null;
  }

  function setupShortcutForm() {
    const form = document.getElementById('shortcutForm');
    const closeBtn = document.getElementById('closeShortcutModal');
    const modal = document.getElementById('shortcutModal');

    if (closeBtn) closeBtn.addEventListener('click', closeShortcutModal);
    if (modal) {
      modal.addEventListener('click', e => {
        if (e.target === modal) closeShortcutModal();
      });
    }

    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        haptic(15);
        const name = document.getElementById('scNameInput').value.trim();
        let url = document.getElementById('scUrlInput').value.trim();
        const category = document.getElementById('scCategorySelect').value;
        const icon = document.getElementById('scIconSelect').value;

        if (!name || !url) return;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }

        if (state.editingShortcutId) {
          const sc = state.shortcuts.find(s => s.id === state.editingShortcutId);
          if (sc) {
            sc.name = name;
            sc.url = url;
            sc.category = category;
            sc.icon = icon;
          }
        } else {
          state.shortcuts.push({
            id: 'sc-' + Date.now(),
            name,
            url,
            category,
            icon
          });
        }

        saveShortcuts();
        renderShortcuts();
        closeShortcutModal();
      });
    }
  }

  // ── Settings & Themes Modals ──
  function setupModals() {
    const themeModal = document.getElementById('themeModal');
    const settingsModal = document.getElementById('settingsModal');

    // Dock buttons
    document.getElementById('dockHomeBtn')?.addEventListener('click', () => {
      haptic(10);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('dockNotesBtn')?.addEventListener('click', () => {
      haptic(12);
      const drawer = document.getElementById('notesDrawer');
      if (drawer) {
        drawer.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('notesTextarea')?.focus();
      }
    });

    document.getElementById('dockThemesBtn')?.addEventListener('click', () => {
      haptic(15);
      themeModal?.classList.add('open');
    });

    document.getElementById('dockSettingsBtn')?.addEventListener('click', () => {
      haptic(15);
      settingsModal?.classList.add('open');
    });

    // Close buttons
    document.getElementById('closeThemeModal')?.addEventListener('click', () => {
      themeModal?.classList.remove('open');
    });
    document.getElementById('closeSettingsModal')?.addEventListener('click', () => {
      settingsModal?.classList.remove('open');
    });

    [themeModal, settingsModal].forEach(m => {
      m?.addEventListener('click', e => {
        if (e.target === m) m.classList.remove('open');
      });
    });

    // Theme options click
    document.querySelectorAll('.theme-card-option').forEach(card => {
      card.addEventListener('click', () => {
        haptic(15);
        applyTheme(card.dataset.theme);
      });
    });

    // Edit mode toggle
    const editToggle = document.getElementById('editToggleBtn');
    if (editToggle) {
      editToggle.addEventListener('click', () => {
        haptic(20);
        state.editMode = !state.editMode;
        document.getElementById('shortcutsGrid')?.classList.toggle('edit-mode', state.editMode);
        editToggle.classList.toggle('active', state.editMode);
        editToggle.querySelector('.edit-text').textContent = state.editMode ? 'Done' : 'Edit';
      });
    }

    // 24h Toggle
    const clockToggle = document.getElementById('clock24Toggle');
    if (clockToggle) {
      clockToggle.checked = state.use24h;
      clockToggle.addEventListener('change', () => {
        haptic(10);
        state.use24h = clockToggle.checked;
        try { localStorage.setItem('aether_24h', state.use24h.toString()); } catch(e) {}
        updateClock();
      });
    }

    // Default Engine Select
    const engineSelect = document.getElementById('defaultEngineSelect');
    if (engineSelect) {
      engineSelect.value = state.engine;
      engineSelect.addEventListener('change', () => {
        haptic(10);
        state.engine = engineSelect.value;
        try { localStorage.setItem('aether_engine', state.engine); } catch(e) {}
        updateEngineUI();
      });
    }

    // Export JSON
    document.getElementById('exportJsonBtn')?.addEventListener('click', () => {
      haptic(15);
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.shortcuts, null, 2));
      const a = document.createElement('a');
      a.setAttribute('href', dataStr);
      a.setAttribute('download', `aether-shortcuts-${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(a);
      a.click();
      a.remove();
    });

    // Import JSON
    const importInput = document.getElementById('importJsonInput');
    document.getElementById('importJsonBtn')?.addEventListener('click', () => {
      haptic(15);
      importInput?.click();
    });

    if (importInput) {
      importInput.addEventListener('change', e => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          try {
            const imported = JSON.parse(ev.target.result);
            if (Array.isArray(imported)) {
              state.shortcuts = imported;
              saveShortcuts();
              renderShortcuts();
              alert('Shortcuts successfully imported!');
            }
          } catch(err) {
            alert('Invalid JSON file format.');
          }
        };
        reader.readAsText(file);
      });
    }

    // Reset Defaults
    document.getElementById('resetDefaultsBtn')?.addEventListener('click', () => {
      haptic(25);
      if (confirm('Reset all shortcuts to original defaults?')) {
        state.shortcuts = DEFAULT_SHORTCUTS.slice();
        saveShortcuts();
        renderShortcuts();
        alert('Reset to default shortcuts complete.');
      }
    });
  }

  // ── Ambient Background Motion ──
  function setupAmbientMotion() {
    const blobs = document.querySelectorAll('.ambient-blob');
    if (!blobs.length) return;

    let targetX = 0;
    let targetY = 0;

    window.addEventListener('pointermove', e => {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      targetX = nx * 35;
      targetY = ny * 35;
      blobs.forEach((blob, idx) => {
        const factor = (idx + 1) * 0.7;
        blob.style.transform = `translate(${targetX * factor}px, ${targetY * factor}px)`;
      });
    }, { passive: true });
  }

  // ── App Init ──
  function init() {
    loadState();
    applyTheme(state.theme);
    updateEngineUI();
    renderShortcuts();
    updateClock();
    setInterval(updateClock, 1000);
    initWeather();
    initBattery();
    setupSearch();
    setupCategories();
    setupNotes();
    setupShortcutForm();
    setupModals();
    setupAmbientMotion();

    // Register Service Worker for PWA
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
