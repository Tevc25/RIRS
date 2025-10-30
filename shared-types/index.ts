export type UserRole = 'ORGANIZER' | 'GUEST';
export type InvitationStatus = 'SENT' | 'OPENED' | 'RESPONDED' | 'BOUNCED' | 'MANUAL';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  emailVerifiedAt?: string;
  passwordHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  organizerId: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  rsvpDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invitation {
  id: string;
  eventId: string;
  email: string;
  name?: string;
  status: InvitationStatus;
  token: string;
  sentAt?: string;
  openedAt?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface RSVP {
  id: string;
  invitationId: string;
  attending: boolean;
  companions: number;
  dietary?: string;
  personalNote?: string;
  createdAt: string;
}

export interface ChangeLog {
  id: string;
  eventId: string;
  field: string;
  oldValue?: string;
  newValue?: string;
  changedAt: string;
}

export interface Feedback {
  id: string;
  eventId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  organizerId: string;
  name: string;
  email: string;
  createdAt: string;
}
