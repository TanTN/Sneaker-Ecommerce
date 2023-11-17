import asyncHandler from 'express-async-handler'
import User from '../models/users.js'
import Products from '../models/product.js'
import { generateAccessToken, generateRefreshToken } from "../middlewares/jwt.js"
import generateSendEmail from "../utils/sendMail.js" 
import cloudinary from "cloudinary"
import crypto from "crypto";

const register = asyncHandler(async (req, res) => {
    const { email, mobile, password, name } = req.body

    // check body input
    if (!email && !password && !name && !mobile) throw new Error("missing input")  

    // find user
    const userRegistered = await User.findOne({ email })
    if (userRegistered) throw new Error("email already registered")

    // create new user
    const newUser = await User.create(req.body)
    
    // create access and refresh token
    const accessToken = generateAccessToken(newUser._id.toString(), newUser.rule)
    const refreshToken = generateRefreshToken(newUser._id.toString())

    // update access and refresh token
    const userUpdate = await User.findByIdAndUpdate(newUser._id,{accessToken, refreshToken}, {new: true}).select("-password -refreshToken")
    
    res.cookie("refreshToken", refreshToken,{maxAge:7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true})
    res.status(200).json({
        success: userUpdate ? true : false,
        user: userUpdate ? userUpdate : "somethings went wrong"
    })
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) throw new Error("missing input")
    const user = await User.findOne({ email })
    
    // validate email and password
    if (!user) throw new Error("user not found")
    if (!await user.isCorrectPassword(password)) throw new Error("somethings went wrong")

    // create access token and refresh token
    const accessToken = generateAccessToken(user._id.toString(), user.role)
    const refreshToken = generateRefreshToken(user._id.toString())

    // update access token in res
    const userUpdate = await User.findByIdAndUpdate(user._id,{accessToken,refreshToken},{new: true}).select("-password -createdAt -updatedAt -refreshToken")

    // add refresh in cookie
    res.cookie("refreshToken", refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true })
    
    res.status(200).json({
        success: userUpdate ? true : false,
        user: userUpdate ? userUpdate : "somethings went wrong"
    })
})

const logout = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const cookie = req.cookies["refreshToken"]

    // check refresh token in cookie
    if (!cookie) throw new Error("no refresh token in cookie")

    await User.findByIdAndUpdate(_id, { refreshToken: "", accessToken: "" }, { new: true })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    })

    res.status(200).json({
        success: true,
        message: "logout successfully" 
    })
})

const getUserCurrent = asyncHandler(async (req, res) => { 
    const { _id } = req.user
    const user = await User.findById(_id).select("-password -createdAt -updatedAt -refreshToken")
    res.status(200).json({
        success: user ? true : false,
        user: user ? user : "somethings went wrong"
    })
})
const getUsers = asyncHandler(async (req, res) => { 
    const user = await User.find().select("-password -refreshToken")
    res.status(200).json({
        success: user ? true : false,
        users: user ? user : "somethings went wrong"
    })
})

const updateUser = asyncHandler(async (req, res) => { 
    const { _id } = req.user
    const userUpdate = await User.findByIdAndUpdate(_id, req.body, { new: true }).select("-password -refreshToken")
    res.status(200).json({
        success: userUpdate ? true : false,
        user: userUpdate ? a : "somethings went wrong"
    })
})
const forgotPassword = asyncHandler(async (req, res) => { 
    const { email } = req.body
    const user = await User.findOne({email})
    if (!user) throw new Error("user not found")

    // create password reset token
    const passwordResetToken = await user.generatePasswordResetToken()
    await user.save()
    const html = `
        <div>
            <img src="https://sneaker-store-eight.vercel.app/assets/cropped-logo-roll-sneaker-482951d6.png">
            <p style="font-size:16px">
                Nhấn vào nút dưới đây để thay đổi mật khẩu, có thời gian hiệu lực là 5 phút.
            </p>
            <div>
                <a href="http://localhost:6000/${passwordResetToken}" style="display:inline-block ;padding:12px 20px; background-color: #f14343; font-size: 18px; text-decoration: none; color: white">Reset password</a>
            </div>
        </div>
    `

    // generate email send 
    const isSendEmail = generateSendEmail(html, user.email)

    res.status(200).json({
        success: isSendEmail ? true : false,
        message: isSendEmail ? "send code success" : "send code error"
    })
})

const changePassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    const passwordResetToken = await crypto.createHash('sha256').update(token).digest("hex")
    
    // check code change password
    const user = await User.findOne({ passwordResetToken ,passwordChangeAt:{$gte: Date.now()}}).select("-password -refreshToken")
    if (!user) throw new Error("something went wrong")

    // update password
    user.password = password
    user.passwordResetExpires = ""
    user.passwordResetToken = ""
    user.passwordChangeAt = Date.now()
    await user.save()

    res.status(200).json({
        success: true,
        user: "changed password"
    })

})
const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params

    const userCurrent = await User.findById(uid)
    if (!userCurrent) throw new Error("user not found")

    // delete user
    const user = await User.findByIdAndDelete(uid)

    // delete image
    if (userCurrent?.avatar?.filename) {
        cloudinary.v2.uploader.destroy(userCurrent?.avatar?.filename)
    } 

    res.status(200).json({
        success: user ? true : false,
        mes: user ? `account ${userCurrent?.name} successfully deleted` : `account ${userCurrent?.name} false deleted`
    })
})

const updateUserByAdmin = asyncHandler(async (req, res) => { 
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error("missing input")
    const user = await User.findByIdAndUpdate(uid, req.body, { new: true }).select("-password -refreshToken")
    res.status(200).json({
        success: user ? true : false,
        user: user ? user : "something went wrong"
    })
})
const addProductCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (Object.keys(req.body).length === 0) throw new Error("missing input")
    const user = await User.findById(_id).select("cart").populate("cart.product", "title")
    const alreadyProduct = user.cart.find(prd => prd.product._id.toString() === req.body.product && prd.size === +req.body.size)
    
    if (alreadyProduct) {
        //when product already exists with size equal
        res.status(200).json({
            success: false,
            message: `Bạn không thể thêm "${alreadyProduct.product.title} - ${req.body.size}" khác vào giỏ hàng của bạn.`
        })
    } else {
        // add product in card 
        const userUpdate = await User.findByIdAndUpdate(_id, { $push: {cart: req.body} }, { new: true }).select("-password -refreshToken")
        res.status(200).json({
        success: user ? true : false,
        userUpdate: userUpdate ? userUpdate : "something went wrong",
    })
    }
    
})
const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (Object.keys(req.body).length === 0) throw new Error("missing input")

    const user = await User.findById(_id).select("cart")
    const alreadyProduct = user.cart.find(elm => elm.product.toString() === req.body.product)

    if (alreadyProduct) {
        // update product in card
        const userUpdate = await User.updateOne({cart:{$elemMatch:alreadyProduct}},{$set:{"cart.$.size":req.body.size,"cart.$.quantity":req.body.quantity}}, { new: true })
        res.status(200).json({
            success: user ? true : false,
            userUpdate: userUpdate ? "update cart successfully" : "something went wrong"
        })
    } else {
        res.status(200).json({
            success: false,
            userUpdate: "product no existed in cart"
        })
    }
})

const updateAddress = asyncHandler(async (req, res) => { 
    const { _id } = req.user
    if (Object.keys(req.body).length === 0) throw new Error("missing input")
    const user = await User.findByIdAndUpdate(_id, { address: req.body }, { new: true }).select("-password -refreshToken")
    res.status(200).json({
        success: user ? true : false,
        userUpdate: user ? user : "something went wrong"
    })
})

const updateAvatar = asyncHandler(async (req, res) => { 
    const { _id } = req.user
    const { path, filename } = req.file
    if (!req.file) throw new Error("no image avatar")
    const avatar = { path, filename }
    const user = await User.findByIdAndUpdate(_id, {avatar},{new: true}).select("-password -refreshToken")
    res.status(200).json({
        success: user ? true : false,
        user: user ? user : "update avatar false",
    })
})
export {
    register,
    login,
    getUserCurrent,
    getUsers,
    logout,
    updateUser,
    forgotPassword,
    changePassword,
    deleteUser,
    updateUserByAdmin,
    updateCart,
    updateAddress,
    addProductCart,
    updateAvatar
}