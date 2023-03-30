const { comments, users } = require("../Database/Schemas");
class commentsAPI {
  async getCommentAPI(postId, paginationInfo) {
    return await comments.findAndCountAll({
      where: { postId },
      attributes: [["id", "commentId"], "postId", "comment", "userId"],
      include: {
        model: users,
        attributes: [["id", "userId"], "firstName", "lastName", "profilePic"],
      },
      order: [["createdAt", "DESC"]],
      distinct: true,
      limit: paginationInfo.perPage,
      offset: paginationInfo.perPage * paginationInfo.page,
    });
  }

  async addCommentAPI(data) {
    return await comments.create(data);
  }

  async editCommentAPI(commentId, data) {
    return await comments.update(data, { where: { id: commentId } });
  }

  async getCommentCountAPI(postId) {
    return await comments.count({ where: { postId } });
  }

  async deleteCommentAPI(commentId) {
    return await comments.destroy({ where: { id: commentId } });
  }
}

module.exports = commentsAPI;
