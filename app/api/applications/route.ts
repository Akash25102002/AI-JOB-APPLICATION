import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { ApplicationStatus } from "@prisma/client";

// Get all applications for the default user (Kanban loader)
export async function GET() {
  try {
    const user = await db.user.findFirst({
      where: { email: "john.doe@example.com" },
    });

    if (!user) {
      return NextResponse.json({ applications: [] });
    }

    const applications = await db.application.findMany({
      where: { userId: user.id },
      include: {
        job: true,
        company: true,
      },
      orderBy: { dateApplied: "desc" },
    });

    // Map database model fields to clean JSON response
    const mapped = applications.map((app) => ({
      id: app.id,
      company: app.company.name,
      role: app.job.title,
      location: app.location || app.job.location,
      salary: app.salary || app.job.salaryRange || "Competitive",
      date: app.dateApplied.toISOString().split("T")[0],
      notes: app.notes || "",
      status: app.status,
    }));

    return NextResponse.json({ success: true, applications: mapped });
  } catch (error: any) {
    console.error("GET applications failed:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// Create new manual application
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, roleTitle, location, salary, status, notes } = body;

    if (!companyName || !roleTitle) {
      return NextResponse.json({ error: "Company name and job role title are required" }, { status: 400 });
    }

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

    // Upsert company
    const company = await db.company.upsert({
      where: { name: companyName },
      update: {},
      create: {
        name: companyName,
      },
    });

    // Create a mock Job post to link the application
    const job = await db.job.create({
      data: {
        companyId: company.id,
        title: roleTitle,
        description: "Manually entered job track.",
        location: location || "Remote",
        salaryRange: salary,
      },
    });

    // Create Application
    const application = await db.application.create({
      data: {
        userId: user.id,
        jobId: job.id,
        companyId: company.id,
        status: (status as ApplicationStatus) || ApplicationStatus.APPLIED,
        salary: salary,
        location: location,
        notes: notes,
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("POST application failed:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// Update application (e.g. dragging across columns or editing notes)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing application id" }, { status: 400 });
    }

    const updatedData: any = {};
    if (status) updatedData.status = status as ApplicationStatus;
    if (notes !== undefined) updatedData.notes = notes;

    const application = await db.application.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("PATCH application failed:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// Delete/Archive application
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing application id parameter" }, { status: 400 });
    }

    await db.application.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Application deleted successfully" });
  } catch (error: any) {
    console.error("DELETE application failed:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
