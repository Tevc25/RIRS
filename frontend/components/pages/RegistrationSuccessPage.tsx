import React from 'react';
import type { Event } from '../../types';
import { CheckCircle, ArrowLeft, Search } from 'lucide-react';

interface RegistrationSuccessPageProps {
  event: Event;
  onBackToDetails: () => void;
  onDiscoverMore: () => void;
}

const RegistrationSuccessPage: React.FC<RegistrationSuccessPageProps> = ({ event, onBackToDetails, onDiscoverMore }) => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Registration Confirmed!</h2>
        <p className="mt-2 text-lg font-semibold text-primary-600">You're all set for {event.name}.</p>
        <p className="mt-2 text-sm text-gray-600">We've sent a confirmation to your email. We look forward to seeing you there!</p>
        
        <div className="mt-8 space-y-4">
          <button 
            onClick={onBackToDetails}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2"/>
            Back to Event Details
          </button>
          <button
            onClick={onDiscoverMore}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Search className="w-4 h-4 mr-2"/>
            Discover More Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;
