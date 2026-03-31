import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

// ================================== 2 ===========================
// Cloudinary Configuration
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || 'dcn70bct8';
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

console.log('Final Cloudinary Config Check - Name:', cloud_name);

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

// Multer-Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // Folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

export const upload = multer({ storage });