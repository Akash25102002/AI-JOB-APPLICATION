import { PrismaClient, SubscriptionStatus, ApplicationStatus, JobType, WorkLocationType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // 1. Upsert Companies
  const deepmind = await prisma.company.upsert({
    where: { name: "Google DeepMind" },
    update: {},
    create: {
      name: "Google DeepMind",
      logoUrl: "https://logo.clearbit.com/deepmind.google",
      websiteUrl: "https://deepmind.google",
      description: "Advanced AI research and agentic systems development team.",
      industry: "Artificial Intelligence",
      size: "1000-5000",
      headquarters: "London, UK",
    },
  });

  const vercel = await prisma.company.upsert({
    where: { name: "Vercel" },
    update: {},
    create: {
      name: "Vercel",
      logoUrl: "https://logo.clearbit.com/vercel.com",
      websiteUrl: "https://vercel.com",
      description: "Frontend cloud framework hosting and edge execution systems.",
      industry: "Technology & SaaS",
      size: "100-500",
      headquarters: "Remote / New York",
    },
  });

  const stripe = await prisma.company.upsert({
    where: { name: "Stripe" },
    update: {},
    create: {
      name: "Stripe",
      logoUrl: "https://logo.clearbit.com/stripe.com",
      websiteUrl: "https://stripe.com",
      description: "Global financial infrastructure and payment processing gateway APIs.",
      industry: "Fintech",
      size: "5000-10000",
      headquarters: "San Francisco, CA",
    },
  });

  console.log("Companies upserted.");

  // 2. Create User
  const user = await prisma.user.upsert({
    where: { email: "john.doe@example.com" },
    update: {},
    create: {
      email: "john.doe@example.com",
      clerkId: "user_123", // Clerk ID or NextAuth ID placeholder
      profile: {
        create: {
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "+1 (555) 019-2834",
          headline: "Staff Software Engineer | Full Stack & AI Architect",
          bio: "Passionate developer with 8+ years of expertise in building distributed Next.js services, database optimizations, and stateful multi-agent workflows.",
          websiteUrl: "https://johndoe.dev",
          linkedinUrl: "https://linkedin.com/in/johndoe",
          githubUrl: "https://github.com/johndoe",
          location: "San Francisco, CA",
        },
      },
    },
  });

  console.log(`User created: ${user.email}`);

  // 3. Create Resume
  const parsedResumeJson = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 019-2834",
    skills: ["TypeScript", "React", "Next.js", "PostgreSQL", "Prisma", "Node.js", "Express", "Docker", "AWS", "Git"],
    experience: [
      {
        company: "Stripe",
        role: "Senior Full Stack Engineer",
        startDate: "06/2023",
        endDate: "Present",
        description: "Led billing portal integration, enhancing customer subscription automation flows.",
        bulletPoints: [
          "Developed core checkout pages using React and Next.js, processing over 1M+ monthly requests.",
          "Collaborated with security teams to optimize JWT verification pipelines, reducing authentication latency by 20%.",
          "Automated developer onboarding flows resulting in 15% faster integration cycles."
        ]
      },
      {
        company: "Vercel",
        role: "Software Engineer II",
        startDate: "08/2021",
        endDate: "05/2023",
        description: "Worked on Vercel deployment pipeline core capabilities and SDK interfaces.",
        bulletPoints: [
          "Optimized static page rendering pipeline, boosting Lighthouse scores from 82 to 98 across 500k+ client domains.",
          "Refactored Next.js dynamic routing parameters backend using Rust edge bindings."
        ]
      }
    ],
    education: [
      {
        school: "Stanford University",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        startDate: "2017",
        endDate: "2021"
      }
    ],
    projects: [
      {
        name: "JobPilot AI Dashboard",
        description: "Full Stack AI job application kanban portal with stateful routing and automated custom resume outputs.",
        role: "Creator",
        url: "https://github.com/example/jobpilot",
        technologies: ["Next.js", "Tailwind CSS", "Prisma", "Neon DB"]
      }
    ],
    certifications: [
      "AWS Certified Solutions Architect",
      "Clerk Certified Developer"
    ],
    languages: ["English (Native)", "Spanish (Conversational)"]
  };

  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      name: "Standard Full-Stack Resume",
      isDefault: true,
      fileUrl: "https://uploadthing.com/f/placeholder-resume.pdf",
      rawText: "Jane Doe resume text. Skills: TypeScript, React, Next.js, Postgres. Worked at Stripe and Vercel.",
      parsedData: parsedResumeJson,
    },
  });

  // Create an analysis record
  await prisma.resumeAnalysis.create({
    data: {
      resumeId: resume.id,
      score: 78,
      atsScore: 82,
      missingSkills: ["Docker", "Kubernetes", "AWS Cloud"],
      keywords: ["Microservices", "Stateful agent", "Kubernetes", "Next.js Router"],
      formatting: { fontConsistency: "Excellent", lengthCheck: "1 Page" },
      grammar: { issuesCount: 0, typoList: [] },
      summary: "Resume meets standard ATS layout, but cloud scaling keywords are lacking.",
      bulletsAnalysis: [
        {
          original: "Worked on billing backend using stripe.",
          rating: "weak",
          reason: "Lacks measurable metrics and action verbs.",
          improved: "Engineered billing checkout microservices leveraging Stripe API and Redis caching, processing $15M+ in volume while reducing transaction processing latency by 35%."
        }
      ]
    }
  });

  console.log("Resume and analysis records created.");

  // 4. Create Jobs
  const job1 = await prisma.job.create({
    data: {
      companyId: deepmind.id,
      title: "Staff AI Engineer",
      description: "Join the Advanced Agentic Coding team to build stateful LLM code orchestrators, multi-agent frameworks, and code translation engines. Experience with React, Node.js, Next.js, and PyTorch preferred.",
      requirements: "8+ years experience, solid understanding of vector embeddings, agentic loop architectures, PyTorch, React, and server-side database design.",
      benefits: "Health insurance, generous equity options, hybrid work structure.",
      salaryRange: "$180k - $240k",
      location: "London, UK",
      workType: WorkLocationType.HYBRID,
      jobType: JobType.FULL_TIME,
      url: "https://deepmind.google/careers",
      source: "LinkedIn",
    },
  });

  const job2 = await prisma.job.create({
    data: {
      companyId: vercel.id,
      title: "Senior Full Stack Developer",
      description: "Looking for an expert with TypeScript, Next.js App Router, React Server Components, and Tailwind CSS. You will work on standardizing developer tooling and dashboard layouts.",
      requirements: "5+ years full-stack experience, expert knowledge of React 19, server actions, dynamic routing caches, and Vercel hosting optimizations.",
      benefits: "Unlimited PTO, remote stipend, wellness allowances.",
      salaryRange: "$150k - $190k",
      location: "Remote (Global)",
      workType: WorkLocationType.REMOTE,
      jobType: JobType.FULL_TIME,
      url: "https://vercel.com/careers",
      source: "Vercel Careers",
    },
  });

  const job3 = await prisma.job.create({
    data: {
      companyId: stripe.id,
      title: "Software Engineer",
      description: "Scale payment APIs, support subscription models, implement robust security protocols, and integrate with PostgreSQL database cluster engines.",
      requirements: "3+ years API experience, understanding of transactional databases, Stripe checkout pipelines, and REST protocols.",
      benefits: "Dental, vision, competitive salary, onsite kitchen.",
      salaryRange: "$140k - $175k",
      location: "San Francisco, CA",
      workType: WorkLocationType.ONSITE,
      jobType: JobType.FULL_TIME,
      url: "https://stripe.com/jobs",
      source: "Greenhouse",
    },
  });

  console.log("Jobs created.");

  // 5. Create Applications
  await prisma.application.create({
    data: {
      userId: user.id,
      jobId: job1.id,
      companyId: deepmind.id,
      resumeId: resume.id,
      status: ApplicationStatus.OA,
      salary: "$180k - $240k",
      location: "London, UK (Hybrid)",
      recruiterName: "Alice Smith",
      recruiterEmail: "asmith@google.com",
      notes: "Reviewing code gen architectures. OA scheduled next week.",
    },
  });

  await prisma.application.create({
    data: {
      userId: user.id,
      jobId: job2.id,
      companyId: vercel.id,
      resumeId: resume.id,
      status: ApplicationStatus.TECHNICAL,
      salary: "$150k - $190k",
      location: "Remote (Global)",
      recruiterName: "Bob Johnson",
      recruiterEmail: "bjohnson@vercel.com",
      notes: "Talked to engineering manager. Preparing Next.js core details.",
    },
  });

  await prisma.application.create({
    data: {
      userId: user.id,
      jobId: job3.id,
      companyId: stripe.id,
      resumeId: resume.id,
      status: ApplicationStatus.APPLIED,
      salary: "$140k - $175k",
      location: "San Francisco (Onsite)",
      recruiterName: "Charlie Brown",
      recruiterEmail: "cbrown@stripe.com",
      notes: "Applied via referral. Resume matched at 91%.",
    },
  });

  // Create an active subscription
  await prisma.subscription.create({
    data: {
      userId: user.id,
      stripeCustomerId: "cus_test123",
      stripePriceId: "price_pro_test",
      stripeSubscriptionId: "sub_test123",
      status: SubscriptionStatus.PRO,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  console.log("Seed operations finished successfully.");
}

main()
  .catch((e) => {
    console.error("Error running database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
