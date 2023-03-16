const deleteFile = require("../Helpers/mediaFile");
const { SERVER_PATH } = require("../Helpers/path");
const APIModel = new (require("../Models/post.model"))();

class postController {
  async getAllPost(req, res) {
    try {
      const response = await APIModel.getAllPostAPI();

      if (response) {
        res.handler.success(response);
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

      const response = await APIModel.getUserPostAPI(userId);

      if (response) {
        res.handler.success(response);
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
        tempMediaPath = result.dataValues.mediaPath.replace(SERVER_PATH, "");
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
          tempMediaPath = postResult[i].mediaPath.replace(SERVER_PATH, "");
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
