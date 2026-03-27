# FitCoach AI 🏋️

A web app for logging workouts, tracking fitness stats, and getting AI-powered personalized motivation and coaching — built as a 24-hour take-home assignment.

## 🔗 Live Demo
👉 [https://my-project-fitcoach.vercel.app/](https://my-project-fitcoach.vercel.app/)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS |
| Backend | Express.js |
| Database | Supabase (PostgreSQL) |
| AI / LLM | Google Gemini API |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

---

## ✨ Features

### Core
- **Workout Logging** — Log activity type, duration, and date via a clean form. Supports Running, Yoga, Cycling, Gym, Swimming, and more.
- **Activity History** — View all logged workouts in a table, sorted most recent first.
- **Stats Dashboard** — Real-time stats including current streak, workouts this week, most frequent activity, and total workout minutes. Updates instantly without a page refresh.
- **AI Motivational Nudge** — "Get AI Motivation" button sends your actual workout data (streak, gaps, frequency) to Gemini and returns a fully personalized message.
- **AI Q&A Chatbot** — Chat interface powered by Gemini with scrollable conversation history and multi-turn context.

### Bonus
- 📱 **Mobile Responsive Design** — Works seamlessly on all screen sizes.
- 🎭 **Coach Tone Selector** — Choose your coaching style: Tough Coach, Friendly Buddy, or Data Nerd. The AI adapts its tone accordingly.
- ⏳ **Loading States & Error Handling** — All async actions have proper loading indicators and user-facing error messages.

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- A [Supabase](https://supabase.com) account and project
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

---

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in your values
npm run dev
```

#### Backend `.env`
```env
PORT=5000
DATABASE_URL=your_database_projecturl
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
CORS_ORIGIN=http://localhost:5173
```

---

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # then fill in your values
npm start
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000
```

---

### Database

The app uses Supabase (PostgreSQL). Run the SQL schema in your Supabase SQL editor to set up the required tables (`workouts`, `chat_history`).

---

## 🏗 Design Decisions & Tradeoffs

- **Separated frontend and backend** into distinct folders for clean separation of concerns. The backend is deployed independently on Render so it can scale or be swapped without touching the frontend.
- **Real-time stat updates** are achieved by re-fetching stats from the backend immediately after every successful workout submission — no polling or websockets needed for this scope.
- **AI prompt engineering** — The motivational nudge prompt injects the user's streak count, last workout date, most frequent activity, total workouts, and any recent gaps directly into the prompt. This ensures Gemini always returns a data-specific message rather than a generic one.
- **Coach tone selector** — The selected tone is passed as a modifier in the system prompt, giving users a sense of personalization without added complexity.
- **Supabase** was chosen for its generous free tier, built-in PostgreSQL, and easy REST API — ideal for a time-boxed assignment.

---

## 📁 Project Structure

```
FitCoach/
├── frontend/         # React app (Vercel)
│   └── src/
├── backend/          # Express.js API (Render)
│   └── routes/
├── .gitignore
└── README.md
```

---

## 👤 Author

**Chanakya Sinde**  
GitHub: [@Chanakyasinde](https://github.com/Chanakyasinde)
