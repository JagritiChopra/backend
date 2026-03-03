import Gallery from "../models/Gallery.js";

// ✅ Create Image
export const createImage = async (req, res) => {
  try {
    const { link } = req.body;

    const image = await Gallery.create({ link });

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get All Images
export const getImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update Image
export const updateImage = async (req, res) => {
  try {
    const { link } = req.body;

    const image = await Gallery.findByIdAndUpdate(
      req.params.id,
      { link },
      { new: true }
    );

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json(image);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete Image
export const deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};