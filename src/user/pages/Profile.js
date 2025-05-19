import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../../services/apiService";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

const Profile = () => {
  const [user, setUser] = useState({ firstName: "", lastName: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [validationErrors, setValidationErrors] = useState({ firstName: "", lastName: "" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();
        setUser({
          firstName: response.data.firstName ?? "",
          lastName: response.data.lastName ?? "",
          password: "",
        });
      } catch (err) {
        setError("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const validateInput = (name, value) => {
    if (value.trim() === "") {
      return ""; // Cho phép rỗng
    }
    if (!/^[A-Za-zÀ-Ỹà-ỹ\s]+$/.test(value)) {
      return "Không được chứa số hoặc ký tự đặc biệt!";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: validateInput(name, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError(null);

    const firstNameError = validateInput("firstName", user.firstName);
    const lastNameError = validateInput("lastName", user.lastName);

    if (firstNameError || lastNameError) {
      setValidationErrors({ firstName: firstNameError, lastName: lastNameError });
      setUpdating(false);
      return;
    }

    const updatedData = {
      firstName: user.firstName.trim() === "" ? null : user.firstName,
      lastName: user.lastName.trim() === "" ? null : user.lastName,
      ...(user.password.trim() !== "" && { password: user.password }),
    };

    try {
      await updateUserProfile(updatedData);
      alert("Cập nhật thành công!");
    } catch (err) {
      setUpdateError(err.response?.data?.message || "Cập nhật thất bại!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center text-muted">Đang tải...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">Thông tin cá nhân</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Họ:</label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              className={`form-control ${validationErrors.firstName ? "is-invalid" : ""}`}
              placeholder="Nhập họ (hoặc để trống)"
            />
            {validationErrors.firstName && <div className="invalid-feedback">{validationErrors.firstName}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Tên:</label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              className={`form-control ${validationErrors.lastName ? "is-invalid" : ""}`}
              placeholder="Nhập tên (hoặc để trống)"
            />
            {validationErrors.lastName && <div className="invalid-feedback">{validationErrors.lastName}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu mới:</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Để trống nếu không đổi"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={updating}>
            {updating ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </form>
        {updateError && <p className="text-danger text-center mt-3">{updateError}</p>}
      </div>
    </div>
  );
};

export default Profile;
