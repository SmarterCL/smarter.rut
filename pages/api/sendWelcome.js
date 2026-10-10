import { sendMail } from "../../services/mailer";

/**
 * POST /api/sendWelcome
 * Body: { to: string, firstName: string }
 * Envía el email de bienvenida via BillionMail.
 * Solo se llama desde el cliente (subscribe pages).
 */
export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { to, firstName } = request.body;

  if (!to) {
    return response.status(400).json({ error: "Missing 'to' field" });
  }

  const result = await sendMail({
    to,
    attribs: { firstName: firstName || "" },
  });

  return response.status(result.success ? 200 : 500).json(result);
}
