import React, { useState } from 'react';
import '../components/styles/searchKeyword.scss';

const SearchKeyword = ({ setKeyword }) => {
  const [input, setInput] = useState('');

  const Search = () => {
    setKeyword(input);
  };

  return (
    <div className="research-block">
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && Search()}
      />
      <button onClick={Search}>검색</button>
    </div>
  );
};

export default SearchKeyword;
