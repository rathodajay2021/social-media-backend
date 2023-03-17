const express = require("express");
const upload = require("../Helpers/uploader");

const router = express.Router();
const controller = new (require("../Controller/postController"))();
const path = require("../Helpers/path");
const protectedRoutes = require("../Middleware/authMiddleware");

// const uploadMiddleware = ;
router.post(path.GET_ALL_POST_URL, protectedRoutes, controller.getAllPost);
router.post(
  `${path.GET_USER_POST_URL}/:id`,
  protectedRoutes,
  controller.getUserPost
);
router.get(
  `${path.GET_USER_FILE_URL}/:id`,
  protectedRoutes,
  controller.getUserFiles
);
router.post(
  `${path.ADD_POST_URL}/:id`,
  protectedRoutes,
  upload.fields([{ name: "mediaData", maxCount: 5 }]),
  controller.addPost
);
router.put(
  `${path.EDIT_POST_URL}/:id`,
  protectedRoutes,
  upload.fields([{ name: "mediaData", maxCount: 5 }]),
  controller.editPost
);
router.delete(
  `${path.DELETE_POST_MEDIA_URL}/:id`,
  protectedRoutes,
  controller.deletePostMedia
);
router.delete(
  `${path.DELETE_POST_URL}/:id`,
  protectedRoutes,
  controller.deletePost
);

module.exports = router;
