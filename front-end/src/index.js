import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Routes
import App from './App';
import Login from './pages/login';
import FAQ from './pages/faq';
import FaqIndivPage from './pages/FaqIndivPage';
import AppointmentBooking from './pages/AppointmentBooking';
import DetailedAppointmentBooking from './pages/DetailedAppointmentBooking';
import StaffLandingPage from './pages/StaffLandingPage';

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
    </Routes>
  </BrowserRouter>
);