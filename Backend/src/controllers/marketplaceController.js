import MarketplacePost from "../models/MarketplacePost.js";



export const createListing = async (req, res) => {
  try {

    const listing = await MarketplacePost.create({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      images: req.body.images || [],
    });

    res.status(201).json({
      listing,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllListings = async (req, res) => {
  try {

    const listings = await MarketplacePost.find()
      .populate(
        "user",
        "fullName profilePicture"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: listings.length,
      listings,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSingleListing = async (req, res) => {
  try {

    const listing = await MarketplacePost.findById(
      req.params.id
    ).populate(
      "user",
      "fullName profilePicture"
    );

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    res.status(200).json({
      listing,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteListing = async (req, res) => {
  try {

    const listing =
      await MarketplacePost.findById(
        req.params.id
      );

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    if (
      listing.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      message: "Listing deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};