import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import CoffeesPage from './pages/CoffeesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';

const theme = createTheme({
  palette: {
    primary: { main: '#1a1a1a' },
    background: { default: '#f5f5f5' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: '1px solid #e5e7eb' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid #f3f4f6' },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/coffees" element={<ProtectedRoute><CoffeesPage /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/coffees" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
