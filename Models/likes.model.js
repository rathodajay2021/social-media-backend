const { likes } = require("../Database/Schemas");

class likesModel {
  async addLikesAPI(data) {
    return await likes.create(data);
  }

  async getLikeCountAPI(postId) {
    return await likes.count({ where: { postId } });
  }

  async userLikedAPI(postId, userId) {
    return await likes.findOne({ where: { postId, userId } });
  }

  async removeLikesAPI(postId, userId) {
    return await likes.destroy({ where: { postId, userId } });
  }
}

module.exports = likesModel;
