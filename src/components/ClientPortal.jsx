import React, { useState } from 'react';
import { getBookings, cancelBooking } from '../services/bookingStorageService.js';
import { createGoogleCalendarWebUrl, downloadIcsCalendarFile } from '../services/googleCalendarService.js';
import { Video, Calendar, Clock, Download, ExternalLink, Trash2, X, Plus, User, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ClientPortal({ isOpen, onClose, onOpenNewBooking }) {
  const [bookings, setBookings] = useState(getBookings());
  const [filter, setFilter] = useState('upcoming'); // 'all' | 'upcoming' | 'past' | 'cancelled'

  if (!isOpen) return null;

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this scheduled coaching session?')) {
      const updated = cancelBooking(id);
      setBookings(updated);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBookings = (bookings || []).filter(b => {
    if (!b) return false;
    if (filter === 'upcoming') return b.status !== 'Cancelled' && (b.date || '') >= todayStr;
    if (filter === 'past') return b.status !== 'Cancelled' && (b.date || '') < todayStr;
    if (filter === 'cancelled') return b.status === 'Cancelled';
    return true;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '880px', padding: '36px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-glass)' }}>
          <div>
            <div className="badge badge-gold" style={{ marginBottom: '6px' }}>
              <User size={14} /> Client & Executive Portal
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#FFF' }}>My Scheduled Coaching Sessions</h2>
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

        {/* Toolbar: Filter Tabs & New Booking CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['upcoming', 'all', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: filter === tab ? '1px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                  background: filter === tab ? 'rgba(212, 175, 55, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  color: filter === tab ? 'var(--text-gold)' : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {tab} ({bookings.filter(b => {
                  if (tab === 'upcoming') return b.status !== 'Cancelled' && b.date >= todayStr;
                  if (tab === 'cancelled') return b.status === 'Cancelled';
                  return true;
                }).length})
              </button>
            ))}
          </div>

          <button 
            onClick={() => { onClose(); onOpenNewBooking(); }}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            <span>Book New Session</span>
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(9, 13, 22, 0.5)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-glass)' }}>
            <Calendar size={42} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '6px' }}>No Sessions Found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              You do not currently have any active coaching calls under this view filter.
            </p>
            <button onClick={() => { onClose(); onOpenNewBooking(); }} className="btn btn-outline-gold btn-sm">
              Schedule Your First Session
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '520px', overflowY: 'auto' }}>
            {filteredBookings.map((b) => (
              <div 
                key={b.id}
                className="glass-card"
                style={{
                  padding: '24px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: b.status === 'Cancelled' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-glass)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className={`badge ${b.category?.includes('Executive') ? 'badge-indigo' : 'badge-gold'}`} style={{ fontSize: '0.68rem' }}>
                        {b.category}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ID: {b.id}</span>
                      {b.status === 'Cancelled' && (
                        <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.68rem' }}>
                          Cancelled
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>{b.sessionTitle}</h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={16} />
                      <span>{b.date} at {b.timeSlot}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Duration: {b.durationMinutes} mins</div>
                  </div>
                </div>

                {/* Intake Note snippet */}
                {b.notes && (
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    background: 'rgba(9, 13, 22, 0.6)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '16px',
                    borderLeft: '3px solid var(--accent-gold)'
                  }}>
                    <strong>Intake Note:</strong> {b.notes}
                  </div>
                )}

                {/* Google Meet & Actions strip */}
                {b.status !== 'Cancelled' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', pt: '12px', borderTop: '1px solid var(--border-glass)' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Video size={16} color="#38BDF8" />
                      <span style={{ fontSize: '0.85rem', color: '#38BDF8', fontWeight: '600' }}>
                        {b.googleMeetUrl}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <a 
                        href={b.googleMeetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        style={{ padding: '6px 14px' }}
                      >
                        <Video size={14} />
                        <span>Join Call</span>
                        <ExternalLink size={12} />
                      </a>

                      <a 
                        href={createGoogleCalendarWebUrl(b)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 12px' }}
                        title="Sync with Google Calendar"
                      >
                        <Calendar size={14} color="var(--accent-gold)" />
                        <span>Google Sync</span>
                      </a>

                      <button 
                        onClick={() => downloadIcsCalendarFile(b)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 12px' }}
                        title="Download .ics file"
                      >
                        <Download size={14} />
                        <span>.ICS</span>
                      </button>

                      <button 
                        onClick={() => handleCancel(b.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#FCA5A5',
                          padding: '6px 10px',
                          borderRadius: '9999px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem'
                        }}
                        title="Cancel Session"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
