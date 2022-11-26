const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

//APP CONFIG
const app = express();
const port = process.env.PORT || 8000;
const dbUrl = process.env.CONNECTION_URL;

//MIDDLEWARE
app.use(cors());
app.use(express.json());

//DB CONNECTION
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => console.log("DB CONNECTED!!"));

//API ROUTES
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const commonRoutes = require("./routes/common");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/common", commonRoutes);

app.listen(port, () => console.log('SERVER RUNNING AT 8000'));