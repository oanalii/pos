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
        borderRadius: '24px',
        padding: '20px',
        width: '90%',
        maxWidth: '360px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
      }}>
        {/* Product Name */}
        <h2 style={{ 
          textAlign: 'center', 
          margin: '0 0 16px 0',
          fontSize: '20px',
          color: '#333'
        }}>
          {product.Product}
        </h2>

        {/* Amount Display */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '16px',
          borderRadius: '16px',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '28px', fontWeight: '500' }}>
            ${displayAmount}
          </span>
        </div>

        {/* Number Pad */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '16px'
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              style={{
                padding: '14px',
                fontSize: '18px',
                border: 'none',
                borderRadius: '16px',
                backgroundColor: '#f0f0f0',
                cursor: 'pointer'
              }}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            style={{
              padding: '14px',
              fontSize: '16px',
              border: '2px solid #dc2626',
              borderRadius: '16px',
              backgroundColor: 'rgba(254, 226, 226, 0.5)',
              color: '#dc2626',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Clear
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            style={{
              padding: '14px',
              fontSize: '18px',
              border: 'none',
              borderRadius: '16px',
              backgroundColor: '#f0f0f0',
              cursor: 'pointer'
            }}
          >
            0
          </button>
          <button
            onClick={() => handleNumberClick('00')}
            style={{
              padding: '14px',
              fontSize: '18px',
              border: 'none',
              borderRadius: '16px',
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
          gap: '8px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #dc2626',
              borderRadius: '16px',
              backgroundColor: 'rgba(254, 226, 226, 0.5)',
              color: '#dc2626',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #059669',
              borderRadius: '16px',
              backgroundColor: 'rgba(167, 243, 208, 0.5)',
              color: '#059669',
              cursor: 'pointer',
              fontWeight: '500'
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