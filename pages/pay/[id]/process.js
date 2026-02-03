import { Fragment } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { BounceLoader } from 'react-spinners';



const override = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'red',
};

function Proccess(props) {
  const router = useRouter();
  const { id } = router.query;
  if (typeof window != 'undefined') {
    setTimeout(() => {
      window.location.href = `/api/processPayment?uid=${id}`;
    }, 2000);
  }
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
      </div>
      <header>
        <nav className="navbar-transparent d-flex justify-content-center">
          <a className="d-block text-center" href="/">
            <img
              className="margin-top img-fluid"
              src="/images/logo-smarteros.jpg"
              width={220}
            />
          </a>
        </nav>
      </header>
      <div className="section-shop pt-5 pb-0">
        <div className="container processing-payment-wrapper">
          <div className="z-index">
            <BounceLoader
              color="var(--ui-accent-primary)"
              cssOverride={override}
              size={100}
              aria-label="Loading Spinner"
              data-testid="loader"
            ></BounceLoader>
            <p>Procesando pago...</p>
            <small>No salgas de esta página</small>
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

export default Proccess;
