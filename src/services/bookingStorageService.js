import { INITIAL_BOOKINGS } from './mockData.js';
import { generateGoogleMeetUrl } from './googleCalendarService.js';

const STORAGE_KEY = 'aura_coaching_bookings_v1';

export function getBookings() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return Array.isArray(INITIAL_BOOKINGS) ? INITIAL_BOOKINGS : [];
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error parsing stored bookings:', err);
    return [];
  }
}

export function saveBooking(bookingData) {
  const current = getBookings();
  const newBooking = {
    id: `bk-${Date.now().toString().slice(-5)}`,
    ...bookingData,
    googleMeetUrl: generateGoogleMeetUrl(),
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  const updated = [newBooking, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newBooking;
}

export function cancelBooking(id) {
  const current = getBookings();
  const updated = current.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getAvailableSlotsForDate(dateStr) {
  // Generate consistent time slots between 09:00 AM and 05:00 PM
  const baseSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '01:30 PM',
    '03:00 PM',
    '04:30 PM'
  ];

  // Filter out any slots already booked on this date
  const bookings = getBookings();
  const bookedTimes = bookings
    .filter(b => b.date === dateStr && b.status !== 'Cancelled')
    .map(b => b.timeSlot);

  return baseSlots.map(slot => ({
    time: slot,
    available: !bookedTimes.includes(slot),
    reason: bookedTimes.includes(slot) ? 'Already booked session' : null
  }));
}

export async function fetchAvailableSlotsAsync(dateStr, timezone = 'Europe/London', durationMinutes = 60) {
  try {
    const res = await fetch(`/api/available-slots?date=${dateStr}&timezone=${encodeURIComponent(timezone)}&durationMinutes=${durationMinutes}`);
    if (res.ok) {
      const data = await res.json();
      if (data.slots) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend slots fetch failed, using local fallback:', err);
  }

  // Fallback to local check
  return {
    success: true,
    date: dateStr,
    googleSynced: false,
    slots: getAvailableSlotsForDate(dateStr)
  };
}
