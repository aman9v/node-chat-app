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
const {isRealString} = require('./utils/validation.js');
const {User} = require("./utils/users.js");
var users = new User();
const {generateMessage, generateLocationMessage} = require('./utils/message');
io.on("connect", (socket) => { // connect or connection
  console.log("new user connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name} left`)); //from admin to everyone connected to the room
    }
  });

  // io.emit -> io.to("CSRE GROUP").emit
  // socket.broadcast.emit -> socket.broadcast.to("CSRE GROUP").emit

// socket.emit emits to a single connection whereas io.emit emits an event to every single connection
//

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and Room name are required");
    }
    socket.join(params.room);
    users.removeUser(socket.id); // to ensure that there already is no user with this socket.id
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit("updateUserList", users.getUserList(params.room));
    socket.emit("newMessage", generateMessage('Aman', "Welcome to my chat app. Just type in a message to get started..."));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage("Admin", `${params.name} joined`));
    callback();
  });

  socket.on("createMessage", (message, callback) => {
    console.log(message);
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
        io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
    }
    callback(); // we could pass some arguments to the callback so that they are available inside of the callback sent on the client side.
    // socket.broadcast.emit("newMessage", { // the message gets broadcasted to every socket except for this one.
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

 // emits or creates an event. since it is an event handler so wo don't specify any callback.

 socket.on("createLocationMessage", (coordinates) => {
   var user = users.getUser(socket.id);
   if (user) {
     io.to(user.room).emit("newLocationMessage", generateLocationMessage(user.name, coordinates.latitude, coordinates.longitude));
   }
 });
});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});
// behind the scenes epxress uses a node module http to create this server
// Express on app.listen automatically calls the createServer method with the app
// web sockets are persistent in the sense that both client and the server keep the connection open
// io.on is a special event and is used for server wide events like when a connection is established with the server.

// Also, we have an option of sending some data back to the client. This can be facilitated by adding arguments to the sent callback which will
// be sent or populated by the server and can be used inside of the callback on the client side.
// To achieve acknowledgements, client sends a callback to the server saying send me an acknowledgement with some data (if any).
// The server in turn sends the ackknowledgement by invoking that callback this completes initiates the acknowledgement and
// could also be passed some data.
