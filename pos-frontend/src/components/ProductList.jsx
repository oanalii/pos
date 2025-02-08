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
      console.log('Starting checkout with cart items:', cartItems);

      const salePromises = cartItems.map(async item => {
        const correctId = ID_MAP[item.product.Product];
        
        const saleData = {
          data: {
            Price: parseFloat(item.price),
            Time: new Date().toISOString(),
            store: parseInt(localStorage.getItem('storeId')),
            product: correctId // Use the correct ID from our mapping
          }
        };

        console.log('Creating sale with product:', {
          productName: item.product.Product,
          correctId,
          price: item.price
        });

        const response = await API.post('/api/sales/create-with-relation', saleData);
        return response;
      });

      const responses = await Promise.all(salePromises);
      console.log('All sales completed:', responses.map(r => r.data));

      // Show success modal instead of alert
      setShowSuccessModal(true);
      
      // Don't clear cart until modal is closed
    } catch (error) {
      console.error('Checkout error:', error);
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
      {/* Add this button at the top */}
      <button 
        onClick={() => navigate('/pos/sales')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        View Sales History
      </button>

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