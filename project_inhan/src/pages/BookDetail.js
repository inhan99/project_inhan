import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/styles/BookDetail.scss';
const key = `api_key`;

const BookDetail = () => {
  const { isbn13 } = useParams();
  const [book, setBook] = useState(null);
  const [ageStats, setAgeStats] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef();
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `https://data4library.kr/api/srchDtlList?authKey=${key}&isbn13=${isbn13}&loaninfoYN=Y&displayInfo=age&exactMatch=true&pageNo=1&pageSize=20&format=json`
        );
        const bookData = response.data.response.detail[0]?.book;
        const ageData =
          response.data.response.loanInfo.find((info) => info.ageResult)
            ?.ageResult || [];

        setBook(bookData);
        setAgeStats(ageData.slice(0, 5));
      } catch (e) {
        console.error(e);
        setError('도서 정보를 불러오는 데 실패했습니다.');
      }
    };
    fetchBook();
  }, [isbn13]);

  useEffect(() => {
    const stored = localStorage.getItem('reviews');
    if (stored) {
      setReviews(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  const handleAddReview = () => {
    if (!newReview.trim()) {
      alert('내용을 입력해주세요!');
      return;
    }
    const newReviewObj = {
      id: Date.now(),
      content: newReview,
      createdAt: new Date().toLocaleString(),
    };
    setReviews(reviews.concat(newReviewObj));
    setNewReview('');
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setEditContent(review.content);
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const handleSaveEdit = () => {
    const updatedReviews = reviews.map((r) =>
      r.id === editingId ? { ...r, content: editContent } : r
    );
    setReviews(updatedReviews);
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = (id) => {
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
  };

  if (error) return <span>{error}</span>;
  if (!book) return <span>로딩 중...</span>;

  return (
    <div className="detail-wrapper">
      <button className="home-button" onClick={() => navigate('/')}>
        홈으로
      </button>
      <h2 className="title">상세 정보</h2>
      <div className="book-info">
        <img src={book.bookImageURL} alt={book.bookname} />
        <div className="info">
          <h2>{book.bookname}</h2>
          <p>저자: {book.authors}</p>
          <p>출판사: {book.publisher}</p>
          <p>출판년도: {book.publication_year}</p>
        </div>
      </div>

      <div className="book-description">
        <h3>책 소개</h3>
        <p>{book.description}</p>
      </div>

      <div className="stats-section">
        <div className="stat-title">나이대별 대출 통계 (TOP 5)</div>
        <div className="stat-list">
          {ageStats.map(({ age }, index) => (
            <div key={index}>
              {age.name}: {age.loanCnt.toLocaleString()}회
            </div>
          ))}
        </div>
      </div>

      <div className="review-section">
        <h3>한줄평</h3>
        <ul>
          {reviews.map((r) => (
            <li key={r.id}>
              {editingId === r.id ? (
                <>
                  <input
                    ref={inputRef}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <button className="save-btn" onClick={handleSaveEdit}>
                    저장
                  </button>
                  <button
                    className="cancle-btn"
                    onClick={() => setEditingId(null)}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  {r.content} <span>({r.createdAt})</span>
                  <button className="edit-btn" onClick={() => handleEdit(r)}>
                    수정
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => handleDelete(r.id)}
                  >
                    삭제
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="한줄평을 입력하세요"
        />
        <button onClick={handleAddReview}>등록</button>
      </div>
    </div>
  );
};

export default BookDetail;
