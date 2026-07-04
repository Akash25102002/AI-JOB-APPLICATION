import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "../../../../lib/stripe";
import { db } from "../../../../lib/db";

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId parameter" }, { status: 400 });
    }

    // Default seeded user fallback
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${appUrl}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/dashboard/settings?canceled=true`;

    const session = await createCheckoutSession(
      user.id,
      user.email,
      priceId,
      successUrl,
      cancelUrl
    );

    if (session.error) {
      return NextResponse.json({ error: session.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout API failed:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
