import { useNavigate } from 'react-router-dom';
import './MovieCard.css';
import { useState } from 'react';

const MovieCard = ({ movie }) => {
  const [loaded, setLoaded] = useState(false);
    const navigate =useNavigate()

  const imgSrc = movie.thumb_url.startsWith('http')
    ? movie.thumb_url
    : `https://phimimg.com/${movie.thumb_url}`;

   const handleClickWatch =(slug) =>{
          navigate(`/xem-phim/${slug}`)
   }

  return (
    <div className="card movie-card bg-dark text-white" onClick={() => handleClickWatch(movie.slug)}>
      <div className="poster-wrapper">
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
        <div className="action-buttons">
          <button className="btn btn-sm btn-light" onClick={() => handleClickWatch(movie.slug)}><i className="fas fa-play"></i> Xem ngay</button>
          <button className="btn btn-sm btn-danger rounded-circle border-0"><i className="fas fa-heart"></i></button>
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
