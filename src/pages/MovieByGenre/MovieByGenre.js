
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import Header from './../../components/Header';
import Footer from '../../components/Footer';
import MovieCard from '../../components/MovieCard';
import LoadingPage from '../../components/LoadingPage';
import FilterForm from '../../components/FilterForm';

const MovieByGenre = () => {
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams()
    const [movies, setMovies] = useState([])
    const [pageInfo, setPageInfo] = useState({});
    const page = parseInt(searchParams.get('page') || 1)
    const [isLoading, setIsLoading] = useState(true);
    const [titlePage, setTitlePage] = useState("")
    const debounceRef = useRef();
    const [inputPage, setInputPage] = useState(page);
        const [showFilter, setShowFilter] = useState(false);


    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(`https://phimapi.com/v1/api/the-loai/${slug}?page=${page}&limit=24`)
                setMovies(res.data.data.items)
                console.log(res.data.data.items)
                setPageInfo(res.data.data.params.pagination);
                setTitlePage(res.data.data.titlePage)
            } catch (error) {
                console.log(error)

            } finally {
                setIsLoading(false)
            }
        }
        fetchMovies()

    }, [slug, page])

    if (isLoading) return <LoadingPage />

    return (
        <>
            <Header />
            <div className='container mt-4 mb-4'>
            
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 px-2">
                        <h3 className="text-white m-0">Phim {titlePage}</h3>
                        <button
                            className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                            onClick={() => setShowFilter(!showFilter)}
                        >
                            <i className="fas fa-filter"></i> Bộ lọc
                        </button>
                    </div>
                    {showFilter && (
                        <FilterForm onClose={() => setShowFilter(false)} />
                    )}
              

                <div className='row'>
                    {
                        movies.map((movie, index) => (
                            <div className='col-md-2 mb-3'>
                                <MovieCard key={index} movie={movie} />
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className='custom-pagination d-flex justify-content-center align-items-center gap-3 mb-4 '>
                <button
                    className='page-arrow'
                    onClick={() => setSearchParams({ page: page - 1 })}
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
                            const value = e.target.value
                            setInputPage(value)
                            const newPage = parseInt(value)
                            if (!isNaN(newPage) && newPage >= 1 && newPage <= pageInfo.totalPages) {
                                clearTimeout(debounceRef.current)
                                debounceRef.current = setTimeout(() => {
                                    setSearchParams({ page: newPage })
                                }, 500)
                            }
                        }}
                        className="page-input m-2"
                    />
                    <span>/ {pageInfo.totalPages}</span>
                </div>


                <button
                    className='page-arrow'
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

export default MovieByGenre
