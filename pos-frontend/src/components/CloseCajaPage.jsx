import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const STARTING_FLOAT = 150;

const CloseCajaPage = () => {
  const navigate = useNavigate();
  const storeId = localStorage.getItem('storeId');
  const storeName = localStorage.getItem('storeName');

  // Data fetching states
  const [salesData, setSalesData] = useState({ cash: 0, card: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form input states
  const [cardSalesVerified, setCardSalesVerified] = useState(null);
  const [drawerAmountVerified, setDrawerAmountVerified] = useState(null);
  const [actualCashInCaja, setActualCashInCaja] = useState('');
  const [expenses, setExpenses] = useState([{ concept: '', description: '', price: '' }]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchTodaySales = async () => {
      setLoading(true);
      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const response = await API.get('/api/sales', {
          params: {
            'filters[store][id][$eq]': storeId,
            'filters[Time][$gte]': todayStart.toISOString(),
          },
        });

        const todaySales = response.data?.data || [];
        const cashTotal = todaySales
          .filter(s => s.paymentmethod?.toLowerCase() === 'cash')
          .reduce((sum, s) => sum + (parseFloat(s.Price) || 0), 0);
        const cardTotal = todaySales
          .filter(s => s.paymentmethod?.toLowerCase() === 'card')
          .reduce((sum, s) => sum + (parseFloat(s.Price) || 0), 0);
        
        setSalesData({ cash: cashTotal, card: cardTotal });
      } catch (err) {
        setError('Failed to fetch sales data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchTodaySales();
    } else {
      setError('No store ID found. Please log in again.');
      setLoading(false);
    }
  }, [storeId]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((total, exp) => total + (parseFloat(exp.price) || 0), 0);
  }, [expenses]);

  const expectedCashInCaja = useMemo(() => {
    return salesData.cash + STARTING_FLOAT - totalExpenses;
  }, [salesData.cash, totalExpenses]);

  const handleAddExpense = () => {
    setExpenses([...expenses, { concept: '', description: '', price: '' }]);
  };

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };
  
  const handleRemoveExpense = (index) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
  }

  const handleFinishVerification = async () => {
    const finalData = {
      store: parseInt(storeId),
      totalSales: salesData.cash + salesData.card,
      cashSales: salesData.cash,
      cardSales: salesData.card,
      cardSalesVerified,
      startingFloat: STARTING_FLOAT,
      expenses,
      totalExpenses,
      totalExpectedInDrawer: expectedCashInCaja,
      drawerAmountVerified,
      actualAmountInDrawer: drawerAmountVerified ? expectedCashInCaja : parseFloat(actualCashInCaja) || 0,
      notes,
    };
    
    // Basic validation
    if (cardSalesVerified === null || drawerAmountVerified === null) {
      alert('Please verify both card sales and cash in the drawer.');
      return;
    }
    if (drawerAmountVerified === false && actualCashInCaja === '') {
      alert('If the amount in the drawer is incorrect, please enter the actual amount found.');
      return;
    }

    try {
      await API.post('/api/counter-closures/custom-create', { data: finalData });
      
      alert('Counter closure has been saved successfully!');
      navigate('/pos');

    } catch (error) {
      console.error('Failed to save counter closure:', error);
      alert('Error: Could not save the counter closure. Please try again.');
    }
  };

  if (loading) return <div style={styles.container}><p>Loading daily sales data...</p></div>;
  if (error) return <div style={styles.container}><p style={{color: 'red'}}>{error}</p></div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.h1}>Close Counter</h1>
            <p style={styles.p}>Verify daily sales and expenses for {storeName || `Store ${storeId}`}</p>
          </div>
          <button onClick={() => navigate('/pos')} style={styles.backButton}>Back to POS</button>
        </header>
        
        <main style={styles.main}>
          {/* --- LEFT COLUMN --- */}
          <div style={styles.column}>
            {/* Total Sales Widget */}
            <section style={styles.widget}>
              <h2 style={styles.h2}>Total Sales</h2>
              <div style={styles.salesGrid}>
                <div style={styles.subWidget}>
                  <h3 style={styles.h3}>Total Cash Sales</h3>
                  <p style={styles.bigNumber}>€{salesData.cash.toFixed(2)}</p>
                </div>
                <div style={styles.subWidget}>
                  <h3 style={styles.h3}>Total Card Sales</h3>
                  <p style={styles.bigNumber}>€{salesData.card.toFixed(2)}</p>
                  <div style={styles.verificationContainer}>
                    <label style={styles.label}>Is this correct?</label>
                    <div style={styles.buttonGroup}>
                      <button onClick={() => setCardSalesVerified(true)} style={cardSalesVerified === true ? styles.yesButtonSelected : styles.yesButton}>Yes</button>
                      <button onClick={() => setCardSalesVerified(false)} style={cardSalesVerified === false ? styles.noButtonSelected : styles.noButton}>No</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Verification Widget */}
            <section style={styles.widget}>
              <h2 style={styles.h2}>Verification</h2>
              <div style={{...styles.subWidget, background: '#fff'}}>
                <h3 style={styles.h3}>Total Expected Cash in Caja</h3>
                <div style={styles.calculation}>
                  <div style={styles.calcRow}><span>Cash Sales</span><span>€{salesData.cash.toFixed(2)}</span></div>
                  <div style={styles.calcRow}><span>- Expenses</span><span>€{totalExpenses.toFixed(2)}</span></div>
                  <div style={styles.calcRow}><span>+ Starting Float</span><span>€{STARTING_FLOAT.toFixed(2)}</span></div>
                  <hr style={styles.hr} />
                  <div style={styles.calcRow}>
                    <strong style={{fontSize: '16px'}}>Total Expected</strong>
                    <strong style={styles.bigNumber}>€{expectedCashInCaja.toFixed(2)}</strong>
                  </div>
                </div>
                <div style={styles.verificationContainer}>
                  <label style={styles.label}>Is this amount in the drawer?</label>
                    <div style={styles.buttonGroup}>
                      <button onClick={() => { setDrawerAmountVerified(true); setActualCashInCaja(''); }} style={drawerAmountVerified === true ? styles.yesButtonSelected : styles.yesButton}>Yes</button>
                      <button onClick={() => setDrawerAmountVerified(false)} style={drawerAmountVerified === false ? styles.noButtonSelected : styles.noButton}>No</button>
                    </div>
                </div>
                {drawerAmountVerified === false && (
                  <div style={{...styles.verificationContainer, marginTop: '20px'}}>
                    <label style={styles.label}>How much is there?</label>
                    <input 
                      type="number" 
                      value={actualCashInCaja}
                      onChange={e => setActualCashInCaja(e.target.value)}
                      placeholder="e.g., 245.50" 
                      style={{...styles.input, width: '100%', textAlign: 'right', fontSize: '16px', padding: '12px'}}
                    />
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div style={styles.column}>
            {/* Expenses Widget */}
            <section style={styles.widget}>
              <div style={styles.widgetTitleContainer}>
                <h2 style={styles.h2}>Expenses</h2>
                <button onClick={handleAddExpense} style={styles.addButton}>+ Add Expense</button>
              </div>
              <div style={styles.expenseHeader}>
                <div style={{flex: 2}}>Concept</div>
                <div style={{flex: 3}}>Description</div>
                <div style={{flex: 1, textAlign: 'right'}}>Price (€)</div>
                <div style={{width: '40px'}}></div>
              </div>
              {expenses.map((exp, index) => (
                <div key={index} style={styles.expenseRow}>
                  <input type="text" placeholder="e.g., Water Bottle" value={exp.concept} onChange={e => handleExpenseChange(index, 'concept', e.target.value)} style={{...styles.input, flex: 2}} />
                  <input type="text" placeholder="Details" value={exp.description} onChange={e => handleExpenseChange(index, 'description', e.target.value)} style={{...styles.input, flex: 3}} />
                  <input type="number" placeholder="0.00" value={exp.price} onChange={e => handleExpenseChange(index, 'price', e.target.value)} style={{...styles.input, flex: 1, textAlign: 'right'}}/>
                  <button onClick={() => handleRemoveExpense(index)} style={styles.removeButton}>×</button>
                </div>
              ))}
            </section>
            
            {/* Notes Widget */}
            <section style={styles.widget}>
              <h2 style={styles.h2}>Notes</h2>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} style={styles.textarea} placeholder="Add any relevant notes for the day..."></textarea>
            </section>
          </div>
        </main>

        <footer style={styles.footer}>
          <button onClick={handleFinishVerification} style={styles.finishButton}>Finish Verification</button>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: 'hsl(210 40% 98%)', minHeight: '100vh' },
  container: { padding: '24px', maxWidth: '1300px', margin: '0 auto', fontFamily: 'system-ui' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  h1: { fontSize: '22px', fontWeight: '700', color: 'hsl(222.2 47.4% 11.2%)', margin: 0 },
  p: { color: 'hsl(215.4 16.3% 46.9%)', margin: '4px 0 0 0', fontSize: '14px' },
  backButton: { padding: '8px 14px', border: '1px solid hsl(240 5.9% 90%)', borderRadius: '6px', cursor: 'pointer', backgroundColor: 'white', fontWeight: 500 },
  main: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' },
  column: { display: 'flex', flexDirection: 'column', gap: '24px' },
  widget: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid hsl(240 5.9% 90%)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  widgetTitleContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  h2: { fontSize: '16px', fontWeight: '600', color: 'hsl(222.2 47.4% 11.2%)', margin: 0 },
  salesGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' },
  subWidget: { padding: '16px', backgroundColor: 'hsl(210 40% 98%)', borderRadius: '8px' },
  h3: { fontSize: '13px', fontWeight: '500', color: 'hsl(215.4 16.3% 46.9%)', margin: '0 0 8px 0' },
  bigNumber: { fontSize: '24px', fontWeight: '700', color: 'hsl(222.2 47.4% 11.2%)', margin: 0 },
  verificationContainer: { marginTop: '16px' },
  label: { fontSize: '14px', color: 'hsl(215.4 16.3% 46.9%)', display: 'block', marginBottom: '8px' },
  buttonGroup: { display: 'flex', gap: '8px' },
  yesButton: { flex: 1, padding: '10px', border: '1px solid hsl(240 5.9% 90%)', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px' },
  noButton: { flex: 1, padding: '10px', border: '1px solid hsl(240 5.9% 90%)', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px' },
  yesButtonSelected: { flex: 1, padding: '10px', border: '1px solid hsl(142.1 76.2% 36.3%)', borderRadius: '6px', backgroundColor: 'hsl(142.1 76.2% 95%)', cursor: 'pointer', fontSize: '14px', color: 'hsl(142.1 76.2% 36.3%)', fontWeight: 600 },
  noButtonSelected: { flex: 1, padding: '10px', border: '1px solid hsl(3.4 95.8% 60.2%)', borderRadius: '6px', backgroundColor: 'hsl(3.4 95.8% 95%)', cursor: 'pointer', fontSize: '14px', color: 'hsl(3.4 95.8% 60.2%)', fontWeight: 600 },
  calculation: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', fontSize: '14px' },
  calcRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  hr: { border: 'none', borderTop: '1px solid hsl(240 5.9% 90%)', margin: '8px 0' },
  addButton: { padding: '8px 12px', border: 'none', borderRadius: '6px', backgroundColor: 'hsl(221.2 83.2% 53.3%)', color: 'white', cursor: 'pointer', fontWeight: 500 },
  expenseHeader: { display: 'flex', gap: '16px', fontWeight: 600, color: 'hsl(215.4 16.3% 46.9%)', paddingBottom: '8px', marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  expenseRow: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' },
  input: { padding: '8px 10px', border: '1px solid hsl(240 5.9% 90%)', borderRadius: '6px', fontSize: '14px', width: '100%' },
  removeButton: { width: '34px', height: '34px', border: '1px solid hsl(240 5.9% 90%)', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer', color: 'hsl(3.4 95.8% 60.2%)', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  textarea: { width: '100%', minHeight: '80px', padding: '10px 12px', border: '1px solid hsl(240 5.9% 90%)', borderRadius: '6px', marginTop: '12px', fontSize: '14px' },
  footer: { display: 'flex', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid hsl(240 5.9% 90%)', paddingTop: '20px' },
  finishButton: { padding: '10px 20px', border: 'none', borderRadius: '8px', backgroundColor: 'hsl(142.1 76.2% 36.3%)', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '16px' },
};

export default CloseCajaPage; 