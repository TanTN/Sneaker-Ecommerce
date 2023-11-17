"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRefreshToken = exports.generateAccessToken = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _environment = require("../configs/environment.js");
var generateAccessToken = exports.generateAccessToken = function generateAccessToken(uid, role) {
  return _jsonwebtoken["default"].sign({
    _id: uid,
    role: role
  }, _environment.env.SECRET_KEY, {
    expiresIn: '3d'
  });
};
var generateRefreshToken = exports.generateRefreshToken = function generateRefreshToken(uid) {
  return _jsonwebtoken["default"].sign({
    _id: uid
  }, _environment.env.SECRET_KEY, {
    expiresIn: '7d'
  });
};