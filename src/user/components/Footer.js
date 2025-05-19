import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row className="text-center text-md-start">
          {/* Cột 1: Giới thiệu chung */}
          <Col md={4} className="mb-3">
            <h5 className="fw-bold text-white">🌏 News Website</h5>
            <p className="text-light">
              Chúng tôi cung cấp tin tức mới nhất, chính xác và đa chiều, giúp bạn cập nhật thông tin trong nước và thế giới nhanh chóng.
            </p>
          </Col>

          {/* Cột 2: Tầm nhìn & Sứ mệnh */}
          <Col md={4} className="mb-3">
            <h5 className="fw-bold text-white">🎯 Tầm nhìn & Sứ mệnh</h5>
            <p className="text-light">
              News Website hướng tới việc trở thành nguồn tin cậy hàng đầu, mang đến cho độc giả góc nhìn toàn diện, trung thực và kịp thời.
            </p>
          </Col>

          {/* Cột 3: Cam kết chất lượng */}
          <Col md={4} className="mb-3">
            <h5 className="fw-bold text-white">✅ Cam kết chất lượng</h5>
            <p className="text-light">
              Chúng tôi cam kết cung cấp thông tin minh bạch, không thiên vị và luôn đặt lợi ích của độc giả lên hàng đầu.
            </p>
          </Col>
        </Row>

        {/* Bản quyền */}
        <div className="text-center mt-3 text-light">
          <p className="mb-0">© {new Date().getFullYear()} News Website. All Rights Reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
