import Head from 'next/head';
import { Fragment } from 'react';
import Link from 'next/link';
import Faq from '../components/Faq';

export default function Home() {
  return (
    <Fragment>
      <Head>
        <title>SmarterBOT - Preguntas Frecuentes</title>
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
            <div className="row align-content-start align-items-center">
              <div className="col-12 col-sm-12 col-md-10 mx-auto">
                <h1 className="mb-5 text-center">
                  <span className="color">Preguntas</span> Frecuentes
                </h1>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="partner-container d-flex justify-content-center">
                  <div className="accordion" id="accordionExample">
                    <Faq
                      title="¿Qué es SmarterBOT?"
                      answer="SmarterBOT es una plataforma integral para la gestión y automatización de procesos empresariales."
                    />
                    <Faq
                      title="¿Cómo puedo registrarme?"
                      answer="Puedes registrarte haciendo clic en el botón 'Regístrate Gratis' en nuestra página de inicio o en la sección de planes."
                    />
                    <Faq
                      title="¿Tienen soporte técnico?"
                      answer="Sí, ofrecemos soporte técnico a través de nuestro correo electrónico de contacto y chat en línea para los planes Pro."
                    />
                    <Faq
                      title="¿Puedo cancelar mi suscripción?"
                      answer="Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de control."
                    />
                  </div>
                </div>
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
