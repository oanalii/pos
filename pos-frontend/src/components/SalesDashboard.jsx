import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { generateInvoice } from '../utils/invoice';

function SalesDashboard() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
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
            'populate': '*'
          }
        });
        
        // Sort sales by creation date (newest first)
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

  const handleDownloadInvoice = (sale) => {
    const items = [{
      product: { Product: sale.product.Product },
      price: sale.Price
    }];
    generateInvoice(items, sale.Price);
  };

  if (loading) return <div>Cargando ventas...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Historial de Ventas</h1>
        <button
          onClick={() => navigate('/pos')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Volver al POS
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Fecha</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Hora</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Producto</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Precio</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sales && sales.length > 0 ? (
            sales.map((sale) => (
              <tr key={sale.id} style={{ borderBottom: '1px solid #ddd' }}>
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
                    Descargar Factura
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                No hay ventas registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SalesDashboard; 