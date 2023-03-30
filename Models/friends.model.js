const { friends, users } = require("../Database/Schemas");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

class friend {
  async getFriendListAPI(userId) {
    return await friends.findAndCountAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
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
  }

  async getAllUserListAPI(id, paginationInfo) {
    return await users.findAndCountAll({
      where: {
        [Op.not]: { id: id },
        [Op.or]: [
          sequelize.where(
            sequelize.fn(
              "concat",
              sequelize.col("firstName"),
              " ",
              sequelize.col("lastName")
            ),
            {
              [Op.like]: "%" + paginationInfo.search + "%",
            }
          ),
          sequelize.where(
            sequelize.fn(
              "concat",
              sequelize.col("lastName"),
              " ",
              sequelize.col("firstName")
            ),
            {
              [Op.like]: "%" + paginationInfo.search + "%",
            }
          ),
        ],
      },
      attributes: ["id", "firstName", "lastName", "bio", "profilePic"],
      include: [
        {
          model: friends,
          as: "userOne",
          required: false,
          where: { receiverId: id },
        },
        {
          model: friends,
          as: "userTwo",
          required: false,
          where: { senderId: id },
        },
      ],
      distinct: true,
      limit: paginationInfo.perPage,
      offset: paginationInfo.perPage * paginationInfo.page,
    });
  }

  async addFriendAPI(data) {
    return await friends.create(data);
  }

  async removeFriendAPI(userId1, userId2) {
    return await friends.destroy({
      where: {
        [Op.and]: [{ senderId: userId1 }, { receiverId: userId2 }],
      },
    });
  }
}

module.exports = friend;
