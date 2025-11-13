import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import invitationRoutes from './routes/invitations.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
// Support multiple frontend origins (comma-separated in FRONTEND_URL) and allow requests from the Vite dev server.
const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];
const rawFrontends = process.env.FRONTEND_URL || '';
const envOrigins = rawFrontends.split(',').map(s => s.trim()).filter(Boolean);
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like curl, server-to-server)
    if (!origin) return callback(null, true);
  if (allowedOrigins.includes(origin)) return callback(null, true);
    // not allowed
    return callback(new Error('CORS origin not allowed'), false);
  },
  credentials: true
}));

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Organizacija dogodkov API', version: '1.0.0' },
  },
  apis: ['./src/routes/**/*.ts'],
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Example route
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', invitationRoutes);

// Error handler (placeholder)
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
