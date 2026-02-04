import { MdDashboard, MdAccountBalance, MdReceipt, MdLogout } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { BiBuildings } from 'react-icons/bi';
import { FaAddressCard } from 'react-icons/fa';

function Sidebar(props) {
  // Determinar la ruta activa para resaltar el enlace correcto
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <nav className="dashboard-sidebar">
      <div className="mb-4 px-3">
        <img src="/images/logo-smarteros.jpg" className="img-fluid rounded" alt="SmarterBOT" />
      </div>
      <ul className="list-unstyled">
        <li className="nav-item">
          <a
            className={`nav-link ${currentPath === `/dashboard/${props.userType}` ? 'active' : ''}`}
            href={`/dashboard/${props.userType}`}
          >
            <MdDashboard size={20} />
            <span>Dashboard</span>
          </a>
        </li>
        {props.userType === 'user' && (
          <li className="nav-item">
            <a
              className={`nav-link ${currentPath.includes('/account') ? 'active' : ''}`}
              href={`/dashboard/${props.userType}/account`}
            >
              <MdAccountBalance size={20} />
              <span>Mi Cuenta</span>
            </a>
          </li>
        )}
        {props.userType === 'user' && (
          <li className="nav-item">
            <a
              className={`nav-link ${currentPath.includes('/subscriptions') ? 'active' : ''}`}
              href={`/dashboard/${props.userType}/subscriptions`}
            >
              <MdReceipt size={20} />
              <span>Suscripciones</span>
            </a>
          </li>
        )}
        {props.userType === 'admin' && (
          <>
            <li className="nav-item">
              <a
                className={`nav-link ${currentPath.includes('/users') ? 'active' : ''}`}
                href={`/dashboard/${props.userType}/users`}
              >
                <FaUsers size={20} />
                <span>Usuarios</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${currentPath.includes('/centers') ? 'active' : ''}`}
                href={`/dashboard/${props.userType}/centers`}
              >
                <BiBuildings size={20} />
                <span>Sedes</span>
              </a>
            </li>
          </>
        )}
        {props.userType === 'center' && (
          <li className="nav-item">
            <a
              className={`nav-link ${currentPath.includes('/validate') ? 'active' : ''}`}
              href={`/dashboard/${props.userType}/validate`}
            >
              <FaAddressCard size={20} />
              <span>Validar Rut</span>
            </a>
          </li>
        )}
        <li className="nav-item mt-auto pt-4 border-top border-secondary">
          <a className="nav-link logout-link opacity-75" href="/auth/logout">
            <MdLogout size={20} />
            <span>Cerrar Sesión</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
