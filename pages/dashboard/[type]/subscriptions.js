import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

import Sidebar from '../../../components/Sidebar';
import ChileanRutify from 'chilean-rutify';
import { supabase } from '../../../services/supabaseClient';
import DashNav from '../../../components/DashNav';
import Footer from '../../../components/Footer';


function Dashboard(props) {
  const [displayMobileBar, setDisplayMoblieBar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validRut, setValidRut] = useState(false);
  const [subscriptionsCount, setSubscriptionsCount] = useState(0);
  const [subscriptors, setSubscriptors] = useState([]);
  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (typeof window != 'undefined') {
      setUserId(localStorage.getItem('__sbot__id'));
      let data = JSON.parse(localStorage.getItem('__sbot__ud'));
      setSubscriptionsCount(data.subscriptionsCount);
      getSubscriptors();
    }
  }, []);

  const handleRut = (rut) => {
    setRut(ChileanRutify.formatRut(rut));
  };

  const verifyRut = () => {
    setValidRut(ChileanRutify.validRut(rut));
  };

  const getSubscriptors = () => {
    supabase.from('subscriptions')
      .select('*')
      .eq('accountId', localStorage.getItem('__sbot__id'))
      .eq('deleted', false)
      .then(({ data: subscriptors }) => {
        if (subscriptors) {
          setSubscriptors(subscriptors.map(s => ({ id: s.id, data: s })));
        }
      });
  };

  const saveSubscription = () => {
    setLoading(true);
    if (name == '' || rut == '') {
      alert('Debes completar todos los campos');
      setLoading(false);
    } else {
      if (!validRut) {
        setLoading(false);
        return alert('Debes ingresar un rut válido');
      }
      supabase.from('subscriptions')
        .insert({
          name,
          rut,
          accountId: localStorage.getItem('__sbot__id'),
          deleted: false,
          dateCreated: new Date(),
        })
        .then(() => {
          setLoading(false);
          getSubscriptors();
        });
    }
  };

  return (
    <Fragment>
      <Head>
        <title>SmarterBOT</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="SmarterBOT - Gestión inteligente"
        />
        <meta name="author" content="SmarterBOT" />
        <title>SmarterBOT</title>
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="SmarterBOT"
        />
        <meta
          property="og:description"
          content="SmarterBOT - Gestión inteligente"
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
        <header>
          <nav className="navbar navbar-expand-md fixed-top">
            <div className="container-fluid">
              <a className="navbar-brand" href={`/dashboard/${props.userType}`}>
                <img
                  className="margin-top img-fluid"
                  src="/images/logo-smarteros.jpg"
                  width={220}
                />
              </a>
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
                className={`dash-nav collapse navbar-collapse ${displayMobileBar ? 'show' : ''
                  }`}
                id="navbarCollapse"
              >
                <DashNav userType={props.userType}></DashNav>
              </div>
            </div>
          </nav>
        </header>
        <div className="mont container-fluid dashboard">
          <div className="row">
            <Sidebar userType={props.userType} />
            <main
              role="main"
              className="col-md-10 ml-sm-auto col-lg-9 pt-5 pb-5 px-5"
            >
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-3 mb-5 border-bottom">
                <h2>Suscripciones</h2>
              </div>

              <div className="row mt-5 mb-5">
                {subscriptors.map((item, index) => {
                  return (
                    <div className="col-md-4 col-12 mb-3" key={index}>
                      <div className="card">
                        <h5 className="card-header">{item.data.name}</h5>
                        <div className="card-body">
                          <h5 className="card-title">Rut: {item.data.rut}</h5>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="row mt-5 mb-5 align-items-center ">
                {subscriptionsCount > subscriptors.length ? (
                  <Fragment>
                    <div className="col-12">
                      <h3>Agrega una suscripción</h3>
                      <small>
                        Tienes {subscriptionsCount - subscriptors.length}{' '}
                        {subscriptionsCount - subscriptors.left == 1
                          ? 'suscripción disponible'
                          : 'suscripciones disponibles'}
                      </small>
                      <br />
                      <small>Las suscripciones no son transferibles</small>
                    </div>
                    <div className="col-12 col-md-4 mt-4">
                      <input
                        className="form-control"
                        placeholder="Nombre y Apellido"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      ></input>
                    </div>
                    <div className="col-12 col-md-4 mt-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Rut"
                        value={rut}
                        onChange={(e) => handleRut(e.target.value)}
                        onBlur={(e) => verifyRut()}
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-4">
                      <button
                        className="btn btn-primary"
                        disabled={loading}
                        onClick={() => saveSubscription()}
                      >
                        {loading ? 'Creando Suscriptor...' : 'Crear Suscriptor'}
                      </button>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    <div className="col-12">
                      <p>Ya completaste todas las suscripciones compradas</p>
                      <p>
                        Haz click en el siguiente botón para comprar más
                        suscripciones
                      </p>
                    </div>
                    <div className="col-md-2">
                      <a
                        href={`/pay/${userId}/add`}
                        className="btn btn-primary w-100"
                      >
                        Pagar
                      </a>
                    </div>
                  </Fragment>
                )}
              </div>
            </main>
          </div>
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

export default Dashboard;
