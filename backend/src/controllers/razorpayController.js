import crypto from "crypto";
import { Profile } from "../models/Profile.js";

const checkRazorpayConfigured = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return false;
  return true;
};

export const createRazorpayOrder = async (req, res, next) => {
  try {
    if (!checkRazorpayConfigured()) {
      return res.status(503).json({ message: "Razorpay not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env." });
    }

    const { planType } = req.body;
    if (!planType || !["pro", "business"].includes(planType)) {
      return res.status(400).json({ message: "Invalid plan type" });
    }

    const amountRupees = planType === "pro" ? 999 : 2999;
    const amountPaise = amountRupees * 100;

    let Razorpay;
    try {
      const mod = await import("razorpay");
      Razorpay = mod.default || mod;
    } catch (err) {
      return res.status(503).json({ message: "Razorpay package is not installed. Run npm install in backend." });
    }

    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpayInstance.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
      payment_capture: 1,
    });

    return res.status(200).json({ orderId: order.id, amount: amountRupees, currency: "INR", keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    return next(error);
  }
};

export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    if (!checkRazorpayConfigured()) {
      return res.status(503).json({ message: "Razorpay not configured." });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment fields" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    
    const profile = await Profile.findOne({ userId: req.userId });
    if (profile) {
      profile.is_pro = true;
      await profile.save();
    }

    return res.status(200).json({ success: true, message: "Payment verified, account upgraded" });
  } catch (error) {
    return next(error);
  }
};
