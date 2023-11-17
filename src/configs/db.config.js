import mongoose from 'mongoose'
import { env } from "./environment.js"

export const CONNECT_DB = async () => {
    try {
        const mongoInstant = await mongoose.connect(env.MONGODB_URI)
        if (mongoInstant.connection.readyState === 1) {
            console.log("connected to MongoDB")
        } else {
            console.log("MongoDB don't connect")
        }
    } catch (error) { 
        console.error(error)
        throw new Error(error.message)
    }
}