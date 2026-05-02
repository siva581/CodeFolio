import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripeConfigured = Boolean(
  stripeSecretKey && !stripeSecretKey.includes("your_stripe_secret_key"),
);
const stripe = stripeConfigured ? new Stripe(stripeSecretKey) : null;

export const createPaymentIntent = async (userId, planType = "pro", amount = 99900, currency = "inr") => {
  try {
    if (!stripe) {
      throw new Error("Payments are not configured. Set STRIPE_SECRET_KEY in backend/.env.");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        userId,
        planType,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error("Failed to create payment intent:", error.message);
    throw error;
  }
};

export const getOrCreateCustomer = async (email, metadata = {}) => {
  try {
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return customers.data[0];
    }

    
    const customer = await stripe.customers.create({
      email,
      metadata,
    });

    return customer;
  } catch (error) {
    console.error("Failed to get or create customer:", error.message);
    throw error;
  }
};


export const verifyWebhookSignature = (body, signature) => {
  try {
    return stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    throw error;
  }
};

export const handlePaymentSuccess = async (paymentIntent) => {
  const { userId, planType } = paymentIntent.metadata;
  console.log(`Payment successful for user ${userId}, upgrading to ${planType}`);
};

export const handleSubscriptionUpdated = async (subscription) => {
  const { userId } = subscription.metadata || {};

  if (subscription.status === "active" && userId) {
    console.log(`Subscription active for user ${userId}`);
  } else if (subscription.status === "canceled" || subscription.status === "past_due") {
    console.log(`Subscription ${subscription.status} for user ${userId}`);
  }
};
