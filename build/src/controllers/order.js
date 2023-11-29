"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStatus = exports.getOrders = exports.getOrder = exports.deleteOrder = exports.createOrder = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));
var _users = _interopRequireDefault(require("../models/users.js"));
var _order = _interopRequireDefault(require("../models/order.js"));
var createOrder = exports.createOrder = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _id, user, products, total, order;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _id = req.user._id;
          _context.next = 3;
          return _users["default"].findById(_id).select("cart").populate("cart.product", "price title images");
        case 3:
          user = _context.sent;
          if (user) {
            _context.next = 6;
            break;
          }
          throw new Error("user not found");
        case 6:
          if (!(user.cart.length === 0)) {
            _context.next = 8;
            break;
          }
          throw new Error("no product in cart");
        case 8:
          products = user.cart.map(function (elm) {
            return {
              product: elm.product._id,
              title: elm.product.title,
              images: elm.product.images,
              size: elm.size,
              quantity: elm.quantity
            };
          });
          total = user.cart.reduce(function (total, elm) {
            return elm.product.price * elm.quantity + total;
          }, 0);
          _context.next = 12;
          return _order["default"].create({
            products: products,
            total: total,
            orderBy: _id
          });
        case 12:
          order = _context.sent;
          res.status(200).json({
            success: order ? true : false,
            order: order ? order : "can't create order"
          });
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var deleteOrder = exports.deleteOrder = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var oid, order;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          oid = req.params.oid;
          _context2.next = 3;
          return _order["default"].findByIdAndDelete(oid);
        case 3:
          order = _context2.sent;
          res.status(200).json({
            success: order ? true : false,
            orderDel: order ? order : "can't delete order"
          });
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
var getOrder = exports.getOrder = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var _id, order;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _id = req.user._id;
          _context3.next = 3;
          return order.findOne({
            orderBy: _id
          });
        case 3:
          order = _context3.sent;
          res.status(200).json({
            success: order ? true : false,
            order: order ? order : "can't get order"
          });
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
var getOrders = exports.getOrders = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var orders;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return order.find();
        case 2:
          orders = _context4.sent;
          res.status(200).json({
            success: orders ? true : false,
            orders: orders ? orders : "can't get orders"
          });
        case 4:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
var updateStatus = exports.updateStatus = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var oid, order;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          oid = req.params.oid;
          if (req.body.status) {
            _context5.next = 3;
            break;
          }
          throw new Error("missing input");
        case 3:
          _context5.next = 5;
          return order.findByIdAndUpdate(oid, req.body);
        case 5:
          order = _context5.sent;
          res.status(200).json({
            success: order ? true : false,
            order: order ? order : "update status error"
          });
        case 7:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());