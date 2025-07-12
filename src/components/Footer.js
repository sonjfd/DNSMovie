import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-black text-white pt-4 pb-3 mb-0 ">
      <div className="container">
        <div className="row">
          {/* Lưu ý pháp lý */}
          <div className="col-md-9 mb-4">
            <h5 className="fw-bold mb-3">Lưu ý</h5>
            <p className="text-light small">
              Trang web này được xây dựng với mục đích học tập cá nhân. Mọi nội dung hiển thị đều được lấy từ các nguồn công khai trên Internet. 
              Chúng tôi không sở hữu, kiểm soát hay phát hành bất kỳ nội dung nào. Nếu có vi phạm bản quyền, vui lòng liên hệ để được xử lý sớm nhất.
            </p>
          </div>

          {/* Liên hệ & mạng xã hội */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Liên hệ</h5>
            <p><i className="fas fa-envelope me-2"></i>sondnhe180400@fpt.edu.vn</p>
            <p><i className="fas fa-map-marker-alt me-2"></i>Hà Nội, Việt Nam</p>
            <div className="social-icons mt-3">
              <a href="https://www.facebook.com/lethanhtung230604?locale=vi_VN" className="me-3 text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/lethtug" className="me-3 text-white">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="text-white" />
        <div className="text-center text-link-light small">
          © 2025 MovieZone. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
