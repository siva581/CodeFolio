import { Profile } from "../models/Profile.js";
import {
  createPaymentIntent,
  getOrCreateCustomer,
  handlePaymentSuccess,
  verifyWebhookSignature,
} from "../services/stripeService.js";

export const createCheckoutSession = async (req, res, next) => {
  try {
    const { planType } = req.body;
    const userId = req.userId;

    if (!planType || !["pro", "business"].includes(planType)) {
      return res.status(400).json({ message: "Invalid plan type" });
    }

    
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    
    const amountInRupees = planType === "pro" ? 999 : 2999;
    
    const amountInPaise = amountInRupees * 100;

    
    const paymentIntent = await createPaymentIntent(userId, planType, amountInPaise, "inr");

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount: amountInRupees,
      currency: "inr",
    });
  } catch (error) {
    if (error.message && error.message.includes("Payments are not configured")) {
      return res.status(503).json({ message: error.message });
    }
    return next(error);
  }
};

export const confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, planType } = req.body;
    const userId = req.userId;

    if (!paymentIntentId || !planType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.is_pro = true;
    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Payment confirmed. Your account has been upgraded!",
      profile: {
        id: profile.userId,
        is_pro: profile.is_pro,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getProPlans = async (req, res, next) => {
  try {
    const plans = [
      {
        id: "pro",
        name: "Pro",
        price: 999,
        currency: "inr",
        billing: "monthly",
        features: [
          "Custom domain support",
          "Advanced analytics",
          "Priority support",
          "Premium templates",
          "Unlimited projects",
        ],
      },
      {
        id: "business",
        name: "Business",
        price: 2999,
        currency: "inr",
        billing: "monthly",
        features: [
          "Everything in Pro",
          "Team collaboration",
          "API access",
          "Advanced customization",
          "Dedicated support",
        ],
      },
    ];

    return res.status(200).json(plans);
  } catch (error) {
    return next(error);
  }
};

export const handleStripeWebhook = async (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  try {
    const event = verifyWebhookSignature(req.rawBody, signature);

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
