import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import '../Feature/Login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess('Đã gửi liên kết đặt lại mật khẩu đến email của bạn!');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/user-not-found') {
                setError('Email không tồn tại trong hệ thống.');
            } else {
                setError('Có lỗi xảy ra. Vui lòng thử lại.');
            }
        }
    };

    return (
        <div className="login-wrapper">
            <form className="login-box" onSubmit={handleSubmit}>
                <h2>Quên mật khẩu</h2>

                {error && <div className="login-error">{error}</div>}
                {success && <div className="login-success">{success}</div>}

                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Nhập email đăng ký"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button type="submit">Gửi liên kết đặt lại mật khẩu</button>

                <div className="forgot-links">
                    <Link to="/" className="back-home" style={{textDecoration:'none',textAlign:"center"}}> Về trang chủ</Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
