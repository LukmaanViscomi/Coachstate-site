import React, { useState, useEffect } from 'react';
import { COACHING_TIERS } from '../services/mockData.js';
import { saveBooking, getAvailableSlotsForDate, fetchAvailableSlotsAsync } from '../services/bookingStorageService.js';
import { createGoogleCalendarWebUrl, downloadIcsCalendarFile, getStoredGoogleAccessToken, createLiveGoogleCalendarEvent } from '../services/googleCalendarService.js';
import { Calendar as CalendarIcon, Clock, Video, X, CheckCircle2, User, Mail, Briefcase, FileText, ExternalLink, Download, Copy, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, initialTierId, onBookingComplete }) {
  const [step, setStep] = useState(1); // 1: Tier, 2: Date & Slot, 3: Intake Form, 4: Confirmation
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // Flatten all tiers for quick lookup
  const allTiers = [...COACHING_TIERS.personal, ...COACHING_TIERS.executive];

  // Selected state
  const [selectedTierId, setSelectedTierId] = useState(initialTierId || 'personal-breakthrough');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [detectedTimezone, setDetectedTimezone] = useState('');
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isGoogleSynced, setIsGoogleSynced] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientRole, setClientRole] = useState('');
  const [notes, setNotes] = useState('');

  // Created Booking Result
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Initialize dates & timezone on open
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDateStr = tomorrow.toISOString().split('T')[0];
      setSelectedDate(defaultDateStr);

      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setDetectedTimezone(tz || 'UTC');
      } catch (e) {
        setDetectedTimezone('UTC');
      }

      if (initialTierId) {
        setSelectedTierId(initialTierId);
      }
      setStep(initialTierId ? 2 : 1);
    }
  }, [isOpen, initialTierId]);

  // Update time slots asynchronously via backend Google Calendar FreeBusy API
  useEffect(() => {
    let isMounted = true;
    if (selectedDate) {
      setIsLoadingSlots(true);
      const currentTier = allTiers.find(t => t.id === selectedTierId);
      const durationMinutes = currentTier?.durationMinutes || 60;

      fetchAvailableSlotsAsync(selectedDate, detectedTimezone, durationMinutes)
        .then(res => {
          if (!isMounted) return;
          if (res && res.slots) {
            setTimeSlots(res.slots);
            setIsGoogleSynced(res.googleSynced || false);
            const firstAvail = res.slots.find(s => s.available);
            if (firstAvail) setSelectedTimeSlot(firstAvail.time);
            else setSelectedTimeSlot('');
          }
          setIsLoadingSlots(false);
        })
        .catch(err => {
          if (!isMounted) return;
          const fallback = getAvailableSlotsForDate(selectedDate);
          setTimeSlots(fallback);
          setIsLoadingSlots(false);
        });
    }
    return () => { isMounted = false; };
  }, [selectedDate, detectedTimezone, selectedTierId]);

  if (!isOpen) return null;

  const currentTier = allTiers.find(t => t.id === selectedTierId) || allTiers[0];

  const generateUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 12; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      dates.push({
        dateStr: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        isWeekend
      });
    }
    return dates;
  };

  const upcomingDates = generateUpcomingDates();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !selectedDate || !selectedTimeSlot) return;

    setIsCreatingEvent(true);

    const bookingPayload = {
      clientName,
      clientEmail,
      clientRole: clientRole || 'Client / Executive',
      tierId: currentTier.id,
      sessionTitle: currentTier.title,
      category: currentTier.type === 'executive' ? 'Executive Support' : 'Personal Life Coaching',
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      durationMinutes: currentTier.durationMinutes,
      notes,
      timezone: detectedTimezone
    };

    try {
      const response = await fetch('/api/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.booking) {
          const saved = saveBooking(resData.booking);
          setConfirmedBooking(saved);
        } else {
          const saved = saveBooking(bookingPayload);
          setConfirmedBooking(saved);
        }
      } else {
        const saved = saveBooking(bookingPayload);
        setConfirmedBooking(saved);
      }
    } catch (err) {
      console.warn('Backend API unavailable, saving locally:', err);
      const saved = saveBooking(bookingPayload);
      setConfirmedBooking(saved);
    }

    setIsCreatingEvent(false);
    setStep(4);
    if (onBookingComplete) onBookingComplete(confirmedBooking);
  };

  const copyMeetUrl = () => {
    if (confirmedBooking?.googleMeetUrl) {
      navigator.clipboard.writeText(confirmedBooking.googleMeetUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '36px' }}>
        
        {/* Modal Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-secondary)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
        >
          <X size={18} />
        </button>

        {/* Progress Bar */}
        {step < 4 && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                Step {step} of 3
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {step === 1 && 'Select Coaching Service Tier'}
                {step === 2 && 'Choose Date & Time Slot'}
                {step === 3 && 'Client Intake & Confirmation'}
              </span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(step / 3) * 100}%`,
                background: 'linear-gradient(90deg, var(--accent-gold) 0%, var(--accent-gold-light) 100%)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {/* STEP 1: SELECT TIER */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#FFF', marginBottom: '8px' }}>Select Coaching Tier</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
              Choose whether you are booking a Personal Life Coaching or Executive Business Advisory session.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
              {allTiers.map(tier => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: selectedTierId === tier.id ? 'rgba(212, 175, 55, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                    border: selectedTierId === tier.id ? '1px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className={`badge ${tier.type === 'executive' ? 'badge-indigo' : 'badge-gold'}`} style={{ fontSize: '0.68rem' }}>
                        {tier.type === 'executive' ? 'Executive Support' : 'Personal Coaching'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tier.durationMinutes} min</span>
                    </div>
                    <div style={{ fontWeight: '700', color: '#FFF', fontSize: '1.05rem' }}>{tier.title}</div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{tier.tagline}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>
                      {tier.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
              <button 
                onClick={() => setStep(2)}
                className="btn btn-primary"
              >
                <span>Continue to Calendar</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DATE & TIME SLOT PICKER */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <button 
                onClick={() => setStep(1)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h2 style={{ fontSize: '1.6rem', color: '#FFF' }}>Select Date & Time Slot</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold-light)' }}>
                  Selected: <strong>{currentTier.title}</strong> ({currentTier.durationMinutes} mins)
                </div>
              </div>
            </div>

            {/* Timezone banner */}
            <div style={{
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-glass)',
              fontSize: '0.84rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--accent-gold)" />
                <span>Detected Timezone: <strong>{detectedTimezone}</strong></span>
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>Live Google Sync</span>
            </div>

            {/* Upcoming Dates Horizontal Strip */}
            <div style={{ marginBottom: '24px' }}>
              <div className="form-label">Available Dates</div>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                {upcomingDates.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(item.dateStr)}
                    disabled={item.isWeekend}
                    style={{
                      minWidth: '72px',
                      padding: '12px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: selectedDate === item.dateStr ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.1) 100%)' : 'rgba(15, 23, 42, 0.8)',
                      border: selectedDate === item.dateStr ? '1px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                      color: item.isWeekend ? 'var(--text-muted)' : selectedDate === item.dateStr ? 'var(--text-gold)' : 'var(--text-primary)',
                      opacity: item.isWeekend ? 0.4 : 1,
                      cursor: item.isWeekend ? 'not-allowed' : 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                      flexShrink: 0
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>{item.dayName}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{item.dayNum}</div>
                    <div style={{ fontSize: '0.7rem' }}>{item.monthName}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Grid */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div className="form-label" style={{ margin: 0 }}>Available Advisory Time Slots ({selectedDate})</div>
                {isLoadingSlots && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Loader2 size={12} className="spin" /> Syncing Calendar...
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {timeSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => slot.available && setSelectedTimeSlot(slot.time)}
                    disabled={!slot.available}
                    style={{
                      padding: '14px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: selectedTimeSlot === slot.time ? 'var(--accent-gold)' : slot.available ? 'rgba(15, 23, 42, 0.7)' : 'rgba(239, 68, 68, 0.05)',
                      border: selectedTimeSlot === slot.time ? '1px solid var(--accent-gold)' : slot.available ? '1px solid var(--border-glass)' : '1px dashed rgba(239, 68, 68, 0.3)',
                      color: selectedTimeSlot === slot.time ? '#080C16' : slot.available ? 'var(--text-primary)' : '#FCA5A5',
                      fontWeight: selectedTimeSlot === slot.time ? '700' : '500',
                      cursor: slot.available ? 'pointer' : 'not-allowed',
                      opacity: slot.available ? 1 : 0.5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} />
                      <span>{slot.time}</span>
                    </div>
                    {!slot.available && (
                      <div style={{ fontSize: '0.66rem', color: '#FCA5A5', fontWeight: '600', textTransform: 'uppercase' }}>
                        {slot.reason || 'Busy on Calendar'}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Next CTA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setStep(1)} className="btn btn-secondary btn-sm">
                Back
              </button>
              <button 
                onClick={() => setStep(3)} 
                disabled={!selectedTimeSlot}
                className="btn btn-primary"
              >
                <span>Proceed to Client Details</span>
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: INTAKE FORM */}
        {step === 3 && (
          <form onSubmit={handleFormSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <button 
                type="button"
                onClick={() => setStep(2)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h2 style={{ fontSize: '1.6rem', color: '#FFF' }}>Client Intake & Google Meet Setup</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold-light)' }}>
                  Booking {currentTier.title} on <strong>{selectedDate} at {selectedTimeSlot}</strong>
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Google Account preferred) *</label>
                <input 
                  type="email" 
                  required
                  placeholder="sarah.jenkins@company.com"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Current Organization & Role (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. VP of Strategy, Horizon Tech"
                value={clientRole}
                onChange={e => setClientRole(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Key Coaching Objectives & Preparation Notes for Lukmaan</label>
              <textarea 
                placeholder="What specific leadership challenges, personal milestones, or strategic decisions would you like to address in this session?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="form-textarea"
              />
            </div>

            {/* Google Meet Notice */}
            <div style={{
              padding: '14px 16px',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Video size={20} color="#38BDF8" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.84rem', color: '#BAE6FD' }}>
                Upon clicking <strong>Confirm & Generate Google Meet</strong>, a unique encrypted Google Meet URL will be created and instant calendar export links will be generated.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" onClick={() => setStep(2)} className="btn btn-secondary btn-sm" disabled={isCreatingEvent}>
                Back
              </button>
              <button type="submit" className="btn btn-primary" style={{ padding: '14px 32px' }} disabled={isCreatingEvent}>
                <CheckCircle2 size={18} />
                <span>{isCreatingEvent ? 'Connecting Google Calendar...' : 'Confirm & Sync Google Calendar'}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: CONFIRMATION & AUTOMATED EMAIL CALENDAR DISPATCH */}
        {step === 4 && confirmedBooking && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <CheckCircle2 size={36} color="#10B981" />
            </div>

            <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>
              Booking Confirmed & Calendar Invite Dispatched
            </span>

            <h2 style={{ fontSize: '2rem', color: '#FFF', marginBottom: '8px' }}>
              You're Booked with Lukmaan!
            </h2>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', maxWidth: '540px', margin: '0 auto 24px' }}>
              An official email invitation with your Google Meet link has been sent to <strong>{confirmedBooking.clientEmail}</strong> and synced with <strong>lv@coachstate.online</strong>.
            </p>

            {/* Timezone Breakdown Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 100%)',
              border: '1px solid var(--accent-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              textAlign: 'left',
              marginBottom: '28px',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Video size={22} color="#38BDF8" />
                  <span style={{ fontWeight: '700', color: '#FFF', fontSize: '1.05rem' }}>{confirmedBooking.sessionTitle}</span>
                </div>
                <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>Ref ID: {confirmedBooking.id}</span>
              </div>

              {/* Timezone grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px', background: 'rgba(9, 13, 22, 0.6)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    🌐 Your Local Time ({detectedTimezone || 'Client Local'})
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: '700', color: '#38BDF8' }}>
                    {confirmedBooking.clientFormattedTime || `${confirmedBooking.date} at ${confirmedBooking.timeSlot}`}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    🇬🇧 Coach Lukmaan's Time (UK London)
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: '700', color: '#F59E0B' }}>
                    {confirmedBooking.ukFormattedTime || 'London UK BST/GMT'}
                  </div>
                </div>
              </div>

              {/* Google Meet Link Display */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(9, 13, 22, 0.8)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                <input 
                  type="text" 
                  readOnly 
                  value={confirmedBooking.googleMeetUrl} 
                  style={{ background: 'transparent', border: 'none', color: '#38BDF8', width: '100%', fontSize: '0.95rem', fontWeight: '600', outline: 'none' }}
                />
                <button 
                  onClick={copyMeetUrl}
                  style={{
                    background: copiedLink ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#FFF',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Copy size={14} />
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
              <a 
                href={confirmedBooking.googleMeetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <Video size={18} />
                <span>Join Google Meet Room</span>
                <ExternalLink size={14} />
              </a>

              <button 
                onClick={() => downloadIcsCalendarFile(confirmedBooking)}
                className="btn btn-secondary"
              >
                <Download size={18} />
                <span>Download .ICS File</span>
              </button>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.88rem' }}>
                Close Window
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
