import React, { useState, useMemo, useEffect } from 'react';
import apiFetch from './src/utils/api';
import { Toaster, toast } from 'react-hot-toast';
import type { View, Event, Guest, Contact } from './types';
import { MOCK_EVENTS, MOCK_GUESTS, MOCK_CONTACTS, CURRENT_USER_ID } from './constants';

import Dashboard from './components/pages/Dashboard';
import RegistrationSuccessPage from './components/pages/RegistrationSuccessPage';
import CreateEditEventForm from './components/pages/CreateEditEventForm';
import EventManagementPage from './components/pages/EventManagementPage';
import RegistrationForm from './components/pages/RegistrationForm';
import FeedbackForm from './components/pages/FeedbackForm';
import AuthPage from './components/pages/AuthPage';
import EventDetailsPage from './components/pages/EventDetailsPage';

type User = { id: number; email: string; role?: string } | null;

const App: React.FC = () => {
    const [view, setView] = useState<View>('AUTH');
    const [previousView, setPreviousView] = useState<View | null>(null);
    const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
    const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
    const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User>(null);

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
    }, []);

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

    const handleLogin = (user: { id: number; email: string; role?: string }, token: string) => {
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
        handleNavigation('AUTH', false);
        setSelectedEventId(null);
        setPreviousView(null);
        try {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
        } catch (err) {}
    };

    const createEvent = (event: Omit<Event, 'id' | 'creatorId'>) => {
        const creator = currentUser ? String(currentUser.id) : CURRENT_USER_ID;
        const newEvent: Event = { ...event, id: `evt-${Date.now()}`, creatorId: creator };
        setEvents(prev => [newEvent, ...prev]);
        toast.success('Event created successfully!');
        handleNavigation('DASHBOARD', false);
    };

    const updateEvent = (updatedEvent: Event) => {
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        toast.success('Event updated successfully!');
        handleNavigation('DASHBOARD', false);
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
        if (!isLoggedIn) {
            return <AuthPage onLogin={handleLogin} />;
        }

        switch (view) {
            case 'DASHBOARD':
                return <Dashboard 
                            events={events}
                            userId={currentUser ? String(currentUser.id) : CURRENT_USER_ID}
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
                            onSubmit={() => {
                                toast.success('Thank you for your feedback!');
                                handleNavigation('DASHBOARD', false);
                            }}
                        /> : <p>Event not found</p>;
            case 'AUTH':
                 return <AuthPage onLogin={handleLogin} />;
            default:
                return <Dashboard 
                            events={events}
                            userId={currentUser ? String(currentUser.id) : CURRENT_USER_ID}
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
