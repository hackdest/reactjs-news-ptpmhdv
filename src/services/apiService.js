import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lấy danh sách bài viết (có phân trang)
export const getNews = async (page = 0, size = 10) => {
  return await api.get(`/news?page=${page}&size=${size}`);
};

// Lấy chi tiết bài viết
export const getNewsDetail = async (id) => {
  return await api.get(`/news/${id}`);
};

// Lấy danh sách danh mục
export const getCategories = async () => {
  return await api.get('/categories');
};

// 📌 Gọi API lấy danh sách bình luận theo bài viết
export const getCommentsByNews = async (newsId) => {
  return await axios.get(`${API_BASE_URL}/comment/${newsId}`);
};

// Thêm bình luận mới
export const addComment = async (commentData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/comment`,
      commentData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error('Lỗi khi thêm bình luận');
  }
};

// Cập nhật bình luận
export const updateComment = async (commentId, commentData, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/comment/${commentId}`,
      commentData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error('Lỗi khi cập nhật bình luận');
  }
};

// Xóa bình luận
export const deleteComment = async (commentId, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/comment/${commentId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error('Lỗi khi xóa bình luận');
  }
};

// ✅ Hàm cập nhật Authorization từ accessToken
export const setAuthToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// 📌 API lấy thông tin người dùng
export const getUserProfile = async () => {
  setAuthToken(); // Cập nhật token trước khi gọi API
  return await api.get("/user/me");
};

// 📌 API cập nhật thông tin người dùng
export const updateUserProfile = async (userData) => {
  setAuthToken(); // Cập nhật token trước khi gọi API
  return await api.put("/user/update", userData);
};
export const getCurrentUser = (token) => {
  return axios.get("http://localhost:8080/api/user/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export default api;
