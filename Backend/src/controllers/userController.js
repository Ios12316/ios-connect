import User from "../models/userModel.js";
import { userValidation, loginValidation } from "../validation/userValidation.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import cloudinary from "../utils/cloudinary.js";


export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, school, faculty, department, level, gender, entryYear, profilePicture } = req.body;
        const { error } = userValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const userExists = await User.findOne({ email: email.toLowerCase().trim() });
        if (userExists) {
            return res.status(400).json({ message: "Email is already registered" });
        }
        const phoneExists = await User.findOne({ phoneNumber: phoneNumber.trim() });
        if (phoneExists) {
            return res.status(400).json({ message: "Phone number is already registered" });
        }

        let profilePictureUrl = "";
        if (profilePicture && profilePicture.startsWith("data:image/")) {
            try {
                const uploadRes = await cloudinary.uploader.upload(profilePicture, {
                    folder: "iosconnect/profiles",
                    resource_type: "image"
                });
                profilePictureUrl = uploadRes.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({ message: "Failed to upload profile picture" });
            }
        } else if (profilePicture) {
            profilePictureUrl = profilePicture;
        }

        // Generate verification token
        const verToken = crypto.randomBytes(20).toString("hex");
        const hashedVerificationToken = crypto.createHash("sha256").update(verToken).digest("hex");

        const user = await User.create({ 
            fullName, 
            email: email.toLowerCase().trim(), 
            password, 
            phoneNumber: phoneNumber.trim(), 
            school, 
            faculty, 
            department, 
            level, 
            gender, 
            entryYear,
            profilePicture: profilePictureUrl,
            isVerified: false,
            verificationToken: hashedVerificationToken
        });

        // Create verification url
        const frontendUrl = process.env.NODE_ENV === 'production' 
            ? 'https://iosconnect.vercel.app' 
            : 'http://localhost:5173';
        const verifyUrl = `${frontendUrl}/verify-email/${verToken}`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
                <h2 style="color: #6366f1; text-align: center;">IOS CONNECT EMAIL VERIFICATION</h2>
                <p>Hello ${user.fullName},</p>
                <p>Welcome to IOS CONNECT! To complete your registration and activate your account, please click the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyUrl}" style="background-color: #6366f1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
                </div>
                <p style="word-break: break-all; color: #94a3b8; font-size: 12px;">${verifyUrl}</p>
                <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
                <p style="font-size: 11px; color: #64748b;">If you did not sign up for this account, please ignore this email.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Verify Your Email Address - IOS CONNECT",
                html
            });

            res.status(201).json({
                message: "Registration successful! Please check your email to verify your account."
            });
        } catch (emailError) {
            console.error("Email verification send error:", emailError);
            // Delete user if email fails to send, so they can retry registering
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({ message: "Could not send verification email. Please check your email address and try again." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { error } = loginValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(401).json({ 
                message: "Your email address is not verified. Please check your inbox for the verification link.", 
                unverified: true 
            });
        }

        const token = generateToken(user._id);
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                faculty: user.faculty,
                department: user.department,
                level: user.level,
                gender: user.gender,
                entryYear: user.entryYear,
                role: user.role,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullName, faculty, department, level, gender, entryYear, bio, profilePicture } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let profilePictureUrl = user.profilePicture;
        if (profilePicture && profilePicture.startsWith("data:image/")) {
            try {
                const uploadRes = await cloudinary.uploader.upload(profilePicture, {
                    folder: "iosconnect/profiles",
                    resource_type: "image"
                });
                profilePictureUrl = uploadRes.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({ message: "Failed to upload profile picture" });
            }
        } else if (profilePicture !== undefined) {
            profilePictureUrl = profilePicture;
        }

        user.fullName = fullName || user.fullName;
        user.faculty = faculty || user.faculty;
        user.department = department || user.department;
        user.level = level || user.level;
        user.gender = gender || user.gender;
        user.entryYear = entryYear || user.entryYear;
        user.bio = bio || user.bio;
        user.profilePicture = profilePictureUrl;

        const updatedUser = await user.save();
        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Please provide an email address" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No user found with that email" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        // Set expire time (1 hour)
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        // Create reset url
        const frontendUrl = process.env.NODE_ENV === 'production' 
            ? 'https://iosconnect.vercel.app' 
            : 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
                <h2 style="color: #6366f1; text-align: center;">IOS CONNECT PASSWORD RESET</h2>
                <p>Hello ${user.fullName},</p>
                <p>You are receiving this email because you (or someone else) requested a password reset for your account on IOS CONNECT.</p>
                <p>Please click the button below or copy and paste the URL into your browser to complete the process within the next hour:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #6366f1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
                </div>
                <p style="word-break: break-all; color: #94a3b8; font-size: 12px;">${resetUrl}</p>
                <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
                <p style="font-size: 11px; color: #64748b;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Request - IOS CONNECT",
                html
            });

            res.status(200).json({ message: "Reset link sent to your email!" });
        } catch (error) {
            console.error("Email send error:", error);
            user.resetPasswordToken = "";
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });

            res.status(500).json({ message: "Email could not be sent" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Please provide a new password" });
        }

        // Get hashed token
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired password reset token" });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = "";
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Hash token to compare with DB
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({ verificationToken: hashedToken });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired email verification link" });
        }

        user.isVerified = true;
        user.verificationToken = "";
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ message: "Email address successfully verified!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Please provide your email address" });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ message: "No user found with that email address" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "This account is already verified. Please sign in." });
        }

        // Generate new verification token
        const verToken = crypto.randomBytes(20).toString("hex");
        user.verificationToken = crypto.createHash("sha256").update(verToken).digest("hex");
        await user.save({ validateBeforeSave: false });

        // Send new verification email
        const frontendUrl = process.env.NODE_ENV === 'production' 
            ? 'https://iosconnect.vercel.app' 
            : 'http://localhost:5173';
        const verifyUrl = `${frontendUrl}/verify-email/${verToken}`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
                <h2 style="color: #6366f1; text-align: center;">IOS CONNECT EMAIL VERIFICATION</h2>
                <p>Hello ${user.fullName},</p>
                <p>You requested a new verification link. To verify your email address and activate your account, please click the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyUrl}" style="background-color: #6366f1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
                </div>
                <p style="word-break: break-all; color: #94a3b8; font-size: 12px;">${verifyUrl}</p>
                <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
                <p style="font-size: 11px; color: #64748b;">If you did not make this request, please ignore this email.</p>
            </div>
        `;

        await sendEmail({
            email: user.email,
            subject: "Verify Your Email Address - IOS CONNECT",
            html
        });

        res.status(200).json({ message: "A new verification link has been sent to your email!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


