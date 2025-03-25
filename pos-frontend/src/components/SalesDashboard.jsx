import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { generateInvoice } from '../utils/invoice';

function SalesDashboard() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVat, setSelectedVat] = useState(0);
  const navigate = useNavigate();
  const storeId = localStorage.getItem('storeId');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchSales = async () => {
      try {
        console.log('Fetching sales for store:', storeId);
        const response = await API.get('/api/sales', {
          params: {
            'filters[store][id][$eq]': storeId,
            'populate': {
              'invoice': true,
              'product': true,
              '*': true
            },
            'sort': 'createdAt:desc'
          }
        });
        
        const sortedSales = response.data.data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        console.log('Sorted sales:', sortedSales);
        setSales(sortedSales);
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [storeId, navigate]);

  const handleDownloadInvoice = async (sale) => {
    // Find related sales either by orderGroupId or by time (within 1 second)
    let relatedSales;
    
    if (sale.orderGroupId) {
      // If orderGroupId exists, use it
      relatedSales = sales.filter(s => s.orderGroupId === sale.orderGroupId);
    } else {
      // Fallback to time-based grouping for older sales
      const saleTime = new Date(sale.Time).getTime();
      relatedSales = sales.filter(s => {
        const timeDiff = Math.abs(new Date(s.Time).getTime() - saleTime);
        return timeDiff < 1000;
      });
    }
    
    console.log('Related sales:', relatedSales);
    
    if (relatedSales.length === 0) {
      console.error('No related sales found for sale:', sale);
      return;
    }

    const items = relatedSales.map(s => ({
      product: { 
        Product: s.product?.Product || 'Producto no especificado'
      },
      price: s.Price,
      description: s.description || ''
    }));
    
    console.log('Items for invoice:', items);
    
    const total = relatedSales.reduce((sum, s) => sum + s.Price, 0);
    
    await generateInvoice(items, total, sale, selectedVat);
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'hsl(215.4 16.3% 46.9%)',
        fontSize: '14px',
        fontWeight: '500',
        fontFamily: 'system-ui'
      }}>
        Loading sales data...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '32px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: 'hsl(0 0% 100%)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '22px',
          fontWeight: '600',
          color: 'hsl(222.2 47.4% 11.2%)',
          margin: 0,
          fontFamily: 'system-ui',
          letterSpacing: '-0.025em'
        }}>
          Sales History
        </h1>

        <button
          onClick={() => navigate('/pos')}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(210 40% 98%)';
            e.currentTarget.style.borderColor = 'hsl(215.4 16.3% 46.9%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = 'hsl(240 5.9% 90%)';
          }}
          style={{
            padding: '10px 16px',
            backgroundColor: 'white',
            color: 'hsl(222.2 47.4% 11.2%)',
            border: '1px solid hsl(240 5.9% 90%)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'system-ui'
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to POS
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid hsl(240 5.9% 90%)',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              backgroundColor: 'white',
              borderBottom: '1.5px solid hsl(240 5.9% 90%)'
            }}>
              <th style={{ 
                padding: '12px 20px',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: '600',
                color: 'hsl(222.2 47.4% 11.2%)',
                fontFamily: 'system-ui'
              }}>Date</th>
              <th style={{ ...headerStyle }}>Time</th>
              <th style={{ ...headerStyle }}>Product</th>
              <th style={{ ...headerStyle }}>Price</th>
              <th style={{ ...headerStyle }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales && sales.length > 0 ? (
              sales.map((sale) => (
                <tr 
                  key={sale.id} 
                  style={{ 
                    borderBottom: '1px solid hsl(240 5.9% 90%)',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(210 40% 98%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <td style={{ 
                    padding: '12px 20px',
                    fontSize: '13px',
                    color: 'hsl(222.2 47.4% 11.2%)',
                    fontFamily: 'system-ui'
                  }}>
                    {sale.Time ? new Date(sale.Time).toLocaleDateString('es-ES') : 'N/A'}
                  </td>
                  <td style={{ ...cellStyle }}>
                    {sale.Time ? new Date(sale.Time).toLocaleTimeString('es-ES') : 'N/A'}
                  </td>
                  <td style={{ ...cellStyle }}>
                    {sale.product?.Product || 'N/A'}
                  </td>
                  <td style={{ ...cellStyle, fontWeight: '500' }}>
                    €{sale.Price?.toFixed(2) || '0.00'}
                  </td>
                  <td style={{ padding: '8px 20px' }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      alignItems: 'center'
                    }}>
                      <select
                        value={selectedVat}
                        onChange={(e) => setSelectedVat(Number(e.target.value))}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid hsl(240 5.9% 90%)',
                          fontSize: '13px',
                          color: 'hsl(222.2 47.4% 11.2%)',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          fontFamily: 'system-ui'
                        }}
                      >
                        <option value={0}>IVA: 0%</option>
                        <option value={10}>IVA: 10%</option>
                        <option value={21}>IVA: 21%</option>
                      </select>
                      <button
                        onClick={() => handleDownloadInvoice(sale)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'hsl(221.2 83.2% 53.3%)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'hsl(222.2 47.4% 11.2%)';
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'hsl(222.2 47.4% 11.2%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500',
                          transition: 'all 0.15s ease',
                          fontFamily: 'system-ui'
                        }}
                      >
                        Download Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan="5" 
                  style={{ 
                    textAlign: 'center', 
                    padding: '24px',
                    color: 'hsl(215.4 16.3% 46.9%)',
                    fontSize: '13px',
                    fontFamily: 'system-ui'
                  }}
                >
                  No sales records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const headerStyle = {
  padding: '12px 20px',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: '600',
  color: 'hsl(222.2 47.4% 11.2%)',
  fontFamily: 'system-ui'
};

const cellStyle = {
  padding: '12px 20px',
  fontSize: '13px',
  color: 'hsl(222.2 47.4% 11.2%)',
  fontFamily: 'system-ui'
};

export default SalesDashboard; 