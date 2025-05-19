const API_URL = "http://localhost:8080/api/auth"; // Đổi thành URL của backend nếu cần

const AuthService = {
  async login({ username, password }) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Sai tài khoản hoặc mật khẩu");
    return response.json();
  },

  async register({ username, password }) { // Chỉnh register nhận object
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Đăng ký thất bại");
    return response.json();
  },

  async forgotPassword({ username }) { // Nhận object thay vì chỉ username
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) throw new Error("Không thể gửi email đặt lại mật khẩu");
    return response.text();
  },

  async resetPassword({ token, newPassword }) { // Nhận object thay vì từng biến
    const response = await fetch(`${API_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) throw new Error("Đặt lại mật khẩu thất bại");
    return response.text();
  },
};

export default AuthService;
