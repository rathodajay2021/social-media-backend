const { friends, users } = require("../Database/Schemas");
const { Op } = require("sequelize");

const getFriendListAPI = async (userId) => {
  return await friends.findAndCountAll({
    where: {
      [Op.or]: [{ userId1: userId }, { userId2: userId }],
    },
    include: [
      {
        model: users,
        as: "userOne",
        attributes: [
          ["id", "userId"],
          "firstName",
          "lastName",
          "bio",
          "profilePic",
        ],
      },
      {
        model: users,
        as: "userTwo",
        attributes: [
          ["id", "userId"],
          "firstName",
          "lastName",
          "bio",
          "profilePic",
        ],
      },
    ],
  });
};

const getAllUserListAPI = async (id) => {
  return await users.findAll({
    where: { [Op.not]: { id: id } },
    attributes: ["id", "firstName", "lastName", "bio", "profilePic"],
    include: [
      {
        model: friends,
        as: "userOne",
        required: false,
        where: { userId2: id },
      },
      {
        model: friends,
        as: "userTwo",
        required: false,
        where: { userId1: id },
      },
    ],
  });
};

const addFriendAPI = async (data) => {
  return await friends.create(data);
};

const removeFriendAPI = async (userId1, userId2) => {
  return await friends.destroy({
    where: {
      [Op.and]: [{ userId1: userId1 }, { userId2: userId2 }],
    },
  });
};

module.exports = {
  getFriendListAPI,
  getAllUserListAPI,
  addFriendAPI,
  removeFriendAPI,
};
