
import React from 'react';
import type { Event, View } from '../../types';
import { Calendar, MapPin, Search, LogOut, List } from 'lucide-react';

interface GuestEventDiscoveryProps {
  events: Event[];
  onNavigate: (view: View) => void;
  onSelectEvent: (eventId: string) => void;
  onLogout: () => void;
}

const EventCard: React.FC<{ event: Event; onViewDetails: () => void; }> = ({ event, onViewDetails }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
            <div className="relative">
                <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-full">{event.category}</div>
            </div>
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{event.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                 <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden text-ellipsis">{event.description}</p>
                <div className="flex justify-end items-center mt-4">
                     <button onClick={onViewDetails} className="text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors">View Details →</button>
                </div>
            </div>
        </div>
    );
};

const GuestEventDiscovery: React.FC<GuestEventDiscoveryProps> = ({ events, onNavigate, onSelectEvent, onLogout }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
       <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Discover Events</h1>
           <div className="flex items-center space-x-4">
              <button 
                onClick={() => onNavigate('GUEST_EVENTS_OVERVIEW')}
                className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 bg-primary-100 px-3 py-2 rounded-md transition-colors"
                >
                  <List className="w-4 h-4 mr-2"/>
                  My Events
              </button>
              <button onClick={onLogout} className="text-gray-500 hover:text-gray-700">
                  <LogOut className="w-6 h-6"/>
              </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Find Your Next Experience</h2>
          <p className="mt-4 text-lg text-gray-600">Browse our collection of public events and find something that excites you.</p>
        </div>
        
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search for events by title or keyword..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"/>
          </div>
          <div className="flex gap-4">
            <select className="border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 px-4 py-2">
                <option>Category</option>
                <option>Technology</option>
                <option>Music</option>
                <option>Art & Culture</option>
            </select>
             <select className="border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 px-4 py-2">
                <option>Sort By</option>
                <option>Date</option>
                <option>Name</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onViewDetails={() => {
                  onSelectEvent(event.id);
                  onNavigate('EVENT_DETAILS');
              }}
            />
          ))}
        </div>
      </main>

      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © 2024 Event Sphere. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default GuestEventDiscovery;
