
import React from 'react';
import type { Event, View } from '../../types';
import { Calendar, Clock, MapPin, ChevronLeft, Share2, User } from 'lucide-react';

interface EventDetailsPageProps {
  event: Event;
  onNavigate: (view: View) => void;
  onRegister: () => void;
  onBack: () => void;
}

const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ event, onRegister, onBack }) => {
  return (
    <div className="bg-white min-h-screen">
      <header className="py-4 px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>
      </header>
      <main className="max-w-4xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-6">
              <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{event.name}</h1>
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Event Description</h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="bg-gray-50 rounded-lg shadow-md p-6 sticky top-20">
              <div className="space-y-4">
                 <InfoItem icon={<Calendar className="w-5 h-5 text-primary-600" />} label="Date & Time">
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    <br/>
                    {event.time}
                 </InfoItem>
                 <InfoItem icon={<MapPin className="w-5 h-5 text-primary-600" />} label="Location">
                    {event.location}
                 </InfoItem>
                  <InfoItem icon={<User className="w-5 h-5 text-primary-600" />} label="Organizer">
                    Event Sphere Innovations<br/>
                    <span className="text-xs text-gray-500">info@eventsphere.com</span>
                 </InfoItem>
              </div>
              <button
                onClick={onRegister}
                className="w-full mt-8 bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                RSVP Now
              </button>
              <div className="mt-6 text-center">
                  <button className="flex items-center justify-center mx-auto text-sm font-medium text-gray-600 hover:text-gray-900">
                      <Share2 className="w-4 h-4 mr-2"/>
                      Share Event
                  </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoItem: React.FC<{ icon: React.ReactNode, label: string, children: React.ReactNode }> = ({ icon, label, children }) => (
    <div className="flex">
        <div className="flex-shrink-0 mr-4">{icon}</div>
        <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</h3>
            <p className="mt-1 text-md font-medium text-gray-800">{children}</p>
        </div>
    </div>
);

export default EventDetailsPage;
