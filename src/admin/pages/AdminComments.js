import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [newContent, setNewContent] = useState("");

  // Lấy access token từ localStorage hoặc từ nơi bạn lưu token
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/comment", {
        method: "GET",
      });
      const data = await response.json();
      setComments(data);
    } catch {
      alert("Lỗi khi tải bình luận!");
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSort = () => {
    const sorted = [...comments].sort((a, b) => {
      return sortOrder === "asc"
        ? a.content.localeCompare(b.content)
        : b.content.localeCompare(a.content);
    });
    setComments(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleEdit = (comment) => {
    setSelectedComment(comment);
    setNewContent(comment.content);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await fetch(`http://localhost:8080/api/comment/${selectedComment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // Thêm access token vào headers
        },
        body: JSON.stringify({ content: newContent }),
      });
      setShowModal(false);
      fetchComments();
    } catch {
      alert("Lỗi khi cập nhật bình luận!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;
    try {
      await fetch(`http://localhost:8080/api/comment/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`, // Thêm access token vào headers
        },
      });
      fetchComments();
    } catch {
      alert("Lỗi khi xóa bình luận!");
    }
  };

  const filteredComments = comments.filter((comment) =>
    comment.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Quản lý Bình luận</h2>
      <Form.Control
        type="text"
        placeholder="Tìm kiếm bình luận..."
        value={search}
        onChange={handleSearch}
        className="mb-3"
      />
      <Button variant="primary" onClick={handleSort} className="mb-3">
        Sắp xếp {sortOrder === "asc" ? "↑" : "↓"}
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nội dung</th>
            <th>Người dùng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredComments.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.id}</td>
              <td>{comment.content}</td>
              <td>{comment.username}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(comment)}>
                  Sửa
                </Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(comment.id)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal chỉnh sửa */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa bình luận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminComments;
