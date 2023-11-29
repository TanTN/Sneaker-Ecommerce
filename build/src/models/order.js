"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
// Erase if already required
// Declare the Schema of the Mongo model
var orderSchema = new _mongoose["default"].Schema({
  products: [{
    product: {
      type: _mongoose["default"].Types.ObjectId
    },
    title: {
      type: String
    },
    size: {
      type: Number
    },
    quantity: {
      type: Number
    },
    images: [{
      type: String
    }]
  }],
  total: {
    type: Number
  },
  orderBy: {
    type: _mongoose["default"].Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    "enum": ["Canceled", "Processing", "Succeed"],
    "default": "Processing"
  }
});

//Export the model
var _default = exports["default"] = _mongoose["default"].model('Order', orderSchema);