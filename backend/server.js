require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// ─── Security Headers ────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
// Allow origins from CORS_ORIGIN env var (comma-separated) + localhost dev
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (no origin) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
  })
);

// ─── Body Parsers ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
// ─── Rate Limiting ───────────────────────────────────────────────────────────
// General API limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

// Stricter limit for contact form to prevent spam
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many messages sent. Please wait before trying again.' },
});

app.use('/api', apiLimiter);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Welcome Route ───────────────────────────────────────────────────────────
=======
// Welcome & Health Check Routes
>>>>>>> d1fe33c37aa4c5fa3afb16030d08f3fdb0dc672c
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Portfolio API!' });
});

<<<<<<< HEAD
// ─── Routes ──────────────────────────────────────────────────────────────────
=======
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


// Define Routes
>>>>>>> d1fe33c37aa4c5fa3afb16030d08f3fdb0dc672c
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/certifications', require('./routes/certifications'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/contact', contactLimiter, require('./routes/contact'));

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected server error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack,
  });
});

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT} [${process.env.NODE_ENV || 'development'}]`));
