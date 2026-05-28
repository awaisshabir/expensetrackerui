# 🚀 Quick Start Guide - Expense Tracker (MongoDB)

## What Changed?

Your expense tracker has been converted from Google Sheets to MongoDB:
- ❌ **Removed**: Google OAuth, Google Sheets API
- ✅ **Added**: User registration, MongoDB database, Excel export

## 📋 Prerequisites

1. **MongoDB** must be installed and running
   - Download: https://www.mongodb.com/try/download/community
   - Windows: Runs as a service automatically
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo service mongod start`

2. **Node.js** (already have it if you ran the old project)

## ⚡ Quick Start (3 Steps)

### Step 1: Open TWO Terminals

You need both backend and frontend running simultaneously.

### Step 2: Terminal 1 - Start Backend

```bash
cd server
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

### Step 3: Terminal 2 - Start Frontend

```bash
npm run dev
```

You should see Vite running on http://localhost:3000

## 🎯 First Time Use

1. **Open**: http://localhost:3000
2. **Register**: Click "Create one" → Fill form → Create Account
3. **Start Using**: You're in! Add expenses, salary, savings goals
4. **Export**: Go to Reports → Click "Export to Excel"

## 🗂️ Your Data

All data is stored in MongoDB locally:
- Database: `expense-tracker`
- Location: Your MongoDB data directory

## 📥 Excel Export

Unlike before (PDF), you can now download everything as Excel:
- Multiple sheets (Expenses, Salary, Savings, Summary)
- Filter by date range
- Professional formatting

## 🛠️ Configuration

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` in production!

## 🚨 Common Issues

### "MongoDB Connection Failed"
```bash
# Check if MongoDB is running
# Windows:
services.msc  # Look for "MongoDB Server"

# Mac:
brew services list

# Linux:
sudo service mongod status
```

### "Port 5000 Already in Use"
Edit `server/.env`:
```
PORT=5001  # Or any other port
```

Then update frontend `.env`:
```
VITE_API_URL=http://localhost:5001/api
```

### "Cannot Login After Registration"
- Check backend terminal for errors
- Clear browser localStorage: F12 → Application → Local Storage → Clear All
- Try registering with a different email

## 📁 Project Structure

```
Expense-tracker/
├── src/                 # Frontend (React + TypeScript)
├── server/             # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── models/    # Database schemas
│   │   ├── routes/    # API endpoints
│   │   └── controllers/# Business logic
│   └── .env           # Backend config
├── .env                # Frontend config
└── README_MONGODB.md  # Full documentation
```

## 🔄 Development Workflow

```bash
# Terminal 1 (Backend)
cd server
npm run dev

# Terminal 2 (Frontend)
npm run dev

# Both should stay running while developing
```

## 📊 Features Summary

| Feature | Old (Google) | New (MongoDB) |
|---------|-------------|---------------|
| Authentication | Google OAuth | Email/Password |
| Data Storage | Google Sheets | MongoDB |
| User Accounts | Single user | Multi-user |
| Export | PDF | Excel (.xlsx) |
| Offline | No | No* |
| Setup | Complex | Simple |

*Requires MongoDB running locally or hosted

## 🎓 Learning Resources

- **MongoDB**: https://www.mongodb.com/docs/
- **Express.js**: https://expressjs.com/
- **JWT Auth**: https://jwt.io/introduction

## 📞 Need Help?

1. Check `README_MONGODB.md` for full documentation
2. Look at browser console (F12) for frontend errors
3. Check terminal output for backend errors
4. Review API endpoints in README_MONGODB.md

## ✅ Checklist

- [ ] MongoDB installed and running
- [ ] `npm install` completed (frontend)
- [ ] `cd server && npm install` completed (backend)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Created first account successfully
- [ ] Added test data (expenses, salary, savings)
- [ ] Exported to Excel successfully

---

**Ready to track expenses! 🎉**

For detailed docs, see: `README_MONGODB.md`
