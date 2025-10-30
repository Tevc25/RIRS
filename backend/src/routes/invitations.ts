import { Router } from "express";
const router = Router();

/**
 * @openapi
 * /events/{id}/invitations:
 *   post:
 *     summary: Create/send event invitations
 *     responses:
 *       200:
 *         description: Invitations created
 */
router.post("/events/:id/invitations", (_req, res) => {
  res.json({ message: "TODO: create invitations" });
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
router.get("/events/:id/invitations", (_req, res) => {
  res.json({ message: "TODO: list invitations" });
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
router.post("/invitations/:invitationId/reminder", (_req, res) => {
  res.json({ message: "TODO: send reminder" });
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
router.get("/rsvp/:token", (_req, res) => {
  res.json({ message: "TODO: get RSVP info" });
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
router.post("/rsvp/:token", (_req, res) => {
  res.json({ message: "TODO: submit RSVP" });
});

export default router;
