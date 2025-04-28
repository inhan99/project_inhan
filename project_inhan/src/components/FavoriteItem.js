import React from 'react';
import {
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineCheckBox,
} from 'react-icons/md';
import './styles/FavoriteItem.scss';
import { useNavigate } from 'react-router-dom';

const FavoriteItem = ({ book, onRemove, onToggle }) => {
  const {
    bookname,
    authors,
    bookImageURL,
    publisher,
    isbn13,
    publication_year,
    checked,
  } = book.doc;
  const navigate = useNavigate();
  const handleClick = () => navigate(`/book/${isbn13}`);

  return (
    <div className={`favorite-item ${checked ? 'checked' : ''}`}>
      <div className="checkbox">
        <div
          className={`selectItem ${checked ? 'checked' : ''}`}
          onClick={() => onToggle(isbn13)}
        >
          {checked ? <MdOutlineCheckBox /> : <MdOutlineCheckBoxOutlineBlank />}
        </div>
        {bookImageURL && (
          <div className="thumbnail">
            <img src={bookImageURL} alt="thumbnail" onClick={handleClick} />
          </div>
        )}
        <div className="contents">
          <h2>
            <span onClick={handleClick}>{bookname}</span>
          </h2>
          <p>{authors}</p>
          <p>
            출판: {publisher}, {publication_year}
          </p>
          <div className="button-container">
            <button onClick={() => onRemove(isbn13)}>삭제</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteItem;
