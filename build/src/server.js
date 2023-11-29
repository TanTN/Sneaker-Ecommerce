"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _express = _interopRequireDefault(require("express"));
var _compression = _interopRequireDefault(require("compression"));
var _morgan = _interopRequireDefault(require("morgan"));
var _helmet = _interopRequireDefault(require("helmet"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _cors = _interopRequireDefault(require("cors"));
var _dbConfig = require("./configs/db.config.js");
var _environment = require("./configs/environment.js");
var _index = _interopRequireDefault(require("./routes/index.js"));
var app = (0, _express["default"])();
var ON_SERVER = function ON_SERVER() {
  app.use((0, _cookieParser["default"])());
  // middleware
  // hiện thị thông tin và status gửi về
  app.use((0, _morgan["default"])("dev"));
  // ẩn đi nodejs trong response
  app.use((0, _helmet["default"])());
  // lén dữ liệu trong response
  app.use((0, _compression["default"])());
  app.use(_express["default"].json());
  app.use(_express["default"].urlencoded({
    extended: true
  }));
  app.use((0, _cors["default"])({
    origin: "*",
    methods: "GET,PUT,POST,DELETE",
    preflightContinue: false
  }));
  (0, _index["default"])(app);
  var PORT = _environment.env.APP_PORT || 6100;
  app.listen(PORT, function (err, res) {
    console.log("listening on port http://".concat(_environment.env.APP_HOST, ":").concat(PORT));
  });
};
// (async() => {
//     await CONNECT_DB()
//     ON_SERVER()
// })()
var onServer = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _dbConfig.CONNECT_DB)();
        case 2:
          ON_SERVER();
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function onServer() {
    return _ref.apply(this, arguments);
  };
}();
var _default = exports["default"] = onServer;