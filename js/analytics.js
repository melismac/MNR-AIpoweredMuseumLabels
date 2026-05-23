/**
 * MNR Analytics — js/analytics.js
 * Traccia: profilo, sale visitate, tempo per sala, accordion aperti, bot attivato.
 * Salva in localStorage (dashboard locale) E invia a Google Analytics 4.
 *
 * COME USARLO:
 *   Includi questo script in TUTTE le pagine HTML, DOPO bootstrap e app.js:
 *   <script src="js/analytics.js"></script>
 *
 *   Nelle pagine HTML aggiungi anche lo snippet GA4 nel <head>:
 *   (già incluso automaticamente da questo file, non serve aggiungerlo a mano)
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     CONFIG
  ───────────────────────────────────────────── */
  const GA_ID       = 'G-LKEBQD1D5M';
  const STORAGE_KEY = 'mnr_analytics';
  const SESSION_KEY = 'mnr_session_id';

  /* ─────────────────────────────────────────────
     INIETTA SCRIPT GA4 (se non già presente)
  ───────────────────────────────────────────── */
  function injectGA() {
    if (window.gtag) return; // già caricato
    const s1 = document.createElement('script');
    s1.async = true;
    s1.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s1);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, {
      // Non inviare page_view automatico — lo mandiamo noi con i parametri giusti
      send_page_view: false
    });
  }

  /* ─────────────────────────────────────────────
     INVIA EVENTO GA4
  ───────────────────────────────────────────── */
  function gaEvent(name, params) {
    if (typeof gtag === 'function') {
      gtag('event', name, params || {});
    }
  }

  /* ─────────────────────────────────────────────
     UTILITY localStorage
  ───────────────────────────────────────────── */
  function uuid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { sessions: [] };
    } catch (_) {
      return { sessions: [] };
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  /* ─────────────────────────────────────────────
     SESSIONE
  ───────────────────────────────────────────── */
  function getOrCreateSession() {
    let sid = sessionStorage.getItem(SESSION_KEY);
    const data = load();

    if (!sid) {
      sid = uuid();
      sessionStorage.setItem(SESSION_KEY, sid);
      data.sessions.push({
        id: sid,
        startedAt: new Date().toISOString(),
        profile: localStorage.getItem('mnr_profile') || null,
        rooms: {},
        accordions: [],
        botActivations: []
      });
      save(data);
    }

    return sid;
  }

  function updateSession(sid, mutate) {
    const data = load();
    const idx = data.sessions.findIndex(s => s.id === sid);
    if (idx === -1) return;
    mutate(data.sessions[idx]);
    save(data);
  }

  /* ─────────────────────────────────────────────
     CONTESTO PAGINA
  ───────────────────────────────────────────── */
  const PROFILE_LABELS = {
    pv: 'Piccolo Visitatore',
    cu: 'Il Curioso',
    vi: 'Il Visionario',
    es: "L'Esperto"
  };

  const SALA_LABELS = {
    '0': 'Introduzione',
    '1': 'Sala 1',
    '2': 'Sala 2',
    '3': 'Sala 3'
  };

  function getPageContext() {
    const body    = document.body;
    const profile = body.dataset.profile || null;
    const sala    = body.dataset.sala;
    const pageKey = profile && sala !== undefined
      ? `${profile}_sala_${sala}`
      : null;
    const profileLabel = PROFILE_LABELS[profile] || profile || 'nessuno';
    const salaLabel    = SALA_LABELS[sala]        || (sala !== undefined ? 'Sala ' + sala : null);
    return { profile, sala, pageKey, profileLabel, salaLabel };
  }

  /* ─────────────────────────────────────────────
     1. PROFILO SELEZIONATO
  ───────────────────────────────────────────── */
  function trackProfileSelection(sid) {
    const profile = localStorage.getItem('mnr_profile');
    if (!profile) return;
    updateSession(sid, s => {
      if (s.profile !== profile) {
        s.profile = profile;
        s.profileSelectedAt = new Date().toISOString();
      }
    });
  }

  function watchProfileButtons(sid) {
    document.querySelectorAll('[onclick*="EMU_selectProfile"]').forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          const profile = localStorage.getItem('mnr_profile');
          if (!profile) return;

          // localStorage
          updateSession(sid, s => {
            s.profile = profile;
            s.profileSelectedAt = new Date().toISOString();
          });

          // GA4
          gaEvent('select_profile', {
            profile_code:  profile,
            profile_name:  PROFILE_LABELS[profile] || profile
          });

        }, 100);
      });
    });
  }

  /* ─────────────────────────────────────────────
     2. SALE VISITATE + TEMPO
     Usiamo sia visibilitychange (affidabile su mobile
     iOS/Android) che beforeunload (desktop), salvando
     il tempo parziale ogni volta che la pagina va in
     background così non si perde nulla.
  ───────────────────────────────────────────── */
  let _roomEnterTime   = null;
  let _currentPageKey  = null;
  let _accumulatedMs   = 0;   // tempo già salvato in questa visita (per i rientri da background)

  function trackRoomEntry(sid, ctx) {
    if (!ctx.pageKey) return;
    _roomEnterTime  = Date.now();
    _currentPageKey = ctx.pageKey;
    _accumulatedMs  = 0;

    // localStorage
    updateSession(sid, s => {
      if (!s.rooms[ctx.pageKey]) {
        s.rooms[ctx.pageKey] = {
          visits: 0,
          totalMs: 0,
          firstVisit: new Date().toISOString()
        };
      }
      s.rooms[ctx.pageKey].visits  += 1;
      s.rooms[ctx.pageKey].lastVisit = new Date().toISOString();
    });

    // GA4 — page_view con parametri custom
    gaEvent('page_view', {
      page_title:    document.title,
      page_location: window.location.href,
      profile_code:  ctx.profile  || 'nessuno',
      profile_name:  ctx.profileLabel,
      room:          ctx.salaLabel || 'home'
    });

    // GA4 — evento dedicato sala
    if (ctx.pageKey) {
      gaEvent('view_room', {
        profile_code: ctx.profile,
        profile_name: ctx.profileLabel,
        room:         ctx.salaLabel,
        room_key:     ctx.pageKey
      });
    }
  }

  // Salva il tempo trascorso finora (senza azzerare il timer — l'utente potrebbe tornare)
  function flushRoomTime(sid, pageKey, ctx) {
    if (!pageKey || !_roomEnterTime) return;
    const elapsed = Date.now() - _roomEnterTime;
    _accumulatedMs += elapsed;
    _roomEnterTime = null;   // pausa — ripartirà al rientro

    updateSession(sid, s => {
      if (s.rooms[pageKey]) {
        s.rooms[pageKey].totalMs = (s.rooms[pageKey].totalMs || 0) + elapsed;
      }
    });
  }

  // Chiamato all'uscita definitiva dalla pagina
  function trackRoomExit(sid, pageKey, ctx) {
    flushRoomTime(sid, pageKey, ctx);

    const seconds = Math.round(_accumulatedMs / 1000);

    // GA4 — inviamo il totale accumulato (anche dopo rientri da background)
    if (seconds > 3 && ctx && ctx.pageKey) {
      gaEvent('room_time', {
        profile_code: ctx.profile,
        profile_name: ctx.profileLabel,
        room:         ctx.salaLabel,
        room_key:     ctx.pageKey,
        seconds:      seconds
      });
    }
  }

  // Gestisce app in background/foreground su mobile (iOS Safari incluso)
  function watchVisibility(sid, ctx) {
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        // L'utente ha cambiato tab o app — salviamo il tempo parziale
        flushRoomTime(sid, _currentPageKey, ctx);
      } else {
        // L'utente è tornato — riprendiamo il timer
        if (_currentPageKey) {
          _roomEnterTime = Date.now();
        }
      }
    });
  }

  /* ─────────────────────────────────────────────
     3. ACCORDION
  ───────────────────────────────────────────── */
  function watchAccordions(sid, ctx) {
    document.addEventListener('show.bs.collapse', function (e) {
      const panelId = e.target.id;
      const btn     = document.querySelector(`[data-bs-target="#${panelId}"]`);
      const title   = btn
        ? (btn.dataset.it || btn.textContent.trim())
        : panelId;

      // Ignora accordion di navigazione
      if (e.target.closest('#profilesAccordion')) return;

      // localStorage
      updateSession(sid, s => {
        s.accordions.push({
          sala:     ctx.pageKey || 'unknown',
          title:    title,
          openedAt: new Date().toISOString()
        });
      });

      // GA4
      gaEvent('open_accordion', {
        profile_code:    ctx.profile    || 'nessuno',
        profile_name:    ctx.profileLabel,
        room:            ctx.salaLabel  || 'unknown',
        room_key:        ctx.pageKey    || 'unknown',
        accordion_title: title
      });
    });
  }

  /* ─────────────────────────────────────────────
     4. BOT BOTPRESS
  ───────────────────────────────────────────── */
  function watchBot(sid, ctx) {
    function attachBotListener() {
      if (!window.botpress) return;
      window.botpress.on('webchat:opened', function () {
        // localStorage
        updateSession(sid, s => {
          s.botActivations.push({
            sala:     ctx.pageKey || 'unknown',
            openedAt: new Date().toISOString()
          });
        });

        // GA4
        gaEvent('open_bot', {
          profile_code: ctx.profile   || 'nessuno',
          profile_name: ctx.profileLabel,
          room:         ctx.salaLabel || 'unknown',
          room_key:     ctx.pageKey   || 'unknown'
        });
      });
    }

    if (document.readyState === 'complete') {
      setTimeout(attachBotListener, 1500);
    } else {
      window.addEventListener('load', () => setTimeout(attachBotListener, 1500));
    }
  }

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
  function init() {
    injectGA();

    const sid = getOrCreateSession();
    const ctx = getPageContext();

    trackProfileSelection(sid);
    watchProfileButtons(sid);
    trackRoomEntry(sid, ctx);

    // visibilitychange: affidabile su mobile (iOS Safari, Android Chrome)
    watchVisibility(sid, ctx);

    window.addEventListener('beforeunload', () => {
      trackRoomExit(sid, _currentPageKey, ctx);
    });

    watchAccordions(sid, ctx);
    watchBot(sid, ctx);

    console.log('[MNR Analytics] Tracking attivo', { sid, pageKey: ctx.pageKey, GA: GA_ID });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // API pubblica per debug e dashboard locale
  window.MNR_Analytics = {
    getData:    function () { return load(); },
    clearData:  function () {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      console.log('[MNR Analytics] Dati cancellati.');
    },
    exportJSON: function () {
      const blob = new Blob([JSON.stringify(load(), null, 2)], { type: 'application/json' });
      const a    = document.createElement('a');
      a.href     = URL.createObjectURL(blob);
      a.download = 'mnr_analytics_' + new Date().toISOString().slice(0, 10) + '.json';
      a.click();
    }
  };

})();
