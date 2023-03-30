const express = require("express");

const controller = new (require("../Controller/likesController"))();
const path = require("../Helpers/path");
const protectedRoutes = require("../Middleware/authMiddleware");
const router = express.Router();

router.post(path.ADD_LIKE, protectedRoutes, controller.addLikes);
router.delete(path.DELETE_LIKE, protectedRoutes, controller.removeLikes);

module.exports = router;
