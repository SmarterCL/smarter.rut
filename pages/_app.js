import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import WhatsAppButton from '../components/WhatsAppButton';

export default function App({Component, pageProps}) {
  return (
    <div className="iphone">
      <Component {...pageProps} />
      <WhatsAppButton />
    </div>
  );
}
