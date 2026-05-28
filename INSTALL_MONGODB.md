# ⚠️ IMPORTANT: MongoDB Installation Required

## 🚨 Action Required

Your Expense Tracker has been converted to use **MongoDB** instead of Google Sheets. 

**MongoDB is NOT installed on your system yet.**

## 📥 Install MongoDB (Choose Your Option)

### Option 1: MongoDB Community Server (Recommended)

1. **Download**: https://www.mongodb.com/try/download/community
2. **Select**:
   - Version: 7.0 or later
   - Platform: Windows
   - Package: MSI
3. **Install**:
   - Run the installer
   - Choose "Complete" installation
   - **Check "Install MongoDB as a Service"** ✅
   - Keep defaults for Service configuration
4. **Verify**:
   ```bash
   mongod --version
   ```

### Option 2: MongoDB Atlas (Cloud - Free Tier)

If you prefer cloud hosting:

1. **Sign up**: https://www.mongodb.com/cloud/atlas/register
2. **Create free cluster** (M0)
3. **Get connection string**
4. **Update** `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
   ```

## ⚡ After Installing MongoDB

### Step 1: Verify MongoDB is Running

**Windows:**
```bash
# Check service status
services.msc
# Look for "MongoDB Server (MongoDB)" - should be "Running"
```

### Step 2: Start Backend Server

```bash
cd server
npm run dev
```

You should see:
```
MongoDB Connected: 127.0.0.1
Server running on port 5000
```

### Step 3: Start Frontend

Open a new terminal:
```bash
npm run dev
```

### Step 4: Open App

Go to: http://localhost:3000

## 📋 Complete Setup Checklist

- [ ] **MongoDB installed** (Community Server or Atlas)
- [ ] **MongoDB running** (service started or Atlas cluster active)
- [ ] **Backend dependencies installed** (`cd server && npm install`)
- [ ] **Frontend dependencies installed** (`npm install`)
- [ ] **Backend running** (Terminal 1: `cd server && npm run dev`)
- [ ] **Frontend running** (Terminal 2: `npm run dev`)
- [ ] **First account created** (http://localhost:3000 → Register)
- [ ] **App working** (can add expenses, salary, savings)

## 🆘 Need Help?

### MongoDB Installation Issues

**Windows:**
- Download: https://www.mongodb.com/try/download/community
- Guide: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Alternative: Use Docker

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 📖 Documentation

- **Quick Start**: `QUICKSTART.md`
- **Full Docs**: `README_MONGODB.md`
- **MongoDB Docs**: https://www.mongodb.com/docs/

---

**Once MongoDB is installed and running, follow `QUICKSTART.md` to start the application! 🚀**
