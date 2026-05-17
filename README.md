# 📚 Marlboro Library - Digital Management System

A comprehensive, modern MERN stack application designed to streamline library operations. Built with React, TypeScript, Node.js, and MongoDB.

The original design is available at [Figma](https://www.figma.com/design/MKr3fUlxO35VlZCoIuDTq3/Marlboro-Library).

## 🚀 Features

- **Authentication:** JWT-based login with role-based access control (Admin, Librarian, Member).
- **Profile Management:** Users can update their profile information and upload profile photos.
- **Member Management:** Full CRUD operations for library members.
- **Book Catalogue:** Manage books, categories, and real-time availability.
- **Transactions:** Guided workflows for borrowing and returning books, including automated fine calculation.
- **Dashboard:** Real-time statistics and recent activity monitoring.

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS v4, Vite, Lucide Icons, Sonner.
- **Backend:** Node.js, Express.js, Mongoose.
- **Database:** MongoDB Atlas (Cloud) or Local MongoDB.
- **Testing:** Vitest, Supertest, Testing Library (22 automated tests).

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB Atlas Account** (Recommended) or local MongoDB instance.

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/reuben534/Marlborolibrary.git
cd Marlborolibrary-main
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with your Atlas connection string:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/marlboro_library
JWT_SECRET=your_secret_key
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

## 🛠️ Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running locally on port 27017.
   - Check the `MONGODB_URI` in `server/.env`.

2. **API Calls Failing:**
   - Ensure the backend server is running on port 5000.
   - If using a different port, update `BASE_URL` in `src/app/api/client.ts`.

3. **Photo Upload Not Working:**
   - Ensure the root `images/` directory exists and has write permissions.
   - Check if the backend is correctly serving static files from `../images`.

## 🧪 Tests

Automated tests use **Vitest**. Backend tests run against an **in-memory MongoDB** (no Atlas required).

**PowerShell (Windows):**
```powershell
cd server
npm test
cd ..
npm test
```

**Bash / macOS / Linux:**
```bash
cd server && npm test
cd .. && npm test
```

| Suite | Command | Tests |
|-------|---------|-------|
| Backend API | `npm test` in `server/` | 11 (auth, borrow, fines, limits) |
| Frontend unit | `npm test` in project root | 11 (guards, login, API client) |

Watch mode: `npm run test:watch` in either directory.

CI (`.github/workflows/ci.yml`) runs both suites and the frontend build on every push to `main`.

First backend run may take 1–2 minutes while MongoDB Memory Server downloads its binary.

## 📄 License

This project is developed for educational purposes.
