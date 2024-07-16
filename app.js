const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const methodOverride = require("method-override");
require("dotenv").config();

const ejs = require("ejs");

const photoController = require("./controllers/photoControllers");
const pageController = require("./controllers/pageControllers");

const app = express();

//connect DB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster.mskswzm.mongodb.net/?retryWrites=true&w=majority&appName=pcat-app-db`
  )
  .then(() => {
    console.log("DB CONNECTED!");
  })
  .catch((err) => {
    console.log(err);
  });

//Template Engine
app.set("view engine", "ejs");

//Middlewares
app.use(express.static("public"));
//! urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

//Routes
app.get("/", photoController.getAllPhotos);
app.get("/photos/:id", photoController.getPhoto);
app.post("/photos", photoController.createPhoto);
app.put("/photos/:id", photoController.updatePhoto);
app.delete("/photos/:id", photoController.deletePhoto);

app.get("/about", pageController.getAboutPage);
app.get("/add", pageController.getAddPage);
app.get("/photos/edit/:id", pageController.getEditPage);

//Sunucuda başlatma
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı...`);
});
