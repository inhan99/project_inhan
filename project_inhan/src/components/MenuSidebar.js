import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import './styles/MenuSidebar.scss';

const menu = [
  { name: '1', text: '철학' },
  { name: '2', text: '종교' },
  { name: '3', text: '사회과학' },
  { name: '4', text: '자연과학' },
  { name: '5', text: '기술과학' },
  { name: '6', text: '예술' },
  { name: '7', text: '언어' },
  { name: '8', text: '문학' },
  { name: '9', text: '역사' },
];

const MenuSidebar = ({ onSelect }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="menu-sidebar-wrapper">
      <div className="scroll-buttons-wrapper">
        <button
          className="scroll-button"
          onClick={scrollToTop}
          aria-label="맨 위로"
        >
          <ArrowUpCircle />
        </button>
        <div className="popular-item">월간 인기항목</div>
        <div className="menu-items-wrapper">
          {menu.map((m) => (
            <div
              key={m.name}
              className="menu-item"
              onClick={() => onSelect(m.name)}
            >
              {m.text}
            </div>
          ))}
        </div>

        <button
          className="scroll-button"
          onClick={scrollToBottom}
          aria-label="맨 아래로"
        >
          <ArrowDownCircle />
        </button>
      </div>
    </div>
  );
};

export default MenuSidebar;
