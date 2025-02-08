import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ProductList from './components/ProductList';

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
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App; 