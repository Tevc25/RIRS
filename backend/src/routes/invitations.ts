import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import crypto from "crypto";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = Router();

const InvitationCreateSchema = z.object({
  invitations: z.array(z.object({
    email: z.string().email(),
    name: z.string().optional().nullable()
  }))
});

const RSVPSubmitSchema = z.object({
  attending: z.boolean(),
  companions: z.coerce.number().int().min(0).optional().default(0),
  dietary: z.string().optional().nullable(),
  personalNote: z.string().optional().nullable(),
});

/**
 * @openapi
 * /events/{id}/invitations:
 *   post:
 *     summary: Create/send event invitations
 *     responses:
 *       200:
 *         description: Invitations created
 */
router.post("/events/:id/invitations", requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const eventId = req.params.id;
  const parsed = InvitationCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid invitations payload', details: parsed.error.issues });
  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.organizerId !== req.user.uid) return res.status(403).json({ error: "Forbidden" });

    const data = parsed.data.invitations.map(inv => ({
      eventId,
      email: inv.email,
      name: inv.name,
      status: "SENT" as const,
      token: crypto.randomUUID(),
      sentAt: new Date()
    }));

    await prisma.invitation.createMany({ data });
    const created = await prisma.invitation.findMany({ where: { eventId } });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create invitations" });
  }
});

/**
 * @openapi
 * /events/{id}/invitations:
 *   get:
 *     summary: Get invitations for event
 *     responses:
 *       200:
 *         description: List of invitations
 */
router.get("/events/:id/invitations", requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const eventId = req.params.id;
  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.organizerId !== req.user.uid) return res.status(403).json({ error: "Forbidden" });

    const invitations = await prisma.invitation.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
      include: { rsvp: true }
    });
    res.json(invitations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch invitations" });
  }
});

/**
 * @openapi
 * /invitations/{invitationId}/reminder:
 *   post:
 *     summary: Send RSVP reminder
 *     responses:
 *       200:
 *         description: Reminder sent
 */
router.post("/invitations/:invitationId/reminder", requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const invitationId = req.params.invitationId;
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: { event: true }
    });
    if (!invitation) return res.status(404).json({ error: "Invitation not found" });
    if (invitation.event.organizerId !== req.user.uid) return res.status(403).json({ error: "Forbidden" });

    const updated = await prisma.invitation.update({
      where: { id: invitationId },
      data: { sentAt: new Date() }
    });
    // In a real app, this would enqueue an email send; here we just return success.
    res.json({ message: "Reminder sent", invitation: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send reminder" });
  }
});

/**
 * @openapi
 * /rsvp/{token}:
 *   get:
 *     summary: Get RSVP form payload
 *     responses:
 *       200:
 *         description: RSVP info
 */
router.get("/rsvp/:token", async (req, res) => {
  const token = req.params.token;
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { event: true, rsvp: true }
    });
    if (!invitation) return res.status(404).json({ error: "Invitation not found" });
    res.json({
      invitation: {
        id: invitation.id,
        email: invitation.email,
        name: invitation.name,
        status: invitation.status,
        sentAt: invitation.sentAt,
        openedAt: invitation.openedAt,
        respondedAt: invitation.respondedAt
      },
      event: invitation.event,
      rsvp: invitation.rsvp || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load RSVP" });
  }
});

/**
 * @openapi
 * /rsvp/{token}:
 *   post:
 *     summary: Submit RSVP
 *     responses:
 *       200:
 *         description: RSVP submitted
 */
router.post("/rsvp/:token", async (req, res) => {
  const token = req.params.token;
  const parsed = RSVPSubmitSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid RSVP payload", details: parsed.error.issues });
  try {
    const invitation = await prisma.invitation.findUnique({ where: { token } });
    if (!invitation) return res.status(404).json({ error: "Invitation not found" });

    const rsvp = await prisma.rSVP.upsert({
      where: { invitationId: invitation.id },
      update: parsed.data,
      create: {
        invitationId: invitation.id,
        ...parsed.data
      }
    });

    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: "RESPONDED", respondedAt: new Date() }
    });

    res.json({ message: "RSVP recorded", rsvp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit RSVP" });
  }
});

export default router;
