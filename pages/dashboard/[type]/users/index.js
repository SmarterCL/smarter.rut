import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

import Sidebar from '../../../../components/Sidebar';
import { supabase } from '../../../../services/supabaseClient';
import UserItem from '../../../../components/UserItem';
import DashNav from '../../../../components/DashNav';


function Dashboard(props) {
  const [displayMobileBar, setDisplayMoblieBar] = useState(false);
  const [users, setUsers] = useState([]);

  const result = [];

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    supabase.from('accounts')
      .select('*')
      .eq('deleted', false)
      .in('type', ['user', 'center'])
      .order('dateCreated', { ascending: false })
      .then(({ data: users }) => {
        if (users) {
          setUsers(users.map(u => ({ id: u.id, data: u })));
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
      <div className={`d-flex flex-column h-100`}>
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
        <div className={`${"mont"} container-fluid dashboard`}>
          <div className="row mont">
            <Sidebar userType={props.userType} />
            <main
              role="main"
              className="col-md-10 ml-sm-auto col-lg-9 pt-5 pb-5 px-5"
            >
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-3 mb-5 border-bottom">
                <h2 className="mont">Usuarios</h2>
                <a target="_blank" href="/api/exportUsers">
                  <button className="btn btn-primary">
                    Descargar Usuarios
                  </button>
                </a>
              </div>

              <div className="row mt-5 mb-5">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Fecha Registro</th>
                          <th scope="col">Nombre</th>
                          <th scope="col">Email</th>
                          <th scope="col">Tipo de plan</th>
                          <th scope="col">nº Suscripciones</th>
                          <th scope="col">Estado de pago</th>
                          <th scope="col">Fecha de Pago</th>
                          <th scope="col">Monto</th>
                          <th scope="col">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((item, index) => {
                          return (
                            <UserItem
                              key={index}
                              item={item}
                              onDelete={() => getUsers()}
                              userType={props.userType}
                            />
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <footer className="footer mt-auto py-4">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-sm-6">
                <a className="footer-brand d-block" href="#">
                  <img
                    className="margin-top img-fluid "
                    src="/images/logo-smarteros.jpg"
                  />
                </a>
              </div>
              <div className="col-sm-6">
                <p className="d-block">SmarterBOT 2025 </p>
              </div>
            </div>
          </div>
        </footer>
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
