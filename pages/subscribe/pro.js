import Head from 'next/head';
import Script from 'next/script';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import ChileanRutify from 'chilean-rutify';
import { Fragment, useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';


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
  const [dialCode, setDialCode] = useState('+56');
  const [eye, seteye] = useState(true);
  const [type, settype] = useState(false);
  const [subscriptionsCount, setSubscriptionsCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selections, setSelections] = useState([]);

  useEffect(() => {
    const input = document.querySelector('#phone');
    let iti = intlTelInput(input, { initialCountry: 'CL' });
    input.addEventListener('countrychange', function () {
      setDialCode(iti.getSelectedCountryData().dialCode);
    });
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
    if (option == 'minus' && subscriptionsCount > 1) {
      setSubscriptionsCount(subscriptionsCount - 1);
      updateValues();
    }
    if (option == 'plus' && subscriptionsCount < 10) {
      setSubscriptionsCount(subscriptionsCount + 1);
      updateValues();
    }
  };

  const updateValues = (value, index) => {
    let aux = selections;
    let priceAux = 0;
    let realValue =
      parseInt(value) == 1
        ? 7500
        : parseInt(value) == 2
          ? 14700
          : parseInt(value) == 3
            ? 23400
            : 0;
    let totalAux = 0;
    for (let j = 0; j < subscriptionsCount; j++) {
      aux[j] =
        index == j
          ? {
            option:
              parseInt(value) == 1
                ? 'Startup - $7.500'
                : parseInt(value) == 2
                  ? 'Pro - $14.700'
                  : parseInt(value) == 3
                    ? 'Enterprise - $23.400'
                    : 'Gratis',
            value,
            realValue,
          }
          : aux[j] != null
            ? aux[j]
            : {};
      totalAux =
        totalAux +
        (typeof aux[j].realValue == 'undefined' ? 0 : aux[j].realValue);
    }
    setSelections(aux);
    setTotalPrice(totalAux);
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
    if (totalPrice > 0) {
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

      // Create account
      const { data: account, error: accountErr } = await supabase
        .from('accounts')
        .insert({
          deleted: false,
          planType: 'PRO',
          dateCreated: new Date(),
          paymentStatus: 'PENDING',
          firstName,
          lastName1,
          lastName2,
          email,
          rut,
          phone: `${dialCode}${phone}`,
          type: 'user',
          subscriptionsCount,
          totalPrice,
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

        if (subErr) console.error(subErr);
        fetch('/api/sendWelcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: email, firstName }),
        }).finally(() => {
          window.location.href = `/pay/${account.id}/process`;
        });
      }
    } else {
      alert('No has seleccionado opciones');
      setSaving(false);
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
        <Header showAuthButtons={false} />
        <div className="section-shop pt-5 pb-0">
          <div className="container">
            <div className="z-index">
              <h5 className="text-uppercase text-center">Paso 2 de 3</h5>
              <h1 className="text-center mb-4">Crea tu cuenta</h1>
              <div className="bg-light rounded col-md-12 col-xl-6 py-5 mx-auto">
                <div className="row order-container">
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
                    <h3 className="mt-5">Resumen de tu compra:</h3>
                    <div
                      className="rounded-small alert alert-primary mt-4"
                      role="alert"
                    >
                      <div className="row justify-content-center align-items-center">
                        <div className="col-md-7">
                          <h4 className="mb-2 text-left">
                            <strong>
                              <small>
                                {subscriptionsCount == 1
                                  ? '1 Asiento Pro'
                                  : `${subscriptionsCount} Asientos Pro`}{' '}
                                {subscriptionsCount > 1 ? '24 meses' : '24 meses'}
                              </small>
                            </strong>
                          </h4>
                          <h3>
                            $
                            {totalPrice
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                          </h3>
                        </div>
                        <div className="col-md-5">
                          <div className="qty mt-2">
                            <span
                              className="minus-small"
                              onClick={() => updateCount('minus')}
                            >
                              <img
                                className="align-middle img-fluid"
                                src="/images/i-minus.svg"
                                width="50"
                              />
                            </span>
                            <input
                              type="number"
                              className="count-small"
                              name="qty"
                              value={subscriptionsCount}
                            />
                            <span
                              className="plus-small"
                              onClick={() => updateCount('plus')}
                            >
                              <img
                                className="align-middle img-fluid"
                                src="/images/i-plus.svg"
                                width="50"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      {Array(subscriptionsCount)
                        .fill(0)
                        .map((_, i) => (
                          <Fragment key={i}>
                            <hr />
                            <div className="form-floating">
                              <p className="mb-1 pl-3">
                                Asiento {i + 1}{' '}
                                {i > 0 ? '' : `(tu asiento)`}
                              </p>
                              <select
                                className="form-select form-select-lg mb-3"
                                aria-label=".form-select-lg example"
                                onChange={(e) =>
                                  updateValues(e.target.value, i)
                                }
                              >
                                <option selected="">
                                  Seleccionar plan
                                </option>
                                <option value="1">
                                  Startup - $7.500
                                </option>
                                <option value="2">
                                  Pro - $14.700
                                </option>
                                <option value="3">
                                  Enterprise - $23.400
                                </option>
                              </select>
                            </div>
                          </Fragment>
                        ))}
                    </div>

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
                          href="https://rut.smarterbot.store/terminos-y-condiciones"
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
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </Fragment>
  );
}
