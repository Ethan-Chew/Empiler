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
import FAQ from './pages/faq';
import FaqIndivPage from './pages/FaqIndivPage';
import AppointmentBooking from './pages/AppointmentBooking';
import DetailedAppointmentBooking from './pages/DetailedAppointmentBooking';
import StaffLandingPage from './pages/StaffLandingPage';
import ViewBranchAppointments from './pages/ViewBranchAppointments';
import ViewDetailedAppointments from './pages/ViewDetailedAppointments';
import ViewOutstandingChatCustomers from './pages/ViewOutstandingChatCustomers';
import AdminSupportLog from './pages/AdminSupportLog';

// Staff Routes
import StaffHome from './pages/Staff/StaffHome';
import StaffChats from './pages/Staff/StaffChats';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/faq-article" element={<FaqIndivPage />} />
      <Route path="/appointment-booking" element={<AppointmentBooking />} />
      <Route path="/detailed-appointment-booking" element={<DetailedAppointmentBooking />} />
      <Route path="/staff-landing" element={<StaffLandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/awaitchat" element={<InitisaliseChat />} />
      <Route path="/chat" element={<CustomerChat />} />
      <Route path="/view-branch-appointments" element={<ViewBranchAppointments />} />
      <Route path="/view-detailed-appointments" element={<ViewDetailedAppointments />} />
      <Route path="/view-outstanding-chat-customers" element={<ViewOutstandingChatCustomers />} />
      <Route path="/admin-support-log" element={<AdminSupportLog />} />


      <Route path="*" element={<h1>404 Not Found</h1>} />

      {/* Protected Routes */}
      <Route path="/staff/home" element={<ProtectedRoute Component={StaffHome} role="staff" />} />
      <Route path="/staff/chats" element={<ProtectedRoute Component={StaffChats} role="staff" />} />
    </Routes>
  </BrowserRouter>
);