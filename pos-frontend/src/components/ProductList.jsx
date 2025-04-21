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
  'Voda SIM': 11,
  'Protector': 13,
  'Hydrogel Protector': 15,
  'Cordón': 17,
  'BT Headphones': 19,
  'BT Speaker': 21,
  'Souvenir': 23,
  'Headphones': 25,
  'Cable': 27,
  'Cargador Set': 29,
  'Power Bank': 31,
  'Recarga': 33,
  'Print': 35,
  'Adapter': 37,
  'Gafas': 39,
  'Repair': 41,
  'Data transfer': 43,
  'Smartwatch': 45,
  'Orange SIM': 47,
  'Raton': 49,
  'Watch Strap': 51,
  'USB Drive': 53,
  'Drink': 55,
  'Umbrella': 57,
  'Car Phone Mount': 59,
  'Shave Machine': 61,
  'Funda headphone': 63,
  'iPad': 65,
  'iPad funda': 67,
  'Macbook protector': 69,
  'Anime shirt': 71,
  'PC': 73,
  'Keyboard': 75,
  'Laptop (not MacBook)': 77,
  'iMac': 79,
  'Lyca SIM': 82,
  'Selfie Stick': 85,
  'OTG': 87,
  'Pilas': 89,
  'Soporte': 91,
  'SD Card': 93,
  'Dryer': 95,
  'Plancha': 97,
  'Mando': 99,
  'Trimmer': 101
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
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/api/products?pagination[pageSize]=100&populate=*');
        console.log('Raw product data from API:', response.data.data);

        const correctedProducts = response.data.data.map(product => ({
          ...product,
          id: ID_MAP[product.Product]
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

  const handleCheckout = async (paymentMethod, amountPaid) => {
    try {
      console.log('=== STARTING CHECKOUT ===');
      console.log('Payment Method Selected:', paymentMethod);
      console.log('Amount Paid:', amountPaid);
      
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
          paymentMethod: paymentMethod,
          paymentamount: amountPaid,
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

  const filteredProducts = products.filter(product => 
    product.Product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: 'hsl(0 0% 100%)',
      position: 'relative'
    }}>
      {/* Left side with header and products */}
      <div style={{ 
        width: '60%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Improved Header */}
        <div style={{
          padding: '20px 32px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: '32px',
          borderBottom: '1px solid hsl(240 5.9% 90%)',
          backgroundColor: 'hsl(0 0% 100%)',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
        }}>
          <h1 style={{
            fontSize: '22px',
            fontWeight: '600',
            color: 'hsl(222.2 47.4% 11.2%)',
            margin: 0,
            fontFamily: 'system-ui',
            letterSpacing: '-0.025em'
          }}>
            HGT POS
          </h1>

          {/* Centered search bar */}
          <div style={{
            position: 'relative',
            maxWidth: '400px',
            width: '100%',
            margin: '0 auto'
          }}>
            <svg 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'hsl(215.4 16.3% 46.9%)'
              }}
              width="15" 
              height="15" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 12px 10px 36px',
                width: '100%',
                borderRadius: '6px',
                border: '1px solid hsl(240 5.9% 90%)',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: 'system-ui',
                backgroundColor: 'hsl(0 0% 98%)',
                color: 'hsl(222.2 47.4% 11.2%)',
              }}
            />
          </div>

          {/* History button */}
          <button 
            onClick={() => navigate('/pos/sales')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(210 40% 98%)';
              e.currentTarget.style.borderColor = 'hsl(215.4 16.3% 46.9%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = 'hsl(240 5.9% 90%)';
            }}
            style={{
              padding: '10px 16px',
              backgroundColor: 'white',
              color: 'hsl(222.2 47.4% 11.2%)',
              border: '1px solid hsl(240 5.9% 90%)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'system-ui',
              whiteSpace: 'nowrap'
            }}
          >
            <svg 
              width="15" 
              height="15" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M3 3v18h18"/>
              <path d="m19 9-5 5-4-4-3 3"/>
            </svg>
            Sales History
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
            {filteredProducts.map((product) => (
              <ProductBlock 
                key={product.id} 
                product={product}
                onClick={handleProductClick}
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
      {selectedProduct && (
        <PriceModal
          open={true}
          onClose={() => setSelectedProduct(null)}
          onSubmit={handlePriceSubmit}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

export default ProductList; 