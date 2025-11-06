
import React from 'react';
import type { Event, View } from '../../types';
import { LogOut, Calendar, MapPin, CheckCircle, Clock, Search } from 'lucide-react';

interface GuestEventsOverviewProps {
  events: Event[];
  onNavigate: (view: View) => void;
  onSelectEvent: (eventId: string) => void;
  onLogout: () => void;
}

const GuestEventCard: React.FC<{event: Event, onSelect: () => void}> = ({ event, onSelect }) => {
    // Mock status for demonstration
    const status: 'checked-in' | 'invited' = event.id === 'evt-1' ? 'checked-in' : 'invited';

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row">
            <img src={event.image} alt={event.name} className="w-full md:w-1/3 h-48 md:h-full object-cover"/>
            <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-semibold text-primary-600">{event.category.toUpperCase()}</p>
                        {status === 'checked-in' ? (
                            <span className="flex items-center text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                <CheckCircle className="w-4 h-4 mr-1"/> Registered
                            </span>
                        ) : (
                            <span className="flex items-center text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                                <Clock className="w-4 h-4 mr-1"/> Invited
                            </span>
                        )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mt-2">{event.name}</h3>
                    <div className="flex items-center text-gray-500 text-sm mt-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mt-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.location}</span>
                    </div>
                </div>
                <div className="mt-6 text-right">
                    <button onClick={onSelect} className="font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                        View Details →
                    </button>
                </div>
            </div>
        </div>
    );
}

const GuestEventsOverview: React.FC<GuestEventsOverviewProps> = ({ events, onNavigate, onSelectEvent, onLogout }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
          <div className="flex items-center space-x-4">
              <button 
                onClick={() => onNavigate('GUEST_EVENT_DISCOVERY')}
                className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 bg-primary-100 px-3 py-2 rounded-md transition-colors"
                >
                  <Search className="w-4 h-4 mr-2"/>
                  Discover Events
              </button>
              <button onClick={onLogout} className="text-gray-500 hover:text-gray-700">
                <LogOut className="w-6 h-6"/>
              </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Hi there!</h2>
            <p className="mt-2 text-md text-gray-600">Here's a list of all events you're invited to. Check the details and register your attendance.</p>
        </div>
        
        <div className="space-y-8">
            {events.slice(0, 3).map(event => ( // Show a subset for demo
                 <GuestEventCard 
                    key={event.id}
                    event={event}
                    onSelect={() => {
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

export default GuestEventsOverview;
