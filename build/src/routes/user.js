"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var ctrl = _interopRequireWildcard(require("../controllers/user.js"));
var _verifyToken = require("../middlewares/verifyToken.js");
var _cloudinary = _interopRequireDefault(require("../configs/cloudinary.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var routes = _express["default"].Router();
routes.post('/register', ctrl.register);
routes.post('/finalRegister', ctrl.finalRegister);
routes.get('/login', ctrl.login);
routes.get('/logout', _verifyToken.verifyToken, ctrl.logout);
routes.get('/userCurrent', _verifyToken.verifyToken, ctrl.getUserCurrent);
routes.put('/', _verifyToken.verifyToken, ctrl.updateUser);
routes.post('/changePassword', ctrl.changePassword);
routes.get('/forgotPassword', ctrl.forgotPassword);
routes.get('/', [_verifyToken.verifyToken, _verifyToken.isAdmin], ctrl.getUsers);
routes.put('/updateCart', _verifyToken.verifyToken, ctrl.updateCart);
routes.put('/addProductCart', _verifyToken.verifyToken, ctrl.addProductCart);
routes.put('/updateAddress', _verifyToken.verifyToken, ctrl.updateAddress);
routes.put('/updateAvatar', _verifyToken.verifyToken, _cloudinary["default"].single("avatar"), ctrl.updateAvatar);
routes.put('/updateByAdmin/:uid', [_verifyToken.verifyToken, _verifyToken.isAdmin], ctrl.updateUserByAdmin);
routes["delete"]('/:uid', [_verifyToken.verifyToken, _verifyToken.isAdmin], ctrl.deleteUser);
var _default = exports["default"] = routes;