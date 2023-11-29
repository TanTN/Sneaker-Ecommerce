"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateProduct = exports.updateImages = exports.getProducts = exports.getProduct = exports.deleteProduct = exports.createProduct = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));
var _product = _interopRequireDefault(require("../models/product.js"));
var _slugify = _interopRequireDefault(require("slugify"));
var _cloudinary = _interopRequireDefault(require("cloudinary"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var createProduct = exports.createProduct = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var images, product;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(Object.keys(req.body).length === 0)) {
            _context.next = 2;
            break;
          }
          throw new Error("missing input");
        case 2:
          if (req.files) {
            images = req.files.map(function (file) {
              return {
                path: file.path,
                filename: file.filename
              };
            });
            req.body.images = images;
          }
          req.body.slug = (0, _slugify["default"])(req.body.slug);
          _context.next = 6;
          return _product["default"].create(req.body);
        case 6:
          product = _context.sent;
          res.status(200).json({
            success: product ? true : false,
            product: product ? product : "can't created product"
          });
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var updateProduct = exports.updateProduct = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var pid, product;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          pid = req.params.pid;
          if (!(Object.keys(req.body).length === 0)) {
            _context2.next = 3;
            break;
          }
          throw new Error("missing input");
        case 3:
          if (req.body.slug) req.body.slug = (0, _slugify["default"])(req.body.slug);
          _context2.next = 6;
          return _product["default"].findByIdAndUpdate(pid, req.body, {
            "new": true
          });
        case 6:
          product = _context2.sent;
          res.status(200).json({
            success: product ? true : false,
            product: product ? product : "can't updated product"
          });
        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
var getProduct = exports.getProduct = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var pid, products;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          pid = req.params.pid;
          _context3.next = 3;
          return _product["default"].findById(pid);
        case 3:
          products = _context3.sent;
          res.status(200).json({
            success: products ? true : false,
            products: products ? products : "something went wrong"
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
var getProducts = exports.getProducts = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var _req$query;
    var queryObj, excludeFields, queryString, products, sort, fields, initLimit, page, limit, pageSize;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          queryObj = _objectSpread({}, req.query);
          excludeFields = ["page", "sort", "filter", "fields"];
          excludeFields.forEach(function (element) {
            delete queryObj[element];
          });

          // config title
          if (req.query.title) queryObj.title = {
            $regex: queryObj.title,
            $options: "i"
          };
          queryString = JSON.stringify(queryObj);
          queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, function (match) {
            return "$".concat(match);
          });
          queryString = JSON.parse(queryString);

          products = _product["default"].find(queryString); // sort
          if (req.query.sort) {
            sort = req.query.sort.split(",").join(" ");
            products.sort(sort);
          }

          // filter fields
          if (req.query.fields) {
            fields = req.query.fields.split(",").join(" ");
            products.select(fields);
          }

          // get pages
          initLimit = 5;
          page = (req === null || req === void 0 || (_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.page) || 1;
          limit = initLimit || 5;
          pageSize = page - 1 === 0 ? 0 : (page - 1) * limit;
          products.skip(pageSize).limit(limit);
          products.then(function (prods) {
            res.status(200).json({
              success: true,
              products: prods
            });
          })["catch"](function (err) {
            throw new Error(err.message);
          });
        case 17:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
var deleteProduct = exports.deleteProduct = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var pid, findProduct, arrNameImg, product;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          pid = req.params.pid;
          _context5.next = 3;
          return _product["default"].findById(pid);
        case 3:
          findProduct = _context5.sent;
          if (findProduct) {
            _context5.next = 6;
            break;
          }
          throw new Error("user not found");
        case 6:
          if (findProduct.images.length > 0) {
            arrNameImg = findProduct.images.map(function (img) {
              return img.filename;
            });
            _cloudinary["default"].v2.api.delete_resources(arrNameImg);
          }
          _context5.next = 9;
          return _product["default"].findByIdAndDelete(pid);
        case 9:
          product = _context5.sent;
          res.status(200).json({
            success: product ? true : false,
            product: product ? "deleted product successfully" : "can't deleted product"
          });
        case 11:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
var updateImages = exports.updateImages = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var _req$files;
    var pid, images, product;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          pid = req.params.pid;
          if (req.files) {
            _context6.next = 3;
            break;
          }
          throw new Error("No images");
        case 3:
          images = (_req$files = req.files) === null || _req$files === void 0 ? void 0 : _req$files.map(function (file) {
            return {
              path: file.path,
              filename: file.filename
            };
          });
          _context6.next = 6;
          return _product["default"].findByIdAndUpdate(pid, {
            images: images
          }, {
            "new": true
          });
        case 6:
          product = _context6.sent;
          res.status(200).json({
            success: product ? true : false,
            product: product ? product : "updated image false"
          });
        case 8:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());