# EcoKids 🌍

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
npm install
npm run dev
```

### API Keys (replace in source before deploying)
- `src/firebase.ts` — Firebase config
- `src/pages/RouteCalculator.tsx:13` — Google Maps API key
- `src/components/EcoHabitChatbot.tsx` — Gemini API key

## Deployment
```bash
npm run build
# Deploy dist/ to Vercel, Netlify, or Firebase Hosting
```
