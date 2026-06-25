import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    faculty: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      required: true,
    },
    scope: {
      type: String,
      enum: ["general", "faculty", "department"],
      default: "department",
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CommunityPost = mongoose.model(
  "CommunityPost",
  communityPostSchema
);

export default CommunityPost;