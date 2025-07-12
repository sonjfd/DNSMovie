import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../../components/MovieCard';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import FilterForm from '../../components/FilterForm';
import LoadingPage from '../../components/LoadingPage';

const MovieFilterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const debounceRef = useRef(null);

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const queryParams = new URLSearchParams(location.search);
  const type_list = location.pathname.split('/loc-phim/')[1]?.split('?')[0] || 'phim-bo';
  const page = parseInt(queryParams.get('page')) || 1;
  const sort_lang = queryParams.get('sort_lang');
  const category = queryParams.get('category');
  const country = queryParams.get('country');
  const year = queryParams.get('year');
  const [inputPage, setInputPage] = useState(page);

  useEffect(() => {
    setInputPage(page);
  }, [page]);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const url =
          `https://phimapi.com/v1/api/danh-sach/${type_list}?page=${page}` +
          (sort_lang ? `&sort_lang=${sort_lang}` : '') +
          (category ? `&category=${category}` : '') +
          (country ? `&country=${country}` : '') +
          (year ? `&year=${year}` : '') +
          `&limit=24`;

        const res = await axios.get(url);
        if (res.data.status && Array.isArray(res.data.data.items)) {
          setMovies(res.data.data.items);
          setTotalPages(res.data.data.params.pagination.totalPages || 1);
        } else {
          setMovies([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Lỗi khi gọi API phim:', error);
        setMovies([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [type_list, page, sort_lang, category, country, year]);

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('page', newPage);
    navigate(`/loc-phim/${type_list}?${newParams.toString()}`);
  };

  if(isLoading) return <LoadingPage/>

  return (
    <>
      <Header />
      <div className="container mt-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 px-2">
          <h3 className="text-white mb-4">Kết quả lọc phim</h3>
          <button
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
            onClick={() => setShowFilter(!showFilter)}
          >
            <i className="fas fa-filter"></i> Bộ lọc
          </button>
        </div>

        {showFilter && <FilterForm onClose={() => setShowFilter(false)} />}

        {isLoading ? (
          <div className="text-white">Đang tải dữ liệu...</div>
        ) : movies.length > 0 ? (
          <div className="row">
            {movies.map((movie, index) => (
              <div className="col-md-2 mb-3" key={index}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white">Không tìm thấy phim nào phù hợp.</div>
        )}

        {/* Phân trang dạng input */}
        {totalPages > 1 && (
          <div className="custom-pagination d-flex justify-content-center align-items-center gap-2 mt-4 mb-5">
            <button
              className="btn btn-outline-light rounded-circle px-3"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              ←
            </button>

            <div className="page-status d-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-dark text-white">
              <span>Trang</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={inputPage}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputPage(value);
                  const newPage = parseInt(value);
                  if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
                    clearTimeout(debounceRef.current);
                    debounceRef.current = setTimeout(() => {
                      handlePageChange(newPage);
                    }, 500);
                  }
                }}
                className="form-control form-control-sm text-center"
                style={{ width: 60 }}
              />
              <span>/ {totalPages}</span>
            </div>

            <button
              className="btn btn-outline-light rounded-circle px-3"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MovieFilterPage;
