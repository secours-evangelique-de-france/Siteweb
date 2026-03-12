const logoSef = '/logosef.jpeg';

export default function About() {
  return (
    <section style={{ background: 'var(--bg)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="tag" style={{ background: 'rgba(139,56,162,0.1)', color: 'var(--sef-purple)', marginBottom: '1rem' }}>
            Qui sommes-nous
          </span>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>À propos du SEF</h2>
          <div className="divider" style={{ background: 'var(--sef-purple)', margin: '1rem auto 1.5rem' }} />
        </div>

        {/* Main section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '5rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.3 }}>
              Une association ancrée dans la foi et l'action
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
              Le Secours Évangélique de France (SEF) est une association Loi 1901 fondée pour répondre
              aux besoins des personnes en situation de précarité, d'exclusion et de souffrance.
              Inspirés par les valeurs évangéliques de fraternité, d'amour du prochain et de service,
              nos bénévoles et membres s'engagent chaque jour sur le terrain.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
              Présent dans de nombreuses villes françaises à travers ses antennes relais, le SEF intervient
              dans des domaines essentiels : alimentation, logement, santé, insertion professionnelle,
              soutien à la jeunesse et bien plus encore.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '1.05rem' }}>
              Notre siège national est basé à Croissy-Beaubourg (Seine-et-Marne), et nous coordonnons
              un réseau national d'antennes locales qui assurent une présence de proximité auprès des
              populations vulnérables.
            </p>
          </div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: 'white', borderRadius: '24px', padding: '3rem',
              boxShadow: '0 30px 80px rgba(0,0,0,0.1)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
            }}>
              <img src={logoSef} alt="SEF" style={{ height: '150px', width: 'auto' }} />
              <div className="rainbow-bar" style={{ borderRadius: '4px', width: '100%' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Secours Évangélique de France
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Association Loi 1901 — SIRET XXXXXXXXX</div>
              </div>
            </div>
            <div style={{
              position: 'absolute', top: '-20px', right: '-15px',
              background: 'var(--sef-red)', color: 'white',
              borderRadius: '14px', padding: '0.6rem 1rem',
              fontWeight: 700, fontSize: '0.8rem',
              boxShadow: '0 8px 20px rgba(232,40,30,0.3)',
            }}>
              Depuis 2006
            </div>
          </div>
        </div>

        {/* Organigramme summary */}
        <div style={{ marginBottom: '5rem' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700,
            textAlign: 'center', marginBottom: '2.5rem',
          }}>
            Notre organisation nationale
          </h3>

          {/* Governance */}
          <div style={{
            background: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
            borderRadius: '20px', padding: '2rem', marginBottom: '2rem', color: 'white',
          }}>
            <div className="rainbow-bar" style={{ marginBottom: '1.5rem', borderRadius: '4px' }} />
            <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              🏛️ Gouvernance
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
              {['Président', 'Trésorier', 'Secrétaire Général', 'Comité Exécutif', 'Bureau de la Foi', 'Comité Exécutif Élargi', 'Commission de nomination', 'Commissions Nationales'].map((role) => (
                <div key={role} style={{
                  background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.75rem',
                  fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', color: 'rgba(255,255,255,0.9)',
                }}>
                  {role}
                </div>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              {
                title: '🌟 Missions', color: 'var(--sef-teal)',
                items: ['Jeunesse', 'Santé Soins et Vie', 'Réussite Éducative', 'Famille et Enfants', 'Hébergement', 'NOUBES', 'Réinsertion & Emploi', 'Séniors', 'Culture & Sport', 'Animation des Territoires'],
              },
              {
                title: '⚙️ Services', color: 'var(--sef-green)',
                items: ['Communication & Marketing', 'Logistique et Transport', 'Digital & Numérique', 'Opérations de Proximité', 'Juridique & Conformité', 'Audit & Contrôle', 'RH & Recrutement', 'Finances & Comptabilité', 'Partenariats & Financements', 'Administration Générale'],
              },
              {
                title: '📍 Exécutif Territorial', color: 'var(--sef-purple)',
                items: ['Représentants Locaux', 'Responsables Intercommunalités', 'Coordonnateurs Départementaux', 'Délégués Régionaux', 'Comité Exécutif Régional', 'Comité Exécutif Départemental'],
              },
            ].map((dept) => (
              <div key={dept.title} style={{
                background: 'white', borderRadius: '16px', padding: '1.5rem',
                border: `2px solid ${dept.color}30`,
                borderTop: `4px solid ${dept.color}`,
              }}>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: dept.color }}>{dept.title}</h4>
                {dept.items.map((item) => (
                  <div key={item} style={{
                    fontSize: '0.85rem', color: 'var(--text-secondary)',
                    padding: '0.3rem 0', borderBottom: '1px solid var(--border)',
                    lineHeight: 1.6,
                  }}>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div style={{
          background: 'white', borderRadius: '24px', padding: '3rem',
          border: '1px solid var(--border)',
          textAlign: 'center',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, marginBottom: '2rem' }}>
            Nos Antennes en France
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            {[
              { nom: 'Croissy-Beaubourg', siege: true },
              { nom: 'Les Mureaux' }, { nom: 'La Défense' },
              { nom: 'Boissy-Saint-Léger' }, { nom: 'Versailles' },
              { nom: 'Gonesse' }, { nom: 'Chanteloup-les-Vignes' },
              { nom: 'Viry-Châtillon' }, { nom: 'Créteil' },
              { nom: 'Orléans' }, { nom: 'Massy' },
              { nom: 'Le Mans' }, { nom: 'Compiègne' },
            ].map((a) => (
              <div key={a.nom} style={{
                background: a.siege ? 'var(--sef-red)' : 'rgba(41,171,226,0.1)',
                color: a.siege ? 'white' : 'var(--sef-teal)',
                borderRadius: '50px',
                padding: '0.4rem 1.2rem',
                fontWeight: 700,
                fontSize: '0.875rem',
              }}>
                📍 {a.nom} {a.siege ? '(Siège)' : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
