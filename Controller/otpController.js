const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");

const { sendMail } = require("../Helpers/Utils");
const APIModel = new (require("../Models/otp.model"))();
const userAPIModel = new (require("../Models/users.model"))();

class otpController {
  createJsonToken(id) {
    return jwt.sign({ id }, global.secretKey, { expiresIn: global.tokenAge });
  }

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
            // const token = this.createJsonToken(userExist.id);
            await userAPIModel.updateUserByEmailAPI(
              { otpVerification: 1 },
              req?.body?.email
            );
            const token = jwt.sign({ id: userExist.id }, global.secretKey, {
              expiresIn: global.tokenAge,
            });
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

      const otpExist = await APIModel.getOTP(req.body.email);

      if (otpExist) {
        const response = await APIModel.updateOTP(req.body.email, otp);

        if (response) {
          const newOtp = await APIModel.getOTP(req.body.email);
          if (newOtp) {
            const htmlTemplate = await ejs.renderFile("Views/otpTemplate.ejs", {
              oneTimePassword: newOtp?.otp,
            });
            await sendMail(
              req.body.email,
              "user verification",
              null,
              htmlTemplate
            );
            res.handler.success(null, "otp send to successfully");
          }
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
          }, 300000);
        }
      }
    } catch (error) {
      res.handler.serverError();
    }
  }
}

module.exports = otpController;
