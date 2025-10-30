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
 * @openapi
 * /events:
 *   get:
 *     summary: List user's events
 *     responses:
 *       200:
 *         description: Event list
 */
router.get('/', (req, res) => {
  res.json({ message: 'TODO: list events' });
});

/**
 * @openapi
 * /events:
 *   post:
 *     summary: Create event
 *     responses:
 *       201:
 *         description: Event created
 */
router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user || req.user.role !== 'ORGANIZER') return res.status(403).json({ error: 'Forbidden' });
  const parsed = EventCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid event data', details: parsed.error.issues });
  const { name, date, time, location, description, rsvpDeadline } = parsed.data;
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
});

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     summary: Get event details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event details
 */
router.get('/:id', (req, res) => {
  res.json({ message: 'TODO: event details' });
});

/**
 * @openapi
 * /events/{id}:
 *   patch:
 *     summary: Edit event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event edited
 */
router.patch('/:id', (req, res) => {
  res.json({ message: 'TODO: update event' });
});

/**
 * @openapi
 * /events/{id}:
 *   delete:
 *     summary: Delete event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete('/:id', (req, res) => {
  res.status(204).send();
});

export default router;
