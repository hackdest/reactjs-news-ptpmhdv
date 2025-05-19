import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getNewsDetail,
  getCommentsByNews,
  addComment,
  updateComment,
  deleteComment,
  getCurrentUser
} from '../../services/apiService';
import {
  Container,
  Spinner,
  Card,
  ListGroup,
  Button,
  Form
} from 'react-bootstrap';
import { motion } from 'framer-motion';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const defaultImage = 'http://localhost:8080/uploads/picnam3.jpeg';

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await getNewsDetail(id);
        setNews(response.data);
      } catch (error) {
        console.error('Lỗi lấy chi tiết bài viết:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await getCommentsByNews(id);
        setComments(response.data);
      } catch (error) {
        console.error('Lỗi lấy bình luận:', error);
      }
    };

    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await getCurrentUser(token);
          setCurrentUser(res.data);
        } catch (err) {
          console.error('Không lấy được thông tin người dùng:', err);
        }
      }
    };

    fetchNewsDetail();
    fetchComments();
    fetchCurrentUser();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const token = localStorage.getItem('accessToken');
    try {
      await addComment({ newsId: id, content: newComment }, token);
      setNewComment('');
      const response = await getCommentsByNews(id);
      setComments(response.data);
    } catch (error) {
      console.error('Lỗi thêm bình luận:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem('accessToken');
    try {
      await deleteComment(commentId, token);
      const response = await getCommentsByNews(id);
      setComments(response.data);
    } catch (error) {
      console.error('Lỗi xóa bình luận:', error);
    }
  };

  const handleEditClick = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await updateComment(editingComment, { content: editContent }, token);
      setEditingComment(null);
      const response = await getCommentsByNews(id);
      setComments(response.data);
    } catch (error) {
      console.error('Lỗi cập nhật bình luận:', error);
    }
  };

  if (!news)
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Đang tải bài viết...</p>
      </Container>
    );

  return (
    <Container className="mt-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Card className="shadow-lg p-4 border-0">
          <motion.h2 className="text-center text-primary fw-bold">
            {news.title}
          </motion.h2>
          <div className="text-center my-4">
            <motion.img
              src={news.imageUrl ? `http://localhost:8080${news.imageUrl}` : defaultImage}
              alt={news.title}
              className="img-fluid rounded shadow"
              style={{ maxWidth: '600px', height: 'auto', objectFit: 'cover' }}
            />
          </div>
          <motion.p className="fs-5 text-justify">{news.content}</motion.p>
          <motion.p className="mt-3">
            <strong className="text-secondary">📌 Danh mục:</strong>{' '}
            <span className="badge bg-primary">{news.categoryName}</span>
          </motion.p>
        </Card>

        <Card className="shadow-lg p-4 mt-4 border-0">
          <h4 className="text-secondary">📝 Bình luận</h4>

          {currentUser?.username && (
            <Form className="mb-3">
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Nhập bình luận..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{
                    borderRadius: '20px',
                    padding: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #ddd'
                  }}
                />
              </Form.Group>
              <Button
                variant="primary"
                className="mt-2"
                onClick={handleAddComment}
                style={{
                  borderRadius: '20px',
                  padding: '8px 20px',
                  fontWeight: 'bold'
                }}
              >
                Gửi bình luận
              </Button>
            </Form>
          )}

          {comments.length === 0 ? (
            <p className="text-muted">Chưa có bình luận nào.</p>
          ) : (
            <ListGroup variant="flush">
              {comments.map((comment) => (
                <ListGroup.Item key={comment.id} className="py-3 d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{comment.username}:</strong>
                    {editingComment === comment.id ? (
                      <>
                        <Form.Control
                          type="text"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          style={{ borderRadius: '20px', marginTop: '10px' }}
                        />
                        <Button
                          variant="success"
                          className="mt-2 me-2"
                          onClick={handleSaveEdit}
                          style={{ borderRadius: '15px' }}
                        >
                          Lưu
                        </Button>
                        <Button
                          variant="secondary"
                          className="mt-2"
                          onClick={() => setEditingComment(null)}
                          style={{ borderRadius: '15px' }}
                        >
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <p className="mb-1">{comment.content}</p>
                    )}
                  </div>

                  {currentUser?.username === comment.username && (
                    <div>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditClick(comment)}
                        style={{ borderRadius: '15px' }}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{ borderRadius: '15px' }}
                      >
                        Xóa
                      </Button>
                    </div>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card>
      </motion.div>
    </Container>
  );
};

export default NewsDetail;
