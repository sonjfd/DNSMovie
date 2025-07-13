import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import axios from 'axios';
import './Header.css';
import LoadingPage from './LoadingPage';

const Header = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showGenres, setShowGenres] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [keyword, setKeyword] = useState([])

  const genreRef = useRef();
  const countryRef = useRef();
  const dropdownRef = useRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const res = await axios.get('http://localhost:9999/users');
        const foundUser = res.data.find((u) => u.email === firebaseUser.email);
        if (foundUser) {
          setUser({ ...foundUser, uid: firebaseUser.uid });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const resGenres = await axios.get('http://localhost:9999/genres');
        const resCountries = await axios.get('http://localhost:9999/countries');
        setGenres(resGenres.data);
        setCountries(resCountries.data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (genreRef.current && !genreRef.current.contains(e.target)) {
        setShowGenres(false);
      }
      if (countryRef.current && !countryRef.current.contains(e.target)) {
        setShowCountries(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginClick = () => {
    if (!user) navigate('/login');
  };

  const handleAvatarClick = () => {
    dropdownRef.current.classList.toggle('show-dropdown');
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/');
  };

  const handleSubmit=(e) => {
          e.preventDefault();
          if(keyword.toLowerCase().trim()){
            navigate(`/tim-kiem?query=${encodeURIComponent(keyword.toLowerCase().trim())}`)
          }
  }

  if (isLoading) return <LoadingPage />;

  return (
    <header className="custom-header">
      <div className="custom-logo">
        <span role="img" aria-label="logo">🎥</span>
        <span className="custom-logo-text">DNS<span>Movie</span></span>
      </div>

      <nav className="custom-nav d-flex">
        <Link to="/">Trang chủ</Link>

        <div className="nav-item-dropdown" ref={genreRef}>
          <button onClick={() => setShowGenres(!showGenres)}>Thể loại ▾</button>
          {showGenres && (
            <div className="dropdown-grid">
              {genres.map((genre, idx) => (
                <Link key={idx} to={`/the-loai/${genre.slug}`}>{genre.name}</Link>
              ))}
            </div>
          )}
        </div>

        <div className="nav-item-dropdown" ref={countryRef}>
          <button onClick={() => setShowCountries(!showCountries)}>Quốc Gia ▾</button>
          {showCountries && (
            <div className="dropdown-grid">
              {countries.map((c, idx) => (
                <Link key={idx} to={`/quoc-gia/${c.slug}`}>{c.name}</Link>
              ))}
            </div>
          )}
        </div>
        <Link to="/danh-sach/hoat-hinh">Phim Hoạt Hình</Link>

      </nav>

      <div className="custom-actions">
        <form className='search-form' onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Nhập tên phim'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <button type="submit">
            <i className="fas fa-search"></i>
          </button>
        </form>



        {!user ? (
          <button className="custom-login-btn" onClick={handleLoginClick}>
            Đăng nhập
          </button>
        ) : (
          <div className="user-avatar-wrapper" onClick={handleAvatarClick}>
            <img
              src={user.img || '/images/macdinh.png'}
              alt="avatar"
              className="user-avatar"
            />
            <div className="user-dropdown" ref={dropdownRef}>
              {user.role === 0 ? (
                <Link to="/admin">Trang Admin</Link>
              ) : (
                <Link to={`/profile/${user.id}`}>Trang cá nhân</Link>
              )}
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
