const { users } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { SERVER_PATH } = require("../helpers/path");
const deleteFile = require("../helpers/mediaFile");

const secretKey = "openXcell";
const maxAge = 1 * 24 * 60 * 60; //in seconds

const createJsonToken = (id) => {
  return jwt.sign({ id }, secretKey, { expiresIn: maxAge });
};

const createUser = async (req, res) => {
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const Data = {
    firstName: req.body.firstName.trim(),
    lastName: req.body.lastName.trim(),
    email: req.body.email,
    password: hashPassword,
  };

  users
    .create(Data)
    .then((userResult) => {
      const token = createJsonToken(userResult.id);
      userResult.dataValues["accessToken"] = token;
      userResult.dataValues["isUserVerified"] = true;
      return res.json(userResult);
    })
    .catch((err) =>
      res.status(422).json({
        message: `${err.errors[0].message}, this mail id is already in use try another email`,
      })
    );
};

const loginUser = (req, res) => {
  users
    .findOne({ where: { email: req.body.email } })
    .then(async (result) => {
      if (result) {
        const auth = await bcrypt.compare(req.body.password, result.password);
        if (auth) {
          const token = createJsonToken(result.id);
          result.dataValues["accessToken"] = token;
          result.dataValues["isUserVerified"] = true;
          return res.json(result);
        } else {
          return res.json({ message: "Wrong password. Try again." });
        }
      } else {
        return res.json({ message: "In-valid email address" });
      }
    })
    .catch((err) => res.json(err));
};

const verifyUser = (req, res) => {
  users
    .findOne({ where: { email: req.body.email } })
    .then((result) => {
      if (result) {
        return res.json({ isUserVerified: true });
      } else {
        return res.json({ message: "In-valid email address" });
      }
    })
    .catch((err) => res.json(err));
};

const resetPassword = async (req, res) => {
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  users
    .update({ password: hashPassword }, { where: { email: req.body.email } })
    .then((result) => {
      if (result[0] === 1)
        return res.json({
          message: "Password reset successfully",
          isUserVerified: true,
        });

      res.json({ message: "Something went wrong" });
    })
    .catch((err) => res.json(err));
};

const editUserDetails = (req, res) => {
  const userId = req.params.id;
  const files = req.files;
  const data = {
    firstName: req.body?.firstName.trim(),
    lastName: req.body?.lastName.trim(),
    bio: req.body?.bio,
    dob: req.body?.dob,
  };

  if (!!files.coverPic) data["coverPic"] = SERVER_PATH + files.coverPic[0].path;
  if (!!files.profilePic)
    data["profilePic"] = SERVER_PATH + files.profilePic[0].path;

  if (req.body.coverPicUrl === "null") data["coverPic"] = null;
  if (req.body.profilePicUrl === "null") data["profilePic"] = null;

  // delete media if exist on new pic or delete of pic
  users
    .findOne({
      where: {
        id: userId,
      },
    })
    .then((userResult) => {
      if (
        userResult.coverPic &&
        (!!files.coverPic || req.body.coverPicUrl === "null")
      ) {
        tempMediaPath = userResult.coverPic.replace(SERVER_PATH, "");
        deleteFile(tempMediaPath);
      }
      if (
        userResult.profilePic &&
        (!!files.profilePic || req.body.profilePicUrl === "null")
      ) {
        tempMediaPath = userResult.profilePic.replace(SERVER_PATH, "");
        deleteFile(tempMediaPath);
      }
    })
    .catch((err) => console.log(err));

  // update user details
  users
    .update(data, {
      where: {
        id: userId,
      },
    })
    .then((result) => {
      if (result[0] === 1)
        return res.json({
          message: "user details updated successfully",
          isSuccess: true,
        });

      res.json({
        message: "something went wrong",
        isSuccess: false,
      });
    })
    .catch((err) => res.json(err));
};

module.exports = {
  createUser,
  loginUser,
  verifyUser,
  resetPassword,
  editUserDetails,
};
