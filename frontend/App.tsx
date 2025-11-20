import React, { useState, useMemo, useEffect, useCallback } from 'react';
import apiFetch, { submitFeedback as submitFeedbackApi, fetchRsvpInvite, submitRsvp } from './src/utils/api';
import { Toaster, toast } from 'react-hot-toast';
import type { View, Event, Guest, Contact, Invitation } from './types';
import { MOCK_GUESTS, MOCK_CONTACTS } from './constants';

import Dashboard from './components/pages/Dashboard';
import RegistrationSuccessPage from './components/pages/RegistrationSuccessPage';
import CreateEditEventForm from './components/pages/CreateEditEventForm';
import EventManagementPage from './components/pages/EventManagementPage';
import RegistrationForm from './components/pages/RegistrationForm';
import FeedbackForm from './components/pages/FeedbackForm';
import RsvpPage from './components/pages/RsvpPage';
import AuthPage from './components/pages/AuthPage';
import EventDetailsPage from './components/pages/EventDetailsPage';
import RegisterAccountPage from './components/pages/RegisterAccountPage';

type User = { id: string; email: string; role?: string; name?: string } | null;
type EventInput = Omit<Event, 'id' | 'creatorId'> | Event;
const EVENT_IMAGE_FALLBACK = 'https://picsum.photos/seed/event/1200/800';

const buildEventRequestPayload = (eventData: EventInput) => ({
    name: eventData.name,
    date: eventData.date,
    time: eventData.time,
    location: eventData.location,
    description: eventData.description,
    registrationDeadline: eventData.registrationDeadline ? eventData.registrationDeadline : null,
    maxCapacity: Number(eventData.maxCapacity ?? 0),
    isPrivate: Boolean(eventData.isPrivate),
    image: eventData.image && eventData.image.length > 0 ? eventData.image : EVENT_IMAGE_FALLBACK,
    category: eventData.category || 'Technology',
});

const App: React.FC = () => {
    const [view, setView] = useState<View>('AUTH');
    const [previousView, setPreviousView] = useState<View | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
    const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User>(null);
    const [rsvpInvite, setRsvpInvite] = useState<{ invitation: Invitation; event: Event } | null>(null);
    const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
    const [rsvpError, setRsvpError] = useState<string | null>(null);

    useEffect(() => {
        // restore session from storage if token present
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            (async () => {
                try {
                    const res = await apiFetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
                    if (res.ok) {
                        const body = await res.json();
                        setCurrentUser(body.user);
                        setIsLoggedIn(true);
                        setView('DASHBOARD');
                    } else {
                        // token invalid - clear
                        localStorage.removeItem('token');
                        sessionStorage.removeItem('token');
                    }
                } catch (err) {
                    console.error('Session restore failed', err);
                }
            })();
        }
        // Direct RSVP link handler
        if (window && window.location && window.location.pathname.startsWith('/rsvp/')) {
            const token = window.location.pathname.replace('/rsvp/', '');
            if (token) {
                (async () => {
                    try {
                        const data = await fetchRsvpInvite(token);
                        setRsvpInvite({ invitation: data.invitation, event: data.event });
                        setSelectedEventId(data.event.id);
                        setView('RSVP_INVITE');
                    } catch (err) {
                        console.error('Failed to load RSVP invite', err);
                        toast.error(err instanceof Error ? err.message : 'RSVP not found');
                    }
                })();
            }
        }
    }, []);

    const fetchEvents = useCallback(async () => {
        try {
            const res = await apiFetch('/api/events');
            if (!res.ok) {
                throw new Error('Failed to load events');
            }
            const body = await res.json();
            if (Array.isArray(body)) {
                setEvents(body);
            } else {
                setEvents([]);
            }
        } catch (err) {
            console.error('Failed to fetch events', err);
            toast.error('Failed to load events. Please try again.');
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchEvents();
        } else {
            setEvents([]);
        }
    }, [isLoggedIn, fetchEvents]);

    const handleNavigation = (newView: View, keepHistory: boolean = true) => {
        if (keepHistory) {
            setPreviousView(view);
        }
        setView(newView);
    };
    
    const goBack = () => {
        if(previousView) {
            setView(previousView);
            setPreviousView(null);
        } else {
            if(isLoggedIn) handleNavigation('DASHBOARD', false);
            else handleNavigation('AUTH', false);
        }
    }

    const handleLogin = (user: { id: string; email: string; role?: string; name?: string }, token: string) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
        try {
            // token already saved by AuthPage; just ensure we have it in storage
            if (!localStorage.getItem('token') && !sessionStorage.getItem('token')) {
                localStorage.setItem('token', token);
            }
        } catch (err) {
            // ignore
        }
        handleNavigation('DASHBOARD', false);
        toast.success('Logged in successfully!');
    };
    
    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setEvents([]);
        handleNavigation('AUTH', false);
        setSelectedEventId(null);
        setPreviousView(null);
        try {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
        } catch (err) {}
    };

    const createEvent = async (event: Omit<Event, 'id' | 'creatorId'>) => {
        try {
            const res = await apiFetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildEventRequestPayload(event))
            });
            const body = await res.json().catch(() => null);
            if (!res.ok || !body) {
                throw new Error((body as any)?.error || 'Failed to create event');
            }
            const created: Event = body;
            setEvents(prev => [created, ...prev.filter(e => e.id !== created.id)]);
            toast.success('Event created successfully!');
            handleNavigation('DASHBOARD', false);
        } catch (err) {
            console.error('Failed to create event', err);
            toast.error(err instanceof Error ? err.message : 'Failed to create event');
        }
    };

    const updateEvent = async (updatedEvent: Event) => {
        try {
            const res = await apiFetch(`/api/events/${updatedEvent.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildEventRequestPayload(updatedEvent))
            });
            const body = await res.json().catch(() => null);
            if (!res.ok || !body) {
                throw new Error((body as any)?.error || 'Failed to update event');
            }
            const saved: Event = body;
            setEvents(prev => prev.map(e => e.id === saved.id ? saved : e));
            toast.success('Event updated successfully!');
            handleNavigation('DASHBOARD', false);
        } catch (err) {
            console.error('Failed to update event', err);
            toast.error(err instanceof Error ? err.message : 'Failed to update event');
        }
    };

    const submitFeedback = async (eventId: string, rating: number, comment: string) => {
        try {
            await submitFeedbackApi(eventId, rating, comment);
            toast.success('Thank you for your feedback!');
            handleNavigation('DASHBOARD', false);
        } catch (err) {
            console.error('Failed to submit feedback', err);
            toast.error(err instanceof Error ? err.message : 'Failed to submit feedback');
        }
    };
    
    const addContact = (contact: Omit<Contact, 'id'>) => {
        const newContact: Contact = { ...contact, id: `ct-${Date.now()}` };
        setContacts(prev => [newContact, ...prev]);
        toast.success('Contact added successfully!');
    };
    
    const updateContact = (updatedContact: Contact) => {
        setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
        toast.success('Contact updated successfully!');
    };

    const deleteContact = (contactId: string) => {
        setContacts(prev => prev.filter(c => c.id !== contactId));
        toast.success('Contact deleted.');
    };

    const selectedEvent = useMemo(() => events.find(e => e.id === selectedEventId), [events, selectedEventId]);

    const renderContent = () => {
        if (!isLoggedIn && view !== 'RSVP_INVITE') {
            if (view === 'REGISTER_USER') {
                return <RegisterAccountPage 
                            onBackToLogin={() => handleNavigation('AUTH', false)}
                            onRegistered={() => handleNavigation('AUTH', false)}
                        />;
            }
            return <AuthPage onLogin={handleLogin} onGoToRegister={() => handleNavigation('REGISTER_USER')} />;
        }

        switch (view) {
            case 'DASHBOARD':
                return <Dashboard 
                            events={events}
                            userId={currentUser ? String(currentUser.id) : ''}
                            onNavigate={handleNavigation}
                            onSelectEvent={setSelectedEventId}
                            onLogout={handleLogout}
                        />;
            case 'CREATE_EVENT':
                return <CreateEditEventForm 
                            onSave={createEvent} 
                            onCancel={() => handleNavigation('DASHBOARD', false)} 
                        />;
            case 'EDIT_EVENT':
                return selectedEvent ? <CreateEditEventForm 
                            eventToEdit={selectedEvent} 
                            onSave={updateEvent} 
                            onCancel={() => handleNavigation('DASHBOARD', false)}
                        /> : <p>Event not found</p>;
            case 'MANAGE_EVENT':
                return selectedEvent ? <EventManagementPage 
                            event={selectedEvent} 
                            guests={guests.filter(g => g.eventId === selectedEvent.id)}
                            contacts={contacts}
                            onNavigate={handleNavigation} 
                            onUpdateEvent={updateEvent}
                            onSelectEvent={setSelectedEventId}
                            onLogout={handleLogout}
                            onAddContact={addContact}
                            onUpdateContact={updateContact}
                            onDeleteContact={deleteContact}
                        /> : <p>Event not found</p>;
            case 'EVENT_DETAILS':
                 return selectedEvent ? <EventDetailsPage
                            event={selectedEvent}
                            onNavigate={handleNavigation}
                            onRegister={() => handleNavigation('REGISTER_FORM')}
                            onBack={goBack}
                        /> : <p>Event not found</p>;
            case 'REGISTER_FORM':
                return selectedEvent ? <RegistrationForm
                            event={selectedEvent}
                            onCancel={goBack}
                            onSubmit={() => {
                                handleNavigation('REGISTRATION_SUCCESS');
                            }}
                        /> : <p>Event not found</p>;
            case 'REGISTRATION_SUCCESS':
                return selectedEvent ? <RegistrationSuccessPage
                            event={selectedEvent}
                            onBackToDetails={() => handleNavigation('EVENT_DETAILS', false)}
                            onDiscoverMore={() => handleNavigation('DASHBOARD', false)}
                        /> : <p>Event not found</p>;
            case 'FEEDBACK_FORM':
                return selectedEvent ? <FeedbackForm
                            event={selectedEvent}
                            onSubmit={(rating, comment) => submitFeedback(selectedEvent.id, rating, comment)}
                        /> : <p>Event not found</p>;
            case 'AUTH':
                 return <AuthPage onLogin={handleLogin} onGoToRegister={() => handleNavigation('REGISTER_USER')} />;
            case 'REGISTER_USER':
                return <RegisterAccountPage 
                            onBackToLogin={() => handleNavigation('AUTH', false)}
                            onRegistered={() => handleNavigation('AUTH', false)}
                        />;
            case 'RSVP_INVITE':
                return rsvpInvite ? (
                    <RsvpPage
                        event={rsvpInvite.event}
                        invitation={rsvpInvite.invitation}
                        submitting={rsvpSubmitting}
                        error={rsvpError ?? undefined}
                        onSubmit={async ({ attending, companions, dietary, personalNote }) => {
                            setRsvpSubmitting(true);
                            setRsvpError(null);
                            try {
                                await submitRsvp(rsvpInvite.invitation.token, { attending, companions, dietary, personalNote });
                                toast.success('RSVP saved. Thank you!');
                                setRsvpInvite(null);
                                handleNavigation(isLoggedIn ? 'DASHBOARD' : 'AUTH', false);
                            } catch (err) {
                                const message = err instanceof Error ? err.message : 'Failed to submit RSVP';
                                setRsvpError(message);
                                toast.error(message);
                            } finally {
                                setRsvpSubmitting(false);
                            }
                        }}
                    />
                ) : <p>Invitation not found</p>;
            default:
                return <Dashboard 
                            events={events}
                            userId={currentUser ? String(currentUser.id) : ''}
                            onNavigate={handleNavigation}
                            onSelectEvent={setSelectedEventId}
                            onLogout={handleLogout}
                        />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Toaster position="top-center" reverseOrder={false} />
            {renderContent()}
        </div>
    );
};

export default App;
