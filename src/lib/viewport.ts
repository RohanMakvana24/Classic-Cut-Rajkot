type Listener = (visible: boolean) => void;
const pools = new Map<string, { observer: IntersectionObserver; listeners: Map<Element, Set<Listener>> }>();

export function observeViewport(element: Element, listener: Listener, rootMargin = '0px') {
  if (typeof IntersectionObserver === 'undefined') { listener(true); return () => {}; }
  let pool = pools.get(rootMargin);
  if (!pool) {
    const listeners = new Map<Element, Set<Listener>>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) listeners.get(entry.target)?.forEach(notify => notify(entry.isIntersecting));
    }, { rootMargin });
    pool = { observer, listeners }; pools.set(rootMargin, pool);
  }
  let listeners = pool.listeners.get(element);
  if (!listeners) { listeners = new Set(); pool.listeners.set(element, listeners); pool.observer.observe(element); }
  listeners.add(listener);
  const current = pool;
  return () => {
    const callbacks = current.listeners.get(element); callbacks?.delete(listener);
    if (!callbacks?.size) { current.listeners.delete(element); current.observer.unobserve(element); }
    if (!current.listeners.size) { current.observer.disconnect(); pools.delete(rootMargin); }
  };
}
