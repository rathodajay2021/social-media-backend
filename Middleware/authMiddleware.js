const jwt = require("jsonwebtoken");

const protectedRoutes = (req, res, next) => {
  const token = req.headers["accesstoken"];

  if (token) {
    jwt.verify(token, global.secretKey, (err, decode) => {
      if (err) {
        res.status(401).json({message: 'invalid token'});
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({message: 'No token provided'});
  }
};

module.exports = protectedRoutes;
