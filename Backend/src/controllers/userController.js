import User from "../models/userModel.js";
import { userValidation, loginValidation } from "../validation/userValidation.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";


export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, school, faculty, department, level, gender, entryYear } = req.body;
        const { error } = userValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ fullName, email, password, school, faculty, department, level, gender, entryYear });
        const token = generateToken(user._id);
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 24 * 60 * 60 * 1000 });
        res.status(201).json({ message: "User registered successfully", user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email
        } });
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
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = generateToken(user._id);
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ message: "User logged in successfully", user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            faculty: user.faculty,
            department: user.department,
            level: user.level,
            gender: user.gender,
            entryYear: user.entryYear,
            role: user.role,
        } });
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

        user.fullName = fullName || user.fullName;
        user.faculty = faculty || user.faculty;
        user.department = department || user.department;
        user.level = level || user.level;
        user.gender = gender || user.gender;
        user.entryYear = entryYear || user.entryYear;
        user.bio = bio || user.bio;
        user.profilePicture = profilePicture || user.profilePicture;
        
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


