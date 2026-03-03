// seedGalleryData.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import Gallery from "./models/Gallery.js";
import cloudinary from "./config/cloudinary.js";
import dns from "dns" ;
dotenv.config();
dns.setServers(["1.1.1.1" , "0.0.0.0"])
connectDB();

// Fix __dirname (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedGallery = async () => {
  try {
    await Gallery.deleteMany();

    const galleryPath = path.join(__dirname, "assets", "gallery");

    const files = fs.readdirSync(galleryPath);

    for (const file of files) {
      const imagePath = path.join(galleryPath, file);

      const result = await cloudinary.uploader.upload(imagePath, {
        folder: "gallery",
      });

      await Gallery.create({
        link: result.secure_url,
      });

      console.log(`Uploaded: ${file}`);
    }

    console.log("All gallery images uploaded ✅");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedGallery();