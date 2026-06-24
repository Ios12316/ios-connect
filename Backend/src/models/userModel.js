import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    school: {
        type: String,
        default: "AAUA"
    },
    faculty: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    entryYear: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    },
    isVerified: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });
userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
})

const User = mongoose.model("User", userSchema);

export default User;