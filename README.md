# EDO Educator 🌍

> **Edtech app for young planet heroes** — helping school children learn about the environment, track eco habits, and earn rewards.

## Business Model
- **Schools** subscribe for teacher dashboard + class management features
- **Students** earn EcoXP, redeem rewards, compete on classroom leaderboards
- **Partner brands** sponsor rewards (eco-friendly store discounts, tree planting)

## Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Firebase Authentication + Firestore
- Recharts (data visualisation)
- Google Maps API (commute calculator)
- Gemini AI (EcoCoach chatbot)

## Key Features
| Feature | Description |
|---|---|
| 🌿 Habit Tracker | Students log daily eco-habits and see their CO₂ impact |
| 🤖 EcoCoach AI | Child-safe Gemini AI tutor for eco habit ideas |
| 🗺️ Green Commute | Compare CO₂ of different school travel modes |
| 🏆 EcoXP Rewards | Gamified points, badges, real tree planting |
| 🍎 Teacher Dashboard | Class leaderboard, CO₂ progress, class code sharing |
| 📅 Events Board | School eco events, workshops, community challenges |

## Roles
- **Student** — logs activities, adopts habits, earns EcoXP, joins class via code
- **Teacher** — views class dashboard, shares class code, tracks student progress

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Add your API keys to .env file
# See Environment Variables section below

# Run development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Note:** The `.env` file is excluded from Git for security. Use `.env.example` as a template.

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable **Authentication** → **Email/Password** sign-in method
4. Create a **Firestore Database** with the following rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
5. Copy your Firebase config to `.env` file

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_GOOGLE_MAPS_API_KEY`
   - `VITE_GEMINI_API_KEY`
4. Deploy

### Manual Build

```bash
npm run build
# Deploy dist/ to any static hosting service
```

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```
