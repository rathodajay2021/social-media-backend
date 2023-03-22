const express = require("express");

const router = express.Router();
const controller = require("../controller/usersController");
const path = require("../helpers/path");
const upload = require("../helpers/uploader");
const protectedRoutes = require("../helpers/authMiddleware");

router.post(path.LOGIN_URL, controller.loginUser);
router.post(path.SIGN_UP_URL, controller.createUser);
router.post(path.VERIFY_URL, controller.verifyUser);
router.put(path.RESET_PASSWORD_URL, controller.resetPassword);
router.put(
  `${path.EDIT_USER_URL}/:id`,
  protectedRoutes,
  upload.fields([
    { name: "coverPic", maxCount: 1 },
    { name: "profilePic", maxCount: 1 },
  ]),
  controller.editUserDetails
);

module.exports = router;