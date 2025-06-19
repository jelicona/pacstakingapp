import request from 'supertest';
import express from 'express';
import { router as walletRouter } from '../src/routes/wallet';

const app = express();
app.use('/wallet', walletRouter);

describe('GET /wallet', () => {
  it('returns status 200 and text "Wallet route"', async () => {
    const response = await request(app).get('/wallet');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Wallet route');
  });
});
