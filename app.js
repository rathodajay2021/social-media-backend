const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { sequelize } = require("./Database/Schemas");
const pathUrl = require("./Helpers/path");
require("./Config/globals");

const app = express();
//data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'assets')));

app.use(cors());
const PORT = process.env.PORT || 5000;

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

app.use((req, res, next) => {
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

//server
app.listen({ port: PORT }, async () => {
  console.log(
    `server running on \nhttp://localhost:${PORT}${pathUrl.DEFAULT_URL}`
  );
  await sequelize.authenticate();
  console.log("database connected");
});

// --------------------------    ROUTES    ------------------
const appRoutes = require("./Routes");
appRoutes(app);

//show media file on browser
app.use("/assets/media", express.static("assets/media"));