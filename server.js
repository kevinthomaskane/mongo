
var express = require("express");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var request = require("request");
var exphbs = require("express-handlebars");

var app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var PORT = 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  // useMongoClient: true
});

var db = require("./models");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("index", {})
})

app.get("/scrape", function(req, res){
  axios.get("https://www.sbnation.com/nba").then(function(response){
    
  var $ = cheerio.load(response.data);
  var object = {};

  $(".c-entry-box--compact__title").each(function(i, element){
    console.log("in there")
    object.title = $(this).text();
    object.link = $(this).children("a");

    db.Article.create(object)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
  })
  
  

  res.render("index", object);

  })
})

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});