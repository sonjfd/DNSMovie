import React, { useCallback, useEffect, useState } from 'react';
import { getMovieSuggestions } from '../Firebase/geminiSuggest';
import MovieCarousel from './MovieCarousel';

const MovieSuggestions = ({ movie }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasons, setReasons] = useState([]);
  const [refresh, setRefresh] = useState(0);

 const fetchSuggestions = useCallback(async () => {
  if (!movie?.slug || !movie?.category) return;
  setIsLoading(true);
  try {
    const res = await getMovieSuggestions(movie, refresh);
    setSuggestions(res);
  } catch (err) {
    console.error("Lỗi gợi ý Gemini:", err);
  } finally {
    setIsLoading(false);
  }
}, [movie,refresh]);

useEffect(() => {
  fetchSuggestions();
}, [fetchSuggestions, refresh]);

  if (!movie) return null;

  return (
    <div className="container highlighted-section mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="text-white">GỢI Ý PHIM TƯƠNG TỰ</h4>
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => {
            setRefresh(prev => prev + 1);
          }}
          disabled={isLoading}
        >
          Gợi ý lại
        </button>
      </div>

      {isLoading ? (
        <div className="text-white text-center">Đang lấy gợi ý phim...</div>
      ) : suggestions.length === 0 ? (
        <p className="text-white">Không tìm thấy gợi ý.</p>
      ) : (
        <>
          <MovieCarousel movies={suggestions} />
          <div className="text-end mt-3">
            <button
              className="btn btn-sm btn-outline-info"
              onClick={() => {
                const rs = suggestions.map(sug => `${sug.name}: ${sug.ly_do || 'Không rõ lý do'}`);
                setReasons(rs);
                setShowReasonModal(true);
              }}
            >
              Lý do gợi ý
            </button>
          </div>
        </>
      )}

      {showReasonModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Lý do hệ thống gợi ý</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowReasonModal(false)}></button>
              </div>
              <div className="modal-body">
                {reasons.map((r, i) => (
                  <p key={i} className="mb-2">{r}</p>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowReasonModal(false)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieSuggestions;
