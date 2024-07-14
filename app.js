const express = require("express");
const mongoose = require("mongoose");

const ejs = require("ejs");
const path = require("path");

const Photo = require("./models/Photo");

const app = express();

//connect DB
mongoose.connect("mongodb://localhost/pcat-test-db");


//Template Engine
app.set("view engine", "ejs");

//Middlewares
app.use(express.static("public"));
//! urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.get("/", async (req, res) => {
  const photos = await Photo.find({})
  res.render("index", {
    photos
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/add", (req, res) => {
  res.render("add");
});

//! add.ejs action="/photos" yönlendirmesini burada yakalıyorum
app.post("/photos", async (req, res) => {
  await Photo.create(req.body);
  res.redirect("/");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı...`);
});
