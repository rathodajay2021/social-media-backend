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
          attributes: [["id", "userId"], "firstName", "lastName", "bio"],
        },
        {
          model: users,
          as: "userTwo",
          attributes: [["id", "userId"], "firstName", "lastName", "bio"],
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

  users
    .findAll({
      attributes: [["id", "userId"], "firstName", "lastName", "bio"],
    })
    .then((userResult) => {
      let arr = [];
      for (let index = 0; index < userResult.length; index++) {
        friends
          .findOne({
            where: {
              [Op.or]: [
                {
                  [Op.and]: [
                    { userId1: id },
                    { userId2: userResult[index].dataValues.userId },
                  ],
                },
                {
                  [Op.and]: [
                    { userId1: userResult[index].dataValues.userId },
                    { userId2: id },
                  ],
                },
              ],
            },
          })
          .then((friendResult) => {
            console.log("loop part", userResult[index].dataValues);
            arr.push({ ...userResult[index], isFriend: true });
          })
          .catch((err) => res.json(err));
      }
      res.json(arr);
    })
    .catch((err) => res.json(err));
};

const addFriend = (req, res) => {
  friends
    .create(req.body)
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};

const removeFriend = (req, res) => {
  friends
    .destroy({
      where: {
        [Op.and]: [
          { userId1: req.body.userId1 },
          { userId2: req.body.userId2 },
        ],
      },
    })
    .then((result) =>
      res.json({ result, message: "Friend is deleted successfully" })
    )
    .catch((err) => res.json(err));
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
