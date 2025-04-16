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
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { name: 'General', path: '/admin/sales', icon: <DashboardIcon /> },
    { name: 'Gaudi', path: '/admin/sales/gaudi', icon: <StoreIcon /> },
    { name: 'Hospital', path: '/admin/sales/hospital', icon: <StoreIcon /> },
    { name: 'Mallorca', path: '/admin/sales/mallorca', icon: <StoreIcon /> },
    { 
      name: 'Consell', 
      path: '/admin/sales/consell', 
      icon: <StoreIcon />,
      status: <CloseIcon sx={{ fontSize: 16, color: 'error.main', ml: 1 }} /> 
    },
    { 
      name: 'Profit & Loss', 
      path: '/admin/profit-loss', 
      icon: <AccountBalanceIcon /> 
    }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: { xs: 60, sm: 180 },
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: { xs: 60, sm: 180 },
          boxSizing: 'border-box',
          background: '#fff',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box sx={{ 
        p: { xs: 1, sm: 3 },
        background: '#1976d2',
        color: 'white',
        display: { xs: 'none', sm: 'block' }
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
      
      <List sx={{ px: { xs: 1, sm: 2 }, py: 1 }}>
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
              padding: { xs: '8px', sm: '10px 16px' },
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: { xs: 0, sm: 40 },
              color: location.pathname === item.path 
                ? '#1976d2'
                : 'rgba(0,0,0,0.54)'
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              sx={{ display: { xs: 'none', sm: 'block' } }}
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {item.name}
                  {item.status && item.status}
                </Box>
              }
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