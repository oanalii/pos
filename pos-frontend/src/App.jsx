import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ProductList from './components/ProductList';
import SalesDashboard from './components/SalesDashboard';

function App() {
  const isAuthenticated = !!localStorage.getItem('jwtToken');

  return (
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
  );
}

export default App; 