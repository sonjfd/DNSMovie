import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import Login from './Feature/Login';
import Register from './Feature/Register';
import ForgotPassword from './Feature/ForgotPassword';
import UserProfile from './pages/Profile/Profile';
import Admin from './pages/Admin/Admin';
import ListComment from './pages/Admin/ListComment';
import ListUser from './pages/Admin/ListUser';
import MovieByCountry from './pages/MovieByCountry/MovieByCountry';
import MovieByGenre from './pages/MovieByGenre/MovieByGenre';
import ListAnime from './pages/Anime/ListAnime';
import MovieFilterPage from './pages/FilterMoives/MovieFilterPage ';
import SearchMovie from './pages/SearchMovies/SearchMovie';
import WatchMovie from './pages/WatchMovie/WatchMovie';
import WatchHistory from './pages/WatchHistory/WatchHistory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/quoc-gia/:slug' element={<MovieByCountry/>}/>
        <Route path='/the-loai/:slug' element={<MovieByGenre/>}/>
        <Route path='/danh-sach/hoat-hinh' element={<ListAnime/>} />
         <Route path="/loc-phim/:type_list" element={<MovieFilterPage />} />
         <Route path='/tim-kiem' element={<SearchMovie/>}/>
         <Route path='/xem-phim/:slug' element={<WatchMovie/>}/>
         <Route path="/history" element={<WatchHistory />} />

        <Route path="/admin" element={<Admin />}>
          <Route index element={<ListUser />} />
          <Route path="list-comment" element={<ListComment />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
