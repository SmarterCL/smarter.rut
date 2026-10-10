/**
 * wacrm.js — Lead creation service for wacrm CRM
 *
 * Crea un contacto en wacrm (crm.smarterbot.store) usando la API v1.
 * Se usa como fire-and-forget desde /api/register para registrar
 * cada nuevo usuario de smarter.rut como lead en el CRM.
 *
 * Variables de entorno requeridas (server-only):
 *   WACRM_URL      — URL interna del servicio, ej: http://127.0.0.1:4002
 *   WACRM_API_KEY  — API key con scope contacts:write
 */

const WACRM_URL = process.env.WACRM_URL;
const WACRM_API_KEY = process.env.WACRM_API_KEY;

/**
 * Crea o actualiza un contacto/lead en wacrm.
 * La API es find-or-create por phone — si ya existe lo retorna sin duplicar.
 *
 * @param {Object} opts
 * @param {string} opts.phone     - Teléfono con código de país, ej: +56912345678
 * @param {string} opts.name      - Nombre completo
 * @param {string} opts.email     - Email
 * @param {string} [opts.company] - Empresa (opcional)
 * @returns {Promise<{ id: string } | null>}
 */
async function createLead({ phone, name, email, company }) {
  if (!WACRM_URL || !WACRM_API_KEY) {
    console.warn('[wacrm] WACRM_URL o WACRM_API_KEY no configurados — omitiendo lead');
    return null;
  }

  try {
    const res = await fetch(`${WACRM_URL}/api/v1/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WACRM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, name, email, ...(company ? { company } : {}) }),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error('[wacrm] Error al crear lead:', json);
      return null;
    }

    return json.data ?? null;
  } catch (err) {
    console.error('[wacrm] Error de red al crear lead:', err.message);
    return null;
  }
}

module.exports = { createLead };
