import React, { useEffect, useState } from 'react'
import HeaderAmin from '../../components/HeaderAmin'
import axios from 'axios'
import Footer from '../../components/Footer'

const ListComment = () => {
  const [comments, setComments] = useState([])
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15;
  const [key, setKey] = useState('')
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const resComment = await axios.get('http://localhost:9999/comments')
      const resUsers = await axios.get('http://localhost:9999/users')
      setComments(resComment.data)
      setUsers(resUsers.data)
    }

    fetchData()
  }, [])

  const getUser = (uid) => {
    const user = users.find(u => u.id === uid)
    return user ? user.fullname : ''
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toISOString().split('T')[0];
  }

  const filtered = comments.filter(c => {
    const search = getUser(c.userId).toLowerCase().trim().includes(key.toLocaleLowerCase().trim())

  const commentDate = new Date(c.createdAt);

    const form = fromDate ? new Date(fromDate) :null
    const to = toDate ? new Date(toDate) :null

    const dateMatch = (!form || commentDate >= form) && (!to ||commentDate<=to)
    return search && dateMatch
  })

  const totalPage = Math.ceil(filtered.length / itemsPerPage);

  const paginateComments = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDeleteComment= async(id) => {
    if(!window.confirm('Bạn có chắc muốn xoá comment này không')) return;
      try {
         await axios.delete(`http://localhost:9999/comments/${id}`)
         setComments(comments.filter(c => c.id!==id))
      } catch (error) {
        console.log(error)
      }

  }


  return (
    <>
      <HeaderAmin>
        <div className='container-fluid'>
          <div className='text-center text-primary mb-4'>
            <h4>Danh sách bình luận</h4>
          </div>
          <div className='row'>
            <div className='col-md-9 d-flex mb-3'>
              <input
                type='date'
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className='form-control bg-secondary me-1 w-25 '
              />

              <input
                type='date'
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className='form-control bg-secondary me-3 w-25'
              />

              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => {
                  setFromDate('');
                  setToDate('');
                }}
              >
                Xóa lọc ngày
              </button>
            </div>

            <div className='col-md-3  w-25 mb-3'>
              <input
                placeholder='Nhập tên người dùng...'
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className='form-control  bg-secondary'
              />
            </div>

          </div>
          <div >
            <table className='table table-primary table-bordered table-hover'>
              <thead>
                <tr>
                  <th>Số thứ tự</th>
                  <th>Tên người bình luận</th>
                  <th>Nội dung bình luận</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {
                  paginateComments.map((c, index) => (
                    <tr key={c.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{getUser(c.userId)}</td>
                      <td>{c.content}</td>
                      <td>{formatDate(c.createdAt)}</td>
                      <td className='d-flex justify-content-center'>
                        <button className='btn btn-sm btn-danger' onClick={() => handleDeleteComment(c.id)}>
                          <i className='fas fa-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))
                }
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
  )
}

export default ListComment
