import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // Lấy access token từ localStorage hoặc từ nơi bạn lưu token
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    fetch("http://localhost:8080/api/category")
      .then((res) => res.json())
      .then((data) => {
        const sortedCategories = (data || []).sort((a, b) => a.id - b.id);
        setCategories(sortedCategories);
      })
      .catch((error) => showMessage("danger", "Lỗi khi tải danh mục!"))
      .finally(() => setLoading(false));
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // Thêm danh mục
  const addCategory = () => {
    if (!newCategory.trim()) return showMessage("warning", "Tên danh mục không được để trống!");

    fetch("http://localhost:8080/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`, // Thêm access token vào headers
      },
      body: JSON.stringify({ name: newCategory }),
    })
      .then((res) => res.json())
      .then(() => {
        setNewCategory("");
        fetchCategories();
        showMessage("success", "Danh mục đã được thêm!");
      })
      .catch(() => showMessage("danger", "Lỗi khi thêm danh mục!"));
  };

  // Xóa danh mục
  const deleteCategory = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    fetch(`http://localhost:8080/api/category/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${accessToken}`, // Thêm access token vào headers
      },
    })
      .then(() => {
        fetchCategories();
        showMessage("success", "Danh mục đã được xóa!");
      })
      .catch(() => showMessage("danger", "Lỗi khi xóa danh mục!"));
  };

  // Chỉnh sửa danh mục
  const startEditing = (category) => {
    setEditingCategory(category.id);
    setEditedName(category.name);
  };

  const saveEdit = (id) => {
    if (!window.confirm("Bạn có chắc muốn cập nhật danh mục này?")) return;

    fetch(`http://localhost:8080/api/category/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`, // Thêm access token vào headers
      },
      body: JSON.stringify({ name: editedName }),
    })
      .then(() => {
        setEditingCategory(null);
        fetchCategories();
        showMessage("success", "Danh mục đã được cập nhật!");
      })
      .catch(() => showMessage("danger", "Lỗi khi cập nhật danh mục!"));
  };

  // Lọc danh mục theo từ khóa
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">📂 Quản lý danh mục</h2>

      {/* Thông báo */}
      {message.text && (
        <div className={`alert alert-${message.type} text-center`} role="alert">
          {message.text}
        </div>
      )}

      {/* Tìm kiếm */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="🔍 Tìm kiếm danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Thêm danh mục */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="✏️ Nhập tên danh mục mới"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button className="btn btn-success shadow-sm" onClick={addCategory}>
          ➕ Thêm
        </button>
      </div>

      {/* Hiển thị danh sách */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover table-bordered shadow-sm">
            <thead className="table-dark text-center">
              <tr>
                <th>ID</th>
                <th>Tên danh mục</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id} className="text-center">
                  <td className="align-middle">{category.id}</td>
                  <td className="align-middle">
                    {editingCategory === category.id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td className="align-middle">
                    {editingCategory === category.id ? (
                      <button className="btn btn-primary btn-sm me-2 shadow-sm" onClick={() => saveEdit(category.id)}>
                        💾 Lưu
                      </button>
                    ) : (
                      <button className="btn btn-warning btn-sm me-2 shadow-sm" onClick={() => startEditing(category)}>
                        ✏️ Sửa
                      </button>
                    )}
                    <button className="btn btn-danger btn-sm shadow-sm" onClick={() => deleteCategory(category.id)}>
                      ❌ Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-muted">Không có danh mục nào.</p>
      )}
    </div>
  );
};

export default AdminCategories;
