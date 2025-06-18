import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Sidebar from './Sidebar';

const AdminCajaClosures = () => {
  const [closures, setClosures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClosures = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        setLoading(true);
        const response = await API.get('/api/cajas', {
          params: {
            'populate': ['store'],
            'sort': 'createdAt:desc',
          },
        });
        setClosures(response.data.data);
      } catch (err) {
        setError('Failed to fetch caja closures.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClosures();
  }, [navigate]);
  
  const formatExpenses = (items) => {
    if (!items || items.length === 0) return 'N/A';
    return items.map(item => `${item.concept} (${item.price}€)`).join(', ');
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <Sidebar />
        <main style={styles.main}>
          <p>Loading closure data...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <Sidebar />
        <main style={styles.main}>
          <p style={{ color: 'red' }}>{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Sidebar />
      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.h1}>Caja Closures</h1>
          <p style={styles.p}>Daily counter closure history from all stores.</p>
        </div>
        
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Store</th>
                <th style={styles.th}>Total Sales</th>
                <th style={styles.th}>Card Sales</th>
                <th style={styles.th}>Cash Sales</th>
                <th style={styles.th}>Total Expenses</th>
                <th style={styles.th}>Expense Items</th>
                <th style={styles.th}>Total Expected</th>
                <th style={styles.th}>Total in Caja</th>
                <th style={styles.th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {closures.map(closure => (
                <tr key={closure.id} style={styles.tr}>
                  <td style={styles.td}>{new Date(closure.createdAt).toLocaleDateString('es-ES')}</td>
                  <td style={styles.td}>{closure.store?.Name || 'N/A'}</td>
                  <td style={styles.td}>€{closure.totalSales.toFixed(2)}</td>
                  <td style={styles.td}>{closure.cardSalesVerified ? '🟢' : '🔴'} €{closure.cardSales.toFixed(2)}</td>
                  <td style={styles.td}>{closure.drawerAmountVerified ? '🟢' : '🔴'} €{closure.cashSales.toFixed(2)}</td>
                  <td style={styles.td}>€{closure.totalExpenses.toFixed(2)}</td>
                  <td style={{...styles.td, maxWidth: '200px' }}>{formatExpenses(closure.expenses)}</td>
                  <td style={styles.td}>€{closure.totalExpectedInDrawer.toFixed(2)}</td>
                  <td style={{...styles.td, color: closure.drawerAmountVerified ? 'inherit' : 'hsl(0 84.2% 60.2%)', fontWeight: closure.drawerAmountVerified ? 'normal' : '600'}}>
                    €{closure.actualAmountInDrawer.toFixed(2)}
                  </td>
                  <td style={{...styles.td, maxWidth: '200px'}}>{closure.notes || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

const styles = {
  page: { display: 'flex', minHeight: '100vh', backgroundColor: 'hsl(0 0% 98%)' },
  main: { flex: 1, padding: '32px' },
  header: { marginBottom: '24px' },
  h1: { fontSize: '24px', fontWeight: '600', marginBottom: '4px', color: 'hsl(222.2 47.4% 11.2%)' },
  p: { color: 'hsl(215.4 16.3% 46.9%)', margin: 0, fontSize: '14px' },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid hsl(240 5.9% 90%)',
    overflowX: 'auto',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '1200px' },
  thead: { backgroundColor: 'hsl(0 0% 98%)' },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: 'hsl(215.4 16.3% 46.9%)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid hsl(240 5.9% 90%)',
  },
  tr: { borderBottom: '1px solid hsl(240 5.9% 90%)' },
  'tr:last-child': { borderBottom: 'none' },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: 'hsl(222.2 47.4% 11.2%)',
    verticalAlign: 'top',
    whiteSpace: 'nowrap',
  },
};

export default AdminCajaClosures; 