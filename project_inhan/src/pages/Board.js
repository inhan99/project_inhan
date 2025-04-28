import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/BoardListStyles.scss';

const ITEMS_PER_PAGE = 10;
//상수임을 알리기 위한 표기법

const Board = () => {
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [page, setPage] = useState(1);
  const loader = useRef(null);
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  //무한스크롤
  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const nextItems = posts.slice(0, nextPage * ITEMS_PER_PAGE);
    setVisiblePosts(nextItems);
    setPage(nextPage);
  }, [page, posts]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('posts')) || [];
    setPosts(stored);
    setVisiblePosts(stored.slice(0, ITEMS_PER_PAGE));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );
    const currentLodaer = loader.current;
    if (loader.current) {
      observer.observe(currentLodaer);
    }

    return () => {
      if (currentLodaer) {
        observer.unobserve(currentLodaer);
      }
    };
  }, [loadMore]);
  //무한스크롤 끝

  //수정할때 textarea에 포커싱
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editingId]);

  const handleDelete = (id) => {
    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);
    const updatedVisible = visiblePosts.filter((p) => p.id !== id);
    setVisiblePosts(updatedVisible);
    localStorage.setItem('posts', JSON.stringify(updated));
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setEditContent(post.content);
  };

  const handleSaveEdit = () => {
    const updated = posts.map((p) =>
      p.id === editingId ? { ...p, content: editContent } : p
    );
    setPosts(updated);
    localStorage.setItem('posts', JSON.stringify(updated));
    setEditingId(null);
    setEditContent('');
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  };
  return (
    <div className="board-wrapper">
      <button className="home-button" onClick={() => navigate('/')}>
        홈으로
      </button>
      <h2>📚 게시글 목록</h2>
      <button className="write-button" onClick={() => navigate('/board/write')}>
        ✏️ 작성하기
      </button>
      {visiblePosts.length === 0 ? (
        <div className="no-posts">등록된 게시글이 없습니다.</div>
      ) : (
        <ul>
          {visiblePosts.map((p) => (
            <li key={p.id}>
              <div className="post-item">
                <div className="post-header">
                  <div
                    className="info"
                    onClick={() => navigate(`/book/${p.book.isbn13}`)}
                  >
                    <img src={p.book.bookImageURL} alt={p.book.bookname} />
                    <div className="book-info">
                      <div className="title">{p.book.bookname}</div>
                      <div className="author">{p.book.authors}</div>
                      <div className="publisher">
                        출판사: {p.book.publisher}
                      </div>
                    </div>
                  </div>
                  <div className="button-group">
                    {editingId === p.id ? (
                      <>
                        <button
                          className="save-button"
                          onClick={handleSaveEdit}
                        >
                          저장
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() => {
                            setEditingId(null);
                            setEditContent('');
                          }}
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(p)}
                        >
                          수정
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(p.id)}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="content">
                  {editingId === p.id ? (
                    <textarea
                      ref={textareaRef}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                  ) : (
                    <>
                      <p className="post-date">
                        🕒 {formatDateTime(p.createdAt)}
                      </p>
                      <p>{p.content}</p>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div ref={loader} className="loader" style={{ height: '30px' }}></div>
    </div>
  );
};

export default Board;
