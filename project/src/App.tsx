import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { isAuthenticated } from './utils/auth';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Content Pages
import HomePage from './pages/content/HomePage';
import TypePage from './pages/content/TypePage';
import CreatePage from './pages/content/CreatePage';
import EditPage from './pages/content/EditPage';
import ViewPage from './pages/content/ViewPage';

// Profile Pages
import ProfilePage from './pages/profile/ProfilePage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = isAuthenticated();
  return auth ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

// Auth Route Component (redirects to home if already logged in)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = isAuthenticated();
  return !auth ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <>
    
      <Router>
        {/* <div>hi</div> */}
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth" element={<AuthRoute> <AuthLayout /></AuthRoute>}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="" element={<Navigate to="/login" />} />
          </Route>

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="" element={<HomePage />} />
            <Route path=":type" element={<TypePage />} />
            <Route path="create" element={<CreatePage />} />
            <Route path="edit/:id" element={<EditPage />} />
            <Route path="view/:id" element={<ViewPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  );
}

export default App;