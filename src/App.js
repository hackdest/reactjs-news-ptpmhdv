import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // ✅ Sửa import
import UserLayout from "./user/components/UserLayout";
import AdminLayout from "./admin/components/AdminLayout";
import Home from "./user/pages/Home";
import NewsDetail from "./user/pages/NewsDetail";
import Categories from "./user/pages/Categories";
import NewsByCategory from "./user/pages/NewsByCategory";
import Profile from "./user/pages/Profile";
import Login from "./user/pages/Login";
import Register from "./user/pages/Register";
import AdminDashboard from "./admin/components/AdminDashboard";
import AdminNews from "./admin/pages/AdminNews";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminComments from "./admin/pages/AdminComments";
import NotFound from "./user/pages/NotFound"; // Trang 404
import ForgotPassword from "./user/pages/ForgotPassword";
import ResetPassword from "./user/pages/ResetPassword";


function App() {
  return (
    

      <Routes>
        {/* USER LAYOUT */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="news/:id" element={<NewsDetail />} />
          <Route path="categories" element={<Categories />} />
          <Route path="category/:id" element={<NewsByCategory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} /> 
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* ADMIN LAYOUT */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="comments" element={<AdminComments />} />
        </Route>

        {/* PAGE NOT FOUND */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;
