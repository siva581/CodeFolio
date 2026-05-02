import nodemailer from "nodemailer";

let transporter = null;

const initNodemailTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    console.warn("Nodemailer not fully configured.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    requireTLS: true,
    auth: { user, pass },
    tls: {
      
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  });

  return transporter;
};

export const sendContactEmail = async (recipientEmail, senderName, senderEmail, message) => {
  const emailService = process.env.EMAIL_SERVICE || "nodemailer";

  try {
    if (emailService === "sendgrid") {
      return await sendViaSendGrid(recipientEmail, senderName, senderEmail, message);
    } else {
      return await sendViaNodemailer(recipientEmail, senderName, senderEmail, message);
    }
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw error;
  }
};

export const sendSenderConfirmation = async (senderEmail, senderName, recipientName) => {
  const emailService = process.env.EMAIL_SERVICE || "nodemailer";

  try {
    if (emailService === "sendgrid") {
      return await sendConfirmationViaSendGrid(senderEmail, senderName, recipientName);
    } else {
      return await sendConfirmationViaNodemailer(senderEmail, senderName, recipientName);
    }
  } catch (error) {
    console.error("Failed to send confirmation email:", error.message);
    return { sent: false, reason: error.message };
  }
};

const sendConfirmationViaNodemailer = async (senderEmail, senderName, recipientName) => {
  const smtp = initNodemailTransporter();
  if (!smtp) {
    console.log("Confirmation skipped (Nodemailer not configured):", { senderEmail });
    return { sent: false, reason: "Nodemailer not configured" };
  }

  await smtp.sendMail({
    from: process.env.FROM_EMAIL || "no-reply@codefolio.example",
    to: senderEmail,
    subject: `Your message was sent to ${recipientName}`,
    html: `
      <p>Hi ${senderName},</p>
      <p>Your message has been forwarded to <strong>${recipientName}</strong> via CodeFolio. They'll receive your message and can reply directly to your email.</p>
      <p>Thanks for reaching out!</p>
      <hr />
      <p><small>This is an automated confirmation from CodeFolio.</small></p>
    `,
  });

  return { sent: true, provider: "nodemailer" };
};

const sendConfirmationViaSendGrid = async (senderEmail, senderName, recipientName) => {
  const sgMail = (await import("@sendgrid/mail")).default;
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    console.log("Confirmation skipped (SendGrid API key not configured):", { senderEmail });
    return { sent: false, reason: "SendGrid not configured" };
  }

  sgMail.setApiKey(apiKey);

  await sgMail.send({
    to: senderEmail,
    from: process.env.FROM_EMAIL || "no-reply@codefolio.example",
    subject: `Your message was sent to ${recipientName}`,
    html: `
      <p>Hi ${senderName},</p>
      <p>Your message has been forwarded to <strong>${recipientName}</strong> via CodeFolio. They'll receive your message and can reply directly to your email.</p>
      <p>Thanks for reaching out!</p>
      <hr />
      <p><small>This is an automated confirmation from CodeFolio.</small></p>
    `,
  });

  return { sent: true, provider: "sendgrid" };
};

const sendViaNodemailer = async (recipientEmail, senderName, senderEmail, message) => {
  const smtp = initNodemailTransporter();
  if (!smtp) {
    console.log("Email skipped (Nodemailer not configured):", { recipientEmail, senderName });
    return { sent: false, reason: "Nodemailer not configured" };
  }

  
  try {
    await smtp.verify();
  } catch (err) {
    console.error("SMTP verification failed:", err && err.message ? err.message : err);
    return { sent: false, reason: `SMTP verification failed: ${err && err.message ? err.message : String(err)}` };
  }

  await smtp.sendMail({
    from: process.env.FROM_EMAIL || "sivaprakash36893@gmail.com",
    to: recipientEmail,
    replyTo: senderEmail,
    subject: `New message from ${senderName} via CodeFolio`,
    html: `
      <h2>New Message from Your CodeFolio Portfolio</h2>
      <p><strong>From:</strong> ${senderName} (${senderEmail})</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br />")}</p>
      <hr />
      <p><small>This email was sent via CodeFolio. Reply directly to this email to respond.</small></p>
    `,
  });

  console.log(`Email sent to ${recipientEmail} via Nodemailer`);
  return { sent: true, provider: "nodemailer" };
};

const sendViaSendGrid = async (recipientEmail, senderName, senderEmail, message) => {
  const sgMail = (await import("@sendgrid/mail")).default;
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    console.log("Email skipped (SendGrid API key not configured):", { recipientEmail, senderName });
    return { sent: false, reason: "SendGrid not configured" };
  }

  sgMail.setApiKey(apiKey);

  await sgMail.send({
    to: recipientEmail,
    from: process.env.FROM_EMAIL || "sivaprakash36893@gmail.com",
    replyTo: senderEmail,
    subject: `New message from ${senderName} via CodeFolio`,
    html: `
      <h2>New Message from Your CodeFolio Portfolio</h2>
      <p><strong>From:</strong> ${senderName} (${senderEmail})</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br />")}</p>
      <hr />
      <p><small>This email was sent via CodeFolio. Reply directly to this email to respond.</small></p>
    `,
  });

  console.log(`Email sent to ${recipientEmail} via SendGrid`);
  return { sent: true, provider: "sendgrid" };
};
