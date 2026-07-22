# CoachState.online — Executive & Personal Advisory Platform

**CoachState.online** is a modern, high-performance executive advisory platform engineered for high-performance leaders, founders, and executives. Built with React, Vite, Node.js, Express, and integrated with Google Workspace Calendar & Meet APIs.

---

## 🌟 Key Features

- **Luxury Executive UI/UX**: Dark mode aesthetic with glassmorphism, dynamic micro-interactions, and curated typography.
- **Interactive Booking Engine**: Step-by-step intake workflow with real-time slot selection and tier categorization.
- **Automatic Dual-Timezone Converter**: Computes exact UTC timestamps and translates session times dynamically between the **Client's Local Timezone** and **Lukmaan's UK Timezone (Europe/London)**.
- **Direct Google Calendar & Meet Sync**: Integrates with Google Calendar API (`v3`) to insert events directly on `lv@coachstate.online`, generate Google Meet links, and automatically send native email calendar invitations to clients.
- **Client Portal**: Dedicated dashboard for clients to review upcoming coaching sessions, access meeting rooms, and manage bookings.
- **AI Triage Assistant Widget**: Embedded interactive advisory widget helping clients select the right coaching tier based on their immediate goals.
- **GDPR & Legal Compliance**: Built-in Cookie Consent Banner and Legal Modals (Terms, Privacy Policy, Cookie Policy).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS Design System
- **Backend**: Node.js, Express.js
- **Integrations**: Google Calendar API (`googleapis`), Nodemailer (iCalendar `.ics` engine)
- **Deployment**: Render Web Service (`render.yaml`)

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Installation
```bash
# Clone repository
git clone https://github.com/LukmaanViscomi/Coachstate-site.git
cd Coachstate-site

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
PORT=3001
GOOGLE_CALENDAR_ID=lv@coachstate.online
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
```

### 4. Running Locally
Start both the Vite dev server and Express backend server:

```bash
# Terminal 1: Backend Server (Port 3001)
npm run server

# Terminal 2: Frontend App (Port 3000)
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🌐 Deploying to Render (`coachstate.online`)

This project is configured for seamless deployment on Render via [`render.yaml`](./render.yaml).

1. Connect this repository on [Render](https://dashboard.render.com).
2. Choose **Blueprint** deployment or **Web Service**.
3. In Render Environment Variables, add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN`.
4. Attach custom domain `coachstate.online`.

---

© Coachstate Advisory | `lv@coachstate.online`
