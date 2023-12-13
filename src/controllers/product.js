import asyncHandler from "express-async-handler"
import Product from "../models/product.js"
import slugify from "slugify"
import cloudinary from "cloudinary"
import {env} from "../configs/environment.js"

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
        message: product ? "Tạo sản phẩm thành công." : "Tạo sản phẩm thất bại."
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
    const {slug} = req.params
    const products = await Product.findOne({slug})
    res.status(200).json({
        success: products ? true : false,
        product: products ? products : "something went wrong"
    })
})

const getProducts = asyncHandler(async (req, res) => { 
    const products = await Product.find()
    res.status(200).json({
        success: products ? true : false,
        products: products ? products : "something went wrong"
    })
})
const getProductSearch = asyncHandler(async (req, res) => { 
    const title = { $regex: req.query.title, $options: "i" }
    console.log(title)
    const countProduct = await Product.find({ title }).countDocuments()
    const productAll = await Product.find({ title })
    let rangePrice = {}
    if (countProduct > 1) {
        const sortProduct = productAll.sort((a, b) => a.price - b.price)
        rangePrice = { priceMin: sortProduct[0]?.price, priceMax : sortProduct[sortProduct.length - 1]?.price}
    }
    const products = await Product.find({ title }).limit(12)

    res.status(200).json({
        success: products.length > 0 ? true : false,
        products: products.length > 0 ? products : "Không tìm thấy sản phẩm nào khớp với lựa chọn của bạn.",
        countProduct,
        ...rangePrice
    })
})

const getProductFilter = asyncHandler(async (req, res) => {
    let queryObj = { ...req.query }

    const excludeFields = ["page", "sort", "filter", "fields","limit"]
    excludeFields.forEach(element => {
        delete queryObj[element]
    });

    // config title
    if (req.query.title) queryObj.title = { $regex: queryObj.title, $options: "i" }
    
    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    queryString = JSON.parse(queryString)   

    // count product response
    const countProduct = await Product.find(queryString).countDocuments()
    
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
    const page = req?.query?.page || 1
    const limit = req?.query?.limit || env.PAGE_LIMIT 
    const pageSize = page - 1 === 0 ? 0 : (page - 1) * Number(limit)
    products.skip(pageSize).limit(limit)

    products.then((prods) => {
        
        res.status(200).json({
            success: prods.length > 0 ? true : false,
            products: prods.length > 0 ? prods : "Không tìm thấy sản phẩm nào khớp với lựa chọn của bạn.",
            countProduct,
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

const updateSize = asyncHandler(async (req, res) => { 
    const { pid } = req.params
    const { size, quantity } = req.body
    if (!size || !quantity) throw new Error("Không có size và số lượng size giày còn lại.")
    if (+size < 35 || +size > 37) throw new Error("Size không hợp lệ.")
    const product = await Product.findById(pid)
    if (!product) throw new Error("Product không tồn tại")
    const alreadySize = product.sizes.find(sizes => sizes.size == size)
    
    if (alreadySize) {
        // update size
        const productUpdate = await Product.updateOne({ sizes: { $elemMatch: alreadySize } }, {$set:{ "sizes.$.quantity": quantity }}, { new: true })
        res.status(200).json({
            success: productUpdate ? true : false,
            message: productUpdate ? "update size product successfully" : "update size product false"
        })
    } else {
        // add size
        const productUpdate = await Product.findByIdAndUpdate(pid, { $push: { sizes: { size, quantity } } }, { new: true })
        res.status(200).json({
            success: productUpdate ? true : false,
            message: productUpdate ? "add size product successfully" : "add size product false"
        })
    }
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
    getProductFilter,
    updateImages,
    updateSize,
    getProductSearch
}