import { useState } from 'react';
import { CheckCircle, Loader } from 'lucide-react';
import { backend } from '../services';

const HERO_IMG = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80';
const TEAM_IMG  = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80';

const DISPOS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Week-end'];

export default function BecomeVolunteer() {
  const [form, setForm] = useState({
    type: 'benevole',
    prenom: '', nom: '', email: '', tel: '',
    ville: '', competences: '', message: '',
    disponibilites: [] as string[],
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const toggleDispo = (d: string) =>
    setForm(f => ({
      ...f,
      disponibilites: f.disponibilites.includes(d)
        ? f.disponibilites.filter(x => x !== d)
        : [...f.disponibilites, d],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const result = await backend.submitVolunteer({
        type: form.type === 'benevole' ? 'Bénévole' : 'Membre adhérent',
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        tel: form.tel || 'Non renseigné',
        ville: form.ville,
        competences: form.competences || 'Non renseigné',
        disponibilites: form.disponibilites,
        message: form.message || 'Aucun message',
      });
      setStatus(result.success ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <section style={{ background: 'var(--bg)', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            width: '100px', height: '100px',
            background: 'linear-gradient(135deg, var(--sef-green), #3a9140)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2rem',
            boxShadow: '0 20px 60px rgba(75,174,79,0.3)',
            animation: 'fadeUp 0.5s ease',
          }}>
            <CheckCircle size={48} color="white" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem' }}>
            Merci pour votre candidature !
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            Nous avons bien reçu votre demande. Un responsable SEF vous contactera sous 48h pour un entretien de découverte.
          </p>
          <button className="btn btn-primary" onClick={() => setStatus('idle')}>
            Retour au formulaire
          </button>
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: 'var(--bg)' }}>

      {/* Hero banner */}
      <div style={{
        position: 'relative',
        height: '280px',
        overflow: 'hidden',
        marginBottom: '0',
      }}>
        <img src={HERO_IMG} alt="Bénévoles SEF" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(26,26,26,0.82), rgba(75,174,79,0.5))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem',
        }}>
          <div className="rainbow-bar" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
          <span className="tag" style={{ background: 'rgba(75,174,79,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}>
            Rejoignez-nous
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white', fontWeight: 700, textAlign: 'center' }}>
            Devenir Bénévole ou Membre
          </h2>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>

          {/* Left: Info */}
          <div>
            {/* Team photo */}
            <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
              <img src={TEAM_IMG} alt="Équipe bénévoles" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '1.05rem' }}>
              Rejoindre le SEF, c'est donner de votre temps et de vos talents pour servir ceux qui en ont besoin.
              Chaque bénévole apporte une différence concrète.
            </p>

            {/* Type selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { type: 'benevole', titre: '🙌 Bénévole', desc: 'Donnez de votre temps librement selon vos disponibilités. Aucun engagement de durée requis.', color: 'var(--sef-teal)', bg: 'rgba(41,171,226,0.06)' },
                { type: 'membre', titre: '⭐ Membre adhérent', desc: "Devenez membre de l'association et participez aux décisions de la vie associative.", color: 'var(--sef-green)', bg: 'rgba(75,174,79,0.06)' },
              ].map((opt) => (
                <div
                  key={opt.type}
                  onClick={() => setForm(f => ({ ...f, type: opt.type }))}
                  style={{
                    border: `2px solid ${form.type === opt.type ? opt.color : 'var(--border)'}`,
                    background: form.type === opt.type ? opt.bg : 'white',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem', color: opt.color }}>{opt.titre}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{opt.desc}</div>
                </div>
              ))}
            </div>

            {/* Profiles searched */}
            <div style={{ background: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)', borderRadius: '16px', padding: '1.5rem', color: 'white' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Profils recherchés</h4>
              {['💼 Travailleurs sociaux, psychologues', '👩‍⚕️ Professions médicales', '📚 Enseignants, formateurs', '🍳 Cuisiniers, logisticiens', '💻 Informaticiens, communicants', '🤝 Tout profil motivé !'].map(p => (
                <div key={p} style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{p}</div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2.5rem',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.07)',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 700 }}>
              Formulaire de candidature
            </h3>

            {/* Backend notice */}
            <div style={{
              background: 'rgba(41,171,226,0.06)', border: '1px solid rgba(41,171,226,0.2)',
              borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem',
              color: 'var(--sef-teal)', marginBottom: '1.25rem',
            }}>
              ✉️ Votre candidature sera envoyée à <strong>contact@secoursevangeliquedefrance.com</strong>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label>Prénom *</label><input required value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} placeholder="Marie" /></div>
                <div><label>Nom *</label><input required value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Dupont" /></div>
              </div>
              <div><label>Email *</label><input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="marie@exemple.fr" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label>Téléphone</label><input type="tel" value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} placeholder="06 XX XX XX XX" /></div>
                <div><label>Ville *</label><input required value={form.ville} onChange={e => setForm(f => ({ ...f, ville: e.target.value }))} placeholder="Paris" /></div>
              </div>
              <div><label>Compétences ou centres d'intérêt</label><input value={form.competences} onChange={e => setForm(f => ({ ...f, competences: e.target.value }))} placeholder="Cuisine, informatique, soutien scolaire..." /></div>

              <div>
                <label>Disponibilités</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {DISPOS.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDispo(d)}
                      style={{
                        padding: '0.4rem 0.9rem',
                        borderRadius: '50px',
                        border: `2px solid ${form.disponibilites.includes(d) ? 'var(--sef-teal)' : 'var(--border)'}`,
                        background: form.disponibilites.includes(d) ? 'rgba(41,171,226,0.1)' : 'white',
                        color: form.disponibilites.includes(d) ? 'var(--sef-teal)' : 'var(--text-secondary)',
                        fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                        transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label>Message (optionnel)</label>
                <textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Parlez-nous de votre motivation..." style={{ resize: 'vertical' }} />
              </div>

              {status === 'error' && (
                <div style={{ background: '#FFF0EF', border: '1px solid #FFCCC9', borderRadius: '10px', padding: '0.75rem 1rem', color: 'var(--sef-red)', fontSize: '0.875rem', fontWeight: 600 }}>
                  ⚠️ Erreur lors de l'envoi. Vérifiez votre configuration EmailJS ou réessayez.
                </div>
              )}

              <button
                type="submit"
                className="btn btn-green"
                disabled={status === 'sending'}
                style={{ justifyContent: 'center', fontSize: '1rem', padding: '1rem', gap: '0.6rem' }}
              >
                {status === 'sending'
                  ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Envoi en cours...</>
                  : '✅ Envoyer ma candidature'
                }
              </button>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
                Vos données sont traitées conformément au RGPD et ne seront jamais cédées à des tiers.
              </p>
            </form>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
