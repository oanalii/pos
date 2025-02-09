import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ProductBlock from './ProductBlock';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';
import SuccessModal from './SuccessModal';

const ID_MAP = {
  'Phone': 1,
  'Laptop': 3,
  'Funda': 5,
  'Charger': 7,
  'Figura': 9
};

function ProductList() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/api/products?populate=*');
        console.log('Raw product data from API:', response.data.data);

        // Map products to have correct IDs
        const correctedProducts = response.data.data.map(product => ({
          ...product,
          id: ID_MAP[product.Product] // Use the correct ID from our mapping
        }));

        console.log('Products with corrected IDs:', correctedProducts);
        setProducts(correctedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product, price) => {
    console.log('Adding to cart:', {
      productName: product.Product,
      correctId: ID_MAP[product.Product],
      price
    });
    setCartItems([...cartItems, { product, price }]);
  };

  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleCheckout = async () => {
    try {
      console.log('=== STARTING CHECKOUT ===');
      console.log('Cart items:', cartItems);

      for (const item of cartItems) {
        const saleData = {
          Price: parseFloat(item.price),
          Time: new Date().toISOString(),
          store: parseInt(localStorage.getItem('storeId')),
          product: item.product.id  // Make sure we're sending the product ID
        };

        console.log('=== CREATING SALE ===');
        console.log('Sale data:', saleData);

        const response = await API.post('/api/sales/create-with-relation', {
          data: saleData
        });

        console.log('=== SALE RESPONSE ===');
        console.log('Status:', response.status);
        console.log('Response data:', response.data);
      }

      setCartItems([]);
      navigate('/sales');
    } catch (error) {
      console.error('=== CHECKOUT ERROR ===');
      console.error('Error:', error);
      console.error('Response:', error.response?.data);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden'
    }}>
      {/* Navigation buttons at the top */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          onClick={() => {
            console.log('Navigating to sales, token:', localStorage.getItem('jwtToken'));
            navigate('/pos/sales');
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ver Historial de Ventas
        </button>
      </div>

      {/* Products Section - Left 50% */}
      <div style={{ 
        width: '50%',
        padding: '30px',
        overflowY: 'auto',
        borderRight: '2px solid #eee',
        backgroundColor: '#f8f9fa'
      }}>
        <h2 style={{
          fontSize: '24px',
          marginBottom: '25px',
          color: '#333'
        }}>Products</h2>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          padding: '10px'
        }}>
          {products.map((product) => (
            <ProductBlock 
              key={product.id} 
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>

      {/* Cart Section - Right 50% */}
      <div style={{ 
        width: '50%',
        height: '100%'
      }}>
        <Cart 
          items={cartItems} 
          removeFromCart={removeFromCart}
          checkout={handleCheckout}
        />
      </div>

      {/* Add Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          items={cartItems}
          total={cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0)}
          onClose={() => {
            setShowSuccessModal(false);
            setCartItems([]); // Clear cart after modal is closed
          }}
        />
      )}
    </div>
  );
}

export default ProductList; 