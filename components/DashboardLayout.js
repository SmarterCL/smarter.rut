import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { supabase } from '../services/supabaseClient';

const DashboardLayout = ({ children, currentView }) => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [tenantStatus, setTenantStatus] = useState('pendiente'); // Por defecto pendiente

  useEffect(() => {
    const fetchUserData = async () => {
      // Aquí se obtendría la información del usuario desde localStorage o Supabase
      const storedUser = localStorage.getItem('__sbot__ud');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData(user);
        
        // Determinar estado del tenant según tipo de usuario o suscripción
        if (user.paymentStatus === 'PAGO' || user.paymentStatus === 'AL_DIA') {
          setTenantStatus('activo');
        } else if (user.paymentStatus === 'PENDIENTE') {
          setTenantStatus('pendiente');
        } else if (user.paymentStatus === 'LIMITADO') {
          setTenantStatus('limitado');
        }
      } else {
        // Si no hay usuario, redirigir al login
        router.push('/login');
      }
    };

    fetchUserData();
  }, []);

  const menuItems = [
    { id: 'status', label: 'Estado', href: '/dashboard/status' },
    { id: 'operate', label: 'Operación', href: '/dashboard/operate' },
    { id: 'plan', label: 'Plan', href: '/dashboard/plan' },
    { id: 'billing', label: 'Pagos', href: '/dashboard/billing' },
    { id: 'support', label: 'Soporte', href: '/dashboard/support' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('__sbot__id');
    localStorage.removeItem('__sbot__ud');
    router.push('/login');
  };

  return (
    <div className="dashboard-layout">
      <Head>
        <title>Smarter.OS - Dashboard</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Smarter.OS - Dashboard" />
        <link rel="icon" type="image/png" href="/images/holder.svg" sizes="16x16"></link>
        <link rel="icon" type="image/png" href="/images/holder.svg" sizes="32x32"></link>
        <link rel="icon" type="image/png" href="/images/holder.svg" sizes="96x96"></link>
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
      </Script>

      {/* Header superior */}
      <header className="dashboard-header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6">
              <a href="/" className="logo-link">
                <img src="/images/SmarterBotV2.svg" width="220" alt="Smarter.OS" />
              </a>
            </div>
            <div className="col-md-4">
              <div className="tenant-status">
                <span className={`status-indicator ${tenantStatus}`}>
                  {tenantStatus === 'activo' ? '✅ Operativo' : tenantStatus === 'limitado' ? '⚠️ Limitado' : '⚠️ Pendiente'}
                </span>
              </div>
            </div>
            <div className="col-md-2 text-end">
              {userData && (
                <div className="user-info">
                  <span className="user-name">{userData.firstName} {userData.lastName1}</span>
                  <button onClick={handleLogout} className="btn btn-outline-secondary btn-sm ms-2">Salir</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Menú lateral */}
        <nav className="dashboard-sidebar">
          <ul className="nav flex-column">
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item">
                <a 
                  href={item.href} 
                  className={`nav-link ${currentView === item.id ? 'active' : ''}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contenido principal */}
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;