/**
 * Google Calendar & Google Meet Integration Service
 */

const GOOGLE_CONFIG_KEY = 'aura_google_workspace_config';
const GOOGLE_TOKEN_KEY = 'aura_google_access_token';

/**
 * Generates a formatted fallback Google Meet URL
 */
export function generateGoogleMeetUrl() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const getRandomChunk = (len) => {
    let result = '';
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  return `https://meet.google.com/${getRandomChunk(3)}-${getRandomChunk(4)}-${getRandomChunk(3)}`;
}

/**
 * Creates a direct "Add to Google Calendar" web link
 */
export function createGoogleCalendarWebUrl(booking) {
  const { sessionTitle, date, timeSlot, durationMinutes, googleMeetUrl, clientName, clientEmail, notes } = booking;

  const startTime = parseBookingDateTime(date, timeSlot);
  const endTime = new Date(startTime.getTime() + (durationMinutes || 60) * 60 * 1000);

  const formatGoogleDate = (dt) => {
    return dt.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const clientTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Client Local';

  const titleStr = encodeURIComponent(`[Coachstate] ${sessionTitle} w/ ${clientName}`);
  const detailsStr = encodeURIComponent(
    `Executive & Personal Coaching Session with Lukmaan\n\n` +
    `📍 Google Meet Video Call: ${googleMeetUrl}\n` +
    `👤 Client: ${clientName} (${clientEmail || 'N/A'})\n` +
    `🌐 Client Booking Time: ${timeSlot} (${date}) [Timezone: ${clientTz}]\n` +
    `📝 Client Intake Notes: ${notes || 'None provided'}\n\n` +
    `----------------------------------------\n` +
    `* Note for Google Calendar: Google automatically displays this event in your local timezone (${clientTz} for client / UK BST for Lukmaan).\n\n` +
    `Powered by Coachstate Executive & Personal Advisory (lv@coachstate.online)`
  );
  const locationStr = encodeURIComponent(googleMeetUrl);
  const datesStr = `${formatGoogleDate(startTime)}/${formatGoogleDate(endTime)}`;
  const addGuestStr = clientEmail ? `&add=${encodeURIComponent(clientEmail)}` : '';

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleStr}&dates=${datesStr}&details=${detailsStr}&location=${locationStr}${addGuestStr}`;
}

/**
 * Generates and triggers download of a standard .ics calendar file
 */
export function downloadIcsCalendarFile(booking) {
  const { sessionTitle, date, timeSlot, durationMinutes, googleMeetUrl, clientName, clientEmail, notes, id } = booking;
  
  const startTime = parseBookingDateTime(date, timeSlot);
  const endTime = new Date(startTime.getTime() + (durationMinutes || 60) * 60 * 1000);

  const formatIcsDate = (dt) => dt.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Coachstate Advisory//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:booking-${id || Date.now()}@coachstate.online`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startTime)}`,
    `DTEND:${formatIcsDate(endTime)}`,
    `SUMMARY:Coachstate: ${sessionTitle}`,
    `DESCRIPTION:1-on-1 Executive Coaching Session with Lukmaan\\nGoogle Meet: ${googleMeetUrl}\\nClient: ${clientName} (${clientEmail || ''})\\nNotes: ${notes || 'N/A'}`,
    `LOCATION:${googleMeetUrl}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Coachstate_Booking_${date}_${id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Live Google Calendar REST API Call (Inserts real event directly into Lukmaan's Google Calendar and returns REAL server-generated Google Meet URL)
 */
export async function createLiveGoogleCalendarEvent(booking, accessToken) {
  const { sessionTitle, date, timeSlot, durationMinutes, clientName, clientEmail, notes } = booking;
  const startTime = parseBookingDateTime(date, timeSlot);
  const endTime = new Date(startTime.getTime() + (durationMinutes || 60) * 60 * 1000);

  const eventPayload = {
    summary: `[Coachstate] ${sessionTitle} - ${clientName}`,
    description: `Executive & Personal Coaching Session with Lukmaan.\nClient: ${clientName} (${clientEmail})\nNotes: ${notes || 'None'}`,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    },
    attendees: clientEmail ? [{ email: clientEmail }] : [],
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };

  try {
    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventPayload)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error?.message || `Google API Error ${res.status}`);
    }

    const data = await res.json();
    return {
      success: true,
      eventId: data.id,
      googleMeetUrl: data.hangoutLink || (data.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri) || data.htmlLink,
      htmlLink: data.htmlLink
    };
  } catch (error) {
    console.error('Failed to create live Google Calendar event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function parseBookingDateTime(dateStr, timeSlotStr) {
  if (!dateStr || !timeSlotStr) return new Date();
  try {
    const [year, month, day] = (dateStr || '').split('-').map(Number);
    const parts = (timeSlotStr || '').split(' ');
    let time = parts[0] || '10:00';
    let modifier = parts[1] || 'AM';
    let [hours, minutes] = (time || '10:00').split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return new Date(year || new Date().getFullYear(), (month || 1) - 1, day || 1, hours || 0, minutes || 0, 0);
  } catch (e) {
    return new Date();
  }
}

/**
 * Google Workspace Config & Token Storage
 */
export function getGoogleWorkspaceConfig() {
  const stored = localStorage.getItem(GOOGLE_CONFIG_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse google workspace config', e);
    }
  }
  
  let envClientId = '';
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    }
  } catch (e) {}

  return {
    mode: 'sandbox', // 'sandbox' | 'live'
    clientId: envClientId,
    googleAccountEmail: 'lv@coachstate.online',
    autoGenerateMeetLinks: true,
    calendarId: 'primary',
    apiStatus: 'Ready (Add to Google Calendar Active)',
    lastSynced: new Date().toISOString()
  };
}

export function saveGoogleWorkspaceConfig(config) {
  localStorage.setItem(GOOGLE_CONFIG_KEY, JSON.stringify(config));
}

export function getStoredGoogleAccessToken() {
  return localStorage.getItem(GOOGLE_TOKEN_KEY);
}

export function saveGoogleAccessToken(token) {
  localStorage.setItem(GOOGLE_TOKEN_KEY, token);
}
