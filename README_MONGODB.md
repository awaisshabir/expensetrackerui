# Expense Tracker - MongoDB Edition

A full-stack expense tracking application with user authentication, MongoDB database, and Excel export functionality.

## 🚀 Features

- ✅ **User Registration & Authentication** - Secure JWT-based authentication
- 💰 **Expense Tracking** - Track daily expenses with categories
- 💼 **Salary Management** - Record income sources
- 🎯 **Savings Goals** - Set and track savings targets
- 📊 **Dashboard** - Visual insights with charts
- 📥 **Excel Export** - Download all your data as Excel spreadsheet
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 💱 **SAR Currency** - Uses Saudi Arabian Riyal (SAR) with Western numerals

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)

## 🛠️ Installation

### 1. Clone the Repository

```bash
cd "d:\Personal Projects\AI\Expense-tracker"
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 4. Configure Environment Variables

#### Frontend (.env)
Already configured at project root:
```
VITE_API_URL=http://localhost:5000/api
```

#### Backend (server/.env)
Already configured in `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` before deploying to production!

### 5. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# MongoDB should start automatically as a service
# Or run manually:
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe"
```

**Mac/Linux:**
```bash
sudo service mongod start
# or
mongod
```

## 🚀 Running the Application

### Development Mode

You need to run both the backend and frontend:

#### Terminal 1 - Start Backend Server
```bash
cd server
npm run dev
```
Backend will run on: http://localhost:5000

#### Terminal 2 - Start Frontend
```bash
npm run dev
```
Frontend will run on: http://localhost:3000

## 📖 Usage

### 1. Register an Account
- Open http://localhost:3000
- Click "Create one" to go to registration page
- Fill in your name, email, and password
- Click "Create Account"

### 2. Login
- Enter your email and password
- Click "Sign In"

### 3. Start Tracking
- **Dashboard**: View your financial overview
- **Expenses**: Add, edit, delete expenses
- **Salary**: Record income sources
- **Reports**: View detailed reports and export to Excel

### 4. Download Excel Report
- Go to the Reports page
- Click "Export to Excel" button
- Your data will download as an Excel file with multiple sheets:
  - Expenses
  - Salary
  - Savings Goals
  - Summary

## 🏗️ Project Structure

```
Expense-tracker/
├── src/                      # Frontend React app
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── store/              # Zustand state management
│   └── utils/              # Utility functions
├── server/                  # Backend Express app
│   └── src/
│       ├── config/         # Configuration files
│       ├── controllers/    # Route controllers
│       ├── middleware/     # Express middleware
│       ├── models/         # MongoDB models
│       ├── routes/         # API routes
│       ├── utils/          # Utility functions
│       └── index.js        # Server entry point
└── README_MONGODB.md       # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/:id` - Get single expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats` - Get expense statistics

### Salary
- `GET /api/salary` - Get all salary records
- `POST /api/salary` - Create salary record
- `GET /api/salary/:id` - Get single salary
- `PUT /api/salary/:id` - Update salary
- `DELETE /api/salary/:id` - Delete salary
- `GET /api/salary/stats` - Get salary statistics

### Savings
- `GET /api/savings` - Get all savings goals
- `POST /api/savings` - Create savings goal
- `GET /api/savings/:id` - Get single goal
- `PUT /api/savings/:id` - Update goal
- `DELETE /api/savings/:id` - Delete goal
- `POST /api/savings/:id/add` - Add amount to goal

### Export
- `GET /api/export/excel` - Download Excel file

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in localStorage
- Tokens expire after 7 days (configurable)
- All API requests (except auth) require authentication header:
  ```
  Authorization: Bearer <your-jwt-token>
  ```

## 🗄️ Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  currency: String (default: 'SAR'),
  createdAt: Date
}
```

### Expense
```javascript
{
  user: ObjectId (ref: User),
  date: Date,
  category: String,
  description: String,
  amount: Number,
  paymentMethod: String,
  isRecurring: Boolean,
  createdAt: Date
}
```

### Salary
```javascript
{
  user: ObjectId (ref: User),
  date: Date,
  amount: Number,
  source: String,
  description: String,
  createdAt: Date
}
```

### Savings
```javascript
{
  user: ObjectId (ref: User),
  goalName: String,
  targetAmount: Number,
  currentAmount: Number,
  deadline: Date,
  description: String,
  status: String (Active/Completed/Paused),
  createdAt: Date
}
```

## 🛡️ Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Protected API routes
- ✅ User ownership validation
- ✅ Input validation
- ✅ CORS enabled

## 🧪 Testing the App

1. **Register**: Create an account
2. **Add Expenses**: Add some test expenses
3. **Add Salary**: Record income
4. **Create Savings Goal**: Set a savings target
5. **View Dashboard**: Check the charts and stats
6. **Export**: Download your data as Excel

## 🚨 Troubleshooting

### MongoDB Connection Failed
- Make sure MongoDB is running
- Check connection string in `server/.env`
- Default: `mongodb://localhost:27017/expense-tracker`

### Port Already in Use
- **Frontend (3000)**: Change in `vite.config.ts`
- **Backend (5000)**: Change PORT in `server/.env`

### Authentication Errors
- Clear localStorage: `localStorage.clear()`
- Re-register or login

### Excel Export Not Working
- Check backend console for errors
- Make sure ExcelJS is installed: `cd server && npm install exceljs`

## 📝 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Multi-currency support
- [ ] Budget limits and alerts
- [ ] Recurring expenses automation
- [ ] Mobile app (React Native)
- [ ] PDF export
- [ ] Cloud deployment guides

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License

## 👨‍💻 Support

For issues or questions:
- Check the Troubleshooting section
- Review API endpoints
- Check browser console for frontend errors
- Check terminal for backend errors

---

**Enjoy tracking your expenses! 💰📊**
