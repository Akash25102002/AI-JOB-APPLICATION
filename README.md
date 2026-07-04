# JobPilot AI 🚀
### Autonomous Full Stack AI Job Application Agent SaaS

JobPilot AI is an enterprise-grade SaaS application designed to automate, optimize, and organize the end-to-end career search lifecycle. Using a stateful agentic system inspired by LangGraph, it parses resumes, crawls target job boards, compiles multi-dimensional ATS compatibility scores, adjusts bullet-points for specific postings, drafts cold outreach networking messages, and schedules follow-up reminders.

---

## 🏗️ Architectural Blueprint

```mermaid
graph TD
    Client[Next.js 15 Client - React 19] -->|Server Actions / REST| NextAPI[Next.js Server / API Routes]
    NextAPI -->|Auth Session| Clerk[Clerk Authentication]
    NextAPI -->|Subscriptions| Stripe[Stripe Billing]
    NextAPI -->|Email Dispatch| Resend[Resend Email Gateway]
    NextAPI -->|Storage Uploads| S3[UploadThing / S3 Bucket]
    
    subgraph AI Agent Core
        NextAPI -->|Agent Pipeline| AgentEngine[LangGraph Orchestrator]
        AgentEngine -->|State Graph| LLM[Gemini 2.5 / OpenAI GPT-4o]
        AgentEngine -->|File Processing| ResumeTool[Resume Parser Pipeline]
        AgentEngine -->|External Search| JobTool[Job Search Aggregator]
        AgentEngine -->|Optimization| MatchEngine[AI Matching Engine]
      end

    NextAPI -->|ORM queries| Prisma[Prisma ORM]
    Prisma -->|Primary DB| PG[(Neon Serverless PostgreSQL)]
    NextAPI -->|Caching & Locks| Redis[(Upstash Redis Cache)]
```

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & ORM**: [Neon Serverless PostgreSQL](https://neon.tech/) + [Prisma ORM](https://www.prisma.io/)
- **Caching & Rate Limiting**: [Upstash Redis](https://upstash.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Billing & Subscriptions**: [Stripe](https://stripe.com/)
- **Email Delivery**: [Resend](https://resend.com/)
- **Cloud Storage**: [UploadThing](https://uploadthing.com/)
- **AI Agent Core**: Stateful DAG Graph + [Gemini 2.5 Flash/Pro](https://ai.google.dev/) + [OpenAI GPT-4o](https://openai.com/)
- **Testing**: [Vitest](https://vitest.dev/) (Unit/Integration) + [Playwright](https://playwright.dev/) (E2E)

---

## 🚀 Local Quickstart Guide

Follow these steps to run the application locally on your machine.

### 1. Clone the Project & Install Dependencies
Ensure you have Node.js 20+ installed, then run:
```bash
npm install
```

### 2. Launch Local Database & Caching Services
Spin up pre-configured PostgreSQL and Redis instances using Docker:
```bash
docker-compose up -d
```
This loads:
- **PostgreSQL**: Available on port `5432` (credentials: `postgres:localpassword123`)
- **Redis**: Available on port `6379`

### 3. Set Up Environment Variables
Copy the template file and fill in your keys:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL` is set to point to your local PostgreSQL instance:
```env
DATABASE_URL="postgresql://postgres:localpassword123@localhost:5432/jobpilot_dev?sslmode=disable"
```

### 4. Run Relational Migrations
Initialize the tables inside your PostgreSQL database:
```bash
npx prisma db push
```

### 5. Launch the Development Server
Start the Next.js server locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧩 Core SaaS Algorithms

### A. Resume Parser Pipeline (`lib/ai/parser.ts`)
Decodes files using structured JSON schema configurations to guarantee parsing predictability. When no API key is specified, it utilizes standard regular expression patterns to extract skills, contact details, and experience arrays automatically.

### B. Cosine ATS Matching Engine (`lib/ai/matcher.ts`)
Ranks candidates against a target job description:
1. **Title Alignment (15% Weight)**: Validates historical role titles.
2. **Skill Overlap (55% Weight)**: Maps skills against required tech stacks.
3. **Tenure Consistency (30% Weight)**: Cross-references career dates and progression charts.

---

## ⚙️ Testing Suite

Verify app safety and compliance using integrated test suites:

### Run Unit Tests
```bash
# Run Vitest tests
npx vitest run
```

### Run End-to-End browser checks
```bash
# Install Playwright browsers (first-time setup)
npx playwright install

# Run E2E specs
npx playwright test
```

---

## 🛡️ Production Security Checklist

- [ ] **CSRF Defense**: Ensure Next.js Server Actions validate client headers.
- [ ] **Rate Limiting**: Setup token bucket rate limits in Redis for sensitive endpoints (`/api/jobs`).
- [ ] **Database Connection limits**: Cache the database client using `lib/db.ts` to avoid Neon pool exhaustion.
- [ ] **Secret Safeguards**: Never commit `.env` files. Load production keys strictly using Vercel Dashboard env variables.
