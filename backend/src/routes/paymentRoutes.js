import { Router } from "express";
import {
  createCheckoutSession,
  confirmPayment,
  getProPlans,
  handleStripeWebhook,
} from "../controllers/paymentController.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/razorpayController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/plans", getProPlans);
router.post("/webhook", handleStripeWebhook);

router.post("/create-payment-intent", protect, createCheckoutSession);
router.post("/confirm-payment", protect, confirmPayment);
router.post("/razorpay/create-order", protect, createRazorpayOrder);
router.post("/razorpay/verify", protect, verifyRazorpayPayment);

export default router;
