import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import User from '../models/User.js';
import { seedLibrarian, loginAs, authHeader } from './helpers.js';

describe('Auth API', () => {
  const app = createApp();

  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('POST /api/auth/login returns JWT for valid credentials', async () => {
    await seedLibrarian();

    const res = await request(app).post('/api/auth/login').send({
      username: 'librarian',
      password: 'password',
      role: 'librarian',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.role).toBe('librarian');
    expect(res.body.username).toBe('librarian');
  });

  it('POST /api/auth/login rejects invalid password', async () => {
    await seedLibrarian();

    const res = await request(app).post('/api/auth/login').send({
      username: 'librarian',
      password: 'wrong',
      role: 'librarian',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('POST /api/auth/login rejects wrong role', async () => {
    await seedLibrarian();

    const res = await request(app).post('/api/auth/login').send({
      username: 'librarian',
      password: 'password',
      role: 'admin',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/role/i);
  });

  it('GET /api/auth/profile requires authentication', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/profile returns user when authenticated', async () => {
    await seedLibrarian();
    const token = await loginAs(app, 'librarian', 'librarian');

    const res = await request(app)
      .get('/api/auth/profile')
      .set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('librarian');
    expect(res.body.password).toBeUndefined();
  });

  it('POST /api/auth/register rejects duplicate username', async () => {
    await User.create({
      username: 'existing',
      password: 'password',
      fullName: 'Existing User',
      email: 'existing@test.com',
      role: 'member',
    });

    const res = await request(app).post('/api/auth/register').send({
      fullName: 'Another User',
      username: 'existing',
      email: 'another@test.com',
      password: 'password',
      role: 'member',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });
});
