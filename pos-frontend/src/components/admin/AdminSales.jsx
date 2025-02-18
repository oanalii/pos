import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api';
import { generateInvoice } from '../../utils/invoice';
import Sidebar from './Sidebar';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container
} from '@mui/material';

const STORE_IDS = {
  gaudi: 5,
  paralel: 1,
  mallorca: 3,
  hospital: 7,
};

function AdminSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [productStats, setProductStats] = useState([]);
  const [storeRevenue, setStoreRevenue] = useState({
    today: 0,
    yesterday: 0
  });
  const navigate = useNavigate();
  const { store } = useParams();

  const fetchSales = async () => {
    try {
      // Get today's sales specifically
      const todayResponse = await API.get('/api/sales', {
        params: {
          'filters[Time][$gte]': new Date().toISOString().split('T')[0],
          'populate': '*',
          ...(store && STORE_IDS[store] ? {
            'filters[store][id][$eq]': STORE_IDS[store]
          } : {})
        }
      });

      // Calculate today's revenue
      const todayTotal = todayResponse.data.data.reduce((sum, sale) => 
        sum + parseFloat(sale.Price || 0), 0
      );
      setTodayRevenue(todayTotal);

      // Get filtered sales as before...
      let url = '/api/sales?populate=*';
      if (store && STORE_IDS[store]) {
        url += `&filters[store][id][$eq]=${STORE_IDS[store]}`;
      }
      const response = await API.get(url);
      let filteredSales = response.data.data;

      // Apply time filter
      const currentDate = new Date(); // Create a base date
      filteredSales = filteredSales.filter(sale => {
        const saleDate = new Date(sale.Time);
        
        switch (timeFilter) {
          case 'day':
            const today = new Date(currentDate);
            today.setHours(0, 0, 0, 0);
            return saleDate >= today;
            
          case 'week':
            const weekAgo = new Date(currentDate);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return saleDate >= weekAgo;
            
          case 'month':
            const monthAgo = new Date(currentDate);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return saleDate >= monthAgo;
            
          case '3months':
            const threeMonthsAgo = new Date(currentDate);
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            return saleDate >= threeMonthsAgo;
            
          case '12months':
            const yearAgo = new Date(currentDate);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return saleDate >= yearAgo;
            
          default:
            return true;
        }
      });

      // Sort by date (newest first)
      const sortedSales = filteredSales.sort((a, b) => 
        new Date(b.Time).getTime() - new Date(a.Time).getTime()
      );
      
      setSales(sortedSales);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductStats = async () => {
    try {
      // Get store-specific sales
      const response = await API.get('/api/sales', {
        params: {
          'filters[store][id][$eq]': STORE_IDS[store],
          'populate': ['product', 'store']
        }
      });
      const storeSales = response.data.data;

      // Map products to their stats (full list from ProductStats.jsx)
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
        { id: 47, name: "Lyca SIM", count: 0, totalRevenue: 0 },
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
      storeSales.forEach(sale => {
        const productId = sale.product?.id;
        const price = parseFloat(sale.Price || 0);

        const productStat = stats.find(s => s.id === productId);
        if (productStat) {
          productStat.count += 1;
          productStat.totalRevenue += price;
        }
      });

      // Sort by revenue
      stats.sort((a, b) => b.totalRevenue - a.totalRevenue);
      setProductStats(stats);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchSales();
    if (store) {
      fetchProductStats();
    }
  }, [store, timeFilter]);

  const handleDownloadInvoice = (sale) => {
    const items = [{
      product: { Product: sale.product.Product },
      price: sale.Price
    }];
    generateInvoice(items, sale.Price);
  };

  if (loading) return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ 
        flexGrow: 1,
        p: 3,
      }}>
        <Typography>Loading sales data...</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc' }}>
      <Sidebar />
      <Box sx={{ 
        flexGrow: 1,
        p: 3,
      }}>
        {store ? (
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}>
            {/* Sales Section */}
            <Box sx={{ 
              bgcolor: '#fff',
              borderRadius: '16px',
              p: 2.5,
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            }}>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2.5,
              }}>
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: 1,
                      fontWeight: 600,
                      color: '#0f172a',
                      letterSpacing: '-0.02em',
                      fontSize: '1.75rem',
                    }}
                  >
                    {store ? `${store.charAt(0).toUpperCase() + store.slice(1)} Sales` : 'All Stores Sales'}
                  </Typography>
                  <Select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    size="small"
                    sx={{ 
                      minWidth: 180,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgb(226, 232, 240)',
                        borderRadius: '8px',
                      }
                    }}
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="day">Today</MenuItem>
                    <MenuItem value="week">Last 7 Days</MenuItem>
                    <MenuItem value="month">Last 30 Days</MenuItem>
                    <MenuItem value="3months">Last 3 Months</MenuItem>
                    <MenuItem value="12months">Last 12 Months</MenuItem>
                  </Select>
                </Box>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={() => navigate('/admin')}
                  sx={{
                    bgcolor: '#ef4444',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#dc2626',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>

              <Box sx={{ 
                mb: 2.5,
                p: 2.5,
                bgcolor: '#2563eb',
                borderRadius: '12px',
                color: 'white',
                boxShadow: '0 4px 6px -1px rgb(37 99 235 / 0.1)',
              }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Today's Revenue: €{todayRevenue.toFixed(2)}
                </Typography>
              </Box>

              <TableContainer sx={{ 
                borderRadius: '12px',
                border: '1px solid rgb(226, 232, 240)',
                overflow: 'auto',
                maxHeight: '250px',
                '& .MuiTable-root': {
                  minWidth: 650,
                }
              }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Store</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Product</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sales && sales.length > 0 ? (
                      sales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>{sale.store?.Name || 'Unknown Store'}</TableCell>
                          <TableCell>{sale.Time ? new Date(sale.Time).toLocaleDateString('es-ES') : 'N/A'}</TableCell>
                          <TableCell>{sale.Time ? new Date(sale.Time).toLocaleTimeString('es-ES') : 'N/A'}</TableCell>
                          <TableCell>{sale.product?.Product || 'N/A'}</TableCell>
                          <TableCell>€{sale.Price?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              onClick={() => handleDownloadInvoice(sale)}
                              size="small"
                            >
                              Download Invoice
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No sales records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Product Stats Section */}
            <Box sx={{ 
              bgcolor: '#fff',
              borderRadius: '16px',
              p: 2.5,
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            }}>
              <Typography variant="h5" sx={{ mb: 2.5, fontWeight: 600 }}>
                Product Breakdown
              </Typography>
              <TableContainer sx={{ 
                borderRadius: '12px',
                border: '1px solid rgb(226, 232, 240)',
                overflow: 'auto',
                maxHeight: '250px',
                '& .MuiTable-root': {
                  minWidth: 650,
                }
              }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ 
                        bgcolor: '#fff',
                        borderBottom: '2px solid #f1f5f9',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#64748b',
                        py: 3,
                      }}>
                        Product Name
                      </TableCell>
                      <TableCell align="right" sx={{ /* ... same styles ... */ }}>
                        Total Sales
                      </TableCell>
                      <TableCell align="right" sx={{ /* ... same styles ... */ }}>
                        Total Revenue
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productStats.map((stat) => (
                      <TableRow key={stat.id}>
                        <TableCell>{stat.name}</TableCell>
                        <TableCell align="right">{stat.count}</TableCell>
                        <TableCell align="right">€{stat.totalRevenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        ) : (
          <Box sx={{ 
            bgcolor: '#fff',
            borderRadius: '16px',
            p: 3,
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 4,
            }}>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 1,
                    fontWeight: 600,
                    color: '#0f172a',
                    letterSpacing: '-0.02em',
                    fontSize: '1.75rem',
                  }}
                >
                  {store ? `${store.charAt(0).toUpperCase() + store.slice(1)} Sales` : 'All Stores Sales'}
                </Typography>
                <Select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  size="small"
                  sx={{ 
                    minWidth: 200,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgb(226, 232, 240)',
                      borderRadius: '8px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgb(148, 163, 184)',
                    },
                  }}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="day">Today</MenuItem>
                  <MenuItem value="week">Last 7 Days</MenuItem>
                  <MenuItem value="month">Last 30 Days</MenuItem>
                  <MenuItem value="3months">Last 3 Months</MenuItem>
                  <MenuItem value="12months">Last 12 Months</MenuItem>
                </Select>
              </Box>
              <Button 
                variant="contained" 
                color="error"
                onClick={() => navigate('/admin')}
                sx={{
                  bgcolor: '#ef4444',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#dc2626',
                    boxShadow: 'none',
                  },
                }}
              >
                Logout
              </Button>
            </Box>

            <Box sx={{ 
              mb: 4, 
              p: 3, 
              bgcolor: '#2563eb',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgb(37 99 235 / 0.1)',
            }}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Today's Revenue: €{todayRevenue.toFixed(2)}
              </Typography>
            </Box>

            <TableContainer sx={{ 
              borderRadius: '12px',
              border: '1px solid rgb(226, 232, 240)',
              overflow: 'auto',
              maxHeight: '585px',
              '& .MuiTable-root': {
                minWidth: 650,
              }
            }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Store</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales && sales.length > 0 ? (
                    sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{sale.store?.Name || 'Unknown Store'}</TableCell>
                        <TableCell>{sale.Time ? new Date(sale.Time).toLocaleDateString('es-ES') : 'N/A'}</TableCell>
                        <TableCell>{sale.Time ? new Date(sale.Time).toLocaleTimeString('es-ES') : 'N/A'}</TableCell>
                        <TableCell>{sale.product?.Product || 'N/A'}</TableCell>
                        <TableCell>€{sale.Price?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={() => handleDownloadInvoice(sale)}
                            size="small"
                          >
                            Download Invoice
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No sales records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AdminSales; 