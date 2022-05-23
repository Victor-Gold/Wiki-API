//Global constants
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

//Activate
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//Connect to the database
mongoose.connect("mongodb://localhost:27017/wikidb");

const articleSchema = ({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

const article = new Article({
  title: "Route",
  content: "a way or course taken in getting from a starting point to a destination."
});

article.save()

// article.save()

app.route("/articles")

  .post(function(req, res) {
    const articleTitle = req.body.title
    const articleContent = req.body.content

    const post = new Article({
      title: articleTitle,
      content: articleContent
    })
    post.save(function(err) {
      if (!err) {
        res.send("sucessfully saved new article")
      }
    })

  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("All items deleted sucessfully");
      } else {
        res.send(err)
      }
    })
  })

  .get(function(req, res) {
    Article.find({}, function(err, foundArticle) {
      if (!err) {
        res.send(foundArticle)

      } else {
        res.send(err);
      }
    })
  });

//DYMAMIC ROUTING AND ROUTE PARAMETERS
//CHAINING OF DYNAMIC ROUTES USED; 
//CHECK DOCUMENTATION OR ANKI STORAGE

app.route("/articles/:articleTitle")

  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle)
      } else {
        res.send(err)
      }
    })
  })

  .put(function(req, res) {

    const query = {
      title: req.body.title,
      content: req.body.content
    }

    Article.findOneAndUpdate({
        title: req.params.articleTitle
      }, query, {
        overwrite: true
      },

      function(err) {

        if (!err) {
          res.send("Successfully updated article.")
        }
      })
  })
  .patch(function(req, res) {

    Article.findOneAndUpdate({
      title: req.params.articleTitle
    }, {
      $set: req.body
    }, function(err) {
      if (!err) {
        res.send("Successfully updated")
      }
    })
  })
  .delete(function(req, res) {
    Article.findOneAndRemove({
        title: req.params.articleTitle
      }, function(err) {
        if (!err) {
          res.send("Successfully Deleted Article")
        } else {
          res.send(err)
        }
      }
    )
  })


//Set Port To Listen at 3000

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
