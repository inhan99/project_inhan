import React, { useState, useEffect, useRef } from 'react';
import useBookSearch from '../components/hooks/useBookSearch';
import '../components/styles/BoardWrite.scss';
import { useNavigate } from 'react-router-dom';

const BoardWrite = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [content, setContent] = useState('');
  const { books } = useBookSearch(keyword); // 검색된 책 목록
  const navigate = useNavigate();
  const inputRef = useRef();
  // 검색창 입력을 처리
  const handleSearchInputChange = (e) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBook) {
      alert('책을 선택해주세요!');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요!');
      return;
    }

    const newPost = {
      id: Date.now(),
      book: selectedBook,
      content,
      createdAt: new Date().toISOString(),
    };

    const rawPosts = localStorage.getItem('posts');
    const existingPosts = rawPosts ? JSON.parse(rawPosts) : [];
    const updatedPosts = [newPost].concat(existingPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));

    setSelectedBook(null);
    setContent('');
    navigate('/board');
  };

  return (
    <div className="board-wrapper">
      <h2>📚 기억에 남는 문구 게시판</h2>

      <div className="search-container">
        <strong>📖 책 검색:</strong>
        <input
          ref={inputRef}
          type="text"
          value={keyword}
          onChange={handleSearchInputChange}
          placeholder="책 제목을 입력하세요"
        />

        {/* keyword가 있을 때만 책 리스트를 보여주도록 설정 */}
        {!selectedBook && books.length > 0 && keyword.trim() && (
          <div className="book-list">
            {books.map((b) => {
              const book = b.doc;
              return (
                <div
                  key={book.isbn13}
                  className="search-book-card"
                  onClick={() => setSelectedBook(book)}
                >
                  <img src={book.bookImageURL} alt={book.bookname} />
                  <div className="search-title">{book.bookname}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {selectedBook && (
          <div className="selected-book-container">
            <p>선택한 책:</p>
            <div className="selected-book-card">
              <img
                src={selectedBook.bookImageURL}
                alt={selectedBook.bookname}
              />
              <div className="selected-book-title">{selectedBook.bookname}</div>
            </div>
          </div>
        )}

        <textarea
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="기억에 남는 문구나 소감을 적어보세요..."
        />
        <button type="submit">저장하기</button>
      </form>
    </div>
  );
};

export default BoardWrite;
