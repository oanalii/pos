import React, { useState } from 'react';

function PriceModal({ product, onSubmit, onClose }) {
  const [step, setStep] = useState('price'); // 'price' or 'description'
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  if (!product) return null;

  const handleNumberClick = (num) => {
    setAmount(prev => {
      if (prev === '' && num === '0') return prev;
      return prev + num;
    });
  };

  const handleClear = () => {
    setAmount('');
  };

  const handleNextStep = () => {
    setStep('description');
  };

  const handleSubmit = () => {
    const decimalAmount = (parseInt(amount || '0') / 100).toFixed(2);
    console.log('Submitting from PriceModal:', {
      price: decimalAmount,
      description,
      product
    });
    onSubmit({
      price: decimalAmount,
      description,
      product
    });
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

        {step === 'price' ? (
          <>
            {/* Amount Display */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '16px',
              borderRadius: '16px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '28px', fontWeight: '500' }}>
                €{displayAmount}
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
                onClick={handleNextStep}
                disabled={!amount}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid #059669',
                  borderRadius: '16px',
                  backgroundColor: amount ? 'rgba(167, 243, 208, 0.5)' : '#f0f0f0',
                  color: amount ? '#059669' : '#999',
                  cursor: amount ? 'pointer' : 'not-allowed',
                  fontWeight: '500'
                }}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Description Input */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product details (e.g., iPhone 14 Pro Max 256GB)"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '16px',
                border: '2px solid #e5e7eb',
                marginBottom: '16px',
                minHeight: '100px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />

            {/* Action Buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px'
            }}>
              <button
                onClick={() => setStep('price')}
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
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!description}
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid #059669',
                  borderRadius: '16px',
                  backgroundColor: description ? 'rgba(167, 243, 208, 0.5)' : '#f0f0f0',
                  color: description ? '#059669' : '#999',
                  cursor: description ? 'pointer' : 'not-allowed',
                  fontWeight: '500'
                }}
              >
                Add to Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PriceModal; 