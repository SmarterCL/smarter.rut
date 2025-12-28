import { Fragment, useState } from 'react';
import Head from 'next/head';
import { v4 as uuidv4 } from 'uuid';
import Script from 'next/script';
import { supabase } from '../../../services/supabaseClient';


const mailgun = require('mailgun.js');
const mg = mailgun.client({
  username: 'api',
  key: 'key-80d577c302f3bcad991bea13930b3fde',
});

function RecorverPassword(props) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const checkUser = () => {
    setLoading(true);
    supabase.from('accounts')
      .select('*')
      .eq('email', email)
      .maybeSingle()
      .then(async ({ data: account }) => {
        if (account) {
          let token = uuidv4();
          await supabase
            .from('accounts')
            .update({ recoverToken: token })
            .eq('id', account.id);
          mg.messages
            .create('rut.smarterbot.store', {
              from: 'SmarterBOT<noreply@rut.smarterbot.store>',
              to: [email],
              subject: 'Solicitud de cambio de contraseña',
              text: 'Solicitud de cambio de contraseña',
              html: `<html>...${account.firstName}...${token}...</html>`, // Keep original structure
            })
            .then((msg) => {
              alert(
                'Te enviamos un correo con las instrucciones para reestablecer la contraseña'
              );
              setEmail('');
              setLoading(false);
            })
            .catch((err) => {
              alert(
                'Te enviamos un correo con las instrucciones para reestablecer la contraseña'
              );
              setEmail('');
              setLoading(false);
            });
        } else {
          alert('El email no está registrado en la plataforma');
          setEmail('');
          setLoading(false);
        }
      });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      checkUser();
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
      <header>
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
        <nav className="navbar-transparent d-flex justify-content-center">
          <a className="d-block text-center" href="/">
            <img
              className="margin-top img-fluid"
              src="/images/SmarterBotV2.svg"
              width={220}
            />
          </a>
        </nav>
      </header>
      <div className={`${"mont"} section-shop pt-5 pb-0`}>
        <div className="container">
          <div className="z-index">
            <h1 className="text-center mb-4">
              Recuperar <br />
              contraseña
            </h1>
            <div className="bg-light rounded col-sm-12 col-xl-5 py-5 mx-auto">
              <div className="row order-container">
                <div className="col-md-12">
                  <div className="row">
                    <p className="mb-4">
                      Escribe el <strong>correo electrónico</strong> asociado a
                      tu cuenta SmarterBOT y sigue los pasos que te
                      indiquemos.
                    </p>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="floatingInput"
                      placeholder=""
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label for="floatingInput">Correo Electrónico</label>
                  </div>

                  <div className="text-center">
                    <button
                      className="btn btn-primary btn-lg d-block mt-4"
                      onClick={() => checkUser()}
                      disabled={loading}
                    >
                      {loading ? 'Verificando...' : 'Recuperar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="footer bg-transparent">
            <div className="container-fluid">
              <div className="row text-center">
                <div className="col-sm-12">
                  <p className="d-block">
                    <strong>SmarterBOT</strong> 2025 –{' '}
                    <a href="mailto:contacto@smarterbot.store">
                      contacto@smarterbot.store
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Fragment>
  );
}

export default RecorverPassword;
