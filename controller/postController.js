const { post_data, postMedia, users } = require("../models");
const deleteFile = require("../helpers/mediaFile");
const { SERVER_PATH } = require("../helpers/path");

const getAllPost = (req, res) => {
  post_data
    .findAll({
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
      order: [["createdAt", "DESC"]],
    })
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
};

const getUserPost = (req, res) => {
  const userId = req.params.id;

  users
    .findOne({
      where: {
        id: userId,
      },
      include: {
        model: post_data,
        attributes: [["id", "postId"], "description", "createdAt"],
        include: [
          {
            model: postMedia,
            attributes: ["mediaPath", "mediaType"],
          },
        ],
      },
      order: [["createdAt", "DESC"]],
    })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};

const addPost = (req, res, next) => {
  const id = req.params.id;
  const files = req.files;

  const postTableData = {
    description: req.body.description,
    userId: id,
  };

  if (!files) {
    return res.status(422).json({
      message: "Attached file is invalid, Please attached valid file",
    });
  }

  post_data
    .create(postTableData)
    .then((postResult) => {
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

        postMedia
          .create(MediaTableData)
          .then((mediaResult) => console.log(mediaResult))
          .catch((error) => res.json(error));
      }
      res.json({
        postResult,
        isSuccess: true,
        message: "New post added successfully",
      });
    })
    .catch((err) => res.json(err));
};

const deletePost = (req, res, next) => {
  const id = req.params.id;

  //clear media files
  postMedia
    .findAll({
      where: { postId: id },
    })
    .then((postResult) => {
      if(!postResult){
        return next(new Error('Media file not found'))
      }
      for (let i = 0; i < postResult.length; i++) {
        tempMediaPath = postResult[i].mediaPath.replace(SERVER_PATH,"")
        deleteFile(tempMediaPath)
      }
    })
    .catch((err) => res.json(err));

  //clear database
  post_data
    .destroy({ where: { id: id } })
    .then((result) =>
      res.json({ result, message: "Your post deleted successfully" })
    )
    .catch((err) => console.log(err));
};

module.exports = {
  getAllPost,
  getUserPost,
  addPost,
  deletePost,
};
