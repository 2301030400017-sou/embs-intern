import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { getDb } from './data/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Set response headers
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'CareSignal');
  next();
});

// API Routes (Patient data)
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Serve React static assets in production
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Route fallback for client-side routing in production SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Initialize database connection check then start server
getDb()
  .then(() => {
    console.log('Successfully connected to SQLite database caresignal.db');
    app.listen(port, () => {
      console.log(`CareSignal server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Fatal error: Failed to connect to database.', err);
    process.exit(1);
  });
