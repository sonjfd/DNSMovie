import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const LeftProfile = () => {
  const { pathname } = useLocation();

  
  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : null;
  const userId = user?.uid;

  const isActive = (path) => pathname === path;
  const isPathMatch = (prefix) => pathname.startsWith(prefix);

  return (
    <div className="p-3 bg-dark rounded text-white">
      <h5 className="text-light mb-4">Quản lý tài khoản</h5>
      <div className="d-flex flex-column gap-3">

        <Link
          to="/"
          className={`text-decoration-none d-flex align-items-center gap-2 ${isActive('/') ? 'text-primary fw-bold' : 'text-white'}`}
        >
          <i className="fa-solid fa-house"></i> <span>Trang Chủ</span>
        </Link>

        <Link
          to="/history"
          className={`text-decoration-none d-flex align-items-center gap-2 ${isPathMatch('/history') ? 'text-primary fw-bold' : 'text-white'}`}
        >
          <i className="fa-solid fa-play"></i> <span>Xem tiếp</span>
        </Link>

        <Link
          to="/favorite"
          className={`text-decoration-none d-flex align-items-center gap-2 ${isPathMatch('/favorite') ? 'text-primary fw-bold' : 'text-white'}`}
        >
          <i className="fa-solid fa-heart"></i> <span>Phim yêu thích</span>
        </Link>

        <Link
          to={userId ? `/profile/${userId}` : '/login'}
          className={`text-decoration-none d-flex align-items-center gap-2 ${isPathMatch('/profile') ? 'text-primary fw-bold' : 'text-white'}`}
        >
          <i className="fa-solid fa-user"></i> <span>Tài khoản</span>
        </Link>

      </div>
    </div>
  );
};

export default LeftProfile;
