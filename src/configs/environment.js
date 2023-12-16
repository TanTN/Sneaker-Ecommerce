import "dotenv/config"

export const env = {
    MONGODB_URI: process.env.VERCEL_MONGODB_URI,
    APP_PORT: process.env.VERCEL_APP_PORT || 8000,
    APP_HOST: process.env.VERCEL_APP_HOST || 'localhost',
    SECRET_KEY: process.env.VERCEL_SECRET_KEY,
    EMAIL_APP_PASSWORD: process.env.VERCEL_EMAIL_APP_PASSWORD,
    EMAIL_NAME: process.env.VERCEL_EMAIL_NAME,
    CLOUDINARY_NAME: process.env.VERCEL_CLOUDINARY_NAME,
    CLOUDINARY_KEY:process.env.VERCEL_CLOUDINARY_KEY,
    CLOUDINARY_SECRET: process.env.VERCEL_CLOUDINARY_SECRET,
    CLIENT_URL: process.env.VERCEL_CLIENT_URL || "http://localhost:3000",
    PAGE_LIMIT: process.env.VERCEL_PAGE_LIMIT,
}