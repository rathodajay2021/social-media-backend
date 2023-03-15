const express = require("express");

const router = express.Router();
const controller = require("../Controller/usersController");
const path = require("../Helpers/path");
const upload = require("../Helpers/uploader");
const protectedRoutes = require("../Middleware/authMiddleware");

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
