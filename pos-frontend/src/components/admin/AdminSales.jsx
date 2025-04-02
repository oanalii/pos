import React, { useState, useEffect, useCallback } from 'react';
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
  consell: 14
};

// Add these styles at the top of the component
const mobileBreakpoint = '768px'; // Standard tablet/phone breakpoint

function AdminSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('day');
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [yesterdayRevenue, setYesterdayRevenue] = useState(0);
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [lastWeekRevenue, setLastWeekRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [productStats, setProductStats] = useState([]);
  const [selectedVat, setSelectedVat] = useState(0);
  const [periodRevenue, setPeriodRevenue] = useState(0);
  const navigate = useNavigate();
  const { store } = useParams();

  // For chart visualization - this would be populated from your API data
  const [chartData, setChartData] = useState([]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const fetchSales = useCallback(async () => {
    try {
      // Get today's sales
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const todayResponse = await API.get('/api/sales', {
        params: {
          'filters[Time][$gte]': todayStart.toISOString(),
          'populate': ['*', 'store', 'product'],
          ...(store && STORE_IDS[store] ? {
            'filters[store][id][$eq]': STORE_IDS[store]
          } : {})
        }
      });

      const todayTotal = todayResponse.data?.data?.reduce((sum, sale) => 
        sum + (parseFloat(sale.Price) || 0), 0
      ) || 0;
      setTodayRevenue(todayTotal);

      // Get yesterday's sales
      const yesterdayStart = new Date();
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);
      yesterdayStart.setHours(0, 0, 0, 0);
      const yesterdayEnd = new Date(todayStart);

      const yesterdayResponse = await API.get('/api/sales', {
        params: {
          'filters[Time][$gte]': yesterdayStart.toISOString(),
          'filters[Time][$lt]': yesterdayEnd.toISOString(),
          'populate': ['*', 'store', 'product'],
          ...(store && STORE_IDS[store] ? {
            'filters[store][id][$eq]': STORE_IDS[store]
          } : {})
        }
      });

      const yesterdayTotal = yesterdayResponse.data?.data?.reduce((sum, sale) => 
        sum + (parseFloat(sale.Price) || 0), 0
      ) || 0;
      setYesterdayRevenue(yesterdayTotal);

      // Get last month's sales (1st to last day of previous month)
      const lastMonthStart = new Date();
      lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
      lastMonthStart.setDate(1);
      lastMonthStart.setHours(0, 0, 0, 0);
      
      const lastMonthEnd = new Date();
      lastMonthEnd.setDate(0); // Last day of previous month
      lastMonthEnd.setHours(23, 59, 59, 999);

      const lastMonthResponse = await API.get('/api/sales', {
        params: {
          'filters[Time][$gte]': lastMonthStart.toISOString(),
          'filters[Time][$lte]': lastMonthEnd.toISOString(),
          'populate': ['*', 'store', 'product'],
          ...(store && STORE_IDS[store] ? {
            'filters[store][id][$eq]': STORE_IDS[store]
          } : {})
        }
      });

      const lastMonthTotal = lastMonthResponse.data?.data?.reduce((sum, sale) => 
        sum + (parseFloat(sale.Price) || 0), 0
      ) || 0;
      setLastMonthRevenue(lastMonthTotal);

      // Get current month's sales (1st to present)
      const currentMonthStart = new Date();
      currentMonthStart.setDate(1);
      currentMonthStart.setHours(0, 0, 0, 0);

      const currentMonthResponse = await API.get('/api/sales', {
        params: {
          'filters[Time][$gte]': currentMonthStart.toISOString(),
          'populate': ['*', 'store', 'product'],
          ...(store && STORE_IDS[store] ? {
            'filters[store][id][$eq]': STORE_IDS[store]
          } : {})
        }
      });

      const currentMonthTotal = currentMonthResponse.data?.data?.reduce((sum, sale) => 
        sum + (parseFloat(sale.Price) || 0), 0
      ) || 0;
      setCurrentMonthRevenue(currentMonthTotal);

      // Get last week's sales
      const lastWeekStart = new Date();
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);
      lastWeekStart.setHours(0, 0, 0, 0);

      const lastWeekResponse = await API.get('/api/sales', {
        params: {
          'filters[Time][$gte]': lastWeekStart.toISOString(),
          'populate': ['*', 'store', 'product'],
          ...(store && STORE_IDS[store] ? {
            'filters[store][id][$eq]': STORE_IDS[store]
          } : {})
        }
      });

      const lastWeekTotal = lastWeekResponse.data?.data?.reduce((sum, sale) => 
        sum + (parseFloat(sale.Price) || 0), 0
      ) || 0;
      setLastWeekRevenue(lastWeekTotal);

      // Get all-time sales
      const allTimeResponse = await API.get('/api/sales', {
        params: {
          'populate': ['*', 'store', 'product'],
          ...(store && STORE_IDS[store] ? {
            'filters[store][id][$eq]': STORE_IDS[store]
          } : {})
        }
      });

      const allTimeTotal = allTimeResponse.data?.data?.reduce((sum, sale) => 
        sum + (parseFloat(sale.Price) || 0), 0
      ) || 0;
      setTotalRevenue(allTimeTotal);

      // Get all sales for the table and chart
      const response = await API.get('/api/sales', {
        params: {
          'populate': ['*', 'store', 'product'],
          ...(store && STORE_IDS[store] ? {
            'filters[store][id][$eq]': STORE_IDS[store]
          } : {})
        }
      });

      if (!response.data?.data) {
        setSales([]);
        setChartData([]);
        return;
      }

      const filteredSales = response.data.data.filter(sale => {
        if (!sale.Time) return false;
        const saleDate = new Date(sale.Time);
        const currentDate = new Date();
        
        switch (timeFilter) {
          case 'day':
            return saleDate >= todayStart;
          case 'yesterday':
            return saleDate >= yesterdayStart && saleDate < yesterdayEnd;
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

      // Generate chart data
      const last30Days = generateChartData(sortedSales);
      setChartData(last30Days);

    } catch (error) {
      console.error('Error fetching sales:', error);
      setSales([]);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, [store, timeFilter]);

  const generateChartData = useCallback((salesData) => {
    if (!Array.isArray(salesData)) return [];
    
    const dateMap = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Initialize last 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('es-ES');
      dateMap[dateStr] = 0;
    }
    
    // Fill in actual sales data
    salesData.forEach(sale => {
      if (!sale?.Time) return;
      const saleDate = new Date(sale.Time);
      saleDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today - saleDate) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 29) {
        const dateStr = saleDate.toLocaleDateString('es-ES');
        dateMap[dateStr] = (dateMap[dateStr] || 0) + (parseFloat(sale.Price) || 0);
      }
    });
    
    return Object.entries(dateMap).map(([date, amount]) => ({
      date,
      amount
    }));
  }, []);

  const fetchProductStats = useCallback(async () => {
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
        { id: 85, name: "Selfie Stick", count: 0, totalRevenue: 0 },
        { id: 87, name: "OTG", count: 0, totalRevenue: 0 },
        { id: 89, name: "Pilas", count: 0, totalRevenue: 0 },
        { id: 91, name: "Soporte", count: 0, totalRevenue: 0 },
        { id: 93, name: "SD Card", count: 0, totalRevenue: 0 },
        { id: 95, name: "Dryer", count: 0, totalRevenue: 0 },
        { id: 97, name: "Plancha", count: 0, totalRevenue: 0 },
        { id: 99, name: "Mando", count: 0, totalRevenue: 0 },
        { id: 101, name: "Trimmer", count: 0, totalRevenue: 0 }
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
  }, [store]);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }
    
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchSales();
    if (store) {
      fetchProductStats();
    }
  }, [store, timeFilter, fetchSales, fetchProductStats, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'hsl(0 0% 98%)',
      padding: '32px'
    }}>
      <Sidebar />
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui',
        color: 'hsl(215.4 16.3% 46.9%)'
      }}>
        Loading sales data...
      </main>
    </div>
  );

  return (
    <div style={{ 
      display: 'flex',
      width: '100%',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: 'hsl(0 0% 98%)',
      color: 'hsl(222.2 47.4% 11.2%)'
    }}>
      <Sidebar />
      
      <main style={{
        flex: 1,
        marginLeft: isMobile ? '50px' : '0',
        height: '100vh',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        position: 'relative'
      }}>
        <div style={{
          padding: isMobile ? '8px' : '32px',
          minWidth: isMobile ? '800px' : 'auto',
        }}>
          {/* Header Section */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: isMobile ? '16px' : '0',
            marginBottom: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'center',
              gap: '16px' 
            }}>
              <h1 style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '600',
                color: 'hsl(222.2 47.4% 11.2%)',
                margin: 0,
                fontFamily: 'system-ui',
                letterSpacing: '-0.025em'
              }}>
                {store ? `${store.charAt(0).toUpperCase() + store.slice(1)} Store` : 'All Stores'}
              </h1>
              
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid hsl(240 5.9% 90%)',
                  fontSize: '14px',
                  width: isMobile ? '100%' : 'auto',
                  color: 'hsl(222.2 47.4% 11.2%)',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontFamily: 'system-ui',
                  outline: 'none'
                }}
              >
                <option value="all">All Time</option>
                <option value="day">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="12months">Last 12 Months</option>
              </select>
            </div>
            
            {/* Chart - Hide on mobile */}
            {isMobile ? null : (
              <div style={{
                width: '300px',
                height: '80px',
                position: 'relative',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid hsl(240 5.9% 90%)',
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'hsl(215.4 16.3% 46.9%)',
                  fontFamily: 'system-ui'
                }}>
                  Last 30 Days
                </div>
                
                {Array.isArray(chartData) && chartData.length > 0 ? (
                  <div style={{
                    display: 'flex',
                    height: '100%',
                    alignItems: 'flex-end',
                    gap: '0px',
                    paddingTop: '20px'
                  }}>
                    {chartData.map((point, index) => {
                      const max = Math.max(...chartData.map(p => p.amount));
                      const height = max === 0 ? 0 : (point.amount / max) * 100;
                      
                      return (
                        <div key={index} style={{ 
                          flex: 1, 
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: 'center',
                          height: '100%'
                        }}>
                          <div 
                            style={{
                              width: '100%',
                              height: `${height}%`,
                              backgroundColor: point.amount > 0 
                                ? 'hsl(221.2 83.2% 71.8%)' 
                                : 'hsl(220 14% 96%)',
                              borderRadius: '1px 1px 0 0',
                              transition: 'height 0.3s ease',
                              minHeight: point.amount > 0 ? '4px' : '1px'
                            }}
                            title={`${point.date}: €${point.amount.toFixed(2)}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'hsl(215.4 16.3% 46.9%)',
                    fontSize: '12px',
                    fontFamily: 'system-ui'
                  }}>
                    No data available
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '16px' : '20px',
            marginBottom: '24px'
          }}>
            {/* Today's Revenue */}
            <StatsCard
              title="Today's Revenue"
              value={todayRevenue}
            />

            {/* Yesterday's Revenue */}
            <StatsCard
              title="Yesterday's Revenue"
              value={yesterdayRevenue}
            />

            {/* Last Week's Revenue */}
            <StatsCard
              title="Last 7 Days Revenue"
              value={lastWeekRevenue}
            />

            {/* Current Month Revenue */}
            <StatsCard
              title="Current Month Revenue"
              value={currentMonthRevenue}
            />

            {/* Last Month Revenue */}
            <StatsCard
              title="Last Month Revenue"
              value={lastMonthRevenue}
            />

            {/* Total Revenue */}
            <StatsCard
              title="Total Revenue"
              value={totalRevenue}
            />
          </div>

          {/* Main Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr auto',
            gap: isMobile ? '16px' : '24px'
          }}>
            {/* Sales Table */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid hsl(240 5.9% 90%)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
              height: isMobile ? 'calc(100vh - 220px)' : 'calc(100vh - 280px)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid hsl(240 5.9% 90%)'
              }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'hsl(222.2 47.4% 11.2%)',
                  fontFamily: 'system-ui',
                  margin: 0
                }}>
                  Recent Sales
                </h2>
              </div>

              <div style={{
                flex: 1,
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
                position: 'relative'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: isMobile ? '800px' : 'auto'
                }}>
                  <thead style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'hsl(0 0% 98%)',
                    zIndex: 2
                  }}>
                    <tr style={{
                      backgroundColor: 'hsl(0 0% 98%)',
                      borderBottom: '1px solid hsl(240 5.9% 90%)'
                    }}>
                      <th style={{ ...headerStyle }}>Store</th>
                      <th style={{ ...headerStyle }}>Date</th>
                      <th style={{ ...headerStyle }}>Time</th>
                      <th style={{ ...headerStyle }}>Product</th>
                      <th style={{ ...headerStyle }}>Description</th>
                      <th style={{ ...headerStyle }}>Price</th>
                      <th style={{ ...headerStyle }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr 
                        key={sale.id}
                        style={{
                          borderBottom: '1px solid hsl(240 5.9% 90%)',
                          backgroundColor: 'white',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'hsl(210 40% 98%)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        <td style={{ ...cellStyle }}>
                          {sale.store?.Name || 'N/A'}
                        </td>
                        <td style={{ ...cellStyle }}>
                          {sale.Time ? new Date(sale.Time).toLocaleDateString('es-ES') : 'N/A'}
                        </td>
                        <td style={{ ...cellStyle }}>
                          {sale.Time ? new Date(sale.Time).toLocaleTimeString('es-ES') : 'N/A'}
                        </td>
                        <td style={{ ...cellStyle }}>
                          {sale.product?.Product || 'N/A'}
                        </td>
                        <td style={{ ...cellStyle }}>
                          {sale.description || 'No description'}
                        </td>
                        <td style={{ ...cellStyle }}>
                          €{sale.Price?.toFixed(2) || '0.00'}
                        </td>
                        <td style={{ ...cellStyle }}>
                          <div style={{
                            display: 'flex',
                            gap: '4px',
                            alignItems: 'center',
                            flexWrap: isMobile ? 'wrap' : 'nowrap'
                          }}>
                            <select
                              value={selectedVat}
                              onChange={(e) => setSelectedVat(Number(e.target.value))}
                              style={{
                                padding: isMobile ? '4px 8px' : '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid hsl(240 5.9% 90%)',
                                fontSize: '12px',
                                width: isMobile ? '80px' : 'auto',
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
                              style={{
                                padding: isMobile ? '4px 8px' : '6px 12px',
                                backgroundColor: 'hsl(222.2 47.4% 11.2%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.15s ease',
                                fontFamily: 'system-ui'
                              }}
                            >
                              {isMobile ? 'Download' : 'Download Invoice'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Stats */}
            <div style={{
              width: isMobile ? '100%' : '400px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid hsl(240 5.9% 90%)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
              marginTop: isMobile ? '16px' : 0
            }}>
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid hsl(240 5.9% 90%)'
              }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'hsl(222.2 47.4% 11.2%)',
                  fontFamily: 'system-ui'
                }}>
                  Product Stats
                </h2>
              </div>

              <div style={{
                maxHeight: isMobile ? '400px' : 'calc(100vh - 300px)',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: 'hsl(0 0% 98%)',
                      borderBottom: '1px solid hsl(240 5.9% 90%)'
                    }}>
                      <th style={{ ...headerStyle }}>Product</th>
                      <th style={{ ...headerStyle, textAlign: 'right' }}>Sales</th>
                      <th style={{ ...headerStyle, textAlign: 'right' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productStats.map((stat) => (
                      <tr 
                        key={stat.id}
                        style={{
                          borderBottom: '1px solid hsl(240 5.9% 90%)',
                          backgroundColor: 'white',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'hsl(210 40% 98%)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        <td style={{ ...cellStyle }}>{stat.name}</td>
                        <td style={{ ...cellStyle, textAlign: 'right' }}>{stat.count}</td>
                        <td style={{ ...cellStyle, textAlign: 'right' }}>€{stat.totalRevenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const headerStyle = {
  padding: '12px 24px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: '500',
  color: 'hsl(215.4 16.3% 46.9%)',
  fontFamily: 'system-ui'
};

const cellStyle = {
  padding: '12px 24px',
  fontSize: '13px',
  color: 'hsl(222.2 47.4% 11.2%)',
  fontFamily: 'system-ui'
};

const StatsCard = ({ title, value }) => (
  <div style={{
    padding: '24px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid hsl(240 5.9% 90%)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  }}>
    <div style={{
      fontSize: '13px',
      fontWeight: '500',
      color: 'hsl(215.4 16.3% 46.9%)',
      marginBottom: '8px',
      fontFamily: 'system-ui'
    }}>
      {title}
    </div>
    <div style={{
      fontSize: '24px',
      fontWeight: '600',
      color: 'hsl(222.2 47.4% 11.2%)',
      fontFamily: 'system-ui'
    }}>
      €{value.toFixed(2)}
    </div>
  </div>
);

export default AdminSales; 