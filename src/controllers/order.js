import asyncHandler from 'express-async-handler';
import User from "../models/users.js"
import Oder from "../models/order.js"
import Product from '../models/product.js';

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
        quantity: elm.quantity,
        price: elm.product.price
    }))
    const total = user.cart.reduce((total, elm) => {
        const price = elm.product.price.replace(/[^0-9]/g, '')
        return price * Number(elm.quantity) + total
    }, 0)

    // update quantity size
    for (let i = 0; i < user.cart.length; i++) {
        const product = await Product.findById(user.cart[i].product._id)
        const sizes = await product.sizes.map(size => {
            if (+size.size == +user.cart[i].size) {
                if (+size.quantity < +user.cart[i].quantity) throw new Error(`Số lượng giày với size ${user.cart[i].size} không đủ, bạn hãy giảm bớt số lượng xuống.`)
                return {
                    size: size.size,
                    quantity: +size.quantity - +user.cart[i].quantity
                }
            }
            return size
        })
        product.sizes = sizes
        await product.save()
    }

    const order = await Oder.create({ products, total: `${total.toLocaleString()}đ`, orderBy: _id })
    user.cart = []
    await user.save()

    res.status(200).json({
        success: order ? true : false,
        order: order ? order : "can't create order",
    })
})
const deleteOrder = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const order = await Oder.findByIdAndDelete(oid)
    if (!order) throw new Error("Không tìm thấy order")
    await order.products.forEach(async productOder => {
        const product = await Product.findById(productOder.product)
        const sizes = await product.sizes.map(size => {
            if (size.size == productOder.size) {
                return {
                    size: size.size,
                    quantity: +size.quantity + +productOder.quantity
                }
            }
            return size
        })
        product.sizes = sizes
        await product.save()
    })
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