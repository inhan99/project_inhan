import React, { useState } from 'react';
import BookList from '../components/BookList';
import SearchKeyword from '../components/SearchKeyword';
import Category from '../components/Category';
import MenuSidebar from '../components/MenuSidebar';
import '../components/styles/Home.scss';
import { FaBook } from 'react-icons/fa';

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('인기도서');
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  const handleKeywordChange = (value) => setKeyword(value);
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setKeyword('');
  };

  const handleAddToFavorites = (book) => {
    setFavorites((prevFavorites) => {
      //some은 배열 메서드 중 하나, 배열의 요소중 하나라도 조건을 만족하는지 검사 true, false로 반환
      const exists = prevFavorites.some(
        (item) => item.doc.isbn13 === book.doc.isbn13
      );

      if (exists) {
        alert('이미 즐겨찾기에 추가된 도서입니다.');
        return prevFavorites;
      }

      const updatedFavorites = [...prevFavorites, book];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      alert('즐겨찾기 추가가 완료되었습니다.');
      return updatedFavorites;
    });
  };

  return (
    <div className="home-container">
      <MenuSidebar onSelect={handleCategorySelect} />

      <div className="home-content">
        <h1>
          <FaBook /> 한줄책장
        </h1>
        <div className="search-section">
          <SearchKeyword keyword={keyword} setKeyword={handleKeywordChange} />
          <Category onCategorySelect={handleCategorySelect} />
        </div>
        <div className="booklist-section">
          <BookList
            keyword={keyword}
            category={category}
            onAddToFavorites={handleAddToFavorites}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
