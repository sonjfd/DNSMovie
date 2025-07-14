import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Header from '../../components/Header'
import MovieCard from '../../components/MovieCard'
import LoadingPage from '../../components/LoadingPage'
import './Buttons.css'
import Footer from '../../components/Footer'
import FilterForm from '../../components/FilterForm'

const MovieByCountry = () => {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([])
  const [pageInfo, setPageInfo] = useState({});
  const page = parseInt(searchParams.get('page') || 1);
  const [isLoading, setIsLoading] = useState(true);
  const [titlePage, setTitlePage] = useState("")
  const debounceRef = useRef();
  const [inputPage, setInputPage] = useState(page);
  const [showFilter, setShowFilter] = useState(false);


  useEffect(() => {

    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`https://phimapi.com/v1/api/quoc-gia/${slug}?page=${page}&limit=24`)
        setMovies(res.data.data.items)
        setPageInfo(res.data.data.params.pagination);
        setTitlePage(res.data.data.titlePage)
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovies();
    setInputPage(page)
  }, [slug, page])



  if (isLoading) return <LoadingPage />

  return (
    <>
      <Header />



      <div className="container mt-4">

        <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
          <h3 className="text-white m-0">Phim {titlePage}</h3>

          <button className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"  onClick={() => setShowFilter(!showFilter)}>
            <i className="fas fa-filter"></i> Bộ lọc
          </button>
        </div>

         {showFilter && <FilterForm onClose={() => setShowFilter(false)} />}

        <div className="row ">
          {
            movies.map((movie, index) => (
              <div className='col-md-2 mb-3'>
                <MovieCard key={index} movie={movie} />
              </div>
            ))
          }
        </div>
      </div>

      <div className="custom-pagination d-flex justify-content-center align-items-center gap-2 mt-4 mb-4">
        <button
          className="page-arrow"
          onClick={() => setSearchParams({ page: page - 1 })}
          disabled={page <= 1}
        >
          ←
        </button>

        <div className="page-status d-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-dark text-white">
          <span>Trang</span>
          <input
            type="number"
            min="1"
            max={pageInfo.totalPages}
            value={inputPage}
            onChange={(e) => {
              const value = e.target.value
              setInputPage(value);
              const newPage = parseInt(value);
              if (!isNaN(newPage) && newPage >= 1 && newPage <= pageInfo.totalPages) {
                clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => {
                  setSearchParams({ page: newPage });
                }, 500)
              }
            }}
            className="page-input"
          />
          <span>/ {pageInfo.totalPages}</span>
        </div>

        <button
          className="page-arrow"
          onClick={() => setSearchParams({ page: page + 1 })}
          disabled={page >= pageInfo.totalPages}
        >
          →
        </button>
      </div>
      <Footer />



    </>
  )
}

export default MovieByCountry
