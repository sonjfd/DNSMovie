import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import MovieCard from './MovieCard';

import 'swiper/css';
import 'swiper/css/navigation';
import './MovieCarousel.css';

const MovieCarousel = ({ movies }) => {
  return (
    <div className="movie-swiper-wrapper">
      <Swiper
        modules={[Navigation]}
        slidesPerView="auto"
        spaceBetween={16}
        navigation={true}
        loop={true}
        className="movie-swiper"
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={index}>
            <MovieCard movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieCarousel;
