import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

import Sidebar from '../../../../components/Sidebar';
import { supabase } from '../../../../services/supabaseClient';
import moment from 'moment';
import Footer from '../../../../components/Footer';


function Account(props) {
  const [subscriptionsCount, setSubscriptionsCount] = useState(0);
  const [expirationDate, setExpirationDate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName1, setLastName1] = useState('');
  const [lastName2, setLastName2] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rut, setRut] = useState('');
  const [type, setType] = useState('');
  const [subscriptors, setSubscriptors] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState([]);

  useEffect(() => {
    if (typeof window != 'undefined') {
      supabase.from('accounts')
        .select('*')
        .eq('id', props.userId)
        .single()
        .then(({ data: account }) => {
          if (account) {
            setFirstName(account.firstName);
            setLastName1(account.lastName1);
            setLastName2(account.lastName2);
            setEmail(account.email);
            setPhone(account.phone);
            setRut(account.rut);
            setType(account.type);
            setExpirationDate(
              account.expirationDate
                ? moment(account.expirationDate).format('DD-MM-YYYY')
                : ''
            );
            setSubscriptionsCount(account.subscriptionsCount);
            getSubscriptors();
            getPaymentInfo();
          }
        });
    }
  }, []);

  const getSubscriptors = () => {
    supabase.from('subscriptions')
      .select('*')
      .eq('accountId', props.userId)
      .eq('deleted', false)
      .then(({ data: subscriptors }) => {
        if (subscriptors) {
          setSubscriptors(subscriptors.map(s => ({ id: s.id, data: s })));
        }
      });
  };

  const getPaymentInfo = () => {
    supabase.from('paymentData')
      .select('*')
      .eq('accountId', props.userId)
      .then(({ data: paymentItems }) => {
        if (paymentItems) {
          setPaymentInfo(paymentItems.map(p => ({ id: p.id, data: p })));
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
            </div>
          </nav>
        </header>
        <div className="container-fluid mont dashboard">
          <div className="row">
            <Sidebar userType={props.userType} />
            <main
              role="main"
              className="col-md-10 ml-sm-auto col-lg-9 pt-5 pb-5 px-5"
            >
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-3 mb-5 border-bottom">
                <h2>
                  Usuario: {firstName} {lastName1} {lastName2}{' '}
                  <span>
                    <small>
                      ({type == 'user' ? 'Cliente' : 'Usuario Centro'})
                    </small>
                  </span>
                </h2>
              </div>

              <div className="row mt-5 mb-5 align-items-center justify-content-center">
                <div className="col-12">
                  <h3>Datos</h3>
                </div>
                <div className="col-4">
                  <p>Rut: {rut}</p>
                </div>
                <div className="col-4">
                  <p>Email: {email}</p>
                </div>
                <div className="col-4">
                  <p>teléfono: {phone}</p>
                </div>
                {type == 'user' ? (
                  <Fragment>
                    <div className="col-12">
                      <h3>Plan</h3>
                    </div>
                    <div className="col-4 mb-3">
                      <p>Cantidad de suscripciones: {subscriptionsCount}</p>
                    </div>
                    <div className="col-4 mb-3">
                      <p>Plan Expira el : {expirationDate}</p>
                    </div>
                    <div className="col-4 mb-3"></div>
                  </Fragment>
                ) : (
                  ''
                )}
              </div>

              {type == 'user' ? (
                <Fragment>
                  <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-3 mb-5 border-bottom">
                    <h2>Suscripciones</h2>
                  </div>

                  <div className="row mt-5 mb-5">
                    {subscriptors.map((item, index) => {
                      return (
                        <div className="col-4" key={index}>
                          <div className="card">
                            <h5 className="card-header">{item.data.name}</h5>
                            <div className="card-body">
                              <h5 className="card-title">
                                Rut: {item.data.rut}
                              </h5>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="col-12">
                    <h3 className="mb-3">Pagos Del Usuario</h3>
                  </div>

                  <div className="col-12">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">Nº Orden</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Valor</th>
                            <th scope="col">Asunto</th>
                            <th scope="col">Método</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentInfo.length > 0 ? (
                            paymentInfo.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{item.data.paymentData.commerceOrder}</td>
                                  <td>
                                    {item.data.paymentData.requestDate
                                      ? moment(
                                        item.data.paymentData.requestDate
                                      ).format('DD-MM-YYYY HH:mm:ss')
                                      : ''}
                                  </td>
                                  <td>
                                    ${item.data.paymentData.amount}
                                    {item.data.paymentData.currency}
                                  </td>
                                  <td>{item.data.paymentData.subject}</td>
                                  <td>
                                    {item.data.paymentData.paymentData?.media ||
                                      ''}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <p className="mt-4">No hay Pagos registrados</p>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Fragment>
              ) : (
                ''
              )}
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
      userId: context.query.id,
    },
  };
}

export default Account;
