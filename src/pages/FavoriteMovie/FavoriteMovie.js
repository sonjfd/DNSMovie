import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LeftProfile from '../../components/LeftProfile';
import axios from 'axios';
import LoadingPage from '../../components/LoadingPage';
import MovieCard from '../../components/MovieCard';

const FavoriteMovie = () => {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [ratingValue, setRatingValue] = useState('');
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      const firebaseUser = JSON.parse(raw);
      setUser(firebaseUser);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('http://localhost:9999/favorites');
        const results = await Promise.all(
          res.data
            .filter((f) => f.userID === user?.uid)
            .map((f) => axios.get(`https://phimapi.com/phim/${f.movieSlug}`))
        );
        const movieList = results.map((res) => res.data.movie);
        setMovies(movieList);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await axios.get('http://localhost:9999/ratings');
        setRatings(res.data);
      } catch (err) {
        console.error('Lỗi tải đánh giá:', err);
      }
    };
    fetchRatings();
  }, [user]);

  const filterMovie = movies.filter((movie) =>
    movie.name.toLowerCase().trim().includes(key.toLowerCase().trim())
  );

  const totalPages = Math.ceil(filterMovie.length / itemsPerPage);

  const paginatedMovies = filterMovie.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('Bạn có muốn xoá phim này khỏi danh sách ưa thích không!')) return;

    try {
      const res = await axios.get(
        `http://localhost:9999/favorites?userID=${user.uid}&movieSlug=${slug}`
      );
      const favorite = res.data[0];
      if (!favorite) {
        alert('Không tìm thấy phim trong danh sách yêu thích.');
        return;
      }

      await axios.delete(`http://localhost:9999/favorites/${favorite.id}`);
      setMovies(movies.filter((movie) => movie.slug !== slug));
    } catch (err) {
      console.error('Lỗi xoá:', err);
      alert('Xoá phim thất bại!');
    }
  };

  if (isLoading) return <LoadingPage />;

  return (
    <>
      <Header />
      <div className="container-fluid mt-4 text-white" style={{ minHeight: 'calc(100vh)' }}>
        <div className="row">
          <div className="col-md-2 bg-dark" style={{ borderRadius: '12px', height: '600px' }}>
            <LeftProfile />
          </div>

          <div className="col-md-9">
            {movies.length === 0 ? (
              <p>Bạn chưa thêm phim nào danh sách ưa thích!</p>
            ) : (
              <>
                <div className="d-flex justify-content-end mb-4">
                  <input
                    type="text"
                    placeholder="Tìm phim ...."
                    value={key}
                    onChange={(e) => {
                      setKey(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="form-control bg-secondary text-white w-25"
                  />
                </div>

                {paginatedMovies.length === 0 ? (
                  <p>Không có phim nào trùng khớp</p>
                ) : (
                  <div className="row">
                    {paginatedMovies.map((movie, index) => {
                      const userRating = ratings.find(
                        (r) => r.movieSlug === movie.slug && r.userId === user?.uid
                      );

                      return (
                        <div className="col-md-2 mb-4" key={index}>
                          <div className="position-relative">
                                <div className='d-flex justify-content-center mb-3'>
                                 <MovieCard movie={movie}      />

                                </div>
                           
                          </div>

                          {/* Nút đánh giá và xoá */}
                          <div className="d-flex justify-content-center gap-3">
                                      <button
                                          className="btn btn-sm btn-outline-warning"
                                          onClick={() => {
                                              setSelectedMovie(movie);
                                              setShowRatingModal(true);
                                              setRatingValue(userRating ? userRating.score : '');
                                          }}
                                      >
                                          <i className="fas fa-star me-1"></i> 
                                      </button>

                                      <button
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={() => handleDelete(movie.slug)}
                                      >
                                          <i className="fas fa-trash me-1"></i> 
                                      </button>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4 mb-4">
                    <button
                      className="btn btn-outline-light me-2"
                      disabled={currentPage === 1}
                      onClick={() => handleChangePage(currentPage - 1)}
                    >
                      Trang trước
                    </button>
                    <span className="align-self-center mx-2">
                      Trang {currentPage}/{totalPages}
                    </span>
                    <button
                      className="btn btn-outline-light"
                      disabled={currentPage === totalPages}
                      onClick={() => handleChangePage(currentPage + 1)}
                    >
                      Trang sau
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal đánh giá */}
      {showRatingModal && selectedMovie && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Đánh giá phim: {selectedMovie.name}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowRatingModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label>Nhập điểm (1 - 10):</label>
                <input
                  type="number"
                  className="form-control"
                  value={ratingValue}
                  onChange={(e) => setRatingValue(e.target.value)}
                  min="1"
                  max="10"
                  step="0.1"
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowRatingModal(false)}>
                  Đóng
                </button>
                <button
                  className="btn btn-success"
                  onClick={async () => {
                    const value = parseFloat(ratingValue);
                    if (isNaN(value) || value < 1 || value > 10) {
                      alert('Vui lòng nhập số từ 1 đến 10');
                      return;
                    }

                    try {
                      const existing = ratings.find(
                        (r) =>
                          r.movieSlug === selectedMovie.slug && r.userId === user?.uid
                      );

                      if (existing) {
                        await axios.put(`http://localhost:9999/ratings/${existing.id}`, {
                          ...existing,
                          score: value,
                          createdAt: new Date().toISOString(),
                        });
                      } else {
                        await axios.post('http://localhost:9999/ratings', {
                          userId: user.uid,
                          movieSlug: selectedMovie.slug,
                          score: value,
                          createdAt: new Date().toISOString(),
                        });
                      }

                      const res = await axios.get('http://localhost:9999/ratings');
                      setRatings(res.data);
                      alert(`Bạn đã đánh giá "${selectedMovie.name}" ${value}/10`);
                      setShowRatingModal(false);
                    } catch (err) {
                      alert('Lỗi khi gửi đánh giá');
                      console.error(err);
                    }
                  }}
                >
                  Gửi đánh giá
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default FavoriteMovie;
