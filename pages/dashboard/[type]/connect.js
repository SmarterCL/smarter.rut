import { Fragment } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Sidebar from '../../../components/Sidebar';
import DashNav from '../../../components/DashNav';
import Footer from '../../../components/Footer';

function DashboardConnect(props) {
  const qrUrl = `https://qr.smarterbot.store/connect?source=rut-dashboard&type=${props.userType}`;

  return (
    <Fragment>
      <Head>
        <title>SmarterBOT - Conectar WhatsApp</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Vincula tu sesión de WhatsApp desde el dashboard de SmarterBOT."
        />
      </Head>
      <div className={`${'mont'} d-flex flex-column h-100 visual-grid`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MRN2ZCR8ZP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics-dashboard-connect" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MRN2ZCR8ZP');
          `}
        </Script>

        <div className="dashboard-layout">
          <Sidebar userType={props.userType} />
          <main role="main" className="dashboard-main-content p-0">
            <DashNav userType={props.userType} />
            <div className="container-fluid dashboard-container px-4 py-5">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-3 mb-4 border-bottom">
                <div>
                  <h2 className="fw-bold mb-2">Conectar WhatsApp</h2>
                  <p className="text-muted mb-0">
                    Inicia la vinculación desde tu dashboard y abre el microservicio QR sin sacar
                    al usuario del flujo operativo.
                  </p>
                </div>
                <a
                  href={qrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  Abrir en nueva pestaña
                </a>
              </div>

              <div className="row g-4 mb-4">
                <div className="col-lg-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title fw-bold mb-3">Flujo recomendado</h5>
                      <ol className="ps-3 text-muted mb-0">
                        <li className="mb-2">Entrar al dashboard de SmarterBOT.</li>
                        <li className="mb-2">Abrir el módulo de vinculación QR.</li>
                        <li className="mb-2">Escanear el código con WhatsApp oficial.</li>
                        <li>Volver al dashboard con la sesión conectada.</li>
                      </ol>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title fw-bold mb-3">Estado esperado</h5>
                      <div className="d-flex flex-column gap-2 text-muted">
                        <span>WAITING</span>
                        <span>QR_READY</span>
                        <span>SCANNING</span>
                        <span>CONNECTED</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title fw-bold mb-3">Nota de arquitectura</h5>
                      <p className="text-muted mb-0">
                        Esta vista usa `qr.smarterbot.store` como microservicio de onboarding.
                        El usuario entra primero por `rut.smarterbot.store` y desde aquí se
                        embebe o lanza la vinculación.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm overflow-hidden">
                <div className="card-body p-0">
                  <div className="qr-embed-header d-flex justify-content-between align-items-center flex-wrap gap-3 px-4 py-3 border-bottom">
                    <div>
                      <h5 className="fw-bold mb-1">Microservicio de vinculación QR</h5>
                      <p className="text-muted mb-0 small">
                        Vista embebida del flujo de conexión WAHA.
                      </p>
                    </div>
                    <a
                      href={qrUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-secondary btn-sm"
                    >
                      Expandir
                    </a>
                  </div>
                  <iframe
                    title="Smarter QR Connect"
                    src={qrUrl}
                    className="qr-embed-frame"
                    allow="clipboard-read; clipboard-write"
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      userType: context.query.type,
    },
  };
}

export default DashboardConnect;
