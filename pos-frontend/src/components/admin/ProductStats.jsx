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
  const [yesterdayRevenue, setYesterdayRevenue] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get today's sales first for the revenue widget
        const todayResponse = await API.get('/api/sales', {
          params: {
            'filters[Time][$gte]': new Date().toISOString().split('T')[0],
            'populate': '*'
          }
        });
        
        // Calculate today's revenue
        const todayTotal = todayResponse.data.data.reduce((sum, sale) => 
          sum + parseFloat(sale.Price || 0), 0
        );
        setTodayRevenue(todayTotal);

        // Get yesterday's sales
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStart = yesterday.toISOString().split('T')[0];
        const yesterdayEnd = new Date().toISOString().split('T')[0];

        const yesterdayResponse = await API.get('/api/sales', {
          params: {
            'filters[Time][$gte]': yesterdayStart,
            'filters[Time][$lt]': yesterdayEnd,
            'populate': '*'
          }
        });

        // Calculate yesterday's revenue
        const yesterdayTotal = yesterdayResponse.data.data.reduce((sum, sale) =>
          sum + parseFloat(sale.Price || 0), 0
        );
        setYesterdayRevenue(yesterdayTotal);

        // Get all sales for product stats
        const allSalesResponse = await API.get('/api/sales', {
          params: {
            'populate': ['product', 'store']
          }
        });
        const allSales = allSalesResponse.data.data;

        // Map products to their stats (expanded list)
        const stats = [
          { id: 1, name: "Phone", count: 0, totalRevenue: 0 },
          { id: 3, name: "Laptop", count: 0, totalRevenue: 0 },
          { id: 5, name: "Funda", count: 0, totalRevenue: 0 },
          { id: 7, name: "Charger", count: 0, totalRevenue: 0 },
          { id: 9, name: "Figura", count: 0, totalRevenue: 0 },
          { id: 11, name: "Voda SIM", count: 0, totalRevenue: 0 },
          { id: 13, name: "Protector", count: 0, totalRevenue: 0 },
          { id: 15, name: "Hydrogel Protector", count: 0, totalRevenue: 0 },
          { id: 17, name: "Cordón", count: 0, totalRevenue: 0 },
          { id: 19, name: "BT Headphones", count: 0, totalRevenue: 0 },
          { id: 21, name: "BT Speaker", count: 0, totalRevenue: 0 },
          { id: 23, name: "Souvenir", count: 0, totalRevenue: 0 },
          { id: 25, name: "Headphones", count: 0, totalRevenue: 0 },
          { id: 27, name: "Cable", count: 0, totalRevenue: 0 },
          { id: 29, name: "Cargador Set", count: 0, totalRevenue: 0 },
          { id: 31, name: "Power Bank", count: 0, totalRevenue: 0 },
          { id: 33, name: "Recarga", count: 0, totalRevenue: 0 },
          { id: 35, name: "Print", count: 0, totalRevenue: 0 },
          { id: 37, name: "Adapter", count: 0, totalRevenue: 0 },
          { id: 39, name: "Gafas", count: 0, totalRevenue: 0 },
          { id: 41, name: "Repair", count: 0, totalRevenue: 0 },
          { id: 43, name: "Data transfer", count: 0, totalRevenue: 0 },
          { id: 45, name: "Smartwatch", count: 0, totalRevenue: 0 },
          { id: 47, name: "Orange SIM", count: 0, totalRevenue: 0 },
          { id: 49, name: "Raton", count: 0, totalRevenue: 0 },
          { id: 51, name: "Watch Strap", count: 0, totalRevenue: 0 },
          { id: 53, name: "USB Drive", count: 0, totalRevenue: 0 },
          { id: 55, name: "Drink", count: 0, totalRevenue: 0 },
          { id: 57, name: "Umbrella", count: 0, totalRevenue: 0 },
          { id: 59, name: "Car Phone Mount", count: 0, totalRevenue: 0 },
          { id: 61, name: "Shave Machine", count: 0, totalRevenue: 0 },
          { id: 63, name: "Funda headphone", count: 0, totalRevenue: 0 },
          { id: 65, name: "iPad", count: 0, totalRevenue: 0 },
          { id: 67, name: "iPad funda", count: 0, totalRevenue: 0 },
          { id: 69, name: "Macbook protector", count: 0, totalRevenue: 0 },
          { id: 71, name: "Anime shirt", count: 0, totalRevenue: 0 },
          { id: 73, name: "PC", count: 0, totalRevenue: 0 },
          { id: 75, name: "Keyboard", count: 0, totalRevenue: 0 },
          { id: 77, name: "Laptop (not MacBook)", count: 0, totalRevenue: 0 },
          { id: 79, name: "iMac", count: 0, totalRevenue: 0 },
        ];

        // Process each sale
        allSales.forEach(sale => {
          // Log the sale data to see its structure
          console.log('Processing sale:', sale);

          // Get product ID and price, handling both data structures
          const productId = sale.product?.id || sale.attributes?.product?.data?.id;
          const price = parseFloat(sale.Price || sale.attributes?.Price || 0);

          console.log('Extracted data:', { productId, price });

          const productStat = stats.find(s => s.id === productId);
          if (productStat) {
            productStat.count += 1;
            productStat.totalRevenue += price;
          }
        });

        // Sort stats by revenue (optional)
        stats.sort((a, b) => b.totalRevenue - a.totalRevenue);

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

          {/* Products Table */}
          <TableContainer 
            component={Paper} 
            sx={{ 
              maxHeight: '70vh',
              overflow: 'auto',
              position: 'relative',
              mb: 3  // Add margin bottom for spacing
            }}
          >
            <Table stickyHeader>
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
              </TableBody>
            </Table>
          </TableContainer>

          {/* Today's Revenue Box */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>
              Today's Revenue: €{todayRevenue.toFixed(2)}
            </Typography>
          </Box>

          {/* Yesterday's Revenue Box */}
          <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>
              Yesterday's Revenue: €{yesterdayRevenue.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductStats; 