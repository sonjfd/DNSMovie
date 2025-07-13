import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

    const [user, setUser] = useState(null); 
    const [userProfile, setUserProfile] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);

    useEffect(() => {
        const raw = localStorage.getItem('user');
        if (raw) {
            const firebaseUser = JSON.parse(raw);
            setUser(firebaseUser);

            axios.get('https://json-server-movie-txpm.onrender.com/users')
                .then(res => {
                    const found = res.data.find(u => u.id === firebaseUser.uid);
                    if (found) setUserProfile(found);
                });
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
        if (!movie) return;
        const fetchComments = async () => {
            try {
                const res = await axios.get(
                    `https://json-server-movie-txpm.onrender.com/comments?movieId=${movie._id || movie.slug}&_sort=createdAt&_order=desc`
                );
                setComments(res.data);
            } catch (err) {
                console.error('Lỗi tải bình luận:', err);
            }
        };
        fetchComments();
    }, [movie]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!comment.trim() || !user || !userProfile || !movie) return;

        try {
            if (editingCommentId) {
                const target = comments.find(c => c.id === editingCommentId);
                const res = await axios.put(
                    `https://json-server-movie-txpm.onrender.com/comments/${editingCommentId}`,
                    { ...target, content: comment }
                );
                setComments(comments.map(c => c.id === editingCommentId ? res.data : c));
            } else {
                const newComment = {
                    movieId: movie._id || movie.slug,
                    userId: user.uid,
                    content: comment,
                    createdAt: new Date().toISOString(),
                    user: {
                        id: user.uid,
                        name: userProfile.fullname,
                        avatar: userProfile.img || `https://i.pravatar.cc/40?u=${user.email}`
                    }
                };

                const res = await axios.post('https://json-server-movie-txpm.onrender.com/comments', newComment);
                setComments([res.data, ...comments]);
            }

            setComment('');
            setEditingCommentId(null);
        } catch (err) {
            console.error('Lỗi gửi bình luận:', err);
        }
    };

    const handleDeleteComment = async (id) => {
        if (!window.confirm('Xoá bình luận này?')) return;
        try {
            await axios.delete(`https://json-server-movie-txpm.onrender.com/comments/${id}`);
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


    // Lưu lịch sử xem vào localStorage
    const saveWatchProgress = (movieId, episode, userId) => {
        const key = `watch-history-${userId}`;
        const data = JSON.parse(localStorage.getItem(key)) || [];

        const existing = data.find(item => item.movieId === movieId);
        if (existing) {
            existing.episode = episode;
            existing.time = new Date().toISOString();
        } else {
            data.push({ movieId, episode, time: new Date().toISOString() });
        }

        localStorage.setItem(key, JSON.stringify(data));
    };

    useEffect(() => {
        if (movie && currentEpisode && user) {
            saveWatchProgress(movie._id || movie.slug, currentEpisode.name, user.uid);
        }
    }, [currentEpisode, movie, user]);


    if (isLoading) return <LoadingPage />;

    return (
        <>
            <Header />
            <div className='container text-white mt-4 mb-4'>

                {/* Thông tin phim */}
                <div className='d-flex gap-4 mb-4'>
                    <img
                        src={movie.poster_url}
                        alt={movie.name}
                        className='rounded'
                        style={{ width: "200px", height: 'auto' }}
                    />
                    <div>
                        <h3>{movie.name}</h3>
                        <p className='text-danger'>{movie.origin_name} | {movie.year} | {movie.lang}</p>
                        <div className='mb-2'>
                            {movie.category.map((c, index) => (
                                <span className='badge bg-light text-dark me-2' key={index}>{c.name}</span>
                            ))}
                            {movie.country.map((c, index) => (
                                <span key={index} className='badge bg-secondary me-2'>{c.name}</span>
                            ))}
                        </div>
                        <p className='text-white'>{movie.content}</p>
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

                {/* Chọn khoảng tập */}
                <div className='mb-3 d-flex flex-wrap gap-2'>
                    {splitRanges().map((range, index) => (
                        <button
                            key={index}
                            className={`btn btn-sm ${selectedRange[0] === range[0] ? 'btn-light' : 'btn-outline-light'}`}
                            onClick={() => setSelectedRange(range)}
                        >
                            Tập {range[0]} - {range[1]}
                        </button>
                    ))}
                </div>

                {/* Danh sách tập */}
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
                <div className="bg-dark text-white p-4 rounded">
                    <h5 className="mb-3"><i className="fas fa-comments me-2"></i>Bình luận ({comments.length})</h5>

                    {!user || !userProfile ? (
                        <p className=" mb-4 " style={{color:'white'}}>
                            Vui lòng <a href="/login" className="text-warning ">đăng nhập</a> để bình luận.
                        </p>
                    ) : (
                        <form onSubmit={handleSubmitComment} className='mb-4'>
                            <textarea
                                className='form-control bg-dark text-white border-secondary'
                                placeholder="Viết bình luận"
                                maxLength={250}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                            <div className='d-flex justify-content-between align-items-center mt-2'>
                                <small >{comment.length} / 250</small>
                                <div>
                                    {editingCommentId && (
                                        <button
                                            type='button'
                                            className='btn btn-sm btn-outline-secondary me-2'
                                            onClick={() => {
                                                setEditingCommentId(null);
                                                setComment('');
                                            }}
                                        >
                                            Hủy
                                        </button>
                                    )}
                                    <button type="submit" className="btn btn-outline-primary">
                                        {editingCommentId ? 'Cập nhật' : 'Gửi'} <i className="fas fa-paper-plane ms-1"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {comments.length === 0 ? (
                        <p >Chưa có bình luận nào.</p>
                    ) : (
                        comments.map((cmt) => (
                            <div key={cmt.id} className='d-flex gap-3 mb-4'>
                                <img src={cmt.user.avatar} alt="avatar" className='rounded-circle' width={40} height={40} />
                                <div className='flex-grow-1'>
                                    <div className=' d-flex justify-content-between'>
                                        <span>{cmt.user.name}</span>
                                        <small style={{ color: 'white' }}>
                                            {dayjs(cmt.createdAt).format('HH:mm DD/MM/YYYY')}
                                        </small>


                                    </div>
                                    <div>{cmt.content}</div>
                                    {user?.uid === cmt.user.id && (
                                        <div className='mt-1'>
                                            <button
                                                className='btn btn-sm btn-outline-warning me-2'
                                                onClick={() => {
                                                    setComment(cmt.content);
                                                    setEditingCommentId(cmt.id);
                                                }}
                                            >Sửa</button>
                                            <button
                                                className='btn btn-sm btn-outline-danger'
                                                onClick={() => handleDeleteComment(cmt.id)}
                                            >Xoá</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default WatchMovie;
