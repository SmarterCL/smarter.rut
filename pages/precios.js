import Head from 'next/head';
import { Fragment } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function Prices() {
  return (
    <Fragment>
      <Head>
        <title>SmarterBOT - Planes</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="mont d-flex flex-column h-100">
        <header>
          <nav className="navbar navbar-expand-md fixed-top">
            <div className="container-fluid">
              <Link className="navbar-brand" href="/">
                <img
                  className="margin-top img-fluid"
                  src="/images/logo-smarteros.jpg"
                  width={220}
                />
              </Link>
              <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav me-auto mb-2 mb-md-0"></ul>
                <a
                  className="btn btn-secondary mx-2 btn-header"
                  href="/login"
                >
                  Ingresa
                </a>
              </div>
            </div>
          </nav>
        </header>
        <div className="section-single">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-9 mx-auto mb-5 text-center">
                <h1 className="text-center mb-5">
                  Nuestros <span className="color">Planes</span>
                </h1>
                <p className="large text-center">
                  Elige el plan que mejor se adapte a tus necesidades.
                </p>
              </div>
            </div>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-4">
                  <div className="card mb-4 box-shadow">
                    <div className="card-header">
                      <h4 className="my-0 font-weight-normal">Básico</h4>
                    </div>
                    <div className="card-body">
                      <h1 className="card-title pricing-card-title">$0 <small className="text-muted">/ mes</small></h1>
                      <div className="row text-start mt-4">
                        <div className="col-6 mb-2 fw-bold">Inscripción</div>
                        <div className="col-6 mb-2">Gratis</div>

                        <div className="col-6 mb-2 fw-bold">Pagar por hora</div>
                        <div className="col-6 mb-2">Sí</div>

                        <div className="col-6 mb-2 fw-bold">Precios Dinámicos</div>
                        <div className="col-6 mb-2">No</div>

                        <div className="col-6 mb-2 fw-bold">Módulos</div>
                        <div className="col-6 mb-2">Uno a elección</div>

                        <div className="col-6 mb-2 fw-bold">Anticipación Reserva</div>
                        <div className="col-6 mb-2">78 horas</div>

                        <div className="col-6 mb-2 fw-bold">Beneficios Smarter</div>
                        <div className="col-6 mb-2">No</div>

                        <div className="col-6 mb-2 fw-bold">Soporte META</div>
                        <div className="col-6 mb-2 text-danger">X</div>

                        <div className="col-6 mb-2 fw-bold">ODOO Whatsapp</div>
                        <div className="col-6 mb-2 text-danger">X</div>
                      </div>
                      <button type="button" className="btn btn-lg btn-block btn-outline-primary">Registrarse gratis</button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card mb-4 box-shadow">
                    <div className="card-header">
                      <h4 className="my-0 font-weight-normal">Enterprise</h4>
                    </div>
                    <div className="card-body">
                      <h1 className="card-title pricing-card-title">UF 1,20 <small className="text-muted">/ mes</small></h1>
                      <div className="row text-start mt-4">
                        <div className="col-6 mb-2 fw-bold">Inscripción</div>
                        <div className="col-6 mb-2">Gratis</div>

                        <div className="col-6 mb-2 fw-bold">Pagar por hora</div>
                        <div className="col-6 mb-2">No (Mensual)</div>

                        <div className="col-6 mb-2 fw-bold">Precios Dinámicos</div>
                        <div className="col-6 mb-2">Sí</div>

                        <div className="col-6 mb-2 fw-bold">Módulos</div>
                        <div className="col-6 mb-2">Todos</div>

                        <div className="col-6 mb-2 fw-bold">Anticipación Reserva</div>
                        <div className="col-6 mb-2">Sin límite</div>

                        <div className="col-6 mb-2 fw-bold">Beneficios Smarter</div>
                        <div className="col-6 mb-2">Sí</div>

                        <div className="col-6 mb-2 fw-bold">Soporte META</div>
                        <div className="col-6 mb-2 text-success">✓</div>

                        <div className="col-6 mb-2 fw-bold">ODOO Whatsapp</div>
                        <div className="col-6 mb-2 text-success">✓</div>
                      </div>
                      <button type="button" className="btn btn-lg btn-block btn-primary">Comenzar ahora</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Fragment>
  );
}
