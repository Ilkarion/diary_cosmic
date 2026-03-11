# Diary Cosmic 

**Diary Cosmic** is a personal digital diary with mood tracking, an interactive map of entries, and emotion analytics.  
This project demonstrates modern **frontend + backend architecture**, authentication, database management, and performance optimization.

🔗 **Live Demo:** [https://diary-cosmic-liard.vercel.app](https://diary-cosmic-liard.vercel.app)  
⚠️ The first request may take **1–5 minutes** because the server runs on a free plan.
---


[Short Presentation](https://www.loom.com/share/00f30e357a024f2c97dfda617ea553e6)


## Key Features

### 🛡️ Authentication
- User registration with email confirmation  
- Login / logout  
- Account deletion  
- Secure handling of user data

### 📝 Diary
- Create diary entries with text  
- **Color tags** to highlight important ideas  
- Select **mood** for each entry

### 🗺️ Interactive Map
- All entries are displayed on an **interactive map**  
- Filter entries by **color tags**  
- Easy navigation through diary history

### 📊 Mood Tracker
- Statistics of moods over time  
- Shows dominant emotional trends  
- Helps analyze personal habits

### ⚙️ User Settings
- Change email, nickname, or password  
- Logout  
- Delete account

### 💻 UI / UX
- **Responsive design** for desktop and mobile  
- **Dark / Light themes**  
- **Internationalization** (English / Russian)

---

## Tech Stack

### Frontend
- Next.js (React)  
- TypeScript  
- Zustand (state management)  
- Fetch API  
- SCSS  
- i18n (internationalization)  
- Vercel (deployment)

### Backend
- Node.js  
- Express.js  
- SQL  
- Supabase (database)  
- Render (deployment)

---

## Architecture

- Frontend communicates with the backend via **Fetch API**  
- Backend processes requests and interacts with **Supabase SQL database**  
- Performance optimizations include:
  - Efficient data storage  
  - Fast UI updates using **Zustand**

---

## Running Locally

```bash
npm install
npm run dev
