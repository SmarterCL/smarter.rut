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
            <div className="row align-items-center">
              <div className="col-12 col-sm-12 col-lg-6 col-xl-6 z-index">
                <h1 className="display-1">
                  <span className="color">SmarterOS</span>
                </h1>
                <p className="large mt-3">
                  Una sola plataforma. Múltiples operaciones. Cero fricción.
                </p>
                <div className="mt-4">
                  <a
                    className="btn btn-primary btn-lg me-3"
                    href="https://odoo.smarterbot.store"
                    target="_blank"
                  >
                    Ver demostración
                  </a>
                  <a
                    className="btn btn-primary btn-lg me-3"
                    href="/login"
                  >
                    Entrar al sistema
                  </a>
                  <a
                    className="btn btn-primary btn-lg"
                    href="/subscribe"
                  >
                    Crear cuenta
                  </a>
                </div>
                <p className="mt-4">
                  <img
                    className="margin-top img-fluid mt-4"
                    src="/images/ai-click.jpg"
                    width="640"
                    title="Inteligencia Artificial a un Click - Comercio o PYME"
                  />
                </p>
              </div>
              <div className="col-12 col-sm-12 col-lg-6 col-xl-6 mx-auto text-center img-home-container">
                <img
                  className="align-middle img-fluid rounded img-home"
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
            <div className="row justify-content-center">
              <div className="bg-light rounded plans col-sm-12 col-lg-6 col-xl-4 py-4">
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

        <div className="section-light-gray mb-2">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <h1 className="display-1">
                  <span className="color">Smarter OS</span>
                </h1>

                <p className="large mt-3 text-center">
                  La inteligencia de negocios ahora es ejecutable.
                  Smarter OS ordena ingresos, prepara contabilidad y ejecuta reglas de negocio desde WhatsApp.
                </p>
                <p className="display-6 mt-4">
                  <span className="color">Sin planillas.</span>
                  <span className="color"> Sin miedo.</span>
                  <span className="color"> Sin confusión.</span>
                </p>
                <p className="large mt-4">
                  Basado en reglas abiertas (OpenSpec) y validado por contadores reales.
                </p>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12">
                <h3 className="text-center mb-4">¿Qué es Smarter OS?</h3>
                <p className="text-center large">
                  Smarter OS es una capa de gobernanza comercial y contable que opera sobre ERP existentes
                  (como Odoo) y se integra vía MCP para ejecutar reglas claras, auditables y automáticas.
                </p>
                <p className="text-center large">
                  No reemplaza sistemas: los coordina, los ordena y los hace operar solos.
                </p>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12 col-md-6 mb-4">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <h5 className="card-title">Contabilidad Inteligente</h5>
                    <p className="card-text">Poder IA para que una persona sepa sus ingresos, los declare por contador y software</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <h5 className="card-title">Canal WhatsApp Integrado</h5>
                    <p className="card-text">OCR y modelos que hablen, lean y escriben con OpenRouter para conectar y seleccionar OpenAPI y OpenSpec</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12">
                <h3 className="text-center mb-4">El problema que resolvemos</h3>
                <div className="row">
                  <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h5 className="card-title">Confusión de Ingresos</h5>
                        <p className="card-text">Confusión sobre ingresos y obligaciones tributarias</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h5 className="card-title">Procesos Manuales</h5>
                        <p className="card-text">Dependencia de planillas y procesos manuales</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h5 className="card-title">Desconfianza B2B</h5>
                        <p className="card-text">Desconfianza en operaciones B2B</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h5 className="card-title">Operación Internacional</h5>
                        <p className="card-text">Dificultad para operar dentro y fuera de Chile</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="large mt-3 text-center">
                  La contabilidad se volvió compleja, fragmentada y estresante.
                  Smarter OS devuelve claridad y control.
                </p>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12">
                <h3 className="text-center mb-4">La solución</h3>
                <div className="row">
                  <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h5 className="card-title">Interfaz WhatsApp</h5>
                        <p className="card-text">WhatsApp como interfaz operativa</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h5 className="card-title">OCR + IA</h5>
                        <p className="card-text">OCR + IA para registrar eventos (boletas, facturas, pagos)</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h5 className="card-title">Reglas Abiertas</h5>
                        <p className="card-text">Reglas abiertas (OpenSpec)</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h5 className="card-title">Validación Contable</h5>
                        <p className="card-text">Validación por contadores reales</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="large mt-3 text-center">
                  La IA no opina: ejecuta reglas.
                </p>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12">
                <h3 className="text-center mb-4">Casos de uso clave</h3>
                <div className="row">
                  <div className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h5 className="card-title">Registro Automático</h5>
                        <p className="card-text">Registro automático de ingresos desde WhatsApp</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h5 className="card-title">Consulta en Tiempo Real</h5>
                        <p className="card-text">Consulta de IVA y flujo de caja en tiempo real</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h5 className="card-title">Ventas Cooperativas</h5>
                        <p className="card-text">Ventas cooperativas y asociativas B2B</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h5 className="card-title">Operación Multimoneda</h5>
                        <p className="card-text">Operación multimoneda y multipaís</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h5 className="card-title">Impuestos Automáticos</h5>
                        <p className="card-text">Separación automática de impuestos</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h5 className="card-title">Conciliación Bancaria</h5>
                        <p className="card-text">Conciliación bancaria y validación contable</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="large mt-3 text-center">
                  La contabilidad deja de mirar el pasado y empieza a ayudar a decidir.
                </p>
              </div>
            </div>

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

            <div className="row mt-5 justify-content-center">
              <div className="col-12 text-center">
                <h3 className="display-6">
                  Hola, soy <span className="color">Smarter OS</span>.
                </h3>
                <h4 className="display-6 mt-3">
                  ¿Cómo te ayudo hoy?
                </h4>
              </div>
            </div>
          </div>
        </div>

        <Footer />
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
