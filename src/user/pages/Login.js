import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!formData.username || !formData.password) {
      setMessage({ text: "Vui lòng nhập email và mật khẩu.", type: "danger" });
      return;
    }

    try {
      const response = await authService.login(formData);

      if (response.accessToken && response.refreshToken) {
        // ✅ Lưu token vào localStorage
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        // ✅ Kích hoạt sự kiện để cập nhật navbar
        window.dispatchEvent(new Event("storage"));

        setMessage({ text: "Đăng nhập thành công!", type: "success" });

        // ⏳ Chờ 1.5s rồi chuyển hướng về trang chủ
        setTimeout(() => navigate("/"), 1500);
      } else {
        throw new Error("Dữ liệu phản hồi không hợp lệ");
      }
    } catch (err) {
      setMessage({ text: "Email hoặc mật khẩu không đúng.", type: "danger" });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Đăng nhập</h3>

        {/* Hiển thị thông báo Bootstrap Alert */}
        {message.text && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
        </form>
        <div className="text-center mt-3">
          <a href="/forgot-password">Quên mật khẩu?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
