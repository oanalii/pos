import React, { useState, useEffect } from 'react';

function Cart({ items, removeFromCart, checkout }) {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  const total = items.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

  useEffect(() => {
    if (paymentMethod) {
      setPaymentAmount(total.toFixed(2));
      setAmountError('');
    } else {
      setPaymentAmount('');
    }
  }, [paymentMethod, total]);

  useEffect(() => {
    if (paymentMethod) {
       setPaymentAmount(total.toFixed(2));
       setAmountError(''); 
    }
  }, [items, paymentMethod, total]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setPaymentAmount(value);
      setAmountError('');
    }
  };
  
  const validateAmount = () => {
      const numericAmount = parseFloat(paymentAmount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
          setAmountError('Please enter a valid positive amount.');
          return false;
      }
      setAmountError('');
      return true;
  }

  const handleCheckoutClick = () => {
    if (!paymentMethod) {
      alert("Please select a payment method (Cash or Card).");
      return;
    }
    if (!validateAmount()) {
        return; 
    }

    checkout(paymentMethod, parseFloat(paymentAmount)); 
  };

  return (
    <div style={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      backgroundColor: 'hsl(0 0% 100%)',
      fontFamily: 'system-ui'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: 'hsl(222.2 47.4% 11.2%)',
          margin: 0,
          fontFamily: 'system-ui'
        }}>Current Sale</h2>
        <span style={{
          fontSize: '13px',
          color: 'hsl(215.4 16.3% 46.9%)',
          fontFamily: 'system-ui'
        }}>{items.length} items</span>
      </div>
      
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        marginBottom: '24px'
      }}>
        {items.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
            padding: '12px',
            backgroundColor: 'hsl(0 0% 100%)',
            borderRadius: '6px',
            border: '1px solid hsl(240 5.9% 90%)'
          }}>
            <div style={{ flex: 1 }}>
              <span style={{ 
                fontSize: '14px',
                fontWeight: '500',
                color: 'hsl(222.2 47.4% 11.2%)',
                display: 'block',
                marginBottom: '2px',
                fontFamily: 'system-ui'
              }}>
                {item.product.Product}
              </span>
              {item.description && (
                <span style={{ 
                  fontSize: '13px', 
                  color: 'hsl(215.4 16.3% 46.9%)',
                  fontFamily: 'system-ui'
                }}>
                  {item.description}
                </span>
              )}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ 
                fontSize: '14px',
                fontWeight: '500',
                color: 'hsl(222.2 47.4% 11.2%)',
                fontFamily: 'system-ui'
              }}>
                €{parseFloat(item.price || 0).toFixed(2)}
              </span>
              <button 
                onClick={() => removeFromCart(index)}
                style={{ 
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid hsl(240 5.9% 90%)',
                  borderRadius: '4px',
                  backgroundColor: 'transparent',
                  color: 'hsl(215.4 16.3% 46.9%)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '16px'
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        borderTop: '1px solid hsl(240 5.9% 90%)',
        paddingTop: '20px'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            color: 'hsl(215.4 16.3% 46.9%)', 
            marginBottom: '12px' 
          }}>
            Select Payment Method:
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setPaymentMethod('cash')}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid',
                borderColor: paymentMethod === 'cash' ? 'hsl(221.2 83.2% 53.3%)' : 'hsl(240 5.9% 90%)',
                backgroundColor: paymentMethod === 'cash' ? 'hsl(221.2 83.2% 95%)' : 'white',
                color: paymentMethod === 'cash' ? 'hsl(221.2 83.2% 53.3%)' : 'hsl(222.2 47.4% 11.2%)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Cash
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid',
                borderColor: paymentMethod === 'card' ? 'hsl(221.2 83.2% 53.3%)' : 'hsl(240 5.9% 90%)',
                backgroundColor: paymentMethod === 'card' ? 'hsl(221.2 83.2% 95%)' : 'white',
                color: paymentMethod === 'card' ? 'hsl(221.2 83.2% 53.3%)' : 'hsl(222.2 47.4% 11.2%)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Card
            </button>
          </div>
        </div>

        {paymentMethod && (
          <div style={{ marginBottom: '16px' }}>
             <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'hsl(222.2 47.4% 11.2%)',
                marginBottom: '8px',
                fontFamily: 'system-ui'
             }}>
                Amount Paid ({paymentMethod === 'cash' ? 'Cash' : 'Card'}) (€)
             </label>
             <input
                type="text"
                inputMode="decimal"
                value={paymentAmount}
                onChange={handleAmountChange}
                onBlur={validateAmount}
                placeholder={total.toFixed(2)}
                style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '14px',
                    border: `1px solid ${amountError ? 'hsl(0 84.2% 60.2%)' : 'hsl(240 5.9% 90%)'}`,
                    borderRadius: '6px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'system-ui'
                }}
             />
             {amountError && (
                 <p style={{ color: 'hsl(0 84.2% 60.2%)', fontSize: '12px', marginTop: '4px' }}>
                     {amountError}
                 </p>
             )}
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'hsl(222.2 47.4% 11.2%)',
            fontFamily: 'system-ui'
          }}>Total</span>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'hsl(222.2 47.4% 11.2%)',
            fontFamily: 'system-ui'
          }}>€{total.toFixed(2)}</span>
        </div>
        <button 
          onClick={handleCheckoutClick}
          disabled={items.length === 0 || !paymentMethod || !paymentAmount || parseFloat(paymentAmount) <= 0 || !!amountError}
          style={{ 
            width: '100%',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: (items.length === 0 || !paymentMethod || !paymentAmount || parseFloat(paymentAmount) <= 0 || !!amountError) ? 'hsl(210 40% 80%)' : 'hsl(221.2 83.2% 53.3%)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: (items.length === 0 || !paymentMethod || !paymentAmount || parseFloat(paymentAmount) <= 0 || !!amountError) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'system-ui'
          }}
        >
          Complete Sale
        </button>
      </div>
    </div>
  );
}

export default Cart; 