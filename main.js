var mongodb =  require('mongodb');
var mongoose = require('mongoose');

//Mongoose Connection
mongoose.connect('mongodb://localhost:27017/vs-nodejs-db'); // connect to our mongoDB database (uncomment after you enter in your own credentials in config/db.js)
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
    console.log("Connection succeeded.");
});


//Handle all request from server
const PORT=8080;
function handleRequest(request, response) {
    response.end('Es läuft: ' + request.url);


    //here we will save our data
    //New Artist
    var newArtist = new Artist({
        id: 0,
        vorname: "Einen wert",
        pob: "Einen wert",
        dob: "Einen wert",
        fave: "Einen Wert"
    });


    newArtist.save(function (error) {
        if (error) {
            console.error(error);
        }
    });


}