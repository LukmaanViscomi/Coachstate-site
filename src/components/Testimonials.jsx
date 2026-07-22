import React from 'react';
import { TESTIMONIALS, COACH_INFO } from '../services/mockData.js';
import { Quote, Star, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 56px' }}>
          <div className="badge badge-gold" style={{ marginBottom: '14px' }}>
            <Award size={14} /> Proven ANLP Executive Track Record
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
            Trusted by <span className="text-gradient-gold">C-Suite Leaders</span>, <span className="text-gradient-primary">Founders</span> & Industry Pioneers
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
            Real outcomes from high-stakes executive advisory and transformative personal Neuro-Linguistic Programming (NLP) coaching with Lukmaan.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid-3" style={{ marginBottom: '64px' }}>
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Rating stars */}
                <div style={{ display: 'flex', gap: '4px', color: 'var(--accent-gold)', marginBottom: '18px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="var(--accent-gold)" />
                  ))}
                </div>

                <Quote size={28} color="var(--accent-gold)" style={{ opacity: 0.6, marginBottom: '12px' }} />

                <p style={{ fontSize: '0.98rem', color: 'var(--text-primary)', lineHeight: '1.65', marginBottom: '24px', fontStyle: 'italic' }}>
                  "{t.quote}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#FFF', fontSize: '1rem' }}>{t.author}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--accent-gold-light)' }}>{t.title}, {t.company}</div>
                </div>
                <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>{t.type}</span>
              </div>
            </div>
          ))}
        </div>

        {/* About Lukmaan Biography & ANLP Credentials Card */}
        <div id="about" className="glass-card" style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)', border: '1px solid var(--border-gold)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '40px', alignItems: 'center' }}>
            
            {/* Formal Portrait Image */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border-gold)',
                boxShadow: 'var(--shadow-card)',
                height: '480px',
                background: 'rgba(9, 13, 22, 0.8)'
              }}>
                <img 
                  src="/assets/lukmaan/lukmaan_formal.png" 
                  alt="Lukmaan ANLP Master Trainer" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 10%'
                  }}
                />
              </div>

              {/* ANLP Accreditation Badge overlay */}
              <div style={{
                position: 'absolute',
                bottom: '-15px',
                right: '20px',
                background: 'rgba(9, 13, 22, 0.95)',
                border: '1px solid var(--accent-gold)',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-modal)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <img 
                  src="/assets/anlp/anlp acfedited-edited.png" 
                  alt="ANLP Accredited Badge" 
                  style={{ height: '48px', objectFit: 'contain' }}
                />
                <span style={{ fontSize: '0.84rem', color: 'var(--text-gold)', fontWeight: '700' }}>
                  ANLP Registered Trainer
                </span>
              </div>
            </div>

            {/* Biography Details */}
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
                <ShieldCheck size={14} /> ANLP Registered Trainer & Accredited Coach
              </span>
              <h3 style={{ fontSize: '2.2rem', color: '#FFF', marginBottom: '16px' }}>
                Meet Lukmaan
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: '1.7', marginBottom: '24px' }}>
                {COACH_INFO.bio}
              </p>

              {/* Qualifications Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '24px' }}>
                {COACH_INFO.credentials.map((cred, i) => (
                  <div key={i} style={{
                    padding: '14px',
                    background: 'rgba(9, 13, 22, 0.7)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}>
                    <CheckCircle2 size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: '500' }}>{cred}</span>
                  </div>
                ))}
              </div>

              {/* Secondary ANLP Membership Seals strip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px', flexWrap: 'wrap' }}>
                <img 
                  src="/assets/anlp/ANLP_Pro_Member_Logo-2022--2x (1).png" 
                  alt="ANLP Pro Member" 
                  style={{ height: '54px', objectFit: 'contain', background: '#FFF', padding: '4px 8px', borderRadius: '6px' }}
                />
                <img 
                  src="/assets/anlp/ANLP-Accredited-Trainer-Gold-Logo-Landscape-1024x545.jpg" 
                  alt="ANLP Accredited Gold Trainer Seal" 
                  style={{ height: '54px', objectFit: 'contain', borderRadius: '6px' }}
                />
                <img 
                  src="/assets/anlp/anlp full logo.png" 
                  alt="ANLP Full Accreditation Seal" 
                  style={{ height: '54px', objectFit: 'contain', background: '#FFF', padding: '4px 8px', borderRadius: '6px' }}
                />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  Certified NLP Academy Registered Trainer since 2013
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
