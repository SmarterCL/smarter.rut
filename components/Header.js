import Link from 'next/link';
import { useState } from 'react';
import { FaWhatsapp, FaQuestionCircle, FaShoppingCart } from 'react-icons/fa';
import WhatsAppButton from './WhatsAppButton';

const Header = ({ showAuthButtons = true }) => {
  const [displayMobileBar, setDisplayMobileBar] = useState(false);

  return (
    <header>
      <nav className="navbar navbar-expand-md fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" href="/">
            <img
              className="margin-top img-fluid"
              src="/images/logo-smarteros.jpg"
              width={220}
              alt="SmarterOS Logo"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setDisplayMobileBar(!displayMobileBar)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${displayMobileBar ? 'show' : ''}`}
            id="navbarCollapse"
          >
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="https://wa.me/56979540471"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp className="mr-1" /> WhatsApp
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="mailto:contacto@smarterbot.store"
                >
                  <FaQuestionCircle className="mr-1" /> Ayuda
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="https://odoo.smarterbot.store"
                  target="_blank"
                >
                  <FaShoppingCart className="mr-1" /> Venta
                </a>
              </li>
            </ul>

            {showAuthButtons && (
              <>
                <a
                  className="btn btn-secondary mx-2 btn-header"
                  href="/login"
                >
                  Entrar al sistema
                </a>
                <a
                  className="btn btn-primary btn-header mx-2 btn-sub"
                  href="/subscribe"
                >
                  Crear cuenta
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
      <WhatsAppButton />
    </header>
  );
};

export default Header;