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
      name_it: 'La Curiosa',
      name_en: 'The Curious',
      img: 'img/profiles/contessa2.jpg',
    },
    vi: {
      key: 'vi',
      name_it: 'Il Visionario',
      name_en: 'The Visionary',
      img: 'img/profiles/garibaldi_marsala_icon.jpeg',
    },
    es: {
      key: 'es',
      name_it: "L'Esperta",
      name_en: 'The Expert',
      img: 'img/profiles/olimpia2.jpg',
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
      el.innerHTML = val;
    });
    ['aria-label', 'alt', 'placeholder', 'title'].forEach((attr) => {
      const dataAttrIt = 'data-it-' + attr.replace('aria-', '');
      const dataAttrEn = 'data-en-' + attr.replace('aria-', '');
      document.querySelectorAll('[' + dataAttrIt + '],[' + dataAttrEn + ']').forEach((el) => {
        const v = el.getAttribute('data-' + lang + '-' + attr.replace('aria-', ''));
        if (v) el.setAttribute(attr, v);
      });
    });
    document.querySelectorAll('.lang-inline button[data-lang]').forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    resetAllListenButtons();
  }
  function setLanguage(lang, opts) {
    opts = opts || {};
    localStorage.setItem('language', lang);
    applyLanguage(lang);
    if (window.EMU_updateMappaLang) window.EMU_updateMappaLang(lang);
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
  const TTS_SUPPORTED = ('speechSynthesis' in window) && ('SpeechSynthesisUtterance' in window);
  let currentUtterance = null;
  let currentButton = null;

  function readText(elementId, button) {
    if (!TTS_SUPPORTED) return;
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.innerText.trim();
    if (!text) return;
    if (window.speechSynthesis.speaking && currentButton === button) {
      window.speechSynthesis.cancel();
      resetButton(button);
      return;
    }
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
    const lang = getLang();
    const labelSpan = btn.querySelector('.btn-label');
    if (speaking) {
      btn.classList.add('is-speaking');
      btn.setAttribute('aria-pressed', 'true');
      if (labelSpan) labelSpan.textContent = '⏹ Stop';
    } else {
      btn.classList.remove('is-speaking');
      btn.setAttribute('aria-pressed', 'false');
      if (labelSpan) labelSpan.textContent = lang === 'en' ? '🔊 Listen' : '🔊 Ascolta';
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
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
  let gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
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

  // ---------- Linea decorativa banner ----------
  function initIntestationLine() {
    const intestation = document.querySelector('.intestation');
    if (!intestation) return;
    const h1 = intestation.querySelector('h1, h2');
    if (!h1) return;
    const wrapper = document.createElement('div');
    wrapper.style.textAlign = 'center';
    h1.parentNode.insertBefore(wrapper, h1);
    wrapper.appendChild(h1);
    const line = document.createElement('div');
    line.classList.add('intestation-line');
    wrapper.appendChild(line);
  }

// ---------- GLightbox ----------
function initGlightbox() {
  if (typeof GLightbox === 'undefined') return;
  document.querySelectorAll('#accordion-media img').forEach((img) => {
    if (img.closest('a')) return;
    const a = document.createElement('a');
    a.href = img.getAttribute('src');
    a.classList.add('glightbox');
    const fig = img.closest('figure');
    const cap = fig ? fig.querySelector('figcaption') : null;
    if (cap) a.setAttribute('data-description', cap.textContent.trim());
    // raggruppa le immagini per carosello → gallerie separate
    const carousel = img.closest('.carousel');
    if (carousel && carousel.id) a.setAttribute('data-gallery', carousel.id);

    // distanzia la didascalia solo per una specifica immagine
    if ((img.getAttribute('src') || '').includes('cannoni')) {
      a.setAttribute('data-glightbox', 'class: gslide-cannoni');
    }

    img.parentNode.insertBefore(a, img);
    a.appendChild(img);
  });
  GLightbox({ selector: '.glightbox', touchNavigation: true, loop: false });
}

  // ---------- Linea del tempo scrollabile ----------
    window.initTimeline = function initTimeline() {
    const timeline = document.querySelector('[data-emu-timeline]');
    if (!timeline) return;
    const scroller = timeline.querySelector('.emu-timeline__scroller');
    const track = timeline.querySelector('.emu-timeline__track');
    const fill = timeline.querySelector('.emu-timeline__fill');
    const counterYear = timeline.querySelector('[data-timeline-year]');
    const counterIndex = timeline.querySelector('[data-timeline-index]');
    const prevBtn = timeline.querySelector('[data-timeline-prev]');
    const nextBtn = timeline.querySelector('[data-timeline-next]');
    if (!scroller || !track || !fill) return;

    const items = Array.from(track.querySelectorAll('.emu-timeline__item'));
    if (!items.length) return;
    const years = items.map((it) => (it.getAttribute('data-year') || '').trim());
    let activeIndex = 0;

    let raf = null;
    function measure() {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      const mid = scroller.scrollLeft + scroller.clientWidth / 2 - (track.offsetLeft || 0);
      let i = 0, best = Infinity;
      items.forEach((c, n) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (d < best) { best = d; i = n; }
      });
      if (scroller.scrollLeft <= 1) i = 0;
      else if (maxScroll > 0 && scroller.scrollLeft >= maxScroll - 1) i = items.length - 1;

      activeIndex = i;
      const active = items[i];
      const w = track.offsetWidth || 1;
      const pct = i === items.length - 1
        ? 100
        : Math.min(100, Math.max(0, ((active.offsetLeft + active.offsetWidth / 2) / w) * 100));
      fill.style.width = pct + '%';
      if (counterYear) counterYear.textContent = years[i] || years[0] || '';
      if (counterIndex) counterIndex.textContent = (i + 1) + ' / ' + items.length;
      if (prevBtn) prevBtn.disabled = i <= 0;
      if (nextBtn) nextBtn.disabled = i >= items.length - 1;
    }
    function goTo(i) {
      i = Math.min(items.length - 1, Math.max(0, i));
      const target = items[i];
      if (!target) return;
      const maxLeft = scroller.scrollWidth - scroller.clientWidth;
      const cardRect = target.getBoundingClientRect();
      const scRect = scroller.getBoundingClientRect();
      const delta = (cardRect.left + cardRect.width / 2) - (scRect.left + scRect.width / 2);
      let left = scroller.scrollLeft + delta;
      left = Math.max(0, Math.min(left, maxLeft));
      scroller.scrollTo({ left: left, behavior: 'smooth' });
    }
    
    function currentIndex() {
      const scRect = scroller.getBoundingClientRect();
      const mid = scRect.left + scRect.width / 2;
      let best = 0, bd = Infinity;
      items.forEach((c, n) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs((r.left + r.width / 2) - mid);
        if (d < bd) { bd = d; best = n; }
      });
      return best;
    }
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex() - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex() + 1));

    scroller.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = null; measure(); });
    });
    window.addEventListener('resize', measure);
    measure();
  }





  // ---------- Cookie consent banner ----------
  function initCookieBanner() {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') { loadGA(); return; }
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
    setTimeout(() => acceptBtn.focus(), 50);
  }

  // ---------- Botpress ----------
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
    let attempts = 0;
    const iv = setInterval(() => {
      attempts++;
      tryHook();
      if (tracked || attempts > 20) clearInterval(iv);
    }, 1000);
  }

  // ---------- Track sala_visitata ----------
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
      setTimeout(() => { window.location.href = href; }, 80);
      return false;
    }
    return true;
  };

  // ---------- Init — UN SOLO DOMContentLoaded ----------
  document.addEventListener('DOMContentLoaded', () => {
    const lang = getLang();
    applyLanguage(lang);
    renderProfileBar();
    highlightActiveLinks();
    initListenButtons();
    initIntestationLine();

    // Language picker
    document.querySelectorAll('.lang-inline button[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setLanguage(btn.getAttribute('data-lang'));
        renderProfileBar();
      });
    });

    initCookieBanner();
    initBotpressTracking();
    setTimeout(trackSalaIfPresent, 200);
    initGlightbox();

    initTimeline();   // ← timeline scrollabile
    initMappa(); // ← mappa Leaflet

    // Aggiorna profilo automaticamente dai link del menu laterale
    document.querySelectorAll('.offcanvas .list-group-item-action[href]').forEach((link) => {
      link.addEventListener('click', () => {
        const href = link.getAttribute('href') || '';
        const match = href.match(/^(pv|cu|vi|es)_/);
        if (match) {
          localStorage.setItem('selectedProfile', match[1]);
        }
      });
    });

  }); // ← unica chiusura DOMContentLoaded


  // Avvio timeline indipendente (immune a errori di altre init)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      try { initTimeline(); } catch (e) { console.error('timeline errore:', e); }
    });
  } else {
    try { initTimeline(); } catch (e) { console.error('timeline errore:', e); }
  }

  // ---------- Mappa (Leaflet) ----------
  window.initMappa = function initMappa() {
    const el = document.getElementById('mappa-sala3');
    if (!el || typeof L === 'undefined' || el.dataset.ready === '1') return;
    el.dataset.ready = '1';

    // I punti del percorso. Per ognuno: coord [lat, lng] e testi in italiano/inglese.
    // img: link a un'immagine ("" se il punto non ha foto). Usa "img/nomefoto.jpg" per i file locali.
    // I punti del percorso. Coordinate da inserire: sostituisci i null con [lat, lng].
    // Per trovarle: tasto destro sul luogo in Google Maps → clic sui numeri in cima al menu.
    const punti = [

      {
        coord: [45.06997408850361, 7.686332604680189], // Museo Risrogimento
        it: { titolo: "Museo Nazionale del Risorgimento Italiano", testo: "Stele del 1706, sala 3 del museo" },
        en: { titolo: "Pietro Micca Museum", testo: "In the entrance hall of the museum." },
        img: "img/room_3/stele.jpg"
      },

      {
        coord: [45.072629079488664, 7.6682845512617055], // Museo Pietro Micca, via Guicciardini 7A, Torino
        it: { titolo: "Museo di Pietro Micca", testo: "Nell'atrio d'ingresso del museo." },
        en: { titolo: "Pietro Micca Museum", testo: "In the entrance hall of the museum." },
        img: "img/cippi/museo_pietro_micca.jpg"
      },
      {
        coord: [45.09591921150852, 7.7103472734943725], // Via Pergolesi 119, Torino — cortile della scuola
        it: { titolo: "Scuole Tecniche San Carlo, via Pergolesi 119", testo: "Nel cortile dell'edificio scolastico." },
        en: { titolo: "School, via Pergolesi 119", testo: "In the courtyard of the school building." },
        img: "img/cippi/pergolesi_119.jpg"
      },
      {
        coord: [45.092391051771166, 7.711867397323956], // Via Gottardo 273, Torino — cortile case popolari
        it: { titolo: "Abitazioni private, via Gottardo", testo: "Nel cortile di abitazioni private." },
        en: { titolo: "Public housing, via Gottardo", testo: "In the courtyard of the public housing." },
        img: "img/cippi/gottardo263.jpg"
      },
      {
        coord: [45.0970951, 7.6363354], // Pianezza -Istituto Bonafous, strada della Pianezza, Torino
        it: { titolo: "Via Pianezza", testo: "Pilastrino inserito nel monumento ai caduti." },
        en: { titolo: "Bonafous Institute", testo: "At the institute, on strada Pianezza." },
        img: "img/cippi/pianezza.jpg"
      },
      {
        coord: [45.07701573981724, 7.679145222089466],// Santuario della Consolata, piazza della Consolata, Torino
        it: { titolo: "Santuario di Maria Consolatrice", testo: "Pilastrino all'interno della cancelalta ovest." },
        en: { titolo: "Church of the Consolata", testo: "In the fenced garden of the church." },
        img: "img/cippi/consolata.jpg"
      },
      {
        coord: [45.094953,7.677880],// Chiesa Nostra Signora della Salute, Borgo Vittoria, Torino
        it: { titolo: "Nostra Signora della Salute", testo: "In Borgo Vittoria. Qui si trovano sei altarini: quattro reggono l'ossario dei caduti nell'assedio del 1706, il quinto è la prima pietra posta nelle fondamenta, il sesto è in un monumento parietale del 1937." },
        en: { titolo: "Our Lady of Health", testo: "In Borgo Vittoria. Six shrines are found here: four support the ossuary of those fallen in the 1706 siege, the fifth is the foundation stone laid in the foundations, the sixth is in a wall monument from 1937." },
        img: "img/cippi/salute2.jpg"
      },
      {
        coord: null, // Via Giachino 92, Torino — murato nella facciata
        it: { titolo: "Case di via Giachino", testo: "Murato nella facciata dell'edificio." },
        en: { titolo: "Houses, via Giachino", testo: "Set into the building's façade." },
        img: ""
      },
      {
        coord: null, // Strada di Lucento, Torino (via intera: scegli il punto esatto dell'altarino)
        it: { titolo: "Strada di Lucento", testo: "Murato in un altarino lungo la strada." },
        en: { titolo: "Strada di Lucento", testo: "Set into a wayside shrine along the road." },
        img: ""
      },
      {
        coord: null, // Via Verolengo, Torino (via intera: scegli il punto esatto dell'altarino)
        it: { titolo: "Via Verolengo", testo: "In un altarino al centro della strada." },
        en: { titolo: "Via Verolengo", testo: "In a shrine at the centre of the road." },
        img: ""
      },

      //{
      //  coord: [45.091405, 7.715459], // Corso Regio Parco / Regio Parco — cortile Manifattura Tabacchi
        //it: { titolo: "Manifattura Tabacchi", testo: "Nel cortile della Manifattura Tabacchi al Regio Parco" },
        //en: { titolo: "Tobacco Manufactory", testo: "In the courtyard of the Tobacco Manufactory at Regio Parco" },
        //img: "",
     // },
    ];

    const map = L.map('mappa-sala3').setView([45.07, 7.68], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 19
    }).addTo(map);

    const markers = [];
    punti.forEach(function (p) {
      const marker = L.marker(p.coord).addTo(map);
      marker._emuData = p; // salvo i dati per aggiornare la lingua al volo
      marker.bindPopup(buildPopup(p, getLang()));
      markers.push(marker);
    });

    if (markers.length) {
      map.fitBounds(L.featureGroup(markers).getBounds(), { padding: [40, 40] });
    }

    // Ricostruisce il contenuto del popup nella lingua richiesta
    function buildPopup(p, lang) {
      const t = (lang === 'en') ? p.en : p.it;
      let c = '';
      if (p.img && p.img.trim() !== '') {
        c += '<img src="' + p.img + '" alt="' + t.titolo + '">';
      }
      c += '<h3>' + t.titolo + '</h3><p>' + t.testo + '</p>';
      return c;
    }

    // Espongo un aggiornatore lingua, richiamabile quando l'utente cambia IT/EN
    window.EMU_updateMappaLang = function (lang) {
      markers.forEach(function (m) {
        m.setPopupContent(buildPopup(m._emuData, lang));
      });
    };

    // Fix per quando la mappa parte in un contenitore non ancora dimensionato
    setTimeout(function () { map.invalidateSize(); }, 300);
  };


})(); // ← chiusura IIFE



