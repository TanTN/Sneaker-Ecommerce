import express from "express";
import * as ctrl from "../controllers/user.js"
import { verifyToken, isAdmin } from "../middlewares/verifyToken.js"
import update from "../configs/cloudinary.js"
const routes = express.Router();

routes.post('/register', ctrl.register)
routes.post('/finalRegister', ctrl.finalRegister)
routes.get('/login',ctrl.login)
routes.get('/logout',verifyToken,ctrl.logout)
routes.get('/userCurrent',verifyToken,ctrl.getUserCurrent)
routes.put('/',verifyToken,ctrl.updateUser)
routes.post('/changePassword',ctrl.changePassword)
routes.get('/forgotPassword',ctrl.forgotPassword)
routes.get('/',[verifyToken, isAdmin],ctrl.getUsers)
routes.put('/updateCart',verifyToken,ctrl.updateCart)
routes.put('/addProductCart',verifyToken,ctrl.addProductCart)
routes.put('/updateAddress',verifyToken,ctrl.updateAddress)
routes.put('/updateAvatar',verifyToken,update.single("avatar"),ctrl.updateAvatar)
routes.put('/updateByAdmin/:uid',[verifyToken, isAdmin],ctrl.updateUserByAdmin)
routes.delete('/:uid',[verifyToken, isAdmin],ctrl.deleteUser)

export default routes