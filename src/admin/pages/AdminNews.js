import React, { useEffect, useState, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const defaultImage = "http://localhost:8080/uploads/picnam3.jpeg";

  const [form, setForm] = useState({
    id: null,
    title: "",
    content: "",
    categoryId: "",
    image: null,
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const accessToken = localStorage.getItem("accessToken"); // Giả sử bạn lưu token trong localStorage

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/news?page=${currentPage}&size=5`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      setNews(data.content);
      setTotalPages(data.totalPages);
    } catch {
      showMessage("danger", "Lỗi tải tin tức!");
    } finally {
      setLoading(false);
    }
  }, [currentPage, accessToken]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/api/category", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      setCategories(data);
    } catch {
      showMessage("danger", "Lỗi tải danh mục!");
    }
  }, [accessToken]);

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, [fetchNews, fetchCategories]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const saveNews = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("categoryId", form.categoryId);
    if (form.image) formData.append("image", form.image);

    const url = form.id ? `http://localhost:8080/api/news/${form.id}` : "http://localhost:8080/api/news";
    const method = form.id ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      showMessage("success", form.id ? "Tin tức đã cập nhật!" : "Tin tức đã thêm!");
      setForm({ id: null, title: "", content: "", categoryId: "", image: null });
      fetchNews();
    } catch {
      showMessage("danger", "Lỗi xử lý tin tức!");
    }
  };

  const deleteNews = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await fetch(`http://localhost:8080/api/news/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      showMessage("success", "Tin tức đã xóa!");
      fetchNews();
    } catch {
      showMessage("danger", "Lỗi khi xóa!");
    }
  };

  const startEditing = (n) => {
    setForm({ id: n.id, title: n.title, content: n.content, categoryId: n.categoryId, image: null });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">📰 Quản lý tin tức</h2>
      {message.text && <div className={`alert alert-${message.type} text-center`}>{message.text}</div>}

      <form onSubmit={saveNews} className="mb-4">
        <input type="text" name="title" className="form-control mb-2" placeholder="Tiêu đề" value={form.title} onChange={handleFormChange} required />
        <textarea name="content" className="form-control mb-2" placeholder="Nội dung" value={form.content} onChange={handleFormChange} required></textarea>
        <select name="categoryId" className="form-control mb-2" value={form.categoryId} onChange={handleFormChange} required>
          <option value="">Chọn danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input type="file" className="form-control mb-2" onChange={handleImageChange} />
        <button className="btn btn-success w-100" type="submit">{form.id ? "Cập nhật" : "Thêm tin tức"}</button>
      </form>

      <input type="text" className="form-control mb-3" placeholder="🔍 Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      {loading ? (
        <div className="text-center"><div className="spinner-border text-primary"></div></div>
      ) : (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hình ảnh</th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {news.filter((n) => n.title.toLowerCase().includes(searchTerm.toLowerCase())).map((n) => (
                <tr key={n.id}>
                  <td>{n.id}</td>
                  <td>
                    <img 
                      src={n.imageUrl ? `http://localhost:8080${n.imageUrl}` : defaultImage}
                      alt="news" 
                      width="100" 
                    />
                  </td>
                  <td>{n.title}</td>
                  <td>{n.categoryName || categories.find(cat => cat.id === n.categoryId)?.name || "Không xác định"}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => startEditing(n)}>✏️ Sửa</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteNews(n.id)}>❌ Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-primary me-2" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Trang trước</button>
            <span>Trang {currentPage} / {totalPages}</span>
            <button className="btn btn-primary ms-2" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Trang sau</button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminNews;
