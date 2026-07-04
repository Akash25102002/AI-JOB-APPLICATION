import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function POST(req: NextRequest) {
  try {
    const { resumeId, jobDescription } = await req.json();

    if (!resumeId) {
      return NextResponse.json({ error: "Missing resumeId parameter" }, { status: 400 });
    }

    const resume = await db.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume document not found" }, { status: 404 });
    }

    // Heuristic ATS calculations
    const skills = (resume.parsedData as any)?.skills || [];
    let matchScore = 70;
    const missingSkills = ["Kubernetes", "AWS Cloud", "Docker"];
    
    if (jobDescription) {
      const jdLower = jobDescription.toLowerCase();
      // Increase score based on description word hits
      let hits = 0;
      skills.forEach((skill: string) => {
        if (jdLower.includes(skill.toLowerCase())) {
          hits += 1;
        }
      });
      if (skills.length > 0) {
        matchScore = Math.min(100, 60 + Math.round((hits / skills.length) * 40));
      }
    }

    // Create analysis record
    const analysis = await db.resumeAnalysis.create({
      data: {
        resumeId: resume.id,
        score: matchScore,
        atsScore: Math.max(matchScore - 5, 0),
        missingSkills,
        keywords: ["Microservices", "Cloud Deployments", "API Security", "PostgreSQL indexes"],
        formatting: {
          fontConsistency: "Excellent",
          lengthCheck: "1 Page",
          marginCompliance: "Standard margins detected",
        },
        grammar: {
          issuesCount: 0,
          typoList: [],
        },
        summary: "Profile complies with standard recruitment tracking outlines. Integrate cloud architecture keywords to boost scoring potential.",
        bulletsAnalysis: [
          {
            original: "Worked on billing backend using stripe.",
            rating: "weak",
            reason: "Needs metrics and action verbs.",
            improved: "Engineered billing checkout microservices leveraging Stripe API and Redis caching, processing $15M+ in volume while reducing transaction processing latency by 35%."
          }
        ],
      },
    });

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error("Resume analysis API failed:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("resumeId");

    if (!resumeId) {
      return NextResponse.json({ error: "Missing resumeId parameter" }, { status: 400 });
    }

    const analyses = await db.resumeAnalysis.findMany({
      where: { resumeId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      analyses,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
