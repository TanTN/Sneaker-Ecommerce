"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _handleError = require("../middlewares/handleError.js");
var _user = _interopRequireDefault(require("./user.js"));
var _product = _interopRequireDefault(require("./product.js"));
var _brand = _interopRequireDefault(require("./brand.js"));
var _category = _interopRequireDefault(require("./category.js"));
var _order = _interopRequireDefault(require("./order.js"));
var routes = function routes(app) {
  app.use("/api/v1/user", _user["default"]);
  app.use("/api/v1/product", _product["default"]);
  app.use("/api/v1/category", _category["default"]);
  app.use("/api/v1/brand", _brand["default"]);
  app.use("/api/v1/order", _order["default"]);
  app.use(_handleError.notfound);
  app.use(_handleError.handleError);
};
var _default = exports["default"] = routes;