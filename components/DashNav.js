import { MdLogout, MdMenu } from 'react-icons/md';

function DashNav({ userType }) {
  return (
    <div className="dash-header w-100 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <button className="btn d-md-none me-2" type="button" onClick={() => document.querySelector('.dashboard-sidebar')?.classList.toggle('show')}>
          <MdMenu size={24} />
        </button>
        <h5 className="mb-0 fw-bold text-primary">Smarter OS</h5>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="d-none d-sm-block text-end">
          <small className="text-muted d-block" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Rol: {userType}
          </small>
        </div>
        <a href="/auth/logout" className="btn btn-light btn-sm rounded-circle p-2 shadow-sm text-danger" title="Cerrar Sesión">
          <MdLogout size={20} />
        </a>
      </div>
    </div>
  );
}
export default DashNav;
