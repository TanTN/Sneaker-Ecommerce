import cloudinary from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from 'multer';
import {env} from "./environment.js"

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_KEY,
  api_secret: env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary:cloudinary.v2,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: "Sneaker-Ecommerce"
  }
});

const uploadCloud = multer({ storage });

export default uploadCloud;