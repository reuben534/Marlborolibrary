import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Book from './models/Book.js';
import Member from './models/Member.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Member.deleteMany({});

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);

    // Seed Users
    const users = [
      {
        username: 'admin',
        password: hashedPassword,
        fullName: 'Admin User',
        email: 'admin@library.com',
        role: 'admin',
      },
      {
        username: 'librarian',
        password: hashedPassword,
        fullName: 'John Librarian',
        email: 'librarian@library.com',
        role: 'librarian',
      },
      {
        username: 'member',
        password: hashedPassword,
        fullName: 'Jane Member',
        email: 'member@library.com',
        role: 'member',
      },
    ];
    await User.insertMany(users);
    console.log('Users seeded successfully');

    // Seed Books
    const books = [
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        category: 'Technology',
        copies: 5,
        available: 5,
        status: 'available',
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt',
        isbn: '978-0201616224',
        category: 'Technology',
        copies: 3,
        available: 3,
        status: 'available',
      },
      {
        title: 'Design Patterns',
        author: 'Gang of Four',
        isbn: '978-0201633610',
        category: 'Technology',
        copies: 4,
        available: 4,
        status: 'available',
      },
      {
        title: 'Refactoring',
        author: 'Martin Fowler',
        isbn: '978-0134757599',
        category: 'Technology',
        copies: 6,
        available: 6,
        status: 'available',
      },
      {
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        isbn: '978-0262033848',
        category: 'Science',
        copies: 3,
        available: 3,
        status: 'available',
      },
    ];
    await Book.insertMany(books);
    console.log('Books seeded successfully');

    // Seed Members
    const members = [
      {
        name: 'John Smith',
        phone: '+44 20 7946 1001',
        email: 'john.smith@email.com',
        status: 'active',
      },
      {
        name: 'Mary Johnson',
        phone: '+44 20 7946 1002',
        email: 'mary.johnson@email.com',
        status: 'active',
      },
      {
        name: 'Peter Williams',
        phone: '+44 20 7946 1003',
        email: 'peter.williams@email.com',
        status: 'inactive',
      },
      {
        name: 'Emma Brown',
        phone: '+44 20 7946 1004',
        email: 'emma.brown@email.com',
        status: 'active',
      },
    ];
    await Member.insertMany(members);
    console.log('Members seeded successfully');

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
