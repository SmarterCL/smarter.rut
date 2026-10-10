/**
 * BillionMail mailer service
 *
 * Wrapper sobre la API REST de BillionMail (self-hosted).
 * Solo se usa en contexto servidor (API routes y SSR).
 * Docs: https://www.billionmail.com/start/api_mail_guide.html
 *
 * Variables de entorno requeridas (solo servidor, sin NEXT_PUBLIC_):
 *   BILLIONMAIL_URL      — URL base de la instancia, ej: https://mail.smarterbot.store
 *   BILLIONMAIL_API_KEY  — API key generada en Sending API del panel
 */

const BILLIONMAIL_URL = process.env.BILLIONMAIL_URL;
const BILLIONMAIL_API_KEY = process.env.BILLIONMAIL_API_KEY;

/**
 * Envía un email transaccional a un destinatario.
 *
 * @param {Object} opts
 * @param {string}  opts.to        - Email destinatario
 * @param {Object}  [opts.attribs] - Variables para la plantilla, ej: { firstName: 'Juan' }
 * @returns {Promise<{ success: boolean, code: number, msg: string }>}
 */
async function sendMail({ to, attribs = {} }) {
  if (!BILLIONMAIL_URL || !BILLIONMAIL_API_KEY) {
    console.error('[mailer] BILLIONMAIL_URL o BILLIONMAIL_API_KEY no configurados');
    return { success: false, code: -1, msg: 'Mailer no configurado' };
  }

  const endpoint = `${BILLIONMAIL_URL}/api/batch_mail/api/send`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-API-Key': BILLIONMAIL_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipient: to, attribs }),
    });

    const json = await res.json();
    if (!json.success) {
      console.error('[mailer] Error al enviar email:', json.msg);
    }
    return json;
  } catch (err) {
    console.error('[mailer] Error de red al enviar email:', err.message);
    return { success: false, code: -1, msg: err.message };
  }
}

module.exports = { sendMail };
