const { otp_data } = require("../Database/Schemas");

class otpModel {
  async getOTP(email) {
    return await otp_data.findOne({ where: { email } });
  }

  async createOTP(data) {
    return await otp_data.create(data);
  }

  async verifyOTP(email, otp) {
    return await otp_data.findOne({ where: { email, otp } });
  }

  async updateOTP(email, data) {
    return await otp_data.update(data, { where: { email } });
  }

  async deleteOTP(email) {
    return await otp_data.destroy({ where: { email } });
  }
}

module.exports = otpModel;
