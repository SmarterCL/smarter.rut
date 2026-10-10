
export default async function handler(request, response) {
  const FlowApi = require('flowcl-node-api-client');
  try {
    console.log('PAYMENT CALLBACK');
    let config = {
      apiKey: process.env.FLOW_API_KEY,
      secretKey: process.env.FLOW_SECRET_KEY,
      apiURL: 'https://www.flow.cl/api',
      baseURL: 'https://rut.smarterbot.store',
    };
    let params = {
      token: request.body.token,
    };
    let serviceName = 'payment/getStatus';
    const flowApi = new FlowApi(config);
    let flowResponse = await flowApi.send(serviceName, params, 'GET');
    console.log(flowResponse);
    return response
      .status(200)
      .send({ status: 'OK', flowResponse: flowResponse });
  } catch (error) {
    return response.status(200).send({ status: 'ERROR', error: error });
  }
}
