import jwt from "jsonwebtoken"
import {env} from "../configs/environment.js"
const verifyToken = (req, res, next) => {
    if (req?.headers?.authorization?.startsWith('Bearer ')) {

        const accessToken = req?.headers?.authorization.split(' ')[1]
        jwt.verify(accessToken, env.SECRET_KEY, (err, decode) => {
            if (err) {
                res.status(401).json({
                    success: false,
                    message: 'invalid access token'
                })
            }
            req.user = decode
            next()
        })
    } else {
        res.status(401).json({
            success: false,
            message: 'require access token'
        })
    }
}

const isAdmin = (req, res, next) => { 
    if (req?.user?.role != 'Admin') throw new Error("You must be Admin")
    next()
}
export {
    verifyToken,
    isAdmin,
}