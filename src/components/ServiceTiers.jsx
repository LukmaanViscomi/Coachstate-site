import React, { useState } from 'react';
import { COACHING_TIERS } from '../services/mockData.js';
import { Calendar, Video, Check, Briefcase, User, Sparkles, ArrowRight } from 'lucide-react';

export default function ServiceTiers({ onSelectTier }) {
  const [activeCategory, setActiveCategory] = useState('personal');

  const currentTiers = COACHING_TIERS[activeCategory];

  return (
    <section id="services" className="section" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <div className="badge badge-gold" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} /> Bespoke Advisory Programs
          </div>
          <h2 style={{ fontSize: '2.6rem', marginBottom: '16px' }}>
            Tailored Coaching Tiers for <span className="text-gradient-gold">Personal Mastery</span> & <span className="text-gradient-primary">Executive Growth</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
            Select your path. Every session includes direct 1-on-1 access via automated Google Meet video links, pre-session diagnostic tools, and Google Calendar event sync.
          </p>

          {/* Category Switcher */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
            <div className="tab-switcher">
              <button
                className={`tab-btn ${activeCategory === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveCategory('personal')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <User size={16} />
                <span>Personal Life Coaching</span>
              </button>
              <button
                className={`tab-btn ${activeCategory === 'executive' ? 'active' : ''}`}
                onClick={() => setActiveCategory('executive')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Briefcase size={16} />
                <span>Executive Business Support</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="grid-3">
          {currentTiers.map((tier) => (
            <div 
              key={tier.id} 
              className="glass-card" 
              style={{
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                border: tier.badge?.includes('Popular') || tier.badge?.includes('Retainer') ? '1px solid var(--accent-gold)' : '1px solid var(--border-glass)'
              }}
            >
              {/* Badge if present */}
              {tier.badge && (
                <div style={{ position: 'absolute', top: '-14px', right: '24px' }}>
                  <span className="badge badge-gold" style={{ background: '#0F172A', boxShadow: 'var(--shadow-glow)' }}>
                    {tier.badge}
                  </span>
                </div>
              )}

              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginBottom: '8px' }}>
                  {tier.durationMinutes} Minutes • Google Meet Call
                </div>

                <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '12px', minHeight: '56px', display: 'flex', alignItems: 'center' }}>
                  {tier.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px', minHeight: '44px' }}>
                  {tier.tagline}
                </p>

                {/* Price Display */}
                <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border-glass)' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: '700', color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>
                    {tier.price}
                  </span>
                </div>

                {/* Features List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                  {tier.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'rgba(212, 175, 55, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        <Check size={12} color="var(--accent-gold)" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action CTA Button */}
              <button 
                onClick={() => onSelectTier(tier.id)}
                className={`btn ${tier.badge?.includes('Popular') || tier.badge?.includes('Retainer') ? 'btn-primary' : 'btn-outline-gold'}`}
                style={{ width: '100%' }}
              >
                <Calendar size={16} />
                <span>Select & Book Slot</span>
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
