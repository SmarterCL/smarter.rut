import Head from 'next/head';
import { Fragment } from 'react';
import Link from 'next/link';

export default function QuienesSomos() {
  return (
    <Fragment>
      <Head>
        <title>SmarterBOT - Quiénes Somos</title>
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
                  src="/images/SmarterBotV2.svg"
                  width={220}
                />
              </Link>
              <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav me-auto mb-2 mb-md-0"></ul>
                <a
                  className="btn btn-secondary mx-2 btn-header"
                  href="/auth/login"
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
              <div className="col-12">
                <h4 className="text-center text-uppercase">¿Quiénes somos?</h4>
                <h1 className="mb-5 text-center">
                  <span className="color">Smarter</span> BOT
                </h1>
              </div>
            </div>
            <div className="row align-content-start align-items-center">
              <div className="col-12 col-sm-12 col-lg-12 col-xl-6 mx-auto text-center">
                <img
                  className="align-middle img-fluid rounded img-home-two"
                  src="/images/holder.svg"
                  width="460"
                />
              </div>
              <div className="col-12 col-sm-12 col-lg-12 col-xl-6 z-index">
                <p className="large mt-3">
                  <strong>SmarterBOT</strong> es una empresa líder en soluciones tecnológicas y automatización de procesos.
                </p>
                <p>
                  Nuestra misión es ayudar a las empresas a optimizar sus operaciones a través de herramientas digitales avanzadas.
                </p>
                <p>
                  Contamos con un equipo de expertos dedicados a ofrecer el mejor servicio y soporte a nuestros clientes.
                </p>
              </div>
            </div>
          </div>
        </div>
        <footer className="footer mt-auto py-5">
          <div className="container-fluid">
            <div className="text-center">
              <p>SmarterBOT 2025</p>
            </div>
          </div>
        </footer>
      </div>
    </Fragment>
  );
}
