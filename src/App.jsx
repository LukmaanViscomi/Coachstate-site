import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import ServiceTiers from './components/ServiceTiers.jsx';
import Testimonials from './components/Testimonials.jsx';
import Footer from './components/Footer.jsx';
import BookingModal from './components/BookingModal.jsx';
import ClientPortal from './components/ClientPortal.jsx';
import FounderDashboard from './components/FounderDashboard.jsx';
import GoogleWorkspaceManager from './components/GoogleWorkspaceManager.jsx';
import LegalModals from './components/LegalModals.jsx';
import CookieBanner from './components/CookieBanner.jsx';
import TriageAgentWidget from './components/TriageAgentWidget.jsx';
import { getBookings } from './services/bookingStorageService.js';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState('personal-breakthrough');
  
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isFounderDashboardOpen, setIsFounderDashboardOpen] = useState(false);
  const [isGoogleSettingsOpen, setIsGoogleSettingsOpen] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState(null); // 'terms' | 'privacy' | 'cookies'

  const [bookingList, setBookingList] = useState([]);

  useEffect(() => {
    setBookingList(getBookings());
  }, []);

  const handleOpenBooking = (tierId = 'personal-breakthrough') => {
    setSelectedTierId(tierId);
    setIsBookingOpen(true);
  };

  const handleBookingComplete = (newBooking) => {
    setBookingList(getBookings());
  };

  const activeBookingsCount = Array.isArray(bookingList) 
    ? bookingList.filter(b => b && b.status !== 'Cancelled').length 
    : 0;

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar 
        onOpenBooking={handleOpenBooking}
        onOpenPortal={() => setIsPortalOpen(true)}
        onOpenGoogleSettings={() => setIsGoogleSettingsOpen(true)}
        bookingCount={activeBookingsCount}
      />

      {/* Main Page Content */}
      <main>
        <HeroSection onOpenBooking={handleOpenBooking} />
        <ServiceTiers onSelectTier={handleOpenBooking} />
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer 
        onOpenBooking={handleOpenBooking}
        onOpenGoogleSettings={() => setIsGoogleSettingsOpen(true)}
        onOpenLegalModal={modalType => setActiveLegalModal(modalType)}
        onOpenFounderDashboard={() => setIsFounderDashboardOpen(true)}
      />

      {/* Interactive Modals */}
      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialTierId={selectedTierId}
        onBookingComplete={handleBookingComplete}
      />

      <ClientPortal 
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        onOpenNewBooking={() => handleOpenBooking()}
      />

      <FounderDashboard 
        isOpen={isFounderDashboardOpen}
        onClose={() => setIsFounderDashboardOpen(false)}
      />

      <GoogleWorkspaceManager 
        isOpen={isGoogleSettingsOpen}
        onClose={() => setIsGoogleSettingsOpen(false)}
      />

      <LegalModals 
        activeModal={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner onOpenPolicy={() => setActiveLegalModal('cookies')} />

      {/* AI Triage & Assistant Widget */}
      <TriageAgentWidget onSelectTier={handleOpenBooking} />

    </div>
  );
}
