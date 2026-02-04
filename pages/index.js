import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
          content="https://rut.smarterbot.store/images/logo-smarteros.jpg"
        />
        <meta property="og:image:width" content="828" />
        <meta property="og:image:height" content="450" />
        <meta property="og:url" content="https://rut.smarterbot.store" />
        <meta property="og:site_name" content="SmarterBOT" />
        <meta property="fb:app_id" content="" />
        <link
          rel="icon"
          type="image/png"
          href="/images/logo-smarteros.jpg"
          sizes="16x16"
        ></link>
        <link
          rel="icon"
          type="image/png"
          href="/images/logo-smarteros.jpg"
          sizes="32x32"
        ></link>
        <link
          rel="icon"
          type="image/png"
          href="/images/logo-smarteros.jpg"
          sizes="96x96"
        ></link>
        <link rel="apple-touch-icon" href="/images/logo-smarteros.jpg" />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/images/logo-smarteros.jpg"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/images/logo-smarteros.jpg"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/images/logo-smarteros.jpg"
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
        <Header showAuthButtons={true} />
        <div className="section-cover">
          <div className="container">
            <div className="row align-items-center justify-content-center text-center">
              <div className="col-12 z-index">
                <h1 className="display-1 fw-extrabold mb-4" style={{ letterSpacing: '-3px' }}>
                  Hola, soy <span className="color">Smarter OS</span>.
                </h1>
                <h2 className="display-5 mt-2 fw-normal opacity-75">
                  ¿Cómo te ayudo hoy?
                </h2>
                <div className="mt-5 mb-5 d-flex justify-content-center gap-3 flex-wrap">
                  <a
                    className="btn btn-primary btn-lg px-5 shadow-lg"
                    href="https://odoo.smarterbot.store"
                    target="_blank"
                    style={{ background: 'var(--primary)', border: 'none' }}
                  >
                    Ver demostración
                  </a>
                  <a
                    className="btn btn-dark btn-lg px-5 shadow-lg"
                    href="/login"
                    style={{ background: 'var(--bg-dark)', border: 'none' }}
                  >
                    Entrar al sistema
                  </a>
                  <a
                    className="btn btn-warning btn-lg px-5 shadow-lg"
                    href="/subscribe"
                    style={{ background: 'var(--accent)', color: 'white', border: 'none' }}
                  >
                    Crear cuenta
                  </a>
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-12 col-md-6 text-center mb-4">
                <img
                  className="img-fluid rounded"
                  src="/images/ai-click.jpg"
                  width="640"
                  title="Inteligencia Artificial a un Click - Comercio o PYME"
                />
              </div>
              <div className="col-12 col-md-6 text-center mb-4">
                <img
                  className="align-middle img-fluid rounded"
                  src="/images/decision-tree.jpg"
                  width="800"
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
            <div className="row justify-content-center g-5 mt-4">
              <div className="plans col-sm-12 col-lg-6 col-xl-4 py-5 px-4">
                <h2 className="mb-3 text-center">
                  <span className="color large">DEMO</span>
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
                    <tr>
                      <th scope="row">N8N</th>
                      <td>Si</td>
                    </tr>
                    <tr>
                      <th scope="row">Fast API</th>
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

              <div className="plans col-sm-12 col-lg-6 col-xl-4 py-5 px-4">
                <h2 className="mb-3 text-center">
                  <span className="color large">Enterprise</span>
                </h2>
                <table className="table">
                  <tbody>
                    <tr>
                      <th scope="row">Operación</th>
                      <td>Avanzada</td>
                    </tr>
                    <tr>
                      <th scope="row">Precio</th>
                      <td>UF 1,20 / mes</td>
                    </tr>
                    <tr>
                      <th scope="row">Pago</th>
                      <td>Mes a mes</td>
                    </tr>
                    <tr>
                      <th scope="row">Funcionalidades</th>
                      <td>Todo Pro</td>
                    </tr>
                    <tr>
                      <th scope="row">ERP</th>
                      <td>Completo</td>
                    </tr>
                    <tr>
                      <th scope="row">Integraciones API (MCP)</th>
                      <td>Sí</td>
                    </tr>
                    <tr>
                      <th scope="row">Soporte Prioritario</th>
                      <td>Sí</td>
                    </tr>
                    <tr>
                      <th scope="row">Automatizaciones Avanzadas</th>
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
        <div className="section-light-gray">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-sm-12 col-lg-12 col-xl-6 mx-auto text-center">
                <img
                  className="align-middle img-fluid rounded img-home-two"
                  src="/images/accounting.jpg"
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
        <div className="section-light-gray">
          <div className="container">
            <div className="row align-content-start align-items-center">
              <div className="col-12 col-sm-12 col-md-8 mx-auto text-center">
                <h2 className="display-6 fw-bold mb-4">
                  Conoce <span className="color">SmarterBOT</span>
                </h2>
                <div className="justify-content-center">
                  <div className="video-home shadow-2xl">
                    <div className="embed-container">
                      <iframe
                        src="https://www.youtube.com/embed/njrhms-83qc"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-light-gray mb-2">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <h2 className="h4 fw-medium text-muted">
                  Basado en reglas abiertas (OpenSpec) y validado por contadores reales.
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row mt-5">
            <div className="col-12">
              <h3 className="text-center mb-4">Comparación: Evolución del ERP al Sistema Operativo Comercial</h3>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Dimensión clave</th>
                      <th>Odoo v17–v18</th>
                      <th>Odoo v19 + IA (SmarterOS)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Rol del ERP</strong></td>
                      <td>Gestión optimizada</td>
                      <td>Sistema operativo comercial</td>
                    </tr>
                    <tr>
                      <td><strong>Toma de decisiones</strong></td>
                      <td>Semi-asistida</td>
                      <td>Automática por reglas</td>
                    </tr>
                    <tr>
                      <td><strong>Dependencia del CEO / gerente</strong></td>
                      <td>Media</td>
                      <td>Baja</td>
                    </tr>
                    <tr>
                      <td><strong>Dependencia de presupuesto</strong></td>
                      <td>Media</td>
                      <td>Baja (aprendizaje continuo)</td>
                    </tr>
                    <tr>
                      <td><strong>Manejo de indecisión</strong></td>
                      <td>Alertas y reportes</td>
                      <td>Ejecución automática</td>
                    </tr>
                    <tr>
                      <td><strong>Acumulación de tareas</strong></td>
                      <td>Se ordena parcialmente</td>
                      <td>Se elimina estructuralmente</td>
                    </tr>
                    <tr>
                      <td><strong>Uso de IA</strong></td>
                      <td>Funciones aisladas</td>
                      <td>Capa central de orquestación</td>
                    </tr>
                    <tr>
                      <td><strong>IA decide o ejecuta</strong></td>
                      <td>Sugiere</td>
                      <td>Ejecuta reglas</td>
                    </tr>
                    <tr>
                      <td><strong>Criterios comerciales</strong></td>
                      <td>Configurados</td>
                      <td>Codificados y versionados</td>
                    </tr>
                    <tr>
                      <td><strong>Mejora continua</strong></td>
                      <td>Por análisis</td>
                      <td>Por eventos reales</td>
                    </tr>
                    <tr>
                      <td><strong>Automatización</strong></td>
                      <td>Workflows mejorados</td>
                      <td>Automatización adaptativa</td>
                    </tr>
                    <tr>
                      <td><strong>Contexto de decisiones</strong></td>
                      <td>Histórico + dashboards</td>
                      <td>Contexto vivo multicanal</td>
                    </tr>
                    <tr>
                      <td><strong>Canales operativos</strong></td>
                      <td>Backend + web</td>
                      <td>ERP + WhatsApp + eventos</td>
                    </tr>
                    <tr>
                      <td><strong>Entrada de información</strong></td>
                      <td>Formularios</td>
                      <td>OCR, mensajes, audios</td>
                    </tr>
                    <tr>
                      <td><strong>Relación con contabilidad</strong></td>
                      <td>Conciliación asistida</td>
                      <td>Validación en tiempo real</td>
                    </tr>
                    <tr>
                      <td><strong>Gobernanza B2B</strong></td>
                      <td>Parcial</td>
                      <td>Nativa y ejecutable</td>
                    </tr>
                    <tr>
                      <td><strong>Escalabilidad operativa</strong></td>
                      <td>Personas + sistema</td>
                      <td>Sistema primero</td>
                    </tr>
                    <tr>
                      <td><strong>Velocidad de ejecución</strong></td>
                      <td>Media</td>
                      <td>Inmediata</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>


        <Footer />
      </div >

      {
        showModal ? (
          <div
            id="modal-valores"
            className="modal fade show mont"
            aria- modal="true"
            role="dialog"
            style={{ display: 'block' }
            }
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
                          <th scope="row">Emprendedor</th>
                          <td>1.0 UF / mes</td>
                        </tr>
                        <tr>
                          <th scope="row">Pyme</th>
                          <td>2.5 UF / mes</td>
                        </tr>
                        <tr>
                          <th scope="row">Empresa</th>
                          <td>5.0 UF / mes</td>
                        </tr>
                        <tr>
                          <th scope="row">Holding</th>
                          <td>A convenir</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="d-grid">
                      <p className="text-center small text-muted mt-2">
                        Valores exentos de IVA. Soporte incluido.
                      </p>
                      <a
                        className="btn btn-block btn-primary btn-md mt-2 mb-4"
                        href="/subscribe/pro"
                      >
                        Comprar Suscripción
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div >
        ) : (
          ''
        )}
    </Fragment >
  );
}
