import nodemailer from "nodemailer";

/**
 * Creates and returns a Nodemailer transporter configured for Gmail SMTP.
 * Automatically cleans any accidental whitespace or spaces in App Passwords.
 */
const getTransporter = () => {
  const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : "";
  // Google App Passwords often have spaces when copied (e.g., "abcd efgh ijkl mnop"). Remove all spaces.
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : "";

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Port 465 uses SSL
    auth: {
      user,
      pass,
    },
    // Prevent serverless function freezes with reasonable timeouts
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
};

/**
 * Send an email using Nodemailer
 * @param {Object} options - { email, subject, html }
 */
const sendEmail = async (options) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "Email credentials (EMAIL_USER / EMAIL_PASS) are missing in environment variables."
    );
  }

  const transporter = getTransporter();

  const mailOptions = {
    from: `"COPENHAGEN Atelier" <${process.env.EMAIL_USER.trim()}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(" [EMAIL SUCCESS] Sent to:", options.email, "| Message ID:", info.messageId);
  return info;
};

export default sendEmail;
