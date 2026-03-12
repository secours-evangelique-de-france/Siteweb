/**
 * Service EmailJS — SMTP OVH MX Plan
 * ═══════════════════════════════════════════════════════════════════
 *
 * CONFIGURATION EN 5 ÉTAPES (5 minutes) :
 *
 * ① Créez un compte gratuit sur https://www.emailjs.com
 *    (gratuit = 200 emails/mois)
 *
 * ② Ajoutez votre SMTP OVH :
 *    EmailJS Dashboard → Email Services → Add New Service
 *    → Choisir "Custom SMTP"
 *    → Remplir :
 *        Name         : SEF OVH
 *        Host         : ssl0.ovh.net
 *        Port         : 465
 *        Security     : SSL/TLS
 *        User         : contact@secoursevangeliquedefrance.com
 *        Password     : [votre mot de passe OVH]
 *    → Send test email → Save
 *    → Copiez le Service ID (ex: service_xxxxxxx)
 *
 * ③ Créez le template "Contact" :
 *    EmailJS → Email Templates → Create New Template
 *    Nom : sef_contact
 *    Subject : [SEF Contact] {{sujet}} — {{from_name}}
 *    Content (HTML) :
 *    ┌─────────────────────────────────────────┐
 *    │ Nouveau message depuis le site SEF       │
 *    │                                          │
 *    │ De      : {{from_name}}                  │
 *    │ Email   : {{from_email}}                 │
 *    │ Sujet   : {{sujet}}                      │
 *    │ Date    : {{date}}                       │
 *    │                                          │
 *    │ Message :                                │
 *    │ {{message}}                              │
 *    └─────────────────────────────────────────┘
 *    To email : contact@secoursevangeliquedefrance.com
 *    → Save → Copiez le Template ID (ex: template_xxxxxxx)
 *
 * ④ Créez le template "Bénévole" :
 *    Nom : sef_benevole
 *    Subject : [SEF Bénévole] {{type}} — {{from_name}}
 *    Content :
 *    ┌─────────────────────────────────────────┐
 *    │ Nouvelle candidature bénévole SEF        │
 *    │                                          │
 *    │ Type    : {{type}}                       │
 *    │ Nom     : {{from_name}}                  │
 *    │ Email   : {{from_email}}                 │
 *    │ Tél     : {{tel}}                        │
 *    │ Ville   : {{ville}}                      │
 *    │ Compét. : {{competences}}                │
 *    │ Dispos  : {{disponibilites}}             │
 *    │ Message : {{message}}                    │
 *    └─────────────────────────────────────────┘
 *    To email : contact@secoursevangeliquedefrance.com
 *    → Save → Copiez le Template ID
 *
 * ⑤ Récupérez votre Public Key :
 *    EmailJS → Account → API Keys → Public Key
 *
 * Puis créez un fichier .env à la racine du projet :
 *   VITE_EMAILJS_PUBLIC_KEY=user_XXXXXXXXXXXXXXX
 *   VITE_EMAILJS_SERVICE_ID=service_XXXXXXX
 *   VITE_EMAILJS_TEMPLATE_CONTACT=template_XXXXXXX
 *   VITE_EMAILJS_TEMPLATE_BENEVOLE=template_XXXXXXX
 *
 * ═══════════════════════════════════════════════════════════════════
 */

import { ApiService } from './api.interface';
import { ContactFormData, VolunteerFormData, ServiceResult, NewsItem } from '../types';
import { LOCAL_NEWS } from '../data/news';

// ── Config depuis .env ─────────────────────────────────────────────
const PUBLIC_KEY        = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string | undefined;
const SERVICE_ID        = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string | undefined;
const TPL_CONTACT       = import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT   as string | undefined;
const TPL_BENEVOLE      = import.meta.env.VITE_EMAILJS_TEMPLATE_BENEVOLE  as string | undefined;

const EMAILJS_SEND_URL  = 'https://api.emailjs.com/api/v1.0/email/send';

/** Vérifie si EmailJS est configuré */
const isConfigured = () =>
  Boolean(PUBLIC_KEY && SERVICE_ID && TPL_CONTACT && TPL_BENEVOLE &&
    PUBLIC_KEY !== 'user_XXXXXXXXXXXXXXX');

/** Envoi générique via l'API REST EmailJS (sans dépendance npm) */
async function ejsSend(
  templateId: string,
  params: Record<string, string>
): Promise<ServiceResult> {
  if (!isConfigured()) {
    // Mode démo — simule un succès sans envoyer
    console.warn('[SEF Email] EmailJS non configuré → simulation (voir src/services/emailjs.service.ts)');
    await new Promise(r => setTimeout(r, 900));
    return { success: true, message: 'Simulation (EmailJS non configuré)' };
  }

  try {
    const res = await fetch(EMAILJS_SEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:      SERVICE_ID,
        template_id:     templateId,
        user_id:         PUBLIC_KEY,
        template_params: params,
      }),
    });

    if (res.ok) {
      return { success: true, message: 'Message envoyé !' };
    }

    // EmailJS renvoie le détail de l'erreur en texte
    const errText = await res.text().catch(() => String(res.status));
    console.error('[SEF EmailJS]', errText);
    return {
      success: false,
      message: 'L\'envoi a échoué. Vérifiez la configuration EmailJS ou contactez-nous directement.',
    };
  } catch (err) {
    console.error('[SEF EmailJS network]', err);
    return {
      success: false,
      message: 'Erreur réseau. Vérifiez votre connexion et réessayez.',
    };
  }
}

// ── Implémentation ApiService ──────────────────────────────────────
export const emailjsService: ApiService = {

  async submitContact(data: ContactFormData): Promise<ServiceResult> {
    return ejsSend(TPL_CONTACT!, {
      from_name:  `${data.prenom} ${data.nom}`,
      from_email: data.email,
      sujet:      data.sujet || 'Message depuis le site',
      message:    data.message,
      date:       new Date().toLocaleString('fr-FR'),
      // reply_to permettra de répondre directement à l'expéditeur
      reply_to:   data.email,
    });
  },

  async submitVolunteer(data: VolunteerFormData): Promise<ServiceResult> {
    return ejsSend(TPL_BENEVOLE!, {
      from_name:      `${data.prenom} ${data.nom}`,
      from_email:     data.email,
      type:           data.type,
      tel:            data.tel || 'Non renseigné',
      ville:          data.ville,
      competences:    data.competences || 'Non renseigné',
      disponibilites: data.disponibilites.join(', ') || 'Non renseigné',
      message:        data.message || 'Aucun message',
      date:           new Date().toLocaleString('fr-FR'),
      reply_to:       data.email,
    });
  },

  /** Les actualités restent en local (pas de backend) */
  async getNews(): Promise<NewsItem[]> {
    return LOCAL_NEWS;
  },
};
