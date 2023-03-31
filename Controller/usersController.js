const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const ejs = require("ejs");

const APIModel = new (require("../Models/users.model"))();
const otpAPIModel = new (require("../Models/otp.model"))();
const { SERVER_PATH } = require("../Helpers/path");
const deleteFile = require("../Helpers/mediaFile");

class userController {
  constructor() {
    this.loginUser = this.loginUser.bind(this);
    this.createUser = this.createUser.bind(this);
    this.sendMail = this.sendMail.bind(this);
  }

  createJsonToken(id) {
    return jwt.sign({ id }, global.secretKey, { expiresIn: global.tokenAge });
  }

  async sendMail(emailId, subject, message, html) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.senderEmailId,
        pass: process.env.senderEmailPass,
      },
    });

    await transporter.sendMail({
      // from: process.env.senderEmailId,
      to: `${emailId}`,
      subject: subject || "email testing",
      text: message || "yeeepp! it worked",
      html: html,
    });
  }

  async createUser(req, res) {
    try {
      const userExist = await APIModel.verifyUserAPI(req.body.email);

      if (userExist) {
        return res.handler.forbidden(
          "User with that email id already exist, Please try new email id"
        );
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      const Data = {
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        email: req.body.email,
        password: hashPassword,
      };

      const response = await APIModel.createUserAPI(Data);

      if (response) {
        //create otp
        const otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
          digits: true,
        });
        const otpData = {
          otp,
          email: req.body.email,
        };
        const otpResponse = await otpAPIModel.createOTP(otpData);
        if (otpResponse) {
          const htmlTemplate = await ejs.renderFile("Views/otpTemplate.ejs", {
            oneTimePassword: otpResponse?.otp,
          });
          this.sendMail(
            req.body.email,
            "user verification",
            null,
            htmlTemplate
          );
          //delete otp
          setTimeout(async () => {
            await otpAPIModel.deleteOTP(req.body.email);
          }, 300000);
        }

        res.handler.success(response, "New user created successfully");
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: usersController.js:42 ~ createUser ~ error:",
        error
      );
      res.handler.serverError();
    }
  }

  async loginUser(req, res) {
    try {
      const response = await APIModel.verifyUserAPI(req.body.email);

      if (response) {
        const auth = await bcrypt.compare(req.body.password, response.password);
        if (auth) {
          const token = this.createJsonToken(response.id);
          response.dataValues["accessToken"] = token;
          response.dataValues["isUserVerified"] = true;
          res.handler.success(response);
        } else {
          res.handler.notFound("Wrong password. Try again");
        }
      } else {
        res.handler.notFound("User not found");
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: usersController.js:68 ~ loginUser ~ error:",
        error
      );
      res.handler.serverError();
    }
  }

  async verifyUser(req, res) {
    try {
      const response = await APIModel.verifyUserAPI(req.body.email);

      if (response) {
        return res.handler.success({ response, isUserVerified: true });
      }
      res.handler.notFound("User not found");
    } catch (error) {
      console.log(
        "🚀 ~ file: usersController.js:82 ~ verifyUser ~ error:",
        error
      );
      res.handler.serverError();
    }
  }

  async resetPassword(req, res) {
    try {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      const response = await APIModel.resetPasswordAPI(
        req.body.email,
        hashPassword
      );

      if (response[0] === 1) {
        return res.handler.success(response, "Password reset successfully");
      }
      res.handler.serverError();
    } catch (error) {
      console.log(
        "🚀 ~ file: usersController.js:102 ~ resetPassword ~ error:",
        error
      );
      res.handler.serverError();
    }
  }

  async editUserDetails(req, res) {
    try {
      const userId = req.params.id;
      const files = req.files;
      const data = {
        firstName: req.body?.firstName.trim(),
        lastName: req.body?.lastName.trim(),
        bio: req.body?.bio,
        dob: req.body?.dob,
      };

      if (!!files.coverPic)
        data["coverPic"] = SERVER_PATH + files.coverPic[0].path;
      if (!!files.profilePic)
        data["profilePic"] = SERVER_PATH + files.profilePic[0].path;

      if (req.body.coverPicUrl === "null") data["coverPic"] = null;
      if (req.body.profilePicUrl === "null") data["profilePic"] = null;

      // delete media if exist on new pic or delete of pic
      const user = await APIModel.findUserAPI(userId);

      if (user) {
        if (
          user.coverPic &&
          (!!files.coverPic || req.body.coverPicUrl === "null")
        ) {
          const tempMediaPath = user.coverPic.replace(SERVER_PATH, "");
          deleteFile(tempMediaPath);
        }
        if (
          user.profilePic &&
          (!!files.profilePic || req.body.profilePicUrl === "null")
        ) {
          const tempMediaPath = user.profilePic.replace(SERVER_PATH, "");
          deleteFile(tempMediaPath);
        }
      }

      const response = await APIModel.updateUserAPI(data, userId);

      if (response[0] === 1) {
        return res.handler.success(
          { response, isSuccess: true },
          "user details updated successfully"
        );
      }

      res.handler.serverError();
    } catch (error) {
      console.log(
        "🚀 ~ file: usersController.js:163 ~ editUserDetails ~ error:",
        error
      );
      res.handler.serverError();
    }
  }

  async getUserData(req, res) {
    try {
      const response = await APIModel.getUserDataAPI(req.params.id);

      if (response) {
        res.handler.success(response);
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: usersController.js:192 ~ userController ~ getUserData ~ error:",
        error
      );
      res.handler.serverError();
    }
  }
}

module.exports = userController;
