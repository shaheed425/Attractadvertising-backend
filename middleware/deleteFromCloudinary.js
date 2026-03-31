import { v2 as cloudinary } from "cloudinary";

/**
 * Utility to delete an image from Cloudinary by its URL or public_id
 * @param {string} urlOrId - The Cloudinary URL or public_id
 */
export const deleteFromCloudinary = async (urlOrId) => {
  if (!urlOrId) return;

  try {
    let publicId = urlOrId;

    // If it's a URL, extract the public_id
    if (urlOrId.includes("res.cloudinary.com")) {
      // Split the URL by '/' and find the 'uploads/' part
      const parts = urlOrId.split("/");
      const uploadIndex = parts.indexOf("uploads");
      
      if (uploadIndex !== -1) {
        // public_id is everything from 'uploads' onwards, minus the extension
        const idWithExtension = parts.slice(uploadIndex).join("/");
        publicId = idWithExtension.split(".")[0];
      } else {
        // Fallback for direct upload or different folder
        const filename = parts[parts.length - 1].split(".")[0];
        publicId = filename;
      }
    }

    console.log("Attempting to delete Cloudinary asset:", publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    // We don't throw here to avoid failing the DB deletion if Cloudinary fails
    return { result: "error", error };
  }
};