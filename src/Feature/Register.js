import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import './Register.css';
import axios from 'axios';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/firebase';


const Register = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullname: '',
        phone: '',
        gender: 'Male',
    });

    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateForm = () => {
        const { email, password, confirmPassword, phone } = form;

        if (password !== confirmPassword) return 'Mật khẩu không khớp';
        if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email không hợp lệ';
        if (!/^0\d{9}$/.test(phone)) return 'Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và gồm 10 số)';
        return '';
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const validationMsg = validateForm();
        if (validationMsg) return setError(validationMsg);

        const { email, password, fullname, phone, gender } = form;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            await axios.post('http://localhost:9999/users', {
                id: firebaseUser.uid,
                email,
                fullname,
                phone,
                gender,
                role: 1,
                status: 1,
                img: '/images/macdinh.png'
            });

            alert('Đăng ký thành công!');
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError('Lỗi đăng ký: ' + err.message);
        }
    };

    return (
        <div className="wrapper">
            <form className="register-box" onSubmit={handleRegister}>
                <h2>Đăng ký tài khoản</h2>
                {error && <div className="error-text">{error}</div>}

                <label>Email:</label>
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />

                <label>Mật khẩu:</label>
                <div className="input-group">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Mật khẩu"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <span className="input-icon" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <BsEyeSlash /> : <BsEye />}
                    </span>
                </div>

                <label>Nhập lại mật khẩu:</label>
                <div className="input-group">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <span className="input-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                    </span>
                </div>

                <label>Họ và tên:</label>
                <input type="text" name="fullname" placeholder="Họ và tên" value={form.fullname} onChange={handleChange} required />

                <label>Số điện thoại:</label>
                <input type="text" name="phone" placeholder="Số điện thoại" value={form.phone} onChange={handleChange} required />

                <label>Giới tính:</label>
                <div className="gender-group">
                    <label>
                        <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={form.gender === 'Male'}
                            onChange={handleChange}
                        />
                        Nam
                    </label>
                    <label style={{ marginLeft: '20px' }}>
                        <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={form.gender === 'Female'}
                            onChange={handleChange}
                        />
                        Nữ
                    </label>
                </div>

                <button type="submit">Đăng ký</button>

                <div className="register-bottom-links">
                    <span>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></span>
                    <Link to="/" className="back-home">Trở về trang chủ</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
