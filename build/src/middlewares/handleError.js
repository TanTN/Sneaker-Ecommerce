"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notfound = exports.handleError = void 0;
var notfound = exports.notfound = function notfound(req, res, next) {
  res.status(404);
  var error = new Error("Not Found");
  next(error);
};
var handleError = exports.handleError = function handleError(error, req, res, next) {
  var status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({
    success: false,
    message: error.message
  });
};