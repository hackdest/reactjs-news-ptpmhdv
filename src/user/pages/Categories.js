import React, { useEffect, useState } from "react";
import { Nav, Navbar, Container } from "react-bootstrap";

const Categories = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);

  // Lấy danh mục từ API
  useEffect(() => {
    fetch("http://localhost:8080/api/category")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  return (
    <Navbar bg="light" expand="lg" className="border-bottom">
      <Container>
        <Nav className="me-auto">
          {categories.map((category) => (
            <Nav.Link
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              {category.name}
            </Nav.Link>
          ))}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Categories;
