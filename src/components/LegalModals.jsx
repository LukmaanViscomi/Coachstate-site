import React from 'react';
import { X, ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react';

export default function LegalModals({ activeModal, onClose }) {
  if (!activeModal) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '760px', padding: '36px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={22} color="var(--accent-gold)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', color: '#FFF' }}>
                {activeModal === 'terms' && 'Terms of Service'}
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'cookies' && 'Cookie & Data Policy'}
              </h2>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                Coachstate Executive & Personal Advisory (coachstate.online)
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-secondary)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.7', maxHeight: '60vh', overflowY: 'auto', paddingRight: '6px' }}>
          
          {activeModal === 'terms' && (
            <div>
              <h3 style={{ color: '#FFF', fontSize: '1.15rem', marginBottom: '10px' }}>1. Professional Coaching Agreement</h3>
              <p style={{ marginBottom: '16px' }}>
                All 1-on-1 personal life coaching, Neuro-Linguistic Programming (NLP) sessions, and executive business advisory services booked through Coachstate (coachstate.online) are conducted directly by <strong>Lukmaan</strong> (ANLP Master Trainer & Accredited Coach).
              </p>

              <h3 style={{ color: '#FFF', fontSize: '1.15rem', marginBottom: '10px' }}>2. Confidentiality & Code of Ethics</h3>
              <p style={{ marginBottom: '16px' }}>
                Lukmaan adheres strictly to the Association for Neuro-Linguistic Programming (ANLP) Code of Ethics. All client disclosures, session notes, and strategic business data discussed during coaching calls are held in strict 100% professional confidence.
              </p>

              <h3 style={{ color: '#FFF', fontSize: '1.15rem', marginBottom: '10px' }}>3. Rescheduling & Cancellation</h3>
              <p style={{ marginBottom: '16px' }}>
                Sessions may be rescheduled via the Client Portal up to 24 hours prior to the scheduled start time. Cancellations with less than 24 hours notice are subject to full forfeiture of the session fee.
              </p>

              <h3 style={{ color: '#FFF', fontSize: '1.15rem', marginBottom: '10px' }}>4. Video Conference & Calendar Integration</h3>
              <p style={{ marginBottom: '16px' }}>
                All virtual sessions utilize secure Google Meet video links generated via <code>lv@coachstate.online</code>. Clients are responsible for maintaining stable internet connectivity during scheduled video calls.
              </p>
            </div>
          )}

          {activeModal === 'privacy' && (
            <div>
              <h3 style={{ color: '#FFF', fontSize: '1.15rem', marginBottom: '10px' }}>1. Information We Collect</h3>
              <p style={{ marginBottom: '16px' }}>
                When booking a coaching session with Lukmaan, we collect your name, email address, job role, and session preparation notes. This data is used solely to facilitate your scheduled coaching calls and send Google Calendar event invites.
              </p>

              <h3 style={{ color: '#FFF', fontSize: '1.15rem', marginBottom: '10px' }}>2. How We Use Your Data</h3>
              <p style={{ marginBottom: '16px' }}>
                Your personal details are never sold, rented, or shared with third parties. Data is processed solely for calendar synchronization and client communication.
              </p>

              <h3 style={{ color: '#FFF', fontSize: '1.15rem', marginBottom: '10px' }}>3. Google API Data Compliance</h3>
              <p style={{ marginBottom: '16px' }}>
                Our integration with Google Calendar and Google Meet respects all Google API User Data Policies. Calendar access is restricted to creating and updating scheduled coaching events.
              </p>
            </div>
          )}

          {activeModal === 'cookies' && (
            <div>
              <h3 style={{ color: '#FFF', fontSize: '1.15rem', marginBottom: '10px' }}>1. Local Storage & Cookie Usage</h3>
              <p style={{ marginBottom: '16px' }}>
                Coachstate uses browser local storage and essential cookies to persist your active bookings, selected timezone preferences, and calendar integration settings.
              </p>

              <h3 style={{ color: '#FFF', fontSize: '1.15rem', marginBottom: '10px' }}>2. No Invasive Tracking</h3>
              <p style={{ marginBottom: '16px' }}>
                We do not employ invasive cross-site tracking cookies or third-party ad networks. All stored preferences remain strictly on your local browser.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)', textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            <span>I Understand</span>
          </button>
        </div>

      </div>
    </div>
  );
}
