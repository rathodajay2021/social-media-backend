const express = require("express");
const cors = require("cors");
const path = require('path');
require('dotenv').config()

const { sequelize } = require("./Models");
const pathUrl = require("./Helpers/path");

//routes
const userRoutes = require("./Routes/usersRotes");
const postRoutes = require("./Routes/postRoutes");
const friendsRoutes = require("./Routes/friendsRoutes")

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

//data parsing
app.use(express.json());
// app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.urlencoded({ extended: true }));

//server
app.listen({ port: PORT }, async () => {
  console.log(
    `server running on \nhttp://localhost:${PORT}${pathUrl.DEFAULT_URL}`
  );
  await sequelize.authenticate();
  console.log("database connected");
});

//api call
app.get(pathUrl.DEFAULT_URL, (req, res) => {
  //test api
  res.send("working just fine");
});

app.use(pathUrl.DEFAULT_URL, userRoutes);
app.use(pathUrl.DEFAULT_URL, postRoutes);
app.use(pathUrl.DEFAULT_URL, friendsRoutes);

//show media file on browser
app.use('/assets/media', express.static('assets/media'))