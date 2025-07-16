import { useNavigate } from 'react-router-dom';
import './MovieCard.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const MovieCard = ({ movie }) => {
  const [loaded, setLoaded] = useState(false);
  const [averageRating, setAverageRating] = useState(null);
  const navigate = useNavigate();

  const imgSrc = movie.thumb_url?.startsWith('http')
  ? movie.thumb_url
  : `https://img.phimapi.com/${movie.thumb_url}`;


  const handleClickWatch = (slug) => {
    navigate(`/xem-phim/${slug}`);
  };

  const handleClickLove = async (e, slug) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      alert('Vui Lòng đăng nhập để thêm phim ưa thích');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:9999/favorites?userID=${user.uid}&movieSlug=${slug}`);
      if (res.data.length > 0) {
        alert('Phim đã có trong danh sách ưa thích');
        return;
      }

      await axios.post(`http://localhost:9999/favorites`, {
        userID: user.uid,
        movieSlug: slug
      });
      alert('Đã thêm vào danh sách ưa thích!');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/ratings?movieSlug=${movie.slug}`);
        const ratings = res.data;
        if (ratings.length === 0) return;

        const sum = ratings.reduce((total, r) => total + parseFloat(r.score), 0);
        const avg = (sum / ratings.length).toFixed(1);
        setAverageRating(avg);
      } catch (err) {
        console.error('Lỗi lấy điểm đánh giá:', err);
      }
    };

    fetchRating();
  }, [movie.slug]);

  return (
    <div className="card movie-card bg-dark text-white" onClick={() => handleClickWatch(movie.slug)}>
      <div className="poster-wrapper position-relative">
        <img
          src={imgSrc}
          alt={movie.name}
          className={`w-100 h-100 poster-image ${loaded ? 'loaded' : 'loading'}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default.jpg';
            setLoaded(true);
          }}
        />

        {/* ⭐ Tổng đánh giá nếu có */}
        {averageRating && (
          <div
            className="position-absolute top-0 end-0  px-2 py-1 bg-dark rounded text-warning"
            style={{ fontSize: '13px' }}
          >
            <i className="fas fa-star me-1"></i> {averageRating}/10
          </div>
        )}

        <div className="action-buttons">
          <button className="btn btn-sm btn-light" onClick={() => handleClickWatch(movie.slug)}>
            <i className="fas fa-play"></i> Xem ngay
          </button>
          <button
            className="btn btn-sm btn-danger rounded-circle border-0"
            onClick={(e) => handleClickLove(e, movie.slug)}
          >
            <i className="fas fa-heart"></i>
          </button>
        </div>
      </div>
      <div className="card-body p-2">
        <h5 className="card-title movie-title">{movie.name}</h5>
        <p className="card-text movie-subtitle text-truncate">{movie.origin_name}</p>
      </div>
    </div>
  );
};

export default MovieCard;
