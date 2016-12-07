var mongodb =  require('mongodb');
var mongoose = require('mongoose');

//Mongoose Connection
mongoose.connect('mongodb://localhost:27017/vs-nodejs-db'); // connect to our mongoDB database (uncomment after you enter in your own credentials in config/db.js)
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
    console.log("Connection succeeded.");
});
