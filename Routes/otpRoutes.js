const express = require('express')

const router = express.Router()
const path = require("../Helpers/path");
const controller = new (require('../Controller/otpController'))()

router.post(path.VERIFY_OTP, controller.verifyOTP)
router.post(path.RESEND_OTP, controller.resendOTP)

module.exports = router