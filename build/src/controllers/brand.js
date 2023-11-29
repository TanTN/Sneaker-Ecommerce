"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateBrand = exports.getBrand = exports.deleteBrand = exports.createBrand = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));
var _brand = _interopRequireDefault(require("../models/brand.js"));
var createBrand = exports.createBrand = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var title, brandExist, brand;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          title = req.body.title;
          _context.next = 3;
          return _brand["default"].findOne({
            title: title
          });
        case 3:
          brandExist = _context.sent;
          if (!brandExist) {
            _context.next = 6;
            break;
          }
          throw new Error("category already exists");
        case 6:
          _context.next = 8;
          return _brand["default"].create({
            title: title
          });
        case 8:
          brand = _context.sent;
          res.status(200).json({
            success: brand ? true : false,
            category: brand ? brand : "something went wrong"
          });
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var getBrand = exports.getBrand = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var brands;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _brand["default"].find();
        case 2:
          brands = _context2.sent;
          res.status(200).json({
            success: brands ? true : false,
            brands: brands ? brands : "something went wrong"
          });
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
var updateBrand = exports.updateBrand = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var bid, title, brand;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          bid = req.params.bid;
          title = req.body.title;
          if (title) {
            _context3.next = 4;
            break;
          }
          throw new Error("missing input");
        case 4:
          _context3.next = 6;
          return _brand["default"].findByIdAndUpdate(bid, req.body);
        case 6:
          brand = _context3.sent;
          res.status(200).json({
            success: brand ? true : false,
            brand: brand ? brand : "something went wrong"
          });
        case 8:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
var deleteBrand = exports.deleteBrand = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var bid, brand;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          bid = req.params.bid;
          _context4.next = 3;
          return _brand["default"].findByIdAndDelete(bid);
        case 3:
          brand = _context4.sent;
          res.status(200).json({
            success: brand ? true : false,
            brand: brand ? brand : "something went wrong"
          });
        case 5:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());