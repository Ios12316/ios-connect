import mongoose from "mongoose";

const roommatePostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },

    preferredGender: {
      type: String,
      enum: ["Male", "Female", "Any"],
      default: "Any",
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    budget: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    isFilled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const RoommatePost = mongoose.model(
  "RoommatePost",
  roommatePostSchema
);

export default RoommatePost;