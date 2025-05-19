import React, { useEffect, useState, useCallback } from 'react';
import { getNews } from '../../services/apiService';
import { Container, Row, Col, Card, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Ảnh mặc định nếu bài viết không có ảnh
  const defaultImage = "http://localhost:8080/uploads/picnam3.jpeg"; 

  // 🛠 Sử dụng useCallback để tối ưu việc gọi API khi `page` thay đổi
  const fetchNews = useCallback(async () => {
    try {
      const response = await getNews(page, 10);
      if (response?.data?.content) {
        setNews(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        setNews([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Lỗi lấy bài viết:', error);
      setNews([]);
      setTotalPages(1);
    }
  }, [page]);

  // Gọi API khi `page` thay đổi
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <Container>
      <motion.h2
        className="my-4 text-center text-primary fw-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📰 Tin tức mới nhất
      </motion.h2>

      {/* Danh sách bài viết */}
      <Row>
        {news.length > 0 ? (
          news.map((item, index) => (
            <Col md={4} key={item.id} className="mb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="shadow-sm border-0 rounded-3 overflow-hidden card-hover">
                  {/* 🛠 Hiển thị ảnh bài viết hoặc ảnh mặc định */}
                  <Card.Img
                    variant="top"
                    src={item.imageUrl ? `http://localhost:8080${item.imageUrl}` : defaultImage}
                    className="img-fluid rounded-top"
                    style={{ height: '180px', objectFit: 'cover' }}
                    alt="Ảnh bài viết"
                  />
                  <Card.Body>
                    <Card.Title className="fw-bold">
                      <Link to={`/news/${item.id}`} className="text-decoration-none text-dark">
                        {item.title}
                      </Link>
                    </Card.Title>
                    <Card.Text className="text-muted">
                      {item.content ? item.content.substring(0, 100) + '...' : 'Không có nội dung.'}
                    </Card.Text>
                    <Link to={`/news/${item.id}`} className="btn btn-outline-primary btn-sm">
                      📖 Xem chi tiết
                    </Link>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted">Không có bài viết nào.</p>
        )}
      </Row>

      {/* Phân trang */}
      {totalPages > 1 && (
        <motion.div
          className="d-flex justify-content-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Pagination>
            <Pagination.Prev disabled={page === 0} onClick={() => setPage(page - 1)} />
            {[...Array(totalPages).keys()].map((num) => (
              <Pagination.Item key={num} active={num === page} onClick={() => setPage(num)}>
                {num + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next disabled={page === totalPages - 1} onClick={() => setPage(page + 1)} />
          </Pagination>
        </motion.div>
      )}
    </Container>
  );
};

export default Home;
