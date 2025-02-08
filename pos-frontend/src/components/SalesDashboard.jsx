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
    const fetchSales = async () => {
      try {
        const response = await API.get(`/api/sales?filters[store][id][$eq]=${storeId}&sort[0]=Time:desc`);
        console.log('Sales data:', response.data);
        setSales(response.data.data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [storeId]);

  const handleDownloadInvoice = (sale) => {
    const items = [{
      product: sale.attributes.product.data.attributes,
      price: sale.attributes.Price
    }];
    generateInvoice(items, sale.attributes.Price);
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
          {sales.map((sale) => (
            <tr key={sale.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>
                {new Date(sale.attributes.Time).toLocaleDateString('es-ES')}
              </td>
              <td style={{ padding: '10px' }}>
                {new Date(sale.attributes.Time).toLocaleTimeString('es-ES')}
              </td>
              <td style={{ padding: '10px' }}>
                {sale.attributes.product.data.attributes.Product}
              </td>
              <td style={{ padding: '10px' }}>
                €{sale.attributes.Price.toFixed(2)}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesDashboard; 