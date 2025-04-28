import React from 'react';
import './styles/BookItem.scss';
import { useNavigate } from 'react-router-dom';

const BookItem = ({ book, onAddToFavorites }) => {
  const navigate = useNavigate();
  const {
    bookname,
    authors,
    publisher,
    publication_year,
    isbn13,
    bookImageURL,
  } = book.doc;
  const handleClick = () => {
    navigate(`/book/${isbn13}`);
  };
  return (
    <div className="book-item">
      {bookImageURL && (
        <img src={bookImageURL} alt={bookname} onClick={handleClick} />
      )}
      <div className="info">
        <h2>
          {/* h2태그에 이벤트를주면 padding영역 까지 클릭 이벤트가 포함되기 때문에
          span태그를 추가적으로 감싸줘서 {bookname}에 해당하는 텍스트만 클릭
          할 시 이벤트가 설정되도록 변경 */}
          <span onClick={handleClick}>{bookname}</span>
        </h2>
        <p>{authors}</p>
        <p>출판사: {publisher}</p>
        <p>출판연도: {publication_year}</p>
        <button className="favorites" onClick={() => onAddToFavorites(book)}>
          ⭐ 즐겨찾기 추가
        </button>
      </div>
    </div>
  );
};

export default BookItem;
