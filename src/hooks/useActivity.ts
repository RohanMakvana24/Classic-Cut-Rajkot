import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';
import { observeViewport } from '../lib/viewport';

export function useElementInView<T extends Element>(ref: RefObject<T | null>, { once = false, rootMargin = '0px', enabled = true } = {}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    let stop = () => {};
    stop = observeViewport(element, visible => {
      setVisible(visible);
      if (visible && once) stop();
    }, rootMargin);
    return stop;
  }, [ref, once, rootMargin, enabled]);
  return visible;
}

const pageListeners = new Set<() => void>();
const notifyPage = () => pageListeners.forEach(listener => listener());
function subscribePage(listener: () => void) {
  if (!pageListeners.size) document.addEventListener('visibilitychange', notifyPage);
  pageListeners.add(listener);
  return () => { pageListeners.delete(listener); if (!pageListeners.size) document.removeEventListener('visibilitychange', notifyPage); };
}
export const usePageVisible = () => useSyncExternalStore(subscribePage, () => !document.hidden, () => true);

const themeListeners = new Set<() => void>();
let themeObserver: MutationObserver | undefined;
function subscribeTheme(listener: () => void) {
  if (!themeObserver) {
    themeObserver = new MutationObserver(() => themeListeners.forEach(notify => notify()));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
  themeListeners.add(listener);
  return () => { themeListeners.delete(listener); if (!themeListeners.size) { themeObserver?.disconnect(); themeObserver = undefined; } };
}
export const useTheme = () => useSyncExternalStore(subscribeTheme, () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light', () => 'light' as const);
