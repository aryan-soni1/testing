const express = require("express");
const router = express.Router();
const { signup, login, changePassword, sendOtp } = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/changePassword", changePassword);
router.post("/send-otp", sendOtp);

module.exports = router