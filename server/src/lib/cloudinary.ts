import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import { getFileHash } from "../utils/getFileHash.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: string): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) return null;
    console.log('Uploading file to Cloudinary:', localFilePath);

    const fileHash = getFileHash(localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      asset_folder: 'Vaultify',
      resource_type: "auto",
      public_id: fileHash,
      overwrite: false,
      unique_filename: false,
    });

    fs.unlinkSync(localFilePath);
    
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error('Cloudinary upload error ::', error);
    return null;
  }
};

export const removeFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<void> => {
  try {
    console.log(publicId, resourceType);
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    console.log("Delete file response ::", response); // TODO: remove this
  } catch (error) {
    console.error('Cloudinary remove error:', error); 
  }
};