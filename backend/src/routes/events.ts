import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { z } from 'zod';
import { PrismaClient, type Event as PrismaEvent } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

const EventBaseSchema = z.object({
  name: z.string().min(1),
  date: z.string().min(1), // Expect ISO string
  time: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
  registrationDeadline: z.string().optional().nullable(),
  maxCapacity: z.coerce.number().int().min(0),
  isPrivate: z.boolean(),
  image: z.string().optional().nullable(),
  category: z.string().min(1)
});

const EventCreateSchema = EventBaseSchema;
const EventUpdateSchema = EventBaseSchema.partial();

type EventCreateInput = z.infer<typeof EventCreateSchema>;
type EventUpdateInput = z.infer<typeof EventUpdateSchema>;

const serializeEvent = (event: PrismaEvent) => ({
  id: event.id,
  creatorId: event.organizerId,
  name: event.name,
  date: event.date.toISOString(),
  time: event.time,
  location: event.location,
  description: event.description,
  registrationDeadline: event.registrationDeadline ? event.registrationDeadline.toISOString() : '',
  maxCapacity: event.maxCapacity,
  isPrivate: event.isPrivate,
  image: event.image || 'https://picsum.photos/seed/event/1200/800',
  category: event.category || 'Technology',
});

const buildEventData = (payload: EventCreateInput | EventUpdateInput) => {
  const data: any = {};
  if (payload.name !== undefined) data.name = payload.name;
  if (payload.date !== undefined) data.date = new Date(payload.date);
  if (payload.time !== undefined) data.time = payload.time;
  if (payload.location !== undefined) data.location = payload.location;
  if (payload.description !== undefined) data.description = payload.description;
  if (payload.registrationDeadline !== undefined) {
    data.registrationDeadline = payload.registrationDeadline
      ? new Date(payload.registrationDeadline)
      : null;
  }
  if (payload.maxCapacity !== undefined) data.maxCapacity = payload.maxCapacity;
  if (payload.isPrivate !== undefined) data.isPrivate = payload.isPrivate;
  if (payload.image !== undefined) data.image = payload.image && payload.image.length > 0 ? payload.image : null;
  if (payload.category !== undefined) data.category = payload.category;
  return data;
};

/**
 * GET /events - list events for authenticated organizer
 */
router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { organizerId: req.user.uid },
          { isPrivate: false }
        ]
      },
      orderBy: { date: 'desc' }
    });
    res.json(events.map(serializeEvent));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

/**
 * POST /events - create new event
 */
router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user || req.user.role !== 'ORGANIZER') return res.status(403).json({ error: 'Forbidden' });
  const parsed = EventCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid event data', details: parsed.error.issues });
  const eventPayload = parsed.data;
  try {
    const event = await prisma.event.create({
      data: {
        organizerId: req.user.uid,
        ...buildEventData(eventPayload as EventCreateInput)
      }
    });
    res.status(201).json(serializeEvent(event));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

/**
 * GET /events/:id - event details (only organizer)
 */
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ error: 'Not found' });
    if (event.organizerId !== req.user.uid && event.isPrivate) return res.status(403).json({ error: 'Forbidden' });
    res.json(serializeEvent(event));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

/**
 * PATCH /events/:id - update event
 */
router.patch('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const parsed = EventUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid event data', details: parsed.error.issues });
  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });
    if (existing.organizerId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' });
    const updated = await prisma.event.update({
      where: { id },
      data: buildEventData(parsed.data as EventUpdateInput)
    });
    res.json(serializeEvent(updated));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

/**
 * DELETE /events/:id - delete event
 */
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ error: 'Not found' });
    if (event.organizerId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' });
    await prisma.event.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
