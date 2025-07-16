import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoadingPage from '../../components/LoadingPage';
import './WatchMovie.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const WatchMovie = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [selectedRange, setSelectedRange] = useState([1, 100]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [comment, setComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratings, setRatings] = useState([])
  const [ratingValue, setRatingValue] = useState([])

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      setUser(JSON.parse(raw));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`https://phimapi.com/phim/${slug}`);
        const movieData = res.data.movie;
        const epList = res.data.episodes?.[0].server_data || [];
        setMovie(movieData);
        setEpisodes(epList);
        if (epList.length > 0) setCurrentEpisode(epList[0]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!movie) return;
      try {
        const [cmtRes, userRes] = await Promise.all([
          axios.get(`http://localhost:9999/comments?movieId=${movie._id}&_sort=createdAt&_order=desc`),
          axios.get(`http://localhost:9999/users`)
        ]);
        setComments(cmtRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAll();
  }, [movie]);

  useEffect(() => {
    const fetchRatings = async () => {
      const res = await axios.get('http://localhost:9999/ratings')
      setRatings(res.data)
    }
    fetchRatings()
  }, [movie])


  useEffect(() => {
    const fetchRating = async () => {
      const res = await axios.get(`http://localhost:9999/ratings?movieSlug=${movie?.slug}`)
      const ratings = res.data;
      if (ratings.length === 0) return;
      const totalRating = ratings.reduce((total, r) => total + parseFloat(r.score), 0)
      const avg = totalRating / ratings.length;
      console.log(avg)
      setAverageRating(avg)
    }
    fetchRating()
  }, [movie])

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !user || !movie) return;

    try {
      if (editingCommentId) {
        const target = comments.find(c => c.id === editingCommentId);
        const res = await axios.put(
          `http://localhost:9999/comments/${editingCommentId}`,
          { ...target, content: comment }
        );
        setComments(comments.map(c => c.id === editingCommentId ? res.data : c));
      } else {
        const newComment = {
          movieId: movie._id,
          userId: user.uid,
          content: comment,
          createdAt: new Date().toISOString()
        };
        await axios.post(`http://localhost:9999/comments`, newComment);
        setComments(pre => [newComment, ...pre]);

      }

      setComment('');
      setEditingCommentId(null);
    } catch (error) {
      console.error('Lỗi gửi bình luận:', error);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm("Bạn có muốn xoá bình luận này không")) return;
    try {
      await axios.delete(`http://localhost:9999/comments/${id}`);
      setComments(comments.filter(c => c.id !== id));
    } catch (err) {
      console.error('Lỗi xoá bình luận:', err);
    }
  };

  const splitRanges = () => {
    const total = episodes.length;
    const ranges = [];
    for (let i = 0; i < total; i += 100) {
      ranges.push([i + 1, Math.min(i + 100, total)]);
    }
    return ranges;
  };

  const filteredEpisodes = episodes.filter((_, idx) => {
    const index = idx + 1;
    return index >= selectedRange[0] && index <= selectedRange[1];
  });

  const getUserById = (id) => users.find(u => u.id === id);

  const saveWatchProgress = (slug, episode, userId) => {
    const key = `watch-history-${userId}`;
    const data = JSON.parse(localStorage.getItem(key)) || [];

    const existing = data.find(item => item.slug === slug);
    if (existing) {
      existing.episode = episode;
      existing.time = new Date().toISOString();
    } else {
      data.push({ slug, episode, time: new Date().toISOString() });
    }

    localStorage.setItem(key, JSON.stringify(data));
  };


  useEffect(() => {
    if (movie && currentEpisode && user) {
      saveWatchProgress(movie.slug, currentEpisode.name, user.uid);
    }
  }, [currentEpisode, movie, user]);

  if (isLoading) return <LoadingPage />;

  return (
    <>
      <Header />
      <div className='container text-white mt-4 mb-4'>

        {/* Thông tin phim */}
        <div className='d-flex gap-4 mb-4'>
  <div style={{ position: 'relative', width: "850px" }}>
    <img src={movie.poster_url} alt={movie.name} className='rounded w-100' />

    {averageRating && (
      <div
        className='text-warning bg-dark bg-opacity-75 p-2 rounded'
        style={{
          position: 'absolute',
          top: '0.25rem',
          right: '0.25rem',
          fontSize: '0.9rem',
          textAlign: 'right',
          lineHeight: '1.2',
        }}
      >
        <i className="fas fa-star"></i> <strong>{averageRating.toFixed(1)}</strong> / 10<br />
      </div>
    )}
  </div>

  <div>
    <h3>{movie.name}</h3>
    <p className='text-danger'>{movie.origin_name} | {movie.year} | {movie.lang}</p>
    <div className='mb-2'>
      {movie.category.map((c, i) => (
        <span key={i} className='badge bg-light text-dark me-2'>{c.name}</span>
      ))}
      {movie.country.map((c, i) => (
        <span key={i} className='badge bg-secondary me-2'>{c.name}</span>
      ))}
    </div>
    <p>{movie.content}</p>
  </div>
</div>


        {/* Iframe */}
        <div className='mb-4' style={{ aspectRatio: '16/9' }}>
          <iframe
            title={currentEpisode.name}
            src={currentEpisode.link_embed}
            width="100%"
            height="100%"
            allowFullScreen
          ></iframe>
        </div>

        {/* Ranges */}
        <div className='mb-3 d-flex flex-wrap gap-2 me-2'>
          {splitRanges().map((range, index) => (
            <button
              key={index}
              className={`btn btn-sm ${selectedRange[0] === range[0] ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => setSelectedRange(range)}
            >
              Tập {range[0]} - {range[1]}
            </button>
          ))}

          {/* {rating} */}


          <button
            className='btn btn-sm btn-outline-warning'
            onClick={() => {
              setShowRatingModal(true);

            }}
          >
            <i className='fas fa-star'></i>
          </button>
        </div>




        {/* Episodes */}
        <div className="episode-grid mb-5">
          {filteredEpisodes.map((ep, idx) => (
            <button
              key={idx}
              className={`episode-btn ${ep.slug === currentEpisode.slug ? 'active' : ''}`}
              onClick={() => setCurrentEpisode(ep)}
            >
              <i className="fa fa-play me-1"></i> {ep.name}
            </button>
          ))}
        </div>

        {/* Bình luận */}
        <div className='bg-dark text-white p-4 rounded'>
          <h5 className='mb-3'><i className='fas fa-comments'></i> Bình luận ({comments.length})</h5>

          {user && (
            <form onSubmit={handleSubmitComment} className='mb-4'>
              <textarea
                className='form-control bg-dark text-white border-secondary'
                placeholder='Viết bình luận'
                value={comment}
                maxLength={250}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className='d-flex justify-content-between align-items-center mt-2'>
                <small>{comment.length}/250</small>
                <div>
                  {editingCommentId && (
                    <button
                      type='button'
                      className='btn btn-sm btn-outline-secondary me-2'
                      onClick={() => {
                        setEditingCommentId(null);
                        setComment('');
                      }}
                    >Huỷ</button>
                  )}
                  <button type='submit' className='btn btn-sm btn-outline-primary'>
                    {editingCommentId ? 'Cập nhật' : 'Gửi'} <i className="fas fa-paper-plane ms-1"></i>
                  </button>
                </div>
              </div>
            </form>
          )}
          {
            !user ? (<p>Bạn phải <Link className='text-primary' to={'/login'}>đăng nhập</Link> để có thể bình luận</p>) : ("")
          }

          {comments.length === 0 ? (
            <p>Chưa có bình luận nào.</p>
          ) : (
            comments.map(cmt => {
              const u = getUserById(cmt.userId);
              return (
                <div key={cmt.id} className='d-flex gap-3 mb-4'>
                  <img src={u?.img || '/images/macdinh.png'} alt='avatar' className='rounded-circle' width={40} height={40} />
                  <div className='flex-grow-1'>
                    <div className='d-flex justify-content-between'>
                      <h5 className='text-bold'> {u.fullname}</h5>
                      <small style={{ color: 'white' }}>{dayjs(cmt.createdAt).format('HH:mm DD/MM/YYYY')}</small>
                    </div>
                    <div>{cmt.content}</div>
                    {user?.uid === cmt.userId && (
                      <div className='mt-1'>
                        <button className='btn btn-sm btn-outline-success rounded me-2'
                          onClick={() => {
                            setComment(cmt.content);
                            setEditingCommentId(cmt.id);
                          }}
                        >Sửa</button>
                        <button className='btn btn-sm btn-outline-danger rounded'
                          onClick={() => handleDeleteComment(cmt.id)}>Xoá</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {

        showRatingModal && (
          !user ? (
            <div className='modal show d-block' tabIndex="-1">
              <div className='modal-dialog'>
                <div className='modal-content bg-dark text-white'>
                  <div className='modal-header'>
                    <h5>Đánh giá phim : {movie.name}</h5>
                    <button
                      type='button'
                      className='btn-close btn-close-white'
                      onClick={() => setShowRatingModal(false)}
                    >
                    </button>
                  </div>
                  <div className='modal-body'>
                    <p className='text-white'>Bạn cần phải<Link className='text-danger' to={'/login'}> đăng nhập </Link>để có thể đánh giá</p>
                  </div>

                </div>
              </div>
            </div>
          ) :
            <div
              className='modal show d-block'
              tabIndex="-1"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <div className='modal-dialog'>
                <div className='modal-content bg-dark text-white'>
                  <div className='modal-header'>
                    <h5>Đánh giá phim : {movie.name}</h5>

                    <button
                      type='button'
                      className='btn-close btn-close-white'
                      onClick={() => setShowRatingModal(false)}
                    >
                    </button>
                  </div>

                  <div className='modal-body'>
                    <label>Nhập đánh giá (1-10):</label>
                    <input
                      type='number'
                      className='form-control'
                      value={ratingValue}
                      onChange={(e) => setRatingValue(e.target.value)}
                      min="1"
                      max="10"
                      step="0.1"
                    />
                  </div>
                  <div className='modal-footer'>
                    <button className='btn btn-secondary' onClick={() => setShowRatingModal(false)}>
                      Đóng
                    </button>
                    <button className='btn btn-primary'
                      onClick={async () => {
                        const value = parseFloat(ratingValue);
                        if (isNaN(value) || value < 1 || value > 10) {
                          alert('Vui lòng nhập từ 1 đến 10');
                          return;
                        }
                        try {

                          const existing = ratings.find((r) => r.movieSlug === movie.slug && r.userId === user?.uid)

                          if (existing) {
                            await axios.put(`http://localhost:9999/ratings/${existing.id}`, {
                              ...existing,
                              score: ratingValue,
                              createdAt: new Date().toISOString()
                            })

                          } else {
                            await axios.post(`http://localhost:9999/ratings`, {
                              userId: user.uid,
                              movieSlug: movie.slug,
                              score: ratingValue,
                              createdAt: new Date().toISOString()
                            })
                          }
                          alert(`Bạn đã đánh giá "${movie.name}" ${value}/10`);
                          setShowRatingModal(false)
                        } catch (error) {
                          console.log(error)
                        }
                      }}

                    >
                      Giửi đánh giá
                    </button>
                  </div>

                </div>

              </div>
            </div>
        )



      }
      <Footer />
    </>
  );
};

export default WatchMovie;
