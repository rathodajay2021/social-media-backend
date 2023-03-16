const APIModel = new (require("../Models/friends.model"))();

class friendsController {
  async getFriendList(req, res) {
    try {
      const userId = req.params.id;
      const { rows, count } = await APIModel.getFriendListAPI(userId);

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

        res.handler.success({ rows: dataToSend, count });
      }
    } catch (error) {
      res.handler.serverError();
      console.log(
        "🚀 ~ file: friendsController .js:9 ~ getFriendList ~ error:",
        error
      );
    }
  }

  async getAllUserList(req, res) {
    try {
      const id = req.params.id;
      let finalData = [];
      console.log(req.body.search)

      const { rows, count } = await APIModel.getAllUserListAPI(id, req.body);

      if (rows) {
        for (let index = 0; index < rows.length; index++) {
          let tempObj = {
            userId: rows[index].dataValues.id,
            firstName: rows[index].dataValues.firstName,
            lastName: rows[index].dataValues.lastName,
            bio: rows[index].dataValues.bio,
            profilePic: rows[index].dataValues.profilePic,
          };
          if (
            !!rows[index].dataValues.userOne.length ||
            !!rows[index].dataValues.userTwo.length
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

        res.handler.success({ rows: finalData, count });
      }
    } catch (error) {
      res.handler.serverError();
      console.log(
        "🚀 ~ file: friendsController .js:110 ~ getAllUserList ~ error:",
        error
      );
    }
  }

  async addFriend(req, res) {
    try {
      const response = await APIModel.addFriendAPI(req.body);

      if (response) {
        res.handler.success(response, "New friend added successfully");
      }
    } catch (error) {
      res.handler.serverError();
      console.log(
        "🚀 ~ file: friendsController .js:82 ~ addFriend ~ error:",
        error
      );
    }
  }

  async removeFriend(req, res) {
    try {
      const friendsListDeleteOne = await APIModel.removeFriendAPI(
        req.body?.senderId,
        req.body?.receiverId
      );

      if (friendsListDeleteOne) {
        return res.handler.success(
          friendsListDeleteOne,
          "Un-friend successfully"
        );
      }

      const friendsListDeleteTwo = await APIModel.removeFriendAPI(
        req.body?.receiverId,
        req.body?.senderId
      );

      if (friendsListDeleteTwo) {
        return res.handler.success(
          friendsListDeleteTwo,
          "Un-friend successfully"
        );
      }
    } catch (error) {
      res.handler.serverError();
      console.log(
        "🚀 ~ file: friendsController .js:84 ~ removeFriend ~ error:",
        error
      );
    }
  }
}

module.exports = friendsController;

// SELECT
//   *
// FROM
//   `users` u
//   left outer join friends f on u.id = f.userId1
//   and f.userId2 = '2'
//   left outer join f2 on u.id = f2.userId2
//   and f2.userId1 = '2'
