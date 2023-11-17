"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
// Erase if already required
// Declare the Schema of the Mongo model
var branSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
}, {
  timestamps: true
});

//Export the model
var _default = exports["default"] = _mongoose["default"].model('Brand', branSchema);