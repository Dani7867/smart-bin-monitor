import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  ThemeProvider
} from '@mui/material';
import { DarkMode, LightMode, Delete, Map, ListAlt } from '@mui/icons-material';
import { lightTheme, darkTheme } from '../theme';

interface ShellProps {
  children: React.ReactNode;
  page: string;
  onNav: (p: string) => void;
}

export default function AppShell({ children, page, onNav }: ShellProps) {
  const [dark, setDark] = useState(false);
  const theme = dark ? darkTheme : lightTheme;

  const nav = [
    { id: 'dashboard', text: 'Dashboard', icon: <ListAlt /> },
    { id: 'bins', text: 'Bins', icon: <Delete /> },
    { id: 'route', text: 'Route', icon: <Map /> }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Top bar ---------------------------------------------------- */}
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Smart-Bin Monitor
          </Typography>
          <IconButton color="inherit" onClick={() => setDark(!dark)}>
            {dark ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Side drawer ------------------------------------------------ */}
      <Drawer
        variant="permanent"
        sx={{
          width: 200,
          [`& .MuiDrawer-paper`]: { width: 200 }
        }}
      >
        <Toolbar /> {/* spacer for the AppBar */}
        <List>
          {nav.map(n => (
            <ListItem key={n.id} disablePadding>
              <ListItemButton selected={page === n.id} onClick={() => onNav(n.id)}>
                <ListItemIcon>{n.icon}</ListItemIcon>
                <ListItemText primary={n.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content ---------------------------------------------- */}
      <Box component="main" sx={{ ml: 25, mt: 8, p: 3 }}>
        {children}
      </Box>
    </ThemeProvider>
  );
}