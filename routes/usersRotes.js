const express = require("express");

const router = express.Router();
const controller = require("../controller/usersController");
const path = require('../helpers/path')

router.post(path.LOGIN_URL, controller.loginUser)
router.post(path.SIGN_UP_URL, controller.createUser)
router.post(path.VERIFY_URL, controller.verifyUser)
router.put(path.RESET_PASSWORD_URL, controller.resetPassword)

module.exports = router;
