/* ==========================================================================
   Casa Alba Kindergarten — script.js
   Vanilla, sin build. Todo funciona sin librerías; GSAP + ScrollTrigger y
   Motion se cargan en diferido (tras `load` + idle) solo para la capa de
   animación. Reparto (ver Design.md §8):
     · GSAP  → scroll: reveals, stagger, parallax, manifiesto, metodología, contadores
     · Motion → UI: press/hover, tabs, acordeón, overlays/sheets (+drag), pasos, popover, toasts
   Nunca animan la misma propiedad del mismo elemento.
   ========================================================================== */
(() => {
  'use strict';

  /* ── Configuración (reemplazar en producción) ───────────────────────── */
  const CONFIG = {
    leadEndpoint: '',                 // p. ej. '/api/lead' (ver DECISIONS.md › FR-01). Vacío = modo demo (localStorage)
    whatsappNumber: '525500000000',   // formato internacional sin "+" (FR-02)
    storageKey: 'casaAlba.leads',
    mapQuery: 'Av. Francisco Sosa, Coyoacán, Ciudad de México',
    brochureUrl: 'assets/docs/folleto-casa-alba.pdf',
    tourMinutes: 45,
    timezone: 'America/Mexico_City',
  };

  /* ── Utilidades ─────────────────────────────────────────────────────── */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const mqMobile = matchMedia('(max-width: 767px)');
  const mqDesktop = matchMedia('(min-width: 992px)');
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mqHover = matchMedia('(hover: hover)');
  const appMain = $('#main');
  const scrollRoot = () => (mqMobile.matches ? appMain : null);
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const pad = (n) => String(n).padStart(2, '0');
  const PROGRAM_LABEL = { prek: 'Pre-Kinder', kinder: 'Kindergarten', after: 'After-School', '': 'Por definir' };

  /* Motion: envoltorio seguro (no-op si no ha cargado o si hay reduced-motion) */
  const motion = () => (!mqReduce.matches && window.Motion ? window.Motion : null);
  function animate(el, keyframes, opts = {}) {
    const M = motion();
    if (!M || !el) return Promise.resolve();
    const a = M.animate(el, keyframes, { duration: 0.32, ease: [0.22, 1, 0.36, 1], ...opts });
    return Promise.resolve(a);
  }

  /* Carga diferida de scripts */
  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.async = true; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  /* Toasts */
  const toastRegion = $('.toast-region');
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>';
    t.append(document.createTextNode(msg));
    toastRegion.append(t);
    animate(t, { opacity: [0, 1], y: [12, 0] });
    setTimeout(() => animate(t, { opacity: 0, y: 8 }, { duration: 0.2 }).then(() => t.remove()), 4000);
  }

  /* ── WhatsApp (FR-02) ───────────────────────────────────────────────── */
  const waUrl = (msg) => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  function initWhatsApp() {
    $$('[data-wa-link]').forEach((a) => {
      a.href = waUrl(a.dataset.waMsg || 'Hola, me gustaría información.');
      a.target = '_blank'; a.rel = 'noopener';
    });
    const root = $('[data-wa]');
    const pop = $('#wa-pop', root);
    const fab = $('[data-wa-toggle]', root);
    const msg = $('#wa-msg', root);
    const send = $('[data-wa-send]', root);
    const sync = () => { send.href = waUrl(msg.value.trim() || msg.defaultValue); };
    sync(); msg.addEventListener('input', sync);

    const open = () => {
      pop.hidden = false; fab.setAttribute('aria-expanded', 'true');
      animate(pop, { opacity: [0, 1], scale: [0.92, 1], y: [8, 0] }, { duration: 0.28 });
      msg.focus();
    };
    const close = (focusFab = true) => {
      if (pop.hidden) return;
      fab.setAttribute('aria-expanded', 'false');
      animate(pop, { opacity: 0, scale: 0.96, y: 6 }, { duration: 0.18 }).then(() => { pop.hidden = true; pop.style.cssText = ''; });
      if (focusFab) fab.focus();
    };
    fab.addEventListener('click', () => (pop.hidden ? open() : close()));
    $('[data-wa-close]', root).addEventListener('click', () => close());
    send.addEventListener('click', () => setTimeout(() => close(false), 100));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) close(); });
    document.addEventListener('pointerdown', (e) => { if (!pop.hidden && !root.contains(e.target)) close(false); });
  }

  /* ── Tabs (FR-03): primarias, subtabs y segmented ───────────────────── */
  function initTabs() {
    $$('[role="tablist"]').forEach((list) => {
      const tabs = $$('[role="tab"]', list);
      const indicator = $('.tabs__indicator', list);
      const moveIndicator = (tab, instant) => {
        if (!indicator) return;
        const x = tab.offsetLeft; const w = tab.offsetWidth;
        if (instant || !motion()) { indicator.style.width = `${w}px`; indicator.style.transform = `translateX(${x}px)`; return; }
        animate(indicator, { x, width: w }, { duration: 0.45, ease: [0.645, 0.045, 0.355, 1] });
      };
      const select = (tab, { focus = false } = {}) => {
        if (tab.getAttribute('aria-selected') === 'true') { if (focus) tab.focus(); return; }
        tabs.forEach((t) => {
          const on = t === tab;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          const panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) panel.hidden = !on;
        });
        const panel = document.getElementById(tab.getAttribute('aria-controls'));
        animate(panel, { opacity: [0, 1], y: [10, 0] }, { duration: 0.4 });
        moveIndicator(tab);
        if (focus) tab.focus();
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      };
      list._select = select;
      tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => select(tab));
        tab.addEventListener('keydown', (e) => {
          const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
          if (!(e.key in map)) return;
          e.preventDefault();
          select(tabs[(map[e.key] + tabs.length) % tabs.length], { focus: true });
        });
      });
      if (indicator) {
        const cur = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
        moveIndicator(cur, true);
        new ResizeObserver(() => moveIndicator(tabs.find((t) => t.getAttribute('aria-selected') === 'true'), true)).observe(list);
      }
    });

    // Enlaces del footer que eligen un programa
    $$('[data-select-program]').forEach((a) => a.addEventListener('click', () => {
      const tab = document.getElementById(`tab-${a.dataset.selectProgram}`);
      tab?.closest('[role="tablist"]')._select(tab);
    }));
  }

  /* ── Acordeón + filtros FAQ ─────────────────────────────────────────── */
  function initAccordion() {
    const root = $('[data-accordion]');
    if (!root) return;
    const toggle = (btn, force) => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const open = force ?? btn.getAttribute('aria-expanded') !== 'true';
      if (open === (btn.getAttribute('aria-expanded') === 'true')) return;
      btn.setAttribute('aria-expanded', String(open));
      if (open) {
        panel.hidden = false;
        const h = panel.scrollHeight;
        animate(panel, { height: [0, h], opacity: [0, 1] }, { duration: 0.35 }).then(() => { panel.style.height = ''; });
      } else {
        animate(panel, { height: [panel.scrollHeight, 0], opacity: [1, 0] }, { duration: 0.25 }).then(() => {
          if (btn.getAttribute('aria-expanded') === 'false') panel.hidden = true;
          panel.style.height = ''; panel.style.opacity = '';
        });
        if (!motion()) panel.hidden = true;
      }
    };
    $$('.accordion__btn', root).forEach((btn) => btn.addEventListener('click', () => toggle(btn)));

    const filters = $$('[data-faq-filter]');
    const empty = $('.faq__empty', root);
    filters.forEach((f) => f.addEventListener('click', () => {
      filters.forEach((x) => x.setAttribute('aria-pressed', String(x === f)));
      const cat = f.dataset.faqFilter;
      let shown = 0;
      $$('.accordion__item', root).forEach((item) => {
        const show = cat === 'all' || item.dataset.cat === cat;
        if (!show) toggle($('.accordion__btn', item), false);
        item.hidden = !show;
        if (show) { shown++; animate(item, { opacity: [0, 1], y: [6, 0] }, { duration: 0.3, delay: shown * 0.03 }); }
      });
      empty.hidden = shown > 0;
    }));
  }

  /* ── Overlays: dialog nativo · modal / drawer / bottom sheet ────────── */
  const overlays = {};
  function initOverlays() {
    $$('dialog.overlay').forEach((dlg) => {
      const name = dlg.id.replace('dlg-', '');
      const panel = $('.overlay__panel, .lightbox', dlg);
      const kind = dlg.classList.contains('overlay--drawer') ? 'drawer' : dlg.classList.contains('overlay--lightbox') ? 'lightbox' : 'modal';
      const state = { dlg, panel, kind, opener: null, closing: false };
      overlays[name] = state;

      dlg.addEventListener('cancel', (e) => { e.preventDefault(); closeOverlay(name); });
      dlg.addEventListener('click', (e) => { if (e.target === dlg) closeOverlay(name); });
      $$('[data-close]', dlg).forEach((b) => b.addEventListener('click', () => closeOverlay(name)));
      if (kind !== 'lightbox') initSheetDrag(name);
    });

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open]');
      if (!trigger) return;
      e.preventDefault();
      const name = trigger.dataset.open;
      const fromDialog = trigger.closest('dialog');
      // Flujos encadenados: desde un éxito/overlay hermano se reemplaza el overlay actual
      if (fromDialog && name !== 'legal') {
        const cur = fromDialog.id.replace('dlg-', '');
        closeOverlay(cur, { restoreFocus: false }).then(() => openOverlay(name, trigger, overlays[cur].opener));
      } else {
        openOverlay(name, trigger);
      }
    });
  }

  function enterKeyframes(kind) {
    if (mqMobile.matches && kind !== 'lightbox') return { y: ['100%', '0%'] };
    if (kind === 'drawer') return { x: ['100%', '0%'] };
    if (kind === 'lightbox') return { opacity: [0, 1] };
    return { opacity: [0, 1], y: [24, 0], scale: [0.98, 1] };
  }

  function openOverlay(name, trigger, openerOverride) {
    const o = overlays[name];
    if (!o || o.dlg.open) return;
    o.opener = openerOverride || trigger || document.activeElement;
    const hooks = OVERLAY_HOOKS[name];
    if (hooks?.beforeOpen && hooks.beforeOpen(trigger, o) === false) return;
    o.dlg.showModal();
    o.panel.style.transform = '';
    animate(o.panel, enterKeyframes(o.kind), { duration: mqMobile.matches ? 0.42 : 0.38, ease: [0.22, 1, 0.36, 1] });
    hooks?.afterOpen?.(trigger, o);
  }

  function closeOverlay(name, { restoreFocus = true } = {}) {
    const o = overlays[name];
    if (!o || !o.dlg.open || o.closing) return Promise.resolve();
    o.closing = true;
    const kf = mqMobile.matches && o.kind !== 'lightbox' ? { y: '100%' } : o.kind === 'drawer' ? { x: '100%' } : { opacity: 0, y: o.kind === 'lightbox' ? 0 : 12, scale: o.kind === 'lightbox' ? 1 : 0.98 };
    return animate(o.panel, kf, { duration: 0.24, ease: [0.645, 0.045, 0.355, 1] }).then(() => {
      o.dlg.close();
      o.panel.style.transform = ''; o.panel.style.opacity = '';
      o.closing = false;
      OVERLAY_HOOKS[name]?.afterClose?.(o);
      if (restoreFocus && o.opener && document.contains(o.opener)) o.opener.focus({ preventScroll: true });
    });
  }

  /* Arrastre para cerrar bottom sheets (móvil) */
  function initSheetDrag(name) {
    const o = overlays[name];
    const handles = $$('.overlay__grabber, .overlay__header', o.panel);
    let startY = 0; let lastY = 0; let lastT = 0; let dy = 0; let dragging = false; let v = 0;
    const onMove = (e) => {
      if (!dragging) return;
      dy = Math.max(0, e.clientY - startY);
      v = (e.clientY - lastY) / Math.max(1, e.timeStamp - lastT);
      lastY = e.clientY; lastT = e.timeStamp;
      o.panel.style.transform = `translateY(${dy}px)`;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      window.removeEventListener('pointermove', onMove);
      if (dy > 120 || v > 0.5) closeOverlay(name);
      else if (motion()) animate(o.panel, { y: [dy, 0] }, { type: 'spring', stiffness: 420, damping: 36 });
      else o.panel.style.transform = '';
    };
    handles.forEach((h) => h.addEventListener('pointerdown', (e) => {
      if (!mqMobile.matches || e.target.closest('button')) return;
      dragging = true; startY = lastY = e.clientY; lastT = e.timeStamp; dy = 0; v = 0;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp, { once: true });
      window.addEventListener('pointercancel', onUp, { once: true });
    }));
  }

  /* ── Validación de formularios ──────────────────────────────────────── */
  const MESSAGES = {
    name: 'Escribe tu nombre completo.',
    phone: 'Escribe un teléfono de al menos 10 dígitos.',
    email: 'Escribe un correo válido, p. ej. nombre@correo.com.',
    childAge: 'Selecciona la edad de tu hija o hijo.',
    date: 'Elige una fecha entre semana a partir de mañana.',
    consent: 'Necesitamos tu consentimiento para tratar los datos.',
    day: 'Elige un día para la visita.',
    time: 'Elige un horario.',
  };
  const isVisible = (el) => !el.closest('[hidden]') && !el.closest('.hp');

  function fieldError(control, msg) {
    const ids = (control.getAttribute('aria-describedby') || '').split(' ');
    const errEl = ids.map((id) => document.getElementById(id)).find((n) => n?.classList.contains('field__error'));
    control.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (errEl) { errEl.textContent = msg || ''; errEl.hidden = !msg; }
  }

  function checkControl(c) {
    if (c.type === 'checkbox') return c.checked ? '' : MESSAGES[c.name];
    const v = c.value.trim();
    if (c.required && !v) return MESSAGES[c.name] || 'Este campo es obligatorio.';
    if (!v) return '';
    if (c.name === 'name' && v.length < 3) return MESSAGES.name;
    if (c.name === 'phone' && v.replace(/\D/g, '').length < 10) return MESSAGES.phone;
    if (c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return MESSAGES.email;
    if (c.type === 'date') {
      const d = new Date(`${v}T12:00:00`);
      const tomorrow = new Date(); tomorrow.setHours(0, 0, 0, 0); tomorrow.setDate(tomorrow.getDate() + 1);
      if (d < tomorrow || d.getDay() === 0 || d.getDay() === 6) return MESSAGES.date;
    }
    return '';
  }

  /* Valida los controles visibles de `scope`. Devuelve true si todo es válido. */
  function validate(scope, form) {
    const controls = $$('input[required], select[required], textarea[required]', scope).filter(isVisible);
    const groupErrors = [];
    // Grupos de radio requeridos (día y horario del tour)
    const radioNames = [...new Set(controls.filter((c) => c.type === 'radio').map((c) => c.name))];
    radioNames.forEach((n) => {
      const ok = $$(`input[name="${n}"]`, scope).some((r) => r.checked);
      const errEl = $(`#t-${n}-err`, scope);
      if (errEl) { errEl.textContent = ok ? '' : MESSAGES[n]; errEl.hidden = ok; }
      if (!ok) groupErrors.push($(`input[name="${n}"]`, scope));
    });
    const invalid = controls.filter((c) => c.type !== 'radio').filter((c) => {
      const msg = checkControl(c); fieldError(c, msg); return !!msg;
    });
    const all = [...groupErrors, ...invalid];
    const summary = $('.form-error-summary', form || scope);
    if (summary) {
      summary.hidden = all.length === 0;
      summary.textContent = all.length === 1 ? 'Revisa el campo marcado.' : `Revisa los ${all.length} campos marcados.`;
    }
    if (all.length) all[0].focus();
    return all.length === 0;
  }

  /* Validación en vivo tras el primer intento */
  function liveValidate(form) {
    form.addEventListener('input', (e) => {
      const c = e.target;
      if (c.getAttribute('aria-invalid') === 'true') fieldError(c, checkControl(c));
      if (c.type === 'radio') { const err = $(`#t-${c.name}-err`, form); if (err) err.hidden = true; }
    });
    form.addEventListener('change', (e) => { const c = e.target; if (c.type === 'checkbox' && c.getAttribute('aria-invalid') === 'true') fieldError(c, checkControl(c)); });
    form.addEventListener('focusout', (e) => {
      const c = e.target;
      if (c.matches?.('input:not([type=radio]):not([type=checkbox]), select, textarea') && c.value && form.dataset.touched) fieldError(c, checkControl(c));
    });
  }

  function setBusy(btn, busy, label) {
    const l = $('.btn__label', btn);
    if (busy) { btn.dataset.label = l.textContent; l.textContent = label || 'Enviando…'; btn.setAttribute('aria-busy', 'true'); }
    else { l.textContent = btn.dataset.label || l.textContent; btn.removeAttribute('aria-busy'); }
  }

  /* ── Envío de leads (FR-01) ─────────────────────────────────────────── */
  async function submitLead(payload) {
    if (payload.website) return { ok: true, spam: true }; // honeypot
    const params = new URLSearchParams(location.search);
    const lead = {
      ...payload,
      createdAt: new Date().toISOString(),
      page: location.pathname,
      utm: ['utm_source', 'utm_medium', 'utm_campaign'].reduce((a, k) => (params.get(k) ? { ...a, [k]: params.get(k) } : a), {}),
    };
    delete lead.website;
    if (CONFIG.leadEndpoint) {
      const r = await fetch(CONFIG.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json().catch(() => ({ ok: true }));
    }
    // Modo demo: se guarda localmente (sin backend). Ver DECISIONS.md
    await wait(700);
    const all = store.get(CONFIG.storageKey, []);
    all.push(lead); store.set(CONFIG.storageKey, all);
    return { ok: true, demo: true };
  }

  const formData = (form) => {
    const fd = new FormData(form); const o = {};
    fd.forEach((v, k) => { o[k] = typeof v === 'string' ? v.trim() : v; });
    o.consent = !!fd.get('consent');
    return o;
  };

  /* Formateadores Intl cacheados (crear uno por llamada es caro en móviles) */
  const DTF = {
    get long() { return (this._l ||= new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })); },
    get dow() { return (this._d ||= new Intl.DateTimeFormat('es-MX', { weekday: 'short' })); },
    get dayMonth() { return (this._m ||= new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' })); },
  };
  function formatDate(iso) {
    if (!iso) return '';
    return DTF.long.format(new Date(`${iso}T12:00:00`));
  }

  function renderSummary(dl, rows) {
    dl.innerHTML = '';
    rows.filter(([, v]) => v).forEach(([k, v]) => {
      const div = document.createElement('div');
      const dt = document.createElement('dt'); dt.textContent = k;
      const dd = document.createElement('dd'); dd.textContent = v;
      div.append(dt, dd); dl.append(div);
    });
  }

  /* Archivo .ics para añadir la visita al calendario */
  function downloadIcs({ date, time, name }) {
    const [h, m] = time.split(':').map(Number);
    const start = `${date.replace(/-/g, '')}T${pad(h)}${pad(m)}00`;
    const endMin = h * 60 + m + CONFIG.tourMinutes;
    const end = `${date.replace(/-/g, '')}T${pad(Math.floor(endMin / 60))}${pad(endMin % 60)}00`;
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Casa Alba//Visitas//ES', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      `UID:${Date.now()}@casa-alba.example`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;TZID=${CONFIG.timezone}:${start}`, `DTEND;TZID=${CONFIG.timezone}:${end}`,
      'SUMMARY:Visita guiada · Casa Alba Kindergarten',
      `DESCRIPTION:Visita guiada solicitada por ${name || 'tu familia'}. Duración ${CONFIG.tourMinutes} min.`,
      `LOCATION:${CONFIG.mapQuery}`, 'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'visita-casa-alba.ics' });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function triggerBrochureDownload() {
    const a = Object.assign(document.createElement('a'), { href: CONFIG.brochureUrl, download: 'folleto-casa-alba.pdf' });
    document.body.append(a); a.click(); a.remove();
  }

  /* ── Formulario en línea de admisiones ──────────────────────────────── */
  function initInlineForm() {
    const form = $('[data-lead-form="inline"]');
    if (!form) return;
    const result = $('[data-result="inline"]');
    const submit = $('.lead-form__submit', form);
    const date = $('#f-date', form);
    date.min = isoDate(nextWeekdays(1)[0]);
    liveValidate(form);

    const applyIntent = () => {
      const intent = $('input[name="intent"]:checked', form).value;
      $$('[data-when-intent]', form).forEach((f) => {
        const on = f.dataset.whenIntent === intent;
        f.hidden = !on;
      });
      $('.btn__label', submit).textContent = intent === 'tour' ? 'Solicitar visita' : intent === 'folleto' ? 'Recibir folleto' : 'Enviar solicitud';
    };
    form.addEventListener('change', (e) => { if (e.target.name === 'intent') applyIntent(); });
    applyIntent();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      form.dataset.touched = '1';
      if (!validate(form, form)) return;
      const data = formData(form);
      setBusy(submit, true);
      try {
        await submitLead({ type: data.intent, source: 'formulario-admisiones', ...data });
        const intentText = {
          tour: `Te esperamos el ${formatDate(data.date)} a las ${data.time}. Te confirmaremos por teléfono o WhatsApp en menos de un día hábil.`,
          folleto: 'La descarga del folleto comenzó y también te lo enviamos por correo.',
          info: 'Una persona del equipo de admisiones te contactará en menos de un día hábil.',
        }[data.intent];
        $('[data-result-text]', result).textContent = intentText;
        renderSummary($('[data-result-summary]', result), [
          ['Nombre', data.name], ['Teléfono', data.phone], ['Correo', data.email],
          ['Edad', data.childAge ? `${data.childAge} años` : ''], ['Programa', PROGRAM_LABEL[data.program || '']],
          ['Visita', data.intent === 'tour' ? `${formatDate(data.date)}, ${data.time}` : ''],
        ]);
        const ics = $('[data-ics]', result);
        ics.hidden = data.intent !== 'tour';
        ics.onclick = () => downloadIcs(data);
        if (data.intent === 'folleto') triggerBrochureDownload();
        form.hidden = true; result.hidden = false;
        animate(result, { opacity: [0, 1], y: [16, 0] }, { duration: 0.45 });
        result.focus();
      } catch {
        const s = $('.form-error-summary', form);
        s.hidden = false; s.textContent = 'No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.';
      } finally { setBusy(submit, false); }
    });

    $('[data-reset-form]', result).addEventListener('click', () => {
      form.reset(); delete form.dataset.touched; applyIntent();
      $$('[aria-invalid]', form).forEach((c) => fieldError(c, ''));
      result.hidden = true; form.hidden = false;
      $('#f-name', form).focus();
    });
  }

  /* ── Tour multi-paso (modal / sheet) ────────────────────────────────── */
  function nextWeekdays(count, from = new Date()) {
    const out = []; const d = new Date(from); d.setHours(12, 0, 0, 0);
    while (out.length < count) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d)); }
    return out;
  }
  const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const tour = { step: 1 };
  function initTour() {
    const dlg = $('#dlg-tour');
    const form = $('form', dlg);
    const track = $('[data-days]', form);
    const steps = $$('[data-step]', form);
    const stepper = $$('.stepper__item', dlg);
    const back = $('[data-step-back]', form);
    const next = $('[data-step-next]', form);
    liveValidate(form);

    // Días disponibles (próximos 15 días hábiles). Se generan al abrir el tour por
    // primera vez: Intl es costoso y no debe competir con la carga inicial.
    const buildDays = () => {
      if (track.childElementCount) return;
      track.innerHTML = nextWeekdays(15).map((d, i) => {
        const dow = DTF.dow.format(d).replace('.', '');
        const day = DTF.dayMonth.format(d).replace('.', '');
        return `<label class="day"><input type="radio" name="day" value="${isoDate(d)}" ${i === 0 ? 'required' : ''}><span class="day__dow">${dow}</span><span class="day__date">${day}</span></label>`;
      }).join('');
    };
    $('[data-days-prev]', form).addEventListener('click', () => track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' }));
    $('[data-days-next]', form).addEventListener('click', () => track.scrollBy({ left: track.clientWidth, behavior: 'smooth' }));
    // Accesibilidad del radiogroup: el error del día se describe en el grupo
    track.setAttribute('aria-describedby', 't-day-err');

    const go = (n) => {
      const prev = tour.step; tour.step = n;
      steps.forEach((s) => { s.hidden = Number(s.dataset.step) !== n; });
      stepper.forEach((li, i) => {
        li.classList.toggle('is-current', i + 1 === n);
        li.classList.toggle('is-done', i + 1 < n);
        if (i + 1 === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      back.hidden = n !== 2;
      next.hidden = n === 3;
      next.closest('.overlay__footer').hidden = n === 3;
      $('.btn__label', next).textContent = n === 1 ? 'Continuar' : 'Confirmar visita';
      $('.form-error-summary', form).hidden = true;
      const cur = steps.find((s) => !s.hidden);
      animate(cur, { opacity: [0, 1], x: [n > prev ? 24 : -24, 0] }, { duration: 0.32 });
      $('.overlay__body', form).scrollTop = 0;
      const first = n === 3 ? cur : $('input:not([type=hidden]):not([tabindex="-1"]), select', cur);
      first?.focus({ preventScroll: true });
    };

    back.addEventListener('click', () => go(1));
    next.addEventListener('click', async () => {
      const cur = steps.find((s) => !s.hidden);
      form.dataset.touched = '1';
      if (!validate(cur, form)) return;
      if (tour.step === 1) return go(2);
      const data = formData(form);
      setBusy(next, true);
      try {
        await submitLead({ type: 'tour', source: 'modal-tour', date: data.day, ...data });
        const s3 = steps[2];
        $('[data-result-text]', s3).textContent = `Te esperamos el ${formatDate(data.day)} a las ${data.time}. Te enviaremos la confirmación a ${data.email}.`;
        renderSummary($('[data-result-summary]', s3), [
          ['Fecha', formatDate(data.day)], ['Hora', data.time], ['Programa', PROGRAM_LABEL[data.program || '']],
          ['Nombre', data.name], ['Edad', `${data.childAge} años`],
        ]);
        $('[data-ics]', s3).onclick = () => downloadIcs({ date: data.day, time: data.time, name: data.name });
        go(3);
      } catch {
        const s = $('.form-error-summary', form);
        s.hidden = false; s.textContent = 'No pudimos registrar tu visita. Inténtalo de nuevo o escríbenos por WhatsApp.';
      } finally { setBusy(next, false); }
    });
    form.addEventListener('submit', (e) => { e.preventDefault(); next.click(); });

    tour.reset = (program) => {
      buildDays();
      form.reset(); delete form.dataset.touched;
      $$('[aria-invalid]', form).forEach((c) => fieldError(c, ''));
      $$('.field__error', form).forEach((e) => { e.hidden = true; });
      if (program !== undefined) $('#t-program', form).value = program;
      track.scrollLeft = 0;
      go(1);
    };
  }

  /* ── Folleto (lead → descarga) ──────────────────────────────────────── */
  function initBrochure() {
    const form = $('[data-lead-form="brochure"]');
    const [s1, s2] = $$('[data-step]', form);
    const footer = $('[data-brochure-footer]', form);
    const submit = $('button[type="submit"]', form);
    liveValidate(form);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      form.dataset.touched = '1';
      if (!validate(s1, form)) return;
      setBusy(submit, true, 'Preparando…');
      try {
        await submitLead({ type: 'folleto', source: 'modal-folleto', ...formData(form) });
        s1.hidden = true; footer.hidden = true; s2.hidden = false;
        animate(s2, { opacity: [0, 1], y: [12, 0] });
        s2.focus();
        triggerBrochureDownload();
      } catch {
        const s = $('.form-error-summary', form); s.hidden = false; s.textContent = 'No pudimos preparar el folleto. Inténtalo de nuevo.';
      } finally { setBusy(submit, false); }
    });
    OVERLAY_HOOKS.brochure = {
      beforeOpen() {
        form.reset(); delete form.dataset.touched;
        $$('[aria-invalid]', form).forEach((c) => fieldError(c, ''));
        $('.form-error-summary', form).hidden = true;
        s1.hidden = false; s2.hidden = true; footer.hidden = false;
      },
      afterOpen() { $('#b-name', form).focus(); },
    };
  }

  /* ── Hooks por overlay ──────────────────────────────────────────────── */
  const STORIES = [
    { title: 'Mariana y Emilio', meta: 'Mamá de Emilio · Kindergarten', quote: '“A la tercera semana ya nos pedía llegar temprano para regar el huerto.”',
      body: ['Emilio llegó a Casa Alba a los cuatro años después de un inicio difícil en otra escuela. Las mañanas eran de llanto y nosotros salíamos con el corazón apretado.', 'Su maestra nos propuso una adaptación gradual y un “trabajo” para él: cuidar las plantas del huerto. Esa responsabilidad lo cambió todo. Hoy cuenta qué sembraron, cuánto creció el jitomate y quién le ayudó.', 'Lo que más agradecemos es que nunca lo apresuraron. Le dieron su tiempo y nos mantuvieron informados cada día.'] },
    { title: 'Jorge y Sofía', meta: 'Papá de Sofía · Pre-Kinder', quote: '“Cada semana sabemos qué exploró y cómo se sintió.”',
      body: ['Sofía es nuestra primera hija y Pre-Kinder fue su primera experiencia fuera de casa. Nos preocupaba no saber qué pasaba durante el día.', 'Cada viernes recibimos una bitácora con fotos y notas de las educadoras: qué materiales eligió, con quién jugó, qué palabras nuevas dijo. Nos ayudó a conversar con ella en casa.', 'Sentimos que somos parte de la comunidad, no solo “papás que dejan y recogen”.'] },
    { title: 'Ana y Valentina', meta: 'Mamá de Valentina · Kindergarten + After-School', quote: '“Llegó a primaria leyendo y, sobre todo, segura de sí misma.”',
      body: ['Valentina estuvo tres años en Casa Alba, de Pre-Kinder a Kinder 3, y por las tardes en After-School.', 'Aprendió a leer sin presión, jugando con letras de lija y cuentos. Pero lo que más notamos en primaria fue su seguridad para levantar la mano, pedir ayuda y hacer amigos.', 'Las tardes de música fueron su lugar favorito: todavía canta las canciones en inglés que aprendió ahí.'] },
  ];

  const LEGAL = {
    privacidad: { title: 'Aviso de privacidad', html: `
      <p><strong>Responsable.</strong> Casa Alba Kindergarten (sitio de demostración), con domicilio en Av. Francisco Sosa, Coyoacán, CDMX, es responsable del tratamiento de tus datos personales.</p>
      <h3>Datos que recabamos</h3>
      <ul><li>De madre, padre o tutor: nombre, teléfono y correo electrónico.</li><li>De la niña o niño: únicamente su edad y el programa de interés.</li></ul>
      <h3>Finalidades</h3>
      <ul><li>Agendar y confirmar visitas guiadas.</li><li>Enviar el folleto de programas y responder dudas de admisión.</li><li>Dar seguimiento al proceso de admisión.</li></ul>
      <p>No vendemos ni compartimos tus datos con terceros para fines comerciales. Los datos de menores se tratan con el consentimiento expreso de quien ejerce la patria potestad o tutela.</p>
      <h3>Derechos ARCO</h3>
      <p>Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos escribiendo a <a href="mailto:privacidad@casa-alba.example">privacidad@casa-alba.example</a>. Responderemos en un máximo de 20 días hábiles.</p>
      <h3>Conservación</h3>
      <p>Los datos de solicitudes que no concluyan en inscripción se eliminan a los 12 meses.</p>` },
    terminos: { title: 'Términos de uso', html: `
      <p>Este sitio es informativo. Los horarios, programas y condiciones pueden cambiar; la información vigente se confirma durante la visita y en el folleto del ciclo escolar.</p>
      <p>Las fotografías son ilustrativas de nuestros espacios y actividades.</p>
      <p>Solicitar una visita o el folleto no implica reserva de lugar ni compromiso de inscripción.</p>` },
    cookies: { title: 'Cookies', html: `
      <p>Este sitio no usa cookies de publicidad ni de rastreo de terceros.</p>
      <p>Solo usamos almacenamiento local del navegador para recordar el envío de formularios en el modo de demostración. El mapa de Google se carga únicamente si pulsas “Cargar mapa interactivo”; en ese momento Google puede establecer sus propias cookies.</p>` },
  };

  const GALLERY = []; // se llena en initGallery()
  const OVERLAY_HOOKS = {
    tour: {
      beforeOpen(trigger) { tour.reset(trigger?.dataset.program ?? (trigger?.closest('#dlg-program') ? $('[data-program-cta]').dataset.program : '')); },
      afterOpen() { $('#t-program').focus({ preventScroll: true }); },
    },
    program: {
      beforeOpen(trigger) {
        const id = trigger.dataset.program;
        const tpl = document.getElementById(`tpl-program-${id}`);
        const body = $('[data-program-body]');
        body.replaceChildren(tpl.content.cloneNode(true));
        $$('[data-clone]', body).forEach((slot) => { const src = $(slot.dataset.clone); if (src) slot.replaceWith(src.cloneNode(true)); });
        $('#program-title').textContent = $(`#tab-${id}`).firstChild.textContent.trim();
        $('[data-program-cta]').dataset.program = id;
        body.scrollTop = 0;
      },
    },
    story: {
      beforeOpen(trigger) { renderStory(Number(trigger.dataset.story)); },
    },
    legal: {
      beforeOpen(trigger) {
        const doc = LEGAL[trigger.dataset.legal] || LEGAL.privacidad;
        $('#legal-title').textContent = doc.title;
        $('[data-legal-body]').innerHTML = doc.html;
      },
    },
    gallery: {
      beforeOpen(trigger) { lightbox.build(); lightbox.pending = Number(trigger.dataset.galleryIndex || 0); },
      afterOpen() { lightbox.go(lightbox.pending, true); $('[data-lb-track]').focus({ preventScroll: true }); },
    },
  };

  let storyIndex = 0;
  function renderStory(i) {
    storyIndex = (i + STORIES.length) % STORIES.length;
    const s = STORIES[storyIndex];
    $('#story-title').textContent = s.title;
    const body = $('[data-story-body]');
    body.innerHTML = '';
    const wrap = document.createElement('div'); wrap.className = 'story';
    wrap.innerHTML = `<p class="stars" role="img" aria-label="5 de 5 estrellas">${'<svg aria-hidden="true"><use href="#i-star"/></svg>'.repeat(5)}</p>`;
    const q = document.createElement('p'); q.className = 'story__quote'; q.textContent = s.quote;
    const meta = document.createElement('p'); meta.className = 'eyebrow'; meta.textContent = s.meta;
    wrap.append(q, meta, ...s.body.map((t) => { const p = document.createElement('p'); p.textContent = t; return p; }));
    body.append(wrap);
    body.scrollTop = 0;
    animate(wrap, { opacity: [0, 1], y: [8, 0] });
  }
  function initStories() {
    $$('[data-story-nav]').forEach((b) => b.addEventListener('click', () => renderStory(storyIndex + Number(b.dataset.storyNav))));
  }

  /* ── Galería (FR-04): mosaico desktop · carrusel móvil · lightbox ───── */
  const IMG_WIDTHS = [480, 800, 1200];
  const pictureHTML = (name, alt, sizes = '100vw') => `<picture><source type="image/avif" srcset="${IMG_WIDTHS.map((w) => `assets/img/${name}-${w}.avif ${w}w`).join(', ')}" sizes="${sizes}"><img src="assets/img/${name}-800.webp" srcset="${IMG_WIDTHS.map((w) => `assets/img/${name}-${w}.webp ${w}w`).join(', ')}" sizes="${sizes}" width="1200" height="848" alt="${alt}" loading="lazy" decoding="async"></picture>`;

  const lightbox = {
    built: false, index: 0, pending: 0,
    build() {
      if (this.built) return;
      const track = $('[data-lb-track]');
      track.innerHTML = GALLERY.map((g, i) => `<li class="lightbox__slide" aria-roledescription="foto" aria-label="${i + 1} de ${GALLERY.length}: ${g.caption}">${pictureHTML(g.name, g.alt, '100vw')}</li>`).join('');
      $('[data-lb-total]').textContent = GALLERY.length;
      const io = new IntersectionObserver((entries) => entries.forEach((en) => {
        if (en.isIntersecting && en.intersectionRatio > 0.6) this.sync($$('.lightbox__slide', track).indexOf(en.target));
      }), { root: track, threshold: [0.6] });
      $$('.lightbox__slide', track).forEach((s) => io.observe(s));
      track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); this.go(this.index + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); this.go(this.index - 1); }
      });
      $$('[data-lb-nav]').forEach((b) => b.addEventListener('click', () => this.go(this.index + Number(b.dataset.lbNav))));
      this.built = true;
    },
    sync(i) {
      this.index = i;
      $('[data-lb-index]').textContent = i + 1;
      $('[data-lb-caption]').textContent = GALLERY[i].caption;
    },
    go(i, instant) {
      const n = (i + GALLERY.length) % GALLERY.length;
      const track = $('[data-lb-track]');
      track.scrollTo({ left: track.clientWidth * n, behavior: instant || mqReduce.matches ? 'auto' : 'smooth' });
      this.sync(n);
    },
  };

  function initGallery() {
    const root = $('[data-gallery]');
    if (!root) return;
    // Fotos del mosaico (nombre de archivo desde el src) + extras de la plantilla
    $$('.gallery__btn', root).forEach((b) => {
      const img = $('img', b);
      GALLERY.push({ name: img.getAttribute('src').match(/img\/(.+)-\d+\.webp/)[1], caption: $('.gallery__caption', b).textContent, alt: img.alt });
    });
    $$('li', $('#tpl-gallery-extra').content).forEach((li) => GALLERY.push({ name: li.dataset.src, caption: li.dataset.caption, alt: li.dataset.alt }));

    $$('[data-gallery-index]', root).forEach((b) => b.addEventListener('click', () => openOverlay('gallery', b)));

    // Contador del carrusel móvil
    const track = $('.gallery__track', root);
    const counter = $('[data-gallery-current]', root);
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) counter.textContent = $$('.gallery__item', track).indexOf(en.target) + 1;
    }), { root: track, threshold: 0.6 });
    $$('.gallery__item', track).forEach((it) => io.observe(it));

    // Hover: zoom sutil de la imagen interna (Motion; GSAP nunca toca estas imágenes)
    $$('.gallery__btn', root).forEach((b) => {
      const img = $('img', b);
      b.addEventListener('pointerenter', () => { if (mqHover.matches) animate(img, { scale: 1.04 }, { duration: 0.6 }); });
      b.addEventListener('pointerleave', () => { if (mqHover.matches) animate(img, { scale: 1 }, { duration: 0.6 }); });
    });
  }

  /* ── Mapa (FR-05) con facade: el iframe solo se carga a petición ────── */
  function initMap() {
    const btn = $('[data-map-load]');
    btn?.addEventListener('click', () => {
      const map = $('[data-map]');
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.mapQuery)}&output=embed`;
      iframe.title = 'Mapa de ubicación de Casa Alba Kindergarten';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      map.append(iframe);
      $('.map__facade', map).remove();
      iframe.focus();
    });
  }

  /* ── Navegación: header, anclas activas y tab bar ───────────────────── */
  function initNav() {
    const topbar = $('[data-topbar]');
    const onScroll = () => topbar.classList.toggle('is-scrolled', (scrollRoot()?.scrollTop ?? window.scrollY) > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    appMain.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const navLinks = $$('[data-nav]');
    const tabItems = $$('[data-tab-target]');
    let io;
    const setActive = (id) => {
      navLinks.forEach((a) => (a.dataset.nav === id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
      const tabId = { metodologia: 'programas', instalaciones: 'programas', testimonios: 'faq' }[id] || id;
      tabItems.forEach((a) => (a.dataset.tabTarget === tabId ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
    };
    const observe = () => {
      io?.disconnect();
      io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.dataset.section); });
      }, { root: scrollRoot(), rootMargin: '-45% 0px -50% 0px' });
      $$('[data-section]').forEach((s) => io.observe(s));
    };
    observe();
    mqMobile.addEventListener('change', observe);

    // En el app shell móvil, los enlaces de ancla desplazan el contenedor interno
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: mqReduce.matches ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', a.getAttribute('href'));
      if (target.id === 'inicio') return;
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  /* ── Vídeo ambiental del hero (solo desktop, sin ahorro de datos) ───── */
  function initHeroVideo() {
    const v = $('.hero__video');
    const toggle = $('[data-video-toggle]');
    const conn = navigator.connection || {};
    if (!v || !mqDesktop.matches || mqReduce.matches || conn.saveData || /(^|-)2g|3g/.test(conn.effectiveType || '')) return;
    v.innerHTML = `<source src="${v.dataset.srcWebm}" type="video/webm"><source src="${v.dataset.srcMp4}" type="video/mp4">`;
    v.load();
    v.addEventListener('playing', () => { v.classList.add('is-ready'); toggle.hidden = false; }, { once: true });
    v.play().catch(() => {});
    toggle.addEventListener('click', () => {
      const paused = v.paused;
      if (paused) v.play(); else v.pause();
      toggle.setAttribute('aria-label', paused ? 'Pausar video de fondo' : 'Reproducir video de fondo');
      $('use', toggle).setAttribute('href', paused ? '#i-pause' : '#i-play');
    });
  }

  /* ── Microinteracciones (Motion) ────────────────────────────────────── */
  function initPress() {
    const SEL = '.btn:not(.btn--link), .choice, .day, .tabbar__item, .wa__fab, .accordion__btn, .gallery__btn';
    document.addEventListener('pointerdown', (e) => {
      const el = e.target.closest(SEL);
      if (!el || !motion()) return;
      animate(el, { scale: 0.97 }, { duration: 0.12 });
      const up = () => animate(el, { scale: 1 }, { type: 'spring', stiffness: 500, damping: 28 });
      el.addEventListener('pointerup', up, { once: true });
      el.addEventListener('pointerleave', up, { once: true });
      el.addEventListener('pointercancel', up, { once: true });
    });
  }

  /* ── Animaciones de scroll (GSAP + ScrollTrigger) ───────────────────── */
  function initScrollAnimations() {
    const { gsap, ScrollTrigger } = window;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // Divide el manifiesto en palabras (una vez; el texto sigue siendo legible por lectores de pantalla)
    const manifesto = $('[data-manifesto]');
    if (manifesto && !manifesto.dataset.split) {
      const text = manifesto.textContent.trim();
      manifesto.innerHTML = `<span class="visually-hidden">${text}</span><span aria-hidden="true">${text.split(/\s+/).map((w) => `<span class="manifesto__word">${w}</span>`).join(' ')}</span>`;
      manifesto.dataset.split = '1';
    }

    mm.add({ mobile: '(max-width: 767px)', desktop: '(min-width: 992px)', reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
      const { mobile, desktop, reduce } = ctx.conditions;
      if (reduce) return;
      const scroller = mobile ? appMain : window;
      ScrollTrigger.defaults({ scroller });
      const viewportBottom = () => (mobile ? appMain.getBoundingClientRect().bottom : window.innerHeight);
      const belowFold = (el) => el.getBoundingClientRect().top > viewportBottom() - 40;

      // Reveals de cabeceras y bloques
      $$('[data-reveal]').filter(belowFold).forEach((el) => {
        gsap.from(el, { y: 32, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
      // Grupos con stagger
      $$('[data-stagger]').filter(belowFold).forEach((group) => {
        gsap.from(group.children, { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: group, start: 'top 85%', once: true } });
      });
      // Reveal de paneles de programa, pasos, protocolos y tarjetas de FAQ
      $$('.program__media, .admissions__form-wrap, .gallery__track').filter(belowFold).forEach((el) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });

      // Contadores de confianza
      $$('[data-count]').forEach((el) => {
        if (!belowFold(el)) return;
        const end = Number(el.dataset.count); const o = { v: 0 };
        el.textContent = '0';
        gsap.to(o, { v: end, duration: 1.4, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v); }, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });

      // Parallax del hero (imagen y vídeo; Motion no los toca)
      if (desktop) {
        gsap.to('.hero__img, .hero__video', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      }

      // Respiro A: parallax cinematográfico
      gsap.fromTo('.breath-a__media', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.breath-a', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from('.breath-a__caption span', { y: 16, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.breath-a', start: 'top 70%', once: true } });

      // Respiro B: las palabras del manifiesto se encienden con el scroll
      gsap.fromTo('.manifesto__word', { opacity: 0.14 }, { opacity: 1, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: '.breath-b', start: 'top 75%', end: 'center 45%', scrub: true } });
      gsap.fromTo('.breath-b__object', { y: 60, rotate: -8 }, { y: -20, rotate: 0, ease: 'none', scrollTrigger: { trigger: '.breath-b', start: 'top bottom', end: 'bottom top', scrub: true } });

      // Metodología: columna fija + cambio de imagen por paso (desktop)
      if (desktop) {
        const method = $('.method');
        const pics = $$('.method__frame picture');
        const bars = $$('.method__progress li');
        const steps = $$('.method__step');
        method.classList.add('method--live');
        const activate = (i) => {
          steps.forEach((s, j) => s.classList.toggle('is-active', j === i));
          bars.forEach((b, j) => b.classList.toggle('is-active', j <= i));
          pics.forEach((p, j) => gsap.to(p, { opacity: j === i ? 1 : 0, duration: 0.6, ease: 'power2.out', overwrite: true }));
        };
        steps.forEach((s, i) => ScrollTrigger.create({ trigger: s, start: 'top center', end: 'bottom center', onToggle: (self) => self.isActive && activate(i) }));
        activate(0);
        return () => { method.classList.remove('method--live'); steps.forEach((s) => s.classList.remove('is-active')); };
      }
      return undefined;
    });
  }

  /* ── Arranque ───────────────────────────────────────────────────────── */
  function init() {
    document.documentElement.classList.add('js');
    initNav();
    initTabs();
    initAccordion();
    initOverlays();
    initTour();
    initBrochure();
    initInlineForm();
    initStories();
    initGallery();
    initMap();
    initWhatsApp();
    initPress();
  }

  // Capa de animación: se carga cuando el navegador está libre (no compite con FCP/LCP)
  function loadMotionLayer() {
    if (mqReduce.matches) return;
    Promise.all([
      loadScript('assets/vendor/gsap.min.js').then(() => loadScript('assets/vendor/ScrollTrigger.min.js')),
      loadScript('assets/vendor/motion.js'),
    ]).then(initScrollAnimations).catch(() => { /* sin animaciones: la página sigue funcionando */ });
  }

  init();
  // Vídeo: en idle tras `load`. Capa de animación: en la primera intención de
  // interacción (scroll, rueda, toque, puntero o teclado). Antes de eso no hay
  // nada que animar y así el hilo principal queda libre durante la carga (TBT ≈ 0).
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
  const onLoad = (fn) => (document.readyState === 'complete' ? fn() : window.addEventListener('load', fn, { once: true }));
  onLoad(() => idle(initHeroVideo, { timeout: 2000 }));
  let layerRequested = false;
  const INTENT = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'pointermove', 'keydown'];
  const requestLayer = () => {
    if (layerRequested) return;
    layerRequested = true;
    INTENT.forEach((ev) => { window.removeEventListener(ev, requestLayer); appMain.removeEventListener(ev, requestLayer); });
    onLoad(() => idle(loadMotionLayer, { timeout: 600 }));
  };
  INTENT.forEach((ev) => { window.addEventListener(ev, requestLayer, { passive: true }); appMain.addEventListener(ev, requestLayer, { passive: true }); });
})();
