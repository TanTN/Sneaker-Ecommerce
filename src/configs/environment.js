import "dotenv/config"

export const env = {
    MONGODB_URI: process.env.MONGODB_URI,
    APP_PORT: process.env.APP_PORT,
    APP_HOST: process.env.APP_HOST,
    SECRET_KEY: process.env.SECRET_KEY,
    EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD,
    EMAIL_NAME: process.env.EMAIL_NAME,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_KEY:process.env.CLOUDINARY_KEY,
    CLOUDINARY_SECRET:process.env.CLOUDINARY_SECRET,
}