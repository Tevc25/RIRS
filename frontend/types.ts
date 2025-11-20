export type View =
  | 'AUTH'
  | 'DASHBOARD'
  | 'CREATE_EVENT'
  | 'EDIT_EVENT'
  | 'MANAGE_EVENT'
  | 'EVENT_DETAILS'
  | 'REGISTER_FORM'
  | 'REGISTRATION_SUCCESS'
  | 'FEEDBACK_FORM'
  | 'REGISTER_USER'
  // FIX: Add missing view types for guest navigation.
  | 'GUEST_EVENTS_OVERVIEW'
  | 'GUEST_EVENT_DISCOVERY'
  | 'RSVP_INVITE';

export type InvitationStatus = 'SENT' | 'OPENED' | 'RESPONDED' | 'BOUNCED' | 'MANUAL';

export interface Event {
  id: string;
  creatorId: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  registrationDeadline: string;
  maxCapacity: number;
  isPrivate: boolean;
  image: string;
  category: 'Technology' | 'Music' | 'Art & Culture' | 'Education' | 'Wellness' | 'Entertainment';
}

export type GuestStatus = 'Confirmed' | 'Pending' | 'Declined' | 'Manually Added';

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email: string;
  status: GuestStatus;
  followers: number;
  dietaryRestrictions: string[];
  personalMessage: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
}

export interface Invitation {
  id: string;
  eventId: string;
  email: string;
  name?: string | null;
  status: InvitationStatus;
  token: string;
  sentAt?: string | null;
  openedAt?: string | null;
  respondedAt?: string | null;
  createdAt?: string;
  rsvp?: {
    attending: boolean;
    companions: number;
    dietary?: string | null;
    personalNote?: string | null;
  } | null;
}

export interface EventManagementPageProps {
  event: Event;
  guests: Guest[];
  contacts: Contact[];
  onNavigate: (view: View) => void;
  onUpdateEvent: (event: Event) => void;
  onSelectEvent: (eventId: string | null) => void;
  onLogout: () => void;
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
  onUpdateContact: (contact: Contact) => void;
  onDeleteContact: (contactId: string) => void;
}
