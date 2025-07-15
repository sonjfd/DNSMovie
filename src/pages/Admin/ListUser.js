import axios from 'axios';
import React, { useEffect, useState } from 'react';
import HeaderAmin from '../../components/HeaderAmin';
import Footer from './../../components/Footer';

const ListUser = () => {

  const [users, setUsers] = useState([]);
  const [key, setKey] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:9999/users');
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const filterUser = users.filter(u => (
    u.fullname?.toLowerCase().trim().includes(key.toLowerCase().trim())
  ));

const totalPage = Math.ceil(filterUser.length / itemsPerPage);

  const paginatedUser = filterUser.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleBanUser = async (id) => {
    const user = users.find(u => u.id === id);

    if (user.status === 0) {
      const newUser = {
        ...user,
        status: 1
      }
      await axios.put(`http://localhost:9999/users/${id}`, newUser);
      alert('Mở khoá tài khoản thành công')
      setUsers((pre) => pre.map(u => u.id === id ? newUser : u))
      return;

    } else {
      if (!window.confirm('Bạn có chắc muốn cấm tài khoản của người dùng này không')) return;
      const newUser = {
        ...user,
        status: 0
      }
      await axios.put(`http://localhost:9999/users/${id}`, newUser);
      alert('Đã cấm tài khoản ' + user.fullname);
      setUsers((prev) => prev.map(u => (u.id === id ? newUser : u)));
    }



  }


  return (
    <>
      <HeaderAmin>
        <div className="container-fluid">
          <h4 className="text-center text-primary mb-4">
            Danh sách người dùng
          </h4>

          <div className='d-flex justify-content-end'>
            <input
              type='text'
              className='form-control bg-secondary mb-3 w-25 text-white'
              placeholder='Tìm kiếm theo tên...'
              value={key}
              onChange={e => setKey(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-bordered  table-primary table-hover text-center align-middle">
              <thead className="table-primary text-dark">
                <tr>
                  <th>Stt</th>
                  <th>Họ và Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Giới tính</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>

                {paginatedUser.map((user, index) => (
                  <tr key={user.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{user.fullname}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.gender}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${user.status === 0 ? 'btn-success' : 'btn-danger'}`}
                        onClick={() => handleBanUser(user.id)}
                      >
                        {user.status === 0 ? (
                          <>
                            Mở khoá
                          </>
                        ) : (
                          <>
                            Ban
                          </>
                        )}
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {
              totalPage > 1 && (
                <div className='d-flex justify-content-center'>
                  <button
                    className='btn btn-sm btn-outline-light'
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trang trước
                  </button>
                  <span className="align-self-center mx-2 text-white">
                    Trang {currentPage}/{totalPage}
                  </span>

                  <button
                    className='btn btn-sm btn-outline-light'
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPage}
                  >
                    Trang sau
                  </button>
                </div>

              )
            }
          </div>
        </div>
      </HeaderAmin>
      <Footer />
    </>
  );
};

export default ListUser;
