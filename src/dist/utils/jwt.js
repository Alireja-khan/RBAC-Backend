"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const generateJWT = (payload, expiresIn = "1h") => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn });
};
exports.generateJWT = generateJWT;
const verifyJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyJWT = verifyJWT;
