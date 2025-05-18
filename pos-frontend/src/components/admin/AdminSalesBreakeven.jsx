import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Sidebar from './Sidebar';

const DAILY_BREAKEVEN = 1690; // Total daily breakeven for all stores (330 + 240 + 200 + 220 + 200)

function AdminSalesBreakeven() { // Renamed function
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  const fetchMonthlyData = useCallback(async () => {
    try {
      // Get all sales data
      const response = await API.get('/api/sales', {
        params: {
          'populate': ['store'],
        }
      });

      if (!response.data?.data) {
        setMonthlyData([]);
        return;
      }

      // Process sales data by month
      const monthlyStats = {};
      
      response.data.data.forEach(sale => {
        if (!sale.Time) return;
        
        const saleDate = new Date(sale.Time);
        const monthKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
        const amount = parseFloat(sale.Price) || 0;

        if (!monthlyStats[monthKey]) {
          monthlyStats[monthKey] = {
            revenue: 0,
            daysInMonth: new Date(saleDate.getFullYear(), saleDate.getMonth() + 1, 0).getDate(),
            month: saleDate.toLocaleString('default', { month: 'long' }),
            year: saleDate.getFullYear()
          };
        }

        monthlyStats[monthKey].revenue += amount;
      });

      // Calculate P&L for each month
      const processedData = Object.entries(monthlyStats).map(([key, data]) => {
        const monthlyBreakeven = DAILY_BREAKEVEN * data.daysInMonth;
        const profit = data.revenue - monthlyBreakeven; // Still calculating profit/loss

        return {
          id: key,
          month: data.month,
          year: data.year,
          revenue: data.revenue,
          breakeven: monthlyBreakeven,
          profit: profit, // Renamed P&L to profit, but it's the same calculation
          daysInMonth: data.daysInMonth
        };
      });

      // Sort by date (newest first)
      processedData.sort((a, b) => b.id.localeCompare(a.id));
      setMonthlyData(processedData);
      
      // Set the most recent month as selected
      if (processedData.length > 0 && !selectedMonth) {
        setSelectedMonth(processedData[0].id);
      }

    } catch (error) {
      console.error('Error fetching sales:', error);
      setMonthlyData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }
    
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchMonthlyData();
  }, [fetchMonthlyData, navigate]);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'hsl(0 0% 98%)' }}>
        <Sidebar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading sales breakeven data...
        </main>
      </div>
    );
  }

  const selectedData = monthlyData.find(data => data.id === selectedMonth) || (monthlyData.length > 0 ? monthlyData[0] : null);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'hsl(0 0% 98%)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
              Monthly Sales Breakeven 
            </h1>
            
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid hsl(240 5.9% 90%)',
                width: isMobile ? '100%' : 'auto'
              }}
            >
              {monthlyData.map(data => (
                <option key={data.id} value={data.id}>
                  {`${data.month} ${data.year}`}
                </option>
              ))}
            </select>
          </div>

          {selectedData ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '20px',
              marginBottom: '24px'
            }}>
              <StatsCard
                title="Monthly Revenue"
                value={selectedData.revenue}
                color="hsl(221.2 83.2% 71.8%)"
              />
              <StatsCard
                title={`Monthly Breakeven (${selectedData.daysInMonth} days)`}
                value={selectedData.breakeven}
                color="hsl(215.4 16.3% 46.9%)"
              />
              <StatsCard
                title="Monthly Profit/Loss" // Kept title as Profit/Loss for clarity
                value={selectedData.profit}
                isProfit={true}
              />
            </div>
          ) : (
            <p>No data available for the selected period.</p> 
          )}

          {/* Monthly History Table */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid hsl(240 5.9% 90%)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'hsl(0 0% 98%)' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Month</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Revenue</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Breakeven</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map(data => (
                  <tr 
                    key={data.id}
                    style={{
                      borderTop: '1px solid hsl(240 5.9% 90%)',
                      backgroundColor: data.id === selectedMonth ? 'hsl(210 40% 98%)' : 'white'
                    }}
                  >
                    <td style={{ padding: '12px' }}>{`${data.month} ${data.year}`}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>€{data.revenue.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>€{data.breakeven.toFixed(2)}</td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'right',
                      color: data.profit >= 0 ? 'hsl(142.1 76.2% 36.3%)' : 'hsl(0 84.2% 60.2%)'
                    }}>
                      {data.profit >= 0 ? '+' : ''}€{data.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

const StatsCard = ({ title, value, isProfit, color }) => (
  <div style={{
    padding: '24px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid hsl(240 5.9% 90%)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  }}>
    <div style={{
      fontSize: '14px',
      fontWeight: '500',
      color: 'hsl(215.4 16.3% 46.9%)',
      marginBottom: '8px'
    }}>
      {title}
    </div>
    <div style={{
      fontSize: '24px',
      fontWeight: '600',
      color: isProfit !== undefined 
        ? (value >= 0 ? 'hsl(142.1 76.2% 36.3%)' : 'hsl(0 84.2% 60.2%)')
        : (color || 'hsl(222.2 47.4% 11.2%)')
    }}>
      {isProfit !== undefined ? (value >= 0 ? '+' : '') : '€'}
      {value.toFixed(2)}
      {isProfit !== undefined ? '€' : ''}
    </div>
  </div>
);

// Make sure this line is at the very end
export default AdminSalesBreakeven; 