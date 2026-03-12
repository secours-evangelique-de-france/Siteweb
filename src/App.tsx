import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Missions from './components/Missions';
import FindAntenne from './components/FindAntenne';
import BecomeVolunteer from './components/BecomeVolunteer';
import Donate from './components/Donate';
import Contact from './components/Contact';
import Gallery from './components/Gallery';
import NewsSection from './components/NewsSection';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import { NavPage } from './types';

// Unsplash images
const IMG_HERO_BG   = 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600&q=80';
const IMG_TEAM      = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=80';
const IMG_FOOD      = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=700&q=80';
const IMG_YOUTH     = 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=700&q=80';
const IMG_ELDERLY   = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80';
const IMG_COMMUNITY = 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=700&q=80';

export default function App() {
  const [page, setPage] = useState<NavPage>('accueil');

  const goTo = (p: NavPage) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page) {
      case 'accueil':    return <HomePage goTo={goTo} />;
      case 'missions':   return <Missions onNavigate={function (page: NavPage): void {
        throw new Error('Function not implemented.');
      } } />;
      case 'antennes':   return <FindAntenne />;
      case 'benevole':   return <BecomeVolunteer />;
      case 'don':        return <Donate />;
      case 'galerie':    return <Gallery />;
      case 'actualites': return <NewsSection />;
      case 'contact':    return <Contact />;
      default:           return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header currentPage={page} onNavigate={goTo} />
      <main style={{ flex: 1, paddingTop: page !== 'accueil' ? '90px' : '0' }}>
        {renderPage()}
      </main>
      <Footer onNavigate={goTo} />
      <Chatbot />
    </div>
  );
}

// ─── HomePage ──────────────────────────────────────────────────────
function HomePage({ goTo }: { goTo: (p: NavPage) => void }) {
  return (
    <>
      <Hero onNavigate={goTo} />

      {/* Image strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem', height: '340px', overflow: 'hidden' }}>
        <div className="home-img-item" style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => goTo('galerie')}>
          <img src={IMG_TEAM} alt="Équipe SEF" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
          <div className="home-img-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'flex-end', padding: '1.5rem', transition: 'background 0.3s' }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>🙌 Nos bénévoles en action</span>
          </div>
        </div>
        <div className="home-img-item" style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => goTo('galerie')}>
          <img src={IMG_FOOD} alt="Distribution alimentaire" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
          <div className="home-img-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'flex-end', padding: '1rem', transition: 'background 0.3s' }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>🛒 NOUBES</span>
          </div>
        </div>
        <div className="home-img-item" style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => goTo('galerie')}>
          <img src={IMG_YOUTH} alt="Jeunesse" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
          <div className="home-img-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'flex-end', padding: '1rem', transition: 'background 0.3s' }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>🌱 Jeunesse</span>
          </div>
        </div>
      </div>

      {/* Missions preview */}
      <section style={{ background: 'white', padding: '5rem 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>Nos domaines d'intervention</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>10 missions pour accompagner les plus vulnérables</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
            {[
              { icon: '🌱', label: 'Jeunesse',      color: '#4BAE4F' },
              { icon: '❤️', label: 'Santé',          color: '#E8281E' },
              { icon: '📚', label: 'Éducation',      color: '#2472C8' },
              { icon: '🏠', label: 'Famille',         color: '#F5C518' },
              { icon: '🏘️', label: 'Logement',        color: '#8B38A2' },
              { icon: '🛒', label: 'NOUBES',          color: '#F05A28' },
              { icon: '💼', label: 'Emploi',          color: '#29ABE2' },
              { icon: '🌟', label: 'Séniors',         color: '#4BAE4F' },
              { icon: '🎨', label: 'Culture',         color: '#E8281E' },
              { icon: '🗺️', label: 'Territoires',     color: '#8B38A2' },
            ].map(m => (
              <div key={m.label} onClick={() => goTo('missions')} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                padding: '1.5rem 1rem', borderRadius: '16px',
                background: `${m.color}10`, border: `1px solid ${m.color}20`,
                cursor: 'pointer', transition: 'all 0.25s',
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${m.color}20`; el.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${m.color}10`; el.style.transform = 'translateY(0)'; }}
              >
                <span style={{ fontSize: '1.8rem' }}>{m.icon}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: m.color, textAlign: 'center' }}>{m.label}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-secondary" onClick={() => goTo('missions')}>Découvrir toutes nos missions →</button>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section style={{ background: 'linear-gradient(135deg, var(--sef-red), var(--sef-orange))', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center', color: 'white' }}>
            {[
              { value: '13', label: 'Antennes en France', icon: '📍' },
              { value: '2000+', label: 'Familles aidées / an', icon: '👨‍👩‍👧' },
              { value: '480+', label: 'Bénévoles actifs', icon: '🙌' },
              { value: '10', label: 'Missions différentes', icon: '🌟' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.85, marginTop: '0.5rem', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest news preview */}
      <section style={{ background: 'var(--surface-warm)', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Dernières Actualités</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Restez informés de nos actions et événements</p>
            </div>
            <button className="btn btn-secondary" onClick={() => goTo('actualites')}>Toutes les actualités →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { titre: 'Grande collecte de Noël 2024 : un succès !', date: '28 déc. 2024', cat: '🤝 Actions terrain', img: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&q=80', color: '#E8281E' },
              { titre: 'Partenariat avec la Mairie de Créteil', date: '15 jan. 2025', cat: '🤲 Partenariats', img: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80', color: '#29ABE2' },
              { titre: 'Journée formation bénévoles — 15 mars', date: '10 fév. 2025', cat: '🙌 Bénévolat', img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80', color: '#4BAE4F' },
            ].map(n => (
              <div key={n.titre} onClick={() => goTo('actualites')} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
              >
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <img src={n.img} alt={n.titre} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <span style={{ background: `${n.color}15`, color: n.color, borderRadius: '50px', padding: '0.2rem 0.7rem', fontSize: '0.72rem', fontWeight: 700, display: 'inline-block', marginBottom: '0.75rem' }}>{n.cat}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.5rem' }}>{n.titre}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📅 {n.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Illustrated about section */}
      <section style={{ background: 'var(--bg)', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '4rem' }}>
            <div>
              <span className="tag" style={{ background: 'rgba(139,56,162,0.1)', color: 'var(--sef-purple)', marginBottom: '1rem', display: 'inline-block' }}>Notre identité</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.3 }}>
                Une association fondée sur la foi et le service
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '1.5rem' }}>
                Fondée sur des valeurs évangéliques, le SEF croit que chaque être humain mérite dignité, respect et accompagnement.
                Nos équipes de bénévoles agissent chaque jour avec amour et professionnalisme dans 13 villes françaises.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" onClick={() => goTo('missions')}>Nos missions</button>
                <button className="btn btn-primary" onClick={() => goTo('don')}>❤️ Soutenir</button>
              </div>
            </div>
            <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.12)', position: 'relative' }}>
              <img src={IMG_COMMUNITY} alt="Équipe solidaire" style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'rgba(255,255,255,0.95)', borderRadius: '12px', padding: '0.75rem 1.25rem', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>480+ bénévoles</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>actifs en France</div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.25rem' }}>
            {[
              { icon: '✝️', title: 'Foi', desc: 'Ancrés dans nos convictions évangéliques', color: 'var(--sef-purple)', img: IMG_COMMUNITY },
              { icon: '🤝', title: 'Solidarité', desc: 'Ensemble, on est plus forts', color: 'var(--sef-teal)', img: IMG_TEAM },
              { icon: '💪', title: 'Action', desc: 'Des résultats concrets chaque jour', color: 'var(--sef-green)', img: IMG_FOOD },
              { icon: '🌍', title: 'Inclusion', desc: 'Ouverts à toutes et à tous', color: 'var(--sef-orange)', img: IMG_ELDERLY },
            ].map(v => (
              <div key={v.title} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', transition: 'transform 0.3s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
              >
                <div style={{ height: '120px', overflow: 'hidden' }}>
                  <img src={v.img} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.25rem', borderTop: `4px solid ${v.color}` }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{v.icon}</div>
                  <div style={{ fontWeight: 700, color: v.color, marginBottom: '0.25rem' }}>{v.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section style={{ background: 'white', padding: '5rem 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { icon: '🙌', title: 'Devenir Bénévole', desc: "Donnez de votre temps pour accompagner les familles en difficulté.", cta: 'Rejoindre', page: 'benevole' as NavPage, color: 'var(--sef-teal)', bg: 'rgba(41,171,226,0.06)' },
              { icon: '❤️', title: 'Faire un Don', desc: "Votre contribution finance directement nos actions terrain.", cta: 'Donner', page: 'don' as NavPage, color: 'var(--sef-red)', bg: 'rgba(232,40,30,0.06)' },
              { icon: '📍', title: 'Trouver une Antenne', desc: "Trouvez l'antenne SEF la plus proche de chez vous.", cta: 'Chercher', page: 'antennes' as NavPage, color: 'var(--sef-green)', bg: 'rgba(75,174,79,0.06)' },
            ].map(card => (
              <div key={card.title} style={{ background: card.bg, border: `2px solid ${card.color}30`, borderRadius: '20px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{card.icon}</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: card.color, marginBottom: '0.5rem' }}>{card.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{card.desc}</p>
                </div>
                <button className="btn" onClick={() => goTo(card.page)} style={{ background: card.color, color: 'white', justifyContent: 'center', marginTop: 'auto', boxShadow: `0 4px 20px ${card.color}30` }}>
                  {card.cta} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .home-img-item:hover img { transform: scale(1.06); }
        .home-img-item:hover .home-img-overlay { background: rgba(0,0,0,0.15) !important; }
        @media (max-width: 768px) {
          [style*="grid-template-columns: 2fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; grid-template-rows: 200px 200px !important; height: auto !important; }
          [style*="grid-template-columns: repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          [style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
          [style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          [style*="grid-template-columns: repeat(5, 1fr)"] { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </>
  );
}
