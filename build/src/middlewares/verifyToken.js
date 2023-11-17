"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = exports.isAdmin = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _environment = require("../configs/environment.js");
var verifyToken = exports.verifyToken = function verifyToken(req, res, next) {
  var _req$headers;
  if (req !== null && req !== void 0 && (_req$headers = req.headers) !== null && _req$headers !== void 0 && _req$headers.authorization.startsWith('Bearer ')) {
    var _req$headers2;
    var accessToken = req === null || req === void 0 || (_req$headers2 = req.headers) === null || _req$headers2 === void 0 ? void 0 : _req$headers2.authorization.split(' ')[1];
    _jsonwebtoken["default"].verify(accessToken, _environment.env.SECRET_KEY, function (err, decode) {
      if (err) {
        res.status(401).json({
          success: false,
          message: 'invalid access token'
        });
      }
      req.user = decode;
      next();
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'require access token'
    });
  }
};
var isAdmin = exports.isAdmin = function isAdmin(req, res, next) {
  var _req$user;
  if ((req === null || req === void 0 || (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.role) != 'Admin') throw new Error("You must be Admin");
  next();
};