import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        post:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "CommunityPost",
            required: true,
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content:{
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },
    },
    {
        timestamps: true,
    }
)

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;