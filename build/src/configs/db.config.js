"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CONNECT_DB = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _environment = require("./environment.js");
var CONNECT_DB = exports.CONNECT_DB = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var mongoInstant;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _mongoose["default"].connect(_environment.env.MONGODB_URI);
        case 3:
          mongoInstant = _context.sent;
          if (mongoInstant.connection.readyState === 1) {
            console.log("connected to MongoDB");
          } else {
            console.log("MongoDB don't connect");
          }
          _context.next = 11;
          break;
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          throw new Error(_context.t0.message);
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function CONNECT_DB() {
    return _ref.apply(this, arguments);
  };
}();