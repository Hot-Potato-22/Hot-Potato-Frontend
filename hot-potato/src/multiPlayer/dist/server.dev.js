"use strict";

var express = require('express');

var app = express();

var server = require('http').Server(app);

var io = require('socket.io')(server); // var io = require('socket.io');
// var server = http.createServer();
// server.listen(port, ipAddress);
// var socket = io.listen(server);
// var socket = new io.Socket();
// socket.connect('http://' + ipAddress + ':' + port);


var players = {};
var star = {
  x: Math.floor(Math.random() * 1350) + 50,
  y: Math.floor(Math.random() * 700) + 50
};
var starTwo = {
  x: Math.floor(Math.random() * 1350) + 50,
  y: Math.floor(Math.random() * 700) + 50
}; // var star3 = {
//   x: Math.floor(Math.random() * 1350) + 50,
//   y: Math.floor(Math.random() * 700) + 50
// };

var sandwich = {
  x: Math.floor(Math.random() * 1350) + 50,
  y: Math.floor(Math.random() * 700) + 50
};
var juice = {
  x: Math.floor(Math.random() * 1350) + 50,
  y: Math.floor(Math.random() * 700) + 50
};
var scores = {
  blue: 0,
  red: 0
};
app.use(express["static"](__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', function (socket) {
  console.log('a user connected'); // create a new player and add it to our players object

  players[socket.id] = {
    rotation: 0,
    x: Math.floor(Math.random() * 1350) + 50,
    y: Math.floor(Math.random() * 700) + 50,
    playerId: socket.id,
    team: Math.floor(Math.random() * 2) == 0 ? 'red' : 'blue'
  };
  potato = {
    rotation: 0,
    x: Math.floor(Math.random() * 1350) + 50,
    y: Math.floor(Math.random() * 700) + 50
  }; // send the players object to the new player

  socket.emit('currentPlayers', players); // send the star object to the new player

  socket.emit('starLocation', star);
  socket.emit('starTwoLocation', starTwo); //socket.emit('star3Location', star3);

  socket.emit('potatoLocation', potato);
  socket.emit('potatoMovement', potato); //setTimeout(() => {  

  socket.emit('sandwichLocation', sandwich); //}, 5000);

  socket.emit('juiceLocation', juice); // send the current scores

  socket.emit('scoreUpdate', scores); // update all other players of the new player

  socket.broadcast.emit('newPlayer', players[socket.id]); // when a player disconnects, remove them from our players object

  socket.on('disconnect', function () {
    console.log('user disconnected'); // remove this player from our players object

    delete players[socket.id]; // emit a message to all players to remove this player

    io.emit('disconnected', socket.id);
  }); // when a player moves, update the player data

  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].rotation = movementData.rotation; // emit a message to all players about the player that moved

    socket.broadcast.emit('playerMoved', players[socket.id]);
  }); // socket.on('potatoMovement', function (movementDataPotato) {
  //   potato.x = movementDataPotato.x;
  //   potato.y = movementDataPotato.y;
  //   potato.rotation = movementDataPotato.rotation;
  //   // emit a message to all players about the player that moved
  //   socket.broadcast.emit('potatoMoved', potato);
  // });

  socket.on('starCollected', function () {
    if (players[socket.id].team === 'red') {
      scores.red += 10;
    } else {
      scores.blue += 10;
    }

    star.x = Math.floor(Math.random() * 1350) + 50;
    star.y = Math.floor(Math.random() * 700) + 50;
    io.emit('starLocation', star);
    io.emit('scoreUpdate', scores);
  });
  socket.on('starTwoCollected', function () {
    if (players[socket.id].team === 'red') {
      scores.red += 10;
    } else {
      scores.blue += 10;
    }

    starTwo.x = Math.floor(Math.random() * 1350) + 50;
    starTwo.y = Math.floor(Math.random() * 700) + 50;
    io.emit('starTwoLocation', starTwo);
    io.emit('scoreUpdate', scores);
  }); // socket.on('star3Collected', function () {
  //   if (players[socket.id].team === 'red') {
  //     scores.red += 10;
  //   } else {
  //     scores.blue += 10;
  //   }
  //   star3.x = Math.floor(Math.random() * 1350) + 50;
  //   star3.y = Math.floor(Math.random() * 700) + 50;
  //   io.emit('star3Location', star);
  //   io.emit('scoreUpdate', scores);
  // });

  socket.on('potatoCollected', function () {
    // potato.touchPo = true
    // if(potato.touchPo == true){
    //     getPotato = true
    // }
    potato.x = Math.floor(Math.random() * 1350) + 50;
    potato.y = Math.floor(Math.random() * 700) + 50;
    io.emit('potatoLocation', potato);
  });
  socket.on('sandwichCollected', function () {
    // potato.touchPo = true
    // if(potato.touchPo == true){
    //     getPotato = true
    // }
    //setTimeout(() => {  
    sandwich.x = Math.floor(Math.random() * 1350) + 50;
    sandwich.y = Math.floor(Math.random() * 700) + 50;
    io.emit('sandwichLocation', sandwich); //}, 5000);
  });
  socket.on('juiceCollected', function () {
    juice.x = Math.floor(Math.random() * 1350) + 50;
    juice.y = Math.floor(Math.random() * 700) + 50;
    io.emit('juiceLocation', juice);
  });
}); //console.log(players)

server.listen(8082, function () {
  //console.log(players.length)
  console.log("Listening on ".concat(server.address().port));
});