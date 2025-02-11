import React from 'react';
import { Typography } from '@mui/material';

function Cart({ items, removeFromCart, checkout }) {
  const total = items.reduce((sum, item) => sum + parseFloat(item.price), 0);

  return (
    <div className="cart" style={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '30px',
      backgroundColor: 'white'
    }}>
      <h2 style={{
        fontSize: '24px',
        marginBottom: '25px',
        color: '#333'
      }}>Current Sale</h2>
      
      {/* Items List */}
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        marginBottom: '30px'
      }}>
        {items.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="body1">
              {item.customName || item.product.Product}
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                €{item.price}
              </Typography>
              <button 
                onClick={() => removeFromCart(index)} 
                style={{ 
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total and Checkout */}
      <div style={{ 
        borderTop: '2px solid #eee',
        paddingTop: '25px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '25px',
          fontSize: '28px'
        }}>
          <strong>Total</strong>
          <span>${total.toFixed(2)}</span>
        </div>
        <button 
          onClick={checkout}
          disabled={items.length === 0}
          style={{ 
            width: '100%',
            padding: '20px',
            fontSize: '20px',
            fontWeight: '500',
            backgroundColor: items.length ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: items.length ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s'
          }}
        >
          Complete Sale
        </button>
      </div>
    </div>
  );
}

export default Cart; 