import { Fragment } from 'react';
import Head from 'next/head';

function Index(props) {
  return (
    <Fragment>
      <Head>
        <title>SmarterBOT</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="SmarterBOT - Automatización inteligente"
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
          content="SmarterBOT - Automatización inteligente"
        />
        <meta
          property="og:image"
          content="https://rut.smarterbot.store/images/logo-smarteros.jpg"
        />
        <meta property="og:image:width" content="828" />
        <meta property="og:image:height" content="450" />
        <meta property="og:url" content="https://rut.smarterbot.store" />
        <meta property="og:site_name" content="SmarterBOT" />
      </Head>
      <div className="splash-wrapper">
        <img src="/images/logo-smarteros.jpg" width="180" />
      </div>
    </Fragment>
  );
}

export default Index;
