# 📚 Marlboro Library - Digital Management System

![Library Management](https://img.shields.io/badge/Library-Management-1B5E4B?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 🎯 Project Overview

**Marlboro Library Digital Management System** is a comprehensive, modern web application designed to streamline library operations. Built with React, TypeScript, and Tailwind CSS, the system provides an intuitive interface for managing members, books, borrowing transactions, and administrative tasks.

The application supports **three distinct user roles** with specific permissions, ensuring secure and efficient library management across desktop and mobile devices.

---

## ✨ Key Features

### 🔐 **Authentication & Authorization**
- Secure login with role-based access control
- User registration with profile customization
- Three user roles: **Administrator**, **Librarian**, **Member**
- Session management with automatic logout

### 👥 **Member Management** (Admin & Librarian)
- Complete member database with search
- Add, edit, view, and delete members
- Member profile details with statistics
- Status tracking (Active/Inactive)
- Responsive member cards and tables

### 📖 **Book Catalogue Management**
- Comprehensive book database
- Advanced search and filtering (by title, author, ISBN, category, status)
- Add, edit, view, and delete books
- Real-time availability tracking
- Cover image support
- Detailed book information

### 📤 **Borrowing Operations**
- Process book checkouts with validation
- Automatic due date calculation (14 days)
- Member borrowing limit enforcement (5 books max)
- Real-time availability checking
- Transaction confirmation modals

### 📥 **Return Operations**
- Process book returns
- Automatic overdue calculation
- Fine calculation (£1.00 per day overdue)
- Book condition assessment
- Fine management

### 🖥️ **Computer Booking System**
- Real-time availability of library computers
- Member self-service booking for study/research
- Administrative management of computer hardware
- Status tracking (Available, Booked, In-Use, Maintenance)
- Secure booking validation and scheduling

### 📊 **Borrowing History & Reports**
- Complete transaction history
- Advanced filtering (status, date range, member, book)
- Search functionality
- Export to CSV/PDF
- Borrowing statistics and analytics

### 📈 **Analytics Dashboard**
- Real-time statistics (members, books, transactions)
- Recent activity monitoring
- Overdue books alerts
- Popular books tracking
- Quick action shortcuts

### 👤 **Profile Management**
- User profile with editable information
- Profile photo upload
- Password change functionality
- Role display and member information

### ⚙️ **System Settings** (Admin Only)
- Library information configuration
- Borrowing rules management (days, fines, limits)
- Notification preferences (email, SMS, reminders)
- System settings (maintenance mode, registrations)

---

## 🎨 Design & UX

### **Modern Interface**
- Clean, professional design with dark green theme (#1B5E4B)
- Smooth animations and transitions
- Intuitive navigation with sidebar and mobile hamburger menu
- Toast notifications for user feedback
- Confirmation modals for critical actions

### **Fully Responsive**
- ✅ Desktop (1920px+) - Full sidebar, table layouts
- ✅ Tablet (768px - 1919px) - Adaptive layouts
- ✅ Mobile (320px - 767px) - Hamburger menu, card layouts, touch-optimized

### **Accessibility**
- High color contrast (WCAG compliant)
- Keyboard navigation support
- Clear form labels and error messages
- Screen reader friendly

---

## 🛠️ Technology Stack

### **Frontend Framework**
- **React 18.x** - Modern component-based UI
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling

### **Routing & Navigation**
- **React Router v7** - Data mode with protected routes
- Role-based route access control
- Dynamic navigation based on user permissions

### **UI Components & Icons**
- **Lucide React** - Beautiful, consistent icons
- **Sonner** - Elegant toast notifications
- **Motion** - Smooth animations

### **State Management**
- React Context API for authentication
- React Hooks (useState, useEffect, useContext)
- Local state for component data

---

## 📁 Project Structure

```
marlboro-library/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable components
│   │   │   ├── Layout.tsx       # Main layout with sidebar
│   │   │   ├── ConfirmModal.tsx # Confirmation dialogs
│   │   │   ├── MemberModal.tsx  # Add/Edit member modal
│   │   │   ├── BookModal.tsx    # Add/Edit book modal
│   │   │   └── ViewMemberModal.tsx # Member details view
│   │   ├── context/             # Context providers
│   │   │   └── AuthContext.tsx  # Authentication context
│   │   ├── pages/               # Page components
│   │   │   ├── Login.tsx        # Login page
│   │   │   ├── Register.tsx     # Registration page
│   │   │   ├── Dashboard.tsx    # Main dashboard
│   │   │   ├── Members.tsx      # Member management
│   │   │   ├── Books.tsx        # Book catalogue
│   │   │   ├── Borrow.tsx       # Borrowing operations
│   │   │   ├── Return.tsx       # Return operations
│   │   │   ├── BorrowHistory.tsx # Transaction history
│   │   │   ├── Reports.tsx      # Reports & analytics
│   │   │   ├── Profile.tsx      # User profile
│   │   │   └── Settings.tsx     # System settings
│   │   ├── App.tsx              # Main app component
│   │   └── routes.ts            # Route configuration
│   └── styles/
│       ├── globals.css          # Global styles
│       ├── theme.css            # Theme tokens
│       └── fonts.css            # Font imports
├── FUNCTIONAL_REQUIREMENTS.md   # Detailed requirements
├── PROJECT_DESCRIPTION.md       # This file
└── package.json
```

---

## 👥 User Roles & Permissions

### 🔴 **Administrator** (Full Access)
**Access:** All features and settings

✅ **Permissions:**
- View, add, edit, delete members
- View, add, edit, delete books
- Process borrowing and returns
- View complete history and reports
- **Access system settings**
- Configure borrowing rules and notifications
- Manage all system preferences

📊 **Dashboard:** Complete statistics, recent activity, overdue alerts, quick actions

---

### 🟡 **Librarian** (Operational Access)
**Access:** Daily operations (no settings)

✅ **Permissions:**
- View, add, edit, delete members
- View, add, edit, delete books
- Process borrowing and returns
- View complete history and reports
- Update own profile

❌ **Restrictions:**
- Cannot access system settings

📊 **Dashboard:** Same as Administrator (operational focus)

---

### 🟢 **Member** (Limited Access)
**Access:** Personal information only

✅ **Permissions:**
- View personal dashboard
- Browse book catalogue (read-only)
- View book availability
- View personal borrowing history
- Update own profile

❌ **Restrictions:**
- Cannot manage members or books
- Cannot process transactions
- Cannot generate reports
- Cannot access settings

📊 **Dashboard:** Personal statistics, currently borrowed books, personal history

---

## 🚀 Quick Start

### **Demo Credentials**

#### Administrator
```
Username: admin
Password: password
Role: Administrator
```

#### Librarian
```
Username: librarian
Password: password
Role: Librarian
```

#### Member
```
Username: member
Password: password
Role: Member
```

### **First Login Steps**
1. Navigate to login page
2. Enter username and password
3. Select appropriate role from dropdown
4. Click "Sign In"
5. Explore the dashboard

---

## 📖 Feature Walkthrough

### **1. Member Management**
**Location:** Members page (Admin & Librarian only)

**Actions:**
- 🔍 **Search:** Type name or email in search box
- ➕ **Add Member:** Click "Add Member" button → Fill form → Save
- ✏️ **Edit Member:** Click edit icon (green) → Modify data → Save
- 👁️ **View Details:** Click view icon (blue) → See complete information
- 🗑️ **Delete Member:** Click delete icon (red) → Confirm deletion

**Features:**
- Desktop: Table with sortable columns
- Mobile: Card layout with touch-friendly buttons
- Real-time search filtering
- Status badges (Active/Inactive)

---

### **2. Book Catalogue**
**Location:** Books page (All users, edit for Admin & Librarian)

**Actions:**
- 🔍 **Search:** Filter by title, author, or ISBN
- 📂 **Filter:** Select category or status (Available/Borrowed)
- ➕ **Add Book:** Click "Add Book" → Fill details → Save
- ✏️ **Edit Book:** Click edit icon → Update information → Save
- 👁️ **View Details:** Click view icon → See full book information
- 🗑️ **Delete Book:** Click delete icon → Confirm (if not borrowed)

**Features:**
- Grid layout with book covers
- Category filtering
- Availability status
- Real-time stock updates

---

### **3. Borrowing Process**
**Location:** Borrow page (Admin & Librarian only)

**Process:**
1. Select member from dropdown (searchable)
2. Select book from available books (searchable)
3. Borrow date auto-filled (current date)
4. Due date auto-calculated (+14 days)
5. Add optional notes
6. Review confirmation modal
7. Confirm transaction

**Validations:**
- ✅ Only available books shown
- ✅ Member limit checked (max 5 books)
- ✅ Member status verified (active only)
- ✅ Outstanding fines checked

---

### **4. Return Process**
**Location:** Return page (Admin & Librarian only)

**Process:**
1. Select member with active loans
2. Select borrowed book from member's loans
3. Return date auto-filled (current date)
4. Select book condition (Good/Fair/Damaged)
5. System calculates overdue days and fines
6. Review fine amount in confirmation
7. Confirm return

**Fine Calculation:**
- Formula: Overdue Days × £1.00 per day
- Example: 5 days late = £5.00 fine
- Displayed clearly in confirmation modal

---

### **5. History & Reports**
**Location:** History & Reports pages

**History Features:**
- View all transactions (borrowed/returned/overdue)
- Search by member or book
- Filter by status and date range
- Export to CSV/PDF
- Pagination for large datasets

**Reports Available:**
- 📊 Borrowing Statistics
- 👥 Member Activity
- 📚 Book Inventory
- ⏰ Overdue Books
- 💰 Fine Collection

**Export Options:** PDF, CSV, Excel, Print

---

### **6. System Settings**
**Location:** Settings page (Admin only)

**Configuration Sections:**

**Library Information:**
- Library name
- Contact email and phone
- Address

**Borrowing Rules:**
- Borrow period (default: 14 days)
- Fine per day (default: £1.00)
- Max books per member (default: 5)

**Notifications:**
- Email notifications (toggle)
- SMS notifications (toggle)
- Overdue reminders (toggle)
- Return reminders (toggle)

**System Settings:**
- Maintenance mode (toggle)
- Allow registration (toggle)

---

## 🎯 User Journey Examples

### **Example 1: Librarian Daily Workflow**

**Morning:**
1. Login as librarian
2. Check dashboard for overdue books
3. Review recent borrowing activity

**Member Walk-in:**
1. Navigate to Borrow page
2. Search and select member
3. Search and select book
4. Process transaction
5. Print or email receipt (future)

**Book Return:**
1. Navigate to Return page
2. Select member with loans
3. Select returned book
4. Assess condition
5. Collect fine if overdue
6. Complete return

**End of Day:**
1. Generate daily reports
2. Review borrowing statistics
3. Logout

---

### **Example 2: Member Self-Service**

**Login:**
1. Access login page
2. Enter member credentials
3. View personalized dashboard

**Browse Books:**
1. Navigate to Books page
2. Search for desired book
3. Check availability
4. Note book details

**Check Account:**
1. View currently borrowed books
2. Check due dates
3. Review borrowing history
4. Check outstanding fines

**Update Profile:**
1. Navigate to Profile
2. Update contact information
3. Change profile photo
4. Save changes

---

### **Example 3: Admin Monthly Tasks**

**Generate Reports:**
1. Navigate to Reports page
2. Select report type (e.g., Monthly Activity)
3. Set date range (last month)
4. Generate and export report

**Review Statistics:**
1. Check member growth
2. Analyze popular books
3. Review fine collection
4. Identify trends

**Update Settings:**
1. Navigate to Settings
2. Adjust borrowing rules if needed
3. Update library information
4. Configure notification preferences

**Member Management:**
1. Review inactive members
2. Send activation reminders
3. Remove inactive accounts
4. Add new members

---

## 📱 Responsive Behavior

### **Desktop (1920px+)**
- Full sidebar navigation
- Table layouts for data
- Multi-column forms
- Grid layouts for cards
- Expanded modals

### **Tablet (768px - 1919px)**
- Persistent sidebar (can collapse)
- Adaptive table layouts
- 2-column forms
- Grid layouts for cards
- Medium modals

### **Mobile (320px - 767px)**
- Hamburger menu navigation
- Card layouts replacing tables
- Single-column forms
- Stacked layouts
- Full-screen modals
- Touch-optimized buttons (44px min)

---

## 🔔 Notifications & Feedback

### **Toast Notifications** (Sonner)
**Success:**
- ✅ "Member added successfully!"
- ✅ "Book updated successfully!"
- ✅ "Transaction completed!"

**Error:**
- ❌ "Invalid credentials"
- ❌ "Member has reached borrowing limit"
- ❌ "Book is not available"

**Warning:**
- ⚠️ "This book is overdue"
- ⚠️ "Fine will be applied"

### **Confirmation Modals**
**Delete Actions:**
- "Are you sure you want to remove this member?"
- "This action cannot be undone"

**Transaction Confirmations:**
- Display full transaction details
- Show calculated fines
- Confirm before processing

---

## 🎨 Design System

### **Color Palette**
```css
Primary Green: #1B5E4B
Primary Hover: #15523f
Success: #10B981
Warning: #F59E0B
Danger: #EF4444
Info: #3B82F6
```

### **Typography**
- **Headings:** Font weight 700 (Bold)
- **Body:** Font weight 400 (Regular)
- **Small:** Font size 0.875rem

### **Spacing Scale**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### **Border Radius**
- Buttons: 8px
- Cards: 12px
- Modals: 16px
- Inputs: 8px

---

## 🔒 Security Features

### **Authentication**
- Password hashing (production)
- Session management
- Auto-logout on inactivity (future)
- Role-based access control

### **Authorization**
- Route protection
- Component-level permissions
- API endpoint validation
- Action confirmations for critical operations

### **Data Protection**
- Input validation and sanitization
- XSS prevention
- CSRF protection (production)
- Secure password storage

---

## 🚧 Known Limitations

**Current Version (1.0.0):**
- ⚠️ No email/SMS sending (UI only)
- ⚠️ Export functions generate placeholder files
- ⚠️ No barcode/QR scanning
- ⚠️ No multi-language support

---

## 🔮 Future Roadmap

### **Phase 2 - Enhanced Features**
- 📧 Email notification service
- 📱 SMS notification service
- 🖨️ Barcode/QR code scanning
- 📊 Advanced analytics dashboard
- 📅 Calendar integration for due dates

### **Phase 3 - Advanced Features**
- 📱 Mobile app (React Native)
- 🤖 AI book recommendations
- 🌐 Multi-language support
- 💳 Online fine payment gateway
- 📚 E-book management
- 🔐 Two-factor authentication
- 📈 Predictive analytics

### **Phase 4 - Enterprise Features**
- 🏢 Multi-branch support
- 👥 Staff management
- 📅 Event management
- 💬 Member communication portal
- 📊 Business intelligence
- ☁️ Cloud backup integration
- 🔗 Third-party integrations (Goodreads, Google Books)

---

## 📚 Documentation

**Available Documents:**
- ✅ `FUNCTIONAL_REQUIREMENTS.md` - Complete functional requirements specification
- ✅ `PROJECT_DESCRIPTION.md` - This file (overview and user guide)
- 📝 API Documentation (future)
- 📝 Developer Guide (future)
- 📝 User Manual (future)

---

## 🤝 Support & Contribution

### **Bug Reports**
If you encounter any issues:
1. Note the steps to reproduce
2. Screenshot if applicable
3. Browser and device information
4. Error messages

### **Feature Requests**
Suggestions are welcome:
- Describe the feature
- Explain the use case
- Provide mockups if possible

---

## 📄 License

This project is developed for educational and demonstration purposes.

---

## 👨‍💻 Development Team

**Lead Developer:** Development Team  
**UI/UX Design:** Design Team  
**Quality Assurance:** QA Team  
**Project Manager:** Project Management Team

---

## 📞 Contact

**Marlboro Library**  
Email: contact@marlborolibrary.com  
Phone: +44 20 7946 0958  
Address: 123 Library Street, London, SW1A 1AA

---

## 🎉 Acknowledgments

Built with:
- ⚛️ React
- 🔷 TypeScript
- 🎨 Tailwind CSS
- 🚀 React Router
- ✨ Lucide Icons
- 🔔 Sonner
- 🎬 Motion

---

**Version:** 1.0.0  
**Last Updated:** March 2026  
**Status:** ✅ Production Ready

---

**© 2026 Marlboro Library. All rights reserved.**
