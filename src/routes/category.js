import express from "express";
import * as ctrl from "../controllers/category.js"
import {verifyToken, isAdmin} from "../middlewares/verifyToken.js"
const routes = express.Router();

routes.post("/",[verifyToken, isAdmin],ctrl.createCategory)
routes.get("/",verifyToken,ctrl.createCategory)
routes.put("/:pid",[verifyToken, isAdmin],ctrl.createCategory)
routes.delete("/:pid",[verifyToken, isAdmin],ctrl.createCategory)

export default routes