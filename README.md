# ScriptCraft — AI Script Generation & Marketing Dashboard

A complete, production-ready full-stack **Script Generation & Marketing Dashboard** built with **React.js, Node.js, Express.js, MongoDB Atlas/local, Tailwind CSS, and secure server-side AI integration**.

---

## 🌟 Key Features

1. **Dashboard Overview**
   - Live metrics: Total Scripts, Personal Branding, Meta Ads, Story Marketing, Drafts, Ready to Record.
   - Recent scripts list with status badges, quick actions, copy, edit, duplicate, and delete.
   - Real-time MongoDB connectivity and AI provider status pills.

2. **Personal Branding Module**
   - **Target Categories:** CA, Doctor, Business Owner, Education, Informative, Personal Story.
   - **Primary Objective:** Maximum reach, follower growth, audience engagement, authority, and trust — *without aggressive direct sales*.
   - **Deliverables:** 3 Hook variations, Main Body, Engagement CTA, On-Screen Text with timestamps, B-roll visual suggestions, Ready-to-post Caption, and curated Hashtags.

3. **Meta Ads Studio**
   - **10 Core Categories:** Founder-Based Brand, Story, Before / After, Q&A, Direct Sales, Testimonials, How-To, Educational, Informative, Storytelling.
   - **Strict Verification:** Never fabricates testimonials, prices, statistics, or claims. Matches CTA to campaign objective (Sales, Leads, Traffic, etc.).
   - **Deliverables:** 3 Hooks, Primary Script, Scene-by-Scene Visual Storyboard, Voiceover transcript, Primary Ad Copy, Headline, Description, CTA button recommendation.

4. **Story Marketing Module**
   - Multi-slide interactive storytelling (3 to 7 slides).
   - Proven story arc: Attention opening, Problem/context, Relatable insight, Solution/takeaway, and Call to action.
   - Interactive sticker recommendations (Poll, Slider, Question Box, Countdown) and DM conversion funnels.
   - Single-click **Copy All Slides** and persistent saving.

5. **Script Definition & Method Builder**
   - Core Architecture: **Hook → Body → CTA → Selected Method**.
   - Modular Method Builder: Start with **Method 1** and add Method 2, Method 3, or custom frameworks.
   - Add, rename, reorder, delete, and save method steps.
   - 5 pre-seeded frameworks:
     - *Method 1:* Hook → Problem → Explanation → Solution → CTA
     - *Method 2:* PAS Framework (Problem → Agitate → Solution → CTA)
     - *Method 3:* BAB Framework (Before → After → Bridge → CTA)
     - *Method 4:* Story → Lesson → Offer
     - *Method 5:* Myth Buster

6. **Universal Script Studio**
   - Central generator combining all modules and saved methods.
   - **Independent Section Regeneration:** Regenerate Hook, Body, or CTA independently while preserving other sections and user edits!
   - 3-variation generator (Angle A: Direct, Angle B: Story/Curiosity, Angle C: Bold Contrarian).

7. **Persistent Script Storage & History**
   - Persists all scripts in MongoDB Atlas or local database.
   - Full search, sorting (Newest, Oldest, Recently Updated, Title A-Z), and multi-criteria filters.
   - In-app Teleprompter reading mode, markdown export, plain text export, and JSON export.

8. **Security & AI Design**
   - Server-side AI service: API keys are strictly kept in `server/.env`.
   - Dual-engine architecture: If API key is not configured, the built-in **Intelligent Demo Engine** generates rich, realistic outputs.
   - Helmet, CORS, and Express rate limiting for production security.

---

## 🏗️ Folder Architecture

```text
script-generation-dashboard/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── EmptyState.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── DashboardLayout.jsx
│   │   │   └── scripts/
│   │   │       ├── ScriptCard.jsx
│   │   │       ├── ScriptForm.jsx
│   │   │       ├── ScriptEditor.jsx
│   │   │       └── ScriptPreview.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PersonalBranding.jsx
│   │   │   ├── MetaAds.jsx
│   │   │   ├── StoryMarketing.jsx
│   │   │   ├── ScriptDefinition.jsx
│   │   │   ├── ScriptGenerator.jsx
│   │   │   ├── SavedScripts.jsx
│   │   │   ├── ScriptHistory.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── scriptService.js
│   │   │   └── methodService.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   └── useScripts.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   └── formatters.js
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── scriptController.js
│   │   │   ├── methodController.js
│   │   │   └── dashboardController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Script.js
│   │   │   └── ScriptMethod.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── scriptRoutes.js
│   │   │   ├── methodRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── scriptService.js
│   │   │   └── methodService.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   ├── validateMiddleware.js
│   │   │   └── rateLimitMiddleware.js
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   ├── scriptValidator.js
│   │   │   └── methodValidator.js
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   └── asyncHandler.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **MongoDB**: MongoDB Atlas connection URI or local MongoDB (`mongodb://127.0.0.1:27017/script_dashboard`)

### 1. Install Dependencies
Run the install command from the root directory:

```bash
npm run install:all
```

Or install individually:
```bash
# In server/
cd server && npm install

# In client/
cd ../client && npm install
```

### 2. Configure Environment Variables

**Server (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/script_dashboard
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_here
AI_API_KEY=
AI_MODEL=gemini-1.5-flash
AI_PROVIDER=gemini
```

**Client (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers
From the root folder, run:

```bash
npm run dev
```

This starts:
- React/Vite Frontend at **http://localhost:5173**
- Express Backend at **http://localhost:5000**

---

## 📡 API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Login with email and password
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Get authenticated user details

### Scripts
- `GET /api/scripts` — List saved scripts (filtering, search, pagination)
- `POST /api/scripts` — Save a script to database
- `GET /api/scripts/:id` — Retrieve single script
- `PATCH /api/scripts/:id` — Update script (without creating duplicates)
- `DELETE /api/scripts/:id` — Delete script
- `POST /api/scripts/:id/duplicate` — Duplicate script as Draft
- `POST /api/scripts/generate` — Generate complete script / 3 variations
- `POST /api/scripts/generate-variation` — Generate creative variation
- `POST /api/scripts/regenerate-section` — Regenerate Hook, Body, or CTA independently

### Writing Methods
- `GET /api/methods` — List methods (system defaults + custom)
- `POST /api/methods` — Create new custom method with ordered steps
- `GET /api/methods/:id` — Get method details
- `PATCH /api/methods/:id` — Update method steps, description, or ordering
- `DELETE /api/methods/:id` — Delete custom method

### Dashboard
- `GET /api/dashboard/stats` — Stats count overview
- `GET /api/dashboard/recent-scripts` — Recently updated scripts
- `GET /api/dashboard/status` — Live DB and AI system status

---

## 🚀 ADD-ON MODULE: Market Trends & Master Prompt Generator

The **Market Trends & Master Prompt Generator** extends the Script Generation Dashboard with real-time market intelligence, category-specific audience psychology analysis, and a 12-section master prompt generator that connects directly to script generation.

### 5 New Dashboard Sections
1. **Market Trends (`/market-trends`)**: Real-time KPI cards (Discovered Trends, Emerging, Growing, High-Relevance, Ready for Script, Master Prompts), multi-source discovery form, live source connection status strip, Trending Now, Content Opportunities, and interactive grid/table repository.
2. **Trend Analysis (`/trend-analysis`)**: Cross-category analytical engine evaluating discovered trends against all Personal Branding categories (CA, Doctor, Business Owner, Education, Informative, Personal Story), 10 Meta Ads categories, Story Marketing sequences, and Script Definition methods.
3. **Master Prompt Generator (`/master-prompt-generator`)**: Synthesizes verified trends or custom creator topics into complete 12-section copy-ready prompts tailored to the selected module, category, and writing method.
4. **Trend Research History (`/trend-research-history`)**: Chronological audit log of research scans, actual date ranges used, source metrics, and discovered trend sets.
5. **Saved Master Prompts (`/saved-master-prompts`)**: Central repository of saved master prompts with versioning, in-place editing, TXT/Markdown export, duplication, and direct 1-click script generation.

### Multi-Source Trend Integration Architecture
All providers are built as modular backend adapters in `server/src/integrations/`:

| Provider | Data Extracted | Live Capabilities & Policy |
| :--- | :--- | :--- |
| **Google Trends** (`googleTrendsProvider.js`) | Daily trending spikes, explore interest indices, regional spikes | Real RSS search feeds (`trends.google.com/trending/rss`) + verified Google Trends Explore links. |
| **Google News & Web Research** (`webResearchProvider.js`) | Real news articles, verified URLs, publication timestamps, publishers | Live Google News RSS search across regions (`news.google.com/rss/search`) extracting real editorial articles. |
| **Meta Ads Library** (`metaAdsLibraryProvider.js`) | Public ad creatives, messaging angles, offer patterns, ad delivery dates | Queries public Meta Ads Library archives. *Note: Strictly adheres to transparency policies; never claims private ROAS, budgets, or private conversion rates.* |
| **TikTok Creative Center** (`tiktokTrendsProvider.js`) | Trending hashtags, short-form video pacing benchmarks, creative inspiration | Public Creative Center hashtag analysis and direct verification links. Supports manual import. |
| **Instagram Explore** (`instagramTrendsProvider.js`) | Reels hook patterns, audio pacing, engagement structures | Verified public hashtag explore patterns (`instagram.com/explore/tags/`) and save-to-like engagement models. |

### 12-Section Master Prompt Structure
Every generated master prompt strictly includes the following 12 sections:
1. **Section 1 — Role and Expertise:** AI mandate customized to industry, module, and category.
2. **Section 2 — Research Context:** Research date, region, platform, trend name, lifecycle, verified source links, source metrics.
3. **Section 3 — Trend Analysis Instructions:** Evaluates why the trend matters, fresh angles, and distinguishes facts from assumptions.
4. **Section 4 — Audience Psychology:** Profile, problem, motivation, questions/objections, desired takeaway, tone.
5. **Section 5 — Content Strategy:** Platform format, angle, benefit, storytelling approach, method, and appropriate CTA.
6. **Section 6 — Hook Generation:** 3 distinct hooks (Curiosity Gap, Pain Point, Bold/Relatable) with style explanations.
7. **Section 7 — Body Generation:** Method-aligned breakdown, pacing, and retention visual cues.
8. **Section 8 — CTA Generation:** Aligned strictly to objective (Personal Branding: save/follow/comment; Meta Ads: conversion CTA; Story: interactive/DM).
9. **Section 9 — Method Integration:** Follows selected method and preserves custom steps.
10. **Section 10 — Final Deliverables:** Complete voiceover script, timestamps, on-screen text, B-roll cues, caption, and hashtags.
11. **Section 11 — Quality Controls:** Originality checks, no fabricated testimonials, duration pacing, and platform compliance.
12. **Section 12 — Output Format:** Clean, teleprompter-ready formatting.

### Trend-to-Script End-to-End Workflow
1. User conducts a trend research query or picks an existing trend.
2. User generates a category-specific Master Prompt with all 12 sections.
3. User reviews, edits, and saves the prompt.
4. User clicks **"Generate Script from This Prompt"**.
5. Server generates the complete script, saves it to MongoDB, and automatically attaches `masterPromptId` and `trendId` to the `Script` document for two-way traceability!

### Additional API Endpoints
- `GET /api/trends/kpis` — Overall dashboard trend metrics
- `GET /api/trends/sources/status` — Live status of all 5 connection adapters
- `POST /api/trends/research` — Execute multi-source trend discovery scan
- `GET /api/trends/research-history` — Research audit history
- `POST /api/trends/import` — Manually import verified market trend
- `GET /api/trends` — List trends with filtering, search, pagination, and sorting
- `GET /api/trends/:id` — Full trend overview and audience psychology
- `POST /api/trends/:id/analyze` — Re-analyze trend cross-module
- `POST /api/trends/:id/toggle-save` — Toggle trend bookmark
- `DELETE /api/trends/:id` — Delete trend
- `POST /api/master-prompts/generate` — Synthesize 12-section master prompt
- `GET /api/master-prompts` — List saved master prompts
- `GET /api/master-prompts/:id` — Get prompt details
- `PATCH /api/master-prompts/:id` — Edit prompt and increment version history
- `DELETE /api/master-prompts/:id` — Delete master prompt
- `POST /api/master-prompts/:id/duplicate` — Duplicate master prompt
- `POST /api/master-prompts/:id/generate-script` — Generate and link script from master prompt

