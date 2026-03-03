import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import Service from "./models/Service.js";
import cloudinary from "./config/cloudinary.js";
import services from "./data/serviceData.js";
import dns from "dns"; 
dotenv.config();

dns.setServers(["1.1.1.1" , "0.0.0.0"])
const seedServices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected");

    await Service.deleteMany();
    console.log("🗑️ Old services deleted");

    // ✅ Files ko numerically sort karo (1.jpg, 2.jpg... order mein aayein)
    const allFiles = fs.readdirSync("assets/gallery");
    const files = allFiles
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))  // sirf images lo
      .sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        return numA - numB;
      })
      .slice(0, services.length); // ✅ sirf 15 lo (services jitni)

    console.log(`📸 ${files.length} images milein, ${services.length} services hain`);

    if (files.length < services.length) {
      console.warn(`⚠️ Warning: Sirf ${files.length} images hain, ${services.length} services ke liye`);
    }

    const uploadedServices = [];

    for (let i = 0; i < services.length; i++) {
      if (files[i]) {
        // Image wali services — Cloudinary pe upload karo
        const imagePath = path.join("assets", "gallery", files[i]);
        const result = await cloudinary.uploader.upload(imagePath, {
          folder: "services",
        });

        uploadedServices.push({
          ...services[i],
          imageUrl: result.secure_url,  // ✅ real Cloudinary URL
        });

        console.log(`✅ [${i + 1}/${services.length}] "${services[i].title}" → ${files[i]} uploaded`);
      } else {
        // Agar image nahi hai toh placeholder laga do
        uploadedServices.push({
          ...services[i],
          imageUrl: "https://placehold.co/400x300?text=" + encodeURIComponent(services[i].title),
        });

        console.log(`⚠️ [${i + 1}/${services.length}] "${services[i].title}" → No image, placeholder used`);
      }
    }

    await Service.insertMany(uploadedServices);
    console.log("🎉 All Services Seeded Successfully!");
    process.exit();

  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedServices();