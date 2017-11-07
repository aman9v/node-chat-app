/* jshint esversion:6 */
const path = require('path'); // doesn't require to be installed using npm
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public'); // instead of going up a directory, it simply adds the path to public folder.
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server); // returns a socketIO server and can listten/emit events
io.on("connection", (socket) => {
  console.log("new user connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});
// behind the scenes epxress uses a node module http to create this server
// Express on app.listen automatically calls the createServer method with the app
// web sockets are persistent in the sense that both client and the server keep the connection open
