/**
 * Minimal Mobile Startpage Search Controller
 */

(function() {
  'use strict';

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

      // 1. Direct URL check
      const isUrl = /^(https?:\/\/|[a-z0-9-]+\.[a-z]{2,}(\/.*)?$|localhost(:\d+)?)/i.test(raw);
      if (isUrl && !raw.includes(' ')) {
        const target = raw.startsWith('http://') || raw.startsWith('https://') ? raw : 'https://' + raw;
        window.location.href = target;
        return;
      }

      // 2. Bang check
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

  // Register service worker if available
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
})();
