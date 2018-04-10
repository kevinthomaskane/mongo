
var express = require("express");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var request = require("request");
var exphbs = require("express-handlebars");
var axios = require("axios");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


var PORT = 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  // useMongoClient: true
});

var db = require("./models");

app.get("/", function(req, res){
  db.Article.find({})
    .then(function(dbArticle) {
      console.log(dbArticle)
      res.render("index", {dbArticle: dbArticle});
    })
    .catch(function(err) {
      res.json(err);
    });
});


app.get("/scrape", function (req, res) {
  var object = {};
  axios.get("https://www.sbnation.com/nba").then(function (response) {

    var $ = cheerio.load(response.data);

    $(".c-entry-box--compact__title").each(function (i, element) {
      object.title = $(this).text().trim();
      object.link = $(this).children("a").text().trim();

      db.Article.create(object)
        .then(function (dbArticle) {
        })
        .catch(function (err) {
          console.log(err)
        });
    })
    res.send("scrape complete")
  });
});

app.put("/save/:id", function(req, res){
  db.Article.update({ _id: req.params.id}, { saved: true }, { new: true })
  .then(function(update){
    res.send(update)
  });
});

app.get("/saved", function(req, res){
  db.Article.find({saved: true})
  .then(function(dbArticle){
    console.log(dbArticle);
    res.render("saved", {dbArticle: dbArticle})
  });
});

app.post("/submitNote/:id", function(req, res){
  console.log(req.body)
  db.Note.create(req.body)
  .then(function(dbNote){
    console.log('this is dbNote in submit ', dbNote)
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    
  }).then(function(data){
    res.send("note created");
  })
    .catch(function(error){
    console.log(error);
  });
});

app.get("/getNotes/:id", function(req, res){
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      console.log("this is the db article in getNotes", dbArticle)
      res.json(dbArticle.note.body);
    })
    .catch(function(err) {
      res.json(err);
    });
})


app.use(express.static("public"));

app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:" + PORT);
});