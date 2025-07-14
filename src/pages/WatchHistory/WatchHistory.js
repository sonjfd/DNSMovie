import axios from 'axios';
import React, { useEffect, useState } from 'react';
import LoadingPage from '../../components/LoadingPage';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LeftProfile from '../../components/LeftProfile';
import MovieCard from '../../components/MovieCard';

const WatchHistory = () => {
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [key, setKey] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        const raw = localStorage.getItem('user');
        if (raw) {
            const firebaseUser = JSON.parse(raw);
            setUser(firebaseUser);
        }
    }, []);

    useEffect(() => {
        if (!user) return;
        const saved = JSON.parse(localStorage.getItem(`watch-history-${user.uid}`)) || [];
        setHistory(saved);
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const results = await Promise.all(
                    history.map(h => axios.get(`https://phimapi.com/phim/${h.slug}`))
                );

                const movieList = results.map((res, index) => ({
                    ...res.data.movie,
                    episodeWatched: history[index].episode
                }));

                setMovies(movieList);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (history.length > 0) fetchData();
        else setIsLoading(false);
    }, [history]);

    const filteredMovies = movies.filter(m =>
        m.name.toLowerCase().includes(key.toLowerCase())
    );

    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
    const paginatedMovies = filteredMovies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleChangePage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (isLoading) return <LoadingPage />;

    return (
        <>
            <Header />
            <div className="container-fluid p-4 text-white" style={{ minHeight: '100vh' }}>
                <div className="row">
                    <div className="col-md-2 p-3 bg-dark me-4" style={{ borderRadius: '12px', height: '600px' }}>
                        <LeftProfile />
                    </div>

                    <div className="col-md-9">
                        {movies.length === 0 ? (
                            <p>Bạn chưa xem phim nào cả</p>
                        ) : (
                            <>
                                <div className="d-flex justify-content-end mb-3">
                                    <input
                                        type="text"
                                        placeholder="Tìm phim..."
                                        value={key}
                                        onChange={e => {
                                            setKey(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="form-control  bg-secondary text-white w-25"
                                    />
                                </div>

                                {paginatedMovies.length === 0 ? (
                                    <p>Không có phim nào trùng khớp.</p>
                                ) : (
                                    <div className="row">
                                        {paginatedMovies.map((movie, index) => (
                                            <div key={index} className="col-md-2 mb-4">
                                                <MovieCard movie={movie} />    
                                            </div>

                                        ))}
                                    </div>
                                )}

                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-center mt-4">
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
            <Footer />
        </>
    );
};

export default WatchHistory;
