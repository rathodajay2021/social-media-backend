const express = require("express");
const cors = require("cors");

const { sequelize } = require("./models");
const path = require("./helpers/path");
const userRoutes = require("./routes/usersRotes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

app.listen({ port: PORT }, async () => {
  console.log(`server running on \nhttp://localhost:${PORT}${path.DEFAULT_URL}`);
  await sequelize.authenticate();
  console.log("database connected");
});

app.get(path.DEFAULT_URL, (req, res) => {
    res.send('working just fine')
})

app.use(path.DEFAULT_URL, userRoutes);
