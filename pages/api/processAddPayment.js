import { supabaseService as db } from '../../services/supabaseClient';

export default async function handler(request, response) {
  const FlowApi = require('flowcl-node-api-client');
  const config = {
    apiKey: '332F432C-0523-4832-A963-36CLA8D505F8',
    secretKey: 'ed20bb9761d5f18c7d7171b804b12a4ba7ba1797',
    apiURL: 'https://www.flow.cl/api',
    baseURL: 'https://rut.smarterbot.store',
  };

  const { data: settings } = await db.from('settings').select('*').eq('id', '--').single();
  const { data: account } = await db.from('accounts').select('*').eq('id', request.query.uid).single();

  if (account) {
    const params = {
      commerceOrder: Math.floor(Math.random() * (2000 - 1100 + 1)) + 1100,
      subject: `SmarterBOT - ${account.addedSubscriptionsCount == 1
        ? '1 Suscripción Anual'
        : `${account.addedSubscriptionsCount} suscripciones anuales`
        }`,
      currency: 'CLP',
      amount:
        parseInt(account.addedSubscriptionsCount) *
        (settings && parseInt(settings.offerPrice) > 0
          ? parseInt(settings.offerPrice)
          : (settings ? parseInt(settings.price) : 24000)),
      email: account.email,
      paymentMethod: 9,
      urlConfirmation: config.baseURL + '/api/paymentCallback',
      urlReturn:
        config.baseURL + `/api/paymentAddResult?uid=${request.query.uid}`,
    };

    const serviceName = 'payment/create';

    try {
      const flowApi = new FlowApi(config);
      let flowResponse = await flowApi.send(serviceName, params, 'POST');
      let redirect = flowResponse.url + '?token=' + flowResponse.token;
      return response.redirect(redirect);
    } catch (error) {
      console.log('ERROR EN FLOW: ', error.message);
      return response.redirect(`/pay/${request.query.uid}/add/error`);
    }
  } else {
    return response.redirect(`/pay/${request.query.uid}/add/error`);
  }
}
