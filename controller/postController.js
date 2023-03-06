const { post_data, postMedia } = require("../models");

const getAllPost = (req, res) => {
  post_data
    .findAll({
      attributes: ["id", "description"],
      include: [
        {
          model: postMedia,
          attributes: ["mediaPath", "mediaType"],
        },
      ],
    })
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
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
          mediaPath: files.mediaData[i].path,
          mediaType,
        };

        postMedia
          .create(MediaTableData)
          .then((mediaResult) => res.json(mediaResult))
          .catch((error) => res.json(error));
      }
      res.json(postResult);
    })
    .catch((err) => res.json(err));
};

const deletePost = (req, res) => {
  const id = req.params.id;

  post_data
    .destroy({ where: { id: id } })
    .then((result) =>
      res.json({ result, message: "Your post deleted successfully" })
    )
    .catch((err) => console.log(err));
};

module.exports = {
  getAllPost,
  addPost,
  deletePost,
};
