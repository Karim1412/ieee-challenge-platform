# ⚡ IEEE EPI Challenge Arena

A gamified challenge platform to re-engage inactive IEEE EPI Student Branch members through competitive mini-games, real-time leaderboards, and achievement systems.

![Tech Stack](https://img.shields.io/badge/React-18-61dafb?logo=react) ![Firebase](https://img.shields.io/badge/Firebase-10-orange?logo=firebase) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/ieee-challenge-platform.git
cd ieee-challenge-platform
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"** → Name it (e.g., `ieee-epi-challenge`)
3. Disable Google Analytics (optional)
4. Click **"Web"** icon to add a web app
5. Register the app and **copy the config**
6. Open `src/firebase.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 3. Enable Firebase Services

**Authentication:**
- Firebase Console → Authentication → Get Started
- Enable **Email/Password** provider

**Firestore Database:**
- Firebase Console → Firestore Database → Create database
- Choose **Production mode** (or Test mode for development)
- Select a region close to your users (e.g., `europe-west3` for Tunisia)
- Go to **Rules** tab and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 📦 Deploy to GitHub Pages

### Method 1: Automatic (GitHub Actions) — Recommended

1. **Create a new GitHub repo** named `ieee-challenge-platform`

2. **Update `vite.config.js`** — change the base path to match your repo name:
```javascript
base: '/ieee-challenge-platform/',  // ← must match your repo name exactly
```

3. **Update `src/App.jsx`** — same base path in BrowserRouter:
```javascript
<BrowserRouter basename="/ieee-challenge-platform">
```

4. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ieee-challenge-platform.git
git push -u origin main
```

5. **Enable GitHub Pages:**
   - Go to repo → **Settings** → **Pages**
   - Source: **GitHub Actions**
   - The workflow in `.github/workflows/deploy.yml` will auto-deploy on every push to `main`

6. Your site will be live at: `https://YOUR_USERNAME.github.io/ieee-challenge-platform/`

### Method 2: Manual Deploy

```bash
npm run build
npx gh-pages -d dist
```

---

## 🎮 Features

| Feature | Description |
|---------|-------------|
| 🔐 Authentication | Email/password signup & login with Firebase Auth |
| 👤 Profile System | Custom name, points tracker, achievement display |
| 🏆 Live Leaderboard | Real-time ranking with Firestore onSnapshot |
| 🐍 Snake Game | Classic snake with neon visuals & score submission |
| 🧠 Quiz Game | 10 IEEE/tech questions with timer |
| ⚡ Reaction Game | 5-round reflex test with ms timing |
| 🔮 Memory Game | 4×4 card matching with error tracking |
| 🏅 Achievements | 8 unlockable badges stored in Firestore |
| 🎊 Confetti | Triggered for Top 3 finishers |
| 📱 Responsive | Mobile-first design with D-pad controls |

---

## 🗄️ Database Structure

```
Firestore:
└── users/
    └── {userId}/
        ├── name: string
        ├── email: string
        ├── totalPoints: number
        ├── achievements: string[]
        ├── completedChallenges: string[]
        ├── challengeScores: { snake: number, quiz: number, ... }
        ├── challengeRanks: { snake: number, quiz: number, ... }
        └── createdAt: timestamp
```

---

## ⚙️ Configuration

### Challenge Unlock Mode

In `src/pages/DashboardPage.jsx`, set `DEMO_MODE`:

```javascript
const DEMO_MODE = true;  // All challenges unlocked (for events)
const DEMO_MODE = false; // Unlocks one per day based on dayIndex
```

### Points System

In `src/utils/challengeData.js`:

```javascript
export const POINTS = {
  FIRST: 100,
  SECOND: 80,
  THIRD: 60,
  OTHER: 20,
};
```

### Adding Quiz Questions

Edit the `QUIZ_QUESTIONS` array in `src/utils/challengeData.js`. Each question needs:
- `question`: string
- `options`: array of 4 strings
- `correct`: index of the correct option (0-3)

---

## 🛠️ Tech Stack

- **React 18** + **Vite 5** — Fast development & build
- **Tailwind CSS 3** — Utility-first styling with custom neon theme
- **Framer Motion** — Smooth animations and transitions
- **Firebase 10** — Auth + Firestore real-time database
- **React Confetti** — Celebration animations
- **React Hot Toast** — Notification system
- **React Router 6** — Client-side routing

---

## 🎨 Design System

| Token | Color | Use |
|-------|-------|-----|
| `ion` | `#00d4ff` | Primary accent, borders |
| `plasma` | `#7b2fff` | Secondary, quiz theme |
| `pulse` | `#ff2d7e` | Danger, reaction theme |
| `nova` | `#00ff9d` | Success, snake theme |
| `star` | `#ffd700` | Gold, points, 1st place |

---

## 📄 License

MIT — Built for IEEE EPI Student Branch

---

*"IEEE is not just a club. It's a launchpad for your future. Stay active. Stay ahead."*
