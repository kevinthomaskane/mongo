
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app, db, express){

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
      res.render("saved", {dbArticle: dbArticle})
    });
  });
  
  app.post("/submitNote/:id", function(req, res){
    db.Note.create(req.body)
    .then(function(dbNote){
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
        res.json(dbArticle.note.body);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
  app.put("/deleteNote/:id", function(req, res){
    db.Article.findOneAndUpdate({_id: req.params.id}, {note: undefined})
    .then(function(response){
      console.log(response)
      res.json(response);
    });
  });
  
  app.use(express.static("public"));
  
}