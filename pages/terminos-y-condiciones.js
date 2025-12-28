import Head from 'next/head';
import { Fragment } from 'react';
import Link from 'next/link';
import Script from 'next/script';

export default function Terminos() {
  return (
    <Fragment>
      <Head>
        <title>SmarterBOT - Términos y Condiciones</title>
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
            <h1 className="text-center">Términos y Condiciones</h1>
            <hr />
            <p className="mt-5">
              Bienvenido a SmarterBOT. Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web de SmarterBOT.
            </p>
            <p>
              Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones en su totalidad. No continúes usando el sitio web de SmarterBOT si no aceptas todos los términos y condiciones establecidos en esta página.
            </p>
            <h3>Cookies</h3>
            <p>
              Empleamos el uso de cookies. Al utilizar el sitio web de SmarterBOT, usted acepta el uso de cookies de acuerdo con la política de privacidad de SmarterBOT.
            </p>
            <h3>Licencia</h3>
            <p>
              A menos que se indique lo contrario, SmarterBOT y/o sus licenciantes poseen los derechos de propiedad intelectual de todo el material en SmarterBOT. Todos los derechos de propiedad intelectual están reservados. Puedes ver y/o imprimir páginas desde https://rut.smarterbot.store para tu uso personal sujeto a las restricciones establecidas en estos términos y condiciones.
            </p>
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
