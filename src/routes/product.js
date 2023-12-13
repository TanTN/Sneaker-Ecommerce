import express from "express";
import * as ctrl from "../controllers/product.js"
import {insertData} from "../controllers/insertData.js"
import {verifyToken, isAdmin} from "../middlewares/verifyToken.js"
import upload from "../configs/cloudinary.js"
const routes = express.Router();

// routes.get("/insert", insertData)

routes.post("/",[verifyToken, isAdmin],upload.array("images",5), ctrl.createProduct)
routes.get("/", ctrl.getProducts)
routes.get("/productFilter", ctrl.getProductFilter)
routes.get("/productSearch", ctrl.getProductSearch)
routes.put("/updateImages/:pid",[verifyToken,isAdmin],upload.array("images",5), ctrl.updateImages)
routes.put("/updateSize/:pid",[verifyToken, isAdmin], ctrl.updateSize)
routes.put("/:pid",[verifyToken, isAdmin], ctrl.updateProduct)
routes.get("/:slug", ctrl.getProduct)
routes.delete("/:pid", [verifyToken, isAdmin], ctrl.deleteProduct)


export default routes