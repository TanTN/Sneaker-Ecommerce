import express from 'express';
import compress from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import {CONNECT_DB} from "./configs/db.config.js"
import {env} from "./configs/environment.js"
import routes from './routes/index.js';

const app = express();

const ON_SERVER = () => {
    app.use(cookieParser())
    // middleware
    // hiện thị thông tin và status gửi về
    app.use(morgan("dev"))
    // ẩn đi nodejs trong response
    app.use(helmet())
    // lén dữ liệu trong response
    app.use(compress())

    app.use(express.json())
    app.use(express.urlencoded({ extended: true}))

    routes(app)
    
    const PORT = env.APP_PORT || 6100

    app.listen(PORT, (err, res) => {
        console.log(`listening on port http://${env.APP_HOST}:${PORT}`)
    })
};
(async() => {
    await CONNECT_DB()
    ON_SERVER()
})()
// const onServer = async () => {
//     await CONNECT_DB()
//     ON_SERVER()
// }
// export default onServer