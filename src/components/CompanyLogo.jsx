import React, { useState } from 'react';

export default function CompanyLogo({ size = 'medium', showText = true }) {
  const [imgError, setImgError] = useState(false);

  const dims = {
    small: { height: 48, icon: 38, maxWidth: '220px' },
    medium: { height: 64, icon: 50, maxWidth: '280px' },
    large: { height: 84, icon: 66, maxWidth: '340px' }
  }[size] || { height: 64, icon: 50, maxWidth: '280px' };

  // Use official transparent website logo with no buffer
  const logoSrc = showText 
    ? '/assets/Coachstate_assets/fulllogo_transparent_nobuffer.png'
    : '/assets/Coachstate_assets/icononly_transparent_nobuffer.png';

  if (!imgError) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <img 
          src={logoSrc} 
          alt="Coachstate Executive & Personal Advisory" 
          onError={() => setImgError(true)}
          style={{
            height: `${dims.height}px`,
            maxWidth: dims.maxWidth,
            objectFit: 'contain',
            filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.4))'
          }}
        />
      </div>
    );
  }

  // Fallback SVG emblem if image path changes
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
      <div style={{
        width: `${dims.height}px`,
        height: `${dims.height}px`,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #E5C158 0%, #D4AF37 40%, #0F172A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--accent-gold)',
        boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#0F172A" strokeWidth="2.2" />
          <path d="M2 17L12 22L22 17" stroke="#FFF" strokeWidth="2" />
          <path d="M2 12L12 17L22 12" stroke="#F3E5AB" strokeWidth="2" />
        </svg>
      </div>
      {showText && (
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: '700', color: '#FFF' }}>
            COACHSTATE
          </div>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--accent-gold-light)' }}>
            Executive & Personal Advisory
          </div>
        </div>
      )}
    </div>
  );
}
