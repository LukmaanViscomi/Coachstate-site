import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Unlock, Calendar, Clock, Video, User, Mail, Search, RefreshCw, X, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { getBookings } from '../services/bookingStorageService.js';

export default function FounderDashboard({ isOpen, onClose }) {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passError, setPassError] = useState('');
  const [allBookings, setAllBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  // Fetch all bookings from Express backend or local storage fallback
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/all-bookings');
      if (res.ok) {
        const data = await res.json();
        if (data.bookings) {
          setAllBookings(data.bookings);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend fetch failed, falling back to local storage:', e);
    }
    setAllBookings(getBookings());
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode.trim() === '2026' || passcode.trim() === 'coach2026') {
      setIsAuthenticated(true);
      setPassError('');
    } else {
      setPassError('Incorrect PIN passcode. Please enter your valid Founder PIN.');
    }
  };

  const handleCancelSession = async (id) => {
    if (window.confirm('Are you sure you want to cancel this client session?')) {
      try {
        await fetch('/api/cancel-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      } catch (e) {
        console.warn('Backend cancel failed, updating locally:', e);
      }
      setAllBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    }
  };

  const filteredBookings = allBookings.filter(b => {
    const matchesSearch = 
      b.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.sessionTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'confirmed') return matchesSearch && b.status === 'Confirmed';
    if (filterStatus === 'cancelled') return matchesSearch && b.status === 'Cancelled';
    return matchesSearch;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '980px', padding: '36px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-glass)' }}>
          <div>
            <div className="badge badge-gold" style={{ marginBottom: '6px' }}>
              <ShieldCheck size={14} /> Executive & Founder Portal
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#FFF', margin: 0 }}>Lukmaan's Executive Advisory Dashboard</h2>
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

        {/* Passcode Authentication Form */}
        {!isAuthenticated ? (
          <div style={{ maxWidth: '420px', margin: '40px auto', textAlign: 'center', background: 'rgba(9, 13, 22, 0.7)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-gold)' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Lock size={26} color="var(--accent-gold)" />
            </div>

            <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '8px' }}>Founder Authentication</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Please enter your private passcode PIN to access all client bookings & advisory calendar data.
            </p>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}>
                <input 
                  type="password" 
                  placeholder="Enter Passcode PIN (Default: 2026)"
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid var(--border-glass)',
                    color: '#FFF',
                    fontSize: '1rem',
                    textAlign: 'center',
                    letterSpacing: '0.2em',
                    outline: 'none'
                  }}
                  autoFocus
                />
              </div>

              {passError && (
                <div style={{ fontSize: '0.82rem', color: '#FCA5A5', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <AlertCircle size={14} />
                  <span>{passError}</span>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Unlock size={16} />
                <span>Unlock Founder Dashboard</span>
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Top Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(9, 13, 22, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Bookings</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--accent-gold)' }}>{allBookings.length}</div>
              </div>
              <div style={{ background: 'rgba(9, 13, 22, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Confirmed Sessions</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#6EE7B7' }}>{allBookings.filter(b => b.status !== 'Cancelled').length}</div>
              </div>
              <div style={{ background: 'rgba(9, 13, 22, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Cancelled</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#FCA5A5' }}>{allBookings.filter(b => b.status === 'Cancelled').length}</div>
              </div>
              <div style={{ background: 'rgba(9, 13, 22, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#FFF', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span className="pulse-dot" style={{ width: '6px', height: '6px' }} /> Live Sync
                </div>
              </div>
            </div>

            {/* Filter & Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '400px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="Search clients by name, email, or session..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: '9999px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid var(--border-glass)',
                      color: '#FFF',
                      fontSize: '0.86rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={fetchBookings}
                  className="btn btn-outline-gold btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCw size={14} className={loading ? 'spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Bookings Table / Cards */}
            {filteredBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(9, 13, 22, 0.5)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-glass)' }}>
                <Calendar size={42} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '6px' }}>No Client Sessions Found</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  No client bookings match your current search criteria.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '540px', overflowY: 'auto' }}>
                {filteredBookings.map(b => (
                  <div 
                    key={b.id} 
                    className="glass-card" 
                    style={{
                      padding: '24px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(15, 23, 42, 0.75)',
                      border: b.status === 'Cancelled' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-glass)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>{b.category || 'Client Booking'}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ID: {b.id}</span>
                          {b.status === 'Cancelled' ? (
                            <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.68rem' }}>
                              Cancelled
                            </span>
                          ) : (
                            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.68rem' }}>
                              Confirmed
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '4px' }}>{b.sessionTitle}</h3>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFF', fontWeight: '600' }}>
                            <User size={14} color="var(--accent-gold)" /> {b.clientName}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Mail size={14} /> {b.clientEmail}
                          </span>
                          {b.clientRole && (
                            <span style={{ color: 'var(--text-muted)' }}>Role: {b.clientRole}</span>
                          )}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={16} />
                          <span>{b.date} at {b.timeSlot}</span>
                        </div>
                        {b.ukFormattedTime && (
                          <div style={{ fontSize: '0.78rem', color: '#6EE7B7', marginTop: '3px' }}>
                            🇬🇧 UK BST: {b.ukFormattedTime}
                          </div>
                        )}
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Duration: {b.durationMinutes || 60} mins</div>
                      </div>
                    </div>

                    {/* Intake Notes */}
                    {b.notes && (
                      <div style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        background: 'rgba(9, 13, 22, 0.6)',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px dashed var(--border-glass)',
                        marginBottom: '16px'
                      }}>
                        <strong style={{ color: 'var(--text-gold)' }}>Client Intake Notes: </strong>
                        <span>"{b.notes}"</span>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {b.googleMeetUrl && (
                          <a 
                            href={b.googleMeetUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm"
                            style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.8rem' }}
                          >
                            <Video size={14} />
                            <span>Join Video Call</span>
                          </a>
                        )}
                      </div>

                      {b.status !== 'Cancelled' && (
                        <button 
                          onClick={() => handleCancelSession(b.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#FCA5A5',
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Cancel Session</span>
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
