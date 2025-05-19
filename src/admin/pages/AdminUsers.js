import React, { useEffect, useState } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [search, setSearch] = useState(""); // Tìm kiếm
  const [sortBy, setSortBy] = useState("id"); // Sắp xếp theo
  const [sortOrder, setSortOrder] = useState("asc"); // Hướng sắp xếp
  const [showModal, setShowModal] = useState(false); // Hiển thị modal
  const [editingUser, setEditingUser] = useState(null); // Người dùng đang chỉnh sửa
  const [userData, setUserData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    role: "USER",
  });

  // Lấy AccessToken từ localStorage hoặc sessionStorage (tuỳ theo cách bạn lưu token)
  const accessToken = localStorage.getItem("accessToken");

  // Lấy danh sách người dùng từ API
  useEffect(() => {
    if (accessToken) {
      fetch("http://localhost:8080/api/user/all", {
        headers: {
          "Authorization": `Bearer ${accessToken}`, // Thêm token vào header
        },
      })
        .then((response) => response.json())
        .then((data) => setUsers(Array.isArray(data) ? data : []))
        .catch((error) => console.error("Lỗi API:", error));
    }
  }, [accessToken]);

  // Tìm kiếm và sắp xếp
  const filteredUsers = users
    .filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "username") {
        return sortOrder === "asc"
          ? a.username.localeCompare(b.username)
          : b.username.localeCompare(a.username);
      } else if (sortBy === "role") {
        return sortOrder === "asc"
          ? a.role.localeCompare(b.role)
          : b.role.localeCompare(a.role);
      }
      return 0;
    });

  // Xử lý xóa người dùng
  const handleDelete = (id) => {
    if (accessToken && window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      fetch(`http://localhost:8080/api/user/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`, // Thêm token vào header
        },
      })
        .then(() => setUsers(users.filter((user) => user.id !== id)))
        .catch((error) => console.error("Lỗi khi xóa:", error));
    }
  };

  // Xử lý mở modal thêm/sửa
  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setUserData({
        username: user.username,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        password: "", // Không hiển thị mật khẩu
        role: user.role,
      });
    } else {
      setUserData({
        username: "",
        firstName: "",
        lastName: "",
        password: "",
        role: "USER",
      });
    }
    setShowModal(true);
  };

  // Xử lý thay đổi dữ liệu input
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Xử lý submit (Thêm/Sửa)
  const handleSubmit = () => {
    const url = editingUser
      ? `http://localhost:8080/api/user/update/${editingUser.id}`
      : "http://localhost:8080/api/user/create";
    const method = editingUser ? "PUT" : "POST";

    if (accessToken) {
      fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${accessToken}`, // Thêm token vào header
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (editingUser) {
            setUsers(users.map((user) => (user.id === editingUser.id ? data : user)));
          } else {
            setUsers([...users, data]);
          }
          setShowModal(false);
        })
        .catch((error) => console.error("Lỗi khi lưu dữ liệu:", error));
    } else {
      console.log("Chưa có AccessToken.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Quản lý Người Dùng</h2>

      {/* Thanh tìm kiếm */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Tìm kiếm theo username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Nút sắp xếp */}
      <div className="mb-3">
        <button
          className="btn btn-primary me-2"
          onClick={() => {
            setSortBy("username");
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          }}
        >
          Sắp xếp theo Username ({sortOrder === "asc" ? "↑" : "↓"})
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setSortBy("role");
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          }}
        >
          Sắp xếp theo Role ({sortOrder === "asc" ? "↑" : "↓"})
        </button>
      </div>

      {/* Nút thêm người dùng */}
      <button className="btn btn-success mb-3" onClick={() => openModal()}>
        Thêm Người Dùng
      </button>

      {/* Bảng danh sách người dùng */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Họ</th>
            <th>Tên</th>
            <th>Role</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.firstName || "N/A"}</td>
              <td>{user.lastName || "N/A"}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => openModal(user)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingUser ? "Sửa Người Dùng" : "Thêm Người Dùng"}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  name="username"
                  placeholder="Username"
                  value={userData.username}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  name="firstName"
                  placeholder="Họ"
                  value={userData.firstName}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  name="lastName"
                  placeholder="Tên"
                  value={userData.lastName}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  className="form-control mb-2"
                  name="password"
                  placeholder="Mật khẩu"
                  value={userData.password}
                  onChange={handleChange}
                />
                <select className="form-control" name="role" value={userData.role} onChange={handleChange}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Lưu
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default AdminUsers;
