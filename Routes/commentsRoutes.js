const express = require("express");

const router = express.Router();
const protectedRoutes = require("../Middleware/authMiddleware");
const controller = new (require("../Controller/commentsController"))();
const path = require("../Helpers/path");

router.post(`${path.GET_COMMENT}/:id`, protectedRoutes, controller.getComment);
router.post(path.ADD_COMMENT, protectedRoutes, controller.addComment);
router.put(`${path.EDIT_COMMENT}/:id`, protectedRoutes, controller.editComment);
router.delete(
  `${path.DELETE_COMMENT}/:id`,
  protectedRoutes,
  controller.deleteComment
);

module.exports = router;
