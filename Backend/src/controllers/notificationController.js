import Notification from "../models/Notification.js";

export const getNotifications = async (
  req,
  res
) => {
  try {

    const notifications =
      await Notification.find({
        recipient: req.user._id,
      })
        .populate(
          "sender",
          "fullName profilePicture"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      count: notifications.length,
      notifications,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const markNotificationAsRead =
  async (req, res) => {
    try {

      const notification =
        await Notification.findById(
          req.params.id
        );

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      notification.isRead = true;

      await notification.save();

      res.status(200).json({
        notification,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };