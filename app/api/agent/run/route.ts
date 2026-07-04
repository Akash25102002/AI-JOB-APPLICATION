import { NextRequest, NextResponse } from "next/server";
import { JobApplicationAgent } from "../../../../lib/ai/agent";
import { db } from "../../../../lib/db";
import { ApplicationStatus, JobType, WorkLocationType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, location } = body;

    if (!role) {
      return NextResponse.json({ error: "Role field is required for search" }, { status: 400 });
    }

    // 1. Fetch user default resume
    let user = await db.user.findFirst({
      where: { email: "john.doe@example.com" },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: "john.doe@example.com",
          clerkId: "user_123",
        },
      });
    }

    const defaultResume = await db.resume.findFirst({
      where: { userId: user.id, isDefault: true },
    });

    const resumeText = defaultResume?.rawText || `
      John Doe
      john.doe@example.com | +1 (555) 019-2834
      Staff Software Engineer.
      Skills: TypeScript, React, Next.js, PostgreSQL.
    `;

    // 2. Deploy AI agent loop
    const query = { role, location: location || "Remote" };
    const agent = new JobApplicationAgent(user.id, resumeText, query);
    
    // Execute stateful workflow
    const agentState = await agent.runWorkflow();

    // 3. Persist jobs and matches in database to make the run state permanent
    if (agentState.rankedJobs.length > 0) {
      for (const item of agentState.rankedJobs) {
        // Find or create Company
        const company = await db.company.upsert({
          where: { name: item.job.companyName },
          update: {},
          create: {
            name: item.job.companyName,
          },
        });

        // Create Job opportunity
        const job = await db.job.create({
          data: {
            companyId: company.id,
            title: item.job.title,
            description: item.job.description,
            location: item.job.location,
            salaryRange: item.job.salaryRange,
            url: item.job.sourceUrl,
            workType: item.job.location.toLowerCase().includes("remote") ? WorkLocationType.REMOTE : (item.job.location.toLowerCase().includes("hybrid") ? WorkLocationType.HYBRID : WorkLocationType.ONSITE),
            jobType: JobType.FULL_TIME,
          },
        });

        // Store fit metrics analysis
        await db.jobMatch.create({
          data: {
            jobId: job.id,
            matchPercentage: item.match.matchPercentage,
            strengths: item.match.strengths,
            weaknesses: item.match.weaknesses,
            skillGap: item.match.skillGap,
            missingTechnologies: item.match.missingTechnologies,
            suggestions: item.match.suggestions,
          },
        });

        // Automatically create a pending application (under applied state) if match is highly compatible
        if (item.job.id === agentState.selectedJobId) {
          const application = await db.application.create({
            data: {
              userId: user.id,
              jobId: job.id,
              companyId: company.id,
              resumeId: defaultResume?.id,
              status: ApplicationStatus.APPLIED,
              salary: item.job.salaryRange,
              location: item.job.location,
              notes: `AI Recommended Fit: ${item.match.matchPercentage}%. Created cover letter and outreach scripts.`,
            },
          });

          // Store Cover letter
          await db.coverLetter.create({
            data: {
              userId: user.id,
              applicationId: application.id,
              content: agentState.coverLetterText || "",
              tone: "Professional",
            },
          });

          // Store Outreach scripts
          await db.coldOutreach.create({
            data: {
              userId: user.id,
              applicationId: application.id,
              recipientName: "Hiring Team",
              recipientRole: "Recruitment Coordinator",
              contactInfo: "in/recruiter-profile",
              messageBody: agentState.outreachMessage || "",
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      state: agentState,
    });
  } catch (error: any) {
    console.error("Agent run API failed:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
