var WebSocketServer = require('websocket').server;
var http = require('http');
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
function handleRequest(request, response){
    response.end('Es läuft: ' + request.url);

    if(request=="create_/^"){
        //here we will save our data
        //New Artist
        var newArtist = new Artist({
            id:0,
            vorname: "Einen wert",
            pob: "Einen wert",
            dob: "Einen wert",
            fave:"Einen Wert"
        });


        newArtist.save(function(error) {
            if (error) {
                console.error(error);
            }
        });
    }

    //suchstring
    if(request=="search_/^"){
        searchString=request.substr(8,request.length);
        Artist.find({_id:searchString}, callback);
    }


}


//Create and Start a server
//Must be at the and, first we create our handle functions and than we start the server
var server = http.createServer(handleRequest);
server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    console.log("request");

    var connection = request.accept('abc', request.origin);


    /*Artist.find({}, function(err, artists) {
     if (err) throw err;
     var j = JSON.stringify(artists);
     console.log("stringyfied: "+ j)
     // object of all the users
     connection.send(j);

     });*/

    console.log('Connection accepted.');
    connection.on('message', function(message) {


        if (message.type === 'utf8' && message.match('create_/^')) {
            console.log('Received Message: ' + message.utf8Data);
            var artist = JSON.parse(message.utf8Data);

            var newArtist = new Artist({

                vorname: artist[0],
                pob: artist[1],
                dob: artist[2],
                fave: artist[4]

            });

            //Mongoose save function to save data
            newArtist.save(function(error) {
                if (error) {
                    console.error(error);
                }

                Artist.find({}, function(err, artists) {
                    if (err) throw err;
                    var j = JSON.stringify(artists);
                    // object of all the users
                    connection.send(j);

                });

            });

        }else {
            console.log('malformatted type of message');
        }
    });

    // Löschen, Suchen


    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});