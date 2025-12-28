import Head from 'next/head';
import DashboardLayout from '../../components/DashboardLayout';

const PlanPage = () => {
  return (
    <DashboardLayout currentView="plan">
      <Head>
        <title>Plan - Smarter.OS</title>
        <meta name="description" content="Plan de tu sistema Smarter.OS" />
      </Head>
      
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Plan</h1>
            <div className="card">
              <div className="card-body">
                <p className="text-muted">
                  Los planes controlan capacidad, no acceso.
                </p>
                
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Plan</th>
                        <th>Estado</th>
                        <th>Precio</th>
                        <th>Ciclo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Startup</td>
                        <td><span className="badge bg-success">Activo</span></td>
                        <td>UF 0,40</td>
                        <td>mensual</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2">Cambiar plan</button>
                          <button className="btn btn-sm btn-outline-secondary">Ver condiciones</button>
                        </td>
                      </tr>
                      <tr>
                        <td>Pro</td>
                        <td><span className="badge bg-secondary">Disponible</span></td>
                        <td>UF 0,70</td>
                        <td>mensual</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2">Cambiar plan</button>
                          <button className="btn btn-sm btn-outline-secondary">Ver condiciones</button>
                        </td>
                      </tr>
                      <tr>
                        <td>Enterprise</td>
                        <td><span className="badge bg-secondary">Disponible</span></td>
                        <td>UF 1,20</td>
                        <td>mensual</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2">Cambiar plan</button>
                          <button className="btn btn-sm btn-outline-secondary">Ver condiciones</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlanPage;