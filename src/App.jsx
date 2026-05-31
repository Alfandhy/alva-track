import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Calendar from './pages/Calendar';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { getUser, saveUser } from './services/habitService';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Theme context
export const ThemeContext = createContext({
  theme: 'dark',
  setTheme: () => {},
});

// Protected Route Component
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Layout wrapper to conditionally show Navbar
function AppLayout() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/login';

  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
      {showNavbar && <Navbar />}
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const user = getUser();
    const savedTheme = user.theme || 'dark';
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSetTheme = (newTheme) => {
    applyTheme(newTheme);
    saveUser({ theme: newTheme });
  };

  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}
