import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useHistory, useLocation } from 'react-router-dom';

import { useAuth } from '../../features/auth/hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const DRAWER_WIDTH = 250;

const NAV_ITEMS = [
  { label: 'INICIO',            abbr: 'IN', color: '#00b0ff', path: ROUTES.HOME },
  { label: 'Consulta Clientes', abbr: 'CC', color: '#00b0ff', path: ROUTES.CLIENTS },
];

function DrawerContent({ username, onNavigate, items = NAV_ITEMS }) {
  const location = useLocation();

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: '#f4f7f9' }}>
      {/* User avatar + name */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 3,
          pb: 3,
        }}
      >
        <AccountCircleIcon sx={{ fontSize: 130, color: '#333' }} />
        <Typography variant="body1" fontWeight={700} sx={{ mt: 1, color: '#000', fontSize: '1.2rem' }}>
          {username || 'Nombre de Usuario'}
        </Typography>
      </Box>

      {/* MENÚ Header */}
      <Box 
        sx={{ 
          py: 2.5, 
          textAlign: 'center', 
          borderTop: '1px solid #e0e0e0',
          borderBottom: '1px solid #e0e0e0',
          bgcolor: '#f4f7f9'
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ color: '#000', letterSpacing: '0.02em', fontSize: '1.6rem' }}
        >
          MENÚ
        </Typography>
      </Box>

      {/* Nav menu */}
      <List disablePadding sx={{ pt: 2 }}>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              onClick={() => onNavigate(item.path)}
              sx={{ 
                py: 1,
                px: 4,
                bgcolor: isActive ? 'rgba(0, 176, 255, 0.08)' : 'transparent',
                borderLeft: isActive ? '4px solid #00b0ff' : '4px solid transparent',
                '&:hover': { 
                  bgcolor: isActive ? 'rgba(0, 176, 255, 0.12)' : 'rgba(0,0,0,0.04)',
                }
              }}
            >
              <Typography
                sx={{
                  width: 35,
                  color: item.color,
                  fontWeight: 800,
                  fontSize: '1rem',
                  flexShrink: 0,
                  mr: 0.5
                }}
              >
                {item.abbr}
              </Typography>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ 
                  variant: 'body1', 
                  fontWeight: 500,
                  color: isActive ? '#00b0ff' : '#546e7a',
                  fontSize: '1.1rem'
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>

  );
}

function Layout({ children, houseItem = true }) {
  const { username: authUsername, logout } = useAuth();
  const history = useHistory();
  const [mobileOpen, setMobileOpen] = useState(false);

  const username = authUsername;

  // Always show both INICIO and Consulta Clientes as per requirement
  const menuItems = NAV_ITEMS;

  const handleToggle = () => setMobileOpen((prev) => !prev);

  const handleNavigate = (path) => {
    setMobileOpen(false);
    history.push(path);
  };

  const handleLogout = () => {
    logout();
    history.push(ROUTES.LOGIN);
  };

  const drawerSx = {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    bgcolor: '#f4f7f9', // Updated to match DrawerContent bgcolor
    color: 'text.primary',
    borderRight: '1px solid rgba(0,0,0,0.12)',
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* ── Top AppBar ─────────────────────────────────────────── */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#001529', // Dark navy from the image
          boxShadow: 'none',
          borderBottom: '3px solid #00a0e9', // Brighter blue accent line
        }}
      >
      <Toolbar variant="dense" sx={{ minHeight: 64 }}>
        <IconButton color="inherit" edge="start" onClick={handleToggle} sx={{ mr: 1 }}>
          <MenuIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          fontWeight={700}
          sx={{ flexGrow: 1, letterSpacing: '0.02em', color: '#fff', fontSize: '1.2rem' }}
        >
          COMPANIA PRUEBA
        </Typography>
        <Typography
          variant="body1"
          sx={{ mr: 2, color: '#fff', fontSize: '1rem', fontWeight: 500 }}
        >
          {username || 'Nombre de Usuario'}
        </Typography>
        <Box
          onClick={handleLogout}
          sx={{
            bgcolor: '#fff',
            color: '#001529',
            width: 38,
            height: 38,
            borderRadius: 1, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': { 
              bgcolor: 'rgba(255,255,255,0.92)',
              transform: 'scale(1.05)'
            },
          }}
        >
          <ExitToAppIcon sx={{ fontSize: 22 }} />
        </Box>
      </Toolbar>
    </AppBar>

    {/* ── Side Drawer ─────────────────────────────────────────── */}
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      {/* Mobile: temporary */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { ...drawerSx },
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important' }} />
        <DrawerContent username={username} onNavigate={handleNavigate} items={menuItems} />
      </Drawer>

      {/* Desktop: permanent */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': drawerSx,
        }}
        open
      >
        <Toolbar sx={{ minHeight: '64px !important' }} /> {/* Fixed spacer to prevent overlap */}
        <DrawerContent username={username} onNavigate={handleNavigate} items={menuItems} />
      </Drawer>
    </Box>

    {/* ── Main content ────────────────────────────────────────── */}
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        minHeight: '100vh',
        mt: '64px',
        bgcolor: '#fff',
      }}
    >
      {children}
    </Box>
    </Box>
  );
}

export default Layout;
