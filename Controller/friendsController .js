const { friends, users } = require("../Database/Schemas");
const { Op } = require("sequelize");
const ResponseHandler = require("../Config/responseHandler");

const getFriendList = async (req, res) => {
  const userId = req.params.id;
  const { count, rows } = await friends.findAndCountAll({
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
  if (rows) {
    let dataToSend = [];
    for (let index = 0; index < rows.length; index++) {
      if (rows[index].userId1 === parseInt(userId)) {
        dataToSend.push({
          ...rows[index].userTwo.dataValues,
          isFriend: true,
        });
      } else {
        dataToSend.push({
          ...rows[index].userOne.dataValues,
          isFriend: true,
        });
      }
    }
    res.json({ rows: dataToSend, count });
  }
};

const getAllUserList = async (req, res) => {
  try {
    // const API_RESPONSE = new ResponseHandler(req, res);

    const id = req.params.id;
    let finalData = [];

    const response = await users.findAll({
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

    if (response) {
      for (let index = 0; index < response.length; index++) {
        let tempObj = {
          userId: response[index].dataValues.id,
          firstName: response[index].dataValues.firstName,
          lastName: response[index].dataValues.lastName,
          bio: response[index].dataValues.bio,
          profilePic: response[index].dataValues.profilePic,
        };
        if (
          !!response[index].dataValues.userOne.length ||
          !!response[index].dataValues.userTwo.length
        ) {
          finalData.push({
            ...tempObj,
            isFriend: true,
          });
        } else {
          finalData.push({
            ...tempObj,
            isFriend: false,
          });
        }
      }

      res.handler.success(finalData);
      // res.json(finalData);
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: friendsController .js:110 ~ getAllUserList ~ error:",
      error
    );
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
