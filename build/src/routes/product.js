"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var ctrl = _interopRequireWildcard(require("../controllers/product.js"));
var _verifyToken = require("../middlewares/verifyToken.js");
var _cloudinary = _interopRequireDefault(require("../configs/cloudinary.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var routes = _express["default"].Router();
routes.post("/", [_verifyToken.verifyToken, _verifyToken.isAdmin], ctrl.createProduct);
routes.get("/", [_verifyToken.verifyToken], ctrl.getProducts);
routes.put("/updateImages/:pid", [_verifyToken.verifyToken, _verifyToken.isAdmin], _cloudinary["default"].array("images", 5), ctrl.updateImages);
routes.put("/:pid", [_verifyToken.verifyToken, _verifyToken.isAdmin], ctrl.updateProduct);
routes.get("/:pid", [_verifyToken.verifyToken], ctrl.getProduct);
routes["delete"]("/:pid", [_verifyToken.verifyToken, _verifyToken.isAdmin], ctrl.deleteProduct);
var _default = exports["default"] = routes;