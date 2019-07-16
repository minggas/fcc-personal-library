/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

const mongoose = require("mongoose");
const collection = process.env.DB + "books";
const Book = require("../models/Book").Book;

mongoose.connect(collection + "?retryWrites=true", {
  useNewUrlParser: true,
  useCreateIndex: true,
});

module.exports = function(app) {
  app
    .route("/api/books")
    .get((req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      Book.find({}, (err, doc) => {
        if (err) console.log(err);
        const result = doc.map(book => {
          const { _id, title, comments } = book;
          const commentcount = comments.length;
          return { _id, title, commentcount };
        });
        res.status(200).json(result);
      });
    })

    .post((req, res) => {
      if (!req.body.title) {
        res.status(400).send("Please enter title");
      } else {
        const title = req.body.title;
        const newBook = new Book({ title });
        newBook
          .save()
          .then(result => {
            var { title, _id } = result;
            res.status(200).json({ title, _id });
          })
          .catch(err => {
            res.status(400).json(err);
          });
      }
    })

    .delete((req, res) => {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, del) => {
        if (err) res.status(503).send("could not delete ");
        res.status(200).send("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get((req, res) => {
      const bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, "_id title comments", (err, doc) => {
        if (err) {
          console.log(err);
        } else if (!doc) {
          res.status(500).send("no book exists");
        } else {
          res.status(200).json(doc);
        }
      });
    })

    .post((req, res) => {
      const bookid = req.params.id;
      const comment = req.body.comment;
      Book.findByIdAndUpdate(
        bookid,
        { $push: { comments: comment } },
        {
          useFindAndModify: false,
          select: "_id title comments",
          new: true,
          upsert: true,
        },
        (err, doc) => {
          if (err) console.log(err);
          res.status(200).json(doc);
        },
      );
    })

    .delete((req, res) => {
      const bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.deleteOne({ _id: bookid }, (err, result) => {
        if (err) res.status(500).send("error on delete");
        res.status(200).send("delete successful");
      });
    });
};
