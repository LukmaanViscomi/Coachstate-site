import React from 'react';

export default function CompanyLogo({ size = 'medium', showText = true }) {
  const dims = {
    small: { height: 44, fontSize: '1.2rem', subSize: '0.64rem' },
    medium: { height: 56, fontSize: '1.45rem', subSize: '0.72rem' },
    large: { height: 72, fontSize: '1.8rem', subSize: '0.85rem' }
  }[size] || { height: 56, fontSize: '1.45rem', subSize: '0.72rem' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}>
      <img 
        src="/assets/Coachstate_assets/icononly_transparent_nobuffer.png" 
        alt="Coachstate Shield Emblem" 
        style={{
          height: `${dims.height}px`,
          width: 'auto',
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 10px rgba(212, 175, 55, 0.3))'
        }}
      />
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: dims.fontSize,
            fontWeight: '800',
            letterSpacing: '0.05em',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F3E5AB 60%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1
          }}>
            COACHSTATE
          </div>
          <div className="logo-subtitle-desktop" style={{
            fontSize: dims.subSize,
            fontWeight: '700',
            letterSpacing: '0.14em',
            color: 'var(--accent-gold-light)',
            textTransform: 'uppercase',
            marginTop: '3px'
          }}>
            Executive & Personal Advisory
          </div>
        </div>
      )}
    </div>
  );
}
