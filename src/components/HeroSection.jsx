import React from 'react';
import { Calendar, Video, ShieldCheck, ArrowRight, Award, Clock, CheckCircle2 } from 'lucide-react';
import { COACH_INFO } from '../services/mockData.js';

export default function HeroSection({ onOpenBooking }) {
  return (
    <section className="section" style={{ paddingTop: '50px', paddingBottom: '70px', position: 'relative' }}>
      <div className="container">
        <div className="hero-grid">
          
          {/* Hero Left Content */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span className="badge badge-gold" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={14} /> Accredited NLP Master Practitioner & ANLP member
              </span>
            </div>

            <h1 style={{ fontSize: '3.4rem', lineHeight: '1.15', fontWeight: '700', marginBottom: '24px' }}>
              Elevate Your <span className="text-gradient-gold">Leadership</span> & Reclaim Your <span className="text-gradient-primary">Personal Power</span>
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '600px', lineHeight: '1.7' }}>
              A private strategic partnership with <strong>Lukmaan</strong> for visionary leaders and executives. Integrating advanced Neuro-Linguistic Programming (NLP) with bespoke business advisory to unlock breakthrough performance, emotional mastery, and decisive leadership.
            </p>

            {/* Accreditation Badge Strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px', background: 'rgba(15, 23, 42, 0.6)', padding: '12px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', width: 'fit-content' }}>
              <img 
                src="/assets/anlp/ANLP-Accredited-Trainer-Gold-Logo-Landscape-1024x545.jpg" 
                alt="ANLP Accredited Gold Trainer Seal" 
                style={{ height: '38px', borderRadius: '4px', objectFit: 'contain' }}
              />
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', borderLeft: '1px solid var(--border-glass)', paddingLeft: '14px' }}>
                <div style={{ color: 'var(--text-gold)', fontWeight: '700' }}>ANLP Accredited Trainer</div>
                <div>Certified Practitioner since 2012</div>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
              <button 
                onClick={() => onOpenBooking('personal-discovery')}
                className="btn btn-primary"
                style={{ padding: '14px 32px', fontSize: '1.05rem' }}
              >
                <Calendar size={18} />
                <span>Book Discovery Call (Free)</span>
              </button>

              <button 
                onClick={() => onOpenBooking('exec-advisory')}
                className="btn btn-outline-gold"
                style={{ padding: '14px 28px', fontSize: '1.05rem' }}
              >
                <span>Executive Advisory</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Credential Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', pt: '16px', borderTop: '1px solid var(--border-glass)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--accent-gold)" />
                <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Confidential 1-on-1 Advisory</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--accent-gold)" />
                <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Bespoke Executive Strategy</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--accent-gold)" />
                <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>ANLP Accredited Code of Ethics</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual & Executive Coach Photo Card */}
          <div style={{ position: 'relative' }}>
            <div className="glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
              
              {/* Card Decorative Ambient Light */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              {/* Lukmaan Executive Photo Container */}
              <div style={{
                width: '100%',
                height: '440px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: '20px',
                position: 'relative',
                border: '1px solid var(--border-gold)',
                boxShadow: 'var(--shadow-card)'
              }}>
                <img 
                  src="/assets/lukmaan/lukmaan_boat_beach.png" 
                  alt="Lukmaan Executive Coach" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 15%'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  inset: 'auto 0 0 0',
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, transparent 100%)',
                  padding: '20px 16px 16px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', color: '#FFF', margin: 0, fontWeight: '700' }}>{COACH_INFO.name}</h3>
                    <div style={{ fontSize: '0.88rem', color: 'var(--accent-gold-light)', fontWeight: '600' }}>
                      NLP Personal & Executive Coach
                    </div>
                  </div>
                  <span className="badge badge-gold" style={{ fontSize: '0.7rem', background: '#0F172A' }}>
                    ANLP Registered Since 2013
                  </span>
                </div>
              </div>

              {/* Live Availability Box */}
              <div style={{
                background: 'rgba(9, 13, 22, 0.75)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: '1px solid var(--border-glass)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="pulse-dot" />
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Executive Advisory Availability
                    </span>
                  </div>
                  <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>Direct 1-on-1 Booking</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                  {['09:00 AM', '11:30 AM', '02:00 PM'].map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => onOpenBooking('personal-discovery')}
                      style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        background: idx === 1 ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: idx === 1 ? '1px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        color: idx === 1 ? 'var(--text-gold)' : 'var(--text-primary)',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                {/* Session Confirmation Preview Line */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'rgba(212, 175, 55, 0.08)',
                  border: '1px dashed rgba(212, 175, 55, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  color: 'var(--accent-gold-light)'
                }}>
                  <Clock size={14} color="var(--accent-gold)" />
                  <span>Instant 1-on-1 session confirmation & calendar invite</span>
                </div>
              </div>

              {/* Stats Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
                {COACH_INFO.stats.slice(0, 3).map((st, i) => (
                  <div key={i} style={{ padding: '4px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>
                      {st.value}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {st.label}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
