import User from "../models/User.js";
import Session from "../models/Session.js"; 
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../utils/token.js";



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