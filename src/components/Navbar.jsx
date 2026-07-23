import React from 'react';
import CompanyLogo from './CompanyLogo.jsx';
import { Calendar, Video, ShieldCheck, UserCheck, Settings } from 'lucide-react';

export default function Navbar({ onOpenBooking, onOpenPortal, onOpenGoogleSettings, activeTab, bookingCount }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      padding: '16px 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <CompanyLogo size="medium" />
        </div>

        {/* Navigation Links */}
        <nav className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <a href="#services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.92rem', fontWeight: '500', transition: 'color 0.2s' }}
             onMouseEnter={e => e.target.style.color = 'var(--text-gold)'}
             onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
            Personal & Exec Services
          </a>
          <a href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.92rem', fontWeight: '500', transition: 'color 0.2s' }}
             onMouseEnter={e => e.target.style.color = 'var(--text-gold)'}
             onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
            About Founder
          </a>
          <a href="#testimonials" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.92rem', fontWeight: '500', transition: 'color 0.2s' }}
             onMouseEnter={e => e.target.style.color = 'var(--text-gold)'}
             onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
            Client Results
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="nav-actions-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={onOpenPortal}
            className="btn btn-secondary btn-sm nav-btn-compact"
            style={{ position: 'relative' }}
          >
            <UserCheck size={15} />
            <span className="btn-text-desktop">My Bookings</span>
            <span className="btn-text-mobile">Bookings</span>
            {bookingCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'var(--accent-gold)',
                color: '#080C16',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '0.68rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {bookingCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => onOpenBooking()} 
            className="btn btn-primary btn-sm nav-btn-compact"
          >
            <Calendar size={15} />
            <span className="btn-text-desktop">Book Session</span>
            <span className="btn-text-mobile">Book</span>
          </button>
        </div>
      </div>
    </header>
  );
}
