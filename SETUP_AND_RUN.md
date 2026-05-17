# 🚀 Marlboro Library - Complete Setup & Run Guide

## Current Status
✅ **Merge conflicts resolved**  
✅ **Frontend and Backend configured**  
✅ **API integration complete**  
✅ **Database setup ready**

---

## 📋 Project Structure

```
Marlborolibrary/
├── src/                          # Frontend (React + TypeScript)
│   ├── app/
│   │   ├── pages/               # Page components (Login, Dashboard, etc.)
│   │   ├── context/             # Auth context
│   │   ├── api/client.ts        # API client (http://localhost:5000/api)
│   │   └── components/          # Reusable components
│   └── styles/                  # Tailwind CSS styles
├── server/                       # Backend (Node.js + Express)
│   ├── routes/                  # API routes
│   ├── controllers/             # Route handlers
│   ├── models/                  # MongoDB schemas
│   ├── middleware/              # Auth middleware
│   ├── index.js                 # Main server file
│   ├── seed.js                  # Database seeding
│   └── .env                     # Environment variables
├── package.json                 # Frontend dependencies
└── vite.config.ts              # Vite configuration
```

---

## 🔧 Prerequisites

Before running the application, ensure you have:

1. **Node.js** (v18+)
   ```bash
   node --version  # Should be v18.0.0 or higher
   ```

2. **MongoDB** (Local or Atlas)
   - **Local:** Running on `mongodb://127.0.0.1:27017`
   - **Atlas:** Connection string in `server/.env`

3. **npm** (v9+)
   ```bash
   npm --version  # Should be v9.0.0 or higher
   ```

---

## 📦 Installation

### Step 1: Install Frontend Dependencies
```bash
npm install
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

---

## ⚙️ Environment Configuration

### Frontend
No additional configuration needed. The API client is already configured to use:
- **Base URL:** `http://localhost:5000/api`
- **Token Storage:** localStorage

### Backend
The `.env` file is already configured:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/marlboro_library
JWT_SECRET=RMKGHTYDSIIOUYTRDFG123
NODE_ENV=development
```

**To change MongoDB connection:**
Edit `server/.env`:
```env
# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marlboro_library?retryWrites=true&w=majority
```

---

## 🗄️ Database Setup (Optional but Recommended)

### Seed Demo Data
To populate the database with demo users and data:

```bash
cd server
npm run seed
cd ..
```

**Demo Credentials After Seeding:**
- **Admin:** username: `admin` / password: `password`
- **Librarian:** username: `librarian` / password: `password`
- **Member:** username: `member` / password: `password`

---

## 🚀 Running the Application

### Option 1: Run in Separate Terminals (Recommended)

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```
Expected output:
```
Connected to MongoDB Database
Server is running on port 5000
```

**Terminal 2 - Frontend (New Terminal):**
```bash
npm run dev
```
Expected output:
```
  VITE v6.3.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Option 2: Run Frontend Only (For Testing UI)
```bash
npm run dev
```
Access: http://localhost:5173

---

## 🏗️ Building for Production

### Build Frontend
```bash
npm run build
```
Output: `dist/` folder

### Deploy
The `dist/` folder contains the production build and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Members
- `GET /api/members` - List all members (protected)
- `POST /api/members` - Create new member (protected)
- `GET /api/members/:id` - Get member details (protected)
- `PUT /api/members/:id` - Update member (protected)
- `DELETE /api/members/:id` - Delete member (protected)

### Books
- `GET /api/books` - List all books (protected)
- `POST /api/books` - Create new book (protected)
- `GET /api/books/:id` - Get book details (protected)
- `PUT /api/books/:id` - Update book (protected)
- `DELETE /api/books/:id` - Delete book (protected)

### Transactions
- `GET /api/transactions` - List all transactions (protected)
- `POST /api/transactions` - Create transaction (protected)
- `GET /api/transactions/:id` - Get transaction details (protected)
- `PUT /api/transactions/:id` - Update transaction (protected)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (protected)

---

## 🔐 Key Features

### Authentication
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin, Librarian, Member)
- ✅ Token stored in localStorage
- ✅ Auto token refresh on protected routes

### Frontend Routes (Protected)
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Admin/Librarian dashboard
- `/members` - Member management
- `/books` - Book catalogue
- `/borrow` - Borrow transactions
- `/return` - Return transactions
- `/history` - Transaction history
- `/reports` - Analytics & reports
- `/profile` - User profile
- `/settings` - System settings (Admin only)

### Core Functionality
- ✅ Member CRUD operations
- ✅ Book catalogue management
- ✅ Borrowing & return workflows
- ✅ Automated fine calculation (R1/day overdue)
- ✅ Real-time availability tracking
- ✅ Transaction history with search/filter
- ✅ Dashboard analytics

---

## 🧪 Automated Tests

Run before submitting or deploying. Uses Vitest; backend tests do **not** need MongoDB Atlas.

**PowerShell:**
```powershell
cd server
npm test
cd ..
npm test
```

**Bash:**
```bash
cd server && npm test
cd .. && npm test
```

| Suite | Location | What it covers |
|-------|----------|----------------|
| Backend (11) | `server/tests/` | Login, JWT profile, borrow, 5-book limit, overdue fines |
| Frontend (11) | `src/app/**/*.test.*` | Route guards, Login page, API base URL |

Optional watch mode: `npm run test:watch`

---

## 🧪 Manual Testing the Application

Use these steps after automated tests pass and both servers are running.

### 1. Test Login
```
Username: admin
Password: password
Role: Administrator
```

### 2. Test Member Management
- Navigate to Members page
- Create a new member
- View, edit, delete operations

### 3. Test Books
- Navigate to Books page
- Add new book
- Search and filter by category/status

### 4. Test Transactions
- Navigate to Borrow page
- Select member and book
- Process borrow transaction
- Then go to Return page to process return

### 5. Test Dashboard
- View real-time statistics
- Check recent activity
- Monitor overdue books

---

## 🐛 Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use:

**For Backend:**
```bash
# Change port in server/.env
PORT=5001
```

**For Frontend:**
```bash
npm run dev -- --port 5174
```

### MongoDB Connection Error
1. Check MongoDB is running
2. Verify connection string in `server/.env`
3. For MongoDB Atlas, ensure IP whitelist includes your IP

### CORS Errors
The backend includes CORS configuration. If issues persist:
- Check backend is running on port 5000
- Verify API client endpoint: `http://localhost:5000/api`

### Frontend Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install
npm run build
```

---

## 📱 Supported Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 📚 Documentation Files

- `README.md` - Quick start, automated tests, troubleshooting
- `PROJECT_DESCRIPTION.md` - Detailed project overview
- `FUNCTIONAL_REQUIREMENTS.md` - Complete feature specifications (§10 = testing)
- `STATUS_REPORT.md` - Current project status and test summary
- `SETUP_AND_RUN.md` - This file

---

## 🔗 Links & References

### Frontend Configuration
- **Vite:** http://localhost:5173
- **API Base:** http://localhost:5000/api
- **Tech Stack:** React 18, TypeScript, Tailwind CSS v4

### Backend Configuration
- **Server:** http://localhost:5000
- **Database:** MongoDB (Local or Atlas)
- **Tech Stack:** Node.js, Express, MongoDB, JWT

---

## ✅ Quick Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB running or Atlas connected
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend dependencies installed (`cd server; npm install` in PowerShell)
- [ ] Automated tests pass (`npm test` in `server/` and project root)
- [ ] Database seeded (`npm run seed` in server folder)
- [ ] Backend running on port 5000 (`npm run dev` in server folder)
- [ ] Frontend running on port 5173 (`npm run dev` in root folder)
- [ ] Can login with demo credentials
- [ ] Dashboard loads with real data

---

## 🚢 Deployment Checklist

### Before Deploying:
- [ ] Run `npm test` in `server/` and project root
- [ ] Run `npm run build` in root directory
- [ ] Verify build output in `dist/` folder
- [ ] Test with `npm run preview` (if available)
- [ ] Review environment variables
- [ ] Set up production MongoDB database
- [ ] Configure backend deployment (Heroku, Railway, Render, etc.)
- [ ] Configure frontend deployment (Vercel, Netlify, etc.)

### Environment Variables for Production:
```env
# Backend (.env)
PORT=5000
MONGODB_URI=<production-mongo-uri>
JWT_SECRET=<strong-secret-key>
NODE_ENV=production

# Frontend (No .env needed, uses backend URL)
```

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review `FUNCTIONAL_REQUIREMENTS.md` for feature details
3. Check the main GitHub repository for updates

---

**Last Updated:** May 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

