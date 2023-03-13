const { friends, users } = require("../models");
const { Op } = require("sequelize");

const getFriendList = (req, res) => {
  const userId = req.params.id;
  friends
    .findAll({
      where: {
        [Op.or]: [{ userId1: userId }, { userId2: userId }],
      },
      include: [
        {
          model: users,
          as: "userOne",
          attributes: [["id", "userId"], "firstName", "lastName", "bio", "profilePic"],
        },
        {
          model: users,
          as: "userTwo",
          attributes: [["id", "userId"], "firstName", "lastName", "bio", "profilePic"],
        },
      ],
    })
    .then((result) => {
      let dataToSend = [];
      for (let index = 0; index < result.length; index++) {
        if (result[index].userId1 === parseInt(userId)) {
          dataToSend.push({
            ...result[index].userTwo.dataValues,
            isFriend: true,
          });
        } else {
          dataToSend.push({
            ...result[index].userOne.dataValues,
            isFriend: true,
          });
        }
      }
      res.json(dataToSend);
    })
    .catch((err) => res.json(err));
};

const getAllUserList = async (req, res) => {
  const id = req.params.id;
  let finalData = [];

  const response = await users.findAll({
    where: { [Op.not]: [{ id: id }] },
    attributes: [
      ["id", "userId"],
      "firstName",
      "lastName",
      "bio",
      "profilePic",
    ],
  });

  if (response) {
    for (let index = 0; index < response.length; index++) {
      const friendsResponseOne = await friends.findOne({
        where: {
          [Op.and]: [
            { userId1: id },
            { userId2: response[index].dataValues.userId },
          ],
        },
      });
      const friendsResponseTwo = await friends.findOne({
        where: {
          [Op.and]: [
            { userId1: response[index].dataValues.userId },
            { userId2: id },
          ],
        },
      });
      if (friendsResponseOne || friendsResponseTwo) {
        finalData.push({ ...response[index].dataValues, isFriend: true });
      } else {
        finalData.push({ ...response[index].dataValues, isFriend: false });
      }
    }
    res.json(finalData);
  }
};

const addFriend = (req, res) => {
  friends
    .create(req.body)
    .then((result) =>
      res.json({ result, message: "New friend added successfully" })
    )
    .catch((err) => res.json(err));
};

const removeFriend = async (req, res) => {
  const friendsListDeleteOne = await friends.destroy({
    where: {
      [Op.and]: [{ userId1: req.body.userId1 }, { userId2: req.body.userId2 }],
    },
  });

  if (friendsListDeleteOne) {
    return res.json({
      friendsListDeleteOne,
      message: "Un-friend successfully",
    });
  }

  const friendsListDeleteTwo = await friends.destroy({
    where: {
      [Op.and]: [{ userId1: req.body.userId2 }, { userId2: req.body.userId1 }],
    },
  });

  if (friendsListDeleteTwo) {
    return res.json({
      friendsListDeleteTwo,
      message: "Un-friend is deleted successfully",
    });
  }
};

module.exports = {
  getFriendList,
  getAllUserList,
  addFriend,
  removeFriend,
};

// SELECT
//   *
// FROM
//   `users` u
//   left outer join friends f on u.id = f.userId1
//   and f.userId2 = '2'
//   left outer join f2 on u.id = f2.userId2
//   and f2.userId1 = '2'
