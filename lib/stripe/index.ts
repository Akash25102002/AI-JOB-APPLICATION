import Stripe from "stripe";

const stripeApiKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";
export const stripe = new Stripe(stripeApiKey, {
  apiVersion: "2025-01-27" as any, // Use standard stable API version
});

export const PLANS = [
  {
    id: "free",
    name: "Free Sandbox",
    price: 0,
    priceId: "",
    credits: 5,
    features: [
      "AI resume parser (5 uploads)",
      "Basic ATS Match analyzer",
      "Manual Kanban application tracker",
      "Standard job search queries",
    ],
  },
  {
    id: "starter",
    name: "Starter Pilot",
    price: 19,
    priceId: process.env.STRIPE_PRICE_STARTER || "price_starter_test",
    credits: 100,
    features: [
      "100 AI credits per month",
      "ATS Keyword analyzer & suggestions",
      "Cover letter customization engine",
      "LinkedIn outreach cold-messaging script",
      "Priority job digest notifications",
    ],
  },
  {
    id: "pro",
    name: "Pro Pilot (Best Value)",
    price: 39,
    priceId: process.env.STRIPE_PRICE_PRO || "price_pro_test",
    credits: 9999, // Unlimited
    features: [
      "Unlimited AI workflows",
      "Autonomous Agentic Job Discovery",
      "Auto-optimized custom resume builder",
      "Custom interview prep mock dashboards",
      "Auto-sync Google Calendar schedule",
      "Dedicated crawler proxies",
    ],
  },
];

/**
 * Creates a Stripe Checkout Session for a user subscribing to a plan.
 */
export async function createCheckoutSession(userId: string, userEmail: string, priceId: string, successUrl: string, cancelUrl: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: userEmail,
      metadata: {
        userId,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return { url: session.url };
  } catch (error: any) {
    console.error("Stripe Session Creation failed:", error);
    return { error: error.message };
  }
}

/**
 * Creates a Customer Portal Session so users can manage their subscriptions.
 */
export async function createPortalSession(customerId: string, returnUrl: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return { url: session.url };
  } catch (error: any) {
    console.error("Stripe Portal Session Creation failed:", error);
    return { error: error.message };
  }
}
