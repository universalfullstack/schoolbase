import multer from "multer";
import fs from "fs";
import path from "path";
import cloudinary from "../config/cloudinary.js";

/**
 * Multer temp storage for uploading files before sending to Cloudinary
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tmpDir = "tmp/uploads";
    fs.mkdirSync(tmpDir, { recursive: true });
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

// Upload a single file
export const uploadSingle = (fieldName) => multer({ storage }).single(fieldName);

/**
 * Upload multiple named files
 * @param {Array} fields - array of objects [{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]
 */
export const uploadSingleFiles = (fields) => multer({ storage }).fields(fields);

/**
 * Upload file to Cloudinary and remove temp file
 * @param {string} filePath - local temp path
 * @param {string} folder - folder in Cloudinary
 * @param {string} publicId - optional public_id
 * @returns {Promise<string>} - secure_url of uploaded image
 */
export const uploadToCloudinary = async (filePath, folder, publicId = null) => {
  const options = {
    folder,
    public_id: publicId || `${Date.now()}`,
    overwrite: true,
  };
  const result = await cloudinary.uploader.upload(filePath, options);
  fs.unlinkSync(filePath); // remove temp file
  return result.secure_url;
};

/**
 * Delete image from Cloudinary using public_id
 * @param {string} publicId
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn("Cloudinary delete failed:", err.message);
  }
};

/**
 * Extract public_id from a Cloudinary URL
 * @param {string} url
 * @returns {string} public_id
 */
export const extractPublicId = (url) => {
  const parts = url.split("/");
  const lastTwo = parts.slice(-2).join("/"); // folder/file.ext
  return lastTwo.split(".")[0]; // remove extension
};
