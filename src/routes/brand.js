import express from "express";
import * as ctrl from "../controllers/brand.js"
import {verifyToken, isAdmin} from "../middlewares/verifyToken.js"
const routes = express.Router();

routes.post("/",[verifyToken, isAdmin],ctrl.createBrand)
routes.get("/",verifyToken,ctrl.getBrand)
routes.put("/:bid",[verifyToken, isAdmin],ctrl.updateBrand)
routes.delete("/:bid",[verifyToken, isAdmin],ctrl.deleteBrand)

export default routes