/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
var collection = 'test';
var Book = require('../models/Book').Book;

mongoose.connect(process.env.DB + collection + "?retryWrites=true", {useNewUrlParser:true});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    
      Book.find({},(err, doc) => {
        if(err) console.log(err);
        const result = doc.map(book => {
          const {_id, title, comments} = book;
          const commentcount = comments.length;
          return {_id, title, commentcount}
    })
        res.status(200).json(result);        
      })
    })
    
    .post(function (req, res){
      if(!req.body.title) {
        res.status(400).send('Please enter title');
      } else {
        var title = req.body.title;
        var newBook = new Book({title});
        newBook.save().then(result => {
          var {title, _id} = result;
          res.status(200).json({title, _id});
        }).catch(err => {
          res.status(400).json(err);
        })    
      }        
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, del) => {
        if(err) res.status(503).send('could not delete ');
        res.status(200).send('delete successful');
      })      
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, '_id title comments', (err, doc) => {   
        if(err) {
          console.log(err);
        }else if(!doc){
          res.status(500).send('no book exists');
        }else{
          res.status(200).json(doc);
        }
      })
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
