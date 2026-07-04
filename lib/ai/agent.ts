import { parseResume, ParsedResume } from "./parser";
import { matchJob, MatchResult } from "./matcher";

export interface AgentJob {
  id: string;
  title: string;
  companyName: string;
  description: string;
  location: string;
  salaryRange?: string;
  sourceUrl?: string;
}

export interface AgentExecutionLog {
  step: string;
  status: "success" | "pending" | "failed";
  message: string;
  timestamp: string;
  details?: any;
}

export interface AgentState {
  userId: string;
  resumeText: string;
  parsedResume?: ParsedResume;
  searchQuery: {
    role: string;
    location: string;
  };
  jobs: AgentJob[];
  rankedJobs: { job: AgentJob; match: MatchResult }[];
  selectedJobId?: string;
  optimizedResumeText?: string;
  coverLetterText?: string;
  outreachMessage?: string;
  status: "idle" | "parsing" | "searching" | "matching" | "optimizing" | "drafting" | "confirming" | "applied" | "failed";
  logs: AgentExecutionLog[];
  error?: string;
}

/**
 * AI Agent State Machine orchestrator
 */
export class JobApplicationAgent {
  private state: AgentState;
  private apiKey?: string;

  constructor(userId: string, resumeText: string, query: { role: string; location: string }, apiKey?: string) {
    this.apiKey = apiKey;
    this.state = {
      userId,
      resumeText,
      searchQuery: query,
      jobs: [],
      rankedJobs: [],
      status: "idle",
      logs: [],
    };
    this.addLog("Agent Initialized", "success", "Agent ready to execute job application agent workflow.");
  }

  private addLog(step: string, status: "success" | "pending" | "failed", message: string, details?: any) {
    this.state.logs.push({
      step,
      status,
      message,
      timestamp: new Date().toISOString(),
      details,
    });
  }

  public getState(): AgentState {
    return this.state;
  }

  /**
   * Run the full agentic loop step-by-step
   */
  public async runWorkflow(): Promise<AgentState> {
    try {
      // 1. Parsing Step
      this.state.status = "parsing";
      this.addLog("Resume Parsing", "pending", "Extracting semantic entities from candidate resume raw text...");
      const parsed = await parseResume(this.state.resumeText, this.apiKey);
      this.state.parsedResume = parsed;
      this.addLog("Resume Parsing", "success", `Successfully parsed candidate profile for ${parsed.fullName}.`, { parsed });

      // 2. Searching Step
      this.state.status = "searching";
      this.addLog("Job Search Discovery", "pending", `Crawling jobs matching role "${this.state.searchQuery.role}" in "${this.state.searchQuery.location}"...`);
      const jobs = await this.searchJobsTool(this.state.searchQuery.role, this.state.searchQuery.location);
      this.state.jobs = jobs;
      this.addLog("Job Search Discovery", "success", `Found ${jobs.length} relevant vacancies matching query.`, { jobs });

      // 3. Matching & Ranking Step
      this.state.status = "matching";
      this.addLog("ATS Job Matching Engine", "pending", "Executing semantic analysis on matching jobs...");
      const ranked: { job: AgentJob; match: MatchResult }[] = [];
      for (const job of jobs) {
        const match = await matchJob(parsed, job.title, job.description, this.apiKey);
        ranked.push({ job, match });
      }
      // Sort descending by match percentage
      ranked.sort((a, b) => b.match.matchPercentage - a.match.matchPercentage);
      this.state.rankedJobs = ranked;
      this.addLog("ATS Job Matching Engine", "success", "Finished ranking vacancies. Highest compatibility is " + (ranked[0]?.match?.matchPercentage || 0) + "%.", { ranked });

      // Auto-select highest matching job
      if (ranked.length > 0) {
        const best = ranked[0];
        this.state.selectedJobId = best.job.id;
        
        // 4. Optimization Step
        this.state.status = "optimizing";
        this.addLog("Resume Optimization", "pending", `Tailoring resume bullet points to fit ${best.job.companyName} - ${best.job.title}...`);
        const optimized = await this.optimizeResumeTool(parsed, best.job);
        this.state.optimizedResumeText = optimized;
        this.addLog("Resume Optimization", "success", "Custom summary and keyword injection completed successfully.", { optimized });

        // 5. Letter & Outreach Generation
        this.state.status = "drafting";
        this.addLog("Collateral Generation", "pending", "Drafting specialized cover letter and LinkedIn recruiter outreach message...");
        const coverLetter = await this.generateCoverLetterTool(parsed, best.job);
        const outreach = await this.generateOutreachTool(parsed, best.job);
        this.state.coverLetterText = coverLetter;
        this.state.outreachMessage = outreach;
        this.addLog("Collateral Generation", "success", "Drafted custom cover letter & cold email outreach scripts.", { coverLetter, outreach });

        // 6. Confirmation Waiting (Simulated final agent step)
        this.state.status = "confirming";
        this.addLog("Awaiting User Confirmation", "success", "All application materials staged. Ready for user click-to-apply submission.");
      } else {
        this.state.status = "failed";
        this.addLog("Workflow Complete", "failed", "No jobs found matching requirements.");
      }
    } catch (err: any) {
      this.state.status = "failed";
      this.addLog("Workflow Error", "failed", err?.message || "An unexpected error occurred during execution.");
      this.state.error = err?.message || "Internal Agent Error";
    }

    return this.state;
  }

  /**
   * Tool: Searches external APIs
   */
  private async searchJobsTool(role: string, location: string): Promise<AgentJob[]> {
    // Standard mock API responses that fit the visual dashboard nicely
    return [
      {
        id: "job-001",
        title: "Staff AI Engineer",
        companyName: "Google DeepMind",
        location: "London, UK (Hybrid)",
        salaryRange: "$180k - $240k",
        description: "Join the Advanced Agentic Coding team to build stateful LLM code orchestrators, multi-agent frameworks, and code translation engines. Experience with React, Node.js, Next.js, and PyTorch preferred.",
        sourceUrl: "https://deepmind.google/careers"
      },
      {
        id: "job-002",
        title: "Senior Full Stack Developer",
        companyName: "Vercel",
        location: "Remote (Global)",
        salaryRange: "$150k - $190k",
        description: "Looking for an expert with TypeScript, Next.js App Router, React Server Components, and Tailwind CSS. You will work on standardizing developer tooling and dashboard layouts.",
        sourceUrl: "https://vercel.com/careers"
      },
      {
        id: "job-003",
        title: "Software Engineer",
        companyName: "Stripe",
        location: "San Francisco, CA (Onsite)",
        salaryRange: "$140k - $175k",
        description: "Scale payment APIs, support subscription models, implement robust security protocols, and integrate with PostgreSQL database cluster engines.",
        sourceUrl: "https://stripe.com/jobs"
      }
    ].filter(j => j.title.toLowerCase().includes(role.toLowerCase()) || role === "Software Engineer" || role === "");
  }

  /**
   * Tool: Resume Optimizer
   */
  private async optimizeResumeTool(resume: ParsedResume, job: AgentJob): Promise<string> {
    return `### Optimized Summary for ${job.companyName}
Highly motivated Software Engineer specializing in full stack architectures. Leveraging a strong foundational background in React, TypeScript, and database optimization, with demonstrated project experience directly aligning with ${job.companyName}'s current technical objectives in high-throughput API integrations.

### Tailored Bullet Points
* Led architectural refinement of core application services, proactively integrating ${job.description.includes("React") ? "React components" : "modular APIs"} to address processing latency.
* Engineered distributed databases using PostgreSQL, optimizing data structures to support parallel query executions.`;
  }

  /**
   * Tool: Cover Letter Builder
   */
  private async generateCoverLetterTool(resume: ParsedResume, job: AgentJob): Promise<string> {
    return `Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${job.title} position at ${job.companyName}. Having parsed the requirements of the job description, I am confident that my technical skills in full-stack application development make me an outstanding fit.

Throughout my career, I have dedicated myself to building responsive, scalable software solutions. At my previous roles, I prioritized codebase cleanliness, high Lighthouse scores, and secure authentication models. The opportunities at ${job.companyName} to build tools directly maps onto my professional objectives.

Thank you for your time and consideration. I look forward to discussing how my skills align with your growth metrics.

Sincerely,
${resume.fullName}`;
  }

  /**
   * Tool: Cold Outreach Message Builder
   */
  private async generateOutreachTool(resume: ParsedResume, job: AgentJob): Promise<string> {
    return `Subject: Re: ${job.title} application - ${resume.fullName}

Hi ${job.companyName} Hiring Team,

I recently applied for the ${job.title} position on your careers board. Given my technical background building production-grade full-stack architectures in Next.js and PostgreSQL, I wanted to reach out directly. 

I've worked on similar products and optimized core user pipelines, which I believe is highly relevant to your team's mission. I would love to connect for 10 minutes to discuss how I can add value from day one.

Best,
${resume.fullName}
${resume.email}`;
  }
}
