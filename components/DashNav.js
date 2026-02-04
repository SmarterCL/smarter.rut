import { MdDashboard } from 'react-icons/md';
import { FaHouseUser, FaUsers } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import { IoIdCardSharp } from 'react-icons/io5';
import { BiBuildings } from 'react-icons/bi';
import { FaAddressCard } from 'react-icons/fa';

function DashNav(props) {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-white" style={{ width: '280px', height: '100vh' }}>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <a href={`/dashboard/${props.userType}`} className="nav-link text-dark fs-5 d-flex align-items-center">
            <MdDashboard size={24} className="me-3 text-primary" />
            <span>Dashboard</span>
          </a>
        </li>

        {props.userType === 'user' && (
          <>
            <li className="nav-item mb-2">
              <a href={`/dashboard/${props.userType}/account`} className="nav-link text-dark fs-5 d-flex align-items-center">
                <FaHouseUser size={24} className="me-3 text-primary" />
                <span>Mi Cuenta</span>
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href={`/dashboard/${props.userType}/subscriptions`} className="nav-link text-dark fs-5 d-flex align-items-center">
                <IoIdCardSharp size={24} className="me-3 text-primary" />
                <span>Suscripciones</span>
              </a>
            </li>
          </>
        )}

        {props.userType === 'admin' && (
          <>
            <li className="nav-item mb-2">
              <a href={`/dashboard/${props.userType}/users`} className="nav-link text-dark fs-5 d-flex align-items-center">
                <FaUsers size={24} className="me-3 text-primary" />
                <span>Usuarios</span>
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href={`/dashboard/${props.userType}/centers`} className="nav-link text-dark fs-5 d-flex align-items-center">
                <BiBuildings size={24} className="me-3 text-primary" />
                <span>Sedes</span>
              </a>
            </li>
          </>
        )}

        {props.userType === 'center' && (
          <li className="nav-item mb-2">
            <a href={`/dashboard/${props.userType}/validate`} className="nav-link text-dark fs-5 d-flex align-items-center">
              <FaAddressCard size={24} className="me-3 text-primary" />
              <span>Validar Rut</span>
            </a>
          </li>
        )}
      </ul>
      <hr />
      <div>
        <a href="/auth/logout" className="nav-link text-danger d-flex align-items-center fs-5">
          <IoMdLogOut size={24} className="me-3" />
          <span>Cerrar Sesión</span>
        </a>
      </div>
    </div>
  );
}
export default DashNav;
