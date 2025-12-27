import { supabaseService as db } from '../../services/supabaseClient';
import moment from 'moment';

export default async function handler(request, response) {
  let accounts = [{ id: '3Dxos3d50YwhB9qzXw2j' }];
  await processAccounts(accounts);
  response.status(200).send({ status: 'OK' });
}

const processAccounts = async (accounts) => {
  for (const account of accounts) {
    const { data: paymentData, error } = await db.from('paymentData').insert({
      accountId: account.id,
      dateCreated: new Date(),
      paymentData: {
        amount: '24000',
        requestData: new Date(),
      },
    }).select().single();

    if (error) {
      console.error('Error creating payment:', error);
    } else {
      console.log('PAYMENT ID created:', paymentData.id);
    }
  }
};
