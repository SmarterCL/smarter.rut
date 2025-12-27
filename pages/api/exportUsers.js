import { supabaseService as db } from '../../services/supabaseClient';
import moment from 'moment';
const excel = require('exceljs');

export default async function handler(request, response) {
  const { data: accounts, error } = await db
    .from('accounts')
    .select('*, paymentData(*)');

  if (error) {
    return response.status(500).json({ error: error.message });
  }

  const result = accounts.map((account) => {
    const payment = account.paymentData && account.paymentData.length > 0 ? account.paymentData[0] : null;
    return {
      nombre: `${account.firstName} ${account.lastName1} ${account.lastName2}`,
      rut: account.rut,
      email: account.email,
      telefono: account.phone,
      plan: account.planType,
      fechaRegistro: account.dateCreated ? moment(account.dateCreated).format('DD-MM-YYYY HH:mm:ss') : '',
      suscripciones: account.subscriptionsCount || 0,
      estadoPago: account.paymentStatus,
      fechaPago: payment ? (payment.paymentData?.requestDate || '') : '',
      monto: payment ? (payment.paymentData?.amount || '') : '',
    };
  });

  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet('Reservas');
  worksheet.columns = [
    { header: 'nombre', key: 'nombre', width: 25 },
    { header: 'rut', key: 'rut', width: 25 },
    { header: 'email', key: 'email', width: 10 },
    { header: 'telefono', key: 'telefono', width: 10 },
    { header: 'plan', key: 'plan', width: 10 },
    { header: 'fecha registro', key: 'fechaRegistro', width: 10 },
    { header: 'suscripciones', key: 'suscripciones', width: 10 },
    { header: 'estado de pago', key: 'estadoPago', width: 10 },
    { header: 'fecha de pago', key: 'fechaPago', width: 10 },
    { header: 'monto', key: 'monto', width: 10 },
  ];
  worksheet.addRows(result);

  response.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  response.setHeader(
    'Content-Disposition',
    'attachment; filename=' +
    `usuarios-${moment().format('DD-MM-YYYY HH:mm:ss')}.xlsx`
  );

  await workbook.xlsx.write(response);
  response.status(200).end();
}
