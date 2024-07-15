const Photo = require("../models/Photo");
const fs = require("fs");

//! ana sayfada en son yüklenen en başa gelsin diye sort() kullandık onu da dateCreated ile
//! sıraladık başına - koyduk
//? bütün fotoğrafları aldık
exports.getAllPhotos = async (req, res) => {
  const photos = await Photo.find({}).sort("-dateCreated");
  res.render("index", {
    photos,
  });
};

//! req.params ile "/photos/:id" burada gönderilen id'yi yakaladık
//? tek bir fotoğrafı aldık
exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("photo", {
    photo,
  });
};

// add.ejs action="/photos" yönlendirmesini burada yakalıyorum
exports.createPhoto = async (req, res) => {
  const uploadDir = "public/uploads";
  //!senkron kullanmamızın nedeni - önce dosya var mı yok mu kontrol et ondan sonra aşağıdaki işlemlere devam et
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  //!req.files ile yüklediğim göresel bilgilerine ulaşabilirim
  let uploadedImage = req.files.image;

  //! public klasörünün içinde upload şeklinde bir klasör olmasını istiyorum ve bu uploadPath yüklediğim resmin yolunu tutacak
  let uploadPath = __dirname + "/../public/uploads/" + uploadedImage.name;

  //! burda da yüklemesini istediğim klasöre mv-move edicek yani taşıyacak
  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadedImage.name,
    });
    res.redirect("/");
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + "/../public" + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndDelete(req.params.id);
  res.redirect("/");
};
