const APIModel = new (require("../Models/comments.model"))();

class commentsController {
  async getComment(req, res) {
    try {
      const { rows, count } = await APIModel.getCommentAPI(
        req.params.id,
        req.body
      );

      if (rows) {
        res.handler.success({ rows, count });
      }
    } catch (error) {
      res.handler.serverError();
    }
  }

  async addComment(req, res) {
    try {
      if (!req.body.comment.length) {
        return res.handler.badRequest("Empty comment are not allowed");
      }
      const response = await APIModel.addCommentAPI(req.body);

      if (response) {
        res.handler.success(response, "New comment added successfully");
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: commentsController.js:12 ~ commentsController ~ addComment ~ error:",
        error
      );
      res.handler.serverError();
    }
  }

  async editComment(req, res) {
    try {
      if (!req.body.comment.length) {
        return res.handler.badRequest("Empty comment are not allowed");
      }
      const response = await APIModel.editCommentAPI(req.params.id, req.body);

      if (response) {
        res.handler.success(response, "Comment updated successfully");
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: commentsController.js:28 ~ commentsController ~ editComment ~ error:",
        error
      );
      res.handler.serverError();
    }
  }

  async deleteComment(req, res) {
    try {
      const response = await APIModel.deleteCommentAPI(req.params.id);

      if (response) {
        res.handler.success(response, "Comment deleted successfully");
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: commentsController.js:44 ~ commentsController ~ deleteComment ~ error:",
        error
      );
      res.handler.serverError();
    }
  }
}

module.exports = commentsController;
