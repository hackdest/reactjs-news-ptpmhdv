import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <Link to="/admin" className="navbar-brand">
        Admin Panel
      </Link>
      <div className="d-flex">
        <Link to="/" className="btn btn-outline-light me-2">
          Trang chủ
        </Link>
        <button className="btn btn-danger">Đăng xuất</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
