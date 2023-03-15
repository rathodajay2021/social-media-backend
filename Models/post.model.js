const { post_data, postMedia, users } = require("../Database/Schemas");

const getAllPostAPI = async () => {
  return await post_data.findAll({
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
  });
};

const getUserPostAPI = async (userId) => {
  return await users.findOne({
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
  });
};

const getUserFilesAPI = async (postId) => {
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
};

const addPostAPI = async (postTableData) => {
  return await post_data.create(postTableData);
};

const createPostMedia = async (MediaTableData) => {
  return await postMedia.create(MediaTableData);
};

const editPostAPI = async (tableData, id) => {
  return await post_data.update(tableData, { where: { id: id } });
};

const deletePostMediaAPI = async (mediaId) => {
  return await postMedia.destroy({ where: { id: mediaId } });
};

const destroyPostAPI = async (postId) => {
  return await post_data.destroy({ where: { id: postId } });
};

const findAllPostMediaAPI = async (id) => {
  return await postMedia.findAll({
    where: { postId: id },
  });
};

const findOneMediaAPI = async (id) => {
  return await postMedia.findOne({ where: { id } });
};

module.exports = {
  getAllPostAPI,
  getUserPostAPI,
  getUserFilesAPI,
  addPostAPI,
  createPostMedia,
  editPostAPI,
  deletePostMediaAPI,
  destroyPostAPI,
  findAllPostMediaAPI,
  findOneMediaAPI,
};
