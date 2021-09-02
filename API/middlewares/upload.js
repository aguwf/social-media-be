/** @format */

import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'thcx',
  api_key: '645636754657628',
  api_secret: '2mORC2ypJEjMy7ctzGNXF91CYvk',
});

const reSizeImage = (id, h, w) => {
  return cloudinary.url(id, {
    height: h,
    width: w,
    crop: 'scale',
    format: 'jpg',
  });
};

const uploadVerify = (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: 'No file was uploaded.' });
    }

    const file = req.files[0];

    if (file.size > 1024 * 1024) {
      removeTmp(file.path);
      return res.status(400).json({ msg: 'File too large. Limit 1 MB.' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const removeTmp = (path) => {
  try {
    fs.unlinkSync(path);
  } catch (error) {
    throw error;
  }
};

const uploadSingle = async (request) => {
  try {
    const uploadedFile = await cloudinary.uploader.upload(request.file.path, {
      folder: request.path,
    });

    removeTmp(request.file.path);

    return {
      name: uploadedFile.original_filename,
      url: uploadedFile.secure_url,
      cloudinary_id: uploadedFile.public_id,
      thumb200: reSizeImage(uploadedFile.public_id, 200, 200),
      thumb500: reSizeImage(uploadedFile.public_id, 500, 500),
      thumb300: reSizeImage(uploadedFile.public_id, 300, 300),
    };
  } catch (error) {
    return error;
  }
};

const uploadMulti = (request) => {
  try {
    if (request.files) {
      const uploadedFiles = request.files.map(async (file) => {
        const uploadedFile = await cloudinary.uploader.upload(file.path, {
          folder: request.folder,
        });

        removeTmp(file.path);

        return {
          name: uploadedFile.original_filename,
          url: uploadedFile.secure_url,
          cloudinary_id: uploadedFile.public_id,
          thumb200: reSizeImage(uploadedFile.public_id, 200, 200),
          thumb500: reSizeImage(uploadedFile.public_id, 500, 500),
          thumb300: reSizeImage(uploadedFile.public_id, 300, 300),
        };
      });

      return uploadedFiles;
    }
  } catch (error) {
    return error;
  }
};

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    return error;
  }
};

export { uploadVerify, uploadSingle, uploadMulti, deleteImage };
