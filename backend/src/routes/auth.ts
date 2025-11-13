import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
if (JWT_SECRET === 'dev-secret-change-me' && process.env.NODE_ENV !== 'production') {
  console.warn('[auth] Using fallback JWT secret. Set JWT_SECRET in your environment for security.');
}

const UserRole = {
  ORGANIZER: 'ORGANIZER',
  GUEST: 'GUEST'
} as const;

const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8)
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register as organizer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Register success
 */
router.post('/register', async (req, res) => {
  const parse = RegisterSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid input', details: parse.error.issues });
  }
  const { name, email, password } = parse.data;
  // Check for existing user
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  // Hash password
  const passwordHash = await argon2.hash(password);
  // Create user
  const user = await prisma.user.create({
    data: {
      role: UserRole.ORGANIZER,
      name,
      email,
      passwordHash,
      // Email verification pending -- mark as not verified yet
    }
  });
  // Simulate sending verification email (log to console)
  // In real app, generate token and send via email
  console.log(`[DEV] Verification email would be sent to: ${user.email}`);
  return res.status(201).json({ id: user.id, email: user.email });
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 *     responses:
 *       200:
 *         description: Success, sets cookie
 */
router.post('/login', async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid login input', details: parsed.error.issues });
  }
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== UserRole.ORGANIZER || !user.passwordHash) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  // Password check
  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  // JWT sign
  const token = jwt.sign(
    { uid: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  // Set as http-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  // Also return token and user in body to support SPA token storage when needed
  return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

/**
 * Get current user by Authorization header (Bearer token) or cookie token
 */
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  let token = undefined as string | undefined;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
  const decoded = jwt.verify(token, JWT_SECRET);
    // decoded contains uid and email and role
    const u: any = decoded;
    const user = await prisma.user.findUnique({ where: { id: u.uid } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     responses:
 *       204:
 *         description: Logs out
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.status(204).send();
});

const ForgotPasswordSchema = z.object({ email: z.string().email() });
const ResetPasswordSchema = z.object({ token: z.string().min(8), newPassword: z.string().min(8) });

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     responses:
 *       200:
 *         description: Email sent
 */
router.post('/forgot-password', async (req, res) => {
  const parsed = ForgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid email', details: parsed.error.issues });
  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(200).json({ message: 'If account exists, password reset email would be sent' });
  }
  // Simulate email
  console.log(`[DEV] Would send password reset link to ${email}`);
  return res.status(200).json({ message: 'If account exists, password reset email would be sent' });
});

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     responses:
 *       200:
 *         description: Reset success
 */
router.post('/reset-password', async (req, res) => {
  const parsed = ResetPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid reset', details: parsed.error.issues });
  // TODO: Actually look up token & reset
  // Simulated
  console.log(`[DEV] Would reset password for token: ${parsed.data.token}`);
  return res.json({ message: 'Password reset (simulated)' });
});

const VerifyEmailSchema = z.object({ token: z.string().min(8) });

/**
 * @openapi
 * /auth/verify-email:
 *   post:
 *     summary: Email verification
 *     responses:
 *       200:
 *         description: Verified
 */
router.post('/verify-email', async (req, res) => {
  const parsed = VerifyEmailSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid token', details: parsed.error.issues });
  // Simulate token check
  console.log(`[DEV] Would verify email for token: ${parsed.data.token}`);
  return res.json({ message: 'Email verified (simulated)' });
});

export default router;
