import React, { useEffect, useState } from 'react';
import FavoriteList from '../components/FavoriteList';
import { useNavigate } from 'react-router-dom';
import '../components/styles/Favorites.scss';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('favorites'); //로컬스토리지에서 'favorites' 키에 해당하는 데이터를 가져옴(문자열)
    if (stored) {
      setFavorites(JSON.parse(stored)); //저장된 데이터가 있다면, JSON파싱 후 favorites상태로 반영
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]); //favoirtes 상태가 변경될때마다 실행

  return (
    <div className="favorites-wrapper">
      <button className="home-button" onClick={() => navigate('/')}>
        홈으로
      </button>
      <h2 className="favorites-title">즐겨찾기</h2>
      <FavoriteList
        favorites={favorites}
        onRemove={(isbn13) => {
          setFavorites(favorites.filter((item) => item.doc.isbn13 !== isbn13));
        }}
        onToggle={(isbn13) => {
          const updatedFavorites = favorites.map((item) => {
            if (item.doc.isbn13 === isbn13) {
              return {
                ...item,
                doc: {
                  ...item.doc,
                  checked: !item.doc.checked,
                },
              };
            }
            return item;
          });
          setFavorites(updatedFavorites);
        }}
      />
    </div>
  );
};

export default Favorites;
