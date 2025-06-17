import React, { useState, useEffect } from 'react';
import API from '../services/api';

const CloseCounterModal = ({ open, onClose }) => {
  const [todayStats, setTodayStats] = useState({ cash: 0, card: 0 });
  const [countedCash, setCountedCash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const storeId = localStorage.getItem('storeId');

  useEffect(() => {
    if (open) {
      const fetchTodaySales = async () => {
        setLoading(true);
        try {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);

          const response = await API.get('/api/sales', {
            params: {
              'filters[store][id][$eq]': storeId,
              'filters[Time][$gte]': todayStart.toISOString(),
            }
          });

          const todaySales = response.data?.data || [];
          
          const cashTotal = todaySales
            .filter(sale => sale.paymentmethod?.toLowerCase() === 'cash')
            .reduce((sum, sale) => sum + (parseFloat(sale.Price) || 0), 0);
            
          const cardTotal = todaySales
            .filter(sale => sale.paymentmethod?.toLowerCase() === 'card')
            .reduce((sum, sale) => sum + (parseFloat(sale.Price) || 0), 0);

          setTodayStats({ cash: cashTotal, card: cardTotal });

        } catch (err) {
          setError('Failed to fetch sales data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchTodaySales();
    }
  }, [open, storeId]);

  const handleCloseCounter = async () => {
    if (countedCash === '' || isNaN(parseFloat(countedCash))) {
      setError('Please enter a valid amount for counted cash.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const payload = {
        storeId: parseInt(storeId, 10),
        expectedCash: todayStats.cash,
        countedCash: parseFloat(countedCash),
        expectedCard: todayStats.card,
      };

      await API.post('/api/counter-closures/custom-create', { data: payload });

      // Optionally, you can add a success message here
      onClose(); // Close modal on success

    } catch (err) {
      setError('Failed to save counter closure. Please try again.');
      console.error('Error saving counter closure:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const discrepancy = countedCash ? parseFloat(countedCash) - todayStats.cash : 0;

  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.header}>Close Caja</h2>
        
        {loading && <p>Loading sales data...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {!loading && !error && (
          <>
            <div style={styles.statRow}>
              <span>Expected Cash Sales:</span>
              <span style={styles.statValue}>€{todayStats.cash.toFixed(2)}</span>
            </div>
            <div style={styles.statRow}>
              <span>Expected Card Sales:</span>
              <span style={styles.statValue}>€{todayStats.card.toFixed(2)}</span>
            </div>
            <hr style={styles.hr} />
            <div style={styles.statRow}>
              <strong>Total Expected Revenue:</strong>
              <strong style={styles.statValue}>€{(todayStats.cash + todayStats.card).toFixed(2)}</strong>
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="countedCash" style={styles.label}>Counted Cash Amount:</label>
              <input
                type="number"
                id="countedCash"
                value={countedCash}
                onChange={(e) => setCountedCash(e.target.value)}
                style={styles.input}
                placeholder="e.g., 543.21"
              />
            </div>

            {countedCash && (
              <div style={styles.statRow}>
                <span>Discrepancy:</span>
                <span style={{...styles.statValue, color: discrepancy === 0 ? 'green' : 'red' }}>
                  {discrepancy.toFixed(2)}€
                </span>
              </div>
            )}

            <div style={styles.buttonGroup}>
              <button onClick={onClose} style={styles.cancelButton}>Cancel</button>
              <button onClick={handleCloseCounter} style={styles.confirmButton}>Confirm & Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    fontFamily: 'system-ui'
  },
  header: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 16px 0',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
  },
  statValue: {
    fontWeight: '500'
  },
  hr: {
    border: 'none',
    borderTop: '1px solid #E5E7EB',
    margin: '16px 0'
  },
  inputGroup: {
    margin: '24px 0'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #D1D5DB',
    fontSize: '14px'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px'
  },
  cancelButton: {
    padding: '10px 16px',
    borderRadius: '6px',
    border: '1px solid #D1D5DB',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  confirmButton: {
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#2563EB',
    color: 'white',
    cursor: 'pointer'
  }
};

export default CloseCounterModal; 