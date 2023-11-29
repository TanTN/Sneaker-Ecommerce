"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUserByAdmin = exports.updateUser = exports.updateCart = exports.updateAvatar = exports.updateAddress = exports.register = exports.logout = exports.login = exports.getUsers = exports.getUserCurrent = exports.forgotPassword = exports.finalRegister = exports.deleteUser = exports.changePassword = exports.addProductCart = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));
var _users = _interopRequireDefault(require("../models/users.js"));
var _jwt = require("../middlewares/jwt.js");
var _sendMail = _interopRequireDefault(require("../utils/sendMail.js"));
var _cloudinary = _interopRequireDefault(require("cloudinary"));
var _crypto = _interopRequireDefault(require("crypto"));
var _uniqId = _interopRequireDefault(require("uniq-id"));
var register = exports.register = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _req$body, email, mobile, password, name, checkEmail, checkMobile, token, expiresIn, newUser, html;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, mobile = _req$body.mobile, password = _req$body.password, name = _req$body.name; // check body input
          if (!(!email && !password && !name && !mobile)) {
            _context2.next = 3;
            break;
          }
          throw new Error("missing input");
        case 3:
          _context2.next = 5;
          return _users["default"].findOne({
            email: email
          });
        case 5:
          checkEmail = _context2.sent;
          if (!checkEmail) {
            _context2.next = 8;
            break;
          }
          throw new Error("email đã được đăng kí.");
        case 8:
          _context2.next = 10;
          return _users["default"].findOne({
            mobile: mobile
          });
        case 10:
          checkMobile = _context2.sent;
          if (!checkMobile) {
            _context2.next = 13;
            break;
          }
          throw new Error("Số điện thoại đã được đăng kí.");
        case 13:
          // make token
          token = (0, _uniqId["default"])(); // create new user
          expiresIn = Date.now() + 5 * 60 * 1000;
          req.body.email = "".concat(email, "~").concat(token, "~").concat(expiresIn);
          req.body.mobile = "".concat(mobile, "~").concat(token);
          _context2.next = 19;
          return _users["default"].create(req.body);
        case 19:
          newUser = _context2.sent;
          // send email
          html = "\n        <div>\n            <img src=\"https://sneaker-store-eight.vercel.app/assets/cropped-logo-roll-sneaker-482951d6.png\">\n            <p style=\"font-size:16px\">M\xE3 x\xE1c nh\u1EADn \u0111\u0103ng kh\xED t\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n l\xE0:</p>\n            <div style=\"font-size:18px\"><b><i>".concat(token, "</i></b></div>\n        </div>\n    ");
          _context2.next = 23;
          return (0, _sendMail["default"])(html, email);
        case 23:
          // delete email when false
          setTimeout( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _users["default"].findOneAndDelete({
                    email: newUser.email
                  });
                case 2:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          })), 5 * 60 * 1000);
          res.status(200).json({
            success: true,
            message: "Kiểm tra email của bạn để lấy mã xác nhận."
          });
        case 25:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var finalRegister = exports.finalRegister = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var _user$email;
    var token, user, expiresIn, email, mobile, checkUser;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          token = req.body.token;
          _context3.next = 3;
          return _users["default"].findOne({
            email: new RegExp("".concat(token), 'g')
          });
        case 3:
          user = _context3.sent;
          expiresIn = user === null || user === void 0 || (_user$email = user.email) === null || _user$email === void 0 ? void 0 : _user$email.split("~")[2];
          if (!user || +expiresIn < Date.now()) {
            res.status(200).json({
              success: false,
              message: "Mã xác nhận không đúng."
            });
          }
          email = user.email.split("~")[0];
          mobile = user.mobile.split("~")[0]; // check lại user
          _context3.next = 10;
          return _users["default"].findOne({
            email: email,
            mobile: mobile
          });
        case 10:
          checkUser = _context3.sent;
          if (!checkUser) {
            _context3.next = 13;
            break;
          }
          throw new Error("Email hoặc số điện thoại cảu bạn đã được đăng kí.");
        case 13:
          user.email = email;
          user.mobile = mobile;
          _context3.next = 17;
          return user.save();
        case 17:
          res.status(200).json({
            success: true,
            message: "Tài khoản của bạn đã đăng kí thành công."
          });
        case 18:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function (_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}());
var login = exports.login = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var _req$body2, email, password, user, accessToken, refreshToken, userUpdate;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          if (!(!email || !password)) {
            _context4.next = 3;
            break;
          }
          throw new Error("missing input");
        case 3:
          _context4.next = 5;
          return _users["default"].findOne({
            email: email
          });
        case 5:
          user = _context4.sent;
          if (user) {
            _context4.next = 8;
            break;
          }
          throw new Error("user not found");
        case 8:
          _context4.next = 10;
          return user.isCorrectPassword(password);
        case 10:
          if (_context4.sent) {
            _context4.next = 12;
            break;
          }
          throw new Error("somethings went wrong");
        case 12:
          // create access token and refresh token
          accessToken = (0, _jwt.generateAccessToken)(user._id.toString(), user.role);
          refreshToken = (0, _jwt.generateRefreshToken)(user._id.toString()); // update access token in res
          _context4.next = 16;
          return _users["default"].findByIdAndUpdate(user._id, {
            refreshToken: refreshToken
          }, {
            "new": true
          }).select("-password -createdAt -updatedAt -refreshToken");
        case 16:
          userUpdate = _context4.sent;
          userUpdate.accessToken = accessToken;
          // add refresh in cookie
          res.cookie("refreshToken", refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true
          });
          res.status(200).json({
            success: userUpdate ? true : false,
            user: userUpdate ? userUpdate : "somethings went wrong"
          });
        case 20:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function (_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}());
var logout = exports.logout = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var _id, cookie;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _id = req.user._id;
          cookie = req.cookies["refreshToken"]; // check refresh token in cookie
          if (cookie) {
            _context5.next = 4;
            break;
          }
          throw new Error("no refresh token in cookie");
        case 4:
          _context5.next = 6;
          return _users["default"].findByIdAndUpdate(_id, {
            refreshToken: "",
            accessToken: ""
          }, {
            "new": true
          });
        case 6:
          res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
          });
          res.status(200).json({
            success: true,
            message: "logout successfully"
          });
        case 8:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function (_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}());
var getUserCurrent = exports.getUserCurrent = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var _id, user;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _id = req.user._id;
          _context6.next = 3;
          return _users["default"].findById(_id).select("-password -createdAt -updatedAt -refreshToken");
        case 3:
          user = _context6.sent;
          res.status(200).json({
            success: user ? true : false,
            user: user ? user : "somethings went wrong"
          });
        case 5:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function (_x9, _x10) {
    return _ref6.apply(this, arguments);
  };
}());
var getUsers = exports.getUsers = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var user;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return _users["default"].find().select("-password -refreshToken");
        case 2:
          user = _context7.sent;
          res.status(200).json({
            success: user ? true : false,
            users: user ? user : "somethings went wrong"
          });
        case 4:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function (_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}());
var updateUser = exports.updateUser = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var _id, userUpdate;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _id = req.user._id;
          _context8.next = 3;
          return _users["default"].findByIdAndUpdate(_id, req.body, {
            "new": true
          }).select("-password -refreshToken");
        case 3:
          userUpdate = _context8.sent;
          res.status(200).json({
            success: userUpdate ? true : false,
            user: userUpdate ? a : "somethings went wrong"
          });
        case 5:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function (_x13, _x14) {
    return _ref8.apply(this, arguments);
  };
}());
var forgotPassword = exports.forgotPassword = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var email, user, passwordResetToken, html, isSendEmail;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          email = req.body.email;
          _context9.next = 3;
          return _users["default"].findOne({
            email: email
          });
        case 3:
          user = _context9.sent;
          if (user) {
            _context9.next = 6;
            break;
          }
          throw new Error("user not found");
        case 6:
          _context9.next = 8;
          return user.generatePasswordResetToken();
        case 8:
          passwordResetToken = _context9.sent;
          _context9.next = 11;
          return user.save();
        case 11:
          html = "\n        <div>\n            <img src=\"https://sneaker-store-eight.vercel.app/assets/cropped-logo-roll-sneaker-482951d6.png\">\n            <p style=\"font-size:16px\">\n                Nh\u1EA5n v\xE0o n\xFAt d\u01B0\u1EDBi \u0111\xE2y \u0111\u1EC3 thay \u0111\u1ED5i m\u1EADt kh\u1EA9u, c\xF3 th\u1EDDi gian hi\u1EC7u l\u1EF1c l\xE0 5 ph\xFAt.\n            </p>\n            <div>\n                <a href=\"http://localhost:6000/".concat(passwordResetToken, "\" style=\"display:inline-block ;padding:12px 20px; background-color: #f14343; font-size: 18px; text-decoration: none; color: white\">Reset password</a>\n            </div>\n        </div>\n    "); // generate email send 
          isSendEmail = (0, _sendMail["default"])(html, user.email);
          res.status(200).json({
            success: isSendEmail ? true : false,
            message: isSendEmail ? "send code success" : "send code error"
          });
        case 14:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function (_x15, _x16) {
    return _ref9.apply(this, arguments);
  };
}());
var changePassword = exports.changePassword = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var _req$body3, password, token, passwordResetToken, user;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _req$body3 = req.body, password = _req$body3.password, token = _req$body3.token;
          _context10.next = 3;
          return _crypto["default"].createHash('sha256').update(token).digest("hex");
        case 3:
          passwordResetToken = _context10.sent;
          _context10.next = 6;
          return _users["default"].findOne({
            passwordResetToken: passwordResetToken,
            passwordChangeAt: {
              $gte: Date.now()
            }
          }).select("-password -refreshToken");
        case 6:
          user = _context10.sent;
          if (user) {
            _context10.next = 9;
            break;
          }
          throw new Error("something went wrong");
        case 9:
          // update password
          user.password = password;
          user.passwordResetExpires = "";
          user.passwordResetToken = "";
          user.passwordChangeAt = Date.now();
          _context10.next = 15;
          return user.save();
        case 15:
          res.status(200).json({
            success: true,
            user: "changed password"
          });
        case 16:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function (_x17, _x18) {
    return _ref10.apply(this, arguments);
  };
}());
var deleteUser = exports.deleteUser = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res) {
    var _userCurrent$avatar;
    var uid, userCurrent, user, _userCurrent$avatar2;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          uid = req.params.uid;
          _context11.next = 3;
          return _users["default"].findById(uid);
        case 3:
          userCurrent = _context11.sent;
          if (userCurrent) {
            _context11.next = 6;
            break;
          }
          throw new Error("user not found");
        case 6:
          _context11.next = 8;
          return _users["default"].findByIdAndDelete(uid);
        case 8:
          user = _context11.sent;
          // delete image
          if (userCurrent !== null && userCurrent !== void 0 && (_userCurrent$avatar = userCurrent.avatar) !== null && _userCurrent$avatar !== void 0 && _userCurrent$avatar.filename) {
            _cloudinary["default"].v2.uploader.destroy(userCurrent === null || userCurrent === void 0 || (_userCurrent$avatar2 = userCurrent.avatar) === null || _userCurrent$avatar2 === void 0 ? void 0 : _userCurrent$avatar2.filename);
          }
          res.status(200).json({
            success: user ? true : false,
            mes: user ? "account ".concat(userCurrent === null || userCurrent === void 0 ? void 0 : userCurrent.name, " successfully deleted") : "account ".concat(userCurrent === null || userCurrent === void 0 ? void 0 : userCurrent.name, " false deleted")
          });
        case 11:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return function (_x19, _x20) {
    return _ref11.apply(this, arguments);
  };
}());
var updateUserByAdmin = exports.updateUserByAdmin = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res) {
    var uid, user;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          uid = req.params.uid;
          if (!(Object.keys(req.body).length === 0)) {
            _context12.next = 3;
            break;
          }
          throw new Error("missing input");
        case 3:
          _context12.next = 5;
          return _users["default"].findByIdAndUpdate(uid, req.body, {
            "new": true
          }).select("-password -refreshToken");
        case 5:
          user = _context12.sent;
          res.status(200).json({
            success: user ? true : false,
            user: user ? user : "something went wrong"
          });
        case 7:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  }));
  return function (_x21, _x22) {
    return _ref12.apply(this, arguments);
  };
}());
var addProductCart = exports.addProductCart = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res) {
    var _id, user, alreadyProduct, userUpdate;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _id = req.user._id;
          if (!(Object.keys(req.body).length === 0)) {
            _context13.next = 3;
            break;
          }
          throw new Error("missing input");
        case 3:
          _context13.next = 5;
          return _users["default"].findById(_id).select("cart").populate("cart.product", "title");
        case 5:
          user = _context13.sent;
          alreadyProduct = user.cart.find(function (prd) {
            return prd.product._id.toString() === req.body.product && prd.size === +req.body.size;
          });
          if (!alreadyProduct) {
            _context13.next = 11;
            break;
          }
          //when product already exists with size equal
          res.status(200).json({
            success: false,
            message: "B\u1EA1n kh\xF4ng th\u1EC3 th\xEAm \"".concat(alreadyProduct.product.title, " - ").concat(req.body.size, "\" kh\xE1c v\xE0o gi\u1ECF h\xE0ng c\u1EE7a b\u1EA1n.")
          });
          _context13.next = 15;
          break;
        case 11:
          _context13.next = 13;
          return _users["default"].findByIdAndUpdate(_id, {
            $push: {
              cart: req.body
            }
          }, {
            "new": true
          }).select("-password -refreshToken");
        case 13:
          userUpdate = _context13.sent;
          res.status(200).json({
            success: user ? true : false,
            userUpdate: userUpdate ? userUpdate : "something went wrong"
          });
        case 15:
        case "end":
          return _context13.stop();
      }
    }, _callee13);
  }));
  return function (_x23, _x24) {
    return _ref13.apply(this, arguments);
  };
}());
var updateCart = exports.updateCart = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res) {
    var _id, user, alreadyProduct, userUpdate;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _id = req.user._id;
          if (!(Object.keys(req.body).length === 0)) {
            _context14.next = 3;
            break;
          }
          throw new Error("missing input");
        case 3:
          _context14.next = 5;
          return _users["default"].findById(_id).select("cart");
        case 5:
          user = _context14.sent;
          alreadyProduct = user.cart.find(function (elm) {
            return elm.product.toString() === req.body.product;
          });
          if (!alreadyProduct) {
            _context14.next = 14;
            break;
          }
          _context14.next = 10;
          return _users["default"].updateOne({
            cart: {
              $elemMatch: alreadyProduct
            }
          }, {
            $set: {
              "cart.$.size": req.body.size,
              "cart.$.quantity": req.body.quantity
            }
          }, {
            "new": true
          });
        case 10:
          userUpdate = _context14.sent;
          res.status(200).json({
            success: user ? true : false,
            userUpdate: userUpdate ? "update cart successfully" : "something went wrong"
          });
          _context14.next = 15;
          break;
        case 14:
          res.status(200).json({
            success: false,
            userUpdate: "product no existed in cart"
          });
        case 15:
        case "end":
          return _context14.stop();
      }
    }, _callee14);
  }));
  return function (_x25, _x26) {
    return _ref14.apply(this, arguments);
  };
}());
var updateAddress = exports.updateAddress = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res) {
    var _id, user;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) switch (_context15.prev = _context15.next) {
        case 0:
          _id = req.user._id;
          if (!(Object.keys(req.body).length === 0)) {
            _context15.next = 3;
            break;
          }
          throw new Error("missing input");
        case 3:
          _context15.next = 5;
          return _users["default"].findByIdAndUpdate(_id, {
            address: req.body
          }, {
            "new": true
          }).select("-password -refreshToken");
        case 5:
          user = _context15.sent;
          res.status(200).json({
            success: user ? true : false,
            userUpdate: user ? user : "something went wrong"
          });
        case 7:
        case "end":
          return _context15.stop();
      }
    }, _callee15);
  }));
  return function (_x27, _x28) {
    return _ref15.apply(this, arguments);
  };
}());
var updateAvatar = exports.updateAvatar = (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res) {
    var _id, _req$file, path, filename, avatar, user;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) switch (_context16.prev = _context16.next) {
        case 0:
          _id = req.user._id;
          _req$file = req.file, path = _req$file.path, filename = _req$file.filename;
          if (req.file) {
            _context16.next = 4;
            break;
          }
          throw new Error("no image avatar");
        case 4:
          avatar = {
            path: path,
            filename: filename
          };
          _context16.next = 7;
          return _users["default"].findByIdAndUpdate(_id, {
            avatar: avatar
          }, {
            "new": true
          }).select("-password -refreshToken");
        case 7:
          user = _context16.sent;
          res.status(200).json({
            success: user ? true : false,
            user: user ? user : "update avatar false"
          });
        case 9:
        case "end":
          return _context16.stop();
      }
    }, _callee16);
  }));
  return function (_x29, _x30) {
    return _ref16.apply(this, arguments);
  };
}());