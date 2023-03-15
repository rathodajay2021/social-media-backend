const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { sequelize } = require("./Database/Schemas");
const pathUrl = require("./Helpers/path");
require("./Config/globals");
//data parsing
const app = express();
app.use(cors());

app.use(express.json());
// app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const language = require("i18n");
language.configure({
  locales: ["en"],
  defaultLocale: "en",
  autoReload: true,
  directory: __dirname + "/Locales",
  queryParameter: "lang",
  objectNotation: true,
  syncFiles: true,
});
app.use(language.init); // MULTILINGUAL SETUP

//routes
const userRoutes = require("./Routes/usersRotes");
const postRoutes = require("./Routes/postRoutes");
const friendsRoutes = require("./Routes/friendsRoutes");

const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  // console.log("🚀 ~ file: app.js:28 ~ app.use ~ res:", res);
  const ResponseHandler = require("./Config/responseHandler");
  res.handler = new ResponseHandler(req, res);
  next();
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.handler.serverError(err);
});

//api call
// app.get(pathUrl.DEFAULT_URL, (req, res) => {
//   //test api
//   res.send("working just fine");
// });

app.use(pathUrl.DEFAULT_URL, userRoutes);
app.use(pathUrl.DEFAULT_URL, postRoutes);
app.use(pathUrl.DEFAULT_URL, friendsRoutes);

//show media file on browser
app.use("/assets/media", express.static("assets/media"));

//server
app.listen({ port: PORT }, async () => {
  console.log(
    `server running on \nhttp://localhost:${PORT}${pathUrl.DEFAULT_URL}`
  );
  await sequelize.authenticate();
  console.log("database connected");
});
