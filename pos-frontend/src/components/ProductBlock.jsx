import React, { useState } from 'react';
import PriceModal from './PriceModal';

function ProductBlock({ product, onAddToCart }) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleSubmit = (price) => {
    onAddToCart(product, price);
  };

  return (
    <>
      <div 
        onClick={handleClick}
        style={{ 
          height: '180px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
          padding: '20px',
          justifyContent: 'center',
          alignItems: 'center',
          ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }
        }}
      >
        <span style={{ 
          fontSize: '20px',
          fontWeight: '500'
        }}>
          {product.Product}
        </span>
      </div>

      {showModal && (
        <PriceModal
          product={product}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default ProductBlock; 