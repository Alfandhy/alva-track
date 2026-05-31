import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Calendar from './pages/Calendar';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import { getUser, saveUser } from './services/habitService';

// Theme context — dark by default
export const ThemeContext = createContext({
  theme: 'dark',
  setTheme: () => {},
});

export default function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const user = getUser();
    // Default to dark theme per design spec
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
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      <BrowserRouter>
        <div className="app-container">
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/habits"    element={<Habits />} />
            <Route path="/calendar"  element={<Calendar />} />
            <Route path="/stats"     element={<Statistics />} />
            <Route path="/settings"  element={<Settings />} />
          </Routes>
          <Navbar />
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}
