import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ALL CODE IN THIS FILE IS OVERWRITABLE, FOR DEBUG USE ONLY. TO BE REPLACED.
export default function App() {
  const navigate = useNavigate();
  const [faqSection, setFaqSection] = useState('');
  const [faqQuestion, setFaqQuestion] = useState('');

  const initChat = () => {
    sessionStorage.setItem('faqSection', faqSection);
    sessionStorage.setItem('faqQuestion', faqQuestion);

    window.open('/awaitchat', "_self");
  }

  return (
    <div>
      <input placeholder='Section' onChange={(e) => setFaqQuestion(e.target.value)} />
      <input placeholder='QUestion' onChange={(e) => setFaqSection(e.target.value)} />
      <button onClick={initChat}>
        Fire Request go WEEEEEEEEEEEEEEEE
      </button>
    </div>
  );
}