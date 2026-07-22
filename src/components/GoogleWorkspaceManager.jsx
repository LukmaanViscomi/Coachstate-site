import React, { useState } from 'react';
import { getGoogleWorkspaceConfig, saveGoogleWorkspaceConfig } from '../services/googleCalendarService.js';
import { Video, CheckCircle2, Save, X, Calendar, Sparkles } from 'lucide-react';

export default function GoogleWorkspaceManager({ isOpen, onClose }) {
  const [config, setConfig] = useState(getGoogleWorkspaceConfig());
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveGoogleWorkspaceConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', padding: '32px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Video size={22} color="#10B981" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', color: '#FFF' }}>Google Calendar & Meet Setup</h2>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                Target Google Account: <strong>lv@coachstate.online</strong>
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

        {/* Friendly Explanation Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <CheckCircle2 size={20} color="#10B981" />
            <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#FFF' }}>
              How Google Calendar Sync Works
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '14px' }}>
            Whenever a client books a session on <strong>coachstate.online</strong>:
          </p>

          <ol style={{ color: 'var(--text-primary)', fontSize: '0.88rem', paddingLeft: '20px', lineHeight: '1.7' }}>
            <li>A booking confirmation is instantly created with the client's name and details.</li>
            <li>Clicking <strong>"Add to Google Calendar"</strong> opens Google Calendar for <strong>lv@coachstate.online</strong> with the client's email pre-filled as a guest.</li>
            <li>Clicking <strong>Save</strong> in Google Calendar officially creates the real event, attaches an active Google Meet link, and sends the email invite to your client!</li>
          </ol>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Your Google Account Email for Bookings</label>
            <input 
              type="email" 
              required
              value={config.googleAccountEmail}
              onChange={e => setConfig({ ...config, googleAccountEmail: e.target.value })}
              placeholder="lv@coachstate.online"
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: '12px', borderTop: '1px solid var(--border-glass)' }}>
            {saveSuccess && (
              <span style={{ fontSize: '0.85rem', color: '#6EE7B7', fontWeight: '600' }}>
                ✓ Saved for {config.googleAccountEmail}!
              </span>
            )}
            <button type="submit" className="btn btn-primary" style={{ marginLeft: 'auto' }}>
              <Save size={16} />
              <span>Save Email Settings</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
