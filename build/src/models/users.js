"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _crypto = _interopRequireDefault(require("crypto"));
// Erase if already required
// Erase if already required
// Erase if already required
// Declare the Schema of the Mongo model
var userSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    path: {
      type: String,
      "default": "https://th.bing.com/th/id/OIP.T5DKycaaS4zk2hul0woRWQHaHa?rs=1&pid=ImgDetMain"
    },
    filename: {
      type: String
    }
  },
  role: {
    type: String,
    "default": "User"
  },
  cart: [{
    product: {
      type: _mongoose["default"].Types.ObjectId,
      ref: "Product"
    },
    quantity: {
      type: Number
    },
    size: {
      type: Number
    },
    color: {
      type: String,
      "enum": ["Blue", "Green", "Yellow"],
      "default": "Yellow"
    }
  }],
  address: {
    type: String
  },
  isBlocked: {
    type: Boolean,
    "default": false
  },
  refreshToken: {
    type: String
  },
  passwordChangeAt: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: String
  }
}, {
  timestamps: true
});
userSchema.pre('save', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(next) {
    var salt, password;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log(this.isModified('password'));
          if (!this.isModified('password')) {
            next();
          }
          _context.next = 4;
          return _bcrypt["default"].genSaltSync(10);
        case 4:
          salt = _context.sent;
          _context.next = 7;
          return _bcrypt["default"].hash(this.password, salt);
        case 7:
          password = _context.sent;
          this.password = password;
        case 9:
        case "end":
          return _context.stop();
      }
    }, _callee, this);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
userSchema.methods = {
  isCorrectPassword: function () {
    var _isCorrectPassword = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(password) {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _bcrypt["default"].compare(password, this.password);
          case 2:
            return _context2.abrupt("return", _context2.sent);
          case 3:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this);
    }));
    function isCorrectPassword(_x2) {
      return _isCorrectPassword.apply(this, arguments);
    }
    return isCorrectPassword;
  }(),
  generatePasswordResetToken: function () {
    var _generatePasswordResetToken = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var token, passwordResetToken;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _crypto["default"].randomBytes(32).toString("hex");
          case 2:
            token = _context3.sent;
            _context3.next = 5;
            return _crypto["default"].createHash('sha256').update(token).digest("hex");
          case 5:
            passwordResetToken = _context3.sent;
            this.passwordResetToken = passwordResetToken;
            this.passwordResetExpires = Date.now() + 5 * 60 * 1000;
            return _context3.abrupt("return", token);
          case 9:
          case "end":
            return _context3.stop();
        }
      }, _callee3, this);
    }));
    function generatePasswordResetToken() {
      return _generatePasswordResetToken.apply(this, arguments);
    }
    return generatePasswordResetToken;
  }()
};

//Export the model
var _default = exports["default"] = _mongoose["default"].model('User', userSchema);