import { useEffect, useState } from 'react';
import axios from 'axios';
import useBookSearch from './hooks/useBookSearch';
import './styles/BookList.scss';
import BookItem from './BookItem';

const key = `api_key`;

const BookList = ({ keyword, category, onAddToFavorites }) => {
  const [books, setBooks] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [errorCategory, setErrorCategory] = useState(null);

  // keyword 기반 검색 결과
  const {
    books: searchedBooks,
    loading: loadingSearch,
    error: errorSearch,
  } = useBookSearch(keyword);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoadingCategory(true);
      setErrorCategory(null);

      try {
        let response;

        if (category === '인기도서') {
          response = await axios.get(
            `https://data4library.kr/api/hotTrend?authKey=${key}&searchDt=2025-04-05&format=json`
          );

          const results = response.data.response.results;
          let allDocs = [];

          for (let i = 0; i < 3; i++) {
            const docs = results[i]?.result?.docs || [];
            allDocs = allDocs.concat(docs);
          }

          const uniqueBooksMap = new Map();
          allDocs.forEach((doc) => {
            const isbn = doc.doc?.isbn13;
            if (isbn && !uniqueBooksMap.has(isbn)) {
              uniqueBooksMap.set(isbn, doc);
            }
          });
          setBooks(Array.from(uniqueBooksMap.values()));
        } else if (category) {
          const lastmonth = new Date();
          lastmonth.setMonth(lastmonth.getMonth() - 1);
          const year = lastmonth.getFullYear();
          const month = String(lastmonth.getMonth() + 1).padStart(2, '0');
          const day = String(lastmonth.getDate()).padStart(2, '0');
          const startDt = `${year}-${month}-${day}`;

          response = await axios.get(
            `http://data4library.kr/api/loanItemSrch?authKey=${key}&kdc=${category}&startDt=${startDt}&pageNo=1&pageSize=10&format=json`
          );

          setBooks(response.data.response.docs || []);
        } else {
          setBooks([]);
        }
      } catch (e) {
        console.error(e);
        setErrorCategory('도서 목록을 가져오는 데 실패했습니다.');
        setBooks([]);
      }

      setLoadingCategory(false);
    };

    if (keyword) {
      setBooks(searchedBooks);
    } else {
      fetchBooks();
    }
  }, [keyword, searchedBooks, category]);

  const isLoading = keyword ? loadingSearch : loadingCategory;
  const error = keyword ? errorSearch : errorCategory;

  if (isLoading) return <div className="book-list">대기 중...</div>;
  if (error) return <div className="book-list">{error}</div>;
  if (!books || books.length === 0)
    return (
      <div className="book-list">
        <h1>검색 결과가 없습니다...</h1>
      </div>
    );

  return (
    <div className="book-list">
      {books.map((book) => (
        <BookItem
          key={book.doc?.isbn13 || book.isbn13}
          book={book}
          onAddToFavorites={onAddToFavorites}
        />
      ))}
    </div>
  );
};

export default BookList;
