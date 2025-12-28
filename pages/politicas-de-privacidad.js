import Head from 'next/head';
import { Fragment } from 'react';
import Link from 'next/link';

export default function Politicas() {
  return (
    <Fragment>
      <Head>
        <title>SmarterBOT - Política de Privacidad</title>
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
            <h1 className="text-center">Política de Privacidad</h1>
            <hr />
            <p className="mt-5">
              En SmarterBOT, accesible desde rut.smarterbot.store, una de nuestras principales prioridades es la privacidad de nuestros visitantes. Este documento de Política de Privacidad contiene tipos de información que SmarterBOT recopila y registra y cómo la utilizamos.
            </p>
            <h3>Archivos de registro</h3>
            <p>
              SmarterBOT sigue un procedimiento estándar de uso de archivos de registro. Estos archivos registran a los visitantes cuando visitan sitios web. Todas las empresas de alojamiento hacen esto y forman parte del análisis de los servicios de alojamiento.
            </p>
            <h3>Políticas de privacidad</h3>
            <p>
              Puede consultar esta lista para encontrar la Política de Privacidad de cada uno de los socios publicitarios de SmarterBOT.
            </p>
            <p>
              Los servidores de anuncios de terceros o las redes publicitarias utilizan tecnologías como cookies, JavaScript o Web Beacons que se utilizan en sus respectivos anuncios y enlaces que aparecen en SmarterBOT, que se envían directamente al navegador de los usuarios. Reciben automáticamente su dirección IP cuando esto ocurre. Estas tecnologías se utilizan para medir la eficacia de sus campañas publicitarias y/o para personalizar el contenido publicitario que ve en los sitios web que visita.
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
