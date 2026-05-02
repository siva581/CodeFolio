import dotenv from "dotenv";
import { sendContactEmail } from "../src/services/emailService.js";

dotenv.config();

(async () => {
  try {
    const recipient = process.env.FROM_EMAIL;
    if (!recipient) {
      console.error("Please set FROM_EMAIL in backend/.env before running this test.");
      process.exit(1);
    }

    console.log("Sending test email to:", recipient);
    const result = await sendContactEmail(recipient, "Test Sender", "test-sender@example.com", "This is a test message from CodeFolio test script.");
    console.log("Result:", result);
    process.exit(0);
  } catch (err) {
    console.error("Test email failed:", err && err.message ? err.message : err);
    process.exit(1);
  }
})();
