import { useState, useEffect } from 'react';
import { Calendar, MapPin, ExternalLink, ChevronRight, Pin, Rss } from 'lucide-react';
import { NewsItem, NewsCategorie } from '../types';
import { backend } from '../services';

const CAT_CONFIG: Record<NewsCategorie, { label: string; icon: string; color: string; bg: string }> = {
  terrain:      { label: 'Actions terrain',  icon: '🤝', color: '#E8281E', bg: 'rgba(232,40,30,0.1)' },
  evenement:    { label: 'Événements',        icon: '🎉', color: '#8B38A2', bg: 'rgba(139,56,162,0.1)' },
  partenariat:  { label: 'Partenariats',      icon: '🤲', color: '#29ABE2', bg: 'rgba(41,171,226,0.1)' },
  don:          { label: 'Appel aux dons',    icon: '❤️', color: '#F05A28', bg: 'rgba(240,90,40,0.1)' },
  benevole:     { label: 'Bénévolat',         icon: '🙌', color: '#4BAE4F', bg: 'rgba(75,174,79,0.1)' },
  annonce:      { label: 'Annonces',          icon: '📢', color: '#2472C8', bg: 'rgba(36,114,200,0.1)' },
};

const ALL_CATS: (NewsCategorie | 'all')[] = ['all', 'terrain', 'evenement', 'partenariat', 'don', 'benevole', 'annonce'];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

interface NewsCardProps {
  item: NewsItem;
  featured?: boolean;
  onClick: () => void;
}

function NewsCard({ item, featured, onClick }: NewsCardProps) {
  const cat = CAT_CONFIG[item.categorie];
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: featured ? 'grid' : 'flex',
        gridTemplateColumns: featured ? '1.2fr 1fr' : undefined,
        flexDirection: featured ? undefined : 'column',
        boxShadow: item.epingle ? '0 8px 30px rgba(232,40,30,0.1)' : undefined,
        borderTop: item.epingle ? '3px solid var(--sef-red)' : undefined,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = item.epingle ? '0 8px 30px rgba(232,40,30,0.1)' : '';
      }}
    >
      {/* Image */}
      {item.image && (
        <div style={{
          height: featured ? '100%' : '200px',
          minHeight: featured ? '260px' : undefined,
          overflow: 'hidden',
          position: 'relative',
          background: '#e8e8e8',
          flexShrink: 0,
        }}>
          <img
            src={item.image}
            alt={item.titre}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {item.epingle && (
            <div style={{
              position: 'absolute', top: '0.75rem', left: '0.75rem',
              background: 'var(--sef-red)', color: 'white',
              borderRadius: '8px', padding: '0.3rem 0.6rem',
              fontSize: '0.7rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: '0.3rem',
            }}>
              <Pin size={11} /> À la une
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: featured ? '2rem' : '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{
            background: cat.bg, color: cat.color,
            borderRadius: '50px', padding: '0.2rem 0.75rem',
            fontSize: '0.72rem', fontWeight: 700,
          }}>
            {cat.icon} {cat.label}
          </span>
          {item.antenne && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <MapPin size={11} /> {item.antenne}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: featured ? '1.35rem' : '1rem',
          fontWeight: 700,
          lineHeight: 1.3,
          color: 'var(--text-primary)',
          flex: featured ? 1 : undefined,
        }}>
          {item.titre}
        </h3>

        {/* Resume */}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
          lineHeight: 1.7,
          display: '-webkit-box',
          WebkitLineClamp: featured ? 4 : 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {item.resume}
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={12} /> {formatDate(item.date)}
          </span>
          <span style={{
            fontSize: '0.8rem', fontWeight: 700, color: cat.color,
            display: 'flex', alignItems: 'center', gap: '0.25rem',
          }}>
            Lire <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Modal article ──────────────────────────────────────────────────
function NewsModal({ item, onClose }: { item: NewsItem; onClose: () => void }) {
  const cat = CAT_CONFIG[item.categorie];
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc); };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: '20px',
          maxWidth: '680px', width: '100%',
          maxHeight: '90vh', overflowY: 'auto',
          animation: 'fadeUp 0.25s ease',
        }}
      >
        {item.image && (
          <div style={{ height: '260px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
            <img src={item.image} alt={item.titre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ background: cat.bg, color: cat.color, borderRadius: '50px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 700 }}>
              {cat.icon} {cat.label}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={12} /> {formatDate(item.date)}
            </span>
            {item.antenne && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={12} /> {item.antenne}
              </span>
            )}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.3 }}>
            {item.titre}
          </h2>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
            {item.contenu}
          </div>
          {item.lien && (
            <a href={item.lien} target="_blank" rel="noopener noreferrer" className="btn btn-primary"
              style={{ marginTop: '1.5rem', display: 'inline-flex', gap: '0.5rem' }}>
              <ExternalLink size={16} /> Voir plus
            </a>
          )}
          <button
            onClick={onClose}
            style={{
              display: 'block', marginTop: '1.5rem', background: 'none', border: '2px solid var(--border)',
              borderRadius: '10px', padding: '0.6rem 1.5rem', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--text-secondary)',
            }}
          >
            ← Retour aux actualités
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────
export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState<NewsCategorie | 'all'>('all');
  const [selected, setSelected] = useState<NewsItem | null>(null);

  useEffect(() => {
    backend.getNews().then(data => {
      setNews(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setLoading(false);
    });
  }, []);

  const filtered = cat === 'all' ? news : news.filter(n => n.categorie === cat);
  const pinned = filtered.filter(n => n.epingle);
  const rest   = filtered.filter(n => !n.epingle);

  return (
    <section style={{ background: 'var(--bg)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="tag" style={{ background: 'rgba(36,114,200,0.1)', color: 'var(--sef-blue)', marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Rss size={13} /> Fil d'actualités
          </span>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>Nos Actualités</h2>
          <div className="divider" style={{ background: 'var(--sef-blue)', margin: '1rem auto 1.5rem' }} />
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Suivez toutes nos actions, événements et annonces en temps réel depuis nos antennes.
          </p>
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
          {ALL_CATS.map(c => {
            const cfg = c === 'all' ? { label: 'Toutes', icon: '🌟', color: 'var(--sef-teal)', bg: 'rgba(41,171,226,0.1)' } : CAT_CONFIG[c];
            const active = cat === c;
            return (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: '0.5rem 1.1rem', borderRadius: '50px',
                border: `2px solid ${active ? cfg.color : 'var(--border)'}`,
                background: active ? cfg.color : 'white',
                color: active ? 'white' : 'var(--text-secondary)',
                fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                fontFamily: 'var(--font-body)', transition: 'all 0.2s',
              }}>
                {cfg.icon} {cfg.label}
              </button>
            );
          })}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'float 1.5s ease infinite' }}>⏳</div>
            Chargement des actualités…
          </div>
        )}

        {/* Pinned (featured) */}
        {!loading && pinned.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {pinned.map(item => <NewsCard key={item.id} item={item} featured onClick={() => setSelected(item)} />)}
          </div>
        )}

        {/* Grid */}
        {!loading && rest.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {rest.map(item => <NewsCard key={item.id} item={item} onClick={() => setSelected(item)} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</div>
            Aucune actualité dans cette catégorie pour le moment.
          </div>
        )}

        {/* RSS subscribe suggestion */}
        <div style={{
          marginTop: '3rem', textAlign: 'center',
          background: 'white', borderRadius: '16px', padding: '2rem',
          border: '1px solid var(--border)',
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            📧 Vous souhaitez recevoir nos actualités par email ?{' '}
            <a href="mailto:contact@secoursevangeliquedefrance.com?subject=Abonnement newsletter SEF"
              style={{ color: 'var(--sef-teal)', fontWeight: 700, textDecoration: 'none' }}>
              Contactez-nous pour vous abonner à notre newsletter
            </a>
          </p>
        </div>
      </div>

      {selected && <NewsModal item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
