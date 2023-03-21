const express = require("express");

const controller = new (require("../Controller/likesController"))();
const path = require("../Helpers/path");
const router = express.Router();

router.post(path.ADD_LIKE, controller.addLikes);

module.exports = router
