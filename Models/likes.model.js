const { likes } = require("../Database/Schemas");

class likesModel {
  async addLikesAPI(data) {
    return await likes.create(data);
  }
}

module.exports = likesModel;
