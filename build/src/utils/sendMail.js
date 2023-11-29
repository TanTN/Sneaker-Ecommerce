"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _environment = require("../configs/environment.js");
var transporter = _nodemailer["default"].createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: _environment.env.EMAIL_NAME,
    pass: _environment.env.EMAIL_APP_PASSWORD
  }
});

// async..await is not allowed in global scope, must use a wrapper
function main(_x, _x2) {
  return _main.apply(this, arguments);
}
function _main() {
  _main = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(html, toEmail) {
    var info;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return transporter.sendMail({
            from: "\"Roll Sneaker\" ".concat(_environment.env.EMAIL_NAME),
            // sender address
            to: "".concat(toEmail),
            // list of receivers
            subject: "Xin chào quý khách!",
            // Subject line
            text: "",
            // plain text body
            html: html // html body
          });
        case 2:
          info = _context.sent;
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _main.apply(this, arguments);
}
var _default = exports["default"] = main;