import React, { useState } from 'react';
import PriceModal from './PriceModal';

function ProductBlock({ product, onAddToCart, onClick }) {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleSubmit = (price) => {
    onAddToCart(product, price);
  };

  if (!product) return null;

  return (
    <>
      <div 
        onClick={() => onClick(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          height: '140px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: isHovered 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          padding: '20px',
          justifyContent: 'center',
          alignItems: 'center',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }} />
        
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '500'
        }}>
          {product.Product}
        </h3>
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