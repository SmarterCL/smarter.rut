import Head from 'next/head';
import Script from 'next/script';
import Header from '../../components/Header';

import ChileanRutify from 'chilean-rutify';
import { Fragment, useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import bcrypt from 'bcryptjs-react';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';
let mg = null;
if (typeof window === 'undefined' || process.env.NEXT_PUBLIC_MAILGUN_KEY) {
  try {
    const mailgun = require('mailgun.js');
    mg = mailgun.client({
      username: 'api',
      key: process.env.NEXT_PUBLIC_MAILGUN_KEY || 'key-80d577c302f3bcad991bea13930b3fde',
    });
  } catch (e) {
    console.error('Failed to initialize mailgun', e);
  }
}


export default function Home() {
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName1, setLastName1] = useState('');
  const [lastName2, setLastName2] = useState('');
  const [rut, setRut] = useState('');
  const [validRut, setValidRut] = useState(true);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [check, setCheck] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
  const [warnemail, setwarnemail] = useState(false);
  const [warnpassword, setwarnpassword] = useState(false);
  const [count, setCount] = useState(1);
  const [price, setPrice] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0);
  const [dialCode, setDialCode] = useState('+56');
  const [ready, setReady] = useState(false);

  const [eye, seteye] = useState(true);
  const [type, settype] = useState(false);

  useEffect(() => {
    const input = document.querySelector('#phone');
    let iti = intlTelInput(input, { initialCountry: 'CL' });
    input.addEventListener('countrychange', function () {
      setDialCode(iti.getSelectedCountryData().dialCode);
    });
    if (supabase) {
      supabase.from('settings')
        .select('*')
        .eq('id', '--')
        .single()
        .then(({ data: settings }) => {
          if (settings) {
            setPrice(parseInt(settings.price));
            setOfferPrice(parseInt(settings.offerPrice));
          }
        });
    }
    if (typeof window != 'undefined') {
      setCount(parseInt(localStorage.getItem('__sbot_count') || 1));
    }
  }, []);

  const toggleEye = () => {
    if (passwordType == 'password') {
      setPasswordType('text');
      seteye(false);
      settype(true);
    } else {
      setPasswordType('password');
      seteye(true);
      settype(false);
    }
  };

  const updateCount = (option) => {
    if (option == 'minus' && count > 1) {
      setCount(count - 1);
    }
    if (option == 'plus' && count < 10) {
      setCount(count + 1);
    }
  };

  const handleRut = (rut) => {
    setRut(ChileanRutify.formatRut(rut));
  };

  const verifyRut = () => {
    setValidRut(ChileanRutify.validRut(rut));
  };

  const updateEmail = (email) => {
    if (email != '') {
      console.log(email.split('@'));
      setEmail(
        email.split('@')[0].split('+')[0] +
        (email.split('@').length > 1 ? `@${email.split('@')[1]}` : '')
      );
    }
  };

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email));
  };

  const createAccount = async () => {
    setSaving(true);
    if (
      firstName == '' ||
      lastName1 == '' ||
      lastName2 == '' ||
      phone == '' ||
      email == '' ||
      rut == '' ||
      password == ''
    ) {
      setSaving(false);
      return alert('Debes completar todos los datos');
    }
    if (!validRut) {
      setSaving(false);
      return alert('Debes ingresar un rut con formato válido');
    }
    if (!validateEmail(email)) {
      setSaving(false);
      return alert('Debes ingresar un email con formato válido');
    }
    if (phone.length != 9) {
      setSaving(false);
      return alert('Debes ingresar un teléfono de 8 dígitos');
    }
    if (!check) {
      setSaving(false);
      return alert('Debes aceptar términos y condiciones');
    }

    if (!supabase) {
      setSaving(false);
      return alert('Error: El servicio de base de datos no está disponible.');
    }

    const { data: existingRut } = await supabase
      .from('accounts')
      .select('id')
      .eq('rut', rut)
      .maybeSingle();

    if (existingRut) {
      setSaving(false);
      return alert('Ya existe un usuario con este rut');
    }

    const { data: existingEmail } = await supabase
      .from('accounts')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingEmail) {
      setSaving(false);
      return alert('Ya existe un usuario con este email');
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setSaving(false);
      return alert('Error al crear cuenta: ' + authError.message);
    }

    // Create account record
    const { data: account, error: accountErr } = await supabase
      .from('accounts')
      .insert({
        deleted: false,
        dateCreated: new Date(),
        planType: 'BASIC',
        paymentStatus: 'PENDING',
        password: bcrypt.hashSync(password, 10),
        firstName,
        lastName1,
        lastName2,
        email,
        rut,
        phone: `${dialCode}${phone}`,
        check,
        type: 'user',
        subscriptionsCount: count,
      })
      .select()
      .single();

    if (accountErr) {
      setSaving(false);
      return alert('Error al guardar datos de cuenta: ' + accountErr.message);
    }

    if (account) {
      const { data: sub, error: subErr } = await supabase
        .from('subscriptions')
        .insert({
          deleted: false,
          name: `${firstName} ${lastName1} ${lastName2}`,
          rut,
          accountId: account.id,
        })
        .select()
        .single();

      if (subErr) {
        console.error(subErr);
      }

      if (!mg) {
        setReady(true);
        return;
      }

      mg.messages
        .create('rut.smarterbot.store', { // Assuming mail domain matches or needs change. Keeping generic if unsure, but text must change.
          from: 'SmarterBOT<noreply@rut.smarterbot.store>',
          to: [email],
          subject: 'Te damos la bienvenida a SmarterBOT',
          text: 'Te damos la bienvenida a SmarterBOT',
          html: `<html><head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <title>Simple Transactional Email</title>
                    <style>
                      /*All the styling*/
                      img { border: none; -ms-interpolation-mode: bicubic; max-width: 100%; }
                      body { background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; }
                      table { border-collapse: separate; width: 100%; }
                      .container { max-width: 580px; margin: 0 auto; padding: 10px; }
                      .main { background: #ffffff; width: 100%; }
                      .btn-primary a { background-color: #0043FF; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 100px; display: inline-block; font-weight: bold; }
                    </style>
                  </head>
                  <body>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
                      <tr>
                        <td>&nbsp;</td>
                        <td class="container">
                          <div class="content">
                            <table role="presentation" class="main">
                              <tr>
                                <td class="wrapper">
                                  <img src="https://rut.smarterbot.store/images/holder.svg" width="100%" style="border-radius: 10px;">
                                  <h1 style="font-size:22px">Hola <span style="color: #0043ff">${firstName},</span><br/>¡Te damos la bienvenida a SmarterBOT!</h1>
                                  <p>Tu cuenta SmarterBOT Basic ya está creada y te invitamos a completar el pago de tu suscripción</p>
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                    <tr>
                                      <td align="left">
                                        <a href="https://rut.smarterbot.store/pay/${account.id}" target="_blank">Paga tu suscripción aquí</a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </td>
                        <td>&nbsp;</td>
                      </tr>
                    </table>
                  </body></html>`,
        })
        .then((msg) => {
          setReady(true);
        })
        .catch((err) => {
          setReady(true);
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
          content="SmarterBOT – Regístrate"
        />
        <meta name="author" content="SmarterBOT" />
        <title>SmarterBOT – Crea tu cuenta</title>
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="SmarterBOT - Crea tu cuenta"
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
        <Header showAuthButtons={false} />
        <div className="section-shop pt-5 pb-0">
          <div className="container">
            <div className="z-index">
              <h1 className="text-center mb-4">Crea tu cuenta</h1>
              <div className="bg-light rounded col-md-12 col-xl-6 py-5 mx-auto">
                <div className="row order-container">
                  {!ready ? (
                    <div className="col-md-12">
                      <div className="row">
                        <h3 className="mb-4">Regístrate en SmarterBOT</h3>
                        <div className="col-md-12">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              id="floatingInputGrid"
                              placeholder="Nombre"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                            <label>Nombre</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Apellido"
                              value={lastName1}
                              onChange={(e) => setLastName1(e.target.value)}
                            />
                            <label>Apellido</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="2º Apellido"
                              value={lastName2}
                              onChange={(e) => setLastName2(e.target.value)}
                            />
                            <label>Segundo Apellido</label>
                          </div>
                        </div>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="floatingInput"
                          placeholder="111111-1"
                          value={rut}
                          onChange={(e) => handleRut(e.target.value)}
                          onBlur={(e) => verifyRut()}
                        />
                        <label>RUT</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="phone"
                          placeholder="Número de teléfono ( 9 dígitos )"
                          maxLength={9}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control"
                          id="floatingInput"
                          placeholder="nombre@correo.com"
                          value={email}
                          onChange={(e) =>
                            setEmail(e.target.value.toLowerCase().trim())
                          }
                          onBlur={() => updateEmail(email)}
                        />
                        <label>Correo Electrónico</label>
                      </div>
                      <div className="form-floating input-password">
                        <input
                          type={passwordType}
                          className="form-control"
                          placeholder="Contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          name="password"
                        />
                        {eye ? (
                          <RxEyeClosed
                            className="eye"
                            size={25}
                            onClick={() => toggleEye()}
                          />
                        ) : (
                          <RxEyeOpen
                            className="eye"
                            size={25}
                            onClick={() => toggleEye()}
                          />
                        )}
                        <label>Contraseña</label>
                      </div>
                      {/*<div
                      className="rounded-small alert alert-primary mt-4"
                      role="alert"
                    >
                      <h5>Resumen de tu compra:</h5>
                      <h4 className="mb-2 text-left">
                        {count == 1 ? "1 Pase" : `${count} Pases`}{" "}
                        {count > 1 ? "Anuales" : "Anual"}
                      </h4>
                      <div className="row justify-content-center align-items-center">
                        <div className="col-md-6">
                          <h2 className="mb-0 mt-2">
                            {offerPrice > 0 ? (
                              <Fragment>
                                <del>
                                  <span className="light">
                                    $
                                    {(price * count)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                  </span>
                                </del>
                                <strong className="mx-3">
                                  $
                                  {(offerPrice * count)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                </strong>
                              </Fragment>
                            ) : (
                              <span className="light">
                                $
                                {(price * count)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                              </span>
                            )}
                          </h2>
                        </div>
                        <div className="col-md-6">
                          <div className="qty mt-2">
                            <span className="minus-small">
                              <img
                                className="align-middle img-fluid"
                                src="/images/i-minus.svg"
                                width="50"
                                onClick={() => updateCount("minus")}
                              />
                            </span>
                            <input
                              type="number"
                              className="count-small"
                              name="qty"
                              max={10}
                              value={count}
                              onChange={() => {}}
                            />
                            <span className="plus-small">
                              <img
                                className="align-middle img-fluid"
                                src="/images/i-plus.svg"
                                width="50"
                                onClick={() => updateCount("plus")}
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                                </div>*/}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          onChange={(e) => setCheck(e.target.checked)}
                        />
                        <label className="form-check-label">
                          {' '}
                          Acepto los{' '}
                          <a
                            href="/terminos-y-condiciones"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Términos y Condiciones
                          </a>
                        </label>
                      </div>
                      <div className="text-center">
                        <button
                          className="btn btn-primary w-100 btn-lg d-block mt-4"
                          onClick={(e) => createAccount()}
                          disabled={saving}
                        >
                          {saving ? 'Creando cuenta...' : 'Crear mi cuenta'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="col-md-12">
                      <div className="row text-center">
                        <p>
                          <img
                            className="icon-ok align-middle img-fluid"
                            src="/images/icon-ok.svg"
                            width="100"
                          />
                        </p>
                        <h3 className="mb-4">Tu cuenta Basic ya fue creada</h3>
                        <div className="col-md-12">
                          <p>
                            Te enviamos un correo con la confirmación de la
                            creación de la cuenta. Ya puedes iniciar sesión con
                            tus datos.
                          </p>
                          <div className="text-center">
                            <a
                              href="/login"
                              className="btn btn-primary btn-lg d-block mt-4"
                            >
                              Ingresar
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
