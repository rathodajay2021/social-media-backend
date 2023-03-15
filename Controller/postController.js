const { post_data, postMedia, users } = require("../Database/Schemas");
const deleteFile = require("../Helpers/mediaFile");
const { SERVER_PATH } = require("../Helpers/path");

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
        order: [["createdAt", "DESC"]],
      },
    })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};

const getUserFiles = async (req, res) => {
  const postId = req.params.id;
  const response = await post_data.findOne({
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
  res.json(response);
};

const addPost = (req, res) => {
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

          postMedia
            .create(MediaTableData)
            .then((mediaResult) => console.log(mediaResult))
            .catch((error) => res.json(error));
        }
      }
      res.json({
        postResult,
        isSuccess: true,
        message: "New post added successfully",
      });
    })
    .catch((err) => console.log(err));
};

const editPost = async (req, res) => {
  const id = req.params.id;
  const files = req.files;

  const tableData = {
    description: req.body.description,
  };

  if (!files) {
    return res.status(422).json({
      message: "Attached file is invalid, Please attached valid file",
    });
  }

  const response = await post_data.update(tableData, { where: { id: id } });

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
        await postMedia.create(MediaTableData);
      }
    }
    
    res.json({
      response,
      isSuccess: true,
      message: "User post updated successfully",
    });
  }
};

const deletePostMedia = async (req, res, next) => {
  const mediaId = req.params.id;

  const response = await postMedia.destroy({ where: { id: mediaId } });

  if (response) {
    res.json({ response, message: "Media file deleted successfully" });
  }
};

const deletePost = (req, res, next) => {
  const id = req.params.id;

  //clear media files
  postMedia
    .findAll({
      where: { postId: id },
    })
    .then((postResult) => {
      if (!postResult) {
        return next(new Error("Media file not found"));
      }
      for (let i = 0; i < postResult.length; i++) {
        tempMediaPath = postResult[i].mediaPath.replace(SERVER_PATH, "");
        deleteFile(tempMediaPath);
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
  getUserFiles,
  addPost,
  editPost,
  deletePostMedia,
  deletePost,
};
