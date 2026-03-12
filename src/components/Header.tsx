import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NavPage } from '../types';
import logoSef from '../assets/logosef.jpeg';

interface HeaderProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

const NAV_ITEMS: { id: NavPage; label: string }[] = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'missions', label: 'Nos Missions' },
  { id: 'actualites', label: 'Actualités' },
  { id: 'antennes', label: 'Trouver une Antenne' },
  { id: 'galerie', label: 'Galerie' },
  { id: 'benevole', label: 'Devenir Bénévole' },
  { id: 'contact', label: 'Contact' },
];

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (page: NavPage) => {
    onNavigate(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid #E8E4DF' : '1px solid transparent',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.06)' : 'none',
      }}>
        {/* Rainbow top bar */}
        <div className="rainbow-bar" />
        
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 0',
        }}>
          {/* Logo */}
          <button
            onClick={() => handleNav('accueil')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <img
              src={logoSef}
              alt="SEF Logo"
              style={{
                height: '52px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </button>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                style={{
                  background: currentPage === item.id ? 'var(--sef-red)' : 'none',
                  color: currentPage === item.id ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (currentPage !== item.id) {
                    (e.currentTarget as HTMLButtonElement).style.background = '#f5f5f5';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={e => {
                  if (currentPage !== item.id) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'none';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              className="btn btn-primary"
              onClick={() => handleNav('don')}
              style={{ marginLeft: '0.5rem', padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}
            >
              ❤️ Faire un don
            </button>
          </nav>

          {/* Mobile burger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'none',
            }}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            background: 'white',
            borderTop: '1px solid var(--border)',
            padding: '1rem',
          }}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  background: currentPage === item.id ? '#FFF0EF' : 'none',
                  color: currentPage === item.id ? 'var(--sef-red)' : 'var(--text-primary)',
                  border: 'none',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  marginBottom: '0.25rem',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
