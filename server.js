require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./db');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve static front-end files from the workspace root
app.use(express.static(path.join(__dirname)));

// Public endpoints
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Auth: register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = db.createUser(username, hashed);
    res.json({ id: user.id, username: user.username });
  } catch (err) {
    res.status(400).json({ error: 'username taken' });
  }
});

// Auth: login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const row = db.getUserByUsername(username);
  if (!row) return res.status(400).json({ error: 'invalid credentials' });
  const ok = await bcrypt.compare(password, row.password);
  if (!ok) return res.status(400).json({ error: 'invalid credentials' });
  const token = jwt.sign({ id: row.id, username: row.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  res.json({ token });
});

// Middleware: protect
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing token' });
  const token = auth.slice(7);
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = data;
    next();
  } catch (err) {
    res.status(401).json({ error: 'invalid token' });
  }
}

// Protected notes endpoints
app.get('/api/notes', authMiddleware, (req, res) => {
  const rows = db.getNotesByUser(req.user.id);
  res.json(rows);
});

app.post('/api/notes', authMiddleware, (req, res) => {
  const { title, body } = req.body || {};
  const note = db.createNote(req.user.id, title || '', body || '');
  res.json(note);
});

app.put('/api/notes/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  const { title, body } = req.body || {};
  const note = db.updateNote(req.user.id, id, title || '', body || '');
  if (!note) return res.status(404).json({ error: 'not found' });
  res.json(note);
});

app.delete('/api/notes/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  const ok = db.deleteNote(req.user.id, id);
  if (!ok) return res.status(404).json({ error: 'not found' });
  res.json({ deleted: id });
});

// Keep a simple submit route for compatibility
app.post('/api/submit', (req, res) => {
  const payload = req.body || {};
  res.json({ received: payload });
});

// Public portfolio endpoint with dummy data
app.get('/api/portfolio', (req, res) => {
  const items = [
    {
      id: 1,
      title: 'Personal Website',
      description: 'A responsive personal website built with HTML, CSS, and vanilla JS.',
      image: '/assets/portfolio-1.svg',
      url: 'https://example.com/personal-website'
    },
    {
      id: 2,
      title: 'E‑commerce Mock',
      description: 'A demo e-commerce front-end with cart and product pages.',
      image: '/assets/portfolio-2.svg',
      url: 'https://example.com/ecommerce-mock'
    },
    {
      id: 3,
      title: 'Mobile App UI',
      description: 'Design mockups and a prototype for a mobile productivity app.',
      image: '/assets/portfolio-3.svg',
      url: 'https://example.com/mobile-ui'
    },
    {
      id: 4,
      title: 'Brand Refresh',
      description: 'Comprehensive identity refresh for a boutique brand.',
      image: '/assets/portfolio-4.svg',
      url: 'https://example.com/brand-refresh'
    }
  ];
  res.json(items);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
