const { users } = require("../Database/Schemas");

const verifyUserAPI = async (email) => {
  return await users.findOne({ where: { email } });
};

const createUserAPI = async (data) => {
  return await users.create(data);
};

const resetPasswordAPI = async (email, hashPassword) => {
  return await users.update({ password: hashPassword }, { where: { email } });
};

const findUserAPI = async (id) => {
  return await users.findOne({ where: { id } });
};

const updateUserAPI = async (data, id) => {
  return await users.update(data, { where: { id } });
};

module.exports = {
  verifyUserAPI,
  createUserAPI,
  resetPasswordAPI,
  findUserAPI,
  updateUserAPI,
};
