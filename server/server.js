/* jshint esversion:6 */
const path = require('path'); // doesn't require to be installed using npm
const http = require('http');
const express = require('express');
const socketIO = require('socket.io'); // exposes the serverAPI for handling all the requests coming to the server

const publicPath = path.join(__dirname, '../public'); // instead of going up a directory, it simply adds the path to public folder.
const port = process.env.PORT || 3000;


var app = express();
var server = http.createServer(app);
var io = socketIO(server); // returns a socketIO server and can listten/emit events
io.on("connect", (socket) => { // connect or connection
  console.log("new user connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

// socket.emit emits to a single connection whereas io.emit emits an event to every single connection
  socket.on("createMessage", (message) => {
    io.emit("newMessage", {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

 // emits or creates an event. since it is an event handler so wo don't specify any callback.

});


app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});
// behind the scenes epxress uses a node module http to create this server
// Express on app.listen automatically calls the createServer method with the app
// web sockets are persistent in the sense that both client and the server keep the connection open
// io.on is a special event and is used for server wide events like when a connection is established with the server.
