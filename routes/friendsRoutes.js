const express = require('express')

const router = express.Router()
const controller = require("../controller/friendsController ")
const path = require("../helpers/path");

router.get(`${path.FRIEND_LIST_URL}/:id`, controller.getFriendList)
router.get(`${path.USER_LIST_URL}/:id`, controller.getAllUserList)
router.post(path.ADD_FRIEND_URL, controller.addFriend)
router.delete(path.REMOVE_FRIEND_URL, controller.removeFriend)

module.exports = router