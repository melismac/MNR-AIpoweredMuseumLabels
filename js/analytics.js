/**
 * MNR Analytics — js/analytics.js
 * Invia eventi a Google Analytics 4 (G-LKEBQD1D5M).
 *
 * COME USARLO:
 * Aggiungi in ogni pagina HTML dopo <script src="js/app.js"></script>:
 * <script src="js/analytics.js"></script>
 */

(function () {
  'use strict';

  const GA_ID = 'G-LKEBQD1D5M';

  /* ── INIETTA SCRIPT GA4 ── */
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { send_page_view: false });

  /* ── COSTANTI ── */
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

  /* ── CONTESTO PAGINA ──
     Legge data-profile e data-sala dal <body>
     Es: <body data-profile="pv" data-sala="1"> */
  function getCtx() {
    const profile = document.body.dataset.profile || null;
    const sala    = document.body.dataset.sala;
    return {
      profile,
      profileLabel: PROFILE_LABELS[profile] || 'nessuno',
      sala,
      salaLabel:    SALA_LABELS[sala] || (sala !== undefined ? 'Sala ' + sala : null),
      pageKey:      profile && sala !== undefined ? profile + '_sala_' + sala : null
    };
  }

  /* ── TIMER SALA ──
     visibilitychange per mobile (iOS Safari)
     beforeunload come fallback desktop */
  let _enterTime = null;
  let _accumulated = 0;
  let _ctx = null;

  function startTimer() {
    _enterTime = Date.now();
  }

  function pauseTimer() {
    if (!_enterTime) return;
    _accumulated += Date.now() - _enterTime;
    _enterTime = null;
  }

  function sendRoomTime() {
    pauseTimer();
    const seconds = Math.round(_accumulated / 1000);
    if (seconds > 3 && _ctx && _ctx.pageKey) {
      gtag('event', 'room_time', {
        profile_code: _ctx.profile,
        profile_name: _ctx.profileLabel,
        room:         _ctx.salaLabel,
        room_key:     _ctx.pageKey,
        seconds:      seconds
      });
    }
  }

  /* ── INIT ── */
  function init() {
    _ctx = getCtx();

    /* 1. PAGE VIEW con parametri profilo e sala */
    gtag('event', 'page_view', {
      page_title:    document.title,
      page_location: window.location.href,
      profile_code:  _ctx.profile || 'nessuno',
      profile_name:  _ctx.profileLabel,
      room:          _ctx.salaLabel || 'home'
    });

    /* 2. VIEW ROOM (solo sulle pagine sala) */
    if (_ctx.pageKey) {
      gtag('event', 'view_room', {
        profile_code: _ctx.profile,
        profile_name: _ctx.profileLabel,
        room:         _ctx.salaLabel,
        room_key:     _ctx.pageKey
      });
      startTimer();
    }

    /* 3. PROFILO SELEZIONATO (solo su index.html) */
    document.querySelectorAll('[onclick*="EMU_selectProfile"]').forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          const p = localStorage.getItem('mnr_profile');
          if (!p) return;
          gtag('event', 'select_profile', {
            profile_code: p,
            profile_name: PROFILE_LABELS[p] || p
          });
        }, 100);
      });
    });

    /* 4. ACCORDION aperti (solo contenuto, non nav) */
    document.addEventListener('show.bs.collapse', function (e) {
      if (e.target.closest('#profilesAccordion')) return;
      const btn   = document.querySelector('[data-bs-target="#' + e.target.id + '"]');
      const title = btn ? (btn.dataset.it || btn.textContent.trim()) : e.target.id;
      gtag('event', 'open_accordion', {
        profile_code:    _ctx.profile || 'nessuno',
        profile_name:    _ctx.profileLabel,
        room:            _ctx.salaLabel || 'unknown',
        room_key:        _ctx.pageKey  || 'unknown',
        accordion_title: title
      });
    });

    /* 5. BOT Botpress */
    function attachBot() {
      if (!window.botpress) return;
      window.botpress.on('webchat:opened', function () {
        gtag('event', 'open_bot', {
          profile_code: _ctx.profile || 'nessuno',
          profile_name: _ctx.profileLabel,
          room:         _ctx.salaLabel || 'unknown',
          room_key:     _ctx.pageKey  || 'unknown'
        });
      });
    }
    if (document.readyState === 'complete') setTimeout(attachBot, 1500);
    else window.addEventListener('load', () => setTimeout(attachBot, 1500));

    /* 6. TIMER — pausa/ripresa su mobile, invio all'uscita */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pauseTimer();
      else if (_ctx.pageKey) startTimer();
    });
    window.addEventListener('beforeunload', sendRoomTime);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
