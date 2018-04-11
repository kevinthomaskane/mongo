
var express = require("express");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var axios = require("axios");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


var PORT = 3000;

var databaseUri = "mongodb://localhost/mongoHeadlines";

if (process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGODB_URI)
} else {
  mongoose.connect(databaseUri)
}

var database = mongoose.connection;
var db = require("./models");

database.on('error', function(err){
  console.log("Mongoose Error: ", err);
});

database.once("open", function(){
  console.log("mongoose connection successful");
})

require("./routes/all.js")(app, db, express);

app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:" + PORT);
});