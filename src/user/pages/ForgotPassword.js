import React, { useState } from "react";
import authService from "../../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email không hợp lệ.");
      return;
    }

    try {
      await authService.forgotPassword({ username: email });
      setSuccessMessage("Vui lòng kiểm tra email để đặt lại mật khẩu.");
    } catch (error) {
      setError("Không tìm thấy tài khoản hoặc có lỗi xảy ra.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">Quên mật khẩu</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${error ? "is-invalid" : ""}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {error && <div className="invalid-feedback">{error}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Gửi yêu cầu
                </button>
              </form>

              <p className="mt-3 text-center">
                <a href="/login">Quay lại đăng nhập</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
