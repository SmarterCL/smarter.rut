import { MdDashboard } from 'react-icons/md';
import { FaHouseUser, FaUsers } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import { IoIdCardSharp } from 'react-icons/io5';
import { BiBuildings } from 'react-icons/bi';
import { FaAddressCard } from 'react-icons/fa';

function Sidebar(props) {
  // Determinar la ruta activa para resaltar el enlace correcto
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <nav className="col-md-2 col-lg-2 d-none d-md-block sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a
              className={`nav-link ${currentPath.includes(`/dashboard/${props.userType}`) && currentPath === `/dashboard/${props.userType}` ? 'active' : ''}`}
              href={`/dashboard/${props.userType}`}
            >
              <MdDashboard size={24} className="mr-2"></MdDashboard>
              <span>Dashboard</span>
            </a>
          </li>
          {props.userType == 'user' ? (
            <li className="nav-item">
              <a
                className={`nav-link ${currentPath.includes(`/dashboard/${props.userType}/account`) ? 'active' : ''}`}
                href={`/dashboard/${props.userType}/account`}
              >
                <FaHouseUser size={24} className="mr-2"></FaHouseUser>
                <span>Mi Cuenta</span>
              </a>
            </li>
          ) : (
            ''
          )}
          {props.userType == 'user' ? (
            <li className="nav-item">
              <a
                className={`nav-link ${currentPath.includes(`/dashboard/${props.userType}/subscriptions`) ? 'active' : ''}`}
                href={`/dashboard/${props.userType}/subscriptions`}
              >
                <IoIdCardSharp size={24} className="mr-2"></IoIdCardSharp>
                <span>Suscripciones</span>
              </a>
            </li>
          ) : (
            ''
          )}

          {props.userType == 'admin' ? (
            <li className="nav-item">
              <a
                className={`nav-link ${currentPath.includes(`/dashboard/${props.userType}/users`) ? 'active' : ''}`}
                href={`/dashboard/${props.userType}/users`}
              >
                <FaUsers size={24} className="mr-2"></FaUsers>
                <span>Usuarios</span>
              </a>
            </li>
          ) : (
            ''
          )}

          {props.userType == 'admin' ? (
            <li className="nav-item">
              <a
                className={`nav-link ${currentPath.includes(`/dashboard/${props.userType}/centers`) ? 'active' : ''}`}
                href={`/dashboard/${props.userType}/centers`}
              >
                <BiBuildings size={24} className="mr-2"></BiBuildings>
                <span>Sedes</span>
              </a>
            </li>
          ) : (
            ''
          )}

          {props.userType == 'center' ? (
            <li className="nav-item">
              <a
                className={`nav-link ${currentPath.includes(`/dashboard/${props.userType}/validate`) ? 'active' : ''}`}
                href={`/dashboard/${props.userType}/validate`}
              >
                <FaAddressCard size={24} className="mr-2"></FaAddressCard>
                <span>Validar rut</span>
              </a>
            </li>
          ) : (
            ''
          )}

          <li className="nav-item mt-auto pt-3 border-top">
            <a className="nav-link" href={`/auth/logout`}>
              <IoMdLogOut size={24} className="mr-2"></IoMdLogOut>
              <span>Cerrar Sesión</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;
