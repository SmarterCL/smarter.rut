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
        <div className="d-none d-sm-flex align-items-center gap-2">
          <div className="text-end">
            <span className="d-block fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Usuario Smarter</span>
            <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
              {userType}
            </small>
          </div>
          <div className="profile-avatar shadow-sm">
            <img src="https://ui-avatars.com/api/?name=Smarter+User&background=875A7B&color=fff" alt="Profile" />
          </div>
        </div>
        <div className="vr d-none d-sm-block mx-2 text-muted opacity-25" style={{ height: '30px' }}></div>
        <a href="/auth/logout" className="btn btn-white btn-logout shadow-sm d-flex align-items-center justify-content-center" title="Cerrar Sesión">
          <MdLogout size={18} />
        </a>
      </div>
    </div>
  );
}
export default DashNav;
