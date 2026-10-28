# EventEase AI — Plan Smarter. Celebrate Better.

> **Hack2Skill Challenge 5: Celebration & Event Planner**  
> An intelligent, full-stack event planning web application helping users organize weddings, milestone birthdays, and community gatherings using generative AI blueprints, personalized budgets, date-aware timelines, and vendor checklists.

---

## 🌟 Highlights & Key Capabilities

- **Generative AI Event Blueprint**: Generates an end-to-end event narrative, theme aesthetics, color swatches with HEX codes, venue architectural requirements, catering and dietary accommodations, entertainment roadmaps, budget-saving alternatives, and risk mitigation plans.
- **Dynamic Budget Ledger & Visualizations**:
  - Recharts Donut & Bar charts displaying category allocations.
  - Real-time calculations of Total, Estimated, Actual, and Remaining Budget.
  - Automatic Over-Budget alerts with exact variance amounts.
  - Practical cost-saving suggestions dynamically calculated based on categories exceeding default targets.
  - Add, edit, delete, and filter expense items with instant synchronization.
- **Date-Aware Preparation Timeline**:
  - Tasks structured into 5 milestone phases (Concept & Core Bookings, Vendors & Styling, Invitations, Final Prep, Event Day Execution).
  - Dynamic due-date offsets calculated from your actual event date.
  - Real-time overdue detection, priority tags (High, Medium, Low), and completion tracking.
- **Vendor Directory Tracker**:
  - Records vendor contacts, services, quoted vs contracted prices, booking statuses, and payment milestones.
  - Clearly identifies illustrative sample records vs user-verified vendors.
- **AI Creative Inspiration Studio**:
  - Generates bespoke invitation texts (formal, poetic, witty), lighting concepts, birthday party games, wedding elements, and zero-waste celebration hacks.
  - One-click copy to clipboard.
- **Deterministic AI Demo Mode & Live Gemini AI**:
  - Transparently indicates whether results are generated via Live Google Gemini AI or the high-fidelity offline deterministic planning engine.
  - Judges can evaluate 100% of the workflow without configuring an API key.
- **Preloaded Competition Archetypes**:
  - **Aanya & Rohan's Royal Garden Wedding** (Jaipur / Udaipur style hybrid haveli wedding, 180 guests, $35,000 budget).
  - **Liam's 30th Retro Neon Birthday Bash** (Austin industrial loft, 45 guests, arcade tournament, $4,500 budget).
  - **Green Meadows Earth Day & Harvest Fair** (Portland outdoor meadow pavilion, 350 guests, $12,500 budget).

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & Design System** | Tailwind CSS (lavender surfaces, deep purple accents `#4c1d95`, `#7c3aed`), responsive layouts |
| **Data Visualizations** | Recharts (Donut Pie Charts, Bar Charts, Tooltips) |
| **Iconography** | Lucide React |
| **Backend API** | Express.js, Node.js (strictly server-side AI key management) |
| **Generative AI** | Google Gemini 1.5/2.0 API with structured JSON schema outputs & offline deterministic fallback engine |
| **Persistence** | Browser `localStorage` with automated schema initialization |
| **Testing** | Vitest unit and integration test suite |

---

## 🚀 Quickstart & Setup Instructions

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **pnpm**

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Inside `.env`:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
CLIENT_URL=http://localhost:5173
```
> **Note**: If `GEMINI_API_KEY` is not provided, EventEase AI automatically runs in **Deterministic AI Demo Mode**, providing full functionality with realistic, reproducible blueprints.

### 4. Running Locally

#### Option A: Run Full-Stack (Client + Backend API)
```bash
npm run dev:all
```
This runs Vite on `http://localhost:5173` and the Express AI backend on `http://localhost:3001`.

#### Option B: Run Frontend Only
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. (The client will seamlessly use the built-in deterministic AI generator).

---

## 🧪 Automated Testing

Run the automated test suite with Vitest:
```bash
npm test
```

The test suite validates:
- Pure budget calculations, variance tracking, and over-budget triggers (`tests/budget.test.ts`).
- Timeline date-offset calculations, overdue task detection, and phase groupings (`tests/timeline.test.ts`).
- Currency and date formatting consistency (`tests/validation.test.ts`).
- Deterministic AI engine schema compliance and budget alignment (`tests/ai.test.ts`).

---

## 🔒 Security & Privacy

1. **Zero Secret Leakage**: AI API keys (`GEMINI_API_KEY`) are kept exclusively on the server side. No API credentials are ever exposed in client bundles or network requests.
2. **Deterministic Offline Fallback**: The app never crashes or hangs if the external AI API is rate-limited, times out, or offline.
3. **No Fabricated Live Data**: Sample vendor contacts are explicitly flagged with `Sample Profile` badges to maintain data integrity.
4. **Input Sanitization & Safe Output**: Text fields and AI-generated outputs are sanitized against XSS injection.

---

## 📦 Deployment Instructions

### Production Build
```bash
npm run build
```
This produces optimized production assets in the `dist/` directory.

### Host with Express Server
Set `NODE_ENV=production` and start the server:
```bash
npm run server
```
Or deploy easily to platforms like **Vercel**, **Render**, **Railway**, or **Netlify**.

---

## ⚖️ Evaluation & Demo Mode Details

- When evaluating the application, judges can immediately click any of the 3 preloaded event cards on the home screen to inspect real-time budget charts, timelines, and vendor lists.
- Click **"Launch Event Creator Wizard"** to create a custom celebration with personalized parameters.
- Use the **"Saved Events"** drawer at any time to switch events, add custom items, or reset to the evaluation defaults.

