import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Coachstate Render Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#080C16',
          color: '#FFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'sans-serif'
        }}>
          <h2 style={{ color: '#D4AF37', marginBottom: '12px' }}>Coachstate Advisory Diagnostics</h2>
          <p style={{ color: '#FCA5A5', marginBottom: '16px', maxWidth: '600px', lineHeight: '1.6', fontFamily: 'monospace', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {this.state.error?.toString() || 'Unknown Error'}
          </p>
          <pre style={{ fontSize: '0.72rem', color: '#94A3B8', textAlign: 'left', maxWidth: '700px', overflowX: 'auto', background: '#0F172A', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
            {this.state.error?.stack || 'No stack trace'}
          </pre>
          <button 
            onClick={() => {
              try { localStorage.clear(); } catch(e) {}
              window.location.reload();
            }}
            style={{
              padding: '12px 24px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #0F172A 100%)',
              color: '#FFF',
              border: '1px solid #D4AF37',
              cursor: 'pointer',
              fontWeight: '700'
            }}
          >
            Reset Session & Restore Site
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
