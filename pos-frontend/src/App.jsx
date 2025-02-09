import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Box, CssBaseline } from '@mui/material';
import Login from './components/Login';
import ProductList from './components/ProductList';
import SalesDashboard from './components/SalesDashboard';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Your green color
    },
    secondary: {
      main: '#6c757d', // Your gray color
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          padding: '10px 20px',
        },
      },
    },
  },
});

function App() {
  const isAuthenticated = !!localStorage.getItem('jwtToken');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes CSS */}
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/pos" 
              element={isAuthenticated ? <ProductList /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/pos/sales" 
              element={isAuthenticated ? <SalesDashboard /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to="/pos" />} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App; 