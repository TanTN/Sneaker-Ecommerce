"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _cloudinary = _interopRequireDefault(require("cloudinary"));
var _multerStorageCloudinary = require("multer-storage-cloudinary");
var _multer = _interopRequireDefault(require("multer"));
var _environment = require("./environment.js");
_cloudinary["default"].config({
  cloud_name: _environment.env.CLOUDINARY_NAME,
  api_key: _environment.env.CLOUDINARY_KEY,
  api_secret: _environment.env.CLOUDINARY_SECRET
});
var storage = new _multerStorageCloudinary.CloudinaryStorage({
  cloudinary: _cloudinary["default"].v2,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: "Sneaker-Ecommerce"
  }
});
var uploadCloud = (0, _multer["default"])({
  storage: storage
});
var _default = exports["default"] = uploadCloud;