# RESUMATE AI – AI Resume Analyzer 📄✨

> **Empowering career journeys through AI-driven resume parsing, ATS scoring, job fit analysis, and intelligent optimization.**
> A modern collaborative college project engineered for high-performance resume intelligence.

---

## 🚀 Technology Stack

- **Frontend Core:** React 19 + Vite (Fast HMR & Optimized Production Bundles)
- **Language:** JavaScript (ESNext / JSX)
- **Styling:** Pure CSS3 Design System (Custom variables, responsive grid, light theme with `#6366F1` Indigo & `#8B5CF6` Violet accents — *No Tailwind, No Bootstrap*)
- **Authentication:** Firebase Authentication (v13 SDK)
- **Artificial Intelligence:** Google Gemini API via official `@google/genai` SDK
- **Routing:** React Router DOM (v7)
- **Icons:** Lucide React
- **Document Extractors:** PDF.js (`pdfjs-dist`) & Mammoth (DOCX)
- **Data Visualizations:** Recharts

---

## 📂 Project Architecture & Folder Structure

The project has been organized into modular feature domains so that **seven team members** can develop independently on separate Git branches without stepping on each other's code.

```
AI-RESUME-ANALYSER/
├── public/                     # Static assets (favicons, icons)
├── src/
│   ├── assets/                 # Brand images, SVGs
│   ├── components/             # Reusable shared UI components
│   │   ├── Button.jsx          # Multi-variant button (primary, outline, ghost, etc.)
│   │   ├── EmptyState.jsx      # Empty state placeholder with call-to-actions
│   │   ├── Layout.jsx          # App shell (Navbar + Sidebar + Main viewport)
│   │   ├── Loader.jsx          # Animated spinner & full-screen loader
│   │   ├── Navbar.jsx          # Top navigation header & user profile
│   │   ├── PageHeader.jsx      # Standardized title, badge & actions header
│   │   ├── ProtectedRoute.jsx  # Route guard checking Firebase auth state
│   │   └── Sidebar.jsx         # Responsive sidebar & active resume indicator
│   ├── context/                # Shared application state
│   │   ├── AuthContext.jsx     # Firebase auth context (register, login, logout, reset)
│   │   └── AppContext.jsx      # Global resume & analysis pipeline state
│   ├── modules/                # 7 Independent Team Modules
│   │   ├── auth/               # Module 1: Login, Register, Forgot Password
│   │   ├── resume-upload/      # Module 2: Document upload & PDF/DOCX parsing
│   │   ├── ai-analysis/        # Module 3: Gemini ATS parsing & section breakdown
│   │   ├── job-matching/       # Module 4: Job description alignment & keyword match
│   │   ├── skill-gap/          # Module 5: Missing competencies & learning roadmap
│   │   ├── improvement-suggestions/ # Module 6: Bullet point rewrites & ATS tips
│   │   └── dashboard-reports/  # Module 7: Master KPI dashboard, reports & landing
│   ├── services/               # API & Backend services
│   │   ├── firebase.js         # Firebase app & auth initialization
│   │   └── geminiService.js    # Google Gemini (@google/genai) prompt handlers
│   ├── styles/                 # Pure CSS3 Modular Stylesheet
│   │   ├── variables.css       # Indigo & Violet color tokens, radii, shadows
│   │   ├── global.css          # Resets, cards, form controls, typography
│   │   ├── layout.css          # Shell layout, navbar, sidebar, responsive drawer
│   │   └── components.css      # Reusable button, loader, and empty state styling
│   ├── App.jsx                 # Route definitions & Context providers
│   ├── index.css               # Stylesheet master index
│   └── main.jsx                # React root entry
├── .env.example                # Template for environment keys
├── .gitignore                  # Git ignore rules for node_modules, build & env
├── package.json                # Project dependencies and scripts
├── vite.config.js              # Vite bundler configuration
└── README.md                   # Project documentation
```

---

## ⚡ Quickstart & Setup Guide

### 1. Prerequisites
Ensure you have **Node.js (v18 or higher)** installed on your machine.

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/<your-username>/AI-RESUME-ANALYSER.git
cd AI-RESUME-ANALYSER
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` in your editor and provide your Firebase and Google Gemini keys:
```env
# Firebase Authentication
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abc...

# Google Gemini API (Get from https://aistudio.google.com/)
VITE_GEMINI_API_KEY=AIzaSy...
```

> **Developer Mode Note:** If `.env` is unconfigured or partially filled, the application runs in safe **Dev Mode** so team members can inspect UI layouts and routes without authentication errors.

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Production Build Verification
To verify that everything compiles without errors:
```bash
npm run build
```

---

## 👥 7-Member Team Module Breakdown & Data Contract

All modules read and write to the shared **`AppContext`** via `useApp()`:

| Module | Route(s) | Folder | Primary Responsibility | `AppContext` State Input | `AppContext` State Output |
|---|---|---|---|---|---|
| **Module 1: Authentication** | `/login`<br>`/register`<br>`/forgot-password` | `src/modules/auth/` | User sign-up, sign-in, session state, and password resets via Firebase Auth. | None | `currentUser` in `AuthContext` |
| **Module 2: Resume Upload** | `/upload-resume` | `src/modules/resume-upload/` | File drag-and-drop, format validation, PDF.js & Mammoth parsing to clean text. | None | `resumeText`, `resumeFile`<br>*(automatically triggers `resetAnalysis()`)* |
| **Module 3: AI Resume Analysis** | `/ai-analysis` | `src/modules/ai-analysis/` | ATS scoring, section classification, candidate summary, strengths & weaknesses. | `resumeText` | `analysisResults` |
| **Module 4: Job Matching** | `/job-matching` | `src/modules/job-matching/` | Job description keyword extraction, semantic alignment, compatibility score. | `resumeText`, `targetJobRole`, `jobDescription` | `matchingResults` |
| **Module 5: Skill Gap Analysis** | `/skill-gap` | `src/modules/skill-gap/` | Identify missing critical & optional skills, create structured learning roadmap. | `resumeText`, `targetJobRole` | `skillAnalysisResults` |
| **Module 6: Improvements** | `/improvements` | `src/modules/improvement-suggestions/` | Generate action-verb rewrites, quantifiable bullet upgrades, ATS compliance tips. | `resumeText`, `analysisResults` | `improvementSuggestions` |
| **Module 7: Dashboard & Reports** | `/dashboard`<br>`/reports`<br>`/` | `src/modules/dashboard-reports/` | KPI aggregation, summary cards, Recharts visualizations, printable export dossier. | All analysis results from `AppContext` | None (Consumer) |

### Shared State Function: `resetAnalysis()`
Whenever a user uploads a new resume or resets their session, `resetAnalysis()` clears all existing downstream data:
```javascript
const { resetAnalysis, setNewResume } = useApp();

// Clears all stale analysis whenever a new document is chosen:
resetAnalysis();
```

---

## 🌿 Git Branching & Team Collaboration Workflow

To ensure smooth, conflict-free collaboration among all 7 team members:

### 1. Branch Naming Convention
Every team member works on a designated feature branch:
- Team Member 1: `feature/mod-1-auth`
- Team Member 2: `feature/mod-2-resume-upload`
- Team Member 3: `feature/mod-3-ai-analysis`
- Team Member 4: `feature/mod-4-job-matching`
- Team Member 5: `feature/mod-5-skill-gap`
- Team Member 6: `feature/mod-6-improvement-suggestions`
- Team Member 7: `feature/mod-7-dashboard-reports`

### 2. Daily Workflow
```bash
# 1. Checkout main branch and pull latest changes
git checkout main
git pull origin main

# 2. Switch to your feature branch (create if new)
git checkout -b feature/mod-2-resume-upload

# 3. Work inside your isolated module folder (e.g. src/modules/resume-upload/)

# 4. Stage and commit your changes with clear messages
git add src/modules/resume-upload/
git commit -m "feat(upload): implement PDF.js text extraction stream"

# 5. Push branch to GitHub
git push -u origin feature/mod-2-resume-upload
```

### 3. Pull Request Guidelines
1. Always open a Pull Request (PR) from your feature branch into `main`.
2. Run `npm run build` locally before opening the PR to ensure zero compile or bundling errors.
3. Have at least one other team member review the PR.
4. Merge using **Squash and Merge** or standard merge to keep the Git history clean.

---

## 🛡️ Project Development Rules
- **No TypeScript:** All source files must be standard JavaScript (`.js` and `.jsx`).
- **No Tailwind / Bootstrap:** Use the provided CSS3 tokens in `src/styles/variables.css` and `src/styles/global.css`.
- **No Custom Backend:** Backend functions run directly on client SDKs (Firebase & `@google/genai`).
- **No Fake Data:** Downstream modules should show `EmptyState` until the user uploads a resume and triggers Gemini analysis.
