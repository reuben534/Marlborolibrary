# Marlboro Library

This is a code bundle for Marlboro Library. The original project is available at https://www.figma.com/design/MKr3fUlxO35VlZCoIuDTq3/Marlboro-Library.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

=======

# 📚 Marlboro Library - Digital Management System

A comprehensive, modern MERN stack application designed to streamline library operations. Built with React, TypeScript, Node.js, and MongoDB.

## 🚀 Features

- **Authentication:** JWT-based login with role-based access control (Admin, Librarian, Member).
- **Member Management:** Full CRUD operations for library members.
- **Book Catalogue:** Manage books, categories, and real-time availability.
- **Transactions:** guided workflows for borrowing and returning books, including automated fine calculation.
- **Dashboard:** Real-time statistics and recent activity monitoring.

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS v4, Vite, Lucide Icons, Sonner.
- **Backend:** Node.js, Express.js, Mongoose.
- **Database:** MongoDB (Local or Atlas).

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (Local instance running on port 27017 or a MongoDB Atlas account)

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Marlborolibrary-main
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/marlboro_library
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ..
npm install
```

### 4. Seed the Database (Optional)

To populate the database with initial demo data:

```bash
cd server
npm run seed
```

## 🏃 Running the Application

### Start the Backend

```bash
cd server
npm run dev
```

### Start the Frontend

In a new terminal:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🔑 Demo Credentials (After Seeding)

- **Admin:** `admin` / `password`
- **Librarian:** `librarian` / `password`
- **Member:** `member` / `password`

## 📄 License

This project is developed for educational purposes.
