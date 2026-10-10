import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';

/**
 * /auth/confirm
 *
 * Página de aterrizaje para los links de confirmación de email de Supabase Auth.
 * Maneja los estados:
 *   - Verificando (mientras lee el hash)
 *   - Éxito: email confirmado correctamente
 *   - Error: link expirado, inválido, etc.
 *
 * Supabase redirige aquí con parámetros en el hash (#) o query (?):
 *   Éxito:  #access_token=...&type=signup
 *   Error:  #error=access_denied&error_code=otp_expired&error_description=...
 */
export default function AuthConfirm() {
  const router = useRouter();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorDescription, setErrorDescription] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Leer parámetros del hash (#) y del query (?)
    const hash = window.location.hash.replace('#', '');
    const params = new URLSearchParams(hash || window.location.search);

    const error = params.get('error');
    const errorCode = params.get('error_code');
    const errorDesc = params.get('error_description');
    const accessToken = params.get('access_token');
    const type = params.get('type');

    if (error) {
      const messages = {
        otp_expired: 'El link de confirmación expiró. Los links son válidos por 24 horas.',
        otp_disabled: 'La confirmación por email está deshabilitada.',
        access_denied: 'Acceso denegado. El link es inválido o ya fue usado.',
      };
      setErrorDescription(messages[errorCode] || errorDesc?.replace(/\+/g, ' ') || 'El link es inválido o ha expirado.');
      setStatus('error');
    } else if (accessToken || type === 'signup') {
      setStatus('success');
      // Redirigir al login después de 3 segundos
      setTimeout(() => router.push('/login'), 3000);
    } else {
      // Sin parámetros reconocibles — asumir error genérico
      setErrorDescription('El link de confirmación es inválido o ya fue utilizado.');
      setStatus('error');
    }
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Confirmación de email — SmarterBOT</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
      </Head>

      <Header />

      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="card shadow-sm" style={{ maxWidth: 480, width: '100%' }}>
          <div className="card-body p-4 text-center">

            {/* Cargando */}
            {status === 'loading' && (
              <>
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Verificando...</span>
                </div>
                <h5 className="card-title">Verificando tu email...</h5>
                <p className="text-muted">Por favor espera un momento.</p>
              </>
            )}

            {/* Éxito */}
            {status === 'success' && (
              <>
                <div className="mb-3" style={{ fontSize: 56 }}>✅</div>
                <h4 className="card-title fw-bold">¡Email confirmado!</h4>
                <p className="text-muted mb-4">
                  Tu cuenta SmarterBOT está activa. Serás redirigido al inicio de sesión en unos segundos.
                </p>
                <a href="/login" className="btn btn-primary px-4">
                  Ir al login ahora
                </a>
              </>
            )}

            {/* Error */}
            {status === 'error' && (
              <>
                <div className="mb-3" style={{ fontSize: 56 }}>⚠️</div>
                <h4 className="card-title fw-bold">Link inválido o expirado</h4>
                <p className="text-muted mb-2">{errorDescription}</p>
                <p className="text-muted mb-4" style={{ fontSize: 14 }}>
                  Si ya creaste tu cuenta puedes iniciar sesión directamente.
                  Si el link expiró, vuelve a registrarte.
                </p>
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  <a href="/login" className="btn btn-primary px-4">
                    Iniciar sesión
                  </a>
                  <a href="/subscribe" className="btn btn-outline-secondary px-4">
                    Crear cuenta
                  </a>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </Fragment>
  );
}
