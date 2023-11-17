import asyncHandler from "express-async-handler"
import Category from "../models/category.js"

const createCategory = asyncHandler(async (req, res) => {
    const { title } = req.body
    const categoryExist = await Category.findOne({ title })
    if (categoryExist) throw new Error("category already exists")

    const category = await Category.create({ title })
    res.status(200).json({
        success: category ? true : false,
        category: category ? category : "something went wrong"
    })
})
const getCategory = asyncHandler(async (req, res) => {
    const categorys = await Category.find()

    res.status(200).json({
        success: categorys ? true : false,
        categorys: categorys ? categorys : "something went wrong"
    })
})
const updateCategory = asyncHandler(async (req, res) => {
    const { cid } = req.params
    const { title } = req.body
    if (!title) throw new Error("missing input")
    const category = await Category.findByIdAndUpdate(cid,req.body)

    res.status(200).json({
        success: category ? true : false,
        category: category ? category : "something went wrong"
    })
})
const deleteCategory = asyncHandler(async (req, res) => {
    const { cid } = req.params

    const category = await Category.findByIdAndDelete(cid)
    res.status(200).json({
        success: category ? true : false,
        category: category ? category : "something went wrong"
    })
})

export {
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
}