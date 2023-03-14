const express = require('express')

const router = express.Router()
const controller = require("../controller/friendsController ")
const path = require("../helpers/path");
const protectedRoutes = require("../helpers/authMiddleware");

router.get(`${path.FRIEND_LIST_URL}/:id`, protectedRoutes, controller.getFriendList)
router.get(`${path.USER_LIST_URL}/:id`, protectedRoutes, controller.getAllUserList)
router.post(path.ADD_FRIEND_URL, protectedRoutes, controller.addFriend)
router.delete(path.REMOVE_FRIEND_URL, protectedRoutes, controller.removeFriend)

module.exports = router