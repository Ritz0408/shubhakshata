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

  // The first message the customer sends on WhatsApp. They can edit it before sending.
  // {pack}, {price} and {design} are filled in from what they picked on the page.
  messages: {
    order:
      'Namaskar Shubhakshata!\nI would like to order personalized akshata sachets.\n\n' +
      'Pack: {pack} sachets ({price})\nDesign: {design}\n\n' +
      'Bride & groom names:\nWedding date:\nSticker language (Marathi/English):\nWith or without akshata:',
    general: 'Namaskar Shubhakshata!\nI would like to know more about your personalized akshata sachets.',
  },
};

(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rupee = (n) => '₹' + n.toLocaleString('en-IN');

  /* ---------- WhatsApp links ---------- */
  const message = (key, values = {}) => CONFIG.messages[key].replace(/\{(\w+)\}/g, (m, k) => values[k] ?? m);
  const setWhatsApp = (a, text) => {
    a.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    a.target = '_blank';
    a.rel = 'noopener';
  };

  $$('[data-wa="general"]').forEach((a) => setWhatsApp(a, message('general')));
  $$('[data-phone-text]').forEach((el) => { el.textContent = CONFIG.phoneDisplay; });
  $$('[data-tel]').forEach((a) => { a.href = 'tel:+' + CONFIG.whatsappNumber; });
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Product gallery ---------- */
  const mainImg = $('#gallery-main');
  const thumbs = $$('.thumb');
  function showPhoto(index) {
    const thumb = thumbs[index];
    if (!thumb || thumb.classList.contains('is-active')) return;
    thumbs.forEach((t) => {
      t.classList.toggle('is-active', t === thumb);
      t.setAttribute('aria-pressed', String(t === thumb));
    });
    mainImg.classList.add('is-changing');
    setTimeout(() => {
      mainImg.src = thumb.dataset.src;
      mainImg.alt = thumb.dataset.alt;
      mainImg.classList.remove('is-changing');
    }, reduceMotion ? 0 : 180);
  }
  thumbs.forEach((t, i) => t.addEventListener('click', () => showPhoto(i)));

  /* ---------- Pack & design picker ---------- */
  const selected = (option) => $(`[data-option="${option}"] [aria-checked="true"]`);

  function update() {
    const qty = Number(selected('pack').dataset.qty);
    const price = rupee(qty * CONFIG.sachetPrice);
    $('#price').textContent = price;
    $('#price-for').textContent = `for ${qty.toLocaleString('en-IN')} sachets`;
    const text = message('order', { pack: qty.toLocaleString('en-IN'), price, design: selected('design').dataset.design });
    $$('[data-wa="order"]').forEach((a) => setWhatsApp(a, text));
  }

  $$('[data-option]').forEach((group) => {
    const chips = $$('.chip', group);
    chips.forEach((chip) => chip.addEventListener('click', () => {
      chips.forEach((c) => c.setAttribute('aria-checked', String(c === chip)));
      if (chip.dataset.photo) showPhoto(Number(chip.dataset.photo));
      update();
    }));
    // Arrow keys move between chips, like radio buttons
    group.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const next = chips[(chips.indexOf(document.activeElement) + step + chips.length) % chips.length];
      next.focus();
      next.click();
    });
  });
  update();

  /* ---------- Header shadow on scroll ---------- */
  const header = $('#site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Scroll reveal ---------- */
  $$('.memory-grid').forEach((grid) => {
    [...grid.children].forEach((child, i) => child.style.setProperty('--delay', `${i * 100}ms`));
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
})();
