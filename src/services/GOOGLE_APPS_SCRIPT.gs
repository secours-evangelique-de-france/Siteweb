/**
 * GOOGLE APPS SCRIPT — Backend SEF
 * ═══════════════════════════════════════════════════════════════════
 * 
 * DÉPLOIEMENT :
 *  1. Ouvrez https://script.google.com → Nouveau projet
 *  2. Collez tout ce code dans le fichier Code.gs
 *  3. Créez une Google Sheet et copiez son ID dans SHEET_ID ci-dessous
 *  4. Déployer → Nouvelle déploiement → Application Web
 *     - Exécuter en tant que : Moi
 *     - Accès : Tout le monde
 *  5. Autorisez les permissions demandées
 *  6. Copiez l'URL de déploiement → mettez-la dans .env : /**
 * GOOGLE APPS SCRIPT — Backend SEF
 * ═══════════════════════════════════════════════════════════════════
 * 
 * DÉPLOIEMENT :
 *  1. Ouvrez https://script.google.com → Nouveau projet
 *  2. Collez tout ce code dans le fichier Code.gs
 *  3. Créez une Google Sheet et copiez son ID dans SHEET_ID ci-dessous
 *  4. Déployer → Nouvelle déploiement → Application Web
 *     - Exécuter en tant que : Moi
 *     - Accès : Tout le monde
 *  5. Autorisez les permissions demandées
 *  6. Copiez l'URL de déploiement → mettez-la dans .env : VITE_GAS_URL=...
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

// --- CONFIGURATION ---
const SHEET_ID        = 'VOTRE_GOOGLE_SHEET_ID';
const EMAIL_DEST      = 'contact@secoursevangeliquedefrance.com';
const NOM_ASSOCIATION = 'Secours Évangélique de France';

// ─── Point d'entrée HTTP POST ────────────────────────────────────
function doPost(e) {
  try {
    const raw     = e.parameter.payload || e.postData.contents;
    const data    = JSON.parse(raw);
    const action  = data.action;

    if (action === 'contact')  return handleContact(data);
    if (action === 'benevole') return handleBenevole(data);

    return jsonResponse({ success: false, message: 'Action inconnue' });
  } catch (err) {
    return jsonResponse({ success: false, message: String(err) });
  }
}

// ─── Point d'entrée HTTP GET (actualités) ────────────────────────
function doGet(e) {
  const action = e.parameter.action;
  if (action === 'news') return handleGetNews();
  return jsonResponse({ success: true, message: 'SEF Backend OK' });
}

// ─── Formulaire de contact ────────────────────────────────────────
function handleContact(data) {
  // 1. Log dans Google Sheet (onglet "Contacts")
  logToSheet('Contacts', [
    data.timestamp,
    data.prenom + ' ' + data.nom,
    data.email,
    data.sujet,
    data.message,
  ]);

  // 2. Envoyer email
  const sujet = `[SEF Contact] ${data.sujet || 'Nouveau message'} — ${data.prenom} ${data.nom}`;
  const corps = `
Nouveau message de contact reçu sur le site du ${NOM_ASSOCIATION}.

─────────────────────────────────
De       : ${data.prenom} ${data.nom}
Email    : ${data.email}
Sujet    : ${data.sujet}
Date     : ${new Date(data.timestamp).toLocaleString('fr-FR')}
─────────────────────────────────

MESSAGE :
${data.message}

─────────────────────────────────
Cet email a été envoyé automatiquement depuis le formulaire de contact du site SEF.
Pour répondre, utilisez directement l'adresse : ${data.email}
  `.trim();

  MailApp.sendEmail({ to: EMAIL_DEST, subject: sujet, body: corps });

  // 3. Accusé de réception à l'expéditeur
  MailApp.sendEmail({
    to: data.email,
    subject: `✅ Votre message a bien été reçu — ${NOM_ASSOCIATION}`,
    body: `
Bonjour ${data.prenom},

Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais (généralement sous 48h ouvrées).

Objet de votre message : ${data.sujet}

Cordialement,
L'équipe du Secours Évangélique de France
contact@secoursevangeliquedefrance.com
    `.trim(),
  });

  return jsonResponse({ success: true, message: 'Message envoyé !' });
}

// ─── Formulaire bénévole ──────────────────────────────────────────
function handleBenevole(data) {
  logToSheet('Benevoles', [
    data.timestamp,
    data.type,
    data.prenom + ' ' + data.nom,
    data.email,
    data.tel,
    data.ville,
    data.competences,
    data.disponibilites,
    data.message,
  ]);

  const sujet = `[SEF Bénévole] Nouvelle candidature — ${data.prenom} ${data.nom} (${data.type})`;
  const corps = `
Nouvelle candidature reçue sur le site du ${NOM_ASSOCIATION}.

─────────────────────────────────
Type     : ${data.type}
Nom      : ${data.prenom} ${data.nom}
Email    : ${data.email}
Tél      : ${data.tel}
Ville    : ${data.ville}
Compétences : ${data.competences}
Disponibilités : ${data.disponibilites}
Date     : ${new Date(data.timestamp).toLocaleString('fr-FR')}
─────────────────────────────────

MESSAGE :
${data.message || '(aucun message)'}
  `.trim();

  MailApp.sendEmail({ to: EMAIL_DEST, subject: sujet, body: corps });

  MailApp.sendEmail({
    to: data.email,
    subject: `✅ Candidature reçue — ${NOM_ASSOCIATION}`,
    body: `
Bonjour ${data.prenom},

Merci pour votre intérêt ! Votre candidature en tant que ${data.type} a bien été reçue.

Un responsable SEF vous contactera prochainement pour un entretien de découverte.

À très bientôt,
L'équipe du Secours Évangélique de France
    `.trim(),
  });

  return jsonResponse({ success: true, message: 'Candidature envoyée !' });
}

// ─── Récupérer les actualités ─────────────────────────────────────
function handleGetNews() {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Actualites');
  if (!sheet) return jsonResponse({ success: true, data: [] });

  const rows = sheet.getDataRange().getValues();
  const [header, ...data] = rows;
  const news = data
    .filter(r => r[0]) // titre non vide
    .map(r => ({
      id:        String(r[0]).replace(/\s+/g, '-').toLowerCase(),
      titre:     r[0],
      resume:    r[1],
      contenu:   r[2],
      date:      r[3] instanceof Date ? r[3].toISOString() : r[3],
      categorie: r[4] || 'annonce',
      image:     r[5] || '',
      antenne:   r[6] || '',
      epingle:   r[7] === true || r[7] === 'TRUE',
    }));

  return jsonResponse({ success: true, data: news });
}

// ─── Helpers ──────────────────────────────────────────────────────
function logToSheet(sheetName, values) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let sheet   = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  sheet.appendRow(values);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
...
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

// --- CONFIGURATION ---
const SHEET_ID        = 'VOTRE_GOOGLE_SHEET_ID';
const EMAIL_DEST      = 'contact@secoursevangeliquedefrance.com';
const NOM_ASSOCIATION = 'Secours Évangélique de France';

// ─── Point d'entrée HTTP POST ────────────────────────────────────
function doPost(e) {
  try {
    const raw     = e.parameter.payload || e.postData.contents;
    const data    = JSON.parse(raw);
    const action  = data.action;

    if (action === 'contact')  return handleContact(data);
    if (action === 'benevole') return handleBenevole(data);

    return jsonResponse({ success: false, message: 'Action inconnue' });
  } catch (err) {
    return jsonResponse({ success: false, message: String(err) });
  }
}

// ─── Point d'entrée HTTP GET (actualités) ────────────────────────
function doGet(e) {
  const action = e.parameter.action;
  if (action === 'news') return handleGetNews();
  return jsonResponse({ success: true, message: 'SEF Backend OK' });
}

// ─── Formulaire de contact ────────────────────────────────────────
function handleContact(data) {
  // 1. Log dans Google Sheet (onglet "Contacts")
  logToSheet('Contacts', [
    data.timestamp,
    data.prenom + ' ' + data.nom,
    data.email,
    data.sujet,
    data.message,
  ]);

  // 2. Envoyer email
  const sujet = `[SEF Contact] ${data.sujet || 'Nouveau message'} — ${data.prenom} ${data.nom}`;
  const corps = `
Nouveau message de contact reçu sur le site du ${NOM_ASSOCIATION}.

─────────────────────────────────
De       : ${data.prenom} ${data.nom}
Email    : ${data.email}
Sujet    : ${data.sujet}
Date     : ${new Date(data.timestamp).toLocaleString('fr-FR')}
─────────────────────────────────

MESSAGE :
${data.message}

─────────────────────────────────
Cet email a été envoyé automatiquement depuis le formulaire de contact du site SEF.
Pour répondre, utilisez directement l'adresse : ${data.email}
  `.trim();

  MailApp.sendEmail({ to: EMAIL_DEST, subject: sujet, body: corps });

  // 3. Accusé de réception à l'expéditeur
  MailApp.sendEmail({
    to: data.email,
    subject: `✅ Votre message a bien été reçu — ${NOM_ASSOCIATION}`,
    body: `
Bonjour ${data.prenom},

Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais (généralement sous 48h ouvrées).

Objet de votre message : ${data.sujet}

Cordialement,
L'équipe du Secours Évangélique de France
contact@secoursevangeliquedefrance.com
    `.trim(),
  });

  return jsonResponse({ success: true, message: 'Message envoyé !' });
}

// ─── Formulaire bénévole ──────────────────────────────────────────
function handleBenevole(data) {
  logToSheet('Benevoles', [
    data.timestamp,
    data.type,
    data.prenom + ' ' + data.nom,
    data.email,
    data.tel,
    data.ville,
    data.competences,
    data.disponibilites,
    data.message,
  ]);

  const sujet = `[SEF Bénévole] Nouvelle candidature — ${data.prenom} ${data.nom} (${data.type})`;
  const corps = `
Nouvelle candidature reçue sur le site du ${NOM_ASSOCIATION}.

─────────────────────────────────
Type     : ${data.type}
Nom      : ${data.prenom} ${data.nom}
Email    : ${data.email}
Tél      : ${data.tel}
Ville    : ${data.ville}
Compétences : ${data.competences}
Disponibilités : ${data.disponibilites}
Date     : ${new Date(data.timestamp).toLocaleString('fr-FR')}
─────────────────────────────────

MESSAGE :
${data.message || '(aucun message)'}
  `.trim();

  MailApp.sendEmail({ to: EMAIL_DEST, subject: sujet, body: corps });

  MailApp.sendEmail({
    to: data.email,
    subject: `✅ Candidature reçue — ${NOM_ASSOCIATION}`,
    body: `
Bonjour ${data.prenom},

Merci pour votre intérêt ! Votre candidature en tant que ${data.type} a bien été reçue.

Un responsable SEF vous contactera prochainement pour un entretien de découverte.

À très bientôt,
L'équipe du Secours Évangélique de France
    `.trim(),
  });

  return jsonResponse({ success: true, message: 'Candidature envoyée !' });
}

// ─── Récupérer les actualités ─────────────────────────────────────
function handleGetNews() {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('Actualites');
  if (!sheet) return jsonResponse({ success: true, data: [] });

  const rows = sheet.getDataRange().getValues();
  const [header, ...data] = rows;
  const news = data
    .filter(r => r[0]) // titre non vide
    .map(r => ({
      id:        String(r[0]).replace(/\s+/g, '-').toLowerCase(),
      titre:     r[0],
      resume:    r[1],
      contenu:   r[2],
      date:      r[3] instanceof Date ? r[3].toISOString() : r[3],
      categorie: r[4] || 'annonce',
      image:     r[5] || '',
      antenne:   r[6] || '',
      epingle:   r[7] === true || r[7] === 'TRUE',
    }));

  return jsonResponse({ success: true, data: news });
}

// ─── Helpers ──────────────────────────────────────────────────────
function logToSheet(sheetName, values) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let sheet   = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  sheet.appendRow(values);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
