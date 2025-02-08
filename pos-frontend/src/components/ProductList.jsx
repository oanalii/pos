import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ProductBlock from './ProductBlock';
import Cart from './Cart';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        console.log('Using token:', token);

        const response = await API.get('/api/products');
        console.log('Full API Response:', JSON.stringify(response.data, null, 2));
        
        if (!response.data.data || response.data.data.length === 0) {
          console.error('No products found in response');
          return;
        }

        setProducts(response.data.data);
      } catch (error) {
        console.error('Error details:', error.response?.data);
        console.error('Full error:', error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product, price) => {
    setCartItems([...cartItems, { product, price }]);
  };

  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleCheckout = async () => {
    try {
      const salePromises = cartItems.map(item => {
        const saleData = {
          data: {
            product: item.product.id,
            store: parseInt(localStorage.getItem('storeId')),
            Price: parseFloat(item.price),
            Time: new Date().toISOString()
          }
        };
        console.log('Creating sale with data:', saleData);
        return API.post('/api/sales', saleData);
      });

      const responses = await Promise.all(salePromises);
      console.log('Sale responses:', responses);
      alert('Sales recorded successfully!');
      setCartItems([]);
    } catch (error) {
      console.error('Checkout error:', error);
      console.error('Error response:', error.response?.data);
      alert('Error processing checkout');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden'
    }}>
      {/* Products Section - Left 50% */}
      <div style={{ 
        width: '50%',
        padding: '30px',  // More padding
        overflowY: 'auto',
        borderRight: '2px solid #eee',  // Thicker border
        backgroundColor: '#f8f9fa'  // Light background
      }}>
        <h2 style={{
          fontSize: '24px',
          marginBottom: '25px',
          color: '#333'
        }}>Products</h2>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',  // Wider blocks
          gap: '20px',  // More space between blocks
          padding: '10px'  // Padding for the grid
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
    </div>
  );
}

export default ProductList; 