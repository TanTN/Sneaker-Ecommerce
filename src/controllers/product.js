import asyncHandler from "express-async-handler"
import Product from "../models/product.js"
import slugify from "slugify"
import cloudinary from "cloudinary"

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error("missing input")
    if (req.files) {
        const images = req.files.map(file => ({ path: file.path, filename: file.filename }))
        req.body.images = images
    }
    req.body.slug = slugify(req.body.slug)
    const product = await Product.create(req.body)
    res.status(200).json({
        success: product ? true : false,
        product: product ? product : "can't created product"
    })
})
const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error("missing input")
    if (req.body.slug) req.body.slug = slugify(req.body.slug)
    const product = await Product.findByIdAndUpdate(pid, req.body, {new: true})
    res.status(200).json({
        success: product ? true : false,
        product: product ? product : "can't updated product"
    })
})
const getProduct = asyncHandler(async (req, res) => {
    const {pid} = req.params
    const products = await Product.findById(pid)
    res.status(200).json({
        success: products ? true : false,
        products: products ? products : "something went wrong"
    })
})
const getProducts = asyncHandler(async (req, res) => {
    let queryObj = {...req.query}
    const excludeFields = ["page", "sort", "filter", "fields"]
    excludeFields.forEach(element => {
        delete queryObj[element]
    });

    // config title
    if (req.query.title) queryObj.title = { $regex: queryObj.title, $options: "i" }
    
    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    queryString = JSON.parse(queryString)   
    console.log(queryString)
    const products = Product.find(queryString)

    // sort
    if (req.query.sort) {
        const sort = req.query.sort.split(",").join(" ")
        products.sort(sort)
    }

    // filter fields
    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ")
        products.select(fields)
    }

    // get pages
    const initLimit = 5
    const page = req?.query?.page || 1
    const limit = initLimit || 5
    const pageSize = page - 1 === 0 ? 0 : (page - 1) * limit
    products.skip(pageSize).limit(limit)
    
    products.then((prods) => {
        res.status(200).json({
            success: true,
            products: prods
        })
    }).catch((err) => {
        throw new Error(err.message)
    })

})

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const findProduct = await Product.findById(pid)
    if (!findProduct) throw new Error("user not found")
    if (findProduct.images.length > 0) {
        const arrNameImg = findProduct.images.map(img => img.filename)
        cloudinary.v2.api.delete_resources(arrNameImg)
    }
    const product = await Product.findByIdAndDelete(pid)
    res.status(200).json({
        success: product ? true : false,
        product: product ? "deleted product successfully" : "can't deleted product"
    })
})
const updateImages = asyncHandler(async (req, res) => { 
    const { pid } = req.params

    if (!req.files) throw new Error("No images")
    const images = req.files?.map(file =>({path:file.path, filename: file.filename}))
    const product = await Product.findByIdAndUpdate(pid,{images},{new:true})

    res.status(200).json({
        success: product ? true : false,
        product: product ? product : "updated image false"
    })
})


export {
    createProduct,
    deleteProduct,
    updateProduct,
    getProduct,
    getProducts,
    updateImages
}