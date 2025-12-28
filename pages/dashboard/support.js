import Head from 'next/head';
import DashboardLayout from '../../components/DashboardLayout';

const SupportPage = () => {
  return (
    <DashboardLayout currentView="support">
      <Head>
        <title>Soporte - Smarter.OS</title>
        <meta name="description" content="Soporte de Smarter.OS" />
      </Head>
      
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Soporte</h1>
            <div className="card">
              <div className="card-body text-center">
                <p className="text-muted mb-4">
                  Soporte real para operación real.
                </p>
                
                <div className="row">
                  <div className="col-md-4 mb-4">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">Soporte técnico</h5>
                        <p className="card-text">Asistencia con problemas técnicos y operativos.</p>
                        <a href="#" className="btn btn-primary">Contactar</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">Soporte comercial</h5>
                        <p className="card-text">Consultas sobre planes, facturación y contratación.</p>
                        <a href="#" className="btn btn-primary">Contactar</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">Documentación</h5>
                        <p className="card-text">Guías, manuales y recursos para tu operación.</p>
                        <a href="#" className="btn btn-primary">Acceder</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupportPage;