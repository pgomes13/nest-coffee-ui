import CoffeeIcon from '@mui/icons-material/Coffee';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavLink {
  to: string;
  label: string;
  icon: React.ReactElement;
}

const NAV_LINKS: NavLink[] = [
  { to: '/coffees',  label: 'Coffees',  icon: <CoffeeIcon fontSize="small" /> },
  { to: '/users',    label: 'Users',    icon: <PeopleIcon fontSize="small" /> },
  { to: '/settings', label: 'Settings', icon: <SettingsIcon fontSize="small" /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, authMode, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" sx={{ bgcolor: '#1a1a1a' }} elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <CoffeeIcon sx={{ mr: 0.5 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ fontWeight: 700, color: 'inherit', textDecoration: 'none', mr: 2 }}
          >
            Nest Coffee
          </Typography>

          {user && (
            <>
              {NAV_LINKS.map(({ to, label, icon }) => (
                <Box
                  key={to}
                  component={Link}
                  to={to}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 0.5,
                    color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
                    fontSize: '0.875rem', px: 1, py: 0.5, borderRadius: 1,
                    '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  {icon} {label}
                </Box>
              ))}

              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Chip
                  label={authMode}
                  size="small"
                  sx={{ bgcolor: '#3b82f6', color: '#fff', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                  {user.email}
                </Typography>
                <Tooltip title="Logout">
                  <IconButton color="inherit" onClick={handleLogout} size="small">
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, p: 3, maxWidth: 1100, mx: 'auto', width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
}
