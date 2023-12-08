import express from "express";
import * as ctrl from "../controllers/user.js"
import { verifyToken, isAdmin } from "../middlewares/verifyToken.js"
import update from "../configs/cloudinary.js"
const routes = express.Router();

routes.post('/register', ctrl.register)
routes.post('/finalRegister', ctrl.finalRegister)
routes.post('/refreshToken', ctrl.refreshToken)
routes.post('/login',ctrl.login)
routes.get('/logout',verifyToken,ctrl.logout)
routes.get('/cart',verifyToken,ctrl.getCart)
routes.get('/userCurrent',verifyToken,ctrl.getUserCurrent)
routes.put('/',verifyToken,ctrl.updateUser)
routes.post('/changePassword',ctrl.changePassword)
routes.post('/forgotPassword',ctrl.forgotPassword)
routes.get('/',[verifyToken, isAdmin],ctrl.getUsers)
routes.put('/updateCart/:pid',verifyToken,ctrl.updateCart)
routes.put('/addProductCart',verifyToken,ctrl.addProductCart)
routes.put('/updateAddress',verifyToken,ctrl.updateAddress)
routes.post('/updateAvatar',verifyToken,update.single("avatar"),ctrl.updateAvatar)
routes.put('/updateByAdmin/:uid',[verifyToken, isAdmin],ctrl.updateUserByAdmin)
routes.delete('/deleteProductCart/:cid',verifyToken,ctrl.deleteProductCart)
routes.get('/getProductToCart/:slug',verifyToken,ctrl.getProductToCart)
routes.delete('/:uid',[verifyToken, isAdmin],ctrl.deleteUser)

export default routes