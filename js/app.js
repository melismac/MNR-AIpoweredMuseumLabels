/* =========================================================
   Esplora il Museo — app.js
   Shared: i18n, TTS (Web Speech API), GA4, cookie consent,
   profile bar, active-link highlighting.
   ========================================================= */

(function () {
  'use strict';

  // ---------- Profile metadata ----------
  const PROFILES = {
    pv: {
      key: 'pv',
      name_it: 'Il Piccolo Visitatore',
      name_en: 'The Young Visitor',
      img: 'img/profiles/altamura_icon.jpeg',
    },
    cu: {
      key: 'cu',
      name_it: 'Il Curioso',
      name_en: 'The Curious',
      img: 'img/profiles/cospiratore_romantico_icon.jpg',
    },
    vi: {
      key: 'vi',
      name_it: 'Il Visionario',
      name_en: 'The Visionary',
      img: 'img/profiles/garibaldi_marsala_icon.jpeg',
    },
    es: {
      key: 'es',
      name_it: "L'Esperto",
      name_en: 'The Expert',
      img: 'img/profiles/cavour_icon.jpeg',
    },
  };
  window.EMU_PROFILES = PROFILES;

  // ---------- Language ----------
  function getLang() {
    return localStorage.getItem('language') || 'it';
  }
  function applyLanguage(lang) {
    document.documentElement.lang = lang === 'en' ? 'en' : 'it';
    document.querySelectorAll('[data-it],[data-en]').forEach((el) => {
      const val = el.getAttribute('data-' + lang);
      if (val === null) return;
      // For elements with data-attr-* we do attr-level too below
      el.innerHTML = val;
    });
    // attr-level translations: data-it-aria / data-en-aria, data-it-alt / data-en-alt, data-it-placeholder / data-en-placeholder
    ['aria-label', 'alt', 'placeholder', 'title'].forEach((attr) => {
      const dataAttrIt = 'data-it-' + attr.replace('aria-', '');
      const dataAttrEn = 'data-en-' + attr.replace('aria-', '');
      document.querySelectorAll('[' + dataAttrIt + '],[' + dataAttrEn + ']').forEach((el) => {
        const v = el.getAttribute('data-' + lang + '-' + attr.replace('aria-', ''));
        if (v) el.setAttribute(attr, v);
      });
    });
    // Update any inline-picker pressed state
    document.querySelectorAll('.lang-inline button[data-lang]').forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    // Stop speech if language changed mid-read
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    resetAllListenButtons();
  }
  function setLanguage(lang, opts) {
    opts = opts || {};
    localStorage.setItem('language', lang);
    applyLanguage(lang);
    if (opts.track !== false) {
      gaEvent('lingua_selezionata', { lingua: lang });
    }
  }
  window.EMU_setLanguage = setLanguage;
  window.EMU_getLang = getLang;

  // ---------- Profile bar (offcanvas) ----------
  function renderProfileBar() {
    const bar = document.querySelector('[data-profile-bar]');
    if (!bar) return;
    const lang = getLang();
    const key = localStorage.getItem('selectedProfile');
    const profile = key && PROFILES[key] ? PROFILES[key] : null;
    const iconEl = bar.querySelector('[data-profile-icon]');
    const nameEl = bar.querySelector('[data-profile-name]');
    const subEl  = bar.querySelector('[data-profile-sub]');
    const labelEl = bar.querySelector('[data-profile-label]');
    if (labelEl) labelEl.textContent = lang === 'en' ? 'Active profile' : 'Profilo attivo';
    if (profile) {
      if (iconEl) iconEl.innerHTML = '<img src="' + profile.img + '" alt="" aria-hidden="true">';
      if (nameEl) nameEl.textContent = lang === 'en' ? profile.name_en : profile.name_it;
      if (subEl)  subEl.textContent  = lang === 'en' ? 'Continue your journey.' : 'Continua il tuo percorso.';
    } else {
      if (iconEl) iconEl.innerHTML = '<span aria-hidden="true">👤</span>';
      if (nameEl) nameEl.textContent = lang === 'en' ? 'No profile selected' : 'Nessun profilo selezionato';
      if (subEl)  subEl.textContent  = lang === 'en' ? 'Pick a profile to begin.' : 'Scegli un profilo per iniziare.';
    }
  }

  // ---------- Active-link highlighting in the offcanvas ----------
  function highlightActiveLinks() {
    const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.offcanvas a[href]').forEach((a) => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (!href || href.startsWith('http')) return;
      const file = href.split('/').pop();
      const isMatch = file === current;
      if (isMatch) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
        // open parent accordion if inside one
        let parent = a.closest('.accordion-collapse');
        if (parent) {
          parent.classList.add('show');
          const btn = document.querySelector('[data-bs-target="#' + parent.id + '"]');
          if (btn) {
            btn.classList.remove('collapsed');
            btn.setAttribute('aria-expanded', 'true');
          }
        }
      }
    });
  }

  // ---------- Text-to-Speech (Web Speech API) ----------
  // TODO: sostituire con ElevenLabs via Netlify Functions per voci più naturali
  const TTS_SUPPORTED = ('speechSynthesis' in window) && ('SpeechSynthesisUtterance' in window);
  let currentUtterance = null;
  let currentButton = null;

  function readText(elementId, button) {
    if (!TTS_SUPPORTED) return;
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.innerText.trim();
    if (!text) return;

    // If already speaking from same button -> stop
    if (window.speechSynthesis.speaking && currentButton === button) {
      window.speechSynthesis.cancel();
      resetButton(button);
      return;
    }
    // Otherwise cancel any previous read and start fresh
    window.speechSynthesis.cancel();
    resetAllListenButtons();

    const lang = getLang();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang === 'en' ? 'en-GB' : 'it-IT';
    utt.rate = 0.9;
    utt.pitch = 1.0;
    utt.onend = () => resetButton(button);
    utt.onerror = () => resetButton(button);
    currentUtterance = utt;
    currentButton = button;
    setButtonSpeaking(button, true);
    window.speechSynthesis.speak(utt);
  }
  function setButtonSpeaking(btn, speaking) {
    if (!btn) return;
    const labelStop_it = '⏹ Stop';
    const labelStop_en = '⏹ Stop';
    const labelPlay_it = '🔊 Ascolta';
    const labelPlay_en = '🔊 Listen';
    const lang = getLang();
    const labelSpan = btn.querySelector('.btn-label');
    if (speaking) {
      btn.classList.add('is-speaking');
      btn.setAttribute('aria-pressed', 'true');
      if (labelSpan) labelSpan.textContent = lang === 'en' ? labelStop_en : labelStop_it;
    } else {
      btn.classList.remove('is-speaking');
      btn.setAttribute('aria-pressed', 'false');
      if (labelSpan) labelSpan.textContent = lang === 'en' ? labelPlay_en : labelPlay_it;
    }
  }
  function resetButton(btn) { setButtonSpeaking(btn, false); }
  function resetAllListenButtons() {
    document.querySelectorAll('.btn-listen').forEach((b) => resetButton(b));
    currentButton = null;
    currentUtterance = null;
  }

  function initListenButtons() {
    document.querySelectorAll('.btn-listen').forEach((btn) => {
      if (!TTS_SUPPORTED) {
        btn.style.display = 'none';
        return;
      }
      const targetId = btn.getAttribute('data-read-target');
      if (!targetId) return;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        readText(targetId, btn);
      });
    });
  }
  window.addEventListener('beforeunload', () => {
    if (TTS_SUPPORTED) window.speechSynthesis.cancel();
  });

  // ---------- Google Analytics 4 ----------
  // Placeholder ID — replace with your real GA4 Measurement ID
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
  let gaLoaded = false;

  function loadGA() {
    if (gaLoaded) return;
    if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
      // still stub dataLayer so events don't throw in dev
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      gaLoaded = true;
      return;
    }
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
    gaLoaded = true;
  }
  function gaEvent(name, params) {
    if (localStorage.getItem('cookieConsent') !== 'accepted') return;
    if (!window.gtag) return;
    window.gtag('event', name, params || {});
  }
  window.EMU_gaEvent = gaEvent;

  // ---------- Cookie consent banner ----------
  function initCookieBanner() {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') {
      loadGA();
      return;
    }
    if (consent === 'rejected') return;

    const lang = getLang();
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    banner.innerHTML = `
      <p id="cookie-banner-title">
        <span data-it="Questo sito usa cookie analitici per migliorare l'esperienza dei visitatori. Nessun dato personale viene raccolto."
              data-en="This site uses analytics cookies to improve the visitor experience. No personal data is collected.">
          ${lang === 'en'
            ? 'This site uses analytics cookies to improve the visitor experience. No personal data is collected.'
            : "Questo sito usa cookie analitici per migliorare l'esperienza dei visitatori. Nessun dato personale viene raccolto."}
        </span>
        <a href="#privacy" data-it="Privacy policy" data-en="Privacy policy" style="margin-left:.3rem;">Privacy policy</a>
      </p>
      <div class="cookie-actions">
        <button type="button" class="btn btn-accept" data-cookie-accept
          data-it="Accetta" data-en="Accept">${lang === 'en' ? 'Accept' : 'Accetta'}</button>
        <button type="button" class="btn btn-reject" data-cookie-reject
          data-it="Rifiuta" data-en="Reject">${lang === 'en' ? 'Reject' : 'Rifiuta'}</button>
      </div>
    `;
    document.body.appendChild(banner);

    const acceptBtn = banner.querySelector('[data-cookie-accept]');
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      loadGA();
      banner.remove();
    });
    banner.querySelector('[data-cookie-reject]').addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'rejected');
      banner.remove();
    });

    // Focus management: move focus to accept button
    setTimeout(() => acceptBtn.focus(), 50);
  }

  // ---------- Botpress — track first user message ----------
  function initBotpressTracking() {
    let tracked = false;
    const tryHook = () => {
      if (tracked) return;
      if (window.botpressWebChat && typeof window.botpressWebChat.onEvent === 'function') {
        try {
          window.botpressWebChat.onEvent(() => {
            if (tracked) return;
            tracked = true;
            gaEvent('chatbot_aperto', {});
          }, ['LIFECYCLE.LOADED', 'UI.OPENED']);
        } catch (e) { /* ignore */ }
      }
    };
    // Retry because Botpress script loads async
    let attempts = 0;
    const iv = setInterval(() => {
      attempts++;
      tryHook();
      if (tracked || attempts > 20) clearInterval(iv);
    }, 1000);
  }

  // ---------- Track sala_visitata on room pages ----------
  function trackSalaIfPresent() {
    const page = document.body;
    const profileKey = page.getAttribute('data-profile');
    const salaIdx = page.getAttribute('data-sala');
    if (profileKey && salaIdx !== null) {
      gaEvent('sala_visitata', { profilo: profileKey, sala: salaIdx });
    }
  }

  // ---------- Public: select profile from home cards ----------
  window.EMU_selectProfile = function (key, href) {
    if (PROFILES[key]) {
      localStorage.setItem('selectedProfile', key);
      gaEvent('profilo_selezionato', { profilo: key });
    }
    if (href) {
      // tiny delay so the GA beacon is sent
      setTimeout(() => { window.location.href = href; }, 80);
      return false;
    }
    return true;
  };

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', () => {
    const lang = getLang();
    applyLanguage(lang);
    renderProfileBar();
    highlightActiveLinks();
    initListenButtons();

    // Inline language picker inside offcanvas
    document.querySelectorAll('.lang-inline button[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setLanguage(btn.getAttribute('data-lang'));
        renderProfileBar();
      });
    });

    initCookieBanner();
    initBotpressTracking();
    // Let GA load first (synchronous in this flow) then fire page event
    setTimeout(trackSalaIfPresent, 200);
  });
})();
