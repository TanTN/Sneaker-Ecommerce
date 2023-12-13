import asyncHandler from "express-async-handler"
import Product from "../models/product.js"
import slugify from "slugify"
import dataSneaker from "../data/sneaker.js"

export const insertData = asyncHandler(async (req, res) => {

    await dataSneaker.forEach(async (data, index) => {
        if (index) {
            const sizes = await data.sizes.map(size => ({ size }))
            const images = await data.images.map(image => ({ path: image }))
            const benefit = { title: data?.quickly?.title ?? "", contents: data?.quickly?.content ?? [] }
            const price = data.price.replace(/[^0-9]/g, '')
            const priceDel = data.priceDel.replace(/[^0-9]/g, '')
            
            const dataPost = await { ...data,price: Number(price),priceDel:Number(priceDel), sizes, images,benefit, slug: slugify(data.title), brand: data?.brand }

            await Product.create(dataPost)
        }
    })
    
    res.status(200).json({
        success: true,
        products: "upload success"
    })
    
})
