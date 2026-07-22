export const COACH_INFO = {
  name: "Lukmaan",
  fullTitle: "Lukmaan | ANLP Master Trainer, Executive Strategist & Life Coach",
  shortTitle: "NLP Personal & Executive Coach",
  email: "lv@coachstate.online",
  bio: "Empowering C-Suite executives, founders, and ambitious individuals through Neuro-Linguistic Programming (NLP), high-performance coaching, and strategic advisory. Practitioner and coach since 2012, and NLP Academy Registered Trainer since 2013. Specializing in cognitive reframing, emotional mastery, executive presence, and rapid behavioral transformation.",
  credentials: [
    "ANLP Registered Trainer & Accredited Coach",
    "ANLP Registered Master Practitioner & Practitioner",
    "NLP Academy Registered Trainer (Certified since 2013)",
    "Active NLP Training & Executive Coaching Practice since 2012"
  ],
  stats: [
    { label: "Executive & NLP Sessions", value: "4,800+" },
    { label: "Years of Professional NLP Practice", value: "14+ Years" },
    { label: "C-Suite & Founders Coached", value: "320+" },
    { label: "Client Transformation Rate", value: "99%" }
  ]
};

export const COACHING_TIERS = {
  personal: [
    {
      id: "personal-discovery",
      title: "Complimentary Discovery Session with Lukmaan",
      durationMinutes: 20,
      price: "$0",
      type: "personal",
      badge: "Free Consultation",
      tagline: "1-on-1 strategy call directly with Lukmaan to align on your core goals & coaching roadmap.",
      features: [
        "1-on-1 Clarity & Goal Mapping with Lukmaan",
        "Assessment of current mental state & behavioral bottlenecks",
        "Customized NLP & coaching roadmap recommendation",
        "Confidential video conference & email confirmation"
      ]
    },
    {
      id: "personal-breakthrough",
      title: "NLP Life & Mindset Breakthrough with Lukmaan",
      durationMinutes: 60,
      price: "$275",
      type: "personal",
      badge: "Most Popular Personal",
      tagline: "Targeted single-session NLP deep dive into high-stakes personal & mindset challenges.",
      features: [
        "60-minute intensive 1-on-1 session with Lukmaan",
        "ANLP Accredited Neuro-Linguistic Programming techniques",
        "Cognitive reframing, emotional mastery & focus architecture",
        "Post-session action plan & accountability guide",
        "Confidential 1-on-1 video session access"
      ]
    },
    {
      id: "personal-transform",
      title: "3-Month ANLP Transformation Program with Lukmaan",
      durationMinutes: 60,
      price: "$2,400",
      type: "personal",
      badge: "Comprehensive Package",
      tagline: "Full quarterly partnership with Lukmaan for habit mastery, core belief alignment, and peak vitality.",
      features: [
        "12 x 60-min Weekly 1-on-1 Advisory Sessions with Lukmaan",
        "Async WhatsApp / Slack priority support",
        "Personal values & subconscious blueprint alignment",
        "Mid-term progress benchmark report",
        "Automated calendar & email confirmation"
      ]
    }
  ],
  executive: [
    {
      id: "exec-advisory",
      title: "Executive Leadership & Business Advisory with Lukmaan",
      durationMinutes: 60,
      price: "$550",
      type: "executive",
      badge: "Single Advisory",
      tagline: "Strategic advisory for CEOs, VP leadership, and high-growth founders.",
      features: [
        "60-min 1-on-1 strategic consultation with Lukmaan",
        "High-stakes decision framework & risk review",
        "Executive presence & high-impact NLP communication polish",
        "Team dynamics & organizational alignment",
        "Session summary & actionable strategic brief"
      ]
    },
    {
      id: "exec-retainer",
      title: "C-Suite Strategic Partner with Lukmaan (Monthly Retainer)",
      durationMinutes: 90,
      price: "$4,800 / mo",
      type: "executive",
      badge: "Executive Retainer",
      tagline: "Dedicated strategic sounding board & continuous leadership development.",
      features: [
        "4 x 90-min Bi-weekly Executive Strategy Sessions with Lukmaan",
        "Priority 15-min 'War Room' strategy calls",
        "Stakeholder 360 feedback evaluation",
        "Board presentation & pitch deck coaching",
        "Priority calendar booking & executive client portal"
      ]
    },
    {
      id: "exec-workshop",
      title: "Executive Team Strategic Intensive with Lukmaan",
      durationMinutes: 240,
      price: "$7,500",
      type: "executive",
      badge: "Team Workshop",
      tagline: "Half-day workshop for executive committees and leadership pods.",
      features: [
        "Half-day (4-hour) virtual executive intensive with Lukmaan",
        "Vision alignment & OKR roadmapping",
        "Conflict resolution & high-trust culture building",
        "Full executive debrief & strategic playbook"
      ]
    }
  ]
};

export const INITIAL_BOOKINGS = [
  {
    id: "bk-1001",
    clientName: "Marcus Vance",
    clientEmail: "m.vance@vanguardexec.com",
    clientRole: "VP of Product, Vanguard FinTech",
    tierId: "exec-advisory",
    sessionTitle: "Executive Leadership & Business Advisory with Lukmaan",
    category: "Executive Support",
    date: "2026-07-25",
    timeSlot: "10:00 AM",
    durationMinutes: 60,
    googleMeetUrl: "https://meet.google.com/qzw-mvba-rtp",
    notes: "Focus on Q4 product organization restructuring & managing high-conflict stakeholder negotiations.",
    status: "Confirmed",
    createdAt: "2026-07-22T10:30:00Z"
  },
  {
    id: "bk-1002",
    clientName: "Elena Rostova",
    clientEmail: "elena.rostova@designstudio.co",
    clientRole: "Founder & Creative Director",
    tierId: "personal-breakthrough",
    sessionTitle: "NLP Life & Mindset Breakthrough with Lukmaan",
    category: "Personal Life Coaching",
    date: "2026-07-27",
    timeSlot: "02:00 PM",
    durationMinutes: 60,
    googleMeetUrl: "https://meet.google.com/xya-pqrk-vbn",
    notes: "Work-life boundary restoration and overcoming founder burnout.",
    status: "Confirmed",
    createdAt: "2026-07-21T14:15:00Z"
  }
];

export const TESTIMONIALS = [
  {
    quote: "Lukmaan's ANLP Master Practitioner techniques helped me rewire my leadership mindset in just two sessions. Our executive team expanded 3x under his guidance.",
    author: "Jonathan Sterling",
    title: "Chief Operating Officer",
    company: "Apex Tech Holdings",
    type: "Executive Advisory"
  },
  {
    quote: "The NLP breakthrough session with Lukmaan was game-changing. Having worked with coaches before, Lukmaan's depth of experience since 2012 stands out immediately.",
    author: "Samantha Lin",
    title: "Founder & CEO",
    company: "Lumina Health Science",
    type: "Personal Breakthrough"
  },
  {
    quote: "Lukmaan's direct 1-on-1 strategy calls and deep NLP expertise make weekly advisory sessions invaluable. High-impact advisory at its finest.",
    author: "David K. Al-Mansoor",
    title: "Managing Director",
    company: "Global Capital Partners",
    type: "Executive Support"
  }
];
