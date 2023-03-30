const otpGenerator = require("otp-generator");

const APIModel = new (require("../Models/otp.model"))();

class otpController {
  async verifyOTP(req, res) {
    try {
      const response = await APIModel.verifyOTP(
        req?.body?.email,
        req?.body?.otp
      );

      if (response) {
        res.handler.success({ isVerified: true });
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: otpController.js:15 ~ otpController ~ verifyOtp ~ error:",
        error
      );
      res.handler.serverError();
    }
  }

  async resendOTP(req, res) {
    try {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
      });
      const response = await APIModel.updateOTP(req.body.email, otp);

      if (response) {
        console.log("🚀 ~ file: otpController.js:36 ~ otpController ~ resendOTP ~ response:", response)
        const newOtp = await APIModel.getOTP(req.body.email);
        newOtp && res.handler.success(newOtp);
      }
    } catch (error) {
      res.handler.serverError();
    }
  }
}

module.exports = otpController;
