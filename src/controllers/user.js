import asyncHandler from 'express-async-handler'
import User from '../models/users.js'
import { generateAccessToken, generateRefreshToken } from "../middlewares/jwt.js"
import generateSendEmail from "../utils/sendMail.js" 
import cloudinary from "cloudinary"
import crypto from "crypto";
import makeTOken from "uniq-id"
import { env } from '../configs/environment.js'
import Product from '../models/product.js'

const register = asyncHandler(async (req, res) => {
    const { email, mobile, password, name } = req.body

    // check body input
    if (!email && !password && !name && !mobile) throw new Error("missing input")

    // find user
    const checkEmail = await User.findOne({ email })
    if (checkEmail) throw new Error("email đã được đăng kí.")
    const checkMobile = await User.findOne({ mobile })
    if (checkMobile) throw new Error("Số điện thoại đã được đăng kí.")

    // make token
    const token = makeTOken()

    // create new user
    const expiresIn = Date.now() + 5 * 60 * 1000
    req.body.email = `${email}~${token}~${expiresIn}`
    req.body.mobile = `${mobile}~${token}`
    const newUser = await User.create(req.body)

    // send email
    const html = `
        <div>
            <img src="https://sneaker-store-eight.vercel.app/assets/cropped-logo-roll-sneaker-482951d6.png">
            <p style="font-size:16px">Mã xác nhận đăng khí tài khoản của bạn là:</p>
            <div style="font-size:18px"><b><i>${token}</i></b></div>
        </div>
    `
    await generateSendEmail(html, email)

    // delete email when false
    setTimeout(async() => {
        await User.findOneAndDelete({email:newUser.email})
    }, 5 * 60 * 1000)
    
    res.status(200).json({
        success: true,
        message: "Kiểm tra email của bạn để lấy mã xác nhận."
    })
})

const finalRegister = asyncHandler(async (req, res) => { 
    const { token } = req.body
    const user = await User.findOne({ email: new RegExp(`${token}`, 'g') })
    const expiresIn = user?.email?.split("~")[2]
    if (!user || +expiresIn < Date.now()) {
        res.status(200).json({
            success: false,
            message: "Mã xác nhận không đúng."
        })
    }

    const email = user.email.split("~")[0]
    const mobile = user.mobile.split("~")[0]

    // check lại user
    const checkUser = await User.findOne({ email: email, mobile: mobile })
    if (checkUser) throw new Error("Email hoặc số điện thoại cảu bạn đã được đăng kí.")

    user.email = email
    user.mobile = mobile
    await user.save()

    res.status(200).json({
        success: true,
        message: "Tài khoản của bạn đã đăng kí thành công."
    })
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) throw new Error("missing input")
    const user = await User.findOne({ email })
    
    // validate email and password
    if (!user) throw new Error("Không tìm thấy tài khoản của bạn.")
    if (!await user.isCorrectPassword(password)) throw new Error("Mật khẩu của bạn không đúng.")

    // create access token and refresh token
    const accessToken = generateAccessToken(user._id.toString(), user.role)
    const refreshToken = generateRefreshToken(user._id.toString())

    // update access token in res
    const userUpdate = await User.findByIdAndUpdate(user._id,{accessToken,refreshToken},{new: true}).select("-password -createdAt -updatedAt -refreshToken")

    // add refresh in cookie
    // res.cookie("refreshToken",refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true,secure: true})


    res.status(200).json({
        success: userUpdate ? true : false,
        user: userUpdate ? userUpdate : "somethings went wrong",
        refreshToken
    })
})

const logout = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const cookie = req.cookies["refreshToken"]

    // check refresh token in cookie
    if (!cookie) throw new Error("no refresh token in cookie")

    await User.findByIdAndUpdate(_id, { refreshToken: ""}, { new: true })
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

const getUser = asyncHandler(async (req, res) => { 
    const {uid} = req.params
    const user = await User.findById(uid).select("-password -refreshToken")
    res.status(200).json({
        success: user ? true : false,
        user: user ? user : "somethings went wrong"
    })
})

const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies['refreshToken']

    if (!refreshToken) throw new Error("Có lỗi đã xảy ra")
    // check user
    const user = await User.findOne({refreshToken})
    if (!user) throw new Error("Không tìm thấy tài khoản.")

    // create access token and refresh token
    const newAccessToken = generateAccessToken(user._id.toString(), user.role)
    const newRefreshToken = generateRefreshToken(user._id.toString())
    user.accessToken = newAccessToken
    user.refreshToken = newRefreshToken
    await user.save()

    // res.clearCookie("refreshToken", { httpOnly: true, secure: true })
    // res.cookie("refreshToken", newRefreshToken,{httpOnly: true, maxAge: Date.now() + 7 * 24 * 60 * 60 * 1000,secure: true })

    res.status(200).json({
        success: true,
        refreshToken: newRefreshToken,
        accessToken: newAccessToken,
        refreshTokenPrevious:refreshToken
    })
})

const updateUser = asyncHandler(async (req, res) => { 
    const { _id } = req.user
    const userUpdate = await User.findByIdAndUpdate(_id, req.body, { new: true }).select("-password -refreshToken")
    res.status(200).json({
        success: userUpdate ? true : false,
        user: userUpdate ? userUpdate : "somethings went wrong"
    })
})

const forgotPassword = asyncHandler(async (req, res) => { 
    const { email } = req.body
    const user = await User.findOne({email})
    if (!user) throw new Error("Không tìm thấy tài khoản.")

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
                <a href="${env.CLIENT_URL}/forgotPassword/${passwordResetToken}" style="display:inline-block ;padding:12px 20px; background-color: #f14343; font-size: 18px; text-decoration: none; color: white">Reset password</a>
            </div>
        </div>
    `

    // generate email send 
    await generateSendEmail(html, user.email)

    res.status(200).json({
        success: true,
        message: "Hãy kiểm tra email của bạn."
    })
})

const changePassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body

    const passwordResetToken = await crypto.createHash('sha256').update(token).digest("hex")
    // check code change password
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gte: Date.now() } })
    if (!user) throw new Error("Bạn đã hết thời gian đặt lại mật khẩu.")

    // check password already exists
    if (await user.isCorrectPassword(password)) throw new Error("Mật khẩu của bạn không được trùng với mật khẩu cũ.")

    // update password
    user.password = password
    user.passwordResetExpires = ""
    user.passwordResetToken = ""
    user.passwordChangeAt = Date.now()
    await user.save()

    res.status(200).json({
        success: true,
        message: "Thay đổi mật khẩu thành công."
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
    
    // check quantity product with size
    const {sizes} = await Product.findById(req.body.product)
    if (!sizes) throw new Error("product not found")
    for (let i = 0; i < sizes.length; i++) {
        if (sizes[i].size == req.body.size) {
            if(sizes[i].quantity < req.body.quantity) throw new Error(`Số lượng giày với size ${sizes[i].size} không đủ, bạn hãy giảm bớt số lượng xuống.`)
        }
    }

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
    const { pid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error("missing input")

    // check quantity product with size
    const {sizes} = await Product.findById(req.body.product)
    if (!sizes) throw new Error("product not found")
    for (let i = 0; i < sizes.length; i++) {
        if (sizes[i].size == req.body.size) {
            if(sizes[i].quantity < req.body.quantity) throw new Error(`Số lượng giày với size ${sizes[i].size} không đủ, bạn hãy giảm bớt số lượng xuống.`)
        }
    }

    const user = await User.findById(_id).select("cart")
    const alreadyProduct = user.cart.find(elm => elm._id.toString() === pid)

    if (alreadyProduct) {
        // update product in card
        const newCart = user.cart.map(elm => {
            if (elm._id.toString() === pid) {
                return {id:elm._id,product:elm.product,size:req.body.size,quantity:req.body.quantity}
            }
            return {id:elm._id,product:elm.product,size:elm.size,quantity:elm.quantity}
        })
        const userUpdate = await User.findByIdAndUpdate(_id, { cart: newCart }, { new: true })
        
        // await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, { $set: { "cart.$.size": req.body.size, "cart.$.quantity": req.body.quantity } },{new: true})
        res.status(200).json({
            success: userUpdate ? true : false,
            userUpdate: userUpdate ? userUpdate : "something went wrong"
        })
    } else {
        res.status(200).json({
            success: false,
            userUpdate: "product no existed in cart"
        })
    }
})

const getProductToCart = asyncHandler(async (req, res) => { 
    const { _id } = req.user
    const { cid } = req.params
    const user = await User.findById(_id).select("cart").populate("cart.product")
    const product = await user?.cart?.find(elm => elm._id == cid) 
    if (!product) throw new Error("Product not found")
    res.status(200).json({
        success: true,
        product : product 
    })
})

const deleteProductCart = asyncHandler(async (req, res) => {
    const { cid } = req.params
    const { _id } = req.user
    const user = await User.findByIdAndUpdate(_id, { $pull: { cart: { _id: cid } } }, { new: true })

    res.status(200).json({
        success: user ? true : false,
        message: user ? "delete product cart successfully" : "something went wrong"
    })

    
})

const getCart = asyncHandler(async (req, res) => { 
    const { _id } = req.user
    const cart = await User.findById(_id).select("cart").populate("cart.product","title price images slug brand")
    res.status(200).json({
        success: cart ? true : false,
        cart: cart ? cart : "something went wrong"
    })
})
const getCartUser = asyncHandler(async (req, res) => { 
    const {uid} = req.params
    const cart = await User.findById(uid).select("cart").populate("cart.product","title price images slug brand")
    res.status(200).json({
        success: cart ? true : false,
        cart: cart ? cart : "something went wrong"
    })
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
    const { filename: filenameRemove } = req.body
    if (filenameRemove) {
        cloudinary.v2.api.delete_resources(filenameRemove)
    }

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
    updateAvatar,
    finalRegister,
    refreshToken,
    getCart,
    deleteProductCart,
    getProductToCart,
    getUser,
    getCartUser
}