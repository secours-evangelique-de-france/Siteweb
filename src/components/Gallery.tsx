import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, ZoomIn } from 'lucide-react';
import { GALLERY_PHOTOS } from '../galleryData';
import { GalleryCategorie, GalleryPhoto } from '../types';

const CATEGORIES: { id: GalleryCategorie; label: string; icon: string; color: string }[] = [
  { id: 'all',         label: 'Toutes',       icon: '🌟', color: 'var(--sef-teal)' },
  { id: 'terrain',     label: 'Actions terrain', icon: '🤝', color: 'var(--sef-red)' },
  { id: 'alimentation',label: 'Alimentation',  icon: '🛒', color: 'var(--sef-orange)' },
  { id: 'jeunesse',    label: 'Jeunesse',      icon: '🌱', color: 'var(--sef-green)' },
  { id: 'benevoles',   label: 'Bénévoles',     icon: '🙌', color: 'var(--sef-blue)' },
  { id: 'evenements',  label: 'Événements',    icon: '🎉', color: 'var(--sef-purple)' },
];

export default function Gallery() {
  const [cat, setCat] = useState<GalleryCategorie>('all');
  const [lightbox, setLightbox] = useState<number | null>(null); // index in filtered
  const [loaded, setLoaded] = useState<Set<string>>(new Set());

  const filtered = cat === 'all' ? GALLERY_PHOTOS : GALLERY_PHOTOS.filter(p => p.categorie === cat);

  const openLightbox = (idx: number) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);

  const prev = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox - 1 + filtered.length) % filtered.length);
  }, [lightbox, filtered.length]);

  const next = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox + 1) % filtered.length);
  }, [lightbox, filtered.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, prev, next]);

  // Prevent scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  const currentCat = CATEGORIES.find(c => c.id === cat)!;
  const currentPhoto: GalleryPhoto | null = lightbox !== null ? filtered[lightbox] : null;

  return (
    <section style={{ background: 'var(--bg)', minHeight: '80vh' }}>
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="tag" style={{ background: 'rgba(139,56,162,0.1)', color: 'var(--sef-purple)', marginBottom: '1rem' }}>
            Photos & vidéos
          </span>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>Notre Galerie</h2>
          <div className="divider" style={{ background: 'linear-gradient(to right, var(--sef-red), var(--sef-purple))', margin: '1rem auto 1.5rem' }} />
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Des instants de solidarité capturés sur le terrain, lors d'événements et avec nos équipes de bénévoles.
          </p>
        </div>

        {/* Category filters */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '3rem',
        }}>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => { setCat(c.id); setLightbox(null); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: '50px',
                border: `2px solid ${cat === c.id ? c.color : 'var(--border)'}`,
                background: cat === c.id ? c.color : 'white',
                color: cat === c.id ? 'white' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.2s',
                boxShadow: cat === c.id ? `0 4px 16px ${c.color}40` : 'none',
              }}
            >
              <span>{c.icon}</span> {c.label}
              <span style={{
                background: cat === c.id ? 'rgba(255,255,255,0.25)' : 'var(--border)',
                color: cat === c.id ? 'white' : 'var(--text-muted)',
                borderRadius: '50px',
                padding: '0.05rem 0.5rem',
                fontSize: '0.75rem',
              }}>
                {c.id === 'all' ? GALLERY_PHOTOS.length : GALLERY_PHOTOS.filter(p => p.categorie === c.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Masonry-style grid */}
        <div style={{
          columns: '4 280px',
          columnGap: '1rem',
          animation: 'fadeIn 0.4s ease',
        }}>
          {filtered.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(idx)}
              style={{
                breakInside: 'avoid',
                marginBottom: '1rem',
                borderRadius: '14px',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                display: 'block',
                background: '#e8e8e8',
              }}
              className="gallery-item"
            >
              <img
                src={photo.thumb}
                alt={photo.titre}
                loading="lazy"
                onLoad={() => setLoaded(s => new Set(s).add(photo.id))}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  opacity: loaded.has(photo.id) ? 1 : 0,
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                }}
              />
              {/* Hover overlay */}
              <div className="gallery-overlay" style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1rem',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}>
                <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  {photo.titre}
                </div>
                {photo.lieu && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
                    <MapPin size={12} /> {photo.lieu}
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: '0.35rem',
                  backdropFilter: 'blur(4px)',
                }}>
                  <ZoomIn size={16} color="white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload CTA */}
        <div style={{
          marginTop: '4rem',
          textAlign: 'center',
          background: 'white',
          borderRadius: '20px',
          padding: '2.5rem',
          border: '2px dashed var(--border)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📸</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
            Vous avez des photos de nos actions ?
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Partagez vos photos terrain avec nous ! Elles enrichiront notre galerie et témoigneront de nos actions.
          </p>
          <a
            href="mailto:contact@secoursevangeliquedefrance.com?subject=Partage de photos SEF"
            className="btn btn-primary"
          >
            📧 Envoyer des photos
          </a>
        </div>
      </div>

      {/* ────────── LIGHTBOX ────────── */}
      {lightbox !== null && currentPhoto && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              transition: 'background 0.2s',
              zIndex: 1,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <div style={{
            position: 'absolute',
            top: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}>
            {lightbox + 1} / {filtered.length}
          </div>

          {/* Prev */}
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            style={{
              position: 'absolute',
              left: '1.5rem',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '52px',
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Image */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <img
              key={currentPhoto.id}
              src={currentPhoto.url}
              alt={currentPhoto.titre}
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '12px',
                animation: 'fadeIn 0.25s ease',
                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>
                {currentPhoto.titre}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                {currentPhoto.lieu && (
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={13} /> {currentPhoto.lieu}
                  </span>
                )}
                <span style={{
                  background: CATEGORIES.find(c => c.id === currentPhoto.categorie)?.color,
                  color: 'white',
                  padding: '0.2rem 0.7rem',
                  borderRadius: '50px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}>
                  {CATEGORIES.find(c => c.id === currentPhoto.categorie)?.icon}{' '}
                  {CATEGORIES.find(c => c.id === currentPhoto.categorie)?.label}
                </span>
              </div>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            style={{
              position: 'absolute',
              right: '1.5rem',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '52px',
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            <ChevronRight size={24} />
          </button>

          {/* Thumbnail strip */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.5rem',
            maxWidth: '80vw',
            overflowX: 'auto',
            padding: '0.5rem',
          }}>
            {filtered.map((p, i) => (
              <img
                key={p.id}
                src={p.thumb}
                alt=""
                onClick={e => { e.stopPropagation(); setLightbox(i); }}
                style={{
                  width: '52px',
                  height: '40px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  opacity: i === lightbox ? 1 : 0.45,
                  border: i === lightbox ? '2px solid white' : '2px solid transparent',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        .gallery-item:hover .gallery-overlay { opacity: 1 !important; }
        .gallery-item:hover img { transform: scale(1.04); }
        @media (max-width: 600px) {
          [style*="columns: 4"] { columns: 2 !important; }
        }
      `}</style>
    </section>
  );
}
