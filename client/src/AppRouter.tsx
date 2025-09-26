import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import BookingForm from "./pages/BookingForm";
import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes - Only for authenticated users */}
        <Route 
          path="/user-dashboard" 
          element={<UserDashboard />}
        />
        <Route 
          path="/booking" 
          element={
            <ProtectedRoute requiredRole="user">
              <BookingForm onBookingSuccess={() => { /* handle booking success here */ }} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/authority-dashboard" 
          element={
            <ProtectedRoute requiredRole="authority">
              <AuthorityDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}