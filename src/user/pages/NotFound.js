import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="text-center mt-5">
      <h1>404 - Không tìm thấy trang</h1>
      <p>Trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/" className="btn btn-primary">
        Quay lại Trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
