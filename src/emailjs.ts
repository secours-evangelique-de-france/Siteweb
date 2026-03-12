/**
 * Configuration EmailJS
 * ─────────────────────────────────────────────────────────
 * 1. Créez un compte gratuit sur https://www.emailjs.com
 * 2. Ajoutez un service email (Gmail, Outlook, etc.)
 * 3. Créez deux templates (contact + benevole) avec les variables ci-dessous
 * 4. Remplacez les valeurs XXXXXXXXX par vos identifiants réels
 *
 * Template "contact" — variables attendues :
 *   {{from_name}}, {{from_email}}, {{sujet}}, {{message}}
 *
 * Template "benevole" — variables attendues :
 *   {{prenom}}, {{nom}}, {{email}}, {{tel}}, {{ville}},
 *   {{type}}, {{competences}}, {{disponibilites}}, {{message}}
 * ─────────────────────────────────────────────────────────
 */

export const EMAILJS_CONFIG = {
  publicKey:        import.meta.env.VITE_EMAILJS_PUBLIC_KEY        as string,
  serviceId:        import.meta.env.VITE_EMAILJS_SERVICE_ID       as string,
  templateContact:  import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT  as string,
  templateBenevole: import.meta.env.VITE_EMAILJS_TEMPLATE_BENEVOLE as string,
};


/**
 * Envoi via l'API REST EmailJS (pas besoin de npm install)
 */
export async function sendEmail(
  templateId: string,
  params: Record<string, string>
): Promise<void> {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS_CONFIG.serviceId,
      template_id: templateId,
      user_id: EMAILJS_CONFIG.publicKey,
      template_params: params,
    }),
  });
  if (!res.ok) throw new Error(`EmailJS error: ${res.status}`);
}
