import asyncHandler from 'express-async-handler';
import User from "../models/users.js"
import Oder from "../models/order.js"

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select("cart").populate("cart.product","price title images")
    if (!user) throw new Error("user not found")
    if (user.cart.length === 0) throw new Error("no product in cart")

    const products = user.cart.map(elm => ({
        product: elm.product._id,
        title: elm.product.title,
        images: elm.product.images,
        size: elm.size,
        quantity: elm.quantity
    }))
    const total = user.cart.reduce((total, elm) => (elm.product.price * elm.quantity) + total, 0)
    const order = await Oder.create({ products, total, orderBy: _id })
    res.status(200).json({
        success: order ? true : false,
        order: order ? order : "can't create order",
    })
})
const deleteOrder = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const order = await Oder.findByIdAndDelete(oid)
    res.status(200).json({
        success: order ? true : false,
        orderDel: order ? order : "can't delete order"
    })
})

const getOrder = asyncHandler(async (req, res) => {
    const {_id} = req.user
    const order = await order.findOne({ orderBy: _id })
    res.status(200).json({
        success: order ? true : false,
        order: order ? order : "can't get order"
    })
})
const getOrders = asyncHandler(async (req, res) => {
    const orders = await order.find()
    res.status(200).json({
        success: orders ? true : false,
        orders: orders ? orders : "can't get orders"
    })
})
const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params
    if (!req.body.status) throw new Error("missing input")
    const order = await order.findByIdAndUpdate(oid,req.body)
    res.status(200).json({
        success: order ? true : false,
        order: order ? order : "update status error"
    })
})

export {
    createOrder,
    deleteOrder,
    getOrders,
    getOrder,
    updateStatus
}