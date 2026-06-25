import CommunityPost from "../models/communityPost.js";

export const createCommunityPost = async (req, res) => {
  try {
    const { content, scope } = req.body;
    const allowedScopes = ["general", "faculty", "department"];
    const postScope = allowedScopes.includes(scope) ? scope : "department";

    const post = await CommunityPost.create({
      user: req.user._id,
      content,
      scope: postScope,
      faculty: req.user.faculty,
      department: req.user.department,
      level: req.user.level,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCommunityFeed = async (req, res) => {
  try {
    const { scope } = req.query;

    let filter = {};
    if (scope === "general") {
      filter = { scope: "general" };
    } else if (scope === "faculty") {
      filter = { scope: "faculty", faculty: req.user.faculty };
    } else {
      // Default to department forum (with backward compatibility)
      filter = {
        $or: [
          { scope: "department", department: req.user.department, level: req.user.level },
          { scope: { $exists: false }, department: req.user.department, level: req.user.level }
        ]
      };
    }

    const posts = await CommunityPost.find(filter)
      .populate(
        "user",
        "fullName profilePicture"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCommunityPost = async (req, res) => {
  try {

    const post = await CommunityPost.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (
      post.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};