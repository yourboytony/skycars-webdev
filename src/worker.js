import { Hono } from 'hono';
import { handle } from './handler';
import { db } from './lib/db';

const app = new Hono();

// Health check
app.get('/', (c) => c.text('OK'));

// Auth routes
app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  try {
    const user = await db.getUserByEmail(c.env, email);
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    // ... auth logic
    return c.json({ token: 'your-jwt-token' });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Admin routes
app.get('/api/admin/*', async (c) => {
  // ... admin route handling
});

export default app; 