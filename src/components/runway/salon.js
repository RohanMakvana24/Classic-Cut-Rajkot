'use strict';
const hostOrigin = window.parent.location.origin;
// The React host supplies its live PRODUCT_ITEMS; no second catalog is maintained.
window.addEventListener('message', function receive(event) {
  if (event.origin !== hostOrigin || event.source !== window.parent || event.data?.type !== 'classic-cut-products') return;
  window.removeEventListener('message', receive);
  const { products, bookingUrl } = event.data;
  if (!Array.isArray(products) || products.length !== 6) return;
  const imageNames = {
    'matte-molding-hair-clay': 'matte-clay',
    'royal-oud-argan-beard-oil': 'beard-oil',
    'charcoal-detan-face-scrub': 'detan-scrub',
    'sea-salt-volume-spray': 'sea-salt-mist',
    'sandalwood-cooling-aftershave': 'aftershave-balm',
    'keratin-repair-hair-serum': 'hair-serum',
  };
  const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  const items = products.map(product => ({ ...product, variantId: Number(product.indexLabel), price: Number(product.priceInr.replace(/[^\d]/g, '')), image: `/assets/products/${imageNames[product.id]}-cutout.webp` }));
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const section = document.querySelector('runway-section');
  const actors = section.querySelector('[data-rw-actors]');
  const heroes = section.querySelector('[data-rw-heroes]');
  const ticks = section.querySelector('.rw__ticks');
  const panelHost = section.querySelector('.rw__panel-inner');
  section.querySelector('.rw__head').insertAdjacentHTML('afterbegin', '<p class="salon-stage-caption">THE GROOMING EDIT <span data-salon-count>01 / 06</span></p>');
  const image = product => `<img src="${product.image}" sizes="(min-width:750px) 450px, 320px" loading="eager" decoding="async" data-model-image alt="${escape(product.name)}" width="1024" height="1024" draggable="false">`;
  items.forEach((product, index) => {
    const label = `Product ${index + 1}: ${product.name}`;
    const figure = `<div class="rw__figure" style="--rw-ar: 0.75;"><div class="rw__art">${image(product)}`;
    actors.insertAdjacentHTML('beforeend', `<div class="rw__model" data-rw-model data-index="${index}" aria-hidden="true"><span class="rw__shadow" aria-hidden="true"></span>${figure}<button type="button" class="rw__hit" data-rw-go="${index}" aria-label="${escape(label)}" tabindex="-1"></button></div></div></div>`);
    heroes.insertAdjacentHTML('beforeend', `<div class="rw__hero${index === 0 ? ' is-on' : ''}" data-rw-hero data-index="${index}" data-name="${escape(product.name)}" data-label="${escape(label)}" data-probe="${product.image}"><div class="rw__morph"><span class="rw__shadow" aria-hidden="true"></span>${figure}<button type="button" class="rw__zoom" data-rw-zoom aria-label="View product: ${escape(product.name)}" tabindex="-1"></button><div class="rw__pins"><button type="button" class="rw__pin" data-rw-pin="1" data-tip="${escape(product.name)}" style="left:50%;top:55%;--pi:1" aria-label="Product details: ${escape(product.name)}" tabindex="-1"><span class="rw__pin-dot">1</span></button></div></div></div></div></div>`);
    ticks.insertAdjacentHTML('beforeend', `<button type="button" class="rw__tick" data-rw-tick="${index}" aria-current="${index === 0}" aria-label="${escape(label)}"><span class="rw__tick-bar"></span><span class="rw__tick-label">${product.indexLabel}<span class="rw__tick-name">&nbsp;&nbsp;${escape(product.categoryLabel)}</span></span></button>`);
    panelHost.insertAdjacentHTML('beforeend', `<div class="rw__look-panel${index === 0 ? ' is-in' : ''}" data-rw-panel="${index}" data-variant-id="${product.variantId}" ${index === 0 ? '' : 'hidden'}>
      <article class="salon-product" data-rw-card="1" data-variant-id="${product.variantId}" data-title="${escape(product.name)}">
        <p class="salon-product-category">${escape(product.categoryLabel)}<span>${escape(product.volume)}</span></p>
        <h3 class="salon-product-title">${escape(product.name)}</h3>
        <p class="salon-finish">${escape(product.holdOrFinish)}</p>
        <p class="salon-description">${escape(product.description)}</p>
        <ul class="salon-benefits">${product.keyBenefits.map(benefit => `<li>${escape(benefit)}</li>`).join('')}</ul>
      </article>
      <div class="rw__bundle"><p class="rw__msg" data-rw-msg role="status"></p><div class="salon-price-row"><strong>${money(product.price)}</strong><span>Salon quality. Everyday care.</span></div><button type="button" class="rw__cta" data-rw-all><span class="rw__cta-add">Add to your bag</span><span class="rw__cta-m">Add to your bag</span><span aria-hidden="true">↗</span></button><p class="salon-pickup">Available for pickup at Classic Cut, Rajkot</p></div>
      <template data-rw-pieces-text>${escape(product.volume)}</template></div>`);
  });

  const storageKey = 'classic-cut-grooming-bag-v1';
  let entries = [];
  try { const saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); if (Array.isArray(saved)) entries = saved.filter(entry => items.some(item => item.variantId === entry.id) && Number.isInteger(entry.quantity) && entry.quantity > 0 && entry.quantity <= 20); } catch (_) {}
  const status = document.getElementById('bag-status');
  let statusTimer;
  const notify = message => { status.textContent = message; status.classList.add('is-on'); clearTimeout(statusTimer); statusTimer = setTimeout(() => status.classList.remove('is-on'), 2500); };
  const save = () => { try { localStorage.setItem(storageKey, JSON.stringify(entries)); } catch (_) {} };
  const change = (id, delta) => {
    const entry = entries.find(value => value.id === id);
    if (!entry) return;
    entry.quantity = Math.max(0, Math.min(20, entry.quantity + delta));
    entries = entries.filter(value => value.quantity > 0);
    save(); render();
  };
  function render() {
    const list = document.getElementById('bag-items');
    list.replaceChildren();
    let total = 0;
    document.querySelectorAll('[data-cart-count]').forEach(element => { element.textContent = entries.reduce((sum, entry) => sum + entry.quantity, 0); });
    if (!entries.length) { const p = document.createElement('p'); p.className = 'bag-note'; p.textContent = 'Your bag is empty. Find your everyday essential on the runway.'; list.append(p); }
    const orderLines = [];
    entries.forEach(entry => {
      const product = items.find(item => item.variantId === entry.id);
      total += product.price * entry.quantity;
      orderLines.push(`${product.name} × ${entry.quantity} = ₹${product.price * entry.quantity}`);
      const row = document.createElement('div'); row.className = 'bag-row';
      row.innerHTML = `<img src="${product.image}" alt="${escape(product.name)}"><div><h3>${escape(product.name)}</h3><p>${escape(product.volume)} · ${money(product.price)} each</p><div class="salon-bag-quantity"><button type="button" data-delta="-1" aria-label="Remove one ${escape(product.name)}">−</button><span>${entry.quantity}</span><button type="button" data-delta="1" aria-label="Add one ${escape(product.name)}">＋</button><strong>${money(product.price * entry.quantity)}</strong></div></div><button type="button" data-remove aria-label="Remove ${escape(product.name)} from bag">×</button>`;
      row.querySelectorAll('[data-delta]').forEach(button => button.addEventListener('click', () => change(entry.id, Number(button.dataset.delta))));
      row.querySelector('[data-remove]').addEventListener('click', () => change(entry.id, -entry.quantity));
      list.append(row);
    });
    document.getElementById('bag-total').textContent = entries.length ? `Order total ${money(total)}` : '';
    const order = document.getElementById('order-bag');
    order.hidden = !entries.length;
    orderLines.push(`Order total: ₹${total}`);
    // Match buildProductWhatsAppUrl in the shared salon data module.
    const message = `Hi Classic Cut Salon (Rajkot), I would like to check availability / reserve these grooming products at your Arya Nagar salon: ${orderLines.join(', ')}.`;
    order.href = `${bookingUrl}?text=${encodeURIComponent(message)}`;
  }
  window.RunwayBag = {
    async add(selected) {
      section.engage?.();
      selected.forEach(({ id }) => {
        const product = items.find(item => item.variantId === id);
        if (!product) throw new Error('This product is unavailable.');
        const entry = entries.find(value => value.id === id);
        if (entry) entry.quantity = Math.min(20, entry.quantity + 1); else entries.push({ id, quantity: 1 });
      });
      save(); render(); notify('Product added to your grooming bag');
    },
    render,
    get entries() { return entries.map(entry => ({ ...entry })); },
  };
  const dialog = document.getElementById('bag-dialog');
  document.getElementById('open-bag').addEventListener('click', () => { section.engage?.(); render(); dialog.showModal(); });
  document.getElementById('close-bag').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  render();
  document.querySelector('main').hidden = false;
  const script = document.createElement('script'); script.textContent = window.__RUNWAY_ENGINE_SOURCE;
  const initialize = () => {
    // The host page owns section visibility; render the complete composition
    // immediately instead of waiting for a second iframe entrance observer.
    section.classList.add('is-revealed');
    const grid = section.querySelector('.rw__grid');
    const reportHeight = () => { if (window.innerWidth < 750) window.parent.postMessage({ type: 'classic-cut-height', height: Math.ceil(grid.getBoundingClientRect().height) }, hostOrigin); };
    const observer = new ResizeObserver(reportHeight); observer.observe(grid);
    document.fonts.ready.then(reportHeight);
  };
  document.body.append(script);
  initialize();
});
