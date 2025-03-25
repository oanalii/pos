import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { name: 'General', path: '/admin/sales', icon: Dashboard },
    { name: 'Product Stats', path: '/admin/product-stats', icon: BarChart },
    { name: 'Gaudi', path: '/admin/sales/gaudi', icon: Store },
    { name: 'Paralel', path: '/admin/sales/paralel', icon: Store },
    { name: 'Mallorca', path: '/admin/sales/mallorca', icon: Store },
    { name: 'Consell', path: '/admin/sales/consell', icon: Store },
    { name: 'Hospital', path: '/admin/sales/hospital', icon: Store }
  ];

  return (
    <div style={{
      width: '240px',
      height: '100vh',
      borderRight: '1px solid hsl(240 5.9% 90%)',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      left: 0
    }}>
      <div style={{
        padding: '24px',
        borderBottom: '1px solid hsl(240 5.9% 90%)'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'hsl(222.2 47.4% 11.2%)',
          margin: 0,
          fontFamily: 'system-ui',
          letterSpacing: '-0.025em'
        }}>
          HGT Admin
        </h2>
        <p style={{
          fontSize: '13px',
          color: 'hsl(215.4 16.3% 46.9%)',
          margin: '6px 0 0 0',
          fontFamily: 'system-ui'
        }}>
          Sales & Inventory Management
        </p>
      </div>
      
      <div style={{
        padding: '16px 8px',
        flex: 1,
        overflowY: 'auto'
      }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 12px',
              borderRadius: '6px',
              marginBottom: '4px',
              textDecoration: 'none',
              color: location.pathname === item.path 
                ? 'hsl(222.2 47.4% 11.2%)' 
                : 'hsl(215.4 16.3% 46.9%)',
              backgroundColor: location.pathname === item.path 
                ? 'hsl(210 40% 98%)' 
                : 'transparent',
              fontFamily: 'system-ui',
              fontSize: '14px',
              fontWeight: location.pathname === item.path ? '500' : 'normal',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.backgroundColor = 'hsl(0 0% 97%)';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{
              display: 'flex',
              marginRight: '12px',
              color: location.pathname === item.path 
                ? 'hsl(222.2 47.4% 11.2%)' 
                : 'hsl(215.4 16.3% 46.9%)'
            }}>
              {item.name === 'General' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="7" height="7" x="3" y="3" rx="1"/>
                  <rect width="7" height="7" x="14" y="3" rx="1"/>
                  <rect width="7" height="7" x="14" y="14" rx="1"/>
                  <rect width="7" height="7" x="3" y="14" rx="1"/>
                </svg>
              ) : item.name === 'Product Stats' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18"/>
                  <path d="m19 9-5 5-4-4-3 3"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
                  <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/>
                  <path d="M12 3v6"/>
                </svg>
              )}
            </span>
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="7" height="7" x="3" y="3" rx="1"/>
      <rect width="7" height="7" x="14" y="3" rx="1"/>
      <rect width="7" height="7" x="14" y="14" rx="1"/>
      <rect width="7" height="7" x="3" y="14" rx="1"/>
    </svg>
  );
}

function BarChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18"/>
      <path d="m19 9-5 5-4-4-3 3"/>
    </svg>
  );
}

function Store() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/>
      <path d="M12 3v6"/>
    </svg>
  );
}

export default Sidebar; 