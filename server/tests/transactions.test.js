import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import Transaction from '../models/Transaction.js';
import Book from '../models/Book.js';
import {
  seedLibrarian,
  loginAs,
  authHeader,
  createMember,
  createBook,
} from './helpers.js';

describe('Transactions API', () => {
  const app = createApp();

  it('GET /api/transactions returns 401 without token', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.status).toBe(401);
  });

  it('POST /api/transactions/borrow creates loan and decrements availability', async () => {
    await seedLibrarian();
    const token = await loginAs(app, 'librarian', 'librarian');
    const member = await createMember();
    const book = await createBook({ available: 2, copies: 2 });

    const res = await request(app)
      .post('/api/transactions/borrow')
      .set(authHeader(token))
      .send({ memberId: member._id.toString(), bookId: book._id.toString() });

    expect(res.status).toBe(201);
    expect(res.body.member).toBeTruthy();
    expect(res.body.status).toBe('active');

    const updatedBook = await Book.findById(book._id);
    expect(updatedBook.available).toBe(1);
  });

  it('POST /api/transactions/borrow enforces 5-book limit', async () => {
    await seedLibrarian();
    const token = await loginAs(app, 'librarian', 'librarian');
    const member = await createMember({ email: 'limit@test.com' });

    for (let i = 0; i < 5; i++) {
      const book = await createBook({
        isbn: `LIMIT-${i}-${Date.now()}`,
        available: 1,
      });
      await Transaction.create({
        member: member._id,
        book: book._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'active',
      });
    }

    const extraBook = await createBook({
      isbn: `LIMIT-EXTRA-${Date.now()}`,
      available: 1,
    });

    const res = await request(app)
      .post('/api/transactions/borrow')
      .set(authHeader(token))
      .send({
        memberId: member._id.toString(),
        bookId: extraBook._id.toString(),
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/limit/i);
  });

  it('POST /api/transactions/return/:id calculates overdue fine (R1/day)', async () => {
    await seedLibrarian();
    const token = await loginAs(app, 'librarian', 'librarian');
    const member = await createMember({ email: 'fine@test.com' });
    const book = await createBook({
      isbn: `FINE-${Date.now()}`,
      available: 0,
      copies: 1,
    });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() - 3);

    const transaction = await Transaction.create({
      member: member._id,
      book: book._id,
      dueDate,
      status: 'active',
      borrowDate: new Date(dueDate.getTime() - 14 * 24 * 60 * 60 * 1000),
    });

    const res = await request(app)
      .post(`/api/transactions/return/${transaction._id}`)
      .set(authHeader(token))
      .send({ condition: 'Good' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('returned');
    expect(res.body.fine).toBeGreaterThanOrEqual(3);
  });
});
