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

import CustomerSupportStatistics from './pages/Staff/CustomerSupportStatistics';

import ViewDetailedAppointments from './pages/ViewDetailedAppointments';
import ChatRating from './pages/Customer/ChatRating';
import ViewUpcomingAppointments from './pages/ViewUpcomingAppointments';
// Updated frontend Routes
import ViewDetailedUpcomingAppointments from './pages/ViewDetailedUpcomingAppointments';
import CustomerLandingPage from './pages/Customer/CustomerLandingPage';
import FAQListPage from './pages/FAQListPage';
import IndividualFAQPage from './pages/IndividualFAQPage';
import viewCustomerBookings from './pages/Customer/ViewBookings';
import BookingDetails from './pages/Customer/BookingDetails';

// Staff Routes
import StaffLandingPage from './pages/Staff/StaffLandingPage';
import StaffChats from './pages/Staff/StaffChats';
import ViewBranchAppointments from './pages/Staff/ViewBranchAppointments';
import StaffTicket from './pages/Staff/StaffTicket';

// Customer Routes
import AppointmentBooking from './pages/Customer/AppointmentBooking';
import DetailedAppointmentBooking from './pages/Customer/DetailedAppointmentBooking';
import Ticket from './pages/Customer/Ticket';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<App />} />
            <Route path="/login" element={<Login />} />

            {/* Updated frontend Routes */}
            <Route path="/view-detailed-upcoming-appointments" element={<ViewDetailedUpcomingAppointments />} />
            <Route path="/faqlistpage" element={<FAQListPage />} />
            <Route path="/individualfaqpage" element={<IndividualFAQPage />} />

            <Route
                path="/staff/customer-support-statistics"
                element={<ProtectedRoute Component={CustomerSupportStatistics} role="staff" />}
            />

            {/* FAQ Routes */}


            {/* Chat Routes */}
            <Route path="/awaitchat" element={<InitisaliseChat />} />
            <Route path="/chat" element={<CustomerChat />} />
            <Route path="/chat/rating" element={<ChatRating />} />
            <Route path="/view-branch-appointments" element={<ViewBranchAppointments />} />
            <Route path="/view-detailed-appointments" element={<ViewDetailedAppointments />} />
            <Route path="/view-upcoming-appointments" element={<ViewUpcomingAppointments />} />


            <Route path="*" element={<h1>404 Not Found</h1>} />

            {/* Protected Routes (Staff) */}
            <Route path="/staff/home" element={<ProtectedRoute Component={StaffLandingPage} role="staff" />} />
            <Route path="/staff/chats" element={<ProtectedRoute Component={StaffChats} role="staff" />} />
            <Route path="/staff/branches" element={<ProtectedRoute Component={ViewBranchAppointments} role="staff" />} />
            <Route path="/staff/stafftickets" element={<ProtectedRoute Component={StaffTicket} role="staff" />} />

            {/* Protected Routes (Customer) */}
            <Route path="/customer/home" element={<ProtectedRoute Component={CustomerLandingPage} role="customer" />} />
            <Route path="/appointments/branches" element={<ProtectedRoute Component={AppointmentBooking} role="customer" />} />
            <Route path="/appointments/timeslots" element={<ProtectedRoute Component={DetailedAppointmentBooking} role="customer" />} />
            <Route path="/appointments/viewBooking" element={<ProtectedRoute Component={viewCustomerBookings} role="customer" />} />
            <Route path="/appointments/booking/details" element={<ProtectedRoute Component={BookingDetails} role="customer" />} />
            <Route path="/tickets" element={<ProtectedRoute Component={Ticket} role="customer" />} />
        </Routes>
    </BrowserRouter>
);