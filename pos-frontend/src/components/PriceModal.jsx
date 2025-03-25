import React, { useState } from 'react';

function PriceModal({ product, onSubmit, onClose }) {
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  if (!product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ price, description, product });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '400px',
        padding: '24px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid hsl(240 5.9% 90%)'
      }}>
        <h2 style={{
          margin: '0 0 20px 0',
          fontSize: '16px',
          fontWeight: '600',
          color: 'hsl(222.2 47.4% 11.2%)',
          fontFamily: 'system-ui'
        }}>
          Set Price for {product.Product}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: 'hsl(222.2 47.4% 11.2%)',
              marginBottom: '8px',
              fontFamily: 'system-ui'
            }}>
              Price (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid hsl(240 5.9% 90%)',
                borderRadius: '6px',
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: 'system-ui'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: 'hsl(222.2 47.4% 11.2%)',
              marginBottom: '8px',
              fontFamily: 'system-ui'
            }}>
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid hsl(240 5.9% 90%)',
                borderRadius: '6px',
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: 'system-ui'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: 'transparent',
                color: 'hsl(215.4 16.3% 46.9%)',
                border: '1px solid hsl(240 5.9% 90%)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'system-ui'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: 'hsl(222.2 47.4% 11.2%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'system-ui'
              }}
            >
              Add to Cart
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PriceModal; 