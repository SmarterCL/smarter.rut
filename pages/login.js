import { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import Header from '../components/Header';
import { supabase } from '../services/supabaseClient';

function Login(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [check, setCheck] = useState(false);
  const [password, setPassword] = useState('');

  const doLogin = async () => {
    setLoading(true);

    if (!supabase) {
      alert('Error: El servicio de autenticación no está disponible.');
      setLoading(false);
      return;
    }

    // Intentar login con Supabase Auth primero
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // Si falla Auth, intentamos verificar en la tabla accounts por compatibilidad (si acabas de migrar)
      const { data: account, error: accountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('email', email)
        .eq('deleted', false)
        .single();

      if (account) {
        // En un escenario real aquí compararíamos bcrypt si no hemos movido a Auth
        // pero vamos a asumir que para migrar 100% usaremos Auth.
        alert('Error de autenticación: ' + authError.message);
      } else {
        alert('Usuario no existe');
      }
      setLoading(false);
      return;
    }

    // Si el login es exitoso, buscamos los datos extendidos
    console.log('Auth successful, fetching account details for:', email);
    const { data: userData, error: userError } = await supabase
      .from('accounts')
      .select('*')
      .eq('email', email)
      .eq('deleted', false)
      .single();

    if (userError) {
      console.error('Error fetching account:', userError);
      alert('Error obteniendo datos de cuenta: ' + userError.message);
      setLoading(false);
      return;
    }

    if (userData) {
      console.log('Account found:', userData);
      localStorage.setItem('__sbot__id', userData.id);
      localStorage.setItem(
        '__sbot__ud',
        JSON.stringify(Object.assign(userData, { password: '' }))
      );

      const { redirectTo } = router.query;
      if (redirectTo) {
        console.log('Redirecting to:', redirectTo);
        window.location.href = redirectTo;
      } else {
        const dest = `/dashboard/${userData.type}`;
        console.log('Redirecting to dashboard:', dest);
        window.location.href = dest;
      }
    } else {
      console.warn('No account found for email:', email);
      alert('Error: No se encontraron datos de cuenta asociada en el sistema CRM.');
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      doLogin();
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
          content="SmarterBOT – Acceso a la plataforma"
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
          content="Accede a tu cuenta SmarterBOT"
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
                  <div className="form-floating">
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
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={check}
                      onChange={(e) => setCheck(e.target.checked)}
                    />
                    <label className="form-check-label">
                      {' '}
                      Recordar contraseña
                    </label>
                  </div>
                  <div className="text-center">
                    <a
                      className="btn btn-primary btn-lg d-block mt-4"
                      disabled={loading}
                      onClick={() => doLogin()}
                    >
                      {loading ? 'Ingresando...' : 'Ingresar'}
                    </a>
                  </div>
                  <div className="text-center mt-4 mb-0">
                    <a
                      href="/auth/recover"
                      className="text-decoration-none link-dark"
                    >
                      <strong>Recuperar Contraseña</strong>
                    </a>
                  </div>
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

export default Login;
