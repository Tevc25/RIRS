import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

const EventCreateSchema = z.object({
  name: z.string().min(1),
  date: z.string().min(1), // Expect ISO string
  time: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
  rsvpDeadline: z.string().optional()
});

/**
 * GET /events - list events for authenticated organizer
 */
router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const events = await prisma.event.findMany({
      where: { organizerId: req.user.uid },
      orderBy: { date: 'desc' }
    });
    res.json(events);
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
  const { name, date, time, location, description, rsvpDeadline } = parsed.data;
  try {
    const event = await prisma.event.create({
      data: {
        organizerId: req.user.uid,
        name,
        date: new Date(date),
        time,
        location,
        description,
        rsvpDeadline: rsvpDeadline ? new Date(rsvpDeadline) : null
      }
    });
    res.status(201).json(event);
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
    if (event.organizerId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' });
    res.json(event);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

/**
 * PATCH /events/:id - update event (TODO: partial update)
 */
router.patch('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const id = req.params.id;
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  // For now, simple forbidden response to avoid accidental changes
  res.status(501).json({ error: 'Not implemented' });
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
