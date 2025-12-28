import Head from 'next/head';
import DashboardLayout from '../../components/DashboardLayout';

const OperatePage = () => {
  return (
    <DashboardLayout currentView="operate">
      <Head>
        <title>Operación - Smarter.OS</title>
        <meta name="description" content="Operación del sistema Smarter.OS" />
      </Head>
      
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Operación</h1>
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">Este es tu sistema productivo</h5>
                
                <div className="mt-4">
                  <a 
                    href="https://odoo.smarterbot.store" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg me-3"
                  >
                    Entrar a Odoo
                  </a>
                  
                  <button className="btn btn-outline-secondary btn-lg me-3">
                    Ver flujos activos
                  </button>
                  
                  <a 
                    href="/dashboard/support" 
                    className="btn btn-outline-primary btn-lg"
                  >
                    Soporte operativo
                  </a>
                </div>
                
                <p className="mt-4 text-muted">
                  Accede a las herramientas de operación de tu sistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OperatePage;