import jwt from "jsonwebtoken"
import {env} from "../configs/environment.js"
const generateAccessToken = (uid, role) => jwt.sign({ _id: uid, role }, env.SECRET_KEY, { expiresIn: "1d" })
const generateRefreshToken = (uid) => jwt.sign({ _id: uid }, env.SECRET_KEY, { expiresIn: '7d' })

export {
    generateAccessToken,
    generateRefreshToken
}