import mongoose from "mongoose";

const marketplacePostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Textbook",
        "Electronics",
        "Fashion",
        "Hostel",
        "Service",
        "Other",
      ],
      default: "Other",
    },

    images: [
      {
        type: String,
      },
    ],

    isSold: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MarketplacePost = mongoose.model(
  "MarketplacePost",
  marketplacePostSchema
);

export default MarketplacePost;