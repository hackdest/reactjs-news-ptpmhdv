import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Lấy danh mục từ API
  useEffect(() => {
    fetch("http://localhost:8080/api/category")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  // Lấy thông tin người dùng từ API
  const fetchUserInfo = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const res = await fetch("http://localhost:8080/api/user/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const userData = await res.json();
          setCurrentUser(userData); // Set thông tin người dùng
        } else {
          console.error("Lỗi khi lấy thông tin người dùng");
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Lỗi khi kết nối API:", error);
        setCurrentUser(null);
      }
    }
  };

  useEffect(() => {
    fetchUserInfo(); // Lấy thông tin người dùng khi component mount

    // Lắng nghe sự thay đổi của localStorage
    window.addEventListener("storage", fetchUserInfo);

    return () => {
      window.removeEventListener("storage", fetchUserInfo);
    };
  }, []);

  const handleLogout = async () => {
    try {
        const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
        const refreshToken = localStorage.getItem("refreshToken"); // Lấy refresh token

        const response = await fetch("http://localhost:8080/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Gửi JWT Token
            },
            body: JSON.stringify({ refreshToken }) // Gửi refreshToken
        });

        if (!response.ok) {
            throw new Error("Lỗi khi đăng xuất");
        }

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
    } catch (error) {
        console.error("Lỗi khi đăng xuất", error);
    }
};


  const handleLoginClick = () => {
    if (currentUser) {
      handleLogout();  // Nếu người dùng đã đăng nhập, nhấn vào "Đăng nhập" sẽ đăng xuất
    } else {
      navigate("/login");  // Nếu chưa đăng nhập, điều hướng đến trang "Đăng nhập"
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Tin tức</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {categories.map((category) => (
              <li className="nav-item" key={category.id}>
                <Link className="nav-link" to={`/category/${category.id}`}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Hiển thị nút "Đăng xuất" khi có người dùng đăng nhập */}
          {currentUser ? (
            <ul className="navbar-nav">
              {currentUser.role === "ADMIN" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Admin</Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/search">🔍 Tìm kiếm</Link>
              </li>
              <li className="nav-item dropdown">
                <button 
                  className="btn btn-light dropdown-toggle" 
                  id="userDropdown" 
                  data-bs-toggle="dropdown" 
                  onClick={() => navigate("/profile")}
                >
                  {currentUser.username}
                </button>
                <ul className="dropdown-menu" aria-labelledby="userDropdown">
                  <li><Link className="dropdown-item" to="/profile">Hồ sơ</Link></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Đăng xuất</button></li>
                </ul>
              </li>
            </ul>
          ) : (
            // Nếu chưa đăng nhập
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/register">Đăng ký</Link>
              </li>
            </ul>
          )}

          {/* Hiển thị nút "Đăng nhập" bên cạnh */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleLoginClick}>
                {currentUser ? "Đăng xuất" : "Đăng nhập"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
