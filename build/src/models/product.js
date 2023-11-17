"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
// Erase if already required
// Declare the Schema of the Mongo model
var productSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  sold: {
    type: Number,
    "default": 0
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  description: {
    type: String
  },
  images: [{
    path: {
      type: String,
      "default": "https://www.bing.com/th?id=OIP.JgT4rUe-Q6_uIV1Cz20V8wHaHa&w=174&h=185&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
    },
    filename: {
      type: String
    }
  }],
  sizes: [{
    size: {
      type: String
    },
    quantity: {
      type: Number
    }
  }]
}, {
  timestamps: true
});

//Export the model
var _default = exports["default"] = _mongoose["default"].model('Product', productSchema);