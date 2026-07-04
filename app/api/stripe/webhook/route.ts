import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";
import { db } from "../../../../lib/db";
import { SubscriptionStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder"
    );
  } catch (err: any) {
    console.warn(`Stripe Webhook signature verification failed: ${err.message}`);
    // Bypass signature check in local testing mode if using mock requests
    if (process.env.NODE_ENV === "development") {
      try {
        event = JSON.parse(body);
      } catch (jsonErr) {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }
  }

  try {
    const session = event.data?.object as any;

    if (event.type === "checkout.session.completed") {
      const userId = session.metadata?.userId;
      const stripeCustomerId = session.customer as string;
      const stripeSubscriptionId = session.subscription as string;

      if (!userId) {
        return NextResponse.json({ error: "Missing userId metadata in stripe session" }, { status: 400 });
      }

      // Retrieve subscription details to find price ID
      const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      const priceId = subscription.items.data[0].price.id;

      // Determine tier name based on priceID matching
      let tier: SubscriptionStatus = SubscriptionStatus.FREE;
      if (priceId === process.env.STRIPE_PRICE_STARTER || priceId === "price_starter_test") {
        tier = SubscriptionStatus.STARTER;
      } else if (priceId === process.env.STRIPE_PRICE_PRO || priceId === "price_pro_test") {
        tier = SubscriptionStatus.PRO;
      }

      // Check if user already has a subscription
      const existingSub = await db.subscription.findFirst({
        where: { userId },
      });

      if (existingSub) {
        await db.subscription.update({
          where: { id: existingSub.id },
          data: {
            stripeCustomerId,
            stripePriceId: priceId,
            stripeSubscriptionId,
            status: tier,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
      } else {
        await db.subscription.create({
          data: {
            userId,
            stripeCustomerId,
            stripePriceId: priceId,
            stripeSubscriptionId,
            status: tier,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
      }

      console.log(`Stripe subscription completed for User: ${userId}, Tier: ${tier}`);
    }

    if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
      const stripeSubscriptionId = session.id as string;
      const stripeCustomerId = session.customer as string;

      const subscription = await db.subscription.findUnique({
        where: { stripeSubscriptionId },
      });

      if (subscription) {
        if (event.type === "customer.subscription.deleted") {
          await db.subscription.update({
            where: { stripeSubscriptionId },
            data: {
              status: SubscriptionStatus.FREE,
            },
          });
          console.log(`Stripe subscription cancelled for customer: ${stripeCustomerId}`);
        } else {
          // updated event - sync expiration periods
          const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          await db.subscription.update({
            where: { stripeSubscriptionId },
            data: {
              currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
              cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe Webhook handler failed:", error);
    return NextResponse.json({ error: error.message || "Webhook processing error" }, { status: 500 });
  }
}
