import RoommatePost from "../models/RoommatePost.js";

export const createRoommatePost = async (req, res) => {
  try {
    const {
      gender,
      preferredGender,
      location,
      budget,
      description,
    } = req.body;

    const roommatePost = await RoommatePost.create({
      user: req.user._id,
      gender,
      preferredGender,
      location,
      budget,
      description,
    });

    res.status(201).json({
      message: "Roommate request created successfully",
      roommatePost,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllRoommatePosts = async (req, res) => {
  try {
    const posts = await RoommatePost.find()
      .populate(
        "user",
        "fullName profilePicture faculty department"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: posts.length,
      posts,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const markRoommateFound = async (req, res) => {
  try {
    const post = await RoommatePost.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        message: "Roommate post not found",
      });
    }

    if (
      post.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    post.isFilled = true;

    await post.save();

    res.status(200).json({
      message: "Roommate found successfully",
      post,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteRoommatePost = async (req, res) => {
  try {
    const post = await RoommatePost.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        message: "Roommate post not found",
      });
    }

    if (
      post.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      message: "Roommate post deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};