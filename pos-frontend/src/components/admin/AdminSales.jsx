import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { generateInvoice } from '../../utils/invoice';

function AdminSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAllSales = async () => {
      try {
        const response = await API.get('/api/sales?populate=*');
        // Sort sales by creation date (newest first)
        const sortedSales = response.data.data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSales(sortedSales);
      } catch (error) {
        console.error('Error fetching all sales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSales();
  }, []);

  const handleDownloadInvoice = (sale) => {
    const items = [{
      product: { Product: sale.product.Product },
      price: sale.Price
    }];
    generateInvoice(items, sale.Price);
  };

  if (loading) return <div>Loading sales data...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>All Stores Sales History</h1>
        <button
          onClick={() => navigate('/admin')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Store</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Date</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Time</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Product</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Price</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales && sales.length > 0 ? (
            sales.map((sale) => (
              <tr key={sale.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>
                  {sale.store?.Name || 'Unknown Store'}
                </td>
                <td style={{ padding: '10px' }}>
                  {sale.Time ? 
                    new Date(sale.Time).toLocaleDateString('es-ES') 
                    : 'N/A'
                  }
                </td>
                <td style={{ padding: '10px' }}>
                  {sale.Time ? 
                    new Date(sale.Time).toLocaleTimeString('es-ES')
                    : 'N/A'
                  }
                </td>
                <td style={{ padding: '10px' }}>
                  {sale.product?.Product || 'N/A'}
                </td>
                <td style={{ padding: '10px' }}>
                  €{sale.Price?.toFixed(2) || '0.00'}
                </td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => handleDownloadInvoice(sale)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Download Invoice
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                No sales records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminSales; 