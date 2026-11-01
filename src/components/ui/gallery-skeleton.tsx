import './gallery-skeleton.css';

export function GallerySkeleton() {
  return <div className="gallery-loading" role="status" aria-label="Loading style gallery">
    <span className="gallery-loading__tile"><span className="image-skeleton" /></span>
    <span className="gallery-loading__tile"><span className="image-skeleton" /></span>
    <span className="gallery-loading__tile"><span className="image-skeleton" /></span>
    <span className="sr-only">Loading hairstyle inspiration</span>
  </div>;
}
