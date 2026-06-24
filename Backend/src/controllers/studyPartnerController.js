import StudyPartnerPost from "../models/StudyPartnerPost.js";

export const createStudyPartnerPost = async (
  req,
  res
) => {
  try {
    const post = await StudyPartnerPost.create({
      user: req.user._id,
      title: req.body.title,
      course: req.body.course,
      location: req.body.location,
      availability: req.body.availability,
      description: req.body.description,
    });

    res.status(201).json({
      message: "Study partner post created successfully",
      post,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllStudyPartnerPosts =
  async (req, res) => {
    try {

      const posts =
        await StudyPartnerPost.find()
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

export const closeStudyPartnerPost =
  async (req, res) => {
    try {

      const post =
        await StudyPartnerPost.findById(
          req.params.id
        );

      if (!post) {
        return res.status(404).json({
          message: "Post not found",
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

      post.isClosed = true;

      await post.save();

      res.status(200).json({
        post,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const deleteStudyPartnerPost =
  async (req, res) => {
    try {

      const post =
        await StudyPartnerPost.findById(
          req.params.id
        );

      if (!post) {
        return res.status(404).json({
          message: "Post not found",
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
        message: "Deleted successfully",
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };