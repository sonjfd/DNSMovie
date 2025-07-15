import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import './HeaderAmin.css';

const HeaderAmin = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Đăng xuất thất bại:', error);
    }
  };

  return (
    <>
      {/* Navbar top */}
      <nav className="navbar navbar-dark bg-dark px-4">
        <a className="navbar-brand fw-bold fs-3 text-info" href="/">
          Trang chủ
        </a>

        <div className="dropdown">
          <button
            className="btn btn-dark dropdown-toggle"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="/images/macdinh.png"
              alt="avatar"
              className="rounded-circle"
              style={{ height: '30px' }}
            />
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Layout: sidebar + content */}
      <div className="container-fluid p-0">
        <div className="row g-0">
          {/* Sidebar trái */}
          <div className="col-md-2 bg-dark text-white" style={{ minHeight: '100vh' }}>
            <div className="d-flex flex-column p-4 gap-3">
              <NavLink
                to="/list-user"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'text-primary fw-bold' : 'text-white'}`
                }
              >
                <i className="fa-solid fa-user me-2"></i> Danh sách người dùng
              </NavLink>

              <NavLink
                to="/list-comment"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'text-primary fw-bold' : 'text-white'}`
                }
              >
                <i className="fa-solid fa-comments me-2"></i> Danh sách bình luận
              </NavLink>
            </div>
          </div>

          {/* Nội dung phải */}
          <div className="col-md-10 p-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderAmin;
