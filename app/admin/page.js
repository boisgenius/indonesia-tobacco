'use client';

import { useState, useEffect } from 'react';

export default function Admin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/subscribe')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#FFF',
      fontFamily: 'Inter, sans-serif',
      padding: '40px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;900&display=swap');
      `}</style>
      
      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
        EMAIL SUBSCRIBERS
      </h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : data?.error ? (
        <p style={{ color: '#FF6B6B' }}>Error: {data.error}</p>
      ) : (
        <>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Total: {data?.count || 0} subscribers
          </p>
          
          <div style={{ 
            background: '#111', 
            borderRadius: '10px', 
            padding: '20px',
            maxWidth: '600px'
          }}>
            {data?.emails?.length > 0 ? (
              data.emails.map((email, i) => (
                <div key={i} style={{
                  padding: '12px 0',
                  borderBottom: i < data.emails.length - 1 ? '1px solid #333' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span>{email}</span>
                  <span style={{ color: '#666', fontSize: '0.8rem' }}>
                    {data.details?.[email]?.split('T')[0] || ''}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: '#666' }}>No subscribers yet</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
