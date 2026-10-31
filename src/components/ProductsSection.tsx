import { SkeletonImage } from './ui/skeleton-image';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, X, Trash2 } from 'lucide-react';
import { CoverflowCarousel } from './ui/coverflow-carousel';
import './ProductsSection.css';
import {
  PRODUCT_ITEMS,
  ProductCategoryFilter,
  filterProductsByCategory,
  buildProductWhatsAppUrl,
} from '../data/barbershopData';

const PRODUCT_TABS: { id: ProductCategoryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'hair', label: 'Hair' },
  { id: 'beard', label: 'Beard' },
  { id: 'skin', label: 'Skin' },
];

const getPrice = (price: string) => Number(price.replace(/[^\d]/g, '')) || 0;

const PRODUCT_IMAGES: Record<string, string> = {
  'matte-molding-hair-clay': '/assets/products/matte-clay.webp',
  'royal-oud-argan-beard-oil': '/assets/products/beard-oil.webp',
  'charcoal-detan-face-scrub': '/assets/products/detan-scrub.webp',
  'sea-salt-volume-spray': '/assets/products/sea-salt-mist.webp',
  'sandalwood-cooling-aftershave': '/assets/products/aftershave-balm.webp',
  'keratin-repair-hair-serum': '/assets/products/hair-serum.webp',
};

export const ProductsSection: React.FC = () => {
  const productTrackRef = useRef<HTMLDivElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryFilter>('all');
  const bagDialogRef = useRef<HTMLDialogElement | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const dialog = bagDialogRef.current;
    if (!bagOpen || !dialog) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [bagOpen]);

  const visibleProducts = filterProductsByCategory(PRODUCT_ITEMS, selectedCategory);
  const cartProducts = PRODUCT_ITEMS.filter((product) => (quantities[product.id] || 0) > 0);
  const totalItems = cartProducts.reduce((sum, product) => sum + quantities[product.id], 0);
  const totalPrice = cartProducts.reduce(
    (sum, product) => sum + getPrice(product.priceInr) * quantities[product.id],
    0
  );

  const changeQuantity = (id: string, change: number) => {
    setQuantities((current) => {
      const nextQuantity = Math.max(0, (current[id] || 0) + change);
      const next = { ...current };
      if (nextQuantity === 0) delete next[id];
      else next[id] = nextQuantity;
      return next;
    });
  };

  const scrollProducts = (direction: -1 | 1) => {
    productTrackRef.current?.scrollBy({ left: direction * 330, behavior: 'smooth' });
  };

  const orderUrl = buildProductWhatsAppUrl([
    ...cartProducts.map((product) => {
      const quantity = quantities[product.id];
      return `${product.name} × ${quantity} = ₹${getPrice(product.priceInr) * quantity}`;
    }),
    `Order total: ₹${totalPrice}`,
  ]);

  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      className="relative overflow-hidden border-b border-[#DFAF63]/15 bg-[#0C0907] py-20 md:py-28"
    >
      <div className="relative z-10 mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
        <div className="mb-9 flex flex-col gap-6 sm:-mx-8 lg:-mx-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#E5B96F]">
              Shop Menu
            </p>
            <h2
              id="products-heading"
              className="font-display text-4xl uppercase leading-none tracking-[-0.01em] text-[#F7F1E8] sm:text-5xl"
            >
              Our <span className="text-[#E5B96F]">Products</span>
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#C9B8A6] sm:text-base">
              Salon-tested grooming essentials. Add items to your order and confirm pickup on WhatsApp.
            </p>
          </div>

          <div className="product-toolbar">
          <div
            role="tablist"
            aria-label="Filter products"
            className="inline-flex w-full gap-1 rounded-xl border border-[#DFAF63]/25 bg-[#140F0C] p-1 sm:w-auto"
          >
            {PRODUCT_TABS.map((tab) => {
              const count = filterProductsByCategory(PRODUCT_ITEMS, tab.id).length;
              const active = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => { setSelectedCategory(tab.id); productTrackRef.current?.scrollTo({ left: 0 }); }}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:flex-none sm:px-4 ${
                    active
                      ? 'bg-[#E5B96F] text-[#0C0907]'
                      : 'text-[#C9B8A6] hover:text-[#F7F1E8]'
                  }`}
                >
                  {tab.label} <span className="opacity-65">{count}</span>
                </button>
              );
            })}
          </div>
            <button type="button" className="product-bag-button" onClick={() => setBagOpen(true)} aria-haspopup="dialog" aria-label={`Open shopping bag, ${totalItems} items`}><ShoppingBag size={17} /><span>My bag</span><span className="product-bag-button__count">{totalItems}</span></button>
          </div>
        </div>

        <div className="products-mobile-showcase sm:hidden">
          <p className="products-mobile-showcase__hint">Swipe to find your everyday essential</p>
          <CoverflowCarousel
            key={selectedCategory}
            label="Salon grooming products"
            slides={visibleProducts.map((product) => ({
              src: PRODUCT_IMAGES[product.id], alt: product.name,
              title: product.name, subtitle: `${product.volume} · ${product.holdOrFinish}`,
              price: product.priceInr,
              meta: [{ label: 'Care', value: product.categoryLabel }],
            }))}
            cardWidth="clamp(220px, 78vw, 320px)"
            rotate={38}
            depth={0.35}
            fade={1}
            gap={0.18}
            showCaption showNavigation showPagination
            renderAction={(_, index) => {
              const product = visibleProducts[index];
              const quantity = quantities[product.id] || 0;
              return quantity === 0 ? (
                <button type="button" onClick={() => changeQuantity(product.id, 1)} className="products-mobile-showcase__add focus-ring" aria-label={`Add ${product.name} to order`}><Plus size={16} /> Add to order</button>
              ) : (
                <div className="products-mobile-showcase__quantity">
                  <button type="button" className="focus-ring" onClick={() => changeQuantity(product.id, -1)} aria-label={`Remove one ${product.name}`}><Minus size={16} /></button>
                  <span aria-live="polite">{quantity} in your order</span>
                  <button type="button" className="focus-ring" onClick={() => changeQuantity(product.id, 1)} aria-label={`Add one ${product.name}`}><Plus size={16} /></button>
                </div>
              );
            }}
          />
        </div>

        <div className="mb-4 hidden items-center justify-between sm:-mx-8 lg:-mx-12 sm:flex">
          <p className="text-xs text-[#9F9285]">Swipe or use arrows to explore</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollProducts(-1)}
              aria-label="Previous products"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DFAF63]/35 text-[#E5B96F] transition-colors hover:bg-[#E5B96F] hover:text-[#0C0907]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollProducts(1)}
              aria-label="Next products"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DFAF63]/35 text-[#E5B96F] transition-colors hover:bg-[#E5B96F] hover:text-[#0C0907]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={productTrackRef}
          className="products-scroll-track -mx-5 hidden snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-5 sm:-mx-8 sm:flex sm:px-0 lg:-mx-12 lg:px-0"
        >
          {visibleProducts.map((product) => {
            const quantity = quantities[product.id] || 0;
            return (
              <article
                key={product.id}
                className={`group relative flex w-[82vw] max-w-[310px] shrink-0 snap-start flex-col overflow-hidden rounded-[22px] border bg-[#140F0C] transition-all duration-300 sm:w-[310px] ${
                  quantity > 0 ? 'border-[#E5B96F]/75' : 'border-[#DFAF63]/20 hover:border-[#DFAF63]/45'
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#100B08]">
                  <SkeletonImage
                    src={PRODUCT_IMAGES[product.id]}
                    alt={`${product.name} product`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="product-index-badge absolute left-3 top-3 rounded-full border border-white/15 bg-black/75 px-2.5 py-1 font-mono text-[10px] font-bold">
                    {product.indexLabel}
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-[#E5B96F] px-3 py-1 font-mono text-xs font-bold text-[#0C0907]">
                    {product.priceInr}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B99C78]">
                    {product.categoryLabel}
                  </p>
                  <h3 className="mt-1.5 min-h-[44px] text-base font-bold leading-snug text-[#F7F1E8]">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#9F9285]">
                    {product.volume} <span className="mx-1.5 text-[#6C5D50]">·</span> {product.holdOrFinish}
                  </p>

                  <div className="mt-5">
                  {quantity === 0 ? (
                    <button
                      type="button"
                      onClick={() => changeQuantity(product.id, 1)}
                      className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-[#E5B96F]/55 text-xs font-bold text-[#E5B96F] transition-colors hover:bg-[#E5B96F] hover:text-[#0C0907] focus-ring"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add to order
                    </button>
                  ) : (
                    <div className="flex h-11 w-full items-center justify-between overflow-hidden rounded-xl border border-[#E5B96F]/55">
                      <button
                        type="button"
                        onClick={() => changeQuantity(product.id, -1)}
                        aria-label={`Remove one ${product.name}`}
                        className="flex h-full w-12 items-center justify-center text-[#E5B96F] transition-colors hover:bg-[#E5B96F] hover:text-[#0C0907]"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-bold tabular-nums text-[#F7F1E8]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(product.id, 1)}
                        aria-label={`Add one ${product.name}`}
                        className="flex h-full w-12 items-center justify-center text-[#E5B96F] transition-colors hover:bg-[#E5B96F] hover:text-[#0C0907]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {totalItems > 0 && <button type="button" className="product-floating-bag" onClick={() => setBagOpen(true)} aria-haspopup="dialog" aria-label={`View shopping bag, ${totalItems} items, ₹${totalPrice}`}>
          <span className="product-floating-bag__icon"><ShoppingBag size={21} /><span>{totalItems}</span></span>
          <span className="product-floating-bag__text"><strong>Your grooming kit</strong><span>{totalItems} {totalItems === 1 ? 'essential' : 'essentials'} · View bag <ArrowUpRight size={12} /></span></span>
          <strong className="product-floating-bag__total">₹{totalPrice}</strong>
        </button>}

        <dialog ref={bagDialogRef} className="product-bag-dialog" aria-labelledby="product-bag-title" onCancel={() => setBagOpen(false)} onClose={() => setBagOpen(false)} onClick={event => { if (event.target === event.currentTarget) setBagOpen(false); }}>
          <div className="product-bag-panel">
            <div className="product-bag-panel__handle" aria-hidden="true" />
            <header className="product-bag-panel__header"><div><p>THE CLASSIC CUT EDIT</p><h2 id="product-bag-title">Your grooming kit<span>.</span></h2><span>{totalItems} {totalItems === 1 ? 'essential' : 'essentials'} selected</span></div><button type="button" aria-label="Close shopping bag" onClick={() => setBagOpen(false)}><X size={20} /></button></header>
            <div className="product-bag-panel__items">
              {cartProducts.length ? cartProducts.map(product => <div className="product-bag-item" key={product.id}>
                <SkeletonImage src={PRODUCT_IMAGES[product.id]} alt={product.name} />
                <div className="product-bag-item__info"><span>{product.categoryLabel}</span><h3>{product.name}</h3><p>{product.volume} · {product.priceInr} each</p><div className="product-bag-item__quantity"><button type="button" aria-label={`Remove one ${product.name} from bag`} onClick={() => changeQuantity(product.id, -1)}><Minus size={13} /></button><span>{quantities[product.id]}</span><button type="button" aria-label={`Add one ${product.name} to bag`} onClick={() => changeQuantity(product.id, 1)}><Plus size={13} /></button></div></div>
                <div className="product-bag-item__price"><strong>₹{getPrice(product.priceInr) * quantities[product.id]}</strong><button type="button" aria-label={`Remove ${product.name} from bag`} onClick={() => setQuantities(current => { const next = { ...current }; delete next[product.id]; return next; })}><Trash2 size={14} /></button></div>
              </div>) : <div className="product-bag-empty"><span><ShoppingBag size={34} strokeWidth={1.2} /></span><h3>Your next essential is waiting.</h3><p>Find your daily hair, beard and skin favourites. Add a little salon care to your routine.</p><button type="button" onClick={() => setBagOpen(false)}>Explore products <ArrowUpRight size={16} /></button></div>}
            </div>
            {totalItems > 0 && <footer className="product-bag-panel__footer"><div><span>Order total</span><strong aria-live="polite">₹{totalPrice}</strong></div><p>Confirm availability and salon pickup on WhatsApp.</p><a href={orderUrl} target="_blank" rel="noopener noreferrer">Order on WhatsApp <ArrowUpRight size={18} /></a><button type="button" onClick={() => setBagOpen(false)}>Keep exploring</button></footer>}
          </div>
        </dialog>
      </div>
    </section>
  );
};
