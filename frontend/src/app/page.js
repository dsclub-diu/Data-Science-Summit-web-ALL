import EventsSection from '@/components/Event';
import GuestList from '@/components/GuestList';
import Hero from '@/components/Hero';
import OrganizersSection from '@/components/OrganizersSection';
import PreviousSummitsSection from '@/components/PreviousSummitsSection';
import ScheduleSection from '@/components/Schedule';
import VenueSection from '@/components/Venue';
import React from 'react';

const page = () => {
  return (
    <div>
      <Hero />
      <EventsSection />
      <ScheduleSection />
      <GuestList />
      <VenueSection />
      <PreviousSummitsSection />
      <OrganizersSection />
    </div>
  );
};

export default page;