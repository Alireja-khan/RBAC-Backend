"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// Admin creates invite
router.post("/invite", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(["ADMIN"]), auth_controller_1.inviteUser);
// ✅ PUBLIC invite validation
router.get("/invite/:token", auth_controller_1.validateInvite);
// User registers via invite token
router.post("/register-via-invite", auth_controller_1.registerViaInvite);
// User login
router.post("/login", auth_controller_1.loginUser);
exports.default = router;
