import cors from 'cors';
import crypto from 'node:crypto';
import express, { type Request } from 'express';

type SessionRecord = {
  username: string;
  createdAt: string;
};

const app = express();
const port = Number(process.env.PORT ?? 4001);
const adminUsername = process.env.ADMIN_USERNAME ?? 'admin';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'change-me-now';
const sessionSecret = process.env.SESSION_SECRET ?? 'local-session-secret';
const sessions = new Map<string, SessionRecord>();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

const signToken = (sessionId: string) => {
  const signature = crypto.createHmac('sha256', sessionSecret).update(sessionId).digest('hex');
  return `${sessionId}.${signature}`;
};

const verifyToken = (token?: string) => {
  if (!token) {
    return null;
  }

  const [sessionId, signature] = token.split('.');
  if (!sessionId || !signature) {
    return null;
  }

  const expectedSignature = crypto.createHmac('sha256', sessionSecret).update(sessionId).digest('hex');
  if (signature !== expectedSignature) {
    return null;
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return null;
  }

  return { sessionId, session };
};

const getAuthToken = (request: Request) => {
  const header = request.header('authorization');
  if (header?.startsWith('Bearer ')) {
    return header.slice('Bearer '.length);
  }

  return request.header('x-session-token') ?? undefined;
};

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'personal-website-api' });
});

app.post('/api/login', (request, response) => {
  const { username, password } = request.body as { username?: string; password?: string };

  if (username !== adminUsername || password !== adminPassword) {
    response.status(401).json({ message: 'Invalid credentials.' });
    return;
  }

  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, { username: adminUsername, createdAt: new Date().toISOString() });

  response.json({
    token: signToken(sessionId),
    user: { username: adminUsername }
  });
});

app.get('/api/session', (request, response) => {
  const token = getAuthToken(request);
  const session = verifyToken(token);

  if (!session) {
    response.status(401).json({ message: 'No active session.' });
    return;
  }

  response.json({
    user: { username: session.session.username },
    createdAt: session.session.createdAt
  });
});

app.post('/api/logout', (request, response) => {
  const token = getAuthToken(request);
  const session = verifyToken(token);

  if (session) {
    sessions.delete(session.sessionId);
  }

  response.status(204).send();
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
