import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-5">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-5 mb-4 mb-lg-0">
                        <Link href="/" className="d-block mb-3 text-decoration-none">
                            <img
                                src="/images/logo-smarteros.jpg"
                                alt="SmarterBOT Logo"
                                className="img-fluid"
                                style={{ maxWidth: '180px', borderRadius: '12px' }}
                            />
                        </Link>
                        <p className="small mb-3" style={{ opacity: 0.8, maxWidth: '400px', lineHeight: '1.6' }}>
                            Plataforma de automatización y ERP basada en Odoo, n8n, Chatwoot, Supabase y Ollama.
                            <br />
                            Chile · proyectos remotos y presenciales.
                        </p>
                        <div className="d-flex flex-column small" style={{ opacity: 0.7 }}>
                            <span className="fw-bold mb-1">SMARTER SPA</span>
                            <span className="mb-1">RUT: 78.233.417-4</span>
                            <span className="mb-1">Servicios de consultoría de desarrollo de software</span>
                            <span>Padre Mariano 103 Of 201, Providencia, Santiago</span>
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
                        <h5 className="mb-3 text-white">Nosotros</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link href="/quienes-somos" className="text-decoration-none">Quiénes somos</Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/precios" className="text-decoration-none">Precios</Link>
                            </li>
                            <li className="mb-2">
                                <a href="mailto:contacto@smarterbot.store" className="text-decoration-none">Contacto</a>
                            </li>
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
                        <h5 className="mb-3 text-white">Legal</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link href="/politicas-de-privacidad" className="text-decoration-none">Privacidad</Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/terminos-y-condiciones" className="text-decoration-none">Términos</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-4">
                        <h5 className="mb-3 text-white">Enlaces</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <a href="https://smarterbot.cl" target="_blank" rel="noopener noreferrer" className="text-decoration-none">Volver a smarterbot.cl</a>
                            </li>
                            <li className="mb-2">
                                <a href="https://odoo.smarterbot.store" target="_blank" rel="noopener noreferrer" className="text-decoration-none">Portal Clientes</a>
                            </li>
                        </ul>
                        <p className="mt-4 small mb-0" style={{ opacity: 0.5 }}>
                            &copy; {new Date().getFullYear()} SmarterBOT.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
