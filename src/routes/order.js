import express from "express";
import * as ctrl from "../controllers/order.js"
import {verifyToken, isAdmin} from "../middlewares/verifyToken.js"
const routes = express.Router();

routes.post("/",verifyToken, ctrl.createOrder)
routes.get("/",verifyToken, ctrl.getOrder)
routes.get("/allOrder",[verifyToken, isAdmin], ctrl.getOrders)
routes.put("/:oid",[verifyToken, isAdmin], ctrl.updateStatus)
routes.delete("/:oid",verifyToken, ctrl.createOrder)

export default routes