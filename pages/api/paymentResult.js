import { supabaseService as db } from "../../services/supabaseClient";
import { sendMail } from "../../services/mailer";

export default async function handler(request, response) {
  const FlowApi = require("flowcl-node-api-client");

  const { data: documentSnapshot } = await db
    .from("accounts")
    .select("*")
    .eq("id", request.query.uid)
    .single();

  if (!documentSnapshot) {
    return response.redirect(`/pay/${request.query.uid}/error`);
  }

  try {
    let config = {
      apiKey: process.env.FLOW_API_KEY,
      secretKey: process.env.FLOW_SECRET_KEY,
      apiURL: "https://www.flow.cl/api",
      baseURL: "https://rut.smarterbot.store",
    };
    let params = { token: request.body.token };
    const flowApi = new FlowApi(config);
    let flowResponse = await flowApi.send("payment/getStatus", params, "GET");

    if (flowResponse.status == 2) {
      await db
        .from("accounts")
        .update({
          paymentStatus: "DONE",
          expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        })
        .eq("id", documentSnapshot.id);

      await db.from("paymentData").insert({
        accountId: documentSnapshot.id,
        dateCreated: new Date(),
        paymentData: flowResponse,
      });

      await sendMail({
        to: documentSnapshot.email,
        attribs: { firstName: documentSnapshot.firstName || "" },
      });

      return response.redirect(`/pay/${request.query.uid}/success`);
    } else {
      // Notificar problema de pago al equipo
      await sendMail({
        to: "esteban@slashstudio.cl",
        attribs: { error: JSON.stringify(flowResponse) },
      });
      return response.redirect(`/pay/${request.query.uid}/error`);
    }
  } catch (error) {
    return response.redirect(`/pay/${request.query.uid}/error`);
  }
}
