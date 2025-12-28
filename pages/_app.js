import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import WhatsAppButton from '../components/WhatsAppButton';
import ThemeToggle from '../components/ThemeToggle';

export default function App({Component, pageProps}) {
  return (
    <div className="iphone">
      <ThemeToggle />
      <Component {...pageProps} />
      <WhatsAppButton />
    </div>
  );
}
