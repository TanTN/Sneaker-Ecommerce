const notfound = (req,res,next) => {
    res.status(404)
    const error = new Error("Not Found")
    next(error)
}
const handleError = (error, req, res, next) => {
    const status = res.statusCode === 200 ? 200 : res.statusCode
    res.status(status).json({
        success: false,
        message: error.message
    })
}
export {
    notfound,
    handleError
}