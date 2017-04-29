var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mime = require('mime');


var server = http.createServer(function(req, res)
{
    var uri = url.parse(req.url).pathname;
    if(uri === "/")
        uri = "index.html";

    var filename = path.join("/client",uri);
    //console.log(filename);
    //console.log(mime.lookup(filename));

    if(mime.lookup(filename) === "image/png")
    {
        fs.readFile(__dirname + filename, 'binary', function(error, content) {
            if(error) {
                res.writeHead(500);
                return res.end("Error loading page");
            }
            res.setHeader('content-type', mime.lookup(filename));
            res.write(content, "binary");
            res.end();
        });
    }
    else
    {
        fs.readFile(__dirname + filename, 'utf-8', function(error, content) {
            if(error) {
                res.writeHead(500);
                return res.end("Error loading page");
            }
            res.setHeader('content-type', mime.lookup(filename));
            res.writeHead(200);
            res.end(content);
        });
    }
});

var io = require('socket.io').listen(server);

var players = [];

io.sockets.on('connection', function (socket,pseudo) {

    // Gere les connexions des joueurs, et enregistre le pseudo dans la socket associée
    socket.on('pseudo', function(pseudo)
    {
        var player = { nickname : pseudo};
        players.push(player);
        socket.pseudo = pseudo;

        socket.emit('bonjour', "bonjour " + pseudo );
        console.log("connexion de : " + pseudo);
    });

    // Gere la déconnexion d'un joueur. Informe les autres joueurs de son départ
    socket.on("disconnect", function(){
        io.emit('disconnect', socket.pseudo + " s'est déconnecté");
        console.log("deconnexion de " + socket.pseudo);
    });

    socket.on('move', function (destination){
        io.emit('move', "le joueur déplace son unité en " + destination);
        console.log(socket.pseudo + " se déplace en " + destination);
    });


});


server.listen(8080);
