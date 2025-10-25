const cloudinary = require("../../config/cloudinary");

const uploadImage = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "obras",
  });
  return result.secure_url;
};

module.exports = { uploadImage };
