const pathUrl = require("../Helpers/path");

module.exports = (app) => {
  app.get(pathUrl.DEFAULT_URL, (req, res) => {
    res.status(STATUS_CODES.SUCCESS).send("working just fine");
  });

  app.use(pathUrl.DEFAULT_URL, require("./usersRotes"));
  app.use(pathUrl.DEFAULT_URL, require("./postRoutes"));
  app.use(pathUrl.DEFAULT_URL, require("./friendsRoutes"));
  app.use(pathUrl.DEFAULT_URL, require("./likesRoutes"));
  app.use(pathUrl.DEFAULT_URL, require("./commentsRoutes"));
  app.use(pathUrl.DEFAULT_URL, require("./otpRoutes"));
};
