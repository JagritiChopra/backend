import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer" ;
import crypto from "crypto"; 


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Random token generate karo
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token aur expiry save karo (1 ghante ke liye valid)
    admin.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    admin.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await admin.save();

    // Reset link banao
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email bhejo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Kings Pet Hospital" <${process.env.EMAIL_USER}>`,
      to: admin.email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>Aapne password reset request ki hai.</p>
        <p>Is link pe click karo (1 ghante mein expire hoga):</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Agar aapne request nahi ki toh ignore karo.</p>
      `,
    });

    res.json({ message: "Reset email sent successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Token hash karo aur match karo
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // abhi bhi valid hai?
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Naya password save karo
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    // Token clear karo
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();

    res.json({ message: "Password reset successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
export const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

 
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

 
    const newAdmin = await Admin.create({
      fullName,
      email,
      password: hashedPassword,
    });

  
    const token = jwt.sign(
      { id: newAdmin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Admin registered successfully",
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};