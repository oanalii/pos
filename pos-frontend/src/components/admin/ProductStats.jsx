import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Sidebar from './Sidebar';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

function ProductStats() {
  const [productStats, setProductStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenueStats, setRevenueStats] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get sales for last 4 days
        const fourDaysAgo = new Date();
        fourDaysAgo.setDate(fourDaysAgo.getDate() - 3);
        
        const salesResponse = await API.get('/api/sales', {
          params: {
            'filters[Time][$gte]': fourDaysAgo.toISOString(),
            'populate': '*'
          }
        });
        const sales = salesResponse.data.data;

        // Group by day for the last 4 days
        const dailyRevenue = sales.reduce((acc, sale) => {
          const date = new Date(sale.attributes.Time).toLocaleDateString('es-ES');
          acc[date] = (acc[date] || 0) + parseFloat(sale.attributes.Price || 0);
          return acc;
        }, {});

        // Convert to array and sort by date (newest first)
        const revenueByDay = Object.entries(dailyRevenue)
          .map(([date, amount]) => ({ date, amount }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setRevenueStats(revenueByDay);

        // Get all sales
        const allSalesResponse = await API.get('/api/sales');
        const allSales = allSalesResponse.data.data;

        // Calculate today's revenue
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayTotal = allSales.reduce((sum, sale) => {
          const saleDate = new Date(sale.attributes.Time);
          return saleDate >= today ? sum + parseFloat(sale.attributes.Price || 0) : sum;
        }, 0);
        
        setTodayRevenue(todayTotal);

        // Log the first sale to see its structure
        console.log('First sale:', allSales[0]);
        console.log('First sale attributes:', allSales[0].attributes);

        // Map products to their stats
        const stats = [
          { id: 1, name: "Phone", count: 0, totalRevenue: 0 },
          { id: 3, name: "Laptop", count: 0, totalRevenue: 0 },
          { id: 5, name: "Funda", count: 0, totalRevenue: 0 },
          { id: 7, name: "Charger", count: 0, totalRevenue: 0 },
          { id: 9, name: "Figura", count: 0, totalRevenue: 0 },
          { id: 11, name: "Custom", count: 0, totalRevenue: 0 }
        ];

        // Process each sale
        allSales.forEach(sale => {
          if (!sale.attributes) return;

          // Log each sale's product ID and price
          console.log('Processing sale:', {
            id: sale.id,
            productId: sale.attributes.product,
            price: sale.attributes.Price
          });

          const productId = parseInt(sale.attributes.product);
          const price = parseFloat(sale.attributes.Price || 0);

          const productStat = stats.find(s => s.id === productId);
          if (productStat) {
            productStat.count += 1;
            productStat.totalRevenue += price;
          }
        });

        setProductStats(stats);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ ml: '280px', p: 3 }}>
        <Typography>Loading stats...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ 
        flexGrow: 1, 
        ml: '280px', 
        backgroundColor: '#f5f5f5', 
        minHeight: '100vh', 
        p: 2 
      }}>
        <Box sx={{ 
          backgroundColor: '#fff',
          borderRadius: 1,
          p: 3,
        }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Product Statistics
          </Typography>

          {/* Add Revenue Stats Cards */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 4,
            overflowX: 'auto',
            pb: 1
          }}>
            {revenueStats.map(({ date, amount }) => (
              <Box 
                key={date}
                sx={{
                  p: 3,
                  bgcolor: 'primary.light',
                  borderRadius: 2,
                  minWidth: 200,
                  textAlign: 'center'
                }}
              >
                <Typography variant="subtitle1" sx={{ color: 'white', mb: 1 }}>
                  {date === new Date().toLocaleDateString('es-ES') ? 'Today' : date}
                </Typography>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                  €{amount.toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="right">Total Sales</TableCell>
                  <TableCell align="right">Total Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productStats.length > 0 ? (
                  productStats.map((stat) => (
                    <TableRow key={stat.id}>
                      <TableCell>{stat.name}</TableCell>
                      <TableCell align="right">{stat.count}</TableCell>
                      <TableCell align="right">€{stat.totalRevenue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No sales data found
                    </TableCell>
                  </TableRow>
                )}
                
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell colSpan={2}>
                    <strong>Today's Total Revenue</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>€{todayRevenue.toFixed(2)}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductStats; 