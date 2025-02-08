import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ProductList from './components/ProductList';
import SalesDashboard from './components/SalesDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/pos" element={<ProductList />} />
        <Route path="/pos/sales" element={<SalesDashboard />} />
        <Route path="*" element={<Navigate to="/pos" />} />
      </Routes>
    </Router>
  );
}

export default App; 