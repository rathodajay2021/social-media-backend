const deleteFile = require("../Helpers/mediaFile");
const { SERVER_PATH } = require("../Helpers/path");
const APIModel = new (require("../Models/post.model"))();
const likeAPIModel = new (require("../Models/likes.model"))();
const commentAPIModel = new (require("../Models/comments.model"))();

class postController {
  constructor() {
    this.addLikesData = this.addLikesData.bind(this);
  }

  async addLikesData(rows, userId) {
    try {
      const data = [];
      for (let index = 0; index < rows.length; index++) {
        const likesCount = await likeAPIModel.getLikeCountAPI(
          rows[index]?.dataValues?.postId
        );

        const userLiked = await likeAPIModel.userLikedAPI(
          rows[index]?.dataValues?.postId,
          userId
        );

        data.push({
          ...rows[index]?.dataValues,
          likesCount,
          userLiked: userLiked ? true : false,
        });
      }

      return data;
    } catch (error) {
      console.log(
        "🚀 ~ file: postController.js:26 ~ postController ~ addLikesData ~ error:",
        error
      );
      res.handler.serverError();
    }
  }

  async getAllPost(req, res) {
    try {
      const { rows, count } = await APIModel.getAllPostAPI(req.body, req.params.id);
      // const userId = req.params.id;
      // const postData = [];

      if (rows) {
        // const postData = await this.addLikesData(rows, userId)
        // for (let index = 0; index < rows.length; index++) {
          // const likesCount = await likeAPIModel.getLikeCountAPI(
          //   rows[index]?.dataValues?.postId
          // );

          // const commentCount = await commentAPIModel.getCommentCountAPI(
          //   rows[index]?.dataValues?.postId
          // );

          // const userLiked = await likeAPIModel.userLikedAPI(
          //   rows[index]?.dataValues?.postId,
          //   userId
          // );

          // postData.push({
            // ...rows[index]?.dataValues,
            // likesCount,
            // commentCount,
            // userLiked: userLiked ? true : false,
          // });
        // }
        res.handler.success({ rows, count });
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: postController.js:14 ~ getAllPost ~ error:",
        error
      );
      res.handler.serverError();
    }
  }

  async getUserPost(req, res) {
    try {
      const userId = req.params.id;
      const postData = [];

      const { rows, count } = await APIModel.getUserPostAPI(userId, req.body);

      if (rows) {
        for (let index = 0; index < rows.length; index++) {
          const likesCount = await likeAPIModel.getLikeCountAPI(
            rows[index]?.dataValues?.postId
          );

          const commentCount = await commentAPIModel.getCommentCountAPI(
            rows[index]?.dataValues?.postId
          );

          const userLiked = await likeAPIModel.userLikedAPI(
            rows[index]?.dataValues?.postId,
            userId
          );

          postData.push({
            ...rows[index]?.dataValues,
            likesCount,
            commentCount,
            userLiked: userLiked ? true : false,
          });
        }
        res.handler.success({ rows: postData, count });
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: postController.js:29 ~ getUserPost ~ error:",
        error
      );
      res.handler.serverError();
    }
  }

  async getUserFiles(req, res) {
    try {
      const postId = req.params.id;
      const response = await APIModel.getUserFilesAPI(postId);

      if (response) {
        res.handler.success(response);
      }
    } catch (error) {
      res.handler.serverError();
      console.log(
        "🚀 ~ file: postController.js:41 ~ getUserFiles ~ error:",
        error
      );
    }
  }

  async addPost(req, res) {
    try {
      const id = req.params.id;
      const files = req.files;

      const postTableData = {
        description: req.body.description,
        userId: id,
      };

      if (!files) {
        return res.handler.validationError(
          "Attached file is invalid, Please attached valid file"
        );
      }

      const postResult = await APIModel.addPostAPI(postTableData);

      if (postResult) {
        if (!!files?.mediaData) {
          for (let i = 0; i < files?.mediaData.length; i++) {
            let mediaType;

            if (
              files.mediaData[i].mimetype === "image/jpeg" ||
              files.mediaData[i].mimetype === "image/jpg" ||
              files.mediaData[i].mimetype === "image/png"
            ) {
              mediaType = "img";
            } else {
              mediaType = "video";
            }

            let MediaTableData = {
              postId: postResult.dataValues.id,
              mediaPath: SERVER_PATH + files.mediaData[i].path,
              mediaType,
            };

            await APIModel.createPostMedia(MediaTableData);
          }
        }

        res.handler.success(
          { postResult, isSuccess: true },
          "New post added successfully"
        );
      }
    } catch (error) {
      console.log("🚀 ~ file: postController.js:103 ~ addPost ~ error:", error);
      res.handler.serverError();
    }
  }

  async editPost(req, res) {
    try {
      const id = req.params.id;
      const files = req.files;

      const tableData = {
        description: req.body.description,
      };

      if (!files) {
        return res.handler.validationError(
          "Attached file is invalid, Please attached valid file"
        );
      }

      const response = await APIModel.editPostAPI(tableData, id);

      if (response) {
        if (!!files?.mediaData) {
          for (let i = 0; i < files?.mediaData.length; i++) {
            let mediaType;

            if (
              files.mediaData[i].mimetype === "image/jpeg" ||
              files.mediaData[i].mimetype === "image/jpg" ||
              files.mediaData[i].mimetype === "image/png" ||
              files.mediaData[i].mimetype === "img"
            ) {
              mediaType = "img";
            } else {
              mediaType = "video";
            }

            let MediaTableData = {
              postId: id,
              mediaPath: SERVER_PATH + files.mediaData[i].path,
              mediaType,
            };
            //add new media
            await APIModel.createPostMedia(MediaTableData);
          }
        }

        res.handler.success(
          { response, isSuccess: true },
          "User post updated successfully"
        );
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: postController.js:157 ~ editPost ~ error:",
        error
      );
      res.handler.serverError();
    }
  }

  async deletePostMedia(req, res, next) {
    try {
      const mediaId = req.params.id;

      const result = await APIModel.findOneMediaAPI(mediaId);

      if (result) {
        const tempMediaPath = result.dataValues.mediaPath.replace(
          SERVER_PATH,
          ""
        );
        deleteFile(tempMediaPath);
      }

      const response = await APIModel.deletePostMediaAPI(mediaId);

      if (response) {
        res.handler.success(response, "Media file deleted successfully");
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: postController.js:175 ~ deletePostMedia ~ error:",
        error
      );
      res.handler.serverError();
    }
  }

  async deletePost(req, res, next) {
    try {
      const id = req.params.id;

      //clear media files
      const postResult = await APIModel.findAllPostMediaAPI(id);

      if (!postResult) {
        return next(new Error("Media file not found"));
      }

      if (postResult) {
        for (let i = 0; i < postResult.length; i++) {
          const tempMediaPath = postResult[i].mediaPath.replace(
            SERVER_PATH,
            ""
          );
          deleteFile(tempMediaPath);
        }
      }

      const response = await APIModel.destroyPostAPI(id);

      if (response) {
        res.handler.success(response, "Your post deleted successfully");
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: postController.js:205 ~ deletePost ~ error:",
        error
      );
      res.handler.serverError();
    }
  }
}

module.exports = postController;
