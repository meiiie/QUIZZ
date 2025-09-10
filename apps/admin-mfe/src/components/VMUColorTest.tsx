import React from 'react';

const VMUColorTest: React.FC = () => {
  return (
    <div style={{ padding: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      {/* Primary Colors */}
      <div style={{ textAlign: 'center' }}>
        <h3>Primary Colors</h3>
        <div style={{ 
          background: 'var(--vmu-primary)', 
          color: 'var(--vmu-white)', 
          padding: '1rem', 
          borderRadius: 'var(--vmu-radius-md)',
          marginBottom: '0.5rem'
        }}>
          Primary (#003e80)
        </div>
        <div style={{ 
          background: 'var(--vmu-secondary)', 
          color: 'var(--vmu-white)', 
          padding: '1rem', 
          borderRadius: 'var(--vmu-radius-md)',
          marginBottom: '0.5rem'
        }}>
          Secondary (#00a0e3)
        </div>
        <div style={{ 
          background: 'var(--vmu-accent)', 
          color: 'var(--vmu-text)', 
          padding: '1rem', 
          borderRadius: 'var(--vmu-radius-md)'
        }}>
          Accent (#ffc20e)
        </div>
      </div>

      {/* Neutral Colors */}
      <div style={{ textAlign: 'center' }}>
        <h3>Neutral Colors</h3>
        <div style={{ 
          background: 'var(--vmu-white)', 
          color: 'var(--vmu-text)', 
          padding: '1rem', 
          borderRadius: 'var(--vmu-radius-md)',
          border: '1px solid #e5e5e5',
          marginBottom: '0.5rem'
        }}>
          White (#ffffff)
        </div>
        <div style={{ 
          background: 'var(--vmu-gray)', 
          color: 'var(--vmu-text)', 
          padding: '1rem', 
          borderRadius: 'var(--vmu-radius-md)',
          marginBottom: '0.5rem'
        }}>
          Gray (#f5f5f5)
        </div>
        <div style={{ 
          background: 'var(--vmu-text)', 
          color: 'var(--vmu-white)', 
          padding: '1rem', 
          borderRadius: 'var(--vmu-radius-md)',
          marginBottom: '0.5rem'
        }}>
          Text (#333333)
        </div>
        <div style={{ 
          background: 'var(--vmu-text-light)', 
          color: 'var(--vmu-white)', 
          padding: '1rem', 
          borderRadius: 'var(--vmu-radius-md)'
        }}>
          Text Light (#666666)
        </div>
      </div>

      {/* Gradients */}
      <div style={{ textAlign: 'center' }}>
        <h3>Gradients</h3>
        <div style={{ 
          background: 'var(--vmu-gradient)', 
          color: 'var(--vmu-white)', 
          padding: '1rem', 
          borderRadius: 'var(--vmu-radius-md)',
          marginBottom: '0.5rem'
        }}>
          Primary Gradient
        </div>
        <div style={{ 
          background: 'var(--vmu-gradient-accent)', 
          color: 'var(--vmu-text)', 
          padding: '1rem', 
          borderRadius: 'var(--vmu-radius-md)'
        }}>
          Accent Gradient
        </div>
      </div>

      {/* Shadows */}
      <div style={{ textAlign: 'center' }}>
        <h3>Shadows</h3>
        <div style={{ 
          background: 'var(--vmu-white)', 
          color: 'var(--vmu-text)', 
          padding: '1rem', 
          borderRadius: 'var(--vmu-radius-md)',
          boxShadow: 'var(--vmu-shadow-sm)',
          marginBottom: '0.5rem'
        }}>
          Small Shadow
        </div>
        <div style={{ 
          background: 'var(--vmu-white)', 
          color: 'var(--vmu-text)', 
          padding: '1rem', 
          borderRadius: 'var(--vmu-radius-md)',
          boxShadow: 'var(--vmu-shadow-md)',
          marginBottom: '0.5rem'
        }}>
          Medium Shadow
        </div>
        <div style={{ 
          background: 'var(--vmu-white)', 
          color: 'var(--vmu-text)', 
          padding: '1rem', 
          borderRadius: 'var(--vmu-radius-md)',
          boxShadow: 'var(--vmu-shadow-lg)'
        }}>
          Large Shadow
        </div>
      </div>
    </div>
  );
};

export default VMUColorTest;
