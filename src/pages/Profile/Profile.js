import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {  useParams } from 'react-router-dom';
import Header from '../../components/Header';
import { auth } from '../../Firebase/firebase';
import { updatePassword } from 'firebase/auth';
import Footer from './../../components/Footer';
import LeftProfile from '../../components/LeftProfile';

const Profile = () => {
  const { id } = useParams();
  const userRef = useRef();

  const [infoForm, setInfoForm] = useState({
    fullname: '',
    email: '',
    gender: '',
    phone: '',
    img: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirmPassword: ''
  });

  const [previewImg, setPreviewImg] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/users/${id}`);
        const user = res.data;
        userRef.current = user;

        setInfoForm({
          fullname: user.fullname,
          email: user.email,
          gender: user.gender,
          phone: user.phone,
          img: user.img
        });
        setPreviewImg(user.img);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [id]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_unsigned_preset");

    try {
      const res = await axios.post("http://localhost:9999/users", formData);
      const data = res.data;
      setPreviewImg(data.secure_url);
      setInfoForm(pre => ({ ...pre, img: data.secure_url }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfoForm(pre => ({ ...pre, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(pre => ({ ...pre, [name]: value }));
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    const { fullname, gender, phone, img } = infoForm;

    if (!fullname || !gender || !phone) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const original = userRef.current;
    const isChanged =
      fullname !== original.fullname ||
      gender !== original.gender ||
      phone !== original.phone ||
      img !== original.img;

    if (!isChanged) {
      alert("Không có thay đổi nào để cập nhật.");
      return;
    }

    try {
      const updateUser = {
        fullname,
        email: infoForm.email,
        gender,
        phone,
        img,
        status: 1,
          role: 1
      };
      await axios.put(`http://localhost:9999/users/${id}`, updateUser);
      userRef.current = { ...updateUser };
      alert("Cập nhật thông tin thành công");
      window.location.reload();
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = passwordForm;

    if (!password || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ mật khẩu");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
        return;
      }

      await updatePassword(user, password);
      alert("Cập nhật mật khẩu thành công");
      setPasswordForm({ password: '', confirmPassword: '' });
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        alert("Bạn cần đăng nhập lại để đổi mật khẩu.");
      } else if (error.code === 'auth/weak-password') {
        alert("Mật khẩu phải có ít nhất 6 ký tự.");
      } else {
        console.error("Lỗi đổi mật khẩu:", error);
        alert("Cập nhật mật khẩu thất bại");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="container-fluid p-4 text-white" style={{ minHeight: '100vh' }}>
        <div className="row">
          <div className="col-md-2 p-3 bg-dark" style={{ borderRadius: '12px' }}>
           <LeftProfile/>
          </div>

          <div className="col-md-10">
            <div className="bg-dark p-4 rounded">
              <h4 className="mb-4">Cập nhật thông tin</h4>

              {/* Avatar upload */}
              <div className="row align-items-center mb-4">
                <div className="col-md-2">
                  <img
                    src={previewImg || '/default-avatar.jpg'}
                    alt="avatar"
                    className="rounded-circle img-fluid"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-md-10">
                  <input type="file" className="form-control" onChange={handleImageChange} />
                </div>
              </div>

              {/* Form cập nhật thông tin */}
              <form onSubmit={handleInfoSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Họ và tên</label>
                    <input
                      type="text"
                      name="fullname"
                      value={infoForm.fullname}
                      onChange={handleInfoChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={infoForm.email}
                      readOnly
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Giới tính</label>
                    <select
                      className="form-select"
                      name="gender"
                      value={infoForm.gender}
                      onChange={handleInfoChange}
                    >
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="text"
                      name="phone"
                      value={infoForm.phone}
                      onChange={handleInfoChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-success">Cập nhật thông tin</button>
              </form>

              {/* Form đổi mật khẩu */}
              <hr className="my-4" />
              <h5>Đổi mật khẩu</h5>
              <form onSubmit={handlePasswordSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Mật khẩu mới</label>
                    <input
                      type="password"
                      name="password"
                      value={passwordForm.password}
                      onChange={handlePasswordChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Nhập lại mật khẩu</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-warning">Đổi mật khẩu</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
