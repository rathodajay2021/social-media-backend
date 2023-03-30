const APIModel = new (require("../Models/likes.model"))();

class likesController {
  async addLikes(req, res) {
    try {
      const response = await APIModel.addLikesAPI(req.body);

      if (response) {
        res.handler.success(response);
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: likesController.js:12 ~ likesController ~ addLikes ~ error:",
        error
      );
      res.handler.serverError();
    }
  }

  async removeLikes(req, res) {
    try {
      const response = await APIModel.removeLikesAPI(
        req.body.postId,
        req.body.userId
      );

      if (response) {
        res.handler.success(response);
      }
    } catch (error) {
      console.log("🚀 ~ file: likesController.js:31 ~ likesController ~ removeLikes ~ error:", error)
      res.handler.serverError();
    }
  }
}

module.exports = likesController;
