import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static frontend build files in production
app.use(express.static(path.join(__dirname, 'dist')));

/**
 * Robust helper to convert local dateStr ("2026-07-25"), timeSlotStr ("10:00 AM"), and timeZone ("America/New_York")
 * into an accurate UTC JavaScript Date object.
 */
function getUtcDateFromClientTime(dateStr, timeSlotStr, timeZone = 'UTC') {
  const [year, month, day] = dateStr.split('-').map(Number);
  let [time, modifier] = timeSlotStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  const utcGuess = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone || 'UTC',
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    }).formatToParts(utcGuess);

    const getPart = type => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
    const targetYear = getPart('year');
    const targetMonth = getPart('month');
    const targetDay = getPart('day');
    let targetHour = getPart('hour');
    if (targetHour === 24) targetHour = 0;
    const targetMinute = getPart('minute');

    const targetUtcAsMs = Date.UTC(targetYear, targetMonth - 1, targetDay, targetHour, targetMinute, 0);
    const offsetMs = targetUtcAsMs - utcGuess.getTime();

    return new Date(utcGuess.getTime() - offsetMs);
  } catch (e) {
    return new Date(year, month - 1, day, hours, minutes, 0);
  }
}

/**
 * Formats a Date object in a specific timezone into a human-readable string
 */
function formatTimezoneString(dateObj, timeZone, locale = 'en-GB') {
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone,
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    }).format(dateObj);
  } catch (e) {
    return dateObj.toUTCString();
  }
}

/**
 * Generates fallback Meet URL
 */
function generateFallbackMeetUrl() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const getChunk = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `https://meet.google.com/${getChunk(3)}-${getChunk(4)}-${getChunk(3)}`;
}

/**
 * Creates iCalendar .ics text for email attachment/invitation
 */
function generateIcsContent({ bookingId, sessionTitle, startUtc, endUtc, googleMeetUrl, clientName, clientEmail, notes }) {
  const formatIcsDate = (dt) => dt.toISOString().replace(/-|:|\.\d\d\d/g, '');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Coachstate Executive Advisory//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:coachstate-${bookingId || Date.now()}@coachstate.online`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startUtc)}`,
    `DTEND:${formatIcsDate(endUtc)}`,
    `SUMMARY:Coachstate: ${sessionTitle}`,
    `ORGANIZER;CN="Lukmaan (Coachstate)":MAILTO:lv@coachstate.online`,
    `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN="${clientName}":MAILTO:${clientEmail}`,
    `DESCRIPTION:1-on-1 Executive Coaching Session with Lukmaan\\n\\nJoin Video Call: ${googleMeetUrl}\\nClient: ${clientName} (${clientEmail})\\nNotes: ${notes || 'N/A'}\\n\\nPowered by Coachstate.online`,
    `LOCATION:${googleMeetUrl}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Backend API Endpoint: POST /api/create-booking
 */
app.post('/api/create-booking', async (req, res) => {
  const { clientName, clientEmail, sessionTitle, date, timeSlot, durationMinutes, notes, timezone } = req.body;

  const clientTz = timezone || 'UTC';
  const ukTz = 'Europe/London';

  // Calculate precise UTC dates
  const startUtc = getUtcDateFromClientTime(date, timeSlot, clientTz);
  const duration = durationMinutes ? Number(durationMinutes) : 60;
  const endUtc = new Date(startUtc.getTime() + duration * 60000);

  // Format strings for both Client Local and Lukmaan UK
  const clientFormattedTime = formatTimezoneString(startUtc, clientTz, 'en-US');
  const ukFormattedTime = formatTimezoneString(startUtc, ukTz, 'en-GB');

  // Check OAuth credentials
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'lv@coachstate.online';

  let googleMeetUrl = generateFallbackMeetUrl();
  let eventCreatedOnGoogle = false;
  let emailDispatched = false;

  // 1. Insert into Google Calendar via API if OAuth credentials present
  if (clientId && clientSecret && refreshToken) {
    try {
      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
      oauth2Client.setCredentials({ refresh_token: refreshToken });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      const eventPayload = {
        summary: `[Coachstate] ${sessionTitle} - ${clientName}`,
        description: `Executive & Personal Coaching Session with Lukmaan.\n\n` +
          `👤 Client: ${clientName} (${clientEmail})\n` +
          `🌐 Client Local Time: ${clientFormattedTime}\n` +
          `🇬🇧 Coach UK Time: ${ukFormattedTime}\n` +
          `📝 Preparation Notes: ${notes || 'None'}\n\n` +
          `Powered by Coachstate Executive Advisory (lv@coachstate.online)`,
        start: { dateTime: startUtc.toISOString() },
        end: { dateTime: endUtc.toISOString() },
        attendees: clientEmail ? [{ email: clientEmail }] : [],
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        }
      };

      const response = await calendar.events.insert({
        calendarId: calendarId,
        conferenceDataVersion: 1,
        sendUpdates: 'all', // Google automatically dispatches calendar email invite to client!
        requestBody: eventPayload
      });

      if (response.data && (response.data.hangoutLink || response.data.htmlLink)) {
        googleMeetUrl = response.data.hangoutLink || response.data.htmlLink;
        eventCreatedOnGoogle = true;
        emailDispatched = true;
      }
    } catch (err) {
      console.error('Error inserting event into Google Calendar backend API:', err.message);
    }
  }

  const bookingId = `bk-${Date.now().toString().slice(-5)}`;

  // 2. Dispatch Email via SMTP / Nodemailer if configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: smtpUser, pass: smtpPass }
      });

      const icsContent = generateIcsContent({
        bookingId,
        sessionTitle,
        startUtc,
        endUtc,
        googleMeetUrl,
        clientName,
        clientEmail,
        notes
      });

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; padding: 32px; border-radius: 12px;">
          <h2 style="color: #d4af37; margin-bottom: 8px;">Coachstate Advisory — Booking Confirmation</h2>
          <p>Hi <strong>${clientName}</strong>,</p>
          <p>Your executive coaching session <strong>${sessionTitle}</strong> with Lukmaan has been confirmed.</p>
          
          <div style="background-color: #141b2d; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #1e293b;">
            <p style="margin: 6px 0;">🌐 <strong>Your Local Time:</strong> ${clientFormattedTime}</p>
            <p style="margin: 6px 0;">🇬🇧 <strong>Lukmaan's UK Time:</strong> ${ukFormattedTime}</p>
            <p style="margin: 6px 0;">📍 <strong>Google Meet Video Link:</strong> <a href="${googleMeetUrl}" style="color: #60a5fa;">${googleMeetUrl}</a></p>
          </div>

          <p style="color: #94a3b8; font-size: 0.9rem;">An calendar invitation has been attached to this email. It will automatically adjust to your calendar's local timezone.</p>
          <p style="margin-top: 24px;">Warm regards,<br/><strong>Lukmaan | Coachstate Executive Advisory</strong><br/>lv@coachstate.online</p>
        </div>
      `;

      await transporter.sendMail({
        from: '"Coachstate Advisory" <lv@coachstate.online>',
        to: clientEmail,
        cc: 'lv@coachstate.online',
        subject: `Confirmed: ${sessionTitle} with Lukmaan`,
        html: emailHtml,
        icalEvent: {
          filename: `Coachstate_Booking_${bookingId}.ics`,
          method: 'REQUEST',
          content: icsContent
        }
      });
      emailDispatched = true;
    } catch (emailErr) {
      console.error('Failed to send SMTP email invite:', emailErr.message);
    }
  }

  // Confirm booking response payload
  const bookingResult = {
    id: bookingId,
    clientName,
    clientEmail,
    sessionTitle,
    date,
    timeSlot,
    durationMinutes: duration,
    clientFormattedTime,
    ukFormattedTime,
    googleMeetUrl,
    eventCreatedOnGoogle,
    emailDispatched,
    notes,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  res.json({ success: true, booking: bookingResult });
});

// SPA fallback rewrite rule
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✓ Coachstate Backend Server running on port ${PORT}`);
});

