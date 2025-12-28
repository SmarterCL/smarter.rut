import Head from 'next/head';
import DashboardLayout from '../../components/DashboardLayout';

const BillingPage = () => {
  return (
    <DashboardLayout currentView="billing">
      <Head>
        <title>Pagos - Smarter.OS</title>
        <meta name="description" content="Gestión de pagos Smarter.OS" />
      </Head>
      
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Pagos</h1>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Método de pago</h5>
                <p className="card-text">Tarjeta terminada en ****</p>
                
                <h5 className="card-title mt-4">Estado</h5>
                <p className="card-text">
                  <span className="status-indicator active">✅ Al día</span>
                </p>
                
                <h5 className="card-title mt-4">Historial</h5>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Concepto</th>
                        <th>Monto</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2025-01-15</td>
                        <td>Plan Startup</td>
                        <td>UF 0,40</td>
                        <td><span className="badge bg-success">Pagado</span></td>
                        <td><button className="btn btn-sm btn-outline-primary">Descargar</button></td>
                      </tr>
                      <tr>
                        <td>2024-12-15</td>
                        <td>Plan Startup</td>
                        <td>UF 0,40</td>
                        <td><span className="badge bg-success">Pagado</span></td>
                        <td><button className="btn btn-sm btn-outline-primary">Descargar</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4">
                  <button className="btn btn-outline-primary me-2">Actualizar medio de pago</button>
                  <button className="btn btn-outline-secondary">Descargar comprobante</button>
                </div>
                
                <p className="mt-4 text-muted">
                  La operación se mantiene activa mientras el pago esté al día.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingPage;