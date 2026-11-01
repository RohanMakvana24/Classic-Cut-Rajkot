import { ImgHTMLAttributes, useLayoutEffect, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { useElementInView } from '../../hooks/useActivity';
import './skeleton-image.css';

type SkeletonImageProps = ImgHTMLAttributes<HTMLImageElement> & { skeletonClassName?: string };

/** Keeps the existing image element/layout; only the placeholder is an overlay. */
export function SkeletonImage({ src, srcSet, alt = '', className = '', skeletonClassName = '', onLoad, onError, loading, decoding = 'async', ...props }: SkeletonImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const nearby = useElementInView(imageRef, { once: true, rootMargin: '400px', enabled: loading === 'lazy' });
  const shouldLoad = loading !== 'lazy' || nearby;
  const requestKey = `${src ?? ''}|${srcSet ?? ''}`;
  const requestRef = useRef(requestKey);
  requestRef.current = requestKey;
  const [result, setResult] = useState<{ key: string; state: 'loaded' | 'error' } | null>(null);
  const state = result && result.key === requestKey ? result.state : 'loading';

  useLayoutEffect(() => {
    const image = imageRef.current;
    if (shouldLoad && image?.complete) setResult({ key: requestKey, state: image.naturalWidth > 0 ? 'loaded' : 'error' });
  }, [requestKey, shouldLoad]);

  return <>
    {state === 'loading' && <span className={`image-skeleton ${skeletonClassName}`} aria-hidden="true" />}
    {state === 'error' && <span className={`image-skeleton image-skeleton--error ${skeletonClassName}`} role="img" aria-label={alt || 'Image unavailable'}><ImageOff size={20} strokeWidth={1.4} aria-hidden="true" /></span>}
    <img {...props} ref={imageRef} src={shouldLoad ? src : undefined} srcSet={shouldLoad ? srcSet : undefined} loading={loading} decoding={decoding} alt={alt} className={`skeleton-image ${className}`} data-image-state={state} aria-busy={state === 'loading'} aria-hidden={state === 'error' ? true : props['aria-hidden']}
      onLoad={event => {
        const image = event.currentTarget;
        onLoad?.(event);
        const finish = () => { if (imageRef.current === image && requestRef.current === requestKey) setResult({ key: requestKey, state: 'loaded' }); };
        if (image.decode) image.decode().then(finish, finish); else finish();
      }}
      onError={event => { setResult({ key: requestKey, state: 'error' }); onError?.(event); }} />
  </>;
}
