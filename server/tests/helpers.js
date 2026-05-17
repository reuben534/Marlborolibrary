import request from 'supertest';
import User from '../models/User.js';
import Member from '../models/Member.js';
import Book from '../models/Book.js';

export async function seedLibrarian() {
  await User.create({
    username: 'librarian',
    password: 'password',
    fullName: 'Test Librarian',
    email: 'librarian@test.com',
    role: 'librarian',
  });
}

export async function seedAdmin() {
  await User.create({
    username: 'admin',
    password: 'password',
    fullName: 'Test Admin',
    email: 'admin@test.com',
    role: 'admin',
  });
}

export async function loginAs(app, username, role) {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username, password: 'password', role });

  return res.body.token;
}

export async function createMember(overrides = {}) {
  return Member.create({
    name: 'Test Member',
    phone: '0712345678',
    email: 'member@test.com',
    status: 'active',
    ...overrides,
  });
}

export async function createBook(overrides = {}) {
  return Book.create({
    title: 'Test Book',
    author: 'Test Author',
    isbn: `ISBN-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    category: 'General',
    copies: 1,
    available: 1,
    ...overrides,
  });
}

export function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}
