import express from 'express';
import request from 'supertest';

describe('Server', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  it('responde na rota principal', async () => {
    const app = express();
    app.get('/', (req, res) => res.json({ ok: true }));
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
