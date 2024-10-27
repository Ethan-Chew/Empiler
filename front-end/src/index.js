import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import InitisaliseChat from './pages/Customer/InitialiseChat';
import CustomerChat from './pages/Customer/CustomerChat';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/awaitchat" element={<InitisaliseChat />} />
      <Route path="/chat" element={<CustomerChat />} />

      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  </BrowserRouter>
);