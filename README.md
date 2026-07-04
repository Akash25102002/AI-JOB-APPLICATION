# JobPilot AI

**An AI-powered job search and application automation platform.**

JobPilot AI helps job seekers find relevant roles faster, tailor their resumes and cover letters with AI, track every application in one place, and prepare for interviews — all from a single, polished dashboard.

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [AI Agent Workflow](#ai-agent-workflow)
- [Scripts](#scripts)
- [Testing](#testing)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Deployment](#deployment)
- [Security](#security)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

JobPilot AI combines resume intelligence, job matching, and generative AI into one agentic workflow:

```
Upload Resume → Extract Data → Search Jobs → AI Ranks Matches
→ AI Tailors Resume → AI Drafts Cover Letter → User Confirms
→ Application Submitted → Tracked on Kanban Board → Follow-ups Scheduled
```

The platform is built for individual job seekers but architected to scale to teams, career coaches, and university career centers.

---

## Core Features

### Resume Intelligence
- Upload PDF / DOCX / TXT resumes
- Automatic extraction of skills, experience, education, projects, certifications, and languages
- AI Resume Analyzer: resume score, ATS score, missing keywords, formatting issues, weak vs. strong bullet points
- AI Resume Builder with multiple templates (Modern, Minimal, Professional, Corporate, Developer, Designer)
- Export to PDF or DOCX

### AI-Powered Job Search & Matching
- Aggregated search across multiple job sources (Adzuna, JSearch, Greenhouse, Lever, Ashby, RemoteOK, and more)
- Filters for role, skills, location, experience, salary, remote/hybrid/onsite, and job type
- AI Matching Engine: match percentage, strengths, weaknesses, and skill gaps versus a given job description
- Personalized AI job recommendations based on resume, history, and preferences

### Application Tools
- AI Cover Letter Generator (tone, company, role, hiring manager aware)
- AI-generated recruiter messages, cold emails, follow-ups, and LinkedIn outreach
- Predicted interview questions per job description
- Kanban-style Application Tracker (Applied → Interview → Offer → Rejected/Accepted)

### Autonomous AI Agent
- Multi-step agent that extracts resume data, ranks jobs, tailors application materials, and prepares submissions
- Always requires explicit user confirmation before submitting an application
- Schedules follow-up reminders and tracks status changes automatically

### Career Growth
- AI Career Coach: roadmap, learning suggestions, salary insights, promotion tips
- AI Interview Preparation: behavioral, technical, coding, system design, and mock interviews with scoring
- AI LinkedIn Optimizer for headline, summary, and keyword visibility

### Dashboard & Analytics
- Applications, interviews, offer rate, and response rate over time
- Top skills vs. missing skills, companies applied to, monthly trends
- Calendar with interview schedules, deadlines, and Google Calendar sync

### Platform
- Authentication with social login (Google, GitHub), email verification, protected routes
- Stripe billing with Free, Starter, Pro, and Enterprise tiers
- Admin dashboard for users, revenue, subscriptions, support, and feature flags
- Notifications for application updates, interview reminders, and new matches

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling / UI | Tailwind CSS, shadcn/ui, Framer Motion, Lucide Icons |
| Forms & Validation | React Hook Form, Zod |
| State & Data | Zustand, React Query |
| Backend | Next.js Server Actions, REST APIs, optional tRPC |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | Clerk (or Auth.js) |
| Payments | Stripe |
| Email | Resend |
| File Storage | UploadThing or AWS S3 |
| Caching / Queues | Upstash Redis |
| AI Providers | OpenAI GPT models, Gemini, Claude |
| Agent Orchestration | LangGraph or OpenAI Agents SDK |
| Monitoring | Sentry, Vercel Analytics |
| Deployment | Vercel |
| Testing | Jest, Vitest, Playwright |
| CI/CD | GitHub Actions |

---

## Architecture

- **Feature-based modular architecture** — each domain (resume, jobs, applications, billing, agent) is self-contained with its own components, server actions, hooks, and types.
- **Server Components by default**, Client Components only where interactivity is required.
- **Agentic layer** sits behind a single orchestration service so any LLM provider can be swapped without touching UI or business logic.
- **Job source adapters** implement a common interface so new job boards can be added without changing the search or matching logic.

---

## Folder Structure

```
jobpilot-ai/
├── src/
│   ├── app/                        # Next.js App Router routes
│   │   ├── (marketing)/             # Landing page, pricing, FAQ
│   │   ├── (auth)/                  # Sign up, login, forgot password
│   │   ├── (dashboard)/             # Authenticated app
│   │   │   ├── dashboard/
│   │   │   ├── resume/
│   │   │   ├── jobs/
│   │   │   ├── applications/
│   │   │   ├── analytics/
│   │   │   ├── calendar/
│   │   │   ├── settings/
│   │   │   └── billing/
│   │   ├── admin/                   # Admin dashboard
│   │   └── api/                     # Route handlers / webhooks
│   ├── features/                    # Feature-based modules
│   │   ├── resume/
│   │   ├── job-search/
│   │   ├── matching-engine/
│   │   ├── cover-letter/
│   │   ├── applications/
│   │   ├── interview-prep/
│   │   ├── career-coach/
│   │   ├── linkedin-optimizer/
│   │   └── agent/
│   ├── components/                  # Shared UI components
│   ├── lib/                         # Shared utilities, API clients
│   ├── server/                      # Server actions, services
│   ├── ai/                          # AI providers, prompts, agent tools
│   ├── db/                          # Prisma client, seed scripts
│   ├── hooks/
│   ├── store/                       # Zustand stores
│   └── types/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/
├── .github/workflows/
├── docker/
├── .env.example
├── package.json
└── README.md
```

---

## Database Schema

Core Prisma models (simplified — see `prisma/schema.prisma` for full definitions):

- **User**, **Profile** — account and personal details
- **Resume**, **ResumeVersion**, **ResumeAnalysis** — uploaded resumes and AI analysis
- **Skill**, **Experience**, **Education**, **Project**, **Certification** — structured resume data
- **Job**, **Company**, **SavedJob**, **JobMatch** — job listings and match scoring
- **Application**, **FollowUp**, **Interview** — application lifecycle
- **CoverLetter** — generated cover letters per application
- **AIRequest** — logs of AI usage for cost tracking and rate limiting
- **Subscription**, **Invoice** — Stripe billing records
- **Notification** — in-app and email notifications

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm/yarn
- PostgreSQL database (or a Neon account)
- Accounts/API keys for: Clerk (or Auth.js), Stripe, Resend, UploadThing/AWS S3, OpenAI, Upstash Redis

### Installation

```bash
git clone https://github.com/your-org/jobpilot-ai.git
cd jobpilot-ai
pnpm install
cp .env.example .env
```

Fill in `.env` (see [Environment Variables](#environment-variables)), then:

```bash
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
```

Visit `http://localhost:3000`.

---

## Environment Variables

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRICE_STARTER=
NEXT_PUBLIC_STRIPE_PRICE_PRO=

# Email
RESEND_API_KEY=

# Storage
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=

# Job Search APIs
ADZUNA_APP_ID=
ADZUNA_APP_KEY=
JSEARCH_API_KEY=
RAPIDAPI_KEY=

# Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Monitoring
SENTRY_DSN=
```

---

## AI Agent Workflow

The autonomous agent is orchestrated with LangGraph and exposes these tools:

| Tool | Purpose |
|---|---|
| Resume Tool | Parses and updates structured resume data |
| Job Search Tool | Queries job source adapters |
| Resume Optimizer | Tailors resume content to a specific JD |
| Cover Letter Tool | Drafts a personalized cover letter |
| ATS Analyzer | Scores resume/JD compatibility |
| Application Tracker | Creates/updates application records |
| Email Generator | Drafts outreach and follow-up emails |
| LinkedIn Generator | Drafts LinkedIn messages and profile copy |
| Calendar Tool | Schedules interviews and reminders |
| Notification Tool | Sends in-app/email notifications |

The agent maintains short-term memory per session, plans multi-step actions, reflects on tool outputs, and retries failed steps. **The agent always pauses for explicit user confirmation before submitting any job application.**

---

## Scripts

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # ESLint
pnpm typecheck        # TypeScript check
pnpm test             # Unit tests (Vitest)
pnpm test:integration # Integration tests (Jest)
pnpm test:e2e         # End-to-end tests (Playwright)
pnpm prisma studio    # Open Prisma Studio
```

---

## Testing

- **Unit tests** — Vitest, colocated with components/utilities
- **Integration tests** — Jest, covering server actions and API routes
- **End-to-end tests** — Playwright, covering critical user flows (sign up, resume upload, job search, application submission)

```bash
pnpm test
pnpm test:integration
pnpm test:e2e
```

---

## Docker

```bash
docker compose up --build
```

Includes services for the Next.js app, PostgreSQL, and Redis for local development parity with production.

---

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every PR:

1. Install dependencies
2. Lint + type-check
3. Unit + integration tests
4. Build
5. Playwright E2E tests
6. Deploy preview to Vercel on merge to `main`

---

## Deployment

1. Push to GitHub and connect the repo to Vercel
2. Provision a PostgreSQL database on Neon
3. Provision Redis on Upstash
4. Add all environment variables in Vercel project settings
5. Run `pnpm prisma migrate deploy` as part of the build step
6. Configure Stripe and Clerk webhooks to point to your production domain
7. Enable Sentry and Vercel Analytics

### Production Checklist
- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Stripe webhooks verified
- [ ] Auth redirect URLs configured for production domain
- [ ] Rate limiting enabled on public API routes
- [ ] Sentry error tracking confirmed
- [ ] Backups configured for the database

---

## Security

- Authentication via Clerk/Auth.js with protected routes and role-based access control
- CSRF protection and secure, HTTP-only cookies
- Input validation with Zod on every server action and API route
- Parameterized queries via Prisma (no raw SQL injection surface)
- Rate limiting via Upstash Redis on public and AI-consuming endpoints
- Secrets managed via environment variables, never committed to source control

---

## Roadmap

- Chrome extension for browser autofill and one-click apply
- Voice assistant and in-app AI chatbot
- GitHub portfolio analyzer and personal website generator
- Referral and recruiter finder
- Salary prediction and company insights
- Interview recording analysis

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes with clear messages
4. Ensure `pnpm lint`, `pnpm typecheck`, and `pnpm test` pass
5. Open a pull request

---

## License

MIT License. See `LICENSE` for details.
