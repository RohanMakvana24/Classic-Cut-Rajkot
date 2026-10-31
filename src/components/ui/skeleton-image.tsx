import { ImgHTMLAttributes, useLayoutEffect, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';
import './skeleton-image.css';

type SkeletonImageProps = ImgHTMLAttributes<HTMLImageElement> & { skeletonClassName?: string };

/** Keeps the existing image element/layout; only the placeholder is an overlay. */
export function SkeletonImage({ src, alt = '', className = '', skeletonClassName = '', onLoad, onError, ...props }: SkeletonImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [result, setResult] = useState<{ src: string | undefined; state: 'loaded' | 'error' } | null>(null);
  const state = result && result.src === src ? result.state : 'loading';

  useLayoutEffect(() => {
    const image = imageRef.current;
    if (image?.complete) setResult({ src, state: image.naturalWidth > 0 ? 'loaded' : 'error' });
  }, [src]);

  return <>
    {state === 'loading' && <span className={`image-skeleton ${skeletonClassName}`} aria-hidden="true" />}
    {state === 'error' && <span className={`image-skeleton image-skeleton--error ${skeletonClassName}`} role="img" aria-label={alt || 'Image unavailable'}><ImageOff size={20} strokeWidth={1.4} aria-hidden="true" /></span>}
    <img {...props} ref={imageRef} src={src} alt={alt} className={`skeleton-image ${className}`} data-image-state={state} aria-busy={state === 'loading'} aria-hidden={state === 'error' ? true : props['aria-hidden']}
      onLoad={event => { setResult({ src, state: 'loaded' }); onLoad?.(event); }}
      onError={event => { setResult({ src, state: 'error' }); onError?.(event); }} />
  </>;
}
