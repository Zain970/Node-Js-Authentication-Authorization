const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./config/config.env" });
const connectDB = require("./config/db");

// Auth Routes
const authRoutes = require("./routes/authRoutes");
const {requireAuth, checkUser }= require("./middleware/authMiddleware");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");


// To every get request this
app.get("*",checkUser);

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/smoothies", requireAuth,(req, res) => {
  res.render("smoothies");
});

app.use(authRoutes);

app.get("/read-cookies")

const Start = async () => {
  await connectDB(process.env.MONGO_URI);

  console.log("Connected to the database successfully");

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(
      `Server listening on the port ${port} in ${process.env.NODE_ENV} mode`
    );
  });
};

Start();
