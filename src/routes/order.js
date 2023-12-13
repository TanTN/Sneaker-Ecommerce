import express from "express";
import * as ctrl from "../controllers/order.js"
import {verifyToken, isAdmin} from "../middlewares/verifyToken.js"
const routes = express.Router();

routes.post("/",verifyToken, ctrl.createOrder)
routes.get("/allOrder",[verifyToken, isAdmin], ctrl.getOrders)
routes.get("/",verifyToken, ctrl.getOrder)
routes.get("/orderUser/:uid",[verifyToken, isAdmin], ctrl.getOrderUser)
routes.put("/:oid",[verifyToken, isAdmin], ctrl.updateStatus)
routes.delete("/:oid",verifyToken, ctrl.deleteOrder)

export default routes