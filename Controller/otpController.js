const bcrypt = require("bcrypt");
const ejs = require("ejs");
// const otpGenerator = require("otp-generator");

const { sendMail, otpGeneration, createJsonToken } = require("../Helpers/Utils");
const APIModel = new (require("../Models/otp.model"))();
const userAPIModel = new (require("../Models/users.model"))();

class otpController {

  async verifyOTP(req, res) {
    try {
      if (!req?.body?.email) return res.handler.badRequest();

      const userExist = await userAPIModel.verifyUserAPI(req.body.email);

      if (userExist) {
        const auth = await bcrypt.compare(
          req.body.password,
          userExist.password
        );

        if (auth) {
          const response = await APIModel.verifyOTP(
            req?.body?.email,
            req?.body?.otp
          );

          if (response) {
            await userAPIModel.updateUserByEmailAPI(
              { otpVerification: 1 },
              req?.body?.email
            );
            const token = createJsonToken(userExist.id)
            userExist.dataValues["accessToken"] = token;
            userExist.dataValues["isUserVerified"] = true;
            res.handler.success(userExist);
          } else {
            res.handler.validationError();
          }
        } else {
          return res.handler.unauthorized();
        }
      } else {
        return res.handler.notFound("User not found");
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: otpController.js:53 ~ otpController ~ verifyOTP ~ error:",
        error
      );
      res.handler.serverError();
    }
  }

  async resendOTP(req, res) {
    try {
      const otp = otpGeneration()

      const otpExist = await APIModel.getOTP(req.body.email);

      if (otpExist) {
        const response = await APIModel.updateOTP(req.body.email, { otp });

        if (response) {
          const htmlTemplate = await ejs.renderFile("Views/otpTemplate.ejs", {
            oneTimePassword: otp,
          });
          await sendMail(
            req.body.email,
            "user verification",
            null,
            htmlTemplate
          );
          //delete otp
          setTimeout(async () => {
            await APIModel.deleteOTP(req.body.email);
          }, 60000);
          res.handler.success({}, "otp send to successfully");
        }
      } else {
        const otpData = {
          otp,
          email: req.body.email,
        };
        const otpResponse = await APIModel.createOTP(otpData);
        if (otpResponse) {
          const htmlTemplate = await ejs.renderFile("Views/otpTemplate.ejs", {
            oneTimePassword: otpResponse?.otp,
          });
          await sendMail(
            req.body.email,
            "user verification",
            null,
            htmlTemplate
          );
          //delete otp
          setTimeout(async () => {
            await APIModel.deleteOTP(req.body.email);
          }, 60000);
          res.handler.success({}, "otp send to successfully");
        }
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: otpController.js:104 ~ otpController ~ resendOTP ~ error:",
        error
      );
      res.handler.serverError();
    }
  }
}

module.exports = otpController;
