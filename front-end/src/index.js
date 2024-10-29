import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Shared Routes
import App from './App';
import Login from './pages/login';
import InitisaliseChat from './pages/Customer/InitialiseChat';
import CustomerChat from './pages/Customer/CustomerChat';

// Staff Routes
import StaffHome from './pages/Staff/StaffHome';
import StaffChatList from './pages/Staff/StaffChatList';
import StaffChat from './pages/Staff/StaffChat';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/awaitchat" element={<InitisaliseChat />} />
      <Route path="/chat" element={<CustomerChat />} />

      <Route path="*" element={<h1>404 Not Found</h1>} />

      {/* Protected Routes */}
      <Route path="/staff/home" element={<ProtectedRoute Component={<StaffChatList />} role="staff" />} />
      <Route path="/staff/chats" element={<ProtectedRoute Component={<StaffHome />} role="staff" />} />
      <Route path="/staff/chat" element={<ProtectedRoute Component={<StaffChat />} role="staff" />} />
    </Routes>
  </BrowserRouter>
);