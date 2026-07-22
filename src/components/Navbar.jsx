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
            About Evelyn
          </a>
          <a href="#testimonials" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.92rem', fontWeight: '500', transition: 'color 0.2s' }}
             onMouseEnter={e => e.target.style.color = 'var(--text-gold)'}
             onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
            Client Results
          </a>

          {/* Integration Status Button */}
          <button 
            onClick={onOpenGoogleSettings}
            className="badge badge-emerald" 
            style={{ cursor: 'pointer', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 14px' }}
            title="Google Calendar & Meet Sync (lv@coachstate.online)"
          >
            <Video size={14} color="#10B981" />
            <span style={{ fontSize: '0.78rem' }}>Google Calendar & Meet Synced</span>
            <Settings size={12} style={{ marginLeft: '4px', opacity: 0.8 }} />
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="nav-actions-mobile" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            onClick={onOpenPortal}
            className="btn btn-secondary btn-sm"
            style={{ position: 'relative' }}
          >
            <UserCheck size={16} />
            <span>My Bookings</span>
            {bookingCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'var(--accent-gold)',
                color: '#080C16',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.72rem',
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
            className="btn btn-primary btn-sm"
          >
            <Calendar size={16} />
            <span>Book Coaching Session</span>
          </button>
        </div>
      </div>
    </header>
  );
}
