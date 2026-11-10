import User from "../models/User.js";
import Session from "../models/Session.js"; 
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../utils/token.js";

import crypto from "crypto";
import sendEmail from "../utils/email.js";

export const registerUser = async (req, res) => {
  try {
    console.log(" [REGISTER] Request received:", req.body);

    const { name, firstName, lastName, email, password, phone, address } = req.body || {};

    // Support both single 'name' or separate 'firstName'/'lastName'
    const finalName = name?.trim() || (firstName ? `${firstName} ${lastName || ''}`.trim() : '');

    if (!finalName || !email || !password) {
      console.log(" [REGISTER] Validation failed: Name, email, or password missing");
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Normalize inputs
    const normalizedEmail = email.trim().toLowerCase();

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      console.log(" [REGISTER] Validation failed: Invalid email format ->", normalizedEmail);
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Password length validation
    if (password.length < 8) {
      console.log(" [REGISTER] Validation failed: Password length < 8");
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      console.log(" [REGISTER] Validation failed: Email already registered ->", normalizedEmail);
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    console.log(" [REGISTER] Hashing password...");
    const hashedPassword = await hashPassword(password);

    console.log(" [REGISTER] Inserting user into MongoDB...");
    const user = await User.create({
      name: finalName,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      address,
    });
    console.log(" [REGISTER] User document created in DB with ID:", user._id);

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const tokenHash = hashToken(refreshToken);

    const refreshDays = Number(process.env.REFRESH_TOKEN_DAYS || 7);
    const expiresAt = new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000);

    // Save session in database
    await Session.create({
      userId: user._id,
      tokenHash,
      expiresAt,
      device: req.get("user-agent") || "Unknown",
    });
    console.log(" [REGISTER] Session document created in DB");

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    });

    console.log(" [REGISTER] Registration completed successfully for:", user.email);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || 'Canada',
      },
    });
  } catch (error) {
    console.error(" [REGISTER ERROR]:", error.message);
    console.error(" [ERROR STACK]:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Find user
    const user = await User.findOne({
  email: normalizedEmail,
}).select("+password");

   console.log("USER FOUND:", !!user);
console.log("PASSWORD EXISTS:", !!user?.password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Compare password
    const isPasswordValid = await comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 5. Generate access token
    const accessToken = generateAccessToken(user);

    // 6. Generate refresh token
    const refreshToken = generateRefreshToken();

    // 7. Hash refresh token
    const tokenHash = hashToken(refreshToken);

    // 8. Calculate expiry
    const refreshDays = Number(
      process.env.REFRESH_TOKEN_DAYS || 7
    );

    const expiresAt = new Date(
      Date.now() + refreshDays * 24 * 60 * 60 * 1000
    );

    // 9. Save session
    await Session.create({
      userId: user._id,
      tokenHash,
      expiresAt,
      device: req.get("user-agent") || "Unknown",
    });

    // 10. Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    });

    // 11. Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || 'Canada',
      },
    });

  } catch (error) {
    console.error("[LOGIN ERROR]:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};





export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 2. Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    // Same response whether account exists or not
    const responseMessage =
      "If an account exists with this email, password reset instructions have been sent.";

    if (!user) {
      return res.status(200).json({
        success: true,
        message: responseMessage,
      });
    }

    // 3. Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 4. Hash token before saving in database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 5. Save hashed token and expiry
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    // 6. Generate frontend reset URL
    const frontendBase = process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173";
    const resetURL = `${frontendBase.replace(/\/$/, '')}/reset-password/${resetToken}`;

    // 7. Send reset email
    try {
      await sendEmail({
        email: user.email,
        subject: "COPENHAGEN — Password Reset Request",
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #f7f6f2; border: 1px solid #e5e3dc; padding: 32px; color: #141414;">
            <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #e5e3dc;">
              <h1 style="letter-spacing: 0.25em; font-size: 18px; text-transform: uppercase; color: #141414; margin: 0;">COPENHAGEN</h1>
              <p style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #4e5f41; margin-top: 6px;">Scandinavian Living & Atelier</p>
            </div>

            <div style="padding: 28px 0;">
              <h2 style="font-size: 20px; font-weight: 500; margin-top: 0; color: #141414;">Password Reset Request</h2>
              <p style="font-size: 13px; line-height: 1.6; color: #555;">Hello ${user.name || 'Member'},</p>
              <p style="font-size: 13px; line-height: 1.6; color: #555;">
                We received a request to reset the password for your Copenhagen account. Click the secure link below to choose your new credentials:
              </p>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetURL}"
                   style="background-color: #4e5f41; color: #ffffff; padding: 14px 28px; text-decoration: none; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; display: inline-block; border-radius: 2px;">
                   Reset Your Password
                </a>
              </div>

              <p style="font-size: 12px; line-height: 1.5; color: #777; background-color: #eceae3; padding: 12px; border-left: 3px solid #4e5f41;">
                <strong>Security Notice:</strong> This single-use link will expire in <strong>15 minutes</strong>. If you did not make this request, you can safely disregard this email.
              </p>
            </div>

            <div style="border-top: 1px solid #e5e3dc; padding-top: 20px; text-align: center; font-size: 10px; letter-spacing: 0.1em; color: #888; text-transform: uppercase;">
              © ${new Date().getFullYear()} Copenhagen Design Group. All rights reserved.
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      throw emailError;
    }

    // 8. Send response
    return res.status(200).json({
      success: true,
      message: responseMessage,
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to process password reset request",
    });
  }
};

// RESET PASSWORD CONTROLLER: Verify token & update password
export const resetPassword = async (req, res) => {
  try {
    const token = req.params.token || req.body.token;
    const { password } = req.body || {};

    // 1. Validate inputs
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is missing.",
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    // 2. Hash token to compare with database
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 3. Find user with valid and unexpired token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This password reset link is invalid or has expired.",
      });
    }

    // 4. Hash and save new password
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 5. Invalidate existing active sessions for security
    await Session.deleteMany({ userId: user._id });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while resetting your password. Please try again.",
    });
  }
};
