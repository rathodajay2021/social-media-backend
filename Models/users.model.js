const { users } = require("../Database/Schemas");

class User {
  async verifyUserAPI(email) {
    return await users.findOne({ where: { email } });
  }

  async createUserAPI(data) {
    return await users.create(data);
  }

  async resetPasswordAPI(email, hashPassword) {
    return await users.update({ password: hashPassword }, { where: { email } });
  }

  async findUserAPI(id) {
    return await users.findOne({ where: { id } });
  }

  async updateUserAPI(data, id) {
    return await users.update(data, { where: { id } });
  }
}

module.exports = User;
