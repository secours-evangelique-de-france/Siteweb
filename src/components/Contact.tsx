import { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { backend } from '../services';
import { ContactFormData } from '../types';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const [form, setForm] = useState<ContactFormData>({
    prenom: '', nom: '', email: '', sujet: '', message: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const result = await backend.submitContact(form);
      if (result.success) {
        setStatus('success');
        setForm({ prenom: '', nom: '', email: '', sujet: '', message: '' });
      } else {
        setStatus('error');
        setFeedback(result.message);
      }
    } catch {
      setStatus('error');
      setFeedback("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <section style={{ background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="tag" style={{ background: 'rgba(41,171,226,0.12)', color: 'var(--sef-teal)', marginBottom: '1rem' }}>
            Écrivez-nous
          </span>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>Contact</h2>
          <div className="divider" style={{ background: 'var(--sef-teal)', margin: '1rem auto 1.5rem' }} />
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Une question ou demande ? Nous vous répondrons sous 48h ouvrées.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { icon: <MapPin size={22} />, title: 'Siège social', content: '2 Allée du Clos des Charmes\n77183 Croissy-Beaubourg', color: 'var(--sef-red)' },
              { icon: <Phone size={22} />, title: 'Téléphone', content: '01 60 05 XX XX\nLun–Ven 9h–17h', color: 'var(--sef-green)' },
              { icon: <Mail size={22} />, title: 'Email', content: 'contact@secoursevangeliquedefrance.com', color: 'var(--sef-teal)' },
            ].map((c) => (
              <div key={c.title} style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--border)', borderLeft: `4px solid ${c.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: c.color }}>{c.icon}</span>
                  <strong style={{ fontSize: '0.9rem' }}>{c.title}</strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{c.content}</p>
              </div>
            ))}
            <div style={{ background: 'linear-gradient(135deg, var(--sef-teal), var(--sef-blue))', borderRadius: '14px', padding: '1.25rem', color: 'white' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Suivez-nous</h4>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {['Facebook', 'Instagram', 'YouTube'].map(s => (
                  <a key={s} href="#" style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: 'white', textDecoration: 'none' }}>{s}</a>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '2.5rem', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.07)' }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: '72px', height: '72px', background: 'var(--sef-teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 12px 30px rgba(41,171,226,0.3)' }}>
                  <CheckCircle size={34} color="white" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Message envoyé !</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                  Votre message a été transmis à <strong>contact@secoursevangeliquedefrance.com</strong>.<br />Nous vous répondrons sous 48h ouvrées.
                </p>
                <button className="btn btn-teal" onClick={() => setStatus('idle')}>Envoyer un autre message</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 700 }}>Formulaire de contact</h3>
                {status === 'error' && (
                  <div style={{ background: '#FFF0EF', border: '1px solid #FFCCC9', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--sef-red)' }}>
                    <AlertCircle size={18} /><span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{feedback}</span>
                  </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div><label>Prénom *</label><input required value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} /></div>
                    <div><label>Nom *</label><input required value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} /></div>
                  </div>
                  <div><label>Email *</label><input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                  <div>
                    <label>Sujet</label>
                    <select value={form.sujet} onChange={e => setForm(f => ({ ...f, sujet: e.target.value }))}>
                      <option value="">Choisissez un sujet</option>
                      <option>Demande d'aide / accompagnement</option>
                      <option>Bénévolat / Adhésion</option>
                      <option>Don / Partenariat</option>
                      <option>Presse / Médias</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div><label>Message *</label><textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Décrivez votre demande…" style={{ resize: 'vertical' }} /></div>
                  <button type="submit" className="btn btn-teal" disabled={status === 'loading'} style={{ justifyContent: 'center', fontSize: '1rem', padding: '1rem', opacity: status === 'loading' ? 0.7 : 1 }}>
                    {status === 'loading' ? '⏳ Envoi en cours…' : '✉️ Envoyer le message'}
                  </button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Envoyé à <strong>contact@secoursevangeliquedefrance.com</strong>. Données protégées RGPD.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
