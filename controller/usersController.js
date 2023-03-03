const { users } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = "openXcell";
const maxAge = 1 * 24 * 60 * 60; //in seconds

const createJsonToken = (id) => {
  return jwt.sign({ id }, secretKey, { expiresIn: maxAge });
};

const createUser = async (req, res) => {
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashPassword;

  users
    .create(req.body)
    .then((userResult) => {
      const token = createJsonToken(userResult.id);
      userResult.dataValues["accessToken"] = token;
      userResult.dataValues["isUserVerified"] = true;
      return res.json(userResult);
    })
    .catch((err) => console.log(err));
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

module.exports = {
  createUser,
  loginUser,
  verifyUser,
  resetPassword,
};
