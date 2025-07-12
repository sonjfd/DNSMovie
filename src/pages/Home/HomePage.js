import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css';
import Header from './../../components/Header';
import MovieSwiper from '../../components/MovieCarousel';
import { Link } from 'react-router-dom';
import LoadingPage from './../../components/LoadingPage';
import Footer from '../../components/Footer';

const bannerUrls = [
  'https://phimapi.com/phim/tro-choi-con-muc-phan-3',
  'https://phimapi.com/phim/tham-tu-lung-danh-conan-25-nang-dau-halloween',
  'https://phimapi.com/phim/dao-hai-tac',
  'https://phimapi.com/phim/avengers-4-hoi-ket',
  'https://phimapi.com/phim/dai-chien-nguoi-khong-lo-lan-tan-cong-cuoi-cung',
];

const HomePage = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleInfo, setVisibleInfo] = useState(true);
  const [newMovies, setNewMovies] = useState([]);
  const [phimTrungQuoc, setPhimTrungQuoc] = useState([]);
  const [phimHan, setPhimHan] = useState([]);
  const [phimAuMy, setPhimAuMy] = useState([]);
  const [phimLe, setPhimLe] = useState([]);
  const [phimVietNam, setPhimVietNam] = useState([]);
  const [anime, setAnime] = useState([])

  const [isLoading, setIsLoading] = useState(true);

  const movie = banners.length > 0 ? banners[currentIndex] : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bannerRes = await Promise.all(
          bannerUrls.map(async (url) => {
            const res = await axios.get(url);
            return res.data.movie;
          })
        );

        const newMovieRes = await axios.get(
          'https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1&limit=20'
        );
        const trungQuocRes = await axios.get(
          'https://phimapi.com/v1/api/danh-sach/phim-bo?country=trung-quoc&page=1&limit=30'
        );
        const hanQuocRes = await axios.get(
          'https://phimapi.com/v1/api/danh-sach/phim-bo?country=han-quoc&page=1&limit=30'
        );
        const auMyRes = await axios.get(
          'https://phimapi.com/v1/api/danh-sach/phim-bo?country=au-my&page=1&limit=30'
        );
        const leRes = await axios.get(
          'https://phimapi.com/v1/api/danh-sach/phim-le?page=1&limit=30'
        );

        const vietNamRes = await axios.get(
          'https://phimapi.com/v1/api/quoc-gia/viet-nam'
        );
        const animeRes = await axios.get('https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=1')


        setAnime(animeRes.data.data.items)
        setPhimVietNam(vietNamRes.data.data.items);
        setBanners(bannerRes);
        setNewMovies(newMovieRes.data.items);
        setPhimTrungQuoc(trungQuocRes.data.data.items);
        setPhimHan(hanQuocRes.data.data.items);
        setPhimAuMy(auMyRes.data.data.items);
        setPhimLe(leRes.data.data.items);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (index) => {
    if (index === currentIndex) return;
    setVisibleInfo(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setVisibleInfo(true);
    }, 300);
  };

  if (isLoading) return <LoadingPage />;

  const renderSection = (title, movies, slug, color = 'white') => (
    <div className="container section-wrapper">
      <div className="row">
        <div className="col-md-2 d-flex flex-column justify-content-center">
          <h3 className="section-title" style={{ color }}>{title}</h3>
          <Link className="text-white" to={`/quoc-gia/${slug}`}>Xem tất cả</Link>
        </div>
        <div className="col-md-10">
          <MovieSwiper movies={movies.slice(0, 20)} />
        </div>
      </div>
    </div>

  );

  return (
    <>
      <Header />
      <>
        {movie && (
          <div
            className="banner"
            style={{ backgroundImage: `url(${movie.thumb_url})` }}
          >
            <div className="overlay">
              <div className={`banner-info ${visibleInfo ? 'show' : 'hide'}`}>
                <div className="rating">
                  ⭐ {movie.tmdb?.vote_average || 9.5}/10
                </div>
                <h1 className="title">{movie.name}</h1>
                <h5 className="origin">{movie.origin_name}</h5>
                <div className="meta">
                  <span>🎞 {movie.episode_current || 'Full (FHD)'}</span>
                  <span>⏱ {movie.time || '120 phút'}</span>
                  <span>📅 {movie.year}</span>
                </div>
                <p className="desc">{movie.content}</p>
                <div className="actions">
                  <button className="btn play">
                    <i className="fas fa-play"></i>
                  </button>
                  <button className="btn">
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="thumb-list">
              {banners.map((b, i) => (
                <img
                  key={i}
                  src={b.thumb_url}
                  alt={b.name}
                  className={`thumb ${i === currentIndex ? 'active' : ''}`}
                  onClick={() => handleSelect(i)}
                />
              ))}
            </div>
          </div>
        )}

        <hr style={{ color: 'white' }} />
        <h2 className="mt-2 pt-3 text-white">Phim mới cập nhật</h2>
        <div className="container-fluid highlighted-section mb-5">
          <MovieSwiper title="Phim mới cập nhật" movies={newMovies.slice(0, 20)} />
        </div>

        {renderSection('Phim Trung Quốc', phimTrungQuoc, "trung-quoc", '#ff3c3c')}
        {renderSection('Phim Hàn Quốc', phimHan, "han-quoc", '#ff007b')}
        {renderSection('Phim Âu Mỹ', phimAuMy, "au-my", '#007bff')}


        <hr style={{ color: 'white' }} />


        <div className="container-fluid highlighted-section mb-5">
          <h4>PHIM VIỆT NAM</h4>
          <MovieSwiper movies={phimVietNam.slice(0, 10)} />
        </div>


        <hr style={{ color: 'white' }} />

        <div className="container-fluid highlighted-section mb-5">
          <h4>PHIM LẺ</h4>
          <MovieSwiper movies={phimLe.slice(0, 10)} />
        </div>

        <hr style={{ color: 'white' }} />

        <div className="container-fluid highlighted-section mb-5">
          <h4>ANIME MỚI NHẤT</h4>
          <MovieSwiper movies={anime.slice(0, 10)} />
        </div>




        <div>
        </div>

      </>

      <Footer />
    </>
  );
};

export default HomePage;
