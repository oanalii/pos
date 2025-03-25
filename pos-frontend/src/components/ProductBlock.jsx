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

  return (
    <>
      <div 
        onClick={() => onClick(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          height: '120px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: isHovered ? 'hsl(221.2 83.2% 53.3%)' : 'hsl(240 5.9% 90%)',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          padding: '16px',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: isHovered ? '0 2px 8px -2px rgba(0, 0, 0, 0.1)' : 'none'
        }}
      >
        <span style={{ 
          fontSize: '14px',
          fontWeight: '500',
          color: 'hsl(222.2 47.4% 11.2%)',
          textAlign: 'center',
          fontFamily: 'system-ui'
        }}>
          {product.Product}
        </span>
        
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          opacity: isHovered ? 1 : 0,
          transform: `translateY(${isHovered ? '0' : '4px'})`,
          transition: 'all 0.2s ease'
        }}>
          <span style={{
            fontSize: '13px',
            color: 'hsl(221.2 83.2% 53.3%)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'system-ui'
          }}>
            Set price
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
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