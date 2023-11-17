"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCategory = exports.getCategory = exports.deleteCategory = exports.createCategory = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));
var _category = _interopRequireDefault(require("../models/category.js"));
var createCategory = exports.createCategory = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var title, categoryExist, category;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          title = req.body.title;
          _context.next = 3;
          return _category["default"].findOne({
            title: title
          });
        case 3:
          categoryExist = _context.sent;
          if (!categoryExist) {
            _context.next = 6;
            break;
          }
          throw new Error("category already exists");
        case 6:
          _context.next = 8;
          return _category["default"].create({
            title: title
          });
        case 8:
          category = _context.sent;
          res.status(200).json({
            success: category ? true : false,
            category: category ? category : "something went wrong"
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
var getCategory = exports.getCategory = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var categorys;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _category["default"].find();
        case 2:
          categorys = _context2.sent;
          res.status(200).json({
            success: categorys ? true : false,
            categorys: categorys ? categorys : "something went wrong"
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
var updateCategory = exports.updateCategory = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var cid, title, category;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          cid = req.params.cid;
          title = req.body.title;
          if (title) {
            _context3.next = 4;
            break;
          }
          throw new Error("missing input");
        case 4:
          _context3.next = 6;
          return _category["default"].findByIdAndUpdate(cid, req.body);
        case 6:
          category = _context3.sent;
          res.status(200).json({
            success: category ? true : false,
            category: category ? category : "something went wrong"
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
var deleteCategory = exports.deleteCategory = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var cid, category;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          cid = req.params.cid;
          _context4.next = 3;
          return _category["default"].findByIdAndDelete(cid);
        case 3:
          category = _context4.sent;
          res.status(200).json({
            success: category ? true : false,
            category: category ? category : "something went wrong"
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