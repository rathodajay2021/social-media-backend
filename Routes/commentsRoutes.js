const express = require("express");

const router = express.Router();
const protectedRoutes = require("../Middleware/authMiddleware");
const controller = new (require("../Controller/commentsController"))();
const path = require("../Helpers/path");

router.post(path.ADD_COMMENT, protectedRoutes, controller.addComment);

module.exports = router;
