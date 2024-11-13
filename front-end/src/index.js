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
import FAQSection from './pages/FAQSection';
import FAQDetail from './pages/FAQDetail';
import ViewDetailedAppointments from './pages/ViewDetailedAppointments';
import ChatRating from './pages/Customer/ChatRating';
import ViewUpcomingAppointments from './pages/ViewUpcomingAppointments';
{/* Updated frontend Routes */}
import ViewDetailedUpcomingAppointments from './pages/ViewDetailedUpcomingAppointments';
import LandingPage from './pages/LandingPage';
import CustomerLandingPage from './pages/CustomerLandingPage';
import FAQListPage from './pages/FAQListPage';
import IndividualFAQPage from './pages/IndividualFAQPage';

// Staff Routes
import StaffLandingPage from './pages/Staff/StaffLandingPage';
import StaffChats from './pages/Staff/StaffChats';
import ViewBranchAppointments from './pages/Staff/ViewBranchAppointments';

// Customer Routes
import CustomerHome from './pages/Customer/CustomerHome';
import AppointmentBooking from './pages/Customer/AppointmentBooking';
import DetailedAppointmentBooking from './pages/Customer/DetailedAppointmentBooking';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route path="/login" element={<Login />} />

      {/* Updated frontend Routes */}
      <Route path="/view-detailed-upcoming-appointments" element={<ViewDetailedUpcomingAppointments />} />
      <Route path="/landingpage" element={<LandingPage />} />
      <Route path="/customerlandingpage" element={<CustomerLandingPage />} />
      <Route path="/faqlistpage" element={<FAQListPage />} />
      <Route path="/individualfaqpage" element={<IndividualFAQPage />} />

      {/* FAQ Routes */}
      <Route path="/faq-article" element={<FAQDetail />} />
      <Route path="/faq" element={<FAQSection />} />

      {/* Chat Routes */}
      <Route path="/awaitchat" element={<InitisaliseChat />} />
      <Route path="/chat" element={<CustomerChat />} />
      <Route path="/chat/rating" element={<ChatRating />} />
      <Route path="/view-branch-appointments" element={<ViewBranchAppointments />} />
      <Route path="/view-detailed-appointments" element={<ViewDetailedAppointments />} />
      {/* <Route path="/view-outstanding-chat-customers" element={<ViewOutstandingChatCustomers />} />
      <Route path="/admin-support-log" element={<AdminSupportLog />} /> */}
      <Route path="/view-upcoming-appointments" element={<ViewUpcomingAppointments />} />


      <Route path="*" element={<h1>404 Not Found</h1>} />

      {/* Protected Routes (Staff) */}
      <Route path="/staff/home" element={<ProtectedRoute Component={StaffLandingPage} role="staff" />} />
      <Route path="/staff/chats" element={<ProtectedRoute Component={StaffChats} role="staff" />} />
      <Route path="/staff/branches" element={<ProtectedRoute Component={ViewBranchAppointments} role="staff" />} />

      {/* Protected Routes (Customer) */}
      <Route path="/customer/home" element={<ProtectedRoute Component={CustomerHome} role="customer" />} />
      <Route path="/appointments/branches" element={<ProtectedRoute Component={AppointmentBooking} role="customer" />} />
      <Route path="/appointments/branches" element={<ProtectedRoute Component={AppointmentBooking} role="customer" />} />
      <Route path="/appointments/timeslots" element={<ProtectedRoute Component={DetailedAppointmentBooking} role="customer" />} />
    </Routes>
  </BrowserRouter>
);