import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon, 
  Typography,
  Box,
  Divider
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';

function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { name: 'General', path: '/admin/sales', icon: <DashboardIcon /> },
    { name: 'Gaudi', path: '/admin/sales/gaudi', icon: <StoreIcon /> },
    { name: 'Paralel', path: '/admin/sales/paralel', icon: <StoreIcon /> },
    { name: 'Mallorca', path: '/admin/sales/mallorca', icon: <StoreIcon /> },
    { name: 'Consell', path: '/admin/sales/consell', icon: <StoreIcon /> },
    { name: 'Hospital', path: '/admin/sales/hospital', icon: <StoreIcon /> }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          background: '#fff',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box sx={{ 
        p: 3, 
        background: '#1976d2',
        color: 'white' 
      }}>
        <Typography variant="h5" sx={{ 
          mb: 1, 
          fontWeight: 600,
          color: '#fff',
          letterSpacing: '0.5px'
        }}>
          POS Admin
        </Typography>
        <Typography variant="body2" sx={{ 
          color: 'rgba(255,255,255,0.7)',
          fontSize: '0.875rem'
        }}>
          Sales Dashboard
        </Typography>
      </Box>
      
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            sx={{
              mb: 0.5,
              borderRadius: 2,
              color: '#333',
              backgroundColor: location.pathname === item.path 
                ? 'rgba(25, 118, 210, 0.08)'
                : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
              },
              transition: 'all 0.2s ease',
              padding: '10px 16px',
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 40,
              color: location.pathname === item.path 
                ? '#1976d2'
                : 'rgba(0,0,0,0.54)'
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.name}
              primaryTypographyProps={{
                fontSize: '0.9375rem',
                fontWeight: location.pathname === item.path ? 600 : 400,
                color: location.pathname === item.path ? '#1976d2' : '#333'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar; 