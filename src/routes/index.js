import {notfound, handleError} from "../middlewares/handleError.js"
import user from "./user.js"
import product from "./product.js"
import brand from "./brand.js"
import category from "./category.js"
import order from "./order.js"

const routes = (app) => {
    app.use("/api/v1/user",user)
    app.use("/api/v1/product",product)
    app.use("/api/v1/category",category)
    app.use("/api/v1/brand",brand)
    app.use("/api/v1/order",order)

    app.use(notfound)
    app.use(handleError)
}
export default routes