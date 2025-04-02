import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Login from './components/Login';
import TDKShippingService from './components/TDKShippingService';

const theme = createTheme();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  React.useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
    if (loggedIn) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <Login onLogin={() => {
                  localStorage.setItem('isAuthenticated', 'true');
                  setIsAuthenticated(true);
                }} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
                <TDKShippingService /> : 
                <Navigate to="/" />
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;