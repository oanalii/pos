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
  const [timeFilter, setTimeFilter] = useState('day');
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [productStats, setProductStats] = useState([]);
  const [storeRevenue, setStoreRevenue] = useState({
    today: 0,
    yesterday: 0
  });
  const [selectedVat, setSelectedVat] = useState(0);
  const [salesTrend, setSalesTrend] = useState([]);
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

      // After setting sales, process trend data
      processSalesTrend(sortedSales);
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
        { id: 82, name: "Lyca SIM", count: 0, totalRevenue: 0 },
        { id: 85, name: "Selfie Stick", count: 0, totalRevenue: 0 }
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

  const processSalesTrend = (sales) => {
    // Get last 15 days
    const last15Days = Array.from({ length: 15 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyTotals = last15Days.map(date => {
      const daySales = sales.filter(sale => 
        sale.Time.split('T')[0] === date
      );
      return {
        date,
        total: daySales.reduce((sum, sale) => sum + (parseFloat(sale.Price) || 0), 0)
      };
    });

    const maxTotal = Math.max(...dailyTotals.map(d => d.total));
    const minTotal = Math.min(...dailyTotals.map(d => d.total));
    
    // Normalize values between 0 and 50 (for SVG height)
    const normalizedData = dailyTotals.map(day => ({
      ...day,
      value: maxTotal === minTotal ? 25 : 
        ((day.total - minTotal) / (maxTotal - minTotal)) * 50
    }));

    setSalesTrend(normalizedData);
  };

  useEffect(() => {
    fetchSales();
    if (store) {
      fetchProductStats();
    }
  }, [store, timeFilter]);

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
    
    const total = relatedSales.reduce((sum, s) => sum + s.Price, 0);
    
    await generateInvoice(items, total, sale, selectedVat);
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
    <Box sx={{ 
      display: 'flex', 
      bgcolor: '#f9fafb',  // Light gray background
      minHeight: '100vh'
    }}>
      <Sidebar />
      <Box sx={{ 
        flexGrow: 1, 
        p: { xs: 2, sm: 4 },
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}>
        <Box sx={{ 
          bgcolor: 'white',
          borderRadius: '24px',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          overflow: 'hidden',
          border: '1px solid #f1f5f9'
        }}>
          {/* Modern Header */}
          <Box sx={{ 
            p: 4,
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <Typography sx={{ 
              fontSize: '1.875rem',
              fontWeight: 600,
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>
              {store ? `${store.charAt(0).toUpperCase() + store.slice(1)} Sales` : 'All Stores Sales'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                size="small"
                sx={{ 
                  minWidth: 200,
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e2e8f0',
                    borderRadius: '12px'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cbd5e1'
                  },
                  '.MuiSelect-select': {
                    py: 1.5
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
          </Box>

          {/* Stats Cards */}
          <Box sx={{ 
            p: 4,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
            gap: 3
          }}>
            {/* Today's Revenue Card */}
            <Box sx={{ 
              p: 4,
              bgcolor: '#2563eb',
              borderRadius: '16px',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgb(37 99 235 / 0.1)'
            }}>
              <Typography sx={{ fontSize: '0.875rem', opacity: 0.9, mb: 1 }}>
                Today's Revenue
              </Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 600 }}>
                €{todayRevenue.toFixed(2)}
              </Typography>
            </Box>

            {/* Sales Trend Graph */}
            <Box sx={{ 
              p: 4,
              bgcolor: 'white',
              borderRadius: '16px',
              border: '1px solid #f1f5f9',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Typography sx={{ fontSize: '0.875rem', color: '#64748b', mb: 2 }}>
                Sales Trend (Last 15 Days)
              </Typography>
              
              <svg
                width="100%"
                height="60"
                style={{ overflow: 'visible' }}
              >
                {/* Draw the line */}
                <path
                  d={salesTrend.map((point, i) => 
                    `${i === 0 ? 'M' : 'L'} ${(i * (100 / 14))}% ${50 - point.value}`
                  ).join(' ')}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
                
                {/* Add dots for each point */}
                {salesTrend.map((point, i) => (
                  <circle
                    key={point.date}
                    cx={`${i * (100 / 14)}%`}
                    cy={50 - point.value}
                    r="3"
                    fill="#2563eb"
                  />
                ))}
              </svg>
            </Box>
          </Box>

          {/* Table Section */}
          <Box sx={{ px: 4, pb: 4 }}>
            <TableContainer sx={{ 
              borderRadius: '16px',
              border: '1px solid #f1f5f9',
              maxHeight: 'calc(100vh - 400px)',
              '& .MuiTableCell-root': {
                borderColor: '#f1f5f9',
                py: 2.5
              }
            }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      bgcolor: '#f8fafc',
                      color: '#64748b',
                      fontSize: '0.875rem'
                    }}>Store</TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc', color: '#64748b' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc', color: '#64748b' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc', color: '#64748b' }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc', color: '#64748b' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc', color: '#64748b' }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8fafc', color: '#64748b' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales && sales.length > 0 ? (
                    sales.map((sale) => (
                      <TableRow 
                        key={sale.id}
                        sx={{ 
                          '&:hover': { bgcolor: '#f8fafc' },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell>{sale.store?.Name || 'Unknown Store'}</TableCell>
                        <TableCell>{sale.Time ? new Date(sale.Time).toLocaleDateString('es-ES') : 'N/A'}</TableCell>
                        <TableCell>{sale.Time ? new Date(sale.Time).toLocaleTimeString('es-ES') : 'N/A'}</TableCell>
                        <TableCell>{sale.product?.Product || 'N/A'}</TableCell>
                        <TableCell>{sale.description || 'No description'}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>€{sale.Price?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Select
                              value={selectedVat}
                              onChange={(e) => setSelectedVat(Number(e.target.value))}
                              size="small"
                              sx={{ 
                                minWidth: 120,
                                '.MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#e2e8f0',
                                  borderRadius: '8px'
                                }
                              }}
                            >
                              <MenuItem value={0}>IVA: 0%</MenuItem>
                              <MenuItem value={10}>IVA: 10%</MenuItem>
                              <MenuItem value={21}>IVA: 21%</MenuItem>
                            </Select>
                            <Button
                              variant="contained"
                              onClick={() => handleDownloadInvoice(sale)}
                              size="small"
                              sx={{
                                bgcolor: '#2563eb',
                                borderRadius: '8px',
                                textTransform: 'none',
                                boxShadow: 'none',
                                '&:hover': {
                                  bgcolor: '#1d4ed8',
                                  boxShadow: 'none'
                                }
                              }}
                            >
                              Download Invoice
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell 
                        colSpan={7} 
                        align="center"
                        sx={{ 
                          color: '#64748b',
                          py: 8
                        }}
                      >
                        No sales records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminSales; 