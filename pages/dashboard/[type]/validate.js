import { Fragment, Suspense, useEffect, useState } from 'react';
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
  const [rut, setRut] = useState('');
  const [subscriptor, setSubscriptor] = useState({});
  const [subscriptorFound, setSubscriptorFound] = useState(false);

  const handleRut = (rut) => {
    setRut(ChileanRutify.formatRut(rut));
  };

  const verifyRut = () => {
    setValidRut(ChileanRutify.validRut(rut));
  };

  const check = () => {
    setLoading(true);
    setSubscriptorFound(false);
    supabase.from('subscriptions')
      .select('*')
      .eq('rut', rut)
      .maybeSingle()
      .then(({ data: subscriptor }) => {
        if (!subscriptor) {
          alert('No encontramos un suscriptor con ese rut. Prueba nuevamente');
          setRut('');
          setLoading(false);
        } else {
          setSubscriptorFound(true);
          setSubscriptor(subscriptor);
          setLoading(false);
        }
      });
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
        <title>SmarterBOT - Gestión inteligente</title>
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="SmarterBOT - Gestión inteligente"
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
      <div className={`${"mont"} d-flex flex-column h-100 visual-grid`}>
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
        <div className="dashboard-layout">
          <Sidebar userType={props.userType} />
          <main
            role="main"
            className="dashboard-main-content p-0"
          >
            <DashNav userType={props.userType} />
            <div className="container-fluid dashboard-container px-4 py-5">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-3 mb-4 border-bottom">
                <h2 className="fw-bold">Valida un Rut</h2>
              </div>

              <div className="row mt-5 mb-5 align-items-center justify-content-center">
                <Fragment>
                  <div className="col-8 mt-4">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="111111-1"
                      value={rut}
                      onChange={(e) => handleRut(e.target.value)}
                      onBlur={(e) => verifyRut()}
                    />
                  </div>
                  <div className="col-4 mt-4">
                    <button
                      className="btn btn-primary w-100"
                      disabled={loading}
                      onClick={() => check()}
                    >
                      {loading ? 'Validando...' : 'Validar'}
                    </button>
                  </div>
                  <div className="col-12">
                    {subscriptorFound ? (
                      <Fragment>
                        <h4 className="mt-4">
                          Nombre suscriptor: {subscriptor.name}
                        </h4>
                        <p>Rut: {subscriptor.rut}</p>
                        <p>Email: {subscriptor.email}</p>
                      </Fragment>
                    ) : (
                      ''
                    )}
                  </div>
                </Fragment>
              </div>
            </div>
          </main>
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
