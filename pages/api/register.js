/**
 * POST /api/register
 *
 * Flujo completo de registro de cuenta, ejecutado server-side con
 * supabaseService (service_role) para bypassar RLS.
 *
 * Body params:
 *   planType        — 'DEMO' | 'PRO'
 *   firstName       — string
 *   lastName1       — string
 *   lastName2       — string
 *   email           — string
 *   password        — string
 *   rut             — string
 *   phone           — string (con dialCode incluido)
 *   subscriptionsCount — number
 *   totalPrice      — number (solo PRO)
 *
 * Respuesta:
 *   200 { accountId }
 *   400 { error: string }
 *   409 { error: 'rut_exists' | 'email_exists' }
 *   500 { error: string }
 */

import { supabaseService as db } from '../../services/supabaseClient';
import { sendMail } from '../../services/mailer';
import { createLead } from '../../services/wacrm';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    planType = 'DEMO',
    firstName,
    lastName1,
    lastName2,
    email,
    password,
    rut,
    phone,
    subscriptionsCount = 1,
    totalPrice = 0,
  } = req.body;

  // --- Validaciones básicas ---
  if (!firstName || !lastName1 || !lastName2 || !email || !password || !rut || !phone) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // --- Verificar duplicados (usando service role para bypassar RLS) ---
  const { data: existingRut } = await db
    .from('accounts')
    .select('id')
    .eq('rut', rut)
    .maybeSingle();

  if (existingRut) {
    return res.status(409).json({ error: 'rut_exists' });
  }

  const { data: existingEmail } = await db
    .from('accounts')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existingEmail) {
    return res.status(409).json({ error: 'email_exists' });
  }

  // --- Crear usuario en Supabase Auth ---
  const { data: authData, error: authError } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // confirmado automáticamente
  });

  if (authError) {
    console.error('[register] Auth error:', authError.message);
    return res.status(500).json({ error: authError.message });
  }

  // --- Insertar en accounts (service role bypassa RLS) ---
  const { data: account, error: accountErr } = await db
    .from('accounts')
    .insert({
      deleted: false,
      dateCreated: new Date(),
      planType,
      paymentStatus: 'PENDING',
      firstName,
      lastName1,
      lastName2,
      email,
      rut,
      phone,
      type: 'user',
      subscriptionsCount,
      ...(planType === 'PRO' ? { totalPrice } : {}),
    })
    .select()
    .single();

  if (accountErr) {
    // Rollback: eliminar el usuario de Auth que acabamos de crear
    await db.auth.admin.deleteUser(authData.user.id);
    console.error('[register] Account insert error:', accountErr.message);
    return res.status(500).json({ error: accountErr.message });
  }

  // --- Insertar suscripción inicial ---
  const { error: subErr } = await db
    .from('subscriptions')
    .insert({
      deleted: false,
      name: `${firstName} ${lastName1} ${lastName2}`,
      rut,
      accountId: account.id,
    });

  if (subErr) {
    console.error('[register] Subscription insert error:', subErr.message);
    // No es bloqueante — la cuenta se creó correctamente
  }

  // --- Enviar email de bienvenida y crear lead en wacrm (fire and forget) ---
  sendMail({ to: email, attribs: { firstName } }).catch((err) => {
    console.error('[register] sendMail error:', err.message);
  });

  createLead({
    phone,
    name: `${firstName} ${lastName1} ${lastName2}`.trim(),
    email,
    company: `SmarterRUT - Plan ${planType}`,
  }).catch((err) => {
    console.error('[register] createLead error:', err.message);
  });

  return res.status(200).json({ accountId: account.id });
}
