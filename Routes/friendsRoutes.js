const express = require('express')

const router = express.Router()
const controller = new (require("../Controller/friendsController "))()
const path = require("../Helpers/path");
const protectedRoutes = require("../Middleware/authMiddleware");

router.get(`${path.FRIEND_LIST_URL}/:id`, protectedRoutes, controller.getFriendList)
router.get(`${path.USER_LIST_URL}/:id`, protectedRoutes, controller.getAllUserList)
router.post(path.ADD_FRIEND_URL, protectedRoutes, controller.addFriend)
router.delete(path.REMOVE_FRIEND_URL, protectedRoutes, controller.removeFriend)

module.exports = router