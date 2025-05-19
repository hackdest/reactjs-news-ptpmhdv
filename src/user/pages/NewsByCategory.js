import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";

const NewsByCategory = () => {
  const { id } = useParams();
  const [news, setNews] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultImage = "http://localhost:8080/uploads/picnam3.jpeg";

  const fetchNewsByCategory = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/category/${id}/news`);
      if (!response.ok) {
        throw new Error(`Lỗi server: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text) {
        setNews([]);
        setCategoryName("Không xác định");
        return;
      }
      
      const data = JSON.parse(text);
      setCategoryName(data.length > 0 ? data[0].categoryName : "Không có bài viết nào");
      setNews(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNewsByCategory();
  }, [fetchNewsByCategory]);

  if (loading) return <div className="text-center mt-4"><i className="fas fa-spinner fa-spin fa-2x text-primary"></i></div>;
  if (error) return <p className="text-danger text-center mt-4"><i className="fas fa-exclamation-circle"></i> {error}</p>;

  return (
    <Container className="mt-4">
      <motion.h2
        className="fw-bold text-primary text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🗂 Danh mục: {categoryName}
      </motion.h2>
      
      {news.length > 0 ? (
        <Row>
          {news.map((item, index) => (
            <Col md={4} key={item.id} className="mb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="shadow-sm border-0 rounded-3 overflow-hidden card-hover">
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
          ))}
        </Row>
      ) : (
        <p className="text-center mt-4 text-muted">
          <i className="fas fa-folder-open"></i> Không có bài viết nào trong danh mục này.
        </p>
      )}
    </Container>
  );
};

export default NewsByCategory;
