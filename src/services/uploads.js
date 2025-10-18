import { v2 as cloudinary } from "cloudinary";
import createError from "http-errors";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  // We'll throw only when used, to not break environments that do not need uploads
}

export function configureCloudinary() {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw createError(500, "Server misconfigured: Cloudinary env vars missing");
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

export async function uploadImage(filePath, folder = "contacts") {
  configureCloudinary();
  const res = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "image",
    overwrite: true,
  });
  return res.secure_url;
}