import  { useState } from 'react'
import '../Feature/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import {auth} from '../Firebase/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('')
    const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate();

    const handleLogin = async (e) => {
  e.preventDefault();
  setErr('');

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const res = await fetch(`http://localhost:9999/users?email=${user.email}`);
    const data = await res.json();



    const currentUser = data[0];

    if (currentUser.status === 0) {
      setErr("Tài khoản của bạn đã bị khóa !");
      return;
    }
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/');
  } catch (error) {
    console.error(error);
    setErr('Email hoặc mật khẩu không đúng!');
  }
};


    return (
        <div className="login-wrapper">


            <form className="login-box" onSubmit={handleLogin}>
                <h2>Đăng nhập</h2>
                {err &&  <div className="login-error">{err}</div>}
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Mật khẩu:</label>
                <div className="input-group">
                    <input
                        id="password"
                        type={showPass ? 'text' : 'password'}
                        className="password-input"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <span className="input-icon" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <BsEyeSlash /> : <BsEye />}

                    </span>

                </div>

                <div className="forgot-password-link">
                    <Link to="/forgot-password">Quên mật khẩu?</Link>
                </div>

                <button type="submit">Đăng nhập</button>

                <div className="login-bottom-links">
                    <Link to="/" className="back-home">Trang chủ</Link>
                    <span>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></span>
                </div>

            </form>

        </div>
    )
}

export default Login
