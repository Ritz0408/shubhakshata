/* ==========================================================
   Shubhakshata — site script
   ========================================================== */

/* ---- Business settings: update these ---- */
const CONFIG = {
  // WhatsApp number with country code, digits only
  whatsappNumber: '919049873354',
  // How the number is shown on the page
  phoneDisplay: '+91 90498 73354',
  // Used to calculate each pack's price (pack size × this). Not shown on the site.
  sachetPrice: 7,
};

(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rupee = (n) => '₹' + n.toLocaleString('en-IN');
  const waLink = (text) => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;

  /* ---------- Contact links ---------- */
  const generalMsg = 'Namaskar Shubhakshata! I would like to know more about your personalized akshata sachets.';
  $$('[data-wa="general"]').forEach((a) => {
    a.href = waLink(generalMsg);
    a.target = '_blank';
    a.rel = 'noopener';
  });
  $$('[data-phone-text]').forEach((el) => { el.textContent = CONFIG.phoneDisplay; });
  $$('[data-tel]').forEach((a) => { a.href = 'tel:+' + CONFIG.whatsappNumber; });
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header & mobile menu ---------- */
  const header = $('#site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = $('.nav-toggle');
  const setNav = (open) => {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
  $$('.nav-list li').forEach((li, i) => li.style.setProperty('--i', i));
  $$('#main-nav a').forEach((a) => a.addEventListener('click', () => setNav(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });

  // Highlight the nav link for the section in view
  const navLinks = $$('.nav-list a');
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach((a) => {
      const section = $(a.getAttribute('href'));
      if (section) spy.observe(section);
    });
  }

  /* ---------- Scroll reveal ---------- */
  $$('.pack-grid, .memory-list, .design-grid').forEach((grid) => {
    [...grid.children].forEach((child, i) => child.style.setProperty('--delay', `${(i % 3) * 110}ms`));
  });

  const revealEls = $$('.reveal');
  const settle = (el) => el.classList.remove('reveal', 'is-visible');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');
        // Once revealed, hand transitions back to the element's own hover styles
        const done = (ev) => {
          if (ev.target !== el) return;
          settle(el);
          el.removeEventListener('transitionend', done);
        };
        el.addEventListener('transitionend', done);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach(settle);
  }

  /* ---------- Falling akshata in the hero ---------- */
  const rain = $('.akshata-rain');
  if (rain && !reduceMotion) {
    const grainColors = ['#e7b032', '#f6d06a', '#d8402a', '#f2c14e', '#fff1c9', '#c8322a'];
    const petalColors = ['#c1272d', '#f29b1d', '#e8919c'];
    const count = window.innerWidth < 600 ? 16 : 28;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const el = document.createElement('i');
      const petal = i % 6 === 0;
      el.className = petal ? 'grain petal' : 'grain';
      el.style.cssText = [
        `--x:${(Math.random() * 100).toFixed(1)}%`,
        `--s:${(0.7 + Math.random() * 0.8).toFixed(2)}`,
        `--d:${(9 + Math.random() * 10).toFixed(1)}s`,
        `--delay:${(-Math.random() * 18).toFixed(1)}s`,
        `--drift:${Math.round(Math.random() * 80 - 40)}px`,
        `--r:${Math.round(Math.random() * 720 - 360)}deg`,
        `--c:${petal ? petalColors[i % petalColors.length] : grainColors[i % grainColors.length]}`,
      ].join(';');
      frag.appendChild(el);
    }
    rain.appendChild(frag);
  }

  /* ---------- Packs (the pack cards in the HTML are the single list) ---------- */
  const packSelect = $('#pack');
  const packs = $$('.pack[data-qty]').map((el) => {
    const qty = Number(el.dataset.qty);
    const price = qty * CONFIG.sachetPrice;
    $('.pack-price', el).textContent = rupee(price);
    el.setAttribute('aria-label', `${qty} sachets, ${rupee(price)}`);
    packSelect.add(new Option(`${qty.toLocaleString('en-IN')} sachets — ${rupee(price)}`, qty));
    return { el, qty, price };
  });

  /* ---------- Order builder ---------- */
  const form = $('#order-form');
  const design = $('#design');
  const bride = $('#bride');
  const groom = $('#groom');
  const date = $('#date');
  const language = $('#language');
  const details = $('#details');
  const cname = $('#cname');
  const city = $('#city');
  const pv = $('#pv');
  const pvSticker = $('.pv-sticker');
  const pvMessage = $('#pv-message');
  const pvThanks = $('#pv-thanks');
  const pvDate = $('#pv-date');
  const errorBox = $('#form-error');

  // Sample wording on the live preview sticker, by sticker language
  const PREVIEW_TEXT = {
    mr: { message: ['mr', 'आमच्या आनंदात सहभागी होऊन आशीर्वाद दिल्याबद्दल'], thanks: ['mr', 'मनःपूर्वक धन्यवाद!'], bride: 'वधू', groom: 'वर' },
    en: { message: ['en', 'Thank you for being a part of our special day'], thanks: ['en', 'Heartfelt Thanks!'], bride: 'Bride', groom: 'Groom' },
    both: { message: ['en', 'Thank you for being a part of our special day'], thanks: ['mr', 'मनःपूर्वक धन्यवाद!'], bride: 'Bride', groom: 'Groom' },
  };

  const pad = (n) => String(n).padStart(2, '0');
  const today = new Date();
  date.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const selectedPack = () => packs.find((p) => p.qty === Number(packSelect.value)) || packs[0];
  const designOption = () => design.options[design.selectedIndex];
  const formatDate = (value, locale = 'en-IN') => {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  };
  const listJoin = (items) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}` : items[0]);

  function flash() {
    pvSticker.classList.remove('is-flash');
    void pvSticker.offsetWidth;
    pvSticker.classList.add('is-flash');
  }

  function updatePreview() {
    const opt = designOption();
    const lang = language.value.startsWith('Marathi') ? 'mr' : language.value.includes('+') ? 'both' : 'en';
    const text = PREVIEW_TEXT[lang];
    const b = bride.value.trim() || text.bride;
    const g = groom.value.trim() || text.groom;

    pv.dataset.theme = opt.dataset.theme || 'maroon';
    pv.dataset.motif = opt.dataset.motif || 'none';
    $('#pv-bride').textContent = b;
    $('#pv-groom').textContent = g;
    // Shrink long names so both fit on the sticker
    pv.style.setProperty('--nm', Math.max(0.55, Math.min(1, 12 / (b.length + g.length))).toFixed(2));

    [pvMessage.lang, pvMessage.textContent] = text.message;
    [pvThanks.lang, pvThanks.textContent] = text.thanks;
    pvDate.hidden = !date.value;
    pvDate.lang = lang === 'mr' ? 'mr' : 'en';
    pvDate.textContent = date.value ? formatDate(date.value, lang === 'mr' ? 'mr-IN' : 'en-IN') : '';
  }

  function update() {
    const pack = selectedPack();
    updatePreview();
    $('#sum-pack').textContent = `${pack.qty.toLocaleString('en-IN')} sachets`;
    $('#sum-design').textContent = designOption().textContent;
    $('#sum-total').textContent = rupee(pack.price);
    packs.forEach(({ el, qty }) => {
      const on = qty === pack.qty;
      el.classList.toggle('is-selected', on);
      el.setAttribute('aria-pressed', String(on));
      $('.pack-cta', el).textContent = on ? 'Selected' : 'Select';
    });
  }

  function buildMessage() {
    const pack = selectedPack();
    const lines = [
      'Namaskar Shubhakshata!',
      'I would like to order personalized akshata sachets.',
      '',
      `*Pack:* ${pack.qty.toLocaleString('en-IN')} sachets`,
      `*Price:* ${rupee(pack.price)}`,
      `*Design:* ${designOption().textContent}`,
      `*Bride:* ${bride.value.trim()}`,
      `*Groom:* ${groom.value.trim()}`,
      `*Wedding date:* ${date.value ? formatDate(date.value) : 'To be confirmed'}`,
      `*Sticker language:* ${language.value}`,
    ];
    if (details.value.trim()) lines.push(`*Customization:* ${details.value.trim()}`);
    if (cname.value.trim() || city.value.trim()) {
      lines.push('');
      if (cname.value.trim()) lines.push(`Name: ${cname.value.trim()}`);
      if (city.value.trim()) lines.push(`City: ${city.value.trim()}`);
    }
    lines.push('', 'Please share the sticker design and next steps. Thank you!');
    return lines.join('\n');
  }

  form.addEventListener('input', (e) => {
    const t = e.target;
    if (t.classList.contains('is-invalid') && t.value.trim()) t.classList.remove('is-invalid');
    update();
  });
  form.addEventListener('change', (e) => {
    if (e.target === design || e.target === language) flash();
    update();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const missing = [];
    if (!bride.value.trim()) { missing.push("bride's name"); bride.classList.add('is-invalid'); }
    if (!groom.value.trim()) { missing.push("groom's name"); groom.classList.add('is-invalid'); }

    if (missing.length) {
      errorBox.textContent = `Please add the ${listJoin(missing)} to continue.`;
      errorBox.hidden = false;
      const first = $('input.is-invalid', form);
      first.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      first.focus({ preventScroll: true });
      return;
    }

    errorBox.hidden = true;
    const url = waLink(buildMessage());
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url;
  });

  const goToOrder = () => $('#order').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });

  packs.forEach(({ el, qty }) => el.addEventListener('click', () => {
    packSelect.value = qty;
    update();
    flash();
    goToOrder();
  }));

  function pickDesign(value) {
    if (!value || !$(`option[value="${value}"]`, design)) return;
    design.value = value;
    update();
    flash();
    goToOrder();
  }
  $$('[data-pick-design]').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    pickDesign(el.dataset.pickDesign);
  }));

  update();

  /* ---------- Design lightbox ---------- */
  const lb = $('#lightbox');
  const lbImg = $('#lb-img');
  let lbDesign = null;
  $$('.design-media').forEach((btn) => btn.addEventListener('click', () => {
    const card = btn.closest('.design-card');
    lbDesign = card.dataset.design;
    if (typeof lb.showModal !== 'function') {
      pickDesign(lbDesign);
      return;
    }
    const img = $('img', btn);
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    $('#lb-title').textContent = $('h3', card).textContent;
    $('#lb-desc').textContent = $('p', card).textContent;
    lb.showModal();
  }));
  $('.lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  $('#lb-choose').addEventListener('click', () => {
    lb.close();
    pickDesign(lbDesign);
  });
})();
