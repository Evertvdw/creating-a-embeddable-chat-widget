import express from 'express';
import { Database } from '../types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const secret = process.env.JWT_SECRET || 'alksjd;kl3lkrjtokensfklhklkef';

export default function (db: Database) {
  router.post('/login', async (req, res) => {
    console.log('POST /login', [req.body.email]);
    if (!req.body.email || !req.body.password) {
      return res.sendStatus(400);
    }

    const admin = db.admins.findOne({ email: req.body.email });
    if (!admin) return res.sendStatus(401);

    const match = await bcrypt.compare(req.body.password, admin.hash);
    if (match) {
      const token = jwt.sign({ email: admin.email }, secret, {
        expiresIn: '1h',
      });
      const refreshToken = jwt.sign({ email: admin.email }, secret, {
        expiresIn: '30d',
      });
      res.cookie('jwt-refresh', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // Equivalent of 30 days
      });
      return res.send(token);
    } else {
      return res.sendStatus(401);
    }
  });

  router.get('/refresh_token', async (req, res) => {
    const refreshToken = req.cookies['jwt-refresh'];
    if (!refreshToken) {
      res.sendStatus(401);
    } else {
      jwt.verify(
        refreshToken,
        secret,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function (err: any, admin: any) {
          if (err) {
            console.log('[DEBUG] jwt.verify error', err);
            res.sendStatus(401);
          } else {
            console.log('[DEBUG] jwt verify success: ', [admin.email]);
            const token = jwt.sign({ email: admin.email }, secret, {
              expiresIn: '1h',
            });
            res.send(token);
          }
        }
      );
    }
  });

  return router;
}
