import { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { authService } from '../services/enhancedAuth';

function EnhancedLogin(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [check, setCheck] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password'); // 'password', 'magic-link', or 'oauth'

  const doLogin = async () => {
    setLoading(true);

    if (!authService) {
      alert('Error: El servicio de autenticación no está disponible.');
      setLoading(false);
      return;
    }

    let result;
    const { redirectTo } = router.query;

    if (loginMethod === 'password') {
      // Login tradicional con email/contraseña
      result = await authService.signInWithPassword(email, password);
    } else if (loginMethod === 'magic-link') {
      // Login con enlace mágico
      result = await authService.signInWithMagicLink(email);
    }

    if (result.success) {
      if (result.data && result.data.redirectUrl) {
        // Redirigir al usuario después del login exitoso
        window.location.href = redirectTo || result.data.redirectUrl;
      } else {
        // Para login con enlace mágico, mostrar mensaje de confirmación
        alert(result.data?.message || '¡Enlace mágico enviado! Revisa tu email para iniciar sesión.');
      }
    } else {
      alert('Error de autenticación: ' + result.error);
    }

    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);

    const { redirectTo } = router.query;
    // Iniciar sesión con Google usando OAuth
    const { error, data } = await authService.signInWithOAuth('google', redirectTo);

    if (error) {
      alert('Error al iniciar sesión con Google: ' + error);
    }
    // La autenticación OAuth redirigirá al usuario, por lo que no necesitamos manejar el resultado aquí

    setLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      doLogin();
    }
  };

  return (
    <Fragment>
      <Head>
        <title>SmarterBOT - Iniciar sesión</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="SmarterBOT – Acceso a la plataforma con métodos de autenticación mejorados"
        />
        <meta name="author" content="SmarterBOT" />
        <title>SmarterBOT – Iniciar Sesión</title>
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="SmarterBOT - Iniciar Sesión"
        />
        <meta
          property="og:description"
          content="Accede a tu cuenta SmarterBOT con login tradicional o enlace mágico"
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
              src="/images/logo-smarteros.jpg"
              width={90}
            />
          </a>
        </nav>
      </header>
      <div className={`${"mont"} section-shop pt-5 pb-0`}>
        <div className="container">
          <div className="z-index">
            <h1 className="text-center mb-4">Iniciar sesión</h1>
            <div className="bg-light rounded col-sm-12 col-xl-5 py-5 mx-auto">
              <div className="row order-container">
                <div className="col-md-12">
                  <div className="row">
                    <h3 className="mb-4">Ingresa a tu cuenta</h3>
                  </div>

                  {/* Selector de método de login */}
                  <div className="form-group mb-3">
                    <label>Método de autenticación:</label>
                    <div className="d-flex">
                      <div className="form-check me-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="loginMethod"
                          id="passwordMethod"
                          value="password"
                          checked={loginMethod === 'password'}
                          onChange={(e) => setLoginMethod(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="passwordMethod">
                          Contraseña
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="loginMethod"
                          id="magicLinkMethod"
                          value="magic-link"
                          checked={loginMethod === 'magic-link'}
                          onChange={(e) => setLoginMethod(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="magicLinkMethod">
                          Enlace mágico
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Correo Electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e)}
                    />
                    <label>Correo Electrónico</label>
                  </div>

                  {loginMethod === 'password' && (
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e)}
                      />
                      <label>Contraseña</label>
                    </div>
                  )}

                  {loginMethod === 'password' && (
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={check}
                        onChange={(e) => setCheck(e.target.checked)}
                      />
                      <label className="form-check-label">
                        Recordar contraseña
                      </label>
                    </div>
                  )}

                  <div className="text-center">
                    <a
                      className="btn btn-primary btn-lg d-block mt-2"
                      disabled={loading}
                      onClick={() => doLogin()}
                    >
                      {loading
                        ? 'Procesando...'
                        : loginMethod === 'password'
                          ? 'Ingresar'
                          : 'Enviar enlace mágico'}
                    </a>

                    <div className="mt-3">
                      <button
                        className="btn btn-outline-dark btn-lg d-block w-100"
                        disabled={loading}
                        onClick={signInWithGoogle}
                      >
                        {loading ? 'Cargando...' : 'Iniciar sesión con Google'}
                      </button>
                    </div>
                  </div>

                  {loginMethod === 'password' && (
                    <div className="text-center mt-4 mb-0">
                      <a
                        href="/auth/recover"
                        className="text-decoration-none link-dark"
                      >
                        <strong>Recuperar Contraseña</strong>
                      </a>
                    </div>
                  )}

                  {loginMethod === 'magic-link' && (
                    <div className="text-center mt-3">
                      <small className="text-muted">
                        Se enviará un enlace de inicio de sesión a tu correo electrónico.
                      </small>
                    </div>
                  )}
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
    </Fragment>
  );
}

export default EnhancedLogin;