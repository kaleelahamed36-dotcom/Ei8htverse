/* ==========================================================
   ei8htverse — script.js
   Vanilla JavaScript. No build step. Works with Live Server.

   WHAT WORKS LOCALLY (browser only):
     catalogue, search, filters, product pages, cart, wishlist,
     checkout forms, demo admin panel, prototype order preview.
   WHAT NEEDS A BACKEND (prepared, but NOT active):
     secure login, shared database, image hosting, real payments,
     payment verification, email + WhatsApp notifications.
   ========================================================== */
'use strict';

/* ==========================================================
   1. CONFIGURATION  (edit this section)
   Never put real secrets (API secrets, tokens, SMTP passwords) here.
   Anything in this file is visible to every visitor.
   ========================================================== */
const CONFIG = {
  brandName: 'ei8htverse',                         // always written exactly like this
  tagline: 'Little details. Your kind of magic.',  // placeholder copy, change freely
  logoPath: 'assets/ei8htverse-logo.png',          // save your logo here (see README steps)
  announcement: 'Welcome to ei8htverse · Handmade pipe cleaner crafts, charms & little luxuries',

  // Brand palette (the CSS file is the real source, these are used for generated artwork)
  palette: {
    softPink: '#FDE6EC', dustyPink: '#F8C9D6', blushPink: '#E7A8BD', rose: '#C87593',
    cherryMaroon: '#7A2749', lightIvory: '#FFF7FA', warmBeige: '#F3DADA',
    mutedMauve: '#D9B2BF', taupePink: '#9A6A76'
  },

  instagramUrl: 'https://www.instagram.com/ei8htverse?exln=MWc3MXFrODRxNWRsMA==', // placeholder: replace
  contactEmail: 'ei8htverse@gmail.com',                                  // placeholder: replace
  whatsappNumber: '',   // your WhatsApp business number, e.g. '919876543210' (10 digits also works, India assumed)

  currency: 'INR',
  locale: 'en-IN',
  maxQtyPerItem: 10,

  // Shipping: no fees are invented. Set your real charge when ready.
  shipping: {
    configured: false,        // set to true once the values below are real
    flatRate: 0,              // rupees
    freeShippingAbove: null,  // e.g. 999, or null for none
    info: 'Shipping charges and delivery estimates will be confirmed once you set them in CONFIG.shipping.'
  },

  returns: {
    windowDays: 7,            // placeholder policy value, edit to match your real policy
    info: 'Contact us within the return window if something is wrong with your order. See the Returns and refunds page for details.'
  },

  featuredCollection: 'Soft Romance',  // collection name shown in the editorial homepage section

  // Orders: no online payment. The customer fills in their address, it is saved in Supabase,
  // emailed to you + added to your Google Sheet (Google Apps Script), then they continue on WhatsApp.
  orders: {
    appsScriptUrl: 'https://script.google.com/macros/s/AKfycbz-62Mi1u16rszVhNFpezh8BFqo8q5KKCc92LsvmfliCyv9N-zJKh3S3mhF1MbWbGFD4A/exec',       // your Google Apps Script web app link (ends with /exec)
    appsScriptSecret: 'Kaleesha@1822',    // the SAME password you typed in the script (SECRET)
    web3formsKey: '',        // optional alternative to Apps Script (https://web3forms.com)
    saveToDatabase: true     // save every order in your Supabase "orders" table
  },

  // Supabase = your online database, photo storage and admin login (free plan).
  // The anon key is meant to be public. NEVER put the service_role / secret key here.
  supabase: {
    url: 'https://dztmqoqwvvoyuwxzzhjo.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dG1xb3F3dnZveXV3eHp6aGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MzE2MTIsImV4cCI6MjEwNzMwNzYxMn0.8O-zAHEQLoMQ6hwYYCvYKwx1lCPeKqR7FSAuJC74dh0',
    bucket: 'product-images'
  },

  // Product categories (names used by filters, admin form and the homepage)
  categories: [
    { name: 'Pipe Cleaner Art', kind: 'pcart', color: '#C87593' },
    { name: 'Pipe Cleaner Keychains', kind: 'pckeychain', color: '#E7A8BD' },
    { name: 'Pipe Cleaner Flowers', kind: 'pcflower', color: '#C87593' },
    { name: 'Home Decor', kind: 'decor', color: '#E7A8BD' },
    { name: 'Charms', kind: 'charm', color: '#C87593' },
    { name: 'Bag Charms', kind: 'bag', color: '#7A2749' },
    { name: 'Phone Charms', kind: 'phone', color: '#E7A8BD' },
    { name: 'Bracelets', kind: 'bracelet', color: '#C87593' },
    { name: 'Rings', kind: 'ring', color: '#E7A8BD' },
    { name: 'Anti-Tarnish Jewellery', kind: 'ring', color: '#7A2749' },
    { name: 'Gifts', kind: 'gift', color: '#C87593' },
    { name: 'Decorative Accessories', kind: 'deco', color: '#E7A8BD' }
  ],
  // Categories shown as cards on the homepage. To use your own photo, add it in categoryImages below.
  homeCategories: ['Pipe Cleaner Art', 'Pipe Cleaner Keychains', 'Pipe Cleaner Flowers', 'Home Decor', 'Charms', 'Phone Charms', 'Bag Charms', 'Bracelets', 'Anti-Tarnish Jewellery', 'Gifts'],
  // Menu groups (used by the Jewellery and Pipe Cleaner links in the menu)
  groups: {
    jewellery: { title: 'Jewellery', categories: ['Bracelets', 'Rings', 'Anti-Tarnish Jewellery'] },
    pipecleaner: { title: 'Pipe cleaner crafts', categories: ['Pipe Cleaner Art', 'Pipe Cleaner Keychains', 'Pipe Cleaner Flowers'] }
  },
  categoryImages: {} // optional overrides, e.g. { 'Charms': 'assets/categories/charms.jpg' }
};

/* Admin login is handled by Supabase Auth (your admin email + password). No password is stored in this file. */

/* localStorage / sessionStorage keys */
const KEYS = {
  products: 'ei8_products_v2',
  cart: 'ei8_cart_v1',
  wish: 'ei8_wishlist_v1',
  user: 'ei8_user_v1',
  orders: 'ei8_prototype_orders_v1',
  checkout: 'ei8_checkout_v1',   // sessionStorage
  cache: 'ei8_products_cache_v1',  // last products downloaded from Supabase (for fast loading)
  sbSession: 'ei8_sb_session_v1'   // admin sign-in token (never the password)
};

const INDIAN_STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'];

const FAQS = [
  ['How do I order?', 'Pick your product, tap Order now, and fill in your phone number and delivery address. We will then open WhatsApp so we can confirm your order together.'],
  ['How do I pay?', 'We share the payment details with you on WhatsApp once your order is confirmed. Please never share card PINs, UPI PINs or OTPs with anyone.'],
  ['Can I change or cancel my order?', 'Write to us as soon as possible after ordering and we will do our best to help. [Edit this answer to match your real process.]'],
  ['Can I customise colours or sizes?', 'Yes for most handmade pipe cleaner pieces. Place your order and tell us what you would like when we chat on WhatsApp.'],
  ['How should I care for my jewellery?', 'Keep it dry, store it separately, and put it on after perfume and lotion. See the Jewellery care guide for more.'],
  ['What if my item arrives damaged?', 'Please use the Damaged product reporting page and include your order number and photos.'],
  ['Are your products waterproof or hypoallergenic?', 'We only state material and finish details that are verified for each product. Check the product page, and ask us if you are unsure.']
];

/* ==========================================================
   2. SMALL HELPERS
   ========================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const SVG_NS = 'http://www.w3.org/2000/svg';

/* h('div', {class:'x', text:'Hello', onclick: fn}, child1, child2)
   Builds DOM safely: text is always inserted as text, never as HTML. */
function h(tag, props, ...kids) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  appendKids(node, kids);
  return node;
}
function appendKids(node, kids) {
  for (const kid of kids) {
    if (kid === null || kid === undefined || kid === false) continue;
    if (Array.isArray(kid)) appendKids(node, kid);
    else node.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
}
function icon(name, cls = 'icon') {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', cls);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', '#i-' + name);
  svg.appendChild(use);
  return svg;
}

/* localStorage wrapper that never throws and never trusts stored data */
const Store = {
  get(key, fallback, area) {
    try {
      area = area || localStorage;
      const raw = area.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },
  set(key, value, area) {
    try { area = area || localStorage; area.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { console.warn('Storage failed for', key, e); return false; }
  },
  remove(key, area) { try { (area || localStorage).removeItem(key); } catch (e) { /* ignore */ } },
  sGet(key, fallback) { return Store.get(key, fallback, sessionStorage); },
  sSet(key, value) { return Store.set(key, value, sessionStorage); }
};

const moneyFmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
const fmt = n => moneyFmt.format(Number.isFinite(n) ? n : 0);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const isHex = s => typeof s === 'string' && /^#[0-9a-fA-F]{6}$/.test(s);
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
const pid = () => 'p-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function toast(message) {
  const box = $('#toasts');
  const t = h('div', { class: 'toast', text: message });
  box.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 2400);
}

/* Native <dialog> confirm that returns a Promise<boolean> */
function confirmAction(message, yesLabel = 'Confirm') {
  return new Promise(resolve => {
    const dlg = $('#confirmDialog');
    $('#confirmText').textContent = message;
    $('#confirmYes').textContent = yesLabel;
    const done = value => { dlg.close(); cleanup(); resolve(value); };
    const yes = () => done(true), no = () => done(false);
    const cleanup = () => { $('#confirmYes').removeEventListener('click', yes); $('#confirmNo').removeEventListener('click', no); };
    $('#confirmYes').addEventListener('click', yes);
    $('#confirmNo').addEventListener('click', no);
    dlg.addEventListener('cancel', () => { cleanup(); resolve(false); }, { once: true });
    dlg.showModal();
  });
}

/* ==========================================================
   3. GENERATED PLACEHOLDER ARTWORK
   Sample products use "art:" image references that render as
   small SVG illustrations in the brand palette. They are clearly
   drawn in the brand colours. Replace them with real photos.
   ========================================================== */
const M = '#7A2749';
const ART_BG = [['#FFF7FA', '#F8C9D6'], ['#FDE6EC', '#E7A8BD'], ['#F3DADA', '#FDE6EC'], ['#F8C9D6', '#FFF7FA']];
/* Pipe-cleaner look: a fuzzy thick line made from three strokes */
const fuzz = (d, f, w) => `<path d="${d}" fill="none" stroke="${M}" stroke-width="${w + 6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${f}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="${Math.max(2, w - 8)}" stroke-linecap="round" stroke-dasharray="1 7"/>`;
const circ = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const bloom = (cx, cy, sc, f) => { let s = ''; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; s += fuzz(circ(+(cx + 34 * sc * Math.cos(a)).toFixed(1), +(cy + 34 * sc * Math.sin(a)).toFixed(1), 19 * sc), f, 14 * sc); } return s + `<circle cx="${cx}" cy="${cy}" r="${16 * sc}" fill="#FFF7FA" stroke="${M}" stroke-width="4"/>`; };
const STEM = '#9A6A76';
const ART_SHAPES = {
  charm: f => `<circle cx="300" cy="150" r="34" fill="none" stroke="${M}" stroke-width="7"/><path d="M300 184V252" stroke="${M}" stroke-width="6"/><path d="M300 470C190 395 195 280 300 335C405 280 410 395 300 470Z" fill="${f}" stroke="${M}" stroke-width="6" stroke-linejoin="round"/><path d="M250 330c-16 12-22 34-12 54" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="8" stroke-linecap="round"/>`,
  bag: f => `<circle cx="300" cy="140" r="30" fill="none" stroke="${M}" stroke-width="7"/><path d="M300 170V260" stroke="${M}" stroke-width="6"/><path d="M300 330C230 250 140 270 150 350C158 420 250 400 300 330Z" fill="${f}" stroke="${M}" stroke-width="6" stroke-linejoin="round"/><path d="M300 330C370 250 460 270 450 350C442 420 350 400 300 330Z" fill="${f}" stroke="${M}" stroke-width="6" stroke-linejoin="round"/><circle cx="300" cy="335" r="30" fill="${f}" stroke="${M}" stroke-width="6"/><path d="M286 362L252 462M314 362L348 462" stroke="${M}" stroke-width="6" stroke-linecap="round"/>`,
  phone: f => { let s = ''; for (let i = 0; i < 9; i++) { const x = 110 + i * 47.5; const y = 170 + 0.0042 * Math.pow(x - 300, 2); s += `<circle cx="${x}" cy="${y.toFixed(1)}" r="26" fill="${i % 2 ? '#FFF7FA' : f}" stroke="${M}" stroke-width="4"/>`; } return s + `<path d="M300 220V320" stroke="${M}" stroke-width="5"/><circle cx="300" cy="360" r="40" fill="${f}" stroke="${M}" stroke-width="6"/>`; },
  clip: f => { let t = ''; for (let i = 0; i < 6; i++) t += `<rect x="${158 + i * 48}" y="370" width="26" height="86" rx="13" fill="${f}" stroke="${M}" stroke-width="6"/>`; return t + `<path d="M130 290Q130 232 190 232H410Q470 232 470 290V340Q470 392 410 392H190Q130 392 130 340Z" fill="${f}" stroke="${M}" stroke-width="6"/><circle cx="300" cy="312" r="22" fill="#FFF7FA" stroke="${M}" stroke-width="5"/>`; },
  earring: f => [200, 400].map(x => `<circle cx="${x}" cy="150" r="20" fill="none" stroke="${M}" stroke-width="6"/><path d="M${x} 170V215" stroke="${M}" stroke-width="5"/><path d="M${x} 215C${x - 62} 295 ${x - 56} 405 ${x} 435C${x + 56} 405 ${x + 62} 295 ${x} 215Z" fill="${f}" stroke="${M}" stroke-width="6" stroke-linejoin="round"/>`).join(''),
  necklace: f => `<path d="M100 160Q300 560 500 160" fill="none" stroke="${M}" stroke-width="5"/><circle cx="300" cy="362" r="36" fill="${f}" stroke="${M}" stroke-width="6"/><circle cx="300" cy="362" r="12" fill="#FFF7FA" stroke="${M}" stroke-width="3"/>`,
  bracelet: f => { let s = `<circle cx="300" cy="300" r="150" fill="none" stroke="${M}" stroke-width="5"/>`; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; s += `<circle cx="${(300 + 150 * Math.cos(a)).toFixed(1)}" cy="${(300 + 150 * Math.sin(a)).toFixed(1)}" r="24" fill="${i % 2 ? '#FFF7FA' : f}" stroke="${M}" stroke-width="4"/>`; } return s; },
  ring: f => `<ellipse cx="300" cy="370" rx="110" ry="120" fill="none" stroke="${M}" stroke-width="30"/><ellipse cx="300" cy="370" rx="110" ry="120" fill="none" stroke="${f}" stroke-width="20"/><path d="M300 170L352 225L300 280L248 225Z" fill="${f}" stroke="${M}" stroke-width="6" stroke-linejoin="round"/>`,
  gift: f => `<rect x="150" y="270" width="300" height="190" rx="14" fill="${f}" stroke="${M}" stroke-width="6"/><rect x="130" y="222" width="340" height="62" rx="12" fill="${f}" stroke="${M}" stroke-width="6"/><path d="M300 222V460" stroke="${M}" stroke-width="10"/><path d="M300 222C250 140 170 160 210 208C240 232 300 222 300 222ZM300 222C350 140 430 160 390 208C360 232 300 222 300 222Z" fill="none" stroke="${M}" stroke-width="6" stroke-linejoin="round"/>`,
  pcflower: f => fuzz('M300 280C300 360 288 440 300 530', STEM, 14) + fuzz('M298 430C240 410 212 372 218 340', STEM, 12) + fuzz('M302 400C360 380 388 344 384 314', STEM, 12) + bloom(300, 200, 2.2, f),
  pckeychain: f => `<circle cx="300" cy="120" r="34" fill="none" stroke="${M}" stroke-width="7"/><path d="M300 154V262" stroke="${M}" stroke-width="6"/>` + fuzz(circ(222, 292, 36), f, 26) + fuzz(circ(378, 292, 36), f, 26) + `<circle cx="300" cy="372" r="92" fill="#FFF7FA" fill-opacity=".7"/>` + fuzz(circ(300, 372, 88), f, 30) + fuzz(circ(300, 400, 26), '#F8C9D6', 18) + `<circle cx="262" cy="352" r="9" fill="${M}"/><circle cx="338" cy="352" r="9" fill="${M}"/><ellipse cx="300" cy="392" rx="13" ry="9" fill="${M}"/>`,
  pcart: f => fuzz('M110 430A190 190 0 0 1 490 430', f, 30) + fuzz('M158 430A142 142 0 0 1 442 430', '#F8C9D6', 30) + fuzz('M206 430A94 94 0 0 1 394 430', '#E7A8BD', 30) + fuzz(circ(120, 452, 30), '#FFF7FA', 22) + fuzz(circ(480, 452, 30), '#FFF7FA', 22),
  decor: f => fuzz('M300 390V210', STEM, 11) + fuzz('M290 390C250 340 232 290 232 240', STEM, 11) + fuzz('M310 390C350 340 368 300 372 250', STEM, 11) + bloom(300, 180, 1.1, f) + bloom(232, 215, .95, '#E7A8BD') + bloom(372, 226, .95, '#F8C9D6') + `<path d="M232 388C206 450 226 508 266 514H334C374 508 394 450 368 388Z" fill="${f}" stroke="${M}" stroke-width="6" stroke-linejoin="round"/><path d="M236 420H364" stroke="#fff" stroke-opacity=".5" stroke-width="6"/>`,
  deco: f => `<path d="M300 130Q315 285 470 300Q315 315 300 470Q285 315 130 300Q285 285 300 130Z" fill="${f}" stroke="${M}" stroke-width="6" stroke-linejoin="round"/><path d="M455 140Q460 175 495 180Q460 185 455 220Q450 185 415 180Q450 175 455 140Z" fill="#FFF7FA" stroke="${M}" stroke-width="4"/>`
};
ART_SHAPES.scene = f => `<g transform="translate(10 -10) scale(.8)">${ART_SHAPES.pcflower(f)}</g><g transform="translate(285 270) scale(.58)">${ART_SHAPES.pckeychain('#E7A8BD')}</g><g transform="translate(20 360) scale(.42)">${ART_SHAPES.pcart('#C87593')}</g>`;

const artCache = new Map();
function artDataURI(kind, fill, variant) {
  const k = ART_SHAPES[kind] ? kind : 'deco';
  const color = isHex(fill) ? fill : '#C87593';
  const v = Number.isInteger(variant) ? Math.abs(variant) % 4 : 0;
  const key = [k, color, v].join('|');
  if (artCache.has(key)) return artCache.get(key);
  const [b1, b2] = ART_BG[v];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b1}"/><stop offset="1" stop-color="${b2}"/></linearGradient></defs><rect width="600" height="600" fill="url(#g)"/><circle cx="480" cy="120" r="90" fill="#fff" fill-opacity=".25"/><circle cx="90" cy="520" r="120" fill="#fff" fill-opacity=".18"/>${ART_SHAPES[k](color)}</svg>`;
  const uri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  artCache.set(key, uri);
  return uri;
}
/* Turns any stored image reference into something safe for <img src> */
function resolveImg(src) {
  if (typeof src !== 'string' || !src) return artDataURI('deco', '#E7A8BD', 0);
  if (src.startsWith('art:')) {
    const [, kind, color, variant] = src.split(':');
    return artDataURI(kind, color, parseInt(variant, 10) || 0);
  }
  if (/^data:image\/(jpeg|png|webp);base64,/.test(src)) return src;
  if (/^(https?:\/\/|assets\/|\.\/|\/)/.test(src)) return src;
  return artDataURI('deco', '#E7A8BD', 0);
}

/* ==========================================================
   4. PRODUCT MODEL + DEMO CATALOGUE (localStorage)
   ========================================================== */
const COLOUR_NAMES = { '#7A2749': 'Cherry Maroon', '#C87593': 'Rose', '#E7A8BD': 'Blush Pink', '#F8C9D6': 'Dusty Pink', '#FDE6EC': 'Soft Pink', '#FFF7FA': 'Light Ivory' };

/* Cleans one raw product object into the standard shape (or returns null) */
function normalizeProduct(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const str = (v, d = '') => (typeof v === 'string' ? v.trim() : d);
  const num = v => { const n = Number(v); return Number.isFinite(n) && n >= 0 ? n : 0; };
  const title = str(raw.title);
  if (!title) return null;
  const price = num(raw.price);
  let original = num(raw.originalPrice);
  if (original <= price) original = 0; // never keep a fake discount
  const images = (Array.isArray(raw.images) ? raw.images : []).filter(s => typeof s === 'string' && s).slice(0, 4);
  const colors = (Array.isArray(raw.colors) ? raw.colors : []).slice(0, 12).map((c, i) => {
    const idx = Number.isInteger(c && c.imageIndex) && c.imageIndex >= 0 && c.imageIndex < images.length ? c.imageIndex : null;
    return { name: str(c && c.name) || `Colour ${i + 1}`, hex: isHex(c && c.hex) ? c.hex : '#C87593', imageIndex: idx };
  });
  const variants = (Array.isArray(raw.variants) ? raw.variants : []).map(v => ({
    name: str(v && v.name),
    options: (Array.isArray(v && v.options) ? v.options : []).map(o => str(o)).filter(Boolean)
  })).filter(v => v.name && v.options.length);
  return {
    id: str(raw.id) || pid(),
    title,
    subtitle: str(raw.subtitle),
    description: str(raw.description),
    category: str(raw.category),
    collection: str(raw.collection),
    price,
    originalPrice: original,
    images,
    colors,
    variants,
    sku: str(raw.sku),
    stock: Math.floor(num(raw.stock)),
    availability: raw.availability === 'sold_out' ? 'sold_out' : 'available',
    material: str(raw.material),
    dimensions: str(raw.dimensions),
    care: str(raw.care),
    tags: (Array.isArray(raw.tags) ? raw.tags : []).map(t => str(t)).filter(Boolean),
    featured: !!raw.featured,
    bestseller: !!raw.bestseller,
    isNew: !!raw.isNew,
    isSample: !!raw.isSample,
    createdAt: Number.isFinite(Number(raw.createdAt)) ? Number(raw.createdAt) : Date.now()
  };
}
const isInStock = p => p.availability === 'available' && p.stock > 0;
const discountPercent = p => (p.originalPrice > p.price && p.price >= 0 ? Math.round((p.originalPrice - p.price) / p.originalPrice * 100) : 0);
const maxQty = p => Math.max(0, Math.min(p.stock, CONFIG.maxQtyPerItem));
const needsChoice = p => p.colors.length > 1 || p.variants.length > 0;

function seedProducts() {
  const DAY = 864e5, now = Date.now();
  const PC = 'Pipe cleaners (chenille stems)';
  const make = (i, kind, hexes, o) => normalizeProduct(Object.assign({
    id: 'ev-' + String(i).padStart(2, '0'),
    createdAt: now - i * DAY,
    images: hexes.concat('#F8C9D6').slice(0, 4).map((hex, k) => `art:${kind}:${hex}:${k}`),
    colors: hexes.map((hex, k) => ({ name: COLOUR_NAMES[hex] || 'Colour', hex, imageIndex: k })),
    care: 'Handmade pipe cleaner pieces are delicate. Keep away from water and heat, handle gently and dust with a soft, dry brush.',
    sku: 'EV-' + String(i).padStart(3, '0')
  }, o));
  const trio = ['#7A2749', '#C87593', '#E7A8BD'];
  return [
    make(1, 'pcflower', ['#C87593', '#E7A8BD', '#7A2749'], { title: 'Pipe Cleaner Flower Bouquet', subtitle: 'Handmade, never wilts', description: 'A handmade bouquet of fluffy pipe cleaner flowers. A sweet gift or a bright touch for a desk, shelf or bedside table. Colours can be customised on WhatsApp.', category: 'Pipe Cleaner Flowers', collection: 'Soft Romance', price: 349, originalPrice: 499, stock: 12, bestseller: true, isNew: true, featured: true, material: PC, tags: ['pipe cleaner', 'flowers', 'bouquet', 'handmade', 'gift'] }),
    make(2, 'pckeychain', ['#E7A8BD', '#C87593', '#7A2749'], { title: 'Pipe Cleaner Bear Keychain', subtitle: 'Fluffy handmade bear', description: 'A cute, fluffy bear keychain made from pipe cleaners. Clip it on keys, bags or school bags. Tell us your favourite colours on WhatsApp.', category: 'Pipe Cleaner Keychains', price: 149, originalPrice: 199, stock: 30, bestseller: true, isNew: true, material: PC, tags: ['pipe cleaner', 'keychain', 'bear', 'handmade', 'cute'] }),
    make(3, 'charm', ['#C87593', '#7A2749', '#E7A8BD'], { title: 'Pipe Cleaner Heart Charm', subtitle: 'A tiny heart to carry', description: 'A small handmade heart charm that clips onto keys, zips and bags. Mix and match colours for a collected look.', category: 'Charms', collection: 'Soft Romance', price: 129, stock: 40, isNew: true, material: PC, tags: ['charm', 'heart', 'pipe cleaner', 'handmade'] }),
    make(4, 'pcart', ['#C87593', '#E7A8BD'], { title: 'Pipe Cleaner Rainbow Wall Art', subtitle: 'Soft pastel wall hanging', description: 'A pastel rainbow made of pipe cleaners to brighten a wall, window or kids\' room. Custom sizes and colours can be discussed on WhatsApp.', category: 'Pipe Cleaner Art', price: 449, stock: 8, featured: true, isNew: true, material: PC, tags: ['pipe cleaner', 'art', 'rainbow', 'wall', 'decor'] }),
    make(5, 'decor', ['#C87593', '#E7A8BD', '#7A2749'], { title: 'Pipe Cleaner Flower Vase Decor', subtitle: 'Table decor that lasts', description: 'A little vase filled with handmade pipe cleaner blooms. A cheerful piece for a shelf, desk or dining table.', category: 'Home Decor', collection: 'Soft Romance', price: 599, originalPrice: 749, stock: 6, material: PC, tags: ['home decor', 'vase', 'flowers', 'pipe cleaner', 'gift'] }),
    make(6, 'phone', ['#E7A8BD', '#C87593'], { title: 'Phone Charm with Beads', subtitle: 'Beaded strap for your phone', description: 'A beaded phone charm with a dangling accent. Loops onto most phone cases.', category: 'Phone Charms', price: 179, originalPrice: 249, stock: 30, bestseller: true, tags: ['phone', 'beads', 'cute'] }),
    make(7, 'bag', trio, { title: 'Pipe Cleaner Bow Bag Charm', subtitle: 'Soft bow, easy clip', description: 'A handmade bow charm that adds a soft finishing touch to totes, backpacks and handbags.', category: 'Bag Charms', price: 199, stock: 20, isNew: true, material: PC, tags: ['bag', 'bow', 'pipe cleaner', 'handmade'] }),
    make(8, 'gift', trio, { title: 'ei8htverse Gift Box', subtitle: 'Gift-ready presentation', description: 'A giftable box to make someone feel special. Tell us what you would like inside on WhatsApp.', category: 'Gifts', price: 799, originalPrice: 999, stock: 6, bestseller: true, tags: ['gift', 'box', 'present'] }),
    make(9, 'bracelet', ['#E7A8BD', '#C87593'], { title: 'Beaded Charm Bracelet', subtitle: 'Stretch bracelet with beads', description: 'A playful beaded bracelet that stacks well with other bracelets and watches.', category: 'Bracelets', price: 349, stock: 3, tags: ['bracelet', 'beads', 'stack'] }),
    make(10, 'ring', ['#C87593', '#E7A8BD'], { title: 'Minimal Band Ring', subtitle: 'Simple everyday ring', description: 'A clean, simple ring for everyday wear. Choose your size at checkout.', category: 'Anti-Tarnish Jewellery', price: 399, stock: 14, variants: [{ name: 'Size', options: ['6', '7', '8'] }], care: 'Keep dry, store separately and put on after perfume, lotion and hairspray.', tags: ['ring', 'everyday', 'jewellery'] })
  ].filter(Boolean);
}

function loadProducts() {
  if (SB.enabled) {
    const cached = Store.get(KEYS.cache, null);
    return Array.isArray(cached) ? cached.map(normalizeProduct).filter(Boolean) : [];
  }
  const saved = Store.get(KEYS.products, null);
  if (!Array.isArray(saved)) {
    const seeded = seedProducts();
    Store.set(KEYS.products, seeded);
    return seeded;
  }
  const seen = new Set();
  return saved.map(normalizeProduct).filter(p => p && !seen.has(p.id) && seen.add(p.id));
}

/* ==========================================================
   4b. SUPABASE (online database + photo storage + admin login)
   Talks to Supabase with plain fetch(), so no extra library is needed.
   ========================================================== */
function rowToProduct(r) {
  return normalizeProduct({
    id: r.id, title: r.title, subtitle: r.subtitle, description: r.description, category: r.category, collection: r.collection,
    price: Number(r.price), originalPrice: Number(r.original_price) || 0, images: r.images, colors: r.colors, variants: r.variants,
    tags: r.tags, sku: r.sku || '', stock: r.stock, availability: r.availability, material: r.material, dimensions: r.dimensions,
    care: r.care, featured: r.featured, bestseller: r.bestseller, isNew: r.is_new, createdAt: Date.parse(r.created_at)
  });
}
function productToRow(p) {
  return {
    id: p.id, title: p.title, subtitle: p.subtitle, description: p.description, category: p.category, collection: p.collection,
    price: p.price, original_price: p.originalPrice, images: p.images, colors: p.colors, variants: p.variants, tags: p.tags,
    sku: p.sku, stock: p.stock, availability: p.availability, material: p.material, dimensions: p.dimensions, care: p.care,
    featured: p.featured, bestseller: p.bestseller, is_new: p.isNew, created_at: new Date(p.createdAt).toISOString()
  };
}
function dataUriToBlob(uri) {
  const m = /^data:([^;]+);base64,(.*)$/.exec(uri);
  if (!m) throw new Error('Invalid image data.');
  const bin = atob(m[2]), bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: m[1] });
}

const SB = {
  session: null,
  get enabled() { return !!(CONFIG.supabase.url && CONFIG.supabase.anonKey); },
  baseHeaders() { return { apikey: CONFIG.supabase.anonKey, 'Content-Type': 'application/json' }; },
  authHeaders() { return Object.assign(this.baseHeaders(), { Authorization: 'Bearer ' + (this.session ? this.session.access_token : CONFIG.supabase.anonKey) }); },
  async request(path, opts) {
    const res = await fetch(CONFIG.supabase.url + path, opts);
    if (!res.ok) {
      let msg = '';
      try { const j = await res.json(); msg = j.message || j.msg || j.error_description || j.error || ''; } catch (e) { /* ignore */ }
      const err = new Error(msg || `Request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },
  loadSession() {
    const s = Store.get(KEYS.sbSession, null);
    this.session = s && typeof s.access_token === 'string' && typeof s.refresh_token === 'string' ? s : null;
  },
  setSession(j) {
    this.session = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Math.floor(Date.now() / 1000) + (Number(j.expires_in) || 3600) };
    Store.set(KEYS.sbSession, this.session);
  },
  clear() { this.session = null; Store.remove(KEYS.sbSession); },
  async signIn(email, password) {
    const j = await this.request('/auth/v1/token?grant_type=password', { method: 'POST', headers: this.baseHeaders(), body: JSON.stringify({ email, password }) });
    this.setSession(j);
  },
  async signOut() {
    try { if (this.session) await this.request('/auth/v1/logout', { method: 'POST', headers: this.authHeaders() }); } catch (e) { /* ignore */ }
    this.clear();
  },
  /* Returns true if there is a valid (or refreshable) admin session */
  async ensureSession() {
    if (!this.session) return false;
    if (this.session.expires_at - 60 > Date.now() / 1000) return true;
    try {
      const j = await this.request('/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: this.baseHeaders(), body: JSON.stringify({ refresh_token: this.session.refresh_token }) });
      this.setSession(j);
      return true;
    } catch (e) { this.clear(); return false; }
  },
  async needAdmin() {
    if (!(await this.ensureSession())) { const e = new Error('Your admin session has expired. Please sign in again.'); e.expired = true; throw e; }
  },
  async fetchProducts() {
    const rows = await this.request('/rest/v1/products?select=*&order=created_at.desc', { headers: this.baseHeaders() });
    return (Array.isArray(rows) ? rows : []).map(rowToProduct).filter(Boolean);
  },
  async upsert(list) {
    await this.needAdmin();
    const rows = await this.request('/rest/v1/products?on_conflict=id', {
      method: 'POST', headers: Object.assign(this.authHeaders(), { Prefer: 'resolution=merge-duplicates,return=representation' }),
      body: JSON.stringify(list.map(productToRow))
    });
    if (!Array.isArray(rows) || rows.length !== list.length) throw new Error('The database did not save the product. Check that you are signed in as the admin and that the setup SQL was run.');
  },
  async remove(id) {
    await this.needAdmin();
    const rows = await this.request('/rest/v1/products?id=eq.' + encodeURIComponent(id), { method: 'DELETE', headers: Object.assign(this.authHeaders(), { Prefer: 'return=representation' }) });
    if (!Array.isArray(rows) || !rows.length) throw new Error('The database did not delete the product. Check that you are signed in as the admin.');
  },
  /* Anyone can place an order (insert only). Only the signed-in admin can read orders. */
  async insertOrder(o) {
    await this.request('/rest/v1/orders', {
      method: 'POST', headers: Object.assign(this.baseHeaders(), { Prefer: 'return=minimal' }),
      body: JSON.stringify({
        id: o.id, status: 'new', customer_name: o.customer.name, phone: o.customer.phone, phone2: o.customer.phone2, email: o.customer.email,
        address: o.address, items: o.items, total: o.total, notes: o.notes
      })
    });
  },
  publicUrl(path) { return `${CONFIG.supabase.url}/storage/v1/object/public/${CONFIG.supabase.bucket}/${path}`; },
  async uploadImage(dataUri, path) {
    await this.needAdmin();
    const blob = dataUriToBlob(dataUri);
    const headers = { apikey: CONFIG.supabase.anonKey, Authorization: 'Bearer ' + this.session.access_token, 'Content-Type': blob.type || 'image/jpeg', 'x-upsert': 'false' };
    await this.request(`/storage/v1/object/${CONFIG.supabase.bucket}/${path}`, { method: 'POST', headers, body: blob });
    return this.publicUrl(path);
  },
  /* Best effort clean-up of photos belonging to a deleted product */
  async deleteImages(urls) {
    const prefix = this.publicUrl('');
    const paths = urls.filter(u => typeof u === 'string' && u.startsWith(prefix)).map(u => u.slice(prefix.length));
    if (!paths.length) return;
    try { await this.request(`/storage/v1/object/${CONFIG.supabase.bucket}`, { method: 'DELETE', headers: this.authHeaders(), body: JSON.stringify({ prefixes: paths }) }); } catch (e) { /* ignore */ }
  }
};

/* ==========================================================
   5. APP STATE
   ========================================================== */
const state = {
  products: [],
  cart: [],        // [{ key, id, color, opts, qty }]   (prices are looked up live, never stored)
  wishlist: [],    // [productId]
  user: null,      // { name, email }  (prototype session, no password)
  admin: false,
  orders: [], ordersLoaded: false,
  shop: { q: '', cat: '', group: '', flag: '', colors: [], avail: '', min: '', max: '', sort: 'newest' },
  checkout: {
    step: 1,
    details: { name: '', phone: '', phone2: '', email: '', house: '', street: '', city: '', state: '', pin: '', landmark: '', notes: '' },
    buyNow: null,
    lastOrder: null
  }
};

function persistProducts() {
  const ok = Store.set(SB.enabled ? KEYS.cache : KEYS.products, state.products);
  if (!ok) toast('Storage is full. Use fewer or smaller images; this change may be lost on refresh.');
  return ok;
}
const saveCart = () => Store.set(KEYS.cart, state.cart);
const saveWish = () => Store.set(KEYS.wish, state.wishlist);
const saveCheckout = () => Store.sSet(KEYS.checkout, state.checkout);

function loadState() {
  state.products = loadProducts();
  const cart = Store.get(KEYS.cart, []);
  state.cart = (Array.isArray(cart) ? cart : []).filter(l => l && typeof l.id === 'string' && typeof l.key === 'string' && Number.isInteger(l.qty) && l.qty > 0)
    .map(l => ({ key: l.key, id: l.id, color: typeof l.color === 'string' ? l.color : '', opts: (l.opts && typeof l.opts === 'object') ? l.opts : {}, qty: l.qty }));
  const wish = Store.get(KEYS.wish, []);
  state.wishlist = (Array.isArray(wish) ? wish : []).filter(x => typeof x === 'string');
  const user = Store.get(KEYS.user, null);
  state.user = user && typeof user.email === 'string' ? { name: String(user.name || ''), email: user.email } : null;
  SB.loadSession();
  state.admin = SB.enabled && !!SB.session;
  const co = Store.sGet(KEYS.checkout, null);
  if (co && typeof co === 'object') {
    state.checkout.step = Number.isInteger(co.step) ? clamp(co.step, 1, 4) : 1;
    if (co.details && typeof co.details === 'object') for (const k of Object.keys(state.checkout.details)) if (typeof co.details[k] === 'string') state.checkout.details[k] = co.details[k];
    state.checkout.buyNow = co.buyNow && typeof co.buyNow === 'object' ? co.buyNow : null;
    state.checkout.lastOrder = co.lastOrder && typeof co.lastOrder === 'object' ? co.lastOrder : null;
  }
}

const findProduct = id => state.products.find(p => p.id === id);

/* ==========================================================
   6. SEARCH, FILTERS, SORTING
   ========================================================== */
function searchProducts(list, query) {
  const terms = String(query || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return list;
  return list.filter(p => {
    const hay = [p.title, p.subtitle, p.description, p.category, p.collection, ...p.colors.map(c => c.name), ...p.tags].join(' ').toLowerCase();
    return terms.every(t => hay.includes(t));
  });
}
function applyFilters(list, f) {
  let out = searchProducts(list, f.q);
  if (f.cat) out = out.filter(p => p.category === f.cat);
  if (f.group && CONFIG.groups[f.group]) out = out.filter(p => CONFIG.groups[f.group].categories.includes(p.category));
  if (f.flag === 'new') out = out.filter(p => p.isNew);
  if (f.flag === 'best') out = out.filter(p => p.bestseller);
  if (f.colors.length) out = out.filter(p => p.colors.some(c => f.colors.includes(c.name.toLowerCase())));
  if (f.avail === 'in') out = out.filter(isInStock);
  if (f.avail === 'out') out = out.filter(p => !isInStock(p));
  const min = f.min === '' ? null : Number(f.min), max = f.max === '' ? null : Number(f.max);
  if (min !== null && Number.isFinite(min)) out = out.filter(p => p.price >= min);
  if (max !== null && Number.isFinite(max)) out = out.filter(p => p.price <= max);
  out = out.slice();
  if (f.sort === 'price-asc') out.sort((a, b) => a.price - b.price);
  else if (f.sort === 'price-desc') out.sort((a, b) => b.price - a.price);
  else if (f.sort === 'best') out.sort((a, b) => (b.bestseller - a.bestseller) || (b.createdAt - a.createdAt));
  else out.sort((a, b) => b.createdAt - a.createdAt);
  return out;
}

/* ==========================================================
   7. CART + WISHLIST LOGIC
   ========================================================== */
const optsKey = o => Object.keys(o || {}).sort().map(k => k + '=' + o[k]).join(';');
const lineKey = (id, color, opts) => [id, color || '', optsKey(opts)].join('|');

/* Combine a stored cart line with live product data */
function resolveLine(raw) {
  const p = raw && findProduct(raw.id);
  if (!p) return null;
  const color = p.colors.find(c => c.name === raw.color) || null;
  const max = maxQty(p);
  const qty = clamp(raw.qty, 1, Math.max(1, max));
  const inStock = isInStock(p);
  const imgSrc = color && color.imageIndex !== null && p.images[color.imageIndex] ? p.images[color.imageIndex] : p.images[0];
  return { key: raw.key, p, color, opts: raw.opts || {}, qty, unit: p.price, total: p.price * qty, inStock, img: imgSrc, max };
}
const cartLines = () => state.cart.map(resolveLine).filter(Boolean);
const cartCount = () => cartLines().reduce((n, l) => n + l.qty, 0);

function computeTotals(lines) {
  const valid = lines.filter(l => l.inStock);
  const subtotal = valid.reduce((s, l) => s + l.total, 0);
  const sh = CONFIG.shipping;
  let shipping = 0;
  if (valid.length) {
    shipping = Number.isFinite(sh.flatRate) && sh.flatRate > 0 ? sh.flatRate : 0;
    if (sh.freeShippingAbove && subtotal >= sh.freeShippingAbove) shipping = 0;
  }
  return { subtotal, shipping, total: subtotal + shipping };
}

function cartAdd(p, { color, opts, qty }) {
  if (!isInStock(p)) return { ok: false, message: 'This product is out of stock.' };
  const q = Math.floor(Number(qty));
  if (!Number.isFinite(q) || q < 1) return { ok: false, message: 'Please choose a valid quantity.' };
  const key = lineKey(p.id, color, opts);
  const existing = state.cart.find(l => l.key === key);
  const max = maxQty(p);
  const nextQty = (existing ? existing.qty : 0) + q;
  if (nextQty > max) return { ok: false, message: `Only ${max} available for this item.` };
  if (existing) existing.qty = nextQty;
  else state.cart.push({ key, id: p.id, color: color || '', opts: opts || {}, qty: q });
  saveCart();
  refreshCartUI();
  return { ok: true };
}
function cartSetQty(key, qty) {
  const line = state.cart.find(l => l.key === key);
  if (!line) return;
  const p = findProduct(line.id);
  const max = p ? Math.max(1, maxQty(p)) : 1;
  const q = Math.floor(Number(qty));
  line.qty = Number.isFinite(q) ? clamp(q, 1, max) : line.qty;
  saveCart(); refreshCartUI();
}
function cartRemove(key) {
  state.cart = state.cart.filter(l => l.key !== key);
  saveCart(); refreshCartUI();
}

function toggleWish(id) {
  const i = state.wishlist.indexOf(id);
  if (i > -1) { state.wishlist.splice(i, 1); toast('Removed from wishlist'); }
  else { state.wishlist.push(id); toast('Saved to wishlist'); }
  saveWish();
  refreshWishUI();
}
/* Updates the heart buttons + header count (does not re-render any page) */
function syncWishButtons() {
  const n = state.wishlist.filter(id => findProduct(id)).length;
  const badge = $('#wishCount');
  badge.textContent = String(n); badge.dataset.count = String(n);
  $$('[data-wish-id]').forEach(btn => {
    const on = state.wishlist.includes(btn.dataset.wishId);
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', String(on));
    if (btn.classList.contains('wish-btn')) btn.setAttribute('aria-label', on ? 'Remove from wishlist' : 'Add to wishlist');
    const label = $('.wish-label', btn);
    if (label) label.textContent = on ? 'Saved to wishlist' : 'Add to wishlist';
  });
}
function refreshWishUI() {
  syncWishButtons();
  if (!$('#view-wishlist').hidden) renderWishlist();
}
function refreshCartUI() {
  const n = cartCount();
  const badge = $('#cartCount');
  badge.textContent = String(n); badge.dataset.count = String(n);
  renderCartDrawer();
  if (!$('#view-checkout').hidden) renderCheckout();
}

/* ==========================================================
   8. LAYERS (mobile nav, search, cart drawer) + reveal animation
   ========================================================== */
const Layers = {
  active: null, lastFocus: null,
  open(layer) {
    if (this.active && this.active !== layer) this.close(true);
    if (!this.active) this.lastFocus = document.activeElement;
    layer.inert = false;
    layer.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => layer.classList.add('open'));
    $('#overlay').classList.add('show');
    document.body.classList.add('no-scroll');
    this.active = layer;
    if (layer.id === 'mobileNav') $('#menuBtn').setAttribute('aria-expanded', 'true');
    setTimeout(() => { const f = $('[data-autofocus]', layer) || focusables(layer)[0]; if (f) f.focus(); }, 60);
  },
  close(keepFocusState) {
    const layer = this.active;
    if (!layer) return;
    layer.classList.remove('open');
    layer.setAttribute('aria-hidden', 'true');
    layer.inert = true;
    if (layer.id === 'mobileNav') $('#menuBtn').setAttribute('aria-expanded', 'false');
    this.active = null;
    if (!keepFocusState) {
      $('#overlay').classList.remove('show');
      document.body.classList.remove('no-scroll');
      if (this.lastFocus && document.contains(this.lastFocus)) this.lastFocus.focus();
    }
  }
};
function focusables(root) {
  return $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', root).filter(el => el.offsetParent !== null);
}
function handleLayerKeys(e) {
  if (!Layers.active) return;
  if (e.key === 'Escape') { Layers.close(); return; }
  if (e.key === 'Tab') {
    const f = focusables(Layers.active);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}

let revealObserver = null;
function observeReveals(root = document) {
  const items = $$('.reveal:not(.in)', root);
  if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('in')); return; }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); revealObserver.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  }
  items.forEach(el => revealObserver.observe(el));
}

/* ==========================================================
   9. REUSABLE UI COMPONENTS
   ========================================================== */
function priceBlock(p, cls = 'price') {
  const d = discountPercent(p);
  return h('div', { class: cls },
    d > 0 ? h('del', null, h('span', { class: 'sr-only' }, 'Original price '), fmt(p.originalPrice)) : null,
    h('strong', null, h('span', { class: 'sr-only' }, 'Price '), fmt(p.price)),
    d > 0 ? h('span', { class: 'save-badge' }, `Save ${d}%`) : null);
}

function wishButton(p) {
  const b = h('button', {
    type: 'button', class: 'wish-btn', 'data-wish-id': p.id, 'aria-pressed': 'false', 'aria-label': 'Add to wishlist',
    onclick: e => { e.preventDefault(); e.stopPropagation(); toggleWish(p.id); }
  }, icon('heart'));
  if (state.wishlist.includes(p.id)) { b.classList.add('is-active'); b.setAttribute('aria-pressed', 'true'); b.setAttribute('aria-label', 'Remove from wishlist'); }
  return b;
}

function productCard(p) {
  let sel = -1; // index of the colour chosen on the card (-1 = none)
  const imgFor = i => {
    const c = p.colors[i];
    return resolveImg(c && c.imageIndex !== null && p.images[c.imageIndex] ? p.images[c.imageIndex] : p.images[0]);
  };
  const hrefFor = () => '#/product/' + encodeURIComponent(p.id) + (sel > -1 && p.colors.length > 1 ? '?c=' + encodeURIComponent(p.colors[sel].name) : '');
  const img = h('img', { src: resolveImg(p.images[0]), alt: p.title, loading: 'lazy', decoding: 'async', width: 600, height: 600 });
  const d = discountPercent(p);
  const badges = h('div', { class: 'badges' },
    !isInStock(p) ? h('span', { class: 'badge soft' }, 'Sold out') : null,
    isInStock(p) && d > 0 ? h('span', { class: 'badge sale' }, `-${d}%`) : null,
    isInStock(p) && p.isNew ? h('span', { class: 'badge' }, 'New') : null);
  const media = h('a', { class: 'card-media', href: hrefFor(), 'aria-label': 'View ' + p.title }, img, badges);
  const titleLink = h('a', { href: hrefFor() }, p.title);

  const swatchBtns = p.colors.slice(0, 6).map((c, i) => h('button', {
    type: 'button', class: 'swatch', 'aria-label': c.name, 'aria-pressed': 'false', title: c.name, style: `--sw:${c.hex}`,
    onclick: () => {
      sel = i;
      img.src = imgFor(i);
      swatchBtns.forEach((b, k) => { b.classList.toggle('is-selected', k === i); b.setAttribute('aria-pressed', String(k === i)); });
      media.setAttribute('href', hrefFor()); titleLink.setAttribute('href', hrefFor());
    }
  }));
  const swatches = p.colors.length ? h('div', { class: 'swatches', role: 'group', 'aria-label': 'Colours' }, swatchBtns, p.colors.length > 6 ? h('span', { class: 'muted' }, `+${p.colors.length - 6}`) : null) : null;

  return h('article', { class: 'product-card' },
    h('div', { style: 'position:relative' }, media, wishButton(p)),
    h('div', { class: 'card-body' },
      h('h3', { class: 'card-title' }, titleLink),
      p.subtitle ? h('p', { class: 'card-sub' }, p.subtitle) : null,
      swatches,
      priceBlock(p)));
}

function fillGrid(container, list, emptyText) {
  container.replaceChildren();
  if (!list.length) { container.append(h('p', { class: 'muted', style: 'grid-column:1/-1' }, emptyText)); return; }
  list.forEach(p => container.append(productCard(p)));
}

function emptyState(title, text, btnLabel, href) {
  return h('div', { class: 'empty-state' }, h('h2', null, title), h('p', null, text), btnLabel ? h('a', { class: 'btn btn-primary', href }, btnLabel) : null);
}

let accN = 0;
function accordionItem(q, a) {
  const id = 'acc' + (++accN);
  const panel = h('div', { class: 'acc-panel', id, role: 'region' }, h('div', null, h('p', null, a)));
  const btn = h('button', { type: 'button', class: 'acc-btn', 'aria-expanded': 'false', 'aria-controls': id }, h('span', null, q), icon('chevron'));
  return h('div', { class: 'acc-item' }, h('h3', null, btn), panel);
}

/* ==========================================================
   10. HOME PAGE
   ========================================================== */
function renderHome() {
  $('#heroImage').src = artDataURI('scene', '#C87593', 1);

  $('#categoryGrid').replaceChildren(...CONFIG.homeCategories.map((name, i) => {
    const c = CONFIG.categories.find(x => x.name === name) || { kind: 'deco', color: '#C87593' };
    const src = CONFIG.categoryImages[name] || artDataURI(c.kind, c.color, i);
    return h('a', { class: 'cat-card', href: '#/shop?cat=' + encodeURIComponent(name) },
      h('img', { src, alt: '', loading: 'lazy', width: 400, height: 500 }), h('span', null, name));
  }));

  const newest = state.products.slice().sort((a, b) => b.createdAt - a.createdAt);
  fillGrid($('#newGrid'), newest.filter(p => p.isNew).slice(0, 8), 'No new arrivals yet. Mark products as "New arrival" in the admin panel.');
  fillGrid($('#bestGrid'), newest.filter(p => p.bestseller).slice(0, 8), 'No bestsellers yet. Mark products as "Bestseller" in the admin panel.');
  fillGrid($('#giftGrid'), newest.filter(p => p.category === 'Gifts' || p.tags.some(t => t.toLowerCase() === 'gift')).slice(0, 4), 'Gift picks will appear here. Tag products with "gift" or use the Gifts category.');

  const coll = $('#collectionFeature');
  coll.replaceChildren();
  const items = newest.filter(p => p.collection.toLowerCase() === CONFIG.featuredCollection.toLowerCase());
  $('#collectionSection').hidden = !items.length;
  if (items.length) {
    coll.append(h('div', { class: 'editorial' },
      h('div', { class: 'editorial-art' }, h('img', { src: resolveImg(items[0].images[0]), alt: '', loading: 'lazy', width: 800, height: 880 })),
      h('div', null,
        h('p', { class: 'eyebrow' }, 'Featured collection'),
        h('h2', null, CONFIG.featuredCollection),
        h('p', { class: 'lead' }, 'A soft, romantic edit of pieces that look lovely together. Mix, match and make it yours.'),
        h('div', { class: 'mini-grid' }, items.slice(0, 2).map(productCard)),
        h('div', { class: 'btn-row' }, h('a', { class: 'btn btn-primary', href: '#/shop?q=' + encodeURIComponent(CONFIG.featuredCollection) }, 'Explore the collection')))));
  }

  const kinds = ['pcflower', 'pckeychain', 'pcart', 'decor', 'phone', 'gift'];
  $('#instaGrid').replaceChildren(...kinds.map((k, i) => h('figure', null, h('img', { src: artDataURI(k, i % 2 ? '#C87593' : '#7A2749', i), alt: 'Placeholder tile ' + (i + 1), loading: 'lazy', width: 300, height: 300 }))));
  observeReveals($('#view-home'));
}

/* ==========================================================
   11. SHOP PAGE (search, filters, sorting)
   ========================================================== */
function shopHash() {
  const s = state.shop, p = new URLSearchParams();
  if (s.q) p.set('q', s.q);
  if (s.cat) p.set('cat', s.cat);
  if (s.group) p.set('group', s.group);
  if (s.flag) p.set('flag', s.flag);
  if (s.colors.length) p.set('color', s.colors.join(','));
  if (s.avail) p.set('avail', s.avail);
  if (s.min !== '') p.set('min', s.min);
  if (s.max !== '') p.set('max', s.max);
  if (s.sort !== 'newest') p.set('sort', s.sort);
  const qs = p.toString();
  return '#/shop' + (qs ? '?' + qs : '');
}
const syncShopHash = () => history.replaceState(null, '', shopHash());

function initShopFromQuery(q) {
  const s = state.shop;
  s.q = (q.get('q') || '').slice(0, 80);
  s.cat = q.get('cat') || '';
  s.group = q.get('group') || '';
  s.flag = q.get('flag') || '';
  s.colors = (q.get('color') || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  s.avail = ['in', 'out'].includes(q.get('avail')) ? q.get('avail') : '';
  s.min = q.get('min') || '';
  s.max = q.get('max') || '';
  s.sort = ['price-asc', 'price-desc', 'best'].includes(q.get('sort')) ? q.get('sort') : 'newest';
}

function resetShopFilters() {
  Object.assign(state.shop, { q: '', cat: '', group: '', flag: '', colors: [], avail: '', min: '', max: '', sort: 'newest' });
  syncShopHash(); renderShop();
}

function renderShop() {
  const s = state.shop;
  const catSel = $('#fCategory');
  if (catSel.options.length !== CONFIG.categories.length + 1) {
    catSel.replaceChildren(h('option', { value: '' }, 'All categories'), ...CONFIG.categories.map(c => h('option', { value: c.name }, c.name)));
  }
  catSel.value = s.cat;
  if (document.activeElement !== $('#shopSearch')) $('#shopSearch').value = s.q;
  $('#shopSearchClear').hidden = !s.q;
  $('#sortSelect').value = s.sort;
  $('#fAvail').value = s.avail;
  if (document.activeElement !== $('#fMin')) $('#fMin').value = s.min;
  if (document.activeElement !== $('#fMax')) $('#fMax').value = s.max;

  // Colour chips come from every colour name in the catalogue
  const names = new Map();
  state.products.forEach(p => p.colors.forEach(c => { const k = c.name.toLowerCase(); if (!names.has(k)) names.set(k, c); }));
  $('#fColors').replaceChildren(...Array.from(names).map(([k, c]) => h('button', {
    type: 'button', class: 'chip', 'aria-pressed': String(s.colors.includes(k)),
    onclick: () => { s.colors = s.colors.includes(k) ? s.colors.filter(x => x !== k) : s.colors.concat(k); syncShopHash(); renderShop(); }
  }, h('span', { class: 'dot', style: `--dot:${c.hex}` }), c.name)));
  if (!names.size) $('#fColors').replaceChildren(h('span', { class: 'muted' }, 'No colours yet'));

  const list = applyFilters(state.products, s);
  let title = 'Shop all';
  if (s.flag === 'new') title = 'New arrivals';
  else if (s.flag === 'best') title = 'Bestsellers';
  else if (s.group && CONFIG.groups[s.group]) title = CONFIG.groups[s.group].title;
  else if (s.cat) title = s.cat;
  else if (s.q) title = 'Search results';
  $('#shopTitle').textContent = title;
  $('#shopCount').textContent = `${list.length} product${list.length === 1 ? '' : 's'}` + (s.q ? ` for "${s.q}"` : '');
  const grid = $('#shopGrid');
  grid.replaceChildren(...list.map(productCard));
  $('#shopEmpty').hidden = list.length > 0;
  grid.hidden = list.length === 0;
}

function initShopControls() {
  const s = state.shop;
  const update = () => { syncShopHash(); renderShop(); };
  $('#shopSearch').addEventListener('input', e => { s.q = e.target.value.slice(0, 80); update(); });
  $('#shopSearch').addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
  $('#shopSearchClear').addEventListener('click', () => { s.q = ''; update(); $('#shopSearch').focus(); });
  $('#sortSelect').addEventListener('change', e => { s.sort = e.target.value; update(); });
  $('#fCategory').addEventListener('change', e => { s.cat = e.target.value; s.group = ''; update(); });
  $('#fAvail').addEventListener('change', e => { s.avail = e.target.value; update(); });
  $('#fMin').addEventListener('input', e => { s.min = e.target.value; update(); });
  $('#fMax').addEventListener('input', e => { s.max = e.target.value; update(); });
  $('#fClear').addEventListener('click', resetShopFilters);
  $('#shopEmptyClear').addEventListener('click', resetShopFilters);
  $('#filterToggle').addEventListener('click', e => {
    const open = $('#filtersPanel').classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded', String(open));
  });
}

/* Quick search overlay in the header */
function renderSearchResults(q) {
  const box = $('#searchResults');
  const term = q.trim();
  box.replaceChildren();
  if (!term) { $('#searchCount').textContent = 'Start typing to search all products.'; return; }
  const list = searchProducts(state.products, term);
  $('#searchCount').textContent = `${list.length} result${list.length === 1 ? '' : 's'} for "${term}"`;
  if (!list.length) { box.append(h('p', { class: 'muted' }, 'Nothing matched. Try a colour, a category like "keychains", or a tag like "gift".')); return; }
  list.slice(0, 6).forEach(p => box.append(h('a', { class: 'search-item', href: '#/product/' + encodeURIComponent(p.id) },
    h('img', { src: resolveImg(p.images[0]), alt: '', width: 64, height: 64, loading: 'lazy' }),
    h('span', null, h('strong', null, p.title), h('span', { class: 'muted' }, p.category + ' · ' + fmt(p.price))))));
  if (list.length > 6) box.append(h('a', { class: 'btn btn-ghost', href: '#/shop?q=' + encodeURIComponent(term) }, `See all ${list.length} results`));
}

/* ==========================================================
   12. PRODUCT DETAIL PAGE
   ========================================================== */
function renderProduct(id, query) {
  const root = $('#productRoot');
  root.replaceChildren();
  const p = findProduct(id);
  if (!p) {
    root.append(h('div', { class: 'page-pad' }, emptyState('Product not found', 'This product may have been removed.', 'Browse the shop', '#/shop')));
    return 'Product not found';
  }
  const ps = { img: 0, color: null, qty: 1, opts: {} };
  const preset = p.colors.findIndex(c => c.name === query.get('c'));
  if (preset > -1) ps.color = preset;
  else if (p.colors.length === 1) ps.color = 0;
  if (ps.color !== null && p.colors[ps.color].imageIndex !== null) ps.img = p.colors[ps.color].imageIndex;

  const mainImg = h('img', { width: 800, height: 800, decoding: 'async', fetchpriority: 'high' });
  const thumbs = p.images.map((src, i) => h('button', { type: 'button', class: 'thumb', 'aria-label': `Show image ${i + 1} of ${p.images.length}`, onclick: () => { ps.img = i; paint(); } },
    h('img', { src: resolveImg(src), alt: '', loading: 'lazy', width: 160, height: 160 })));
  const colorName = h('span', null, '');
  const errEl = h('p', { class: 'field-error', role: 'alert' });
  const swatchBtns = p.colors.map((c, i) => h('button', {
    type: 'button', class: 'swatch', 'aria-label': c.name, 'aria-pressed': 'false', title: c.name, style: `--sw:${c.hex}`,
    onclick: () => { ps.color = i; if (c.imageIndex !== null) ps.img = c.imageIndex; errEl.textContent = ''; paint(); }
  }));

  function paint() {
    mainImg.classList.remove('is-in'); void mainImg.offsetWidth; mainImg.classList.add('is-in');
    mainImg.src = resolveImg(p.images[ps.img] || p.images[0]);
    mainImg.alt = `${p.title}, image ${ps.img + 1}`;
    thumbs.forEach((b, i) => { b.classList.toggle('is-selected', i === ps.img); b.setAttribute('aria-current', String(i === ps.img)); });
    swatchBtns.forEach((b, i) => { b.classList.toggle('is-selected', i === ps.color); b.setAttribute('aria-pressed', String(i === ps.color)); });
    colorName.textContent = ps.color !== null ? p.colors[ps.color].name : (p.colors.length ? 'Select a colour' : '');
  }

  // Optional variants (e.g. Size)
  const variantBlocks = p.variants.map((v, vi) => {
    const sid = `variant-${vi}`;
    const select = h('select', { id: sid, onchange: e => { if (e.target.value) ps.opts[v.name] = e.target.value; else delete ps.opts[v.name]; errEl.textContent = ''; } },
      h('option', { value: '' }, `Choose ${v.name.toLowerCase()}`), ...v.options.map(o => h('option', { value: o }, o)));
    return h('div', { class: 'pdp-block' }, h('label', { class: 'pdp-label', for: sid }, v.name), select);
  });

  // Quantity
  const max = Math.max(1, maxQty(p));
  const qtyInput = h('input', { type: 'number', min: 1, max, value: 1, inputmode: 'numeric', 'aria-label': 'Quantity' });
  const minus = h('button', { type: 'button', 'aria-label': 'Decrease quantity', onclick: () => setQty(ps.qty - 1) }, icon('minus'));
  const plus = h('button', { type: 'button', 'aria-label': 'Increase quantity', onclick: () => setQty(ps.qty + 1) }, icon('plus'));
  function setQty(n) {
    ps.qty = clamp(Math.floor(Number(n)) || 1, 1, max);
    qtyInput.value = ps.qty;
    minus.disabled = ps.qty <= 1; plus.disabled = ps.qty >= max;
  }
  qtyInput.addEventListener('change', () => setQty(qtyInput.value));

  function readSelection() {
    if (!isInStock(p)) return { error: 'This product is currently out of stock.' };
    if (p.colors.length > 1 && ps.color === null) return { error: 'Please choose a colour.' };
    for (const v of p.variants) if (!ps.opts[v.name]) return { error: `Please choose a ${v.name.toLowerCase()}.` };
    setQty(qtyInput.value);
    return { color: ps.color !== null ? p.colors[ps.color].name : '', opts: Object.assign({}, ps.opts), qty: ps.qty };
  }
  const addBtn = h('button', {
    type: 'button', class: 'btn btn-primary', disabled: !isInStock(p), onclick: () => {
      const sel = readSelection();
      if (sel.error) { errEl.textContent = sel.error; return; }
      const res = cartAdd(p, sel);
      if (!res.ok) { errEl.textContent = res.message; return; }
      errEl.textContent = '';
      toast('Added to your bag');
    }
  }, 'Add to cart');
  const buyBtn = h('button', {
    type: 'button', class: 'btn btn-secondary', disabled: !isInStock(p), onclick: () => {
      const sel = readSelection();
      if (sel.error) { errEl.textContent = sel.error; return; }
      errEl.textContent = '';
      startCheckout({ key: lineKey(p.id, sel.color, sel.opts), id: p.id, color: sel.color, opts: sel.opts, qty: sel.qty });
    }
  }, 'Order now');
  const wishInline = h('button', { type: 'button', class: 'wish-inline', 'data-wish-id': p.id, 'aria-pressed': 'false', onclick: () => toggleWish(p.id) }, icon('heart'), h('span', { class: 'wish-label' }, 'Add to wishlist'));

  const inStock = isInStock(p);
  const stockText = !inStock ? 'Out of stock' : (p.stock <= 5 ? `Only ${p.stock} left` : 'In stock');
  const specs = [['Material', p.material], ['Dimensions', p.dimensions], ['Care', p.care], ['SKU', p.sku]].filter(x => x[1]);

  const related = state.products.filter(x => x.id !== p.id && x.category === p.category).slice(0, 4);
  const relatedList = related.length ? related : state.products.filter(x => x.id !== p.id).slice(0, 4);

  root.append(
    h('nav', { class: 'breadcrumb', 'aria-label': 'Breadcrumb' },
      h('a', { href: '#/' }, 'Home'), ' / ',
      p.category ? h('a', { href: '#/shop?cat=' + encodeURIComponent(p.category) }, p.category) : null, p.category ? ' / ' : null,
      h('span', { 'aria-current': 'page' }, p.title)),
    h('div', { class: 'pdp' },
      h('div', { class: 'gallery' },
        h('div', { class: 'gallery-main' }, mainImg),
        p.images.length > 1 ? h('div', { class: 'thumbs' }, thumbs) : null),
      h('div', { class: 'pdp-info' },
        p.isSample ? h('span', { class: 'sample-note' }, 'Demo product') : null,
        h('h1', null, p.title),
        p.subtitle ? h('p', { class: 'pdp-sub' }, p.subtitle) : null,
        priceBlock(p, 'price pdp-price'),
        p.colors.length ? h('div', { class: 'pdp-block' },
          h('p', { class: 'pdp-label' }, 'Colour: ', colorName),
          h('div', { class: 'swatches large', role: 'group', 'aria-label': 'Choose a colour' }, swatchBtns)) : null,
        variantBlocks,
        h('p', { class: inStock ? 'stock-ok' : 'stock-out' }, stockText),
        h('div', { class: 'pdp-block' }, h('p', { class: 'pdp-label' }, 'Quantity'), h('div', { class: 'qty' }, minus, qtyInput, plus)),
        errEl,
        h('div', { class: 'pdp-actions' }, addBtn, buyBtn, wishInline),
        h('p', { class: 'hint', style: 'margin-top:.8rem' }, 'Tap Order now and we will confirm details and payment with you on WhatsApp.'),
        p.description ? h('div', { class: 'pdp-block' }, p.description.split(/\n+/).map(t => h('p', null, t))) : null,
        specs.length ? h('ul', { class: 'spec-list' }, specs.map(([k, v]) => h('li', null, h('b', null, k), h('span', null, v)))) : null,
        h('div', { class: 'accordion' },
          accordionItem('Shipping', CONFIG.shipping.info),
          accordionItem('Returns', CONFIG.returns.info),
          accordionItem('How ordering works', 'Place your order with your phone number and address. We then chat with you on WhatsApp to confirm availability, share payment details and take care of any customisation.')))),
    relatedList.length ? h('section', { class: 'related', 'aria-labelledby': 'relTitle' }, h('h2', { id: 'relTitle' }, 'You may also like'), h('div', { class: 'product-grid' }, relatedList.map(productCard))) : null);

  setQty(1);
  paint();
  syncWishButtons();
  const meta = $('meta[name="description"]');
  if (meta) meta.setAttribute('content', (p.subtitle || p.description || CONFIG.tagline).slice(0, 155));
  return `${p.title} | ${CONFIG.brandName}`;
}

/* ==========================================================
   13. WISHLIST PAGE
   ========================================================== */
function renderWishlist() {
  const root = $('#wishlistRoot');
  root.replaceChildren();
  const items = state.wishlist.map(findProduct).filter(Boolean);
  const wrap = h('div', { class: 'page-pad' },
    h('h1', null, 'Wishlist'),
    h('p', { class: 'muted' }, 'Saved on this device only. Syncing across devices needs customer accounts and a backend.'));
  if (!items.length) {
    wrap.append(emptyState('Your wishlist is empty', 'Tap the heart on anything you love and it will wait for you here.', 'Discover the collection', '#/shop'));
  } else {
    items.forEach(p => {
      const ok = isInStock(p);
      const addAction = !ok ? h('button', { type: 'button', class: 'btn btn-ghost small', disabled: true }, 'Out of stock')
        : needsChoice(p) ? h('a', { class: 'btn btn-primary small', href: '#/product/' + encodeURIComponent(p.id) }, 'Choose options')
          : h('button', {
            type: 'button', class: 'btn btn-primary small', onclick: () => {
              const res = cartAdd(p, { color: p.colors[0] ? p.colors[0].name : '', opts: {}, qty: 1 });
              toast(res.ok ? 'Added to your bag' : res.message);
            }
          }, 'Add to cart');
      wrap.append(h('div', { class: 'list-row' },
        h('a', { href: '#/product/' + encodeURIComponent(p.id), 'aria-label': 'View ' + p.title }, h('img', { src: resolveImg(p.images[0]), alt: p.title, width: 84, height: 104, loading: 'lazy' })),
        h('div', null,
          h('h2', null, h('a', { href: '#/product/' + encodeURIComponent(p.id) }, p.title)),
          priceBlock(p),
          h('p', { class: ok ? 'stock-ok' : 'stock-out', style: 'margin:.3rem 0 0;font-size:.85rem' }, ok ? 'In stock' : 'Out of stock'),
          h('div', { class: 'list-actions' }, addAction,
            h('button', { type: 'button', class: 'btn btn-ghost small', onclick: () => toggleWish(p.id) }, 'Remove')))));
    });
  }
  root.append(wrap);
  syncWishButtons();
}

/* ==========================================================
   14. CART DRAWER
   ========================================================== */
function qtyControl(line, onChange) {
  const input = h('input', { type: 'number', min: 1, max: line.max, value: line.qty, inputmode: 'numeric', 'aria-label': `Quantity for ${line.p.title}` });
  input.addEventListener('change', () => onChange(Number(input.value)));
  return h('div', { class: 'qty' },
    h('button', { type: 'button', 'aria-label': 'Decrease quantity', disabled: line.qty <= 1, onclick: () => onChange(line.qty - 1) }, icon('minus')),
    input,
    h('button', { type: 'button', 'aria-label': 'Increase quantity', disabled: line.qty >= line.max, onclick: () => onChange(line.qty + 1) }, icon('plus')));
}
const lineMeta = l => [l.color ? l.color.name : '', ...Object.entries(l.opts).map(([k, v]) => `${k}: ${v}`)].filter(Boolean).join(' · ');

function totalsBlock(totals, lines) {
  const sh = CONFIG.shipping;
  return h('div', { class: 'totals' },
    h('div', null, h('span', null, 'Subtotal'), h('span', null, fmt(totals.subtotal))),
    h('div', null, h('span', null, 'Delivery'), h('span', null, sh.configured ? (totals.shipping ? fmt(totals.shipping) : 'Free') : 'Confirmed on WhatsApp')),
    h('div', { class: 'grand' }, h('span', null, 'Total'), h('span', null, fmt(totals.total))));
}

function renderCartDrawer() {
  const body = $('#cartBody'), foot = $('#cartFooter');
  body.replaceChildren(); foot.replaceChildren();
  const lines = cartLines();
  if (!lines.length) {
    body.append(emptyState('Your bag is empty', 'Add a little something and it will show up here.'));
    foot.append(h('button', { type: 'button', class: 'btn btn-primary block', onclick: () => { Layers.close(); location.hash = '#/shop'; } }, 'Continue shopping'));
    return;
  }
  lines.forEach(l => {
    body.append(h('div', { class: 'cart-line' },
      h('img', { src: resolveImg(l.img), alt: l.p.title, width: 76, height: 96, loading: 'lazy' }),
      h('div', null,
        h('h3', null, h('a', { href: '#/product/' + encodeURIComponent(l.p.id) }, l.p.title)),
        h('div', { class: 'line-meta' }, l.color ? h('span', { class: 'dot', style: `--dot:${l.color.hex}` }) : null, lineMeta(l) || null),
        !l.inStock ? h('p', { class: 'line-warn' }, 'Out of stock. Please remove this item.') : null,
        h('div', { class: 'line-bottom' },
          l.inStock ? qtyControl(l, q => cartSetQty(l.key, q)) : null,
          h('strong', null, `${fmt(l.unit)} × ${l.qty} = ${fmt(l.total)}`)),
        h('button', { type: 'button', class: 'text-link', style: 'margin-top:.5rem', onclick: () => cartRemove(l.key), 'aria-label': 'Remove ' + l.p.title }, 'Remove'))));
  });
  const totals = computeTotals(lines);
  const blocked = lines.some(l => !l.inStock) || totals.subtotal <= 0;
  foot.append(totalsBlock(totals, lines),
    h('div', { class: 'footer-stack' },
      h('button', { type: 'button', class: 'btn btn-primary block', disabled: blocked, onclick: () => startCheckout(null) }, 'Order these items'),
      h('button', { type: 'button', class: 'btn btn-ghost block', onclick: () => { Layers.close(); location.hash = '#/shop'; } }, 'Continue shopping')));
}

/* ==========================================================
   15. ACCOUNT (prototype only: no real authentication)
   ========================================================== */
let accountTab = 'signin';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function passwordField(id, label, autocomplete) {
  const input = h('input', { id, type: 'password', autocomplete, maxlength: 100 });
  const toggle = h('button', { type: 'button', class: 'icon-btn small', 'aria-label': 'Show password', 'aria-pressed': 'false' }, icon('eye'));
  toggle.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(show));
    toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    toggle.replaceChildren(icon(show ? 'eye-off' : 'eye'));
  });
  const err = h('p', { class: 'field-error', id: 'err-' + id, role: 'alert' });
  input.setAttribute('aria-describedby', 'err-' + id);
  return { input, err, node: h('div', { class: 'field' }, h('label', { for: id }, label), h('div', { class: 'input-with-btn' }, input, toggle), err) };
}

function renderAccount() {
  const root = $('#accountRoot');
  root.replaceChildren();
  const wrap = h('div', { class: 'page-pad' }, h('h1', null, 'Account'));
  wrap.append(h('p', { class: 'notice' }, 'Demo only: customer accounts are not connected to a real login yet, and passwords are never stored or checked here. You do not need an account to order.'));

  if (state.user) {
    const hist = h('div', { class: 'panel' }, h('h2', null, 'Orders'), h('p', { class: 'muted' }, 'Orders are confirmed with us on WhatsApp, so there is no order history here yet.'));
    wrap.append(hist);
    root.append(wrap);
    return;
  }

  const creating = accountTab === 'signup';
  const tab = (id, label) => h('button', { type: 'button', class: 'tab', role: 'tab', 'aria-selected': String(accountTab === id), onclick: () => { accountTab = id; renderAccount(); } }, label);
  const form = h('form', { class: 'form-stack', novalidate: true });
  const nameIn = h('input', { id: 'acName', type: 'text', autocomplete: 'name', maxlength: 80 });
  const nameErr = h('p', { class: 'field-error', id: 'err-acName', role: 'alert' });
  const emailIn = h('input', { id: 'acEmail', type: 'email', autocomplete: 'email', maxlength: 120, 'aria-describedby': 'err-acEmail' });
  const emailErr = h('p', { class: 'field-error', id: 'err-acEmail', role: 'alert' });
  const pw = passwordField('acPass', 'Password', creating ? 'new-password' : 'current-password');
  if (creating) form.append(h('div', { class: 'field' }, h('label', { for: 'acName' }, 'Full name'), nameIn, nameErr));
  form.append(h('div', { class: 'field' }, h('label', { for: 'acEmail' }, 'Email'), emailIn, emailErr), pw.node,
    h('button', { type: 'submit', class: 'btn btn-primary' }, creating ? 'Create account' : 'Sign in'));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    nameErr.textContent = ''; emailErr.textContent = ''; pw.err.textContent = '';
    if (creating && nameIn.value.trim().length < 2) { nameErr.textContent = 'Please enter your name.'; ok = false; }
    if (!EMAIL_RE.test(emailIn.value.trim())) { emailErr.textContent = 'Enter a valid email address.'; ok = false; }
    if (pw.input.value.length < 8) { pw.err.textContent = 'Password must be at least 8 characters.'; ok = false; }
    if (!ok) return;
    const email = emailIn.value.trim().toLowerCase();
    state.user = { name: creating ? nameIn.value.trim() : email.split('@')[0], email };
    Store.set(KEYS.user, state.user); // no password is stored
    toast(creating ? 'Prototype account created' : 'Signed in (prototype)');
    renderAccount();
  });
  wrap.append(h('div', { class: 'panel' }, h('div', { class: 'tabs', role: 'tablist' }, tab('signin', 'Sign in'), tab('signup', 'Create account')), form));
  root.append(wrap);
}

/* ==========================================================
   16. ORDER REQUEST (details -> saved + emailed to you -> WhatsApp)
   No online payment: money and customisation are handled on WhatsApp.
   ========================================================== */
const STEP_LABELS = ['Review', 'Details', 'Confirm', 'Done'];

function startCheckout(buyNow) {
  const co = state.checkout;
  co.buyNow = buyNow || null; co.step = 1; co.lastOrder = null;
  saveCheckout();
  Layers.close();
  if (location.hash === '#/checkout') renderCheckout(); else location.hash = '#/checkout';
}
function checkoutLines() {
  const co = state.checkout;
  if (co.buyNow) { const l = resolveLine(co.buyNow); return l ? [l] : []; }
  return cartLines();
}
function goStep(n) {
  state.checkout.step = clamp(n, 1, 3);
  saveCheckout();
  renderCheckout();
  const top = $('#checkoutRoot').getBoundingClientRect().top + window.scrollY - 90;
  window.scrollTo({ top: Math.max(0, top) });
}

/* ---- validation ---- */
function normalizePhone(v) {
  const m = String(v || '').replace(/[\s\-()]/g, '').match(/^(?:\+?91|0)?([6-9]\d{9})$/);
  return m ? m[1] : '';
}
const V = {
  name: v => (v.trim().length >= 2 ? '' : 'Please enter your full name.'),
  email: v => (!v.trim() || EMAIL_RE.test(v.trim()) ? '' : 'Please enter a valid email address, or leave it empty.'),
  phone: v => (normalizePhone(v) ? '' : 'Enter a valid 10-digit Indian mobile number (starting with 6 to 9).'),
  phone2: v => (!v.trim() || normalizePhone(v) ? '' : 'Enter a valid 10-digit mobile number, or leave this empty.'),
  req: label => v => (v.trim() ? '' : `${label} is required.`),
  pin: v => (/^[1-9]\d{5}$/.test(v.trim()) ? '' : 'Enter a valid 6-digit PIN code.')
};

/* Builds a validated form from a list of field definitions */
function formFromSpec(spec, data, { submitLabel, onValid, onBack }) {
  const form = h('form', { class: 'form-stack', novalidate: true });
  const refs = {};
  spec.forEach(f => {
    const id = 'co-' + f.key;
    const err = h('p', { class: 'field-error', id: 'err-' + id, role: 'alert' });
    let input;
    if (f.type === 'select') {
      input = h('select', { id, name: f.key, autocomplete: f.autocomplete }, h('option', { value: '' }, 'Select state'), ...INDIAN_STATES.map(s => h('option', { value: s }, s)));
      input.value = data[f.key] || '';
    } else if (f.type === 'textarea') {
      input = h('textarea', { id, name: f.key, rows: 3, maxlength: f.maxlength || 300, placeholder: f.placeholder });
      input.value = data[f.key] || '';
    } else {
      input = h('input', { id, name: f.key, type: f.type || 'text', autocomplete: f.autocomplete, inputmode: f.inputmode, maxlength: f.maxlength || 120, value: data[f.key] || '' });
    }
    input.setAttribute('aria-describedby', 'err-' + id);
    const sync = () => { data[f.key] = input.value; saveCheckout(); if (err.textContent) { err.textContent = ''; input.setAttribute('aria-invalid', 'false'); } };
    input.addEventListener('input', sync); input.addEventListener('change', sync);
    form.append(h('div', { class: 'field' },
      h('label', { for: id }, f.label, f.optional ? h('span', { class: 'opt' }, ' (optional)') : h('span', { class: 'req', 'aria-hidden': 'true' }, ' *')),
      input, f.hint ? h('p', { class: 'hint' }, f.hint) : null, err));
    refs[f.key] = { input, err };
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let first = null;
    spec.forEach(f => {
      const { input, err } = refs[f.key];
      const msg = f.validate ? f.validate(data[f.key] || '') : '';
      err.textContent = msg;
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg && !first) first = input;
    });
    if (first) { first.focus(); return; }
    onValid();
  });
  form.append(h('div', { class: 'btn-row' },
    onBack ? h('button', { type: 'button', class: 'btn btn-ghost', onclick: onBack }, 'Back') : null,
    h('button', { type: 'submit', class: 'btn btn-primary' }, submitLabel)));
  return form;
}

const DETAILS_SPEC = [
  { key: 'name', label: 'Full name', autocomplete: 'name', validate: V.name },
  { key: 'phone', label: 'Phone number', type: 'tel', autocomplete: 'tel', inputmode: 'tel', validate: V.phone, hint: '10-digit Indian mobile number. We will chat with you here.' },
  { key: 'phone2', label: 'Second phone number', type: 'tel', autocomplete: 'off', inputmode: 'tel', optional: true, validate: V.phone2 },
  { key: 'email', label: 'Email', type: 'email', autocomplete: 'email', optional: true, validate: V.email },
  { key: 'house', label: 'House / building details', autocomplete: 'address-line1', validate: V.req('House or building details') },
  { key: 'street', label: 'Street / locality', autocomplete: 'address-line2', validate: V.req('Street or locality') },
  { key: 'city', label: 'City', autocomplete: 'address-level2', validate: V.req('City') },
  { key: 'state', label: 'State', type: 'select', autocomplete: 'address-level1', validate: V.req('State') },
  { key: 'pin', label: 'PIN code', autocomplete: 'postal-code', inputmode: 'numeric', maxlength: 6, validate: V.pin },
  { key: 'landmark', label: 'Landmark', optional: true, autocomplete: 'off' },
  { key: 'notes', label: 'Notes or customisation', type: 'textarea', optional: true, placeholder: 'Colour choice, name engraving, gift wrap…' }
];

/* ---- layout pieces ---- */
function summaryLine(l) {
  return h('div', { class: 'sum-line' },
    h('img', { src: resolveImg(l.img), alt: '', width: 56, height: 66, loading: 'lazy' }),
    h('div', null, h('b', null, l.p.title), h('span', { class: 'muted' }, [lineMeta(l), `Qty ${l.qty}`].filter(Boolean).join(' · '))),
    h('strong', null, fmt(l.total)));
}
function summaryCard(lines) {
  return h('aside', { class: 'summary-card', 'aria-label': 'Order summary' },
    h('h2', null, 'Order summary'), lines.map(summaryLine), totalsBlock(computeTotals(lines), lines));
}
function progressBar(step) {
  return h('ol', { class: 'progress', 'aria-label': 'Order progress' }, STEP_LABELS.map((label, i) =>
    h('li', { class: i + 1 < step ? 'done' : i + 1 === step ? 'current' : '', 'aria-current': i + 1 === step ? 'step' : null }, h('span', null, label))));
}
function recapBox(title, lines, editStep) {
  return h('div', { class: 'recap-box' },
    h('h3', null, title, h('button', { type: 'button', onclick: () => goStep(editStep) }, 'Edit')),
    lines.filter(Boolean).map(t => h('p', null, t)));
}
function addressLines(a) {
  return [a.house, a.street, [a.city, a.state].filter(Boolean).join(', ') + (a.pin ? ' ' + a.pin : ''), a.landmark ? 'Landmark: ' + a.landmark : ''].filter(Boolean);
}
const itemMeta = i => [i.color, ...Object.entries(i.opts || {}).map(([k, v]) => `${k}: ${v}`)].filter(Boolean).join(', ');

function renderCheckout() {
  const root = $('#checkoutRoot');
  root.replaceChildren();
  const co = state.checkout;
  if (co.step === 4 && co.lastOrder) { root.append(buildConfirmation(co.lastOrder)); return; }
  if (co.step > 3 || co.step < 1) co.step = 1;
  const lines = checkoutLines();
  const wrap = h('div', { class: 'checkout-wrap' });
  if (!lines.length) {
    wrap.append(h('h1', null, 'Place your order'), emptyState('Your bag is empty', 'Add something lovely before ordering.', 'Continue shopping', '#/shop'));
    root.append(wrap);
    return;
  }
  let panel;
  if (co.step === 1) panel = stepReview(lines);
  else if (co.step === 2) panel = h('div', null, h('h2', null, 'Your details and delivery address'),
    formFromSpec(DETAILS_SPEC, co.details, { submitLabel: 'Continue', onValid: () => goStep(3), onBack: () => goStep(1) }));
  else panel = stepConfirm(lines);
  wrap.append(h('h1', { style: 'font-size:clamp(1.8rem,5vw,2.6rem)' }, 'Place your order'), progressBar(co.step),
    h('div', { class: 'checkout-grid' }, h('div', { class: 'step-panel' }, panel), summaryCard(lines)));
  root.append(wrap);
}

function stepReview(lines) {
  const allOk = lines.every(l => l.inStock);
  return h('div', null,
    h('h2', null, 'Review your order'),
    lines.map(summaryLine),
    !allOk ? h('p', { class: 'form-error-box', style: 'margin-top:1rem' }, 'Some items are out of stock. Please remove them from your bag to continue.') : null,
    h('div', { class: 'btn-row' },
      state.checkout.buyNow
        ? h('a', { class: 'btn btn-ghost', href: '#/product/' + encodeURIComponent(state.checkout.buyNow.id) }, 'Change selection')
        : h('button', { type: 'button', class: 'btn btn-ghost', onclick: () => Layers.open($('#cartDrawer')) }, 'Edit bag'),
      h('button', { type: 'button', class: 'btn btn-primary', disabled: !allOk, onclick: () => goStep(2) }, 'Continue')));
}

function detailsToOrderParts(d) {
  return {
    customer: { name: d.name.trim(), phone: normalizePhone(d.phone), phone2: normalizePhone(d.phone2) || '', email: d.email.trim() },
    address: { house: d.house.trim(), street: d.street.trim(), city: d.city.trim(), state: d.state, pin: d.pin.trim(), landmark: d.landmark.trim() },
    notes: (d.notes || '').trim()
  };
}

function stepConfirm(lines) {
  const d = state.checkout.details;
  const p = detailsToOrderParts(d);
  const errBox = h('div', { class: 'pay-error' });
  // Hidden "trap" field: real people never fill it, simple spam bots do
  const honey = h('input', { type: 'text', name: 'website', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true', class: 'sr-only' });
  const btn = h('button', { type: 'button', class: 'btn btn-primary' }, 'Confirm my order');
  btn.addEventListener('click', async () => {
    errBox.replaceChildren();
    btn.disabled = true; btn.textContent = 'Placing your order…';
    try { await placeOrder(lines, honey.value, errBox); }
    catch (e) { errBox.append(h('p', { class: 'form-error-box', role: 'alert' }, e.message || 'Something went wrong. Please try again.')); }
    finally { btn.disabled = false; btn.textContent = 'Confirm my order'; }
  });
  return h('div', null,
    h('h2', null, 'Confirm your order'),
    h('div', { class: 'recap' },
      recapBox('Contact', [p.customer.name, 'Phone: ' + p.customer.phone, p.customer.phone2 ? 'Second phone: ' + p.customer.phone2 : '', p.customer.email], 2),
      recapBox('Delivery address', addressLines(p.address), 2),
      p.notes ? recapBox('Notes', [p.notes], 2) : null),
    h('p', { class: 'prepaid-note' }, 'Next, we will open WhatsApp so we can confirm your order, share payment details and sort out any customisation with you.'),
    h('p', { class: 'hint' }, 'We use your name, phone number and address only to deliver your order and chat with you.'),
    honey, errBox,
    h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn btn-ghost', onclick: () => goStep(2) }, 'Back'), btn));
}

/* ---- building the order + messages ---- */
function makeOrderNumber() {
  const d = new Date();
  const ymd = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  return `EV-${ymd}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
function waNumber() {
  let d = String(CONFIG.whatsappNumber || '918220214045').replace(/\D/g, '');
  if (d.length === 10) d = '91' + d; // assume India when no country code is given
  return d;
}
/* The WhatsApp message is written from the products in the order */
function buildWhatsAppText(o, withAddress) {
  const L = ['Hi ei8htverse! 🌸'];
  if (o.items.length === 1) {
    const i = o.items[0];
    L.push(`I'd like to order the *${i.title}*${itemMeta(i) ? ` (${itemMeta(i)})` : ''} × ${i.qty} (${fmt(i.total)}).`);
  } else {
    L.push("I'd like to order:");
    o.items.forEach((i, k) => L.push(`${k + 1}. *${i.title}*${itemMeta(i) ? ` (${itemMeta(i)})` : ''} × ${i.qty} = ${fmt(i.total)}`));
    L.push(`Total: ${fmt(o.total)}`);
  }
  L.push('', `Order ID: ${o.id}`, `Name: ${o.customer.name}`);
  if (withAddress) L.push(`Phone: ${o.customer.phone}`, 'Address:', ...addressLines(o.address));
  if (o.notes) L.push('', 'Note: ' + o.notes);
  L.push('', 'Could you please confirm availability and share the payment details? Thank you! 💕');
  return L.join('\n');
}
function buildWhatsAppUrl(o, withAddress) {
  const n = waNumber();
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(buildWhatsAppText(o, withAddress))}` : '';
}
function buildOwnerEmailText(o) {
  const L = [`NEW ORDER ${o.id}`, new Date(o.createdAt).toLocaleString('en-IN'), '', 'CUSTOMER', `Name: ${o.customer.name}`, `Phone: ${o.customer.phone}`];
  if (o.customer.phone2) L.push(`Second phone: ${o.customer.phone2}`);
  if (o.customer.email) L.push(`Email: ${o.customer.email}`);
  L.push('', 'DELIVERY ADDRESS', ...addressLines(o.address), '', 'ITEMS');
  o.items.forEach((i, k) => L.push(`${k + 1}. ${i.title}${itemMeta(i) ? ` (${itemMeta(i)})` : ''}  SKU ${i.sku || '-'}  x${i.qty}  @ ${fmt(i.unit)} = ${fmt(i.total)}`));
  L.push('', `TOTAL: ${fmt(o.total)}  (delivery charge, if any, to be confirmed on WhatsApp)`);
  if (o.notes) L.push('', 'NOTES', o.notes);
  L.push('', `WhatsApp the customer: https://wa.me/91${o.customer.phone}`);
  return L.join('\n');
}

/* true when at least one email channel is configured */
const hasEmailChannel = () => !!(CONFIG.orders.appsScriptUrl || CONFIG.orders.web3formsKey);

/* Sends data to your Google Apps Script web app. "text/plain" avoids a browser permission pre-check
   that Apps Script cannot answer. The script replies { ok: true } once the order row is saved. */
async function postToAppsScript(payload) {
  const res = await fetch(CONFIG.orders.appsScriptUrl, {
    method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(Object.assign({ secret: CONFIG.orders.appsScriptSecret }, payload))
  });
  const j = await res.json();
  if (!j || j.ok !== true) throw new Error((j && j.error) || 'Apps Script error');
  return j;
}

/* Sends a notification email to YOU through Web3Forms (free; needs CONFIG.orders.web3formsKey) */
async function postToWeb3Forms(subject, fields) {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(Object.assign({ access_key: CONFIG.orders.web3formsKey, subject, from_name: 'ei8htverse website', botcheck: '' }, fields))
  });
  let j = {};
  try { j = await res.json(); } catch (e) { /* ignore */ }
  if (!res.ok || j.success === false) throw new Error(j.message || 'Email service error');
}

/* Contact / newsletter messages to you */
async function sendOwnerEmail(subject, fields) {
  if (CONFIG.orders.appsScriptUrl) return postToAppsScript({ type: 'message', subject, name: fields.name, email: fields.email, message: fields.message });
  return postToWeb3Forms(subject, fields);
}

async function placeOrder(lines, honeyValue, errBox) {
  if (!lines.length || lines.some(l => !l.inStock)) { errBox.append(h('p', { class: 'form-error-box', role: 'alert' }, 'Some items are no longer available. Please review your bag.')); return; }
  const parts = detailsToOrderParts(state.checkout.details);
  const order = Object.assign({
    id: makeOrderNumber(), createdAt: new Date().toISOString(),
    items: lines.map(l => ({ productId: l.p.id, title: l.p.title, sku: l.p.sku, color: l.color ? l.color.name : '', opts: l.opts, qty: l.qty, unit: l.unit, total: l.total })),
    total: computeTotals(lines).total
  }, parts);

  let saved = false, emailed = false;
  if (!honeyValue) {
    const jobs = [];
    if (SB.enabled && CONFIG.orders.saveToDatabase) jobs.push(SB.insertOrder(order).then(() => { saved = true; }, e => console.warn('Order was not saved to the database', e)));
    if (CONFIG.orders.appsScriptUrl) {
      jobs.push(postToAppsScript({ type: 'order', order }).then(() => { emailed = true; }, e => console.warn('Order was not sent to Google Apps Script', e)));
    } else if (CONFIG.orders.web3formsKey) {
      jobs.push(postToWeb3Forms(`New order ${order.id} from ${order.customer.name}`, {
        name: order.customer.name, email: order.customer.email || CONFIG.contactEmail, phone: order.customer.phone, order_id: order.id, message: buildOwnerEmailText(order)
      }).then(() => { emailed = true; }, e => console.warn('Order email was not sent', e)));
    }
    await Promise.race([Promise.allSettled(jobs), new Promise(r => setTimeout(r, 9000))]);
  }
  // If neither the database nor the email worked, put the full address in the WhatsApp message so the order is never lost
  order.waUrl = honeyValue ? '' : buildWhatsAppUrl(order, !(saved || emailed));
  finalizeOrder(order);
}

function finalizeOrder(order) {
  const co = state.checkout;
  co.lastOrder = order; co.step = 4; co.details.notes = '';
  const usedBuyNow = !!co.buyNow;
  co.buyNow = null;
  saveCheckout();
  if (!usedBuyNow) { state.cart = []; saveCart(); }
  refreshCartUI();
  renderCheckout();
  window.scrollTo({ top: 0 });
  if (order.waUrl) setTimeout(() => { if (location.hash === '#/checkout' && state.checkout.lastOrder === order) window.location.href = order.waUrl; }, 1800);
}

/* ---- confirmation ---- */
function checkSvg() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'check-anim'); svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('aria-hidden', 'true');
  const c = document.createElementNS(SVG_NS, 'circle'); c.setAttribute('cx', '50'); c.setAttribute('cy', '50'); c.setAttribute('r', '46');
  const p = document.createElementNS(SVG_NS, 'path'); p.setAttribute('d', 'M30 52l14 14 27-30');
  svg.append(c, p);
  return svg;
}

function buildConfirmation(o) {
  const first = (o.customer.name || '').split(' ')[0];
  const box = h('div', { class: 'confirm' },
    checkSvg(),
    h('h1', { style: 'font-size:clamp(1.9rem,6vw,2.8rem)', tabindex: '-1', id: 'confirmHeading' }, first ? `Thank you, ${first}!` : 'Thank you!'),
    h('p', { class: 'lead', style: 'margin-inline:auto' }, o.waUrl
      ? 'Your order is placed. We are opening WhatsApp so we can confirm everything and share payment details with you.'
      : 'Your order is placed. We will contact you on the phone number you gave us to confirm everything.'),
    h('div', { class: 'confirm-card' },
      h('dl', null,
        h('dt', null, 'Order ID'), h('dd', null, o.id),
        h('dt', null, 'Date'), h('dd', null, new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })),
        h('dt', null, 'Total'), h('dd', null, fmt(o.total) + ' (payment is arranged on WhatsApp)')),
      h('div', null, h('strong', null, 'Items'),
        o.items.map(i => h('p', { style: 'margin:.3rem 0 0;font-size:.92rem' }, `${i.title}${itemMeta(i) ? ' (' + itemMeta(i) + ')' : ''} × ${i.qty} · ${fmt(i.total)}`))),
      h('div', null, h('strong', null, 'Delivery address'), h('p', { style: 'margin:.3rem 0 0;font-size:.92rem' }, o.customer.name), addressLines(o.address).map(t => h('p', { style: 'margin:0;font-size:.92rem' }, t)))),
    h('div', { class: 'btn-row', style: 'justify-content:center' },
      o.waUrl ? h('a', { class: 'btn btn-primary', href: o.waUrl }, 'Open WhatsApp') : null,
      h('button', { type: 'button', class: o.waUrl ? 'btn btn-ghost' : 'btn btn-primary', onclick: () => { state.checkout.lastOrder = null; state.checkout.step = 1; saveCheckout(); location.hash = '#/shop'; } }, 'Continue shopping')));
  setTimeout(() => { const hd = $('#confirmHeading'); if (hd) hd.focus({ preventScroll: true }); }, 50);
  return box;
}

/* ==========================================================
   17. ADMIN PANEL (products + orders, saved in Supabase)
   ========================================================== */
let failedLogins = 0, lockUntil = 0;
const formState = { id: null, images: [null, null, null, null], colors: [] };

function requireAdmin() {
  if (state.admin) return true;
  $('#adminDeniedMsg').hidden = false;
  renderAdmin();
  return false;
}

function renderAdmin() {
  $('#adminLoginPanel').hidden = state.admin;
  $('#adminDash').hidden = !state.admin;
  if (!state.admin) return;
  if (!state.ordersLoaded) { state.ordersLoaded = true; loadOrders(); }
  const list = state.products;
  const inStock = list.filter(isInStock).length;
  $('#statTotal').textContent = String(list.length);
  $('#statIn').textContent = String(inStock);
  $('#statOut').textContent = String(list.length - inStock);
  const body = $('#adminTableBody');
  body.replaceChildren();
  if (!list.length) { body.append(h('tr', null, h('td', { colspan: 8, class: 'muted' }, 'No products yet. Click "Add product".'))); return; }
  list.forEach(p => body.append(h('tr', null,
    h('td', null, h('img', { src: resolveImg(p.images[0]), alt: '', width: 48, height: 48, loading: 'lazy' })),
    h('td', null, p.title, p.isSample ? h('span', { class: 'muted' }, ' (sample)') : null),
    h('td', null, p.category),
    h('td', null, fmt(p.price)),
    h('td', null, p.originalPrice ? fmt(p.originalPrice) : '—'),
    h('td', null, String(p.stock)),
    h('td', null, h('span', { class: 'status-pill' + (isInStock(p) ? '' : ' out') }, isInStock(p) ? 'In stock' : 'Out of stock')),
    h('td', null, h('div', { class: 'row-actions' },
      h('button', { type: 'button', class: 'icon-btn small', 'aria-label': 'Edit ' + p.title, onclick: () => openProductForm(p) }, icon('edit')),
      h('button', { type: 'button', class: 'icon-btn small', 'aria-label': 'Delete ' + p.title, onclick: () => deleteProduct(p) }, icon('trash')))))));
}

function initAdmin() {
  $('#adminPassToggle').addEventListener('click', e => {
    const input = $('#adminPass');
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    e.currentTarget.setAttribute('aria-pressed', String(show));
    e.currentTarget.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    e.currentTarget.replaceChildren(icon(show ? 'eye-off' : 'eye'));
  });
  $('#adminLoginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const err = $('#adminLoginError');
    const u = $('#adminUser').value.trim(), pw = $('#adminPass').value;
    if (!SB.enabled) { err.textContent = 'Supabase is not connected yet. Add your URL and key in CONFIG.supabase.'; return; }
    if (Date.now() < lockUntil) { err.textContent = `Too many attempts. Try again in ${Math.ceil((lockUntil - Date.now()) / 1000)} seconds.`; return; }
    if (!u || !pw) { err.textContent = 'Enter both your admin email and password.'; return; }
    const btn = $('#adminLoginForm button[type="submit"]');
    btn.disabled = true; err.textContent = '';
    try {
      await SB.signIn(u, pw);
      failedLogins = 0;
      state.admin = true;
      $('#adminPass').value = ''; $('#adminDeniedMsg').hidden = true;
      renderAdmin();
    } catch (ex) {
      failedLogins++;
      if (failedLogins >= 5) { lockUntil = Date.now() + 30000; failedLogins = 0; }
      err.textContent = ex.status === 400 || ex.status === 401 ? 'Incorrect email or password.' : (ex.message || 'Could not sign in. Check your internet connection.');
      $('#adminDeniedMsg').hidden = false;
    } finally { btn.disabled = false; }
  });
  $('#adminLogout').addEventListener('click', async () => { await SB.signOut(); state.admin = false; state.orders = []; state.ordersLoaded = false; $('#adminDeniedMsg').hidden = true; renderAdmin(); toast('Logged out'); });
  $('#ordersRefresh').addEventListener('click', () => loadOrders());
  $('#adminAdd').addEventListener('click', () => { if (requireAdmin()) openProductForm(null); });
  $('#adminReset').addEventListener('click', async () => {
    if (!requireAdmin()) return;
    if (!(await confirmAction('Add the 10 starter products to your database? Products with the same ID are reset to their starter values. Your other products are kept.', 'Add starter products'))) return;
    try {
      const starters = seedProducts();
      await SB.upsert(starters);
      const ids = new Set(starters.map(p => p.id));
      state.products = starters.concat(state.products.filter(p => !ids.has(p.id)));
      persistProducts(); renderAdmin(); refreshCartUI(); syncWishButtons(); toast('Starter products added');
    } catch (ex) { handleAdminError(ex); }
  });

  // product form
  $('#pCategory').replaceChildren(h('option', { value: '' }, 'Select category'), ...CONFIG.categories.map(c => h('option', { value: c.name }, c.name)));
  $('#pCancel').addEventListener('click', () => $('#productDialog').close());
  $('#pCancelTop').addEventListener('click', () => $('#productDialog').close());
  $('#addColor').addEventListener('click', () => {
    if (formState.colors.length >= 12) { setErr('pColors', 'You can add up to 12 colours.'); return; }
    formState.colors.push({ name: '', hex: '#C87593', imageIndex: null });
    renderColorRows();
  });
  $('#productForm').addEventListener('submit', e => { e.preventDefault(); saveProductForm(); });
}

/* ---- orders (read by the signed-in admin only) ---- */
const ORDER_STATUSES = [['new', 'New'], ['chatting', 'Chatting on WhatsApp'], ['confirmed', 'Confirmed / paid'], ['shipped', 'Shipped'], ['cancelled', 'Cancelled']];

async function loadOrders() {
  const note = $('#ordersNote');
  if (!SB.enabled || !state.admin) return;
  note.textContent = 'Loading orders…';
  try {
    await SB.needAdmin();
    const rows = await SB.request('/rest/v1/orders?select=*&order=created_at.desc&limit=200', { headers: SB.authHeaders() });
    state.orders = Array.isArray(rows) ? rows : [];
    note.textContent = state.orders.length ? '' : 'No orders yet. New orders will appear here and arrive in your email.';
    renderOrders();
  } catch (ex) {
    if (ex.expired) { state.admin = false; renderAdmin(); return; }
    note.textContent = 'Could not load orders: ' + (ex.message || 'unknown error') + '. Have you run the orders SQL in Supabase?';
  }
}

function renderOrders() {
  const box = $('#ordersList');
  box.replaceChildren();
  const fresh = state.orders.filter(o => o.status === 'new').length;
  $('#orderCount').textContent = state.orders.length ? `(${state.orders.length}${fresh ? `, ${fresh} new` : ''})` : '';
  state.orders.forEach(o => {
    const a = o.address && typeof o.address === 'object' ? o.address : {};
    const items = Array.isArray(o.items) ? o.items : [];
    const phone = normalizePhone(String(o.phone || '')) || String(o.phone || '').replace(/\D/g, '');
    const sel = h('select', { 'aria-label': 'Status of order ' + o.id }, ORDER_STATUSES.map(([v, l]) => h('option', { value: v }, l)));
    sel.value = o.status;
    sel.addEventListener('change', async () => {
      try {
        await SB.needAdmin();
        const rows = await SB.request('/rest/v1/orders?id=eq.' + encodeURIComponent(o.id), { method: 'PATCH', headers: Object.assign(SB.authHeaders(), { Prefer: 'return=representation' }), body: JSON.stringify({ status: sel.value }) });
        if (!Array.isArray(rows) || !rows.length) throw new Error('Could not update the order.');
        o.status = sel.value; renderOrders(); toast('Order updated');
      } catch (ex) { sel.value = o.status; handleAdminError(ex); }
    });
    box.append(h('div', { class: 'order-card' },
      h('div', { class: 'split-row' },
        h('strong', null, o.id), h('span', { class: 'muted' }, new Date(o.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })), sel),
      h('p', null, h('strong', null, o.customer_name || ''), ' · ', o.phone || '', o.phone2 ? ' / ' + o.phone2 : '', o.email ? ' · ' + o.email : ''),
      h('p', null, addressLines(a).join(', ')),
      h('ul', { class: 'order-items' }, items.map(i => h('li', null, `${i.title || ''}${itemMeta(i) ? ' (' + itemMeta(i) + ')' : ''} × ${i.qty} = ${fmt(Number(i.total))}`))),
      h('p', null, h('strong', null, 'Total: ' + fmt(Number(o.total)))),
      o.notes ? h('p', { class: 'muted' }, 'Note: ' + o.notes) : null,
      h('div', { class: 'btn-row' },
        h('a', { class: 'btn btn-primary small', href: `https://wa.me/91${phone}`, target: '_blank', rel: 'noopener noreferrer' }, 'WhatsApp customer'),
        h('a', { class: 'btn btn-ghost small', href: `tel:+91${phone}` }, 'Call'),
        h('button', { type: 'button', class: 'btn btn-ghost small', onclick: async () => {
          if (!(await confirmAction(`Delete order ${o.id}? This cannot be undone.`, 'Delete'))) return;
          try {
            await SB.needAdmin();
            const rows = await SB.request('/rest/v1/orders?id=eq.' + encodeURIComponent(o.id), { method: 'DELETE', headers: Object.assign(SB.authHeaders(), { Prefer: 'return=representation' }) });
            if (!Array.isArray(rows) || !rows.length) throw new Error('Could not delete the order.');
            state.orders = state.orders.filter(x => x.id !== o.id); renderOrders(); toast('Order deleted');
          } catch (ex) { handleAdminError(ex); }
        } }, 'Delete'))));
  });
}

const setErr = (id, msg) => {
  const el = $('#err-' + id); if (el) el.textContent = msg || '';
  const input = $('#' + id); if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
};
const FORM_FIELDS = ['pTitle', 'pSubtitle', 'pDesc', 'pCategory', 'pCollection', 'pSku', 'pStock', 'pPrice', 'pOriginal', 'pMaterial', 'pDimensions', 'pCare', 'pVariants'];

function openProductForm(p) {
  FORM_FIELDS.concat(['pImages', 'pColors']).forEach(id => setErr(id, ''));
  $('#productFormError').hidden = true;
  formState.id = p ? p.id : null;
  formState.images = [0, 1, 2, 3].map(i => (p && p.images[i]) || null);
  formState.colors = p ? p.colors.map(c => Object.assign({}, c)) : [];
  $('#productFormTitle').textContent = p ? 'Edit product' : 'Add product';
  const val = (id, v) => { $('#' + id).value = v == null ? '' : v; };
  const cat = $('#pCategory');
  if (p && p.category && !CONFIG.categories.some(c => c.name === p.category) && !$$('option', cat).some(o => o.value === p.category)) cat.append(h('option', { value: p.category }, p.category));
  val('pTitle', p && p.title); val('pSubtitle', p && p.subtitle); val('pDesc', p && p.description);
  val('pCategory', p && p.category); val('pCollection', p && p.collection); val('pSku', p && p.sku);
  val('pStock', p ? p.stock : ''); val('pPrice', p ? p.price : ''); val('pOriginal', p && p.originalPrice ? p.originalPrice : '');
  val('pMaterial', p && p.material); val('pDimensions', p && p.dimensions); val('pCare', p && p.care);
  val('pTags', p ? p.tags.join(', ') : '');
  val('pVariants', p ? p.variants.map(v => `${v.name}: ${v.options.join(', ')}`).join('\n') : '');
  val('pAvail', p ? p.availability : 'available');
  $('#pFeatured').checked = !!(p && p.featured); $('#pBest').checked = !!(p && p.bestseller); $('#pNew').checked = !!(p && p.isNew);
  renderImageSlots(); renderColorRows();
  $('#productDialog').showModal();
  $('#pTitle').focus();
}

/* Resize + compress so localStorage is not filled by huge pictures */
function processImage(file) {
  return new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { reject(new Error('Please choose a JPG, PNG or WebP image.')); return; }
    if (file.size > 5 * 1024 * 1024) { reject(new Error('That image is larger than 5 MB. Please choose a smaller one.')); return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 1200 / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(img.width * scale)); c.height = Math.max(1, Math.round(img.height * scale));
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#FFF7FA'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      let q = 0.74, data = c.toDataURL('image/jpeg', q);
      while (data.length > 600000 && q > 0.4) { q -= 0.1; data = c.toDataURL('image/jpeg', q); }
      resolve(data);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That file could not be read as an image.')); };
    img.src = url;
  });
}

function swapImages(i, j) {
  if (j < 0 || j > 3) return;
  const im = formState.images;
  [im[i], im[j]] = [im[j], im[i]];
  formState.colors.forEach(c => { if (c.imageIndex === i) c.imageIndex = j; else if (c.imageIndex === j) c.imageIndex = i; });
  renderImageSlots(); renderColorRows();
}

function renderImageSlots() {
  const box = $('#imageSlots');
  box.replaceChildren();
  formState.images.forEach((src, i) => {
    const file = h('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', class: 'sr-only', tabindex: '-1', 'aria-label': `Upload image ${i + 1}` });
    file.addEventListener('change', async () => {
      const f = file.files[0];
      if (!f) return;
      try { formState.images[i] = await processImage(f); setErr('pImages', ''); }
      catch (e) { setErr('pImages', e.message); }
      renderImageSlots(); renderColorRows();
    });
    box.append(h('div', { class: 'slot' },
      h('div', { class: 'slot-preview' }, src ? h('img', { src: resolveImg(src), alt: `Image ${i + 1} preview` }) : `Image ${i + 1}`),
      file,
      h('div', { class: 'slot-btns' },
        h('button', { type: 'button', class: 'btn btn-ghost small', onclick: () => file.click() }, src ? 'Replace' : 'Choose'),
        src ? h('button', { type: 'button', class: 'icon-btn', 'aria-label': `Remove image ${i + 1}`, onclick: () => { formState.images[i] = null; formState.colors.forEach(c => { if (c.imageIndex === i) c.imageIndex = null; }); renderImageSlots(); renderColorRows(); } }, icon('trash')) : null,
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': `Move image ${i + 1} earlier`, disabled: i === 0 || !src, onclick: () => swapImages(i, i - 1) }, icon('chev-left')),
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': `Move image ${i + 1} later`, disabled: i === 3 || !src, onclick: () => swapImages(i, i + 1) }, h('span', { style: 'display:inline-grid;transform:scaleX(-1)' }, icon('chev-left'))))));
  });
}

function renderColorRows() {
  const box = $('#colorRows');
  box.replaceChildren();
  formState.colors.forEach((c, i) => {
    const picker = h('input', { type: 'color', value: isHex(c.hex) ? c.hex : '#C87593', 'aria-label': `Colour ${i + 1}: pick a colour` });
    picker.addEventListener('input', () => { c.hex = picker.value.toUpperCase(); });
    const name = h('input', { type: 'text', value: c.name || '', maxlength: 40, placeholder: 'Colour name (optional)', 'aria-label': `Colour ${i + 1}: name` });
    name.addEventListener('input', () => { c.name = name.value; });
    const sel = h('select', { 'aria-label': `Colour ${i + 1}: linked image` }, h('option', { value: '' }, 'No linked image'),
      ...formState.images.map((src, k) => (src ? h('option', { value: String(k) }, `Image ${k + 1}`) : null)));
    sel.value = c.imageIndex !== null && c.imageIndex !== undefined && formState.images[c.imageIndex] ? String(c.imageIndex) : '';
    sel.addEventListener('change', () => { c.imageIndex = sel.value === '' ? null : Number(sel.value); });
    box.append(h('div', { class: 'color-row' }, picker, name, sel,
      h('button', { type: 'button', class: 'icon-btn', 'aria-label': `Remove colour ${i + 1}`, onclick: () => { formState.colors.splice(i, 1); renderColorRows(); } }, icon('trash'))));
  });
}

function parseVariants(text) {
  const out = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const idx = line.indexOf(':');
    if (idx < 1) return { error: `Line "${line}" should look like "Size: 6, 7, 8".` };
    const name = line.slice(0, idx).trim();
    const options = line.slice(idx + 1).split(',').map(s => s.trim()).filter(Boolean);
    if (!name || !options.length) return { error: `Line "${line}" needs a name and at least one option.` };
    out.push({ name, options });
  }
  return { variants: out };
}

async function saveProductForm() {
  if (!requireAdmin()) return;
  const v = id => $('#' + id).value.trim();
  const errors = {};
  const title = v('pTitle');
  if (title.length < 2 || title.length > 80) errors.pTitle = 'Enter a title between 2 and 80 characters.';
  if (v('pSubtitle').length > 120) errors.pSubtitle = 'Keep the subtitle under 120 characters.';
  if (v('pDesc').length < 10) errors.pDesc = 'Add a description of at least 10 characters.';
  if (!CONFIG.categories.some(c => c.name === v('pCategory')) && !(formState.id && v('pCategory') && v('pCategory') === (findProduct(formState.id) || {}).category)) errors.pCategory = 'Choose a category.';
  if (v('pCollection').length > 60) errors.pCollection = 'Keep the collection name under 60 characters.';
  const sku = v('pSku');
  if (!/^[A-Za-z0-9][A-Za-z0-9\-_]{1,29}$/.test(sku)) errors.pSku = 'SKU must be 2 to 30 letters, numbers, dashes or underscores.';
  else if (state.products.some(p => p.id !== formState.id && p.sku.toLowerCase() === sku.toLowerCase())) errors.pSku = 'Another product already uses this SKU.';
  const stockRaw = v('pStock'), stock = Number(stockRaw);
  if (stockRaw === '' || !Number.isInteger(stock) || stock < 0 || stock > 100000) errors.pStock = 'Enter a whole number from 0 to 100000.';
  const priceRaw = v('pPrice'), price = Number(priceRaw);
  const money = n => Number.isFinite(n) && Math.round(n * 100) / 100 === n;
  if (priceRaw === '' || !money(price) || price <= 0 || price > 1000000) errors.pPrice = 'Enter a selling price above 0 (up to 2 decimals).';
  const origRaw = v('pOriginal'), orig = Number(origRaw);
  if (origRaw !== '') {
    if (!money(orig) || orig <= 0) errors.pOriginal = 'Enter a valid original price, or leave it empty.';
    else if (!errors.pPrice && orig <= price) errors.pOriginal = 'Original price must be higher than the selling price, otherwise leave it empty.';
  }
  const filled = formState.images.filter(Boolean);
  if (!filled.length) errors.pImages = 'Add at least one product image.';
  const colorNames = formState.colors.map((c, i) => (c.name || '').trim() || `Colour ${i + 1}`);
  if (formState.colors.some(c => !isHex(c.hex))) errors.pColors = 'One of the colours is not valid.';
  else if (new Set(colorNames.map(n => n.toLowerCase())).size !== colorNames.length) errors.pColors = 'Each colour needs a different name.';
  if (v('pMaterial').length > 120) errors.pMaterial = 'Keep this under 120 characters.';
  if (v('pDimensions').length > 120) errors.pDimensions = 'Keep this under 120 characters.';
  if (v('pCare').length > 400) errors.pCare = 'Keep care instructions under 400 characters.';
  const pv = parseVariants($('#pVariants').value);
  if (pv.error) errors.pVariants = pv.error;

  FORM_FIELDS.concat(['pImages', 'pColors']).forEach(id => setErr(id, errors[id] || ''));
  const keys = Object.keys(errors);
  const box = $('#productFormError');
  if (keys.length) {
    box.hidden = false; box.textContent = 'Please fix the highlighted fields.';
    const target = $('#' + keys[0]) || $('#imageSlots');
    if (target && target.focus) target.focus();
    return;
  }
  box.hidden = true;
  const saveBtn = $('#pSave');
  saveBtn.disabled = true; saveBtn.textContent = 'Saving…';

  // Compact the image slots and re-map colour links
  const map = {}; const images = [];
  formState.images.forEach((src, i) => { if (src) { map[i] = images.length; images.push(src); } });
  const existing = findProduct(formState.id);
  const productId = formState.id || pid();
  const product = normalizeProduct({
    id: productId,
    title, subtitle: v('pSubtitle'), description: $('#pDesc').value.trim(),
    category: v('pCategory'), collection: v('pCollection'), sku,
    price, originalPrice: origRaw === '' ? 0 : orig,
    images,
    colors: formState.colors.map((c, i) => ({ name: colorNames[i], hex: c.hex, imageIndex: c.imageIndex !== null && c.imageIndex in map ? map[c.imageIndex] : null })),
    variants: pv.variants,
    stock, availability: $('#pAvail').value,
    material: v('pMaterial'), dimensions: v('pDimensions'), care: $('#pCare').value.trim(),
    tags: v('pTags').split(',').map(t => t.trim()).filter(Boolean).slice(0, 20),
    featured: $('#pFeatured').checked, bestseller: $('#pBest').checked, isNew: $('#pNew').checked,
    isSample: false,
    createdAt: existing ? existing.createdAt : Date.now()
  });
  if (!product) { box.hidden = false; box.textContent = 'Something went wrong while saving. Please check the fields.'; saveBtn.disabled = false; saveBtn.textContent = 'Save product'; return; }
  try {
    // Upload any newly chosen photos to Supabase Storage and keep only their public URLs
    for (let i = 0; i < product.images.length; i++) {
      if (product.images[i].startsWith('data:')) {
        product.images[i] = await SB.uploadImage(product.images[i], `${productId}/${Date.now().toString(36)}-${i}.jpg`);
      }
    }
    await SB.upsert([product]);
    if (existing) { const gone = existing.images.filter(u => !product.images.includes(u)); if (gone.length) SB.deleteImages(gone); }
    if (existing) state.products[state.products.indexOf(existing)] = product; else state.products.unshift(product);
    persistProducts();
    $('#productDialog').close();
    renderAdmin(); refreshCartUI(); syncWishButtons();
    toast(existing ? 'Product updated for everyone' : 'Product added for everyone');
  } catch (ex) {
    box.hidden = false;
    box.textContent = /duplicate|unique/i.test(ex.message) ? 'Another product already uses this SKU. Please choose a different SKU.' : (ex.message || 'Could not save. Please try again.');
    if (ex.expired) { state.admin = false; }
  } finally {
    saveBtn.disabled = false; saveBtn.textContent = 'Save product';
  }
}

function handleAdminError(ex) {
  if (ex && ex.expired) { state.admin = false; renderAdmin(); }
  toast((ex && ex.message) || 'Something went wrong. Please try again.');
}

async function deleteProduct(p) {
  if (!requireAdmin()) return;
  if (!(await confirmAction(`Delete "${p.title}"? This cannot be undone.`, 'Delete'))) return;
  try {
    await SB.remove(p.id);
  } catch (ex) { handleAdminError(ex); return; }
  SB.deleteImages(p.images);
  state.products = state.products.filter(x => x.id !== p.id);
  state.wishlist = state.wishlist.filter(id => id !== p.id); saveWish();
  persistProducts();
  renderAdmin(); refreshCartUI(); syncWishButtons();
  toast('Product deleted for everyone');
}

/* ==========================================================
   18. STATIC-PAGE FORMS (newsletter, contact, damaged report)
   ========================================================== */
function initForms() {
  $('#newsletterForm').addEventListener('submit', async e => {
    e.preventDefault();
    const input = $('#newsletterEmail'), msg = $('#newsletterMsg');
    if (!EMAIL_RE.test(input.value.trim())) {
      msg.className = 'form-msg bad'; msg.textContent = 'Please enter a valid email address.';
      input.setAttribute('aria-invalid', 'true'); input.focus(); return;
    }
    input.setAttribute('aria-invalid', 'false');
    if (!hasEmailChannel()) { msg.className = 'form-msg ok'; msg.textContent = 'Thanks! (Demo: connect Google Apps Script or Web3Forms in CONFIG.orders to receive sign-ups by email.)'; input.value = ''; return; }
    try {
      await sendOwnerEmail('New newsletter subscriber', { name: 'Subscriber', email: input.value.trim(), message: 'New subscriber: ' + input.value.trim() });
      msg.className = 'form-msg ok'; msg.textContent = 'Thank you for subscribing!'; input.value = '';
    } catch (ex) { msg.className = 'form-msg bad'; msg.textContent = 'Sorry, we could not sign you up right now. Please try again later.'; }
  });

  /* Contact / damaged-product forms: email goes straight to you when Web3Forms is set,
     otherwise they open the visitor's own email app. */
  const contactForm = (formId, rules, build) => {
    $('#' + formId).addEventListener('submit', async e => {
      e.preventDefault();
      let ok = true, first = null;
      rules.forEach(([id, check, message]) => {
        const el = $('#' + id), bad = !check(el.value.trim());
        $('#err-' + id).textContent = bad ? message : '';
        el.setAttribute('aria-invalid', String(bad));
        if (bad) { ok = false; if (!first) first = el; }
      });
      if (!ok) { first.focus(); return; }
      const m = build();
      if (hasEmailChannel()) {
        try {
          await sendOwnerEmail(m.subject, { name: m.name, email: m.email, message: m.body });
          toast('Message sent. We will reply soon.'); e.target.reset(); return;
        } catch (ex) { toast('Could not send right now. Opening your email app instead.'); }
      }
      window.location.href = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`;
    });
  };
  contactForm('contactForm', [
    ['cName', v => v.length >= 2, 'Please enter your name.'],
    ['cEmail', v => EMAIL_RE.test(v), 'Enter a valid email address.'],
    ['cMsg', v => v.length >= 10, 'Please write a message (at least 10 characters).']
  ], () => ({ subject: `Message from ${$('#cName').value.trim()}`, name: $('#cName').value.trim(), email: $('#cEmail').value.trim(), body: `${$('#cMsg').value.trim()}\n\nFrom: ${$('#cName').value.trim()} <${$('#cEmail').value.trim()}>` }));
  contactForm('damagedForm', [
    ['dOrder', v => v.length >= 3, 'Please enter your order number.'],
    ['dEmail', v => EMAIL_RE.test(v), 'Enter a valid email address.'],
    ['dMsg', v => v.length >= 10, 'Please describe what happened (at least 10 characters).']
  ], () => ({ subject: `Damaged product: order ${$('#dOrder').value.trim()}`, name: 'Customer', email: $('#dEmail').value.trim(), body: `${$('#dMsg').value.trim()}\n\nOrder: ${$('#dOrder').value.trim()}\nEmail: ${$('#dEmail').value.trim()}\n(They may send photos by reply.)` }));
}

/* ==========================================================
   19. ROUTER + INITIALISATION
   Pages are chosen by the URL hash, e.g. #/shop?cat=Charms or #/product/ID
   ========================================================== */
const ROUTES = ['home', 'shop', 'product', 'wishlist', 'account', 'checkout', 'admin', 'story', 'contact', 'shipping', 'returns', 'care', 'damaged', 'faqs', 'privacy', 'terms'];
const DEFAULT_DESC = 'ei8htverse: handmade pipe cleaner art and crafts, keychains, flowers, home decor, pipe cleaner crafts, charms and jewellery. Little details, your kind of magic.';
const TITLES = {
  home: 'ei8htverse | Pipe cleaner crafts, charms & jewellery', shop: 'Shop | ei8htverse', wishlist: 'Wishlist | ei8htverse', account: 'Account | ei8htverse',
  checkout: 'Checkout | ei8htverse', admin: 'Admin | ei8htverse', story: 'Our story | ei8htverse', contact: 'Contact | ei8htverse',
  shipping: 'Shipping policy | ei8htverse', returns: 'Returns and refunds | ei8htverse', care: 'Jewellery care guide | ei8htverse',
  damaged: 'Damaged product reporting | ei8htverse', faqs: 'FAQs | ei8htverse', privacy: 'Privacy policy | ei8htverse', terms: 'Terms and conditions | ei8htverse'
};

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [pathPart, queryPart = ''] = raw.split('?');
  const segs = pathPart.split('/').filter(Boolean).map(s => { try { return decodeURIComponent(s); } catch (e) { return s; } });
  return { name: segs[0] || 'home', param: segs[1] || '', query: new URLSearchParams(queryPart) };
}

function setNavActive() {
  const current = location.hash || '#/';
  const norm = s => { try { return decodeURIComponent(s); } catch (e) { return s; } };
  $$('[data-nav]').forEach(a => {
    if (norm(a.getAttribute('href')) === norm(current)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}

function route(keepScroll) {
  const r = parseHash();
  const name = ROUTES.includes(r.name) ? r.name : 'home';
  Layers.close();
  $$('.view').forEach(v => { v.hidden = v.id !== 'view-' + name; });
  const meta = $('meta[name="description"]');
  if (meta) meta.setAttribute('content', DEFAULT_DESC);
  let title = TITLES[name] || TITLES.home;
  if (name === 'home') renderHome();
  else if (name === 'shop') { initShopFromQuery(r.query); renderShop(); }
  else if (name === 'product') title = renderProduct(r.param, r.query);
  else if (name === 'wishlist') renderWishlist();
  else if (name === 'account') renderAccount();
  else if (name === 'checkout') renderCheckout();
  else if (name === 'admin') renderAdmin();
  document.title = title;
  setNavActive();
  if (keepScroll !== true) {
    const root = document.documentElement;
    root.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); root.style.scrollBehavior = '';
    $('#main').focus({ preventScroll: true });
  }
  observeReveals();
}

async function init() {
  loadState();

  // Fill text/links that come from CONFIG
  $('#announceText').textContent = CONFIG.announcement;
  $('#heroHeadline').textContent = CONFIG.tagline;
  $('#year').textContent = String(new Date().getFullYear());
  $$('[data-config]').forEach(n => { n.textContent = String(getPath(CONFIG, n.dataset.config) ?? ''); });
  $$('[data-config-mailto]').forEach(n => n.setAttribute('href', 'mailto:' + CONFIG.contactEmail));
  ['#instaLink', '#footerInsta'].forEach(sel => $(sel).setAttribute('href', CONFIG.instagramUrl));
  FAQS.forEach(([q, a]) => $('#faqList').append(accordionItem(q, a)));

  // Header + layers
  $('#menuBtn').addEventListener('click', () => Layers.open($('#mobileNav')));
  $('#searchBtn').addEventListener('click', () => { Layers.open($('#searchPanel')); renderSearchResults($('#searchInput').value); });
  $('#cartBtn').addEventListener('click', () => Layers.open($('#cartDrawer')));
  $('#overlay').addEventListener('click', () => Layers.close());
  $$('[data-close-layer]').forEach(b => b.addEventListener('click', () => Layers.close()));
  document.addEventListener('keydown', handleLayerKeys);
  $('#searchInput').addEventListener('input', e => renderSearchResults(e.target.value));
  $('#searchForm').addEventListener('submit', e => {
    e.preventDefault();
    const q = $('#searchInput').value.trim();
    Layers.close();
    location.hash = '#/shop' + (q ? '?q=' + encodeURIComponent(q) : '');
  });

  // Links inside layers close them (even when the hash does not change)
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#/"]');
    if (a && a.closest('.layer')) Layers.close();
    const acc = e.target.closest('.acc-btn');
    if (acc) {
      const open = acc.getAttribute('aria-expanded') === 'true';
      acc.setAttribute('aria-expanded', String(!open));
      $('#' + acc.getAttribute('aria-controls')).classList.toggle('open', !open);
    }
  });
  $('#skipLink').addEventListener('click', e => { e.preventDefault(); $('#main').focus(); });
  $('#footerNews').addEventListener('click', e => {
    e.preventDefault();
    if (location.hash !== '#/' && location.hash !== '') location.hash = '#/';
    setTimeout(() => { const n = $('#newsletterEmail'); n.scrollIntoView({ behavior: 'smooth', block: 'center' }); n.focus({ preventScroll: true }); }, 200);
  });

  // Header shadow on scroll
  const header = $('#siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Broken images fall back to generated artwork; a missing logo falls back to text
  document.addEventListener('error', e => {
    const img = e.target;
    if (!img || img.tagName !== 'IMG' || img.dataset.fallback) return;
    img.dataset.fallback = '1';
    if (img.classList.contains('logo') || img.classList.contains('hero-logo')) {
      img.hidden = true;
      const fb = img.parentElement && img.parentElement.querySelector('.logo-fallback');
      if (fb) fb.hidden = false;
    } else {
      img.src = artDataURI('deco', '#E7A8BD', 0);
    }
  }, true);

  initShopControls();
  initAdmin();
  initForms();
  refreshCartUI();
  syncWishButtons();
  window.addEventListener('hashchange', () => route());
  window.EI8_READY = true;

  if (!SB.enabled) { route(); return; }
  // Online mode: show cached products at once (if any), then fetch the latest from Supabase
  const hadCache = state.products.length > 0;
  if (state.admin) SB.ensureSession().then(ok => { if (!ok) { state.admin = false; if (!$('#view-admin').hidden) renderAdmin(); } });
  const load = loadRemoteProducts();
  if (hadCache) { route(); await load; route(true); }
  else {
    $('#main').setAttribute('aria-busy', 'true');
    await Promise.race([load, new Promise(r => setTimeout(r, 8000))]);
    $('#main').removeAttribute('aria-busy');
    route();
    load.then(() => route(true));
  }
}

async function loadRemoteProducts() {
  try {
    state.products = await SB.fetchProducts();
    Store.set(KEYS.cache, state.products);
    refreshCartUI(); syncWishButtons();
    return true;
  } catch (e) {
    console.warn('Could not load products from Supabase', e);
    toast('Could not load the latest products. Check your internet connection.');
    return false;
  }
}

init();
