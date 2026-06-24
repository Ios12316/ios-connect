import User from "../models/userModel.js";

export const getCommunityMembers = async (req, res) => {
  try {

    const students = await User.find({
      faculty: req.user.faculty,
      department: req.user.department,
      _id: { $ne: req.user._id },
    })
      .select(
        "fullName profilePicture faculty department level entryYear"
      )
      .sort({ fullName: 1 });

    res.status(200).json({
      count: students.length,
      students,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};