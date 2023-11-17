import express from "express";
import * as ctrl from "../controllers/product.js"
import {verifyToken, isAdmin} from "../middlewares/verifyToken.js"
import upload from "../configs/cloudinary.js"
const routes = express.Router();

routes.post("/",[verifyToken, isAdmin], ctrl.createProduct)
routes.get("/",[verifyToken], ctrl.getProducts)
routes.put("/updateImages/:pid",[verifyToken,isAdmin],upload.array("images",5), ctrl.updateImages)
routes.put("/:pid",[verifyToken, isAdmin], ctrl.updateProduct)
routes.get("/:pid",[verifyToken], ctrl.getProduct)
routes.delete("/:pid",[verifyToken, isAdmin], ctrl.deleteProduct)

export default routes