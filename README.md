# VedaAI – AI Assessment Creator

## Architecture
```
Frontend (Next.js 14 + Zustand) → POST /api/assignments → Express API
→ MongoDB (store) + BullMQ job → Redis queue
→ Worker → Gemini AI → structured JSON → MongoDB
→ Socket.io → Frontend renders paper
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Upstash Redis account
- Google Gemini API key

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGODB_URI, REDIS_URL, GEMINI_API_KEY in .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Fill in .env.local
npm run dev
```

## Environment Variables

### backend/.env
```
MONGODB_URI=mongodb+srv://...
REDIS_URL=rediss://default:...@...upstash.io:6380
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### frontend/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=http://localhost:5000
```