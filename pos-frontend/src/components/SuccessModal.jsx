import React from 'react';
import { generateInvoice } from '../utils/invoice';

function SuccessModal({ items, total, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        width: '400px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#4CAF50', marginBottom: '20px' }}>
          Order Completed Successfully!
        </h2>
        
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => generateInvoice(items, total)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '15px',
              width: '100%'
            }}
          >
            Print Invoice
          </button>
          
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal; 