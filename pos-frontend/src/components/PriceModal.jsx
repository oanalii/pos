import React, { useState } from 'react';

function PriceModal({ product, onSubmit, onClose }) {
  const [amount, setAmount] = useState('');

  const handleNumberClick = (num) => {
    setAmount(prev => {
      if (prev === '' && num === '0') return prev;
      
      return prev + num;
    });
  };

  const handleClear = () => {
    setAmount('');
  };

  const handleSubmit = () => {
    const decimalAmount = (parseInt(amount || '0') / 100).toFixed(2);
    onSubmit(decimalAmount);
    onClose();
  };

  const displayAmount = amount 
    ? (parseInt(amount) / 100).toFixed(2)
    : '0.00';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
      }}>
        {/* Product Name */}
        <h2 style={{ 
          textAlign: 'center', 
          margin: '0 0 20px 0',
          fontSize: '24px',
          color: '#333'
        }}>
          {product.Product}
        </h2>

        {/* Amount Display */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '36px', fontWeight: '500' }}>
            ${displayAmount}
          </span>
        </div>

        {/* Number Pad */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              style={{
                padding: '20px',
                fontSize: '24px',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
                ':hover': {
                  backgroundColor: '#e0e0e0'
                }
              }}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            style={{
              padding: '20px',
              fontSize: '20px',
              border: 'none',
              borderRadius: '12px',
              backgroundColor: '#ffebee',
              color: '#d32f2f',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            style={{
              padding: '20px',
              fontSize: '24px',
              border: 'none',
              borderRadius: '12px',
              backgroundColor: '#f0f0f0',
              cursor: 'pointer'
            }}
          >
            0
          </button>
          <button
            onClick={() => handleNumberClick('00')}
            style={{
              padding: '20px',
              fontSize: '24px',
              border: 'none',
              borderRadius: '12px',
              backgroundColor: '#f0f0f0',
              cursor: 'pointer'
            }}
          >
            00
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '16px',
              fontSize: '18px',
              border: 'none',
              borderRadius: '12px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '16px',
              fontSize: '18px',
              border: 'none',
              borderRadius: '12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default PriceModal; 