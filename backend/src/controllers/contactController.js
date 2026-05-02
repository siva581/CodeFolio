import { ContactMessage } from "../models/ContactMessage.js";
import { sendContactEmail, sendSenderConfirmation } from "../services/emailService.js";
import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";
import { validateContactMessage, sanitizeInput } from "../utils/validation.js";

export const createContactMessage = async (req, res, next) => {
  try {
    const { recipient_id, sender_name, sender_email, message } = req.body;

    
    const validationErrors = validateContactMessage({
      sender_name,
      sender_email,
      message,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    
    const sanitizedName = sanitizeInput(sender_name);
    const sanitizedMessage = sanitizeInput(message);

    await ContactMessage.create({
      recipientId: recipient_id,
      sender_name: sanitizedName,
      sender_email: sender_email.toLowerCase().trim(),
      message: sanitizedMessage,
    });

    const profile = await Profile.findOne({ userId: recipient_id });
    const user = await User.findById(recipient_id).select("email");
    const recipientEmail = profile?.email_public || user?.email;
    let emailDelivery = { sent: false, reason: "No recipient email configured" };

    if (recipientEmail) {
      emailDelivery = await sendContactEmail(recipientEmail, sanitizedName, sender_email, sanitizedMessage);
    }
    if (emailDelivery.sent) {
      
      try {
        const recipientName = profile?.full_name || profile?.username || "the portfolio owner";
        await sendSenderConfirmation(sender_email, sanitizedName, recipientName);
      } catch (e) {
       
      }

      return res.status(201).json({ success: true, message: "Message sent successfully" });
    }

    return res.status(201).json({
      success: true,
      message: `Message saved, but email was not delivered (${emailDelivery.reason}).`,
    });
  } catch (error) {
    return next(error);
  }
};
