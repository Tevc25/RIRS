import React, { useState } from 'react';
import type { Event, Invitation } from '../../types';
import { Calendar, Clock, MapPin, Check, X, Users, MessageSquare } from 'lucide-react';

interface RsvpPageProps {
  event: Event;
  invitation: Invitation;
  onSubmit: (payload: { attending: boolean; companions: number; dietary?: string; personalNote?: string }) => Promise<void> | void;
  onCancel?: () => void;
  submitting?: boolean;
  error?: string | null;
}

const RsvpPage: React.FC<RsvpPageProps> = ({ event, invitation, onSubmit, onCancel, submitting = false, error }) => {
  const [attending, setAttending] = useState<boolean>(true);
  const [companions, setCompanions] = useState<number>(0);
  const [dietary, setDietary] = useState<string>('');
  const [personalNote, setPersonalNote] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ attending, companions: Math.max(0, companions), dietary: dietary || undefined, personalNote: personalNote || undefined });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <header className="bg-primary-600 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Invitation for</p>
            <h1 className="text-2xl font-bold">{event.name}</h1>
          </div>
          <div className="text-right text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-700">Hello{invitation.name ? ` ${invitation.name}` : ''}! Please confirm your attendance and preferences below.</p>
          </div>

          {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input type="radio" name="attending" checked={attending} onChange={() => setAttending(true)} className="text-primary-600 focus:ring-primary-600" />
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  <Check className="w-4 h-4 text-green-500" /> I will attend
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input type="radio" name="attending" checked={!attending} onChange={() => setAttending(false)} className="text-primary-600 focus:ring-primary-600" />
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  <X className="w-4 h-4 text-red-500" /> Unable to attend
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of companions</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min={0}
                    value={companions}
                    onChange={(e) => setCompanions(parseInt(e.target.value || '0', 10))}
                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dietary preferences</label>
                <input
                  type="text"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="e.g., vegetarian, gluten-free"
                  className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400" /> Personal note
              </label>
              <textarea
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Anything you'd like to share with the organizer?"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 inline-flex justify-center items-center px-4 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700 transition ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitting ? 'Submitting...' : 'Submit RSVP'}
              </button>
              {onCancel && (
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RsvpPage;
