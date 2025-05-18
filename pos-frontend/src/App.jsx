import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Box, CssBaseline } from '@mui/material';
import Login from './components/Login';
import ProductList from './components/ProductList';
import SalesDashboard from './components/SalesDashboard';
import AdminLogin from './components/admin/AdminLogin';
import AdminSales from './components/admin/AdminSales';
import ProductStats from './components/admin/ProductStats';
import AdminSalesBreakeven from './components/admin/AdminSalesBreakeven';

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes CSS */}
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/pos" 
              element={
                <ProtectedRoute>
                  <ProductList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pos/sales" 
              element={
                <ProtectedRoute>
                  <SalesDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/admin" element={<AdminLogin />} />
            <Route 
              path="/admin/sales" 
              element={
                <AdminProtectedRoute>
                  <AdminSales />
                </AdminProtectedRoute>
              } 
            />
            <Route path="/admin/sales/:store" element={<AdminSales />} />
            <Route 
              path="/admin/product-stats" 
              element={
                <AdminProtectedRoute>
                  <ProductStats />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin/sales-breakeven" 
              element={
                <AdminProtectedRoute>
                  <AdminSalesBreakeven />
                </AdminProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/pos" replace />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

// Protected route component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('jwtToken');
  const storeId = localStorage.getItem('storeId');
  const userId = localStorage.getItem('userId');
  
  if (!token || !storeId || !userId) {
    console.log('Missing auth:', { token: !!token, storeId, userId });
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Protect admin routes
function AdminProtectedRoute({ children }) {
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    return <Navigate to="/admin" />;
  }
  return children;
}

export default App; 