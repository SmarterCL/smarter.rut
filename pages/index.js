import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';

import { Fragment, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';



export default function Home() {
  const [count, setCount] = useState(1);
  const [price, setPrice] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0);
  const [displayMobileBar, setDisplayMoblieBar] = useState(false);
  const [discountText, setDiscountText] = useState('');
  const [showModal, setShowModal] = useState(false);

  const updateCount = (option) => {
    if (option == 'minus' && count > 1) {
      localStorage.setItem('__sbot_count', count - 1);
      setCount(count - 1);
    }
    if (option == 'plus' && count < 10) {
      localStorage.setItem('__sbot_count', count + 1);
      setCount(count + 1);
    }
  };

  useEffect(() => {
    if (typeof window != 'undefined') {
      localStorage.setItem('__sbot_count', 1);
    }
    if (supabase) {
      supabase.from('settings')
        .select('*')
        .eq('id', '--')
        .maybeSingle()
        .then(({ data: settings }) => {
          if (settings) {
            setPrice(parseInt(settings.price));
            setOfferPrice(parseInt(settings.offerPrice));
            setDiscountText(settings.discountText);
          }
        });
    } else {
      console.warn('Supabase client is not available');
    }
  }, []);

  return (
    <Fragment>
      <Head>
        <title>SmarterBOT</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="SmarterBOT – Automatización y tecnología para tu negocio"
        />
        <meta name="author" content="SmarterBOT" />
        <title>SmarterBOT – Soluciones tecnológicas integrales</title>
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="SmarterBOT - La nueva forma de gestionar tu empresa"
        />
        <meta
          property="og:description"
          content="Suscríbete y obtén beneficios exclusivos"
        />
        <meta
          property="og:image"
          content="https://rut.smarterbot.store/images/holder.svg"
        />
        <meta property="og:image:width" content="828" />
        <meta property="og:image:height" content="450" />
        <meta property="og:url" content="https://rut.smarterbot.store" />
        <meta property="og:site_name" content="SmarterBOT" />
        <meta property="fb:app_id" content="" />
        <link
          rel="icon"
          type="image/png"
          href="/images/holder.svg"
          sizes="16x16"
        ></link>
        <link
          rel="icon"
          type="image/png"
          href="/images/holder.svg"
          sizes="32x32"
        ></link>
        <link
          rel="icon"
          type="image/png"
          href="/images/holder.svg"
          sizes="96x96"
        ></link>
        <link rel="apple-touch-icon" href="images/touch-icon-iphone.png" />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="images/touch-icon-ipad.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="images/touch-icon-iphone-retina.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="images/touch-icon-ipad-retina.png"
        />
      </Head>
      <div className={`${"mont"} d-flex flex-column h-100`}>
        {' '}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MRN2ZCR8ZP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-MRN2ZCR8ZP');
        `}
        </Script>{' '}
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-WS4L7S5"
          strategy="afterInteractive"
        />
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
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse"
                aria-expanded="false"
                aria-label="Toggle navigation"
                onClick={() => setDisplayMoblieBar(!displayMobileBar)}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className={`collapse navbar-collapse ${displayMobileBar ? 'show' : ''
                  }`}
                id="navbarCollapse"
              >
                <ul className="navbar-nav me-auto mb-2 mb-md-0"></ul>

                <a
                  className="btn btn-secondary mx-2 btn-header"
                  href="/login"
                >
                  Ingresa
                </a>
                <a
                  className="btn btn-primary btn-header mx-2 btn-sub"
                  href="/login"
                >
                  Inscríbete Gratis
                </a>
                <a
                  className="btn btn-primary btn-header mx-2 btn-sub"
                  href="https://rut.smarterbot.store"
                  target="_blank"
                >
                  Tienda
                </a>
              </div>
            </div>
          </nav>
        </header>
        <div className="section-cover">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-sm-12 col-lg-12 col-xl-7 z-index">
                <h1 className="display-1">
                  Transforma tu negocio con <span className="color">SmarterBOT</span>
                </h1>
                <p className="large mt-3">
                  SmarterBOT es una plataforma integral que te permitirá gestionar
                  tus procesos de negocio, con una serie de beneficios y herramientas avanzadas.
                </p>
                <p className="large mt-3">
                  ¡Inscríbete gratis en nuestros planes y conoce las ofertas de
                  la tienda!
                </p>
                <a
                  className="btn btn-primary btn-lg mt-4 mb-4"
                  href="/login"
                >
                  Inscríbete gratis
                </a>
                <a
                  className="btn btn-primary btn-lg mt-4 mb-4 home-store"
                  href="https://rut.smarterbot.store"
                  target="_blank"
                >
                  Ir a la Tienda
                </a>
                <p>
                  <img
                    className="margin-top img-fluid mt-4"
                    src="/images/holder.svg"
                    width="640"
                    title="Nuestros servicios"
                  />
                </p>
              </div>
              <div className="col-12 col-sm-12 col-lg-12 col-xl-5 mx-auto text-center img-home-container">
                <img
                  className="align-middle img-fluid rounded img-home"
                  src="/images/holder.svg"
                  width="460"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="section-shop" id="suscribete">
          <div className="container">
            <h1 className="display-1 text-center mb-4">
              Elige tu <span className="color">Plan</span>
            </h1>
            <div className="row justify-content-center">
              <div className="bg-light rounded plans col-sm-12 col-lg-6 col-xl-4 py-4">
                <h2 className="mb-3 text-center">
                  <span className="color large">Basic</span>
                </h2>
                <table className="table">
                  <tbody>
                    <tr>
                      <th scope="row">Inscripción</th>
                      <td>Gratis</td>
                    </tr>
                    <tr>
                      <th scope="row">Pagar por hora</th>
                      <td>Sí</td>
                    </tr>
                    <tr>
                      <th scope="row">Precios Dinámicos</th>
                      <td>No</td>
                    </tr>
                    <tr>
                      <th scope="row">Módulos</th>
                      <td>Uno a elección</td>
                    </tr>
                    <tr>
                      <th scope="row">Anticipación Reserva</th>
                      <td>78 horas</td>
                    </tr>
                    <tr>
                      <th scope="row">Beneficios Smarter</th>
                      <td>No</td>
                    </tr>
                  </tbody>
                </table>
                <div className="d-grid">
                  <a
                    className="btn btn-block btn-primary btn-md mt-4"
                    href="/login"
                  >
                    Inscríbete gratis
                  </a>
                </div>
              </div>

              <div className="bg-light rounded plans col-sm-12 col-lg-6 col-xl-4 py-4">
                <h2 className="mb-3 text-center">
                  <span className="color large">Pro</span>
                </h2>
                <table className="table">
                  <tbody>
                    <tr>
                      <th scope="row">Inscripción</th>
                      <td>
                        <a
                          href="#modal-valores"
                          data-bs-toggle="modal"
                          onClick={() => setShowModal(true)}
                        >
                          Valores por categorías
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Pagar por hora</th>
                      <td>Sí</td>
                    </tr>
                    <tr>
                      <th scope="row">Precios Dinámicos</th>
                      <td>Sí</td>
                    </tr>
                    <tr>
                      <th scope="row">Módulos</th>
                      <td>Todos</td>
                    </tr>
                    <tr>
                      <th scope="row">Anticipación Reserva</th>
                      <td>24 horas</td>
                    </tr>
                    <tr>
                      <th scope="row">Beneficios Smarter</th>
                      <td>Sí</td>
                    </tr>
                  </tbody>
                </table>
                <div className="d-grid">
                  <a
                    className="btn btn-block btn-primary btn-md mt-4"
                    href="/subscribe/pro"
                  >
                    Comprar suscripción
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section-white">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-sm-12 col-lg-12 col-xl-6 mx-auto text-center">
                <img
                  className="align-middle img-fluid rounded img-home-two"
                  src="/images/holder.svg"
                  width="460"
                />
              </div>
              <div className="col-12 col-sm-12 col-lg-12 col-xl-6 z-index">
                <h1>
                  Una serie <span className="color">de beneficios</span>
                </h1>
                <p className="large mt-3">
                  Los suscriptores de SmarterBOT podrán disfrutar de herramientas
                  avanzadas, soporte prioritario, integraciones exclusivas y mucho más.
                </p>

                <div>
                  <br />
                  <a
                    className="btn btn-primary btn-md mt-4"
                    href="/preguntas-frecuentes"
                  >
                    ¿Cómo funciona?
                  </a>
                  <a
                    className="btn btn-primary btn-md mt-4 mx-3"
                    href="/precios"
                  >
                    Tarifas y planes
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section-white mb-2">
          <div className="container">
            <div className="row align-content-start align-items-center">
              <div className="col-12 col-sm-12 col-md-8 mx-auto text-center">
                <h1 className="mb-5">
                  Conoce <span className="color">SmarterBOT</span>
                </h1>
                <div className="justify-content-center">
                  <div className="video-home rounded">
                    <div className="embed-container">
                      <iframe
                        src="https://www.youtube.com/embed//njrhms-83qc"
                        frameBorder="0"
                        allowFullScreen=""
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer mt-auto py-5">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-sm-6">
                <a className="footer-brand d-block" href="#">
                  <img
                    className="margin-top img-fluid "
                    src="/images/SmarterBot-white.svg"
                  />
                </a>
                <p className="d-block mt-4">
                  SmarterBOT 2025 –{' '}
                  <a href="mailto:contacto@smarterbot.store">
                    contacto@smarterbot.store
                  </a>
                </p>


              </div>
              <div className="col-sm-6">
                <ul>
                  <li>
                    <a href="/quienes-somos">Quiénes Somos</a>
                  </li>
                  <li>
                    <a href="/precios">Tarifas y planes</a>
                  </li>
                  <li>
                    <a href="/politicas-de-privacidad">
                      Política de Privacidad
                    </a>
                  </li>
                  <li>
                    <a href="/terminos-y-condiciones">Términos de Uso</a>
                  </li>
                  <li>
                    <a href="/preguntas-frecuentes">¿Cómo Funciona?</a>
                  </li>
                  <li>
                    <a href="/login">Iniciar Sesión</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
      {showModal ? (
        <div
          id="modal-valores"
          className="modal fade show mont"
          aria-modal="true"
          role="dialog"
          style={{ display: 'block' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <h5 className="text-uppercase text-center">Plan Pro</h5>
                  <h2 className="mb-3 text-center">
                    <span className="large">
                      Valores por <span className="color">categorías</span>
                    </span>
                  </h2>

                  <table className="table">
                    <tbody>
                      <tr>
                        <th scope="row">03 a 10 años</th>
                        <td>Gratis</td>
                      </tr>
                      <tr>
                        <th scope="row">11 a 18 años</th>
                        <td>$ 24.000</td>
                      </tr>
                      <tr>
                        <th scope="row">19 a 34 años</th>
                        <td>$ 36.000</td>
                      </tr>
                      <tr>
                        <th scope="row">35 a 64 años</th>
                        <td>$ 48.000</td>
                      </tr>
                      <tr>
                        <th scope="row">65 años y más</th>
                        <td>Gratis</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="d-grid">
                    <a
                      className="btn btn-block btn-primary btn-md mt-4 mb-4"
                      href="/subscribe/pro"
                    >
                      Comprar Suscripción
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </Fragment>
  );
}
