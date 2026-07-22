import React, { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';

export default function CookieBanner({ onOpenPolicy }) {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('coachstate_cookie_consent');
    if (!consent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('coachstate_cookie_consent', 'accepted');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div 
      className="cookie-banner-floating"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 10000,
        maxWidth: '440px',
        width: 'calc(100% - 48px)',
        background: 'rgba(15, 23, 42, 0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--accent-gold)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-modal)',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
        <Cookie size={22} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontSize: '1rem', color: '#FFF', marginBottom: '4px' }}>Cookie & Privacy Preference</h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            We use essential local storage to remember your time zone, calendar preferences, and scheduled coaching calls with Lukmaan.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <button 
          onClick={onOpenPolicy}
          style={{ background: 'none', border: 'none', color: 'var(--text-gold)', textDecoration: 'underline', fontSize: '0.82rem', cursor: 'pointer' }}
        >
          Read Cookie Policy
        </button>

        <button 
          onClick={handleAccept}
          className="btn btn-primary btn-sm"
          style={{ padding: '6px 16px', fontSize: '0.82rem' }}
        >
          <Check size={14} />
          <span>Accept Essential</span>
        </button>
      </div>
    </div>
  );
}
