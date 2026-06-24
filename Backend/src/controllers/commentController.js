import Comment from "../models/commentModel.js";
import CommunityPost from "../models/communityPost.js";
import Notification from "../models/Notification.js";


export const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      post: postId,
      user: req.user._id,
      content,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });

    if (
      post.user.toString() !==
      req.user._id.toString()
    ) {
      await Notification.create({
        recipient: post.user,
        sender: req.user._id,
        type: "comment",
        message:
          "commented on your post",
      });
    }

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPostComments = async (req, res) => {
  try {

    const comments = await Comment.find({
      post: req.params.postId,
    })
      .populate(
        "user",
        "fullName profilePicture"
      )
      .sort({ createdAt: 1 });

    res.status(200).json({
      count: comments.length,
      comments,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {

    const comment = await Comment.findById(
      req.params.id
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (
      comment.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      message: "Comment deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

