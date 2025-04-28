import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Category.scss';
const categories = [
  { name: '인기도서', text: '인기급상승' },
  { name: '즐겨찾기', text: '즐겨찾기' },
  { name: '게시판', text: '게시판' },
];

const Category = ({ onCategorySelect }) => {
  const navigate = useNavigate();

  const handleClick = (category) => {
    if (category.name === '즐겨찾기') {
      navigate('/favorites');
    } else if (category.name === '게시판') {
      navigate('/board');
    } else {
      onCategorySelect(category.name);
    }
  };

  return (
    <div className="category-container">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => handleClick(category)}
          className="category-button"
        >
          {category.text}
        </button>
      ))}
    </div>
  );
};

export default Category;
