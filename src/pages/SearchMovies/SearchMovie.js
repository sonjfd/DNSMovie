import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingPage from '../../components/LoadingPage';
import axios from 'axios';
import MovieCard from '../../components/MovieCard';
import FilterForm from '../../components/FilterForm';

const SearchMovie = () => {
  const [movies, setMovies] = useState([]);
  const [pageInfo, setPageInfo] = useState({ totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const debounceRef = useRef();

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || 1);
  const [inputPage, setInputPage] = useState(page);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `https://phimapi.com/v1/api/tim-kiem?keyword=${encodeURIComponent(query)}&page=${page}&limit=24`
        );

        const items = res.data.data.items;
        const pagination = res.data.data.params.pagination;

        if (Array.isArray(items) && items.length > 0) {
          setMovies(items);
          setPageInfo(pagination || { totalPages: 1 });
          setNotFound(false);
        } else {
          setMovies([]);
          setPageInfo({ totalPages: 1 });
          setNotFound(true);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        setMovies([]);
        setPageInfo({ totalPages: 1 });
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query, page]);

  if (isLoading) return <LoadingPage />;

  return (
    <>
      <Header />
      <div className="container mt-4 mb-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 px-2">
          <h3 className="text-white m-0">Kết quả cho: <em>{query}</em></h3>
          <button
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
            onClick={() => setShowFilter(!showFilter)}
          >
            <i className="fas fa-filter"></i> Bộ lọc
          </button>
        </div>

        {showFilter && <FilterForm onClose={() => setShowFilter(false)} />}

        <div className='row'>
          {movies.map((movie, index) => (
            <div className='col-md-2 mb-3' key={index}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {notFound && (
          <div className="text-white text-center w-100 mt-4">
            <i className="fas fa-search-minus fa-2x mb-2"></i>
            <p>Không tìm thấy phim nào với từ khóa: <strong>{query}</strong></p>
          </div>
        )}
      </div>

      {!notFound && pageInfo.totalPages > 1 && (
        <div className='custom-pagination d-flex justify-content-center align-items-center gap-3 mb-4 '>
          <button
            className='page-arrow'
            onClick={() =>
              setSearchParams({
                ...Object.fromEntries(searchParams),
                page: page - 1,
              })
            }
            disabled={page <= 1}
          >
            ←
          </button>

          <div className='text-white'>
            <span>Trang</span>
            <input
              type='number'
              min="1"
              max={pageInfo.totalPages}
              value={inputPage}
              onChange={(e) => {
                const value = e.target.value;
                setInputPage(value);
                const newPage = parseInt(value);
                if (!isNaN(newPage) && newPage >= 1 && newPage <= pageInfo.totalPages) {
                  clearTimeout(debounceRef.current);
                  debounceRef.current = setTimeout(() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams),
                      page: newPage
                    });
                  }, 500);
                }
              }}
              className="page-input m-2"
            />
            <span>/ {pageInfo.totalPages}</span>
          </div>

          <button
            className='page-arrow'
            onClick={() =>
              setSearchParams({
                ...Object.fromEntries(searchParams),
                page: page + 1,
              })
            }
            disabled={page >= pageInfo.totalPages}
          >
            →
          </button>
        </div>
      )}
      <Footer />
    </>
  );
};

export default SearchMovie;
