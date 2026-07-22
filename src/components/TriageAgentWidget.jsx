import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Calendar, ArrowRight, UserCheck } from 'lucide-react';

export default function TriageAgentWidget({ onSelectTier }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am Coachstate's AI Consultation Assistant. Are you interested in Personal Life Coaching (Mindset & NLP) or Executive Business Advisory with Lukmaan?",
      options: [
        { label: "Personal Mindset & NLP", tierId: "personal-breakthrough" },
        { label: "Executive Leadership Advisory", tierId: "exec-advisory" },
        { label: "Free 20-Min Discovery Call", tierId: "personal-discovery" }
      ]
    }
  ]);

  const handleOptionClick = (option) => {
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: option.label },
      {
        sender: 'bot',
        text: `Excellent choice! Based on your selection, I recommend scheduling the "${option.label}" directly with Lukmaan. All sessions include automated Google Meet video links.`,
        recommendation: option.tierId
      }
    ]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: userText }
    ]);

    // Simulated intelligent triage logic
    setTimeout(() => {
      let botResponse = "Thank you for sharing. Lukmaan specializes in ANLP Master Practitioner techniques and executive strategy since 2012. Would you like to schedule a 20-minute Complimentary Discovery Session to discuss this in detail?";
      let recTier = "personal-discovery";

      if (userText.toLowerCase().includes('exec') || userText.toLowerCase().includes('ceo') || userText.toLowerCase().includes('business') || userText.toLowerCase().includes('leadership')) {
        botResponse = "For executive strategy, C-Suite leadership, and organizational growth, I recommend Lukmaan's 60-Minute Executive Leadership & Advisory Session.";
        recTier = "exec-advisory";
      } else if (userText.toLowerCase().includes('mindset') || userText.toLowerCase().includes('nlp') || userText.toLowerCase().includes('life') || userText.toLowerCase().includes('burnout')) {
        botResponse = "For rapid personal transformation using accredited ANLP techniques, I recommend Lukmaan's Personal Life & Mindset Breakthrough Session.";
        recTier = "personal-breakthrough";
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          recommendation: recTier
        }
      ]);
    }, 600);
  };

  return (
    <div className="triage-widget-container" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #0F172A 100%)',
            color: '#FFF',
            border: '1px solid var(--accent-gold)',
            padding: '14px 20px',
            borderRadius: '9999px',
            boxShadow: 'var(--shadow-modal)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '700',
            fontSize: '0.92rem',
            transition: 'all 0.25s ease'
          }}
        >
          <div className="pulse-dot" />
          <Bot size={18} color="var(--accent-gold-light)" />
          <span>Ask a Question?</span>
        </button>
      )}

      {/* Popup Chat Window */}
      {isOpen && (
        <div style={{
          width: '380px',
          height: '520px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-modal)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s ease-out'
        }}>
          
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'rgba(9, 13, 22, 0.9)',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={18} color="var(--accent-gold)" />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#FFF' }}>Ask a Question</div>
                <div style={{ fontSize: '0.72rem', color: '#6EE7B7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="pulse-dot" style={{ width: '6px', height: '6px' }} /> Executive AI Assistant
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  background: msg.sender === 'user' ? 'var(--accent-gold)' : 'rgba(30, 41, 59, 0.8)',
                  color: msg.sender === 'user' ? '#080C16' : 'var(--text-primary)',
                  fontWeight: msg.sender === 'user' ? '600' : 'normal',
                  fontSize: '0.88rem',
                  lineHeight: '1.5',
                  border: msg.sender === 'bot' ? '1px solid var(--border-glass)' : 'none'
                }}>
                  {msg.text}
                </div>

                {/* Interactive Option Chips */}
                {msg.options && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', width: '100%' }}>
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(opt)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(212, 175, 55, 0.1)',
                          border: '1px solid var(--border-gold)',
                          color: 'var(--text-gold)',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{opt.label}</span>
                        <ArrowRight size={14} />
                      </button>
                    ))}
                  </div>
                )}

                {/* Direct Booking Recommendation CTA */}
                {msg.recommendation && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onSelectTier(msg.recommendation);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '8px', width: '100%', fontSize: '0.82rem' }}
                  >
                    <Calendar size={14} />
                    <span>Book Recommended Session</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} style={{
            padding: '12px',
            background: 'rgba(9, 13, 22, 0.95)',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            gap: '8px'
          }}>
            <input 
              type="text" 
              placeholder="Describe your coaching goals..."
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '9999px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-glass)',
                color: '#FFF',
                fontSize: '0.86rem',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--accent-gold)',
                border: 'none',
                color: '#080C16',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
