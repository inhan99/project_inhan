import { useEffect, useState } from 'react';
import axios from 'axios';

const useBookSearch = (keyword) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const key = `api_key`;

  useEffect(() => {
    const fetchBooks = async () => {
      if (!keyword || !keyword.trim()) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://data4library.kr/api/srchBooks?authKey=${key}&title=${keyword}&exactMatch=true&pageNo=1&pageSize=20&format=json`
        );

        const docs = response.data.response?.docs || [];
        setBooks(docs);
      } catch (e) {
        console.error(e);
        setError('도서 검색에 실패했습니다.');
        setBooks([]);
      }

      setLoading(false);
    };

    fetchBooks();
  }, [keyword]);

  return { books, loading, error };
};

export default useBookSearch;
