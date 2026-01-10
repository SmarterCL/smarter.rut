import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import Header from '../components/Header';

import { Fragment, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function Holder() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [count, setCount] = useState(1);
  const [price, setPrice] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0);
  const [displayMobileBar, setDisplayMoblieBar] = useState(false);
  const [discountText, setDiscountText] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Options data with images and descriptions
  const options = [
    {
      id: 1,
      title: "Contabilidad Inteligente",
      description: "Poder IA para que una persona sepa sus ingresos, los declare por contador y software",
      image: "/images/accounting-ai.jpg",
      tokens: 500,
      price: 0,
      category: "IA"
    },
    {
      id: 2,
      title: "Canal WhatsApp Integrado",
      description: "OCR y modelos que hablen, lean y escriben con OpenRouter para conectar y seleccionar OpenAPI y OpenSpec",
      image: "/images/whatsapp-integration.jpg",
      tokens: 500,
      price: 0,
      category: "Comunicación"
    },
    {
      id: 3,
      title: "Declaración de Apertura",
      description: "Reglas seguras y criterios de negocios para inteligencia de negocios",
      image: "/images/opening-declaration.jpg",
      tokens: 500,
      price: 0,
      category: "Gobierno"
    },
    {
      id: 4,
      title: "Sistema Operativo Comercial",
      description: "Capa de gobernanza comercial y contable que opera sobre ERP existentes",
      image: "/images/commercial-os.jpg",
      tokens: 0,
      price: 0,
      category: "ERP"
    },
    {
      id: 5,
      title: "Reglas Abiertas (OpenSpec)",
      description: "Validación por contadores reales y ejecución automática de reglas",
      image: "/images/open-rules.jpg",
      tokens: 500,
      price: 0,
      category: "Reglas"
    },
    {
      id: 6,
      title: "Arquitectura MCP",
      description: "Normalización y ejecución de eventos entre sistemas",
      image: "/images/mcp-architecture.jpg",
      tokens: 0,
      price: 0,
      category: "Infraestructura"
    }
  ];

  const toggleOption = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const selectedItems = options.filter(opt => selectedOptions.includes(opt.id));

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
        <title>SmarterBOT - Holder</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="SmarterBOT – Opciones seleccionables para tu negocio"
        />
        <meta name="author" content="SmarterBOT" />
        <title>SmarterBOT – Opciones Personalizadas</title>
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="SmarterBOT - Opciones Personalizadas"
        />
        <meta
          property="og:description"
          content="Selecciona las opciones que deseas para tu negocio"
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
        <Header showAuthButtons={true} />
        
        <div className="section-cover">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-sm-12 col-lg-12 col-xl-7 z-index">
                <h1 className="display-1">
                  <span className="color">SmarterOS</span>
                </h1>
                <p className="large mt-3">
                  Selecciona las opciones que deseas para tu negocio
                </p>
                
                <div className="mt-4">
                  <Link
                    className="btn btn-primary btn-lg me-3"
                    href="/dashboard/status"
                  >
                    Ver Resumen
                  </Link>
                  <Link
                    className="btn btn-primary btn-lg me-3"
                    href="/login"
                  >
                    Entrar al sistema
                  </Link>
                  <Link
                    className="btn btn-primary btn-lg"
                    href="/subscribe"
                  >
                    Crear cuenta
                  </Link>
                </div>
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

        <div className="section-light-gray py-5">
          <div className="container">
            <h2 className="text-center mb-5 display-4">Opciones Disponibles</h2>
            
            <div className="row">
              {options.map((option) => (
                <div key={option.id} className="col-lg-4 col-md-6 mb-4">
                  <div className={`card h-100 ${selectedOptions.includes(option.id) ? 'border-primary border-2' : ''}`}>
                    <img 
                      src={option.image || "/images/holder.svg"} 
                      className="card-img-top" 
                      alt={option.title}
                      style={{height: '200px', objectFit: 'cover'}}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{option.title}</h5>
                      <p className="card-text flex-grow-1">{option.description}</p>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="badge bg-secondary">{option.category}</span>
                        <div>
                          <span className="text-primary fw-bold">{option.tokens} tokens</span>
                          <span className="mx-2">|</span>
                          <span className="text-success fw-bold">${option.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button 
                        className={`btn w-100 ${selectedOptions.includes(option.id) ? 'btn-outline-secondary' : 'btn-primary'}`}
                        onClick={() => toggleOption(option.id)}
                      >
                        {selectedOptions.includes(option.id) ? 'Seleccionado ✓' : 'Agregar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Selected Items Summary */}
            {selectedItems.length > 0 && (
              <div className="mt-5">
                <h3 className="text-center mb-4">Resumen de Selección</h3>
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      {selectedItems.map(item => (
                        <div key={item.id} className="col-md-4 mb-3">
                          <div className="d-flex justify-content-between">
                            <span>{item.title}</span>
                            <span className="text-primary">{item.tokens} tokens</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <strong>Total Tokens:</strong>
                      <strong className="text-primary">
                        {selectedItems.reduce((sum, item) => sum + item.tokens, 0)} tokens
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <strong>Total Precio:</strong>
                      <strong className="text-success">
                        ${selectedItems.reduce((sum, item) => sum + item.price, 0)}
                      </strong>
                    </div>
                    <div className="mt-3 text-center">
                      <Link 
                        href="/dashboard/operate" 
                        className="btn btn-primary btn-lg"
                      >
                        Continuar con mi selección
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                    <a href="/politicas-de-privacidad">Política</a>
                  </li>
                  <li>
                    <a href="/terminos-y-condiciones">Términos</a>
                  </li>
                  <li>
                    <a href="https://smarterbot.cl">Volver a smarterbot.cl</a>
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