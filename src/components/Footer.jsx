import React from 'react';
import CompanyLogo from './CompanyLogo.jsx';
import { Calendar, Video, ShieldCheck, Mail, Globe, Lock } from 'lucide-react';

export default function Footer({ onOpenBooking, onOpenGoogleSettings, onOpenLegalModal }) {
  return (
    <footer style={{
      background: '#060911',
      borderTop: '1px solid var(--border-glass)',
      padding: '60px 0 30px',
      color: 'var(--text-secondary)',
      fontSize: '0.9rem'
    }}>
      <div className="container">
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr', gap: '40px', marginBottom: '48px' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <CompanyLogo size="medium" />
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
              Coachstate Executive & Personal Advisory by Lukmaan. ANLP Registered Trainer & Coach since 2012.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="badge badge-gold">
              <Lock size={12} /> ANLP Accredited Code of Ethics
            </div>
          </div>

          {/* Nav Services */}
          <div>
            <div style={{ color: '#FFF', fontWeight: '700', marginBottom: '16px', fontSize: '0.95rem' }}>Personal Coaching</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="#services" onClick={() => onOpenBooking('personal-discovery')} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Discovery Call with Lukmaan</a></li>
              <li><a href="#services" onClick={() => onOpenBooking('personal-breakthrough')} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>NLP Mindset Breakthrough</a></li>
              <li><a href="#services" onClick={() => onOpenBooking('personal-transform')} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>3-Month ANLP Program</a></li>
            </ul>
          </div>

          {/* Executive Support */}
          <div>
            <div style={{ color: '#FFF', fontWeight: '700', marginBottom: '16px', fontSize: '0.95rem' }}>Executive Advisory</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="#services" onClick={() => onOpenBooking('exec-advisory')} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>C-Suite Leadership Advisory</a></li>
              <li><a href="#services" onClick={() => onOpenBooking('exec-retainer')} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Monthly Executive Retainer</a></li>
              <li><a href="#services" onClick={() => onOpenBooking('exec-workshop')} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Team Leadership Intensive</a></li>
            </ul>
          </div>

          {/* Direct Advisory & Booking */}
          <div>
            <div style={{ color: '#FFF', fontWeight: '700', marginBottom: '16px', fontSize: '0.95rem' }}>Direct Advisory & Booking</div>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4AF37', fontWeight: '600', fontSize: '0.84rem', marginBottom: '6px' }}>
                <ShieldCheck size={14} /> Confidential & Direct
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Confidential 1-on-1 advisory sessions directly with Lukmaan for founders and C-Suite leaders.
              </div>
            </div>
            <button onClick={() => onOpenBooking()} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              <Calendar size={14} />
              <span>Book Session Now</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ pt: '24px', borderTop: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <div>
            © {new Date().getFullYear()} Coachstate (`coachstate.online`). All rights reserved. Registered ANLP Trainer.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={() => onOpenLegalModal('privacy')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Privacy Policy</button>
            <button onClick={() => onOpenLegalModal('terms')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Terms of Advisory</button>
            <button onClick={() => onOpenLegalModal('cookies')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Cookie Policy</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
