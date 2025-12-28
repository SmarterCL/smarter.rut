import Head from 'next/head';
import DashboardLayout from '../../components/DashboardLayout';

const StatusPage = () => {
  return (
    <DashboardLayout currentView="status">
      <Head>
        <title>Estado - Smarter.OS</title>
        <meta name="description" content="Estado del sistema Smarter.OS" />
      </Head>
      
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Estado</h1>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Estado del sistema</h5>
                <p className="card-text">
                  <span className="status-indicator active">✅ Operativo</span>
                </p>
                
                <h5 className="card-title mt-4">Servicios activos</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Odoo ERP v19 <span className="badge bg-success">Activo</span></li>
                  <li className="list-group-item">Pagos (Flow) <span className="badge bg-success">Activo</span></li>
                  <li className="list-group-item">IA / Automatización <span className="badge bg-success">Activo</span></li>
                </ul>
                
                <h5 className="card-title mt-4">País / RUT validado</h5>
                <p className="card-text">Chile - RUT verificado</p>
                
                <p className="mt-4 text-muted">
                  Tu operación está lista para funcionar en Chile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StatusPage;