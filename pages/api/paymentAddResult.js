import { supabaseService as db } from "../../services/supabaseClient";
import { sendMail } from "../../services/mailer";

export default async function handler(request, response) {
  const FlowApi = require("flowcl-node-api-client");
  const { data: documentSnapshot } = await db
    .from("accounts")
    .select("*")
    .eq("id", request.query.uid)
    .single();

  if (documentSnapshot) {
    try {
      let config = {
        apiKey: "332F432C-0523-4832-A963-36CLA8D505F8",
        secretKey: "ed20bb9761d5f18c7d7171b804b12a4ba7ba1797",
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
            subscriptionsCount:
              parseInt(documentSnapshot.subscriptionsCount) +
              parseInt(documentSnapshot.addedSubscriptionsCount || 0),
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

        return response.redirect(`/pay/${request.query.uid}/add/success`);
      } else {
        return response.redirect(`/pay/${request.query.uid}/add/error`);
      }
    } catch (error) {
      return response.redirect(`/pay/${request.query.uid}/add/error`);
    }
  } else {
    return response.redirect(`/pay/${request.query.uid}/add/error`);
  }
}
