import type { Event, Guest, Contact } from './types';

export const CURRENT_USER_ID = 'user-123';

export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt-1',
    creatorId: 'user-456',
    name: 'Annual Tech Innovations Summit',
    date: '2024-10-25',
    time: '09:00',
    location: 'Convention Center, Downtown',
    description: 'Explore the latest breakthroughs in AI, machine learning, and quantum computing. Network with industry leaders and innovators from around the globe.',
    registrationDeadline: '2024-10-15T23:59',
    maxCapacity: 500,
    isPrivate: false,
    image: 'https://picsum.photos/seed/tech/1200/800',
    category: 'Technology',
  },
  {
    id: 'evt-2',
    creatorId: 'user-789',
    name: 'Global Sounds Music Festival',
    date: '2024-11-10',
    time: '13:00',
    location: 'Central Park Arena, City Center',
    description: 'A day-long celebration of music with international artists and local bands across multiple stages. Food trucks and art installations will be available.',
    registrationDeadline: '2024-11-01T23:59',
    maxCapacity: 5000,
    isPrivate: false,
    image: 'https://picsum.photos/seed/music/1200/800',
    category: 'Music',
  },
  {
    id: 'evt-3',
    creatorId: CURRENT_USER_ID,
    name: 'Modern Art & Design Exhibition',
    date: '2024-12-01',
    time: '10:00',
    location: 'Grand Gallery, Art District',
    description: 'Showcasing groundbreaking works from emerging and established artists. Experience interactive exhibits and thought-provoking installations.',
    registrationDeadline: '2024-11-20T23:59',
    maxCapacity: 200,
    isPrivate: false,
    image: 'https://picsum.photos/seed/art/1200/800',
    category: 'Art & Culture',
  },
   {
    id: 'evt-4',
    creatorId: CURRENT_USER_ID,
    name: 'Mindful Living Wellness Retreat',
    date: '2024-10-20',
    time: '08:00',
    location: 'Lakeside Resort, Countryside',
    description: 'A day dedicated to holistic well-being with yoga, meditation, healthy meals, and workshops on stress management.',
    registrationDeadline: '2024-10-10T23:59',
    maxCapacity: 75,
    isPrivate: true,
    image: 'https://picsum.photos/seed/wellness/1200/800',
    category: 'Wellness',
  },
];

export const MOCK_GUESTS: Guest[] = [
  { id: 'gst-1', eventId: 'evt-1', name: 'Adam Ulrinson', email: 'adam.ulrinson@example.com', status: 'Confirmed', followers: 2, dietaryRestrictions: ['Vegan'], personalMessage: 'Looking forward to it!' },
  { id: 'gst-2', eventId: 'evt-1', name: 'Bob Willerny', email: 'bob.willerny@example.com', status: 'Pending', followers: 1, dietaryRestrictions: [], personalMessage: '' },
  { id: 'gst-3', eventId: 'evt-1', name: 'Christine Davis', email: 'christine.davis@example.com', status: 'Declined', followers: 0, dietaryRestrictions: [], personalMessage: 'Sorry, cannot make it.' },
  { id: 'gst-4', eventId: 'evt-1', name: 'Emily Wilson', email: 'emily.wilson@example.com', status: 'Confirmed', followers: 1, dietaryRestrictions: ['Gluten-Free'], personalMessage: '' },
  { id: 'gst-5', eventId: 'evt-2', name: 'David Lee', email: 'david.lee@example.com', status: 'Pending', followers: 4, dietaryRestrictions: [], personalMessage: '' },
  { id: 'gst-6', eventId: 'evt-2', name: 'Fiona White', email: 'fiona.white@example.com', status: 'Confirmed', followers: 2, dietaryRestrictions: [], personalMessage: 'So excited!' },
];

export const MOCK_CONTACTS: Contact[] = [
    { id: 'ct-1', name: 'Alice Johnson', email: 'alice.johnson@example.com' },
    { id: 'ct-2', name: 'Bob Smith', email: 'bob.smith@example.com' },
    { id: 'ct-3', name: 'Charlie Brown', email: 'charlie.brown@example.com' },
    { id: 'ct-4', name: 'Diana Miller', email: 'diana.miller@example.com' },
    { id: 'ct-5', name: 'Ethan Davis', email: 'ethan.davis@example.com' },
    { id: 'ct-6', name: 'Fiona White', email: 'fiona.white@example.com' },
    { id: 'ct-7', name: 'George Green', email: 'george.green@example.com' },
];
