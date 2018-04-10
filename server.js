
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
})


app.get("/scrape", function (req, res) {
  var object = {};
  axios.get("https://www.sbnation.com/nba").then(function (response) {

    var $ = cheerio.load(response.data);

    $(".c-entry-box--compact__title").each(function (i, element) {
      object.title = $(this).text();
      object.link = $(this).children("a").text();

      db.Article.create(object)
        .then(function (dbArticle) {
        })
        .catch(function (err) {
          console.log(err)
        });
    })
    res.send("scrape complete")
  })
});

app.put("/save/:id", function(req, res){
  db.Article.update({ _id: req.params.id}, { saved: true }, { new: true })
  .then(function(update){
    res.send(update)
  })
})


app.use(express.static("public"));

app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:" + PORT);
});