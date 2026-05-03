import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/send-email', async (req, res) => {
    const { to, subject, html } = req.body;

    console.log(`[Email Service] Attempting to send email to: ${to}`);
    console.log(`[Email Service] Subject: ${subject}`);

    try {
      if (!resend) {
        console.warn('[Email Service] RESEND_API_KEY is missing. Logging email instead.');
        return res.json({ 
          success: true, 
          message: 'Email logged (API key missing)',
          preview: html.substring(0, 500) + '...'
        });
      }

      const { data, error } = await resend.emails.send({
        from: 'Fostorio Store <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: html,
      });

      if (error) {
        console.error('[Email Service] Error sending email:', error);
        return res.status(400).json({ success: false, error });
      }

      console.log('[Email Service] Email sent successfully:', data);
      res.json({ success: true, data });
    } catch (err) {
      console.error('[Email Service] Unexpected error:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
