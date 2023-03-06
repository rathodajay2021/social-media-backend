const express = require("express");
const upload = require("../helpers/uploader");

const router = express.Router();
const controller = require("../controller/postController");
const path = require("../helpers/path");

// const uploadMiddleware = ;
router.get(path.GET_ALL_POST_URL, controller.getAllPost);
router.post(
  `${path.ADD_POST_URL}/:id`,
  upload.fields([{ name: "mediaData", maxCount: 5 }]),
  controller.addPost
);
router.delete(`${path.DELETE_POST_URL}/:id`, controller.deletePost);

module.exports = router;
