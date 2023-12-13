import express from "express";
import * as ctrl from "../controllers/category.js"
import {verifyToken, isAdmin} from "../middlewares/verifyToken.js"
const routes = express.Router();

routes.post("/",[verifyToken, isAdmin],ctrl.createCategory)
routes.get("/",verifyToken,ctrl.getCategory)
routes.put("/:pid",[verifyToken, isAdmin],ctrl.updateCategory)
routes.delete("/:pid",[verifyToken, isAdmin],ctrl.deleteCategory)

export default routes