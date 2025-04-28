import React, { useState, useEffect } from 'react';
import FavoriteItem from './FavoriteItem';
import './styles/FavoriteList.scss';

const FavoriteList = ({ favorites }) => {
  const [updatedFavorites, setUpdatedFavorites] = useState(favorites);

  useEffect(() => {
    setUpdatedFavorites(favorites);
  }, [favorites]);

  const handleRemove = (isbn13) => {
    const updated = updatedFavorites.filter(
      (item) => item.doc.isbn13 !== isbn13
    );
    setUpdatedFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const handleRemoveChecked = () => {
    const filtered = updatedFavorites.filter((item) => !item.doc.checked);
    setUpdatedFavorites(filtered);
    localStorage.setItem('favorites', JSON.stringify(filtered));
  };

  const handleToggle = (isbn13) => {
    const updated = updatedFavorites.map((item) =>
      item.doc.isbn13 === isbn13
        ? {
            ...item,
            doc: {
              ...item.doc,
              checked: !item.doc.checked,
            },
          }
        : item
    );
    setUpdatedFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  if (!updatedFavorites || updatedFavorites.length === 0) {
    return (
      <div className="empty-state-wrapper">
        <div className="empty-icon">📚</div>
        <div className="empty-text">아직 즐겨찾기한 도서가 없습니다.</div>
        <div className="empty-subtext">마음에 드는 책을 추가해보세요!</div>
      </div>
    );
  }

  return (
    <div className="favorite-list-wrapper">
      <div className="favorite-list-header">
        <button
          className="delete-button"
          onClick={handleRemoveChecked}
          disabled={!updatedFavorites.some((item) => item.doc.checked)}
        >
          체크된 항목 삭제
        </button>
      </div>
      {updatedFavorites.map((item) => (
        <div className="favorite-item-container" key={item.doc.isbn13}>
          <FavoriteItem
            book={item}
            onRemove={handleRemove}
            onToggle={handleToggle}
          />
        </div>
      ))}
    </div>
  );
};

export default FavoriteList;
