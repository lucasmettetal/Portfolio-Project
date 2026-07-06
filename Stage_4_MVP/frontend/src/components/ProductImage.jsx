import { useState, useEffect } from 'react';

export default function ProductImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div className={`bg-stone flex items-center justify-center ${className}`}>
        <span className="text-[10px] uppercase tracking-widest text-muted">Pas de photo</span>
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}
