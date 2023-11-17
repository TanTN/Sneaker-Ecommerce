import asyncHandler from "express-async-handler"
import Brand from "../models/brand.js"

const createBrand = asyncHandler(async (req, res) => {
    const { title } = req.body
    const brandExist = await Brand.findOne({ title })
    if (brandExist) throw new Error("category already exists")

    const brand = await Brand.create({ title })
    res.status(200).json({
        success: brand ? true : false,
        category: brand ? brand : "something went wrong"
    })
})
const getBrand = asyncHandler(async (req, res) => {
    const brands = await Brand.find()

    res.status(200).json({
        success: brands ? true : false,
        brands: brands ? brands : "something went wrong"
    })
})
const updateBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const { title } = req.body
    if (!title) throw new Error("missing input")
    const brand = await Brand.findByIdAndUpdate(bid,req.body)

    res.status(200).json({
        success: brand ? true : false,
        brand: brand ? brand : "something went wrong"
    })
})
const deleteBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params

    const brand = await Brand.findByIdAndDelete(bid)
    res.status(200).json({
        success: brand ? true : false,
        brand: brand ? brand : "something went wrong"
    })
})

export {
    createBrand,
    getBrand,
    updateBrand,
    deleteBrand
}