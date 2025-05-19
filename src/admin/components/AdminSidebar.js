import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="d-flex flex-column bg-light vh-100 p-3 border-end" style={{ width: "250px" }}>
      <h4 className="mb-4">Quản trị</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/admin/news" className="nav-link text-dark">
            Quản lý Bài Viết
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/categories" className="nav-link text-dark">
            Quản lý Danh Mục
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/comments" className="nav-link text-dark">
            Quản lý Bình Luận
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/users" className="nav-link text-dark">
            Quản lý Người Dùng
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
