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
// import ViewOutstandingChatCustomers from './pages/ViewOutstandingChatCustomers';
// import AdminSupportLog from './pages/AdminSupportLog';
import CustomerMenuPage from './pages/CustomerMenuPage';
import ViewUpcomingAppointments from './pages/ViewUpcomingAppointments';

// Staff Routes
import StaffLandingPage from './pages/Staff/StaffLandingPage';
import StaffChats from './pages/Staff/StaffChats';
import ViewBranchAppointments from './pages/Staff/ViewBranchAppointments';

// Customer Appointment Booking Routes
import AppointmentBooking from './pages/Customer/AppointmentBooking';
import DetailedAppointmentBooking from './pages/Customer/DetailedAppointmentBooking';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route path="/login" element={<Login />} />

      {/* FAQ Routes */}
      <Route path='/faq/:section' element={<FAQSection />} />
      <Route path='/faq/:section/:article' element={<FAQDetail />} />

      {/* Chat Routes */}
      <Route path="/awaitchat" element={<InitisaliseChat />} />
      <Route path="/chat" element={<CustomerChat />} />
      <Route path="/view-branch-appointments" element={<ViewBranchAppointments />} />
      <Route path="/view-detailed-appointments" element={<ViewDetailedAppointments />} />
      {/* <Route path="/view-outstanding-chat-customers" element={<ViewOutstandingChatCustomers />} />
      <Route path="/admin-support-log" element={<AdminSupportLog />} /> */}
      <Route path="/customer-menu" element={<CustomerMenuPage />} />
      <Route path="/view-upcoming-appointments" element={<ViewUpcomingAppointments />} />
      <Route path="/FaqDetail" element={<FAQDetail />} />


      <Route path="*" element={<h1>404 Not Found</h1>} />


      {/* Protected Routes (Staff) */}
      <Route path="/staff/home" element={<ProtectedRoute Component={StaffLandingPage} role="staff" />} />
      <Route path="/staff/chats" element={<ProtectedRoute Component={StaffChats} role="staff" />} />
      <Route path="/staff/branches" element={<ProtectedRoute Component={ViewBranchAppointments} role="staff" />} />

      {/* Protected Routes (Customer) */}
      <Route path="/appointments/branches" element={<ProtectedRoute Component={AppointmentBooking} role="customer" />} />
      <Route path="/appointments/timeslots" element={<ProtectedRoute Component={DetailedAppointmentBooking} role="customer" />} />
    </Routes>
  </BrowserRouter>
);