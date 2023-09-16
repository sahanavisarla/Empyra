const express = require('express');
const path = require('path');
const app = express();
const mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
//const db = require('./db').getDb;
var MongoClient = mongodb.MongoClient;
let db;

// Initialize connection once
MongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, function (err, database) {
    if (err) return console.error(err);
    db = database.db("todoApp");
});

// Load view Engne
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// set middleware so that we can use parsed data from for or urls
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Handle get request or home route
app.get('/', (req, res) => {
    //Fetch data from database and display them here
    db.collection("todos").find({}, function (err, todosList) {
        if (err) throw err;
        todosList.toArray(function (err, todos) {
            res.render('index', { todos })
        });
    });
});



// Handle Add Post request on todo/add router
app.post('/todo/add', (req, res) => {
    //Add data to database using db connection that we created in db.js file
    db.collection('todos').insertOne({ todo: req.body.todo }, (err, result) => {
        if (err) {
            console.log('error in adding todo');
        }
        res.redirect('/');
    });
});















// Handle get request or home route
app.get('/todo/edit/:todoId', (req, res) => {
    //Fetch todoId  from database and display
    const o_id = new ObjectID(req.params.todoId);
    let whichOneToSelect = { "_id": o_id }
    db.collection('todos').findOne(whichOneToSelect, (err, todo) => {
        if (err) throw err;
        res.render('edit_todo', { todo });
    });

});











// Handle Update Post request on todo/add router
app.post('/todo/edit/:todoId', (req, res) => {
    //Update data to database using db connection that we created in db.js file
    const o_id = new ObjectID(req.params.todoId);

    var whereToUpdate = { "_id": o_id };
    var WhatToUpdate = { $set: { todo: req.body.todo } };
    db.collection('todos').updateOne(whereToUpdate, WhatToUpdate, (err, updatedTodo) => {
        if (err) throw err;
        res.redirect('/');
    });
});


// Handle Delete todo request
app.get('/todo/delete/:todoId', (req, res) => {
    const o_id = new ObjectID(req.params.todoId);
    var whereToDelete = { "_id": o_id };
    db.collection('todos').deleteOne(whereToDelete, (err, deletedTodo) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//start the server on port
app.listen(8080, (err) => {
    if (err) {
        console.log('error in listning...');
        return;
    }
    console.log('Server running on port 8080....');
});