const { post_data, postMedia, users } = require("../Database/Schemas");

class post {
  async getAllPostAPI(paginationInfo) {
    return await post_data.findAndCountAll({
      attributes: [["id", "postId"], "description", "createdAt"],
      include: [
        {
          model: postMedia,
          attributes: ["mediaPath", "mediaType"],
        },
        {
          model: users,
          attributes: [["id", "userId"], "firstName", "lastName", "profilePic"],
        },
      ],
      distinct: true,
      order: [["createdAt", "DESC"]],
      limit: paginationInfo.perPage,
      offset: paginationInfo.perPage * paginationInfo.page,
    });
  }

  async getUserPostAPI(userId, paginationInfo) {
    return await post_data.findAndCountAll({
      where: {
        userId
      },
      attributes: [["id", "postId"], "description", "createdAt"],
      include: {
        model: postMedia,
        attributes: ["mediaPath", "mediaType"],
      },
      // order: [[{ model: post_data }, "createdAt", "DESC"]],
      order: [["createdAt", "DESC"]],
      distinct: true,
      limit: paginationInfo.perPage,
      offset: paginationInfo.perPage * paginationInfo.page,
    });
  }

  async getUserFilesAPI(postId) {
    return await post_data.findOne({
      where: { id: postId },
      attributes: [["id", "postId"], "description", "createdAt"],
      include: [
        {
          model: postMedia,
          attributes: [["id", "mediaID"], "mediaPath", "mediaType"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async addPostAPI(postTableData) {
    return await post_data.create(postTableData);
  }

  async createPostMedia(MediaTableData) {
    return await postMedia.create(MediaTableData);
  }

  async editPostAPI(tableData, id) {
    return await post_data.update(tableData, { where: { id: id } });
  }

  async deletePostMediaAPI(mediaId) {
    return await postMedia.destroy({ where: { id: mediaId } });
  }

  async destroyPostAPI(postId) {
    return await post_data.destroy({ where: { id: postId } });
  }

  async findAllPostMediaAPI(id) {
    return await postMedia.findAll({
      where: { postId: id },
    });
  }

  async findOneMediaAPI(id) {
    return await postMedia.findOne({ where: { id } });
  }
}

module.exports = post;
