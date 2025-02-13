import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ProductBlock from './ProductBlock';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import PriceModal from './PriceModal';

const ID_MAP = {
  'Phone': 1,
  'Laptop': 3,
  'Funda': 5,
  'Charger': 7,
  'Figura': 9,
  'Custom': 11  // Add this new ID for custom products
};

// Modern color palette
const colors = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  primary: '#2563EB',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
  },
  border: '#E5E7EB',
  hover: '#F3F4F6'
};

function ProductList() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const handlePriceSubmit = ({ price, description, product }) => {
    setCartItems(prev => [...prev, {
      product,
      price,
      description
    }]);
    setSelectedProduct(null);
  };

  const handleCheckout = async () => {
    try {
      console.log('=== STARTING CHECKOUT ===');
      
      const rawStoreId = localStorage.getItem('storeId');
      console.log('Raw storeId from localStorage:', rawStoreId);
      
      const storeId = Number(rawStoreId);
      console.log('Converted storeId:', storeId);
      
      if (!storeId || isNaN(storeId)) {
        console.error('Invalid store ID:', storeId);
        alert('Error: No store ID found. Please log in again.');
        navigate('/login');
        return;
      }

      const orderGroupId = crypto.randomUUID();

      for (const item of cartItems) {
        const saleData = {
          Price: parseFloat(item.price),
          Time: new Date().toISOString(),
          store: storeId,
          product: item.product.id,
          Description: item.description,
          orderGroupId
        };

        console.log('Sending sale data:', saleData);

        await API.post('/api/sales/create-with-relation', {
          data: saleData
        });
      }

      setCartItems([]);
      
      // Show success message instead
      setShowSuccessModal(true);

    } catch (error) {
      console.error('=== CHECKOUT ERROR ===');
      console.error('Error:', error);
    }
  };

  const handlePrintInvoice = () => {
    setShowSuccessModal(false);
    navigate('/pos/sales');
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: colors.surface,
      position: 'relative'
    }}>
      {/* Left side with header and products */}
      <div style={{ 
        width: '60%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header - Replace the floating header with this */}
        <div style={{
          padding: '24px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${colors.border}`
        }}>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: colors.text.primary,
            margin: 0
          }}>
            POS System
          </h1>
          <button 
            onClick={() => navigate('/pos/sales')}
            style={{
              padding: '10px 16px',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              color: '#2563eb',
              border: '2px solid #2563eb',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              ':hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.15)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18"/>
              <path d="m19 9-5 5-4-4-3 3"/>
            </svg>
            View Sales History
          </button>
        </div>

        {/* Products Grid */}
        <div style={{ 
          flex: 1,
          overflowY: 'auto',
          padding: '24px 40px'
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '24px'
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
      </div>

      {/* Cart Section - Right side */}
      <div style={{ 
        width: '40%',
        height: '100%',
        backgroundColor: colors.surface,
        borderLeft: `1px solid ${colors.border}`,
        boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Cart 
          items={cartItems} 
          removeFromCart={removeFromCart}
          checkout={handleCheckout}
        />
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <DialogContent>
          <DialogContentText>
            Sale completed successfully!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuccessModal(false)}>
            Continue Selling
          </Button>
          <Button onClick={handlePrintInvoice} variant="contained" color="primary">
            Print Invoice
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add PriceModal */}
      <PriceModal
        open={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        onSubmit={handlePriceSubmit}
        product={selectedProduct}
      />
    </div>
  );
}

export default ProductList; 