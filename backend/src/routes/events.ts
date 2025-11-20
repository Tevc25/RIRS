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
const FeedbackSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
});

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
    const data = buildEventData(parsed.data as EventUpdateInput);
    const updated = await prisma.event.update({
      where: { id },
      data
    });

    // Track changes for audit/history
    const changedFields: { field: string; oldValue?: string | null; newValue?: string | null }[] = [];
    const normalize = (val: any) => {
      if (val === null || val === undefined) return null;
      if (val instanceof Date) return val.toISOString();
      return String(val);
    };
    Object.keys(data).forEach(key => {
      const oldVal = normalize((existing as any)[key]);
      const newVal = normalize((updated as any)[key]);
      if (oldVal !== newVal) {
        changedFields.push({ field: key, oldValue: oldVal, newValue: newVal });
      }
    });
    if (changedFields.length > 0) {
      await prisma.changeLog.createMany({
        data: changedFields.map(change => ({
          eventId: id,
          field: change.field,
          oldValue: change.oldValue ?? undefined,
          newValue: change.newValue ?? undefined
        }))
      });
    }

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

/**
 * POST /events/:id/feedback - submit feedback for event (public)
 */
router.post('/:id/feedback', async (req, res) => {
  const id = req.params.id;
  const parsed = FeedbackSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid feedback', details: parsed.error.issues });
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    const feedback = await prisma.feedback.create({
      data: {
        eventId: id,
        rating: parsed.data.rating,
        comment: parsed.data.comment || undefined
      }
    });
    res.status(201).json(feedback);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

/**
 * GET /events/:id/feedback - list feedback (organizer only)
 */
router.get('/:id/feedback', requireAuth, async (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.organizerId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' });

    const feedback = await prisma.feedback.findMany({
      where: { eventId: id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(feedback);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

/**
 * GET /events/:id/report - export summary report for organizer
 */
router.get('/:id/report', requireAuth, async (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.organizerId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' });

    const [invitations, feedback] = await Promise.all([
      prisma.invitation.findMany({ where: { eventId: id }, include: { rsvp: true } }),
      prisma.feedback.findMany({ where: { eventId: id } })
    ]);

    const totalInvitations = invitations.length;
    const responded = invitations.filter(i => i.status === 'RESPONDED').length;
    const opened = invitations.filter(i => i.openedAt).length;
    const bounced = invitations.filter(i => i.status === 'BOUNCED').length;
    const manual = invitations.filter(i => i.status === 'MANUAL').length;
    const attending = invitations.reduce((sum, inv) => {
      if (inv.rsvp && inv.rsvp.attending) {
        return sum + 1 + (inv.rsvp.companions || 0);
      }
      return sum;
    }, 0);

    const avgRating = feedback.length > 0
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
      : null;

    res.json({
      event: serializeEvent(event),
      invitations: { total: totalInvitations, responded, opened, bounced, manual },
      attendance: { attending },
      feedback: { count: feedback.length, averageRating: avgRating },
      generatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;
